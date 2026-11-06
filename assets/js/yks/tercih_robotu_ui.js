/**
 * PRODİL - YKS Üniversite Tercih ve Puan Hesaplama Robotu Arayüz Yöneticisi (Faz 3)
 *
 * Görevleri:
 * 1. Öğrencinin girdiği TYT / AYT / YDT doğru-yanlış sayılarını ve OBP bilgilerini dinler,
 *    YKSCalculator ile anlık puan ve 2025 sıralama hesaplamalarını yapar.
 * 2. Hesaplanan 2025 sıralamasını ±%20 varsayılan marj ile YKSFilterEngine'e aktarır.
 * 3. Puan türü, şehir, üniversite türü, burs oranı, öğretim türü ve arama metni filtrelerini
 *    yöneterek sonuçları sayfalandırılmış (paginated) ve duyarlı (responsive) olarak listeler.
 * 4. 24 tercihlik ÖSYM Tercih Sepetini (ekleme, silme, sıra değiştirme, yazdırma/kopyalama) yönetir.
 */

(function () {
    'use strict';

    const TercihRobotuUI = {
        state: {
            selectedYear: '2025',
            activeExamTab: 'ydt', // 'ydt' | 'say' | 'ea' | 'soz'
            activeScoreType: 'DIL', // 'DIL' | 'SAY' | 'EA' | 'SOZ' | 'TYT'
            calcResult: null,
            filterParams: {
                puanTuru: 'DIL',
                hedefSiralama: 15000,
                marjYuzde: 20,
                customMarginActive: false,
                customMarginMinus: 20,
                customMarginPlus: 40,
                minSiralama: 12000,
                maxSiralama: 18000,
                tumSiralamalariGoster: false,
                dolmayanlariGoster: false,
                aramaMetni: '',
                sehirler: 'Tümü',
                uniTurleri: 'Tümü',
                bursTurleri: 'Tümü',
                ogretimTurleri: 'Tümü',
                bolumAdi: 'Tümü',
                siralamaKriteri: 'siralama_artan',
                sayfa: 1,
                sayfaBoyutu: 20
            },
            lastFilterResult: null,
            searchDebounceTimer: null,
            autoSyncRange: true // Hesaplama yapıldığında sıralama aralığını otomatik güncelle
        },

        /**
         * Sayfa yüklendiğinde tüm bileşenleri başlatır.
         */
        init: async function () {
            try {
                // 1. Hesaplama motorunu ve Meta veriyi yükle
                await Promise.all([
                    window.YKSCalculator.init('data/yks'),
                    window.YKSFilterEngine.loadMeta('data/yks')
                ]);

                // 2. Şehir ve Bölüm açılır listelerini doldur
                this.populateFilterDropdowns();

                // 3. Olay dinleyicilerini (Event Listeners) bağla
                this.bindEvents();

                // 4. Varsayılan başlangıç hesaplamasını ve filtrelemesini çalıştır
                this.recalculateFromInputs(true);
                this.updatePreferenceBadge();

                // 5. Preloader varsa gizle
                const preloader = document.getElementById('preloader');
                if (preloader) {
                    setTimeout(() => preloader.classList.add('hidden'), 250);
                }
            } catch (err) {
                console.error('Tercih Robotu başlatma hatası:', err);
                const preloader = document.getElementById('preloader');
                if (preloader) preloader.classList.add('hidden');
            }
        },

        /**
         * Sayıları Türkçe binlik ayraçlı formata çevirir (örn: 15002 -> "15.002").
         */
        formatNumber: function (num) {
            if (num === null || num === undefined || isNaN(num)) return '—';
            return Number(num).toLocaleString('tr-TR');
        },

        /**
         * Puanları 2 veya 3 ondalık basamakla formatlar.
         */
        formatScore: function (score, decimals = 2) {
            if (score === null || score === undefined || isNaN(score) || score <= 0) return '—';
            return Number(score).toLocaleString('tr-TR', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        },

        /**
         * Meta veriden Şehir ve Puan Türüne göre Bölüm dropdownlarını doldurur.
         */
        populateFilterDropdowns: function () {
            const meta = window.YKSFilterEngine.meta;
            if (!meta) return;

            const sehirSelect = document.getElementById('filter-sehir');
            if (sehirSelect && Array.isArray(meta.sehirler)) {
                const currentVal = sehirSelect.value || 'Tümü';
                sehirSelect.innerHTML = '<option value="Tümü">Tüm Şehirler (92)</option>';

                // Öncelikli popüler şehirler + Sakarya
                const oncelikli = ['Sakarya', 'İstanbul', 'Ankara', 'İzmir', 'Kocaeli', 'Bursa', 'Eskişehir', 'Antalya'];
                const optGroupPopuler = document.createElement('optgroup');
                optGroupPopuler.label = 'Öne Çıkan Şehirler';
                oncelikli.forEach(sehir => {
                    if (meta.sehirler.includes(sehir)) {
                        const opt = document.createElement('option');
                        opt.value = sehir;
                        opt.textContent = sehir === 'Sakarya' ? '⭐ Sakarya' : sehir;
                        optGroupPopuler.appendChild(opt);
                    }
                });
                sehirSelect.appendChild(optGroupPopuler);

                const optGroupTum = document.createElement('optgroup');
                optGroupTum.label = 'Tüm Şehirler (A-Z)';
                meta.sehirler.forEach(sehir => {
                    const opt = document.createElement('option');
                    opt.value = sehir;
                    opt.textContent = sehir;
                    optGroupTum.appendChild(opt);
                });
                sehirSelect.appendChild(optGroupTum);
                sehirSelect.value = currentVal;
            }

            this.populateDepartmentDropdown(this.state.activeScoreType);
        },

        /**
         * Aktif puan türüne göre benzersiz bölüm listesini doldurur.
         */
        populateDepartmentDropdown: function (puanTuru) {
            const meta = window.YKSFilterEngine.meta;
            const bolumSelect = document.getElementById('filter-bolum');
            if (!meta || !bolumSelect) return;

            const key = window.YKSFilterEngine.normalizeScoreType(puanTuru);
            const bolumler = meta.bolumler?.[key] || [];

            bolumSelect.innerHTML = `<option value="Tümü">Tüm Bölümler (${bolumler.length})</option>`;
            bolumler.forEach(bolum => {
                const opt = document.createElement('option');
                opt.value = bolum;
                opt.textContent = bolum;
                bolumSelect.appendChild(opt);
            });
        },

        /**
         * Tüm DOM event dinleyicilerini bağlar.
         */
        bindEvents: function () {
            // 1. Doğru / Yanlış inputları değiştiğinde anlık hesapla
            document.querySelectorAll('.yks-net-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    this.validateSubjectInputPair(e.target);
                    this.recalculateFromInputs(false);
                });
            });

            // 2. Diploma Notu ve Slider senkronizasyonu
            const dipInput = document.getElementById('obp-diploma-input');
            const dipSlider = document.getElementById('obp-diploma-slider');
            const kirikCheckbox = document.getElementById('obp-kirik-checkbox');

            if (dipInput && dipSlider) {
                dipInput.addEventListener('input', () => {
                    let val = Number(dipInput.value);
                    if (!isNaN(val)) {
                        dipSlider.value = Math.min(100, Math.max(50, val));
                    }
                    this.recalculateFromInputs(false);
                });
                dipSlider.addEventListener('input', () => {
                    dipInput.value = dipSlider.value;
                    this.recalculateFromInputs(false);
                });
            }
            if (kirikCheckbox) {
                kirikCheckbox.addEventListener('change', () => {
                    this.recalculateFromInputs(false);
                });
            }

            // 3. Alan Sınavı Sekmeleri (YDT / SAY / EA / SÖZ)
            document.querySelectorAll('[data-exam-tab]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tab = btn.getAttribute('data-exam-tab');
                    this.switchExamTab(tab);
                });
            });

            // 3b. Hesaplama Yılı Seçici Butonlar (2025 vb.)
            document.querySelectorAll('[data-calc-year]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const year = btn.getAttribute('data-calc-year');
                    this.selectCalculationYear(year);
                });
            });

            // 4. Hazır Örnek Öğrenci Profilleri
            document.querySelectorAll('[data-preset-profile]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const preset = btn.getAttribute('data-preset-profile');
                    this.applyPresetProfile(preset);
                });
            });

            // 5. Filtre Alanındaki Puan Türü Seçici Butonları
            document.querySelectorAll('[data-filter-score-type]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const pt = btn.getAttribute('data-filter-score-type');
                    this.selectFilterScoreType(pt, false);
                });
            });

            // 6. Hedef Sıralama, Marj Yüzdesi, Özel Marj Kutuları ve Min-Max Sıralama Girişleri
            const targetRankInput = document.getElementById('filter-target-rank');
            const marginSelect = document.getElementById('filter-margin-percent');
            const customMarginWrapper = document.getElementById('custom-margin-inputs-wrapper');
            const customMarginMinusInput = document.getElementById('filter-custom-margin-minus');
            const customMarginPlusInput = document.getElementById('filter-custom-margin-plus');
            const minRankInput = document.getElementById('filter-min-rank');
            const maxRankInput = document.getElementById('filter-max-rank');
            const showAllRanksCheckbox = document.getElementById('filter-all-ranks');
            const showUnfilledCheckbox = document.getElementById('filter-show-unfilled');

            if (targetRankInput) {
                targetRankInput.addEventListener('input', () => {
                    const rank = Math.max(1, Number(targetRankInput.value) || 0);
                    this.state.filterParams.hedefSiralama = rank;
                    this.updateMinMaxFromMargin(rank, this.state.filterParams.marjYuzde);
                    this.state.filterParams.sayfa = 1;
                    this.triggerFilterWithDebounce();
                });
            }

            if (marginSelect) {
                marginSelect.addEventListener('change', () => {
                    const val = marginSelect.value;
                    if (val === 'all') {
                        this.state.filterParams.customMarginActive = false;
                        if (customMarginWrapper) customMarginWrapper.classList.add('hidden');
                        this.state.filterParams.tumSiralamalariGoster = true;
                        if (showAllRanksCheckbox) showAllRanksCheckbox.checked = true;
                    } else if (val === 'custom') {
                        this.state.filterParams.customMarginActive = true;
                        this.state.filterParams.tumSiralamalariGoster = false;
                        if (showAllRanksCheckbox) showAllRanksCheckbox.checked = false;
                        if (customMarginWrapper) customMarginWrapper.classList.remove('hidden');
                        if (customMarginMinusInput) customMarginMinusInput.focus();
                        this.updateMinMaxFromMargin(
                            this.state.filterParams.hedefSiralama,
                            this.state.filterParams.marjYuzde
                        );
                    } else {
                        this.state.filterParams.customMarginActive = false;
                        if (customMarginWrapper) customMarginWrapper.classList.add('hidden');
                        this.state.filterParams.tumSiralamalariGoster = false;
                        if (showAllRanksCheckbox) showAllRanksCheckbox.checked = false;
                        this.state.filterParams.marjYuzde = Number(val) || 20;
                        this.updateMinMaxFromMargin(
                            this.state.filterParams.hedefSiralama,
                            this.state.filterParams.marjYuzde
                        );
                    }
                    if (this.state.calcResult) {
                        this.renderScoreCards(this.state.calcResult);
                    }
                    this.state.filterParams.sayfa = 1;
                    this.executeFilter();
                });
            }

            if (customMarginMinusInput && customMarginPlusInput) {
                const onCustomMarginInput = () => {
                    const minusPct = Math.min(100, Math.max(0, Number(customMarginMinusInput.value) || 0));
                    const plusPct = Math.min(500, Math.max(0, Number(customMarginPlusInput.value) || 0));
                    this.state.filterParams.customMarginMinus = minusPct;
                    this.state.filterParams.customMarginPlus = plusPct;
                    this.state.filterParams.customMarginActive = true;
                    this.state.filterParams.tumSiralamalariGoster = false;
                    if (showAllRanksCheckbox) showAllRanksCheckbox.checked = false;
                    this.updateMinMaxFromMargin(
                        this.state.filterParams.hedefSiralama,
                        this.state.filterParams.marjYuzde
                    );
                    if (this.state.calcResult) {
                        this.renderScoreCards(this.state.calcResult);
                    }
                    this.state.filterParams.sayfa = 1;
                    this.triggerFilterWithDebounce();
                };
                customMarginMinusInput.addEventListener('input', onCustomMarginInput);
                customMarginPlusInput.addEventListener('input', onCustomMarginInput);
            }

            if (minRankInput && maxRankInput) {
                const onCustomRangeChange = () => {
                    const minVal = minRankInput.value !== '' ? Number(minRankInput.value) : null;
                    const maxVal = maxRankInput.value !== '' ? Number(maxRankInput.value) : null;
                    this.state.filterParams.minSiralama = minVal;
                    this.state.filterParams.maxSiralama = maxVal;
                    this.state.filterParams.tumSiralamalariGoster = false;
                    if (showAllRanksCheckbox) showAllRanksCheckbox.checked = false;
                    this.state.filterParams.sayfa = 1;
                    this.triggerFilterWithDebounce();
                };
                minRankInput.addEventListener('input', onCustomRangeChange);
                maxRankInput.addEventListener('input', onCustomRangeChange);
            }

            if (showAllRanksCheckbox) {
                showAllRanksCheckbox.addEventListener('change', () => {
                    this.state.filterParams.tumSiralamalariGoster = showAllRanksCheckbox.checked;
                    this.state.filterParams.sayfa = 1;
                    this.executeFilter();
                });
            }

            if (showUnfilledCheckbox) {
                showUnfilledCheckbox.addEventListener('change', () => {
                    this.state.filterParams.dolmayanlariGoster = showUnfilledCheckbox.checked;
                    this.state.filterParams.sayfa = 1;
                    this.executeFilter();
                });
            }

            // 7. Arama Kutusu, Otomatik Tamamlama (Autocomplete) ve Dropdown Filtreleri
            const searchInput = document.getElementById('filter-search-input');
            const searchClearBtn = document.getElementById('filter-search-clear');
            const searchWrapper = document.getElementById('filter-search-wrapper');

            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    const val = searchInput.value;
                    this.state.filterParams.aramaMetni = val;
                    this.state.filterParams.sayfa = 1;
                    if (searchClearBtn) {
                        searchClearBtn.classList.toggle('hidden', val.trim().length === 0);
                    }
                    this.updateSearchAutocomplete(val);
                    this.triggerFilterWithDebounce(180);
                });

                searchInput.addEventListener('focus', () => {
                    if (searchInput.value.trim().length >= 2) {
                        this.updateSearchAutocomplete(searchInput.value);
                    }
                });

                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' || e.key === 'Enter') {
                        this.hideSearchAutocomplete();
                    }
                });
            }

            if (searchClearBtn && searchInput) {
                searchClearBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    searchClearBtn.classList.add('hidden');
                    this.state.filterParams.aramaMetni = '';
                    this.state.filterParams.sayfa = 1;
                    this.hideSearchAutocomplete();
                    this.executeFilter();
                    searchInput.focus();
                });
            }

            document.addEventListener('click', (e) => {
                if (searchWrapper && !searchWrapper.contains(e.target)) {
                    this.hideSearchAutocomplete();
                }
            });

            const dropdownMap = {
                'filter-sehir': 'sehirler',
                'filter-uni-tur': 'uniTurleri',
                'filter-burs': 'bursTurleri',
                'filter-ogretim': 'ogretimTurleri',
                'filter-bolum': 'bolumAdi',
                'filter-sort': 'siralamaKriteri'
            };

            for (const [elId, paramKey] of Object.entries(dropdownMap)) {
                const el = document.getElementById(elId);
                if (el) {
                    el.addEventListener('change', () => {
                        this.state.filterParams[paramKey] = el.value;
                        this.state.filterParams.sayfa = 1;
                        this.executeFilter();
                    });
                }
            }

            // 8. Filtreleri Sıfırla Butonu
            const resetFiltersBtn = document.getElementById('btn-reset-filters');
            if (resetFiltersBtn) {
                resetFiltersBtn.addEventListener('click', () => this.resetFilters());
            }
        },

        /**
         * Bir dersin Doğru + Yanlış toplamının soru sayısını aşmasını önler.
         */
        validateSubjectInputPair: function (changedInput) {
            const group = changedInput.closest('[data-subject-row]');
            if (!group) return;

            const maxSoru = Number(group.getAttribute('data-max-questions')) || 40;
            const dInput = group.querySelector('[data-input-type="d"]');
            const yInput = group.querySelector('[data-input-type="y"]');
            if (!dInput || !yInput) return;

            let d = Math.max(0, parseInt(dInput.value, 10) || 0);
            let y = Math.max(0, parseInt(yInput.value, 10) || 0);

            if (d > maxSoru) {
                d = maxSoru;
                dInput.value = d;
            }
            if (d + y > maxSoru) {
                if (changedInput === dInput) {
                    y = Math.max(0, maxSoru - d);
                    yInput.value = y;
                } else {
                    y = Math.max(0, maxSoru - d);
                    yInput.value = y;
                }
            }
        },

        /**
         * AYT / YDT ders giriş sekmeleri arasında geçiş yapar.
         */
        switchExamTab: function (tabName) {
            this.state.activeExamTab = tabName;

            // Sekme butonlarının stillerini güncelle
            document.querySelectorAll('[data-exam-tab]').forEach(btn => {
                const isTarget = btn.getAttribute('data-exam-tab') === tabName;
                if (isTarget) {
                    btn.className = 'exam-tab-btn active flex-1 py-2 px-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all bg-primary-900 text-white shadow-md';
                } else {
                    btn.className = 'exam-tab-btn flex-1 py-2 px-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all bg-gray-100 text-gray-600 hover:bg-gray-200';
                }
            });

            // İlgili ders satırlarını göster/gizle
            document.querySelectorAll('[data-exam-panel]').forEach(panel => {
                const panelGroup = panel.getAttribute('data-exam-panel');
                const visibleFor = panelGroup.split(',').map(s => s.trim());
                if (visibleFor.includes(tabName)) {
                    panel.classList.remove('hidden');
                } else {
                    panel.classList.add('hidden');
                }
            });

            // Sekmeye karşılık gelen puan türünü aktif yap (sayfayı aşağı kaydırmadan)
            const tabToScoreType = {
                ydt: 'DIL',
                say: 'SAY',
                ea: 'EA',
                soz: 'SOZ',
                tyt: 'TYT'
            };
            if (tabToScoreType[tabName]) {
                this.selectFilterScoreType(tabToScoreType[tabName], false);
            }
        },

        /**
         * Tahmini puan ve sıralama hesaplama yılını değiştirir (2025 ve ileride eklenecek yıllar).
         */
        selectCalculationYear: function (year) {
            if (!year) return;
            this.state.selectedYear = String(year);

            document.querySelectorAll('[data-calc-year]').forEach(btn => {
                const isTarget = btn.getAttribute('data-calc-year') === String(year);
                if (isTarget) {
                    btn.className = 'calc-year-btn active px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all bg-primary-900 text-white shadow-sm';
                } else {
                    btn.className = 'calc-year-btn px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all bg-gray-100 text-gray-600 hover:bg-gray-200';
                }
            });

            this.recalculateFromInputs(true);
        },

        /**
         * Hazır örnek öğrenci profillerini (YDT, SAY, EA, SÖZ veya Sıfırlama) doldurur.
         */
        applyPresetProfile: function (preset) {
            // Önce tüm inputları sıfırla
            document.querySelectorAll('.yks-net-input').forEach(inp => { inp.value = ''; });

            const setSubject = (section, key, d, y) => {
                const row = document.querySelector(`[data-subject-row="${section}.${key}"]`);
                if (!row) return;
                const dInp = row.querySelector('[data-input-type="d"]');
                const yInp = row.querySelector('[data-input-type="y"]');
                if (dInp) dInp.value = d > 0 ? d : '';
                if (yInp) yInp.value = y > 0 ? y : '';
            };

            const dipInput = document.getElementById('obp-diploma-input');
            const dipSlider = document.getElementById('obp-diploma-slider');
            const kirikCheckbox = document.getElementById('obp-kirik-checkbox');

            if (preset === 'clear') {
                if (dipInput) dipInput.value = 80;
                if (dipSlider) dipSlider.value = 80;
                if (kirikCheckbox) kirikCheckbox.checked = false;
                this.recalculateFromInputs(true);
                return;
            }

            if (preset === 'dil') {
                setSubject('tyt', 'turkce', 31, 4);
                setSubject('tyt', 'sosyal', 15, 3);
                setSubject('tyt', 'matematik', 14, 4);
                setSubject('tyt', 'fen', 7, 2);
                setSubject('ydt', 'yabanciDil', 66, 8);
                if (dipInput) dipInput.value = 86;
                if (dipSlider) dipSlider.value = 86;
                if (kirikCheckbox) kirikCheckbox.checked = false;
                this.switchExamTab('ydt');
            } else if (preset === 'say') {
                setSubject('tyt', 'turkce', 32, 4);
                setSubject('tyt', 'sosyal', 15, 3);
                setSubject('tyt', 'matematik', 30, 4);
                setSubject('tyt', 'fen', 16, 2);
                setSubject('ayt', 'matematik', 28, 4);
                setSubject('ayt', 'fizik', 10, 2);
                setSubject('ayt', 'kimya', 10, 2);
                setSubject('ayt', 'biyoloji', 10, 2);
                if (dipInput) dipInput.value = 88;
                if (dipSlider) dipSlider.value = 88;
                if (kirikCheckbox) kirikCheckbox.checked = false;
                this.switchExamTab('say');
            } else if (preset === 'ea') {
                setSubject('tyt', 'turkce', 33, 4);
                setSubject('tyt', 'sosyal', 16, 2);
                setSubject('tyt', 'matematik', 22, 4);
                setSubject('tyt', 'fen', 6, 2);
                setSubject('ayt', 'matematik', 21, 4);
                setSubject('ayt', 'edebiyat', 19, 3);
                setSubject('ayt', 'tarih1', 7, 1);
                setSubject('ayt', 'cografya1', 5, 0);
                if (dipInput) dipInput.value = 85;
                if (dipSlider) dipSlider.value = 85;
                if (kirikCheckbox) kirikCheckbox.checked = false;
                this.switchExamTab('ea');
            } else if (preset === 'soz') {
                setSubject('tyt', 'turkce', 34, 4);
                setSubject('tyt', 'sosyal', 17, 2);
                setSubject('tyt', 'matematik', 10, 2);
                setSubject('tyt', 'fen', 4, 0);
                setSubject('ayt', 'edebiyat', 20, 2);
                setSubject('ayt', 'tarih1', 8, 1);
                setSubject('ayt', 'cografya1', 5, 1);
                setSubject('ayt', 'tarih2', 8, 2);
                setSubject('ayt', 'cografya2', 9, 1);
                setSubject('ayt', 'felsefe', 9, 2);
                setSubject('ayt', 'din', 5, 0);
                if (dipInput) dipInput.value = 84;
                if (dipSlider) dipSlider.value = 84;
                if (kirikCheckbox) kirikCheckbox.checked = false;
                this.switchExamTab('soz');
            }

            this.recalculateFromInputs(true);
        },

        /**
         * Formdaki tüm Doğru/Yanlış ve OBP girdilerini okuyarak YKSCalculator'ı çalıştırır.
         */
        recalculateFromInputs: function (forceFilterUpdate = false) {
            const inputPayload = {
                tyt: {},
                ayt: {},
                ydt: {},
                obp: {
                    diplomaNotu: Number(document.getElementById('obp-diploma-input')?.value) || 80,
                    kirikObp: Boolean(document.getElementById('obp-kirik-checkbox')?.checked)
                },
                marjYuzde: this.state.filterParams.marjYuzde
            };

            document.querySelectorAll('[data-subject-row]').forEach(row => {
                const pathKey = row.getAttribute('data-subject-row'); // örn: "tyt.turkce"
                const [section, subjKey] = pathKey.split('.');
                const d = Number(row.querySelector('[data-input-type="d"]')?.value) || 0;
                const y = Number(row.querySelector('[data-input-type="y"]')?.value) || 0;
                if (inputPayload[section]) {
                    inputPayload[section][subjKey] = { d, y };
                }
            });

            const calcResult = window.YKSCalculator.calculateAll(inputPayload);
            this.state.calcResult = calcResult;

            // 1. Ders satırlarındaki Net ve 2025 Türkiye Ortalaması rozetlerini güncelle
            this.updateSubjectNetBadges(calcResult);

            // 2. OBP Özet bilgisini güncelle
            const obpInfoEl = document.getElementById('obp-summary-badge');
            if (obpInfoEl) {
                const ekPuanStr = Number(calcResult.obp.ekPuan).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                obpInfoEl.textContent = `OBP: ${calcResult.obp.obp} (+${ekPuanStr})`;
            }

            // 3. Puan ve Sıralama Sonuç Kartlarını güncelle
            this.renderScoreCards(calcResult);

            // 4. Aktif puan türünün sıralaması değiştiyse filtreleme motorunu senkronize et
            const activePt = this.state.activeScoreType;
            const activeScoreObj = calcResult.puanlar[activePt];

            if (activeScoreObj && activeScoreObj.hesaplandi && activeScoreObj.yerlestirmeSira) {
                this.state.filterParams.hedefSiralama = activeScoreObj.yerlestirmeSira;
                const targetRankInput = document.getElementById('filter-target-rank');
                if (targetRankInput) targetRankInput.value = activeScoreObj.yerlestirmeSira;

                this.updateMinMaxFromMargin(activeScoreObj.yerlestirmeSira, this.state.filterParams.marjYuzde);
            }

            if (forceFilterUpdate) {
                this.executeFilter();
            } else {
                this.triggerFilterWithDebounce(150);
            }
        },

        /**
         * Her ders satırının yanındaki Net sayısını ve 2025 Türkiye Ortalaması farkını günceller.
         */
        updateSubjectNetBadges: function (calcResult) {
            const sections = ['tyt', 'ayt', 'ydt'];
            sections.forEach(sec => {
                const secObj = calcResult.netler[sec] || {};
                for (const [subjKey, meta] of Object.entries(secObj)) {
                    const row = document.querySelector(`[data-subject-row="${sec}.${subjKey}"]`);
                    if (!row) continue;

                    const netEl = row.querySelector('[data-net-display]');
                    if (netEl) {
                        netEl.textContent = meta.net.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    }

                    const avgEl = row.querySelector('[data-avg-badge]');
                    if (avgEl) {
                        const fark = meta.ortalamaFarki;
                        const trOrt = meta.turkiyeOrtalamasi.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                        const farkStr = Math.abs(fark).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
                        if (meta.dogru === 0 && meta.yanlis === 0) {
                            avgEl.className = 'text-[11px] text-gray-400 font-medium whitespace-nowrap';
                            avgEl.textContent = `TR Ort: ${trOrt}`;
                        } else if (fark >= 0) {
                            avgEl.className = 'text-[11px] text-emerald-600 font-semibold whitespace-nowrap';
                            avgEl.textContent = `TR Ort: ${trOrt} (+${farkStr})`;
                        } else {
                            avgEl.className = 'text-[11px] text-amber-600 font-medium whitespace-nowrap';
                            avgEl.textContent = `TR Ort: ${trOrt} (-${farkStr})`;
                        }
                    }
                }
            });

            // Toplam Net Rozetleri
            const tytTotalEl = document.getElementById('tyt-total-net-badge');
            if (tytTotalEl) {
                tytTotalEl.textContent = `${calcResult.netler.toplamlar.tytToplamNet.toLocaleString('tr-TR')} / 120 Net`;
            }
        },

        /**
         * 5 puan türü (DİL, SAY, EA, SÖZ, TYT) için Puan ve Sıralama kartlarını oluşturur.
         */
        renderScoreCards: function (calcResult) {
            const container = document.getElementById('score-cards-container');
            if (!container) return;

            const order = ['DIL', 'TYT', 'SAY', 'EA', 'SOZ'];
            const scoreLabels = {
                DIL: 'YDT Puanınız',
                TYT: 'TYT Puanınız',
                SAY: 'SAY Puanınız',
                EA: 'EA Puanınız',
                SOZ: 'SÖZ Puanınız'
            };
            const badgeThemes = {
                DIL: { border: 'border-indigo-500', bg: 'bg-indigo-50/70', badge: 'bg-indigo-600 text-white' },
                TYT: { border: 'border-sky-500', bg: 'bg-sky-50/70', badge: 'bg-sky-600 text-white' },
                SAY: { border: 'border-emerald-500', bg: 'bg-emerald-50/70', badge: 'bg-emerald-600 text-white' },
                EA: { border: 'border-amber-500', bg: 'bg-amber-50/70', badge: 'bg-amber-600 text-white' },
                SOZ: { border: 'border-rose-500', bg: 'bg-rose-50/70', badge: 'bg-rose-600 text-white' }
            };

            const yearLabel = this.state.selectedYear || '2025';
            let html = '';
            order.forEach(pt => {
                const item = calcResult.puanlar[pt];
                const theme = badgeThemes[pt];
                const scoreLabel = scoreLabels[pt] || `${item.puanTuru} Puanınız`;
                const isActive = this.state.activeScoreType === pt;

                if (!item.hesaplandi) {
                    html += `
                        <div class="rounded-2xl border ${isActive ? 'border-primary-900 ring-2 ring-primary-900/15' : 'border-gray-200'} bg-white p-3.5 transition-all opacity-65 hover:opacity-100 cursor-pointer"
                             onclick="window.TercihRobotuUI.selectFilterScoreType('${pt}', true)">
                            <div class="flex items-center justify-between mb-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold ${theme.badge}">
                                    ${scoreLabel}
                                </span>
                                <span class="text-[11px] font-medium text-gray-400">Net Girilmedi</span>
                            </div>
                            <p class="text-xs text-gray-500 text-center">Bu puan türünün hesaplanması için ilgili testten en az 0,5 net giriniz.</p>
                        </div>
                    `;
                    return;
                }

                html += `
                    <div class="rounded-2xl border-2 ${isActive ? `${theme.border} ${theme.bg} shadow-md` : 'border-gray-100 bg-white hover:border-gray-300'} p-3.5 transition-all cursor-pointer"
                         onclick="window.TercihRobotuUI.selectFilterScoreType('${pt}', true)">
                        <div class="flex items-center justify-between mb-2">
                            <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold ${theme.badge}">
                                ${scoreLabel}
                            </span>
                            <span class="text-[11px] font-bold ${isActive ? 'text-primary-900' : 'text-gray-400'}">
                                ${isActive ? '<i class="fa-solid fa-circle-check mr-1"></i>Seçili Filtre' : 'Bölümleri Gör →'}
                            </span>
                        </div>

                        <div class="grid grid-cols-2 gap-2">
                            <div class="bg-white/90 rounded-xl p-2.5 border border-gray-100 text-center flex flex-col items-center justify-center">
                                <div class="text-[10px] uppercase tracking-wide text-gray-400 font-bold whitespace-nowrap">Yerleştirme Puanı</div>
                                <div class="text-base sm:text-lg font-extrabold text-gray-900 my-0.5">${this.formatScore(item.yerlestirmePuani, 2)}</div>
                                <div class="text-[11px] text-gray-500">Ham: ${this.formatScore(item.hamPuan, 2)}</div>
                            </div>
                            <div class="bg-white/90 rounded-xl p-2.5 border border-gray-100 text-center flex flex-col items-center justify-center">
                                <div class="text-[10px] uppercase tracking-wide text-gray-400 font-bold whitespace-nowrap">${yearLabel} Tahmini Sıra</div>
                                <div class="text-base sm:text-lg font-extrabold text-primary-900 my-0.5">${this.formatNumber(item.yerlestirmeSira)}</div>
                                <div class="text-[11px] text-gray-500">Ham: ${this.formatNumber(item.hamSira)}</div>
                            </div>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        },

        /**
         * Hedef sıralama ve marj yüzdesine göre Min ve Max sıralama kutularını günceller.
         */
        updateMinMaxFromMargin: function (hedefSiralama, marjYuzde) {
            let minSira, maxSira;
            if (this.state.filterParams.customMarginActive) {
                const minusPct = this.state.filterParams.customMarginMinus ?? 20;
                const plusPct = this.state.filterParams.customMarginPlus ?? 40;
                minSira = Math.max(1, Math.round(hedefSiralama * (1 - minusPct / 100)));
                maxSira = Math.max(minSira, Math.round(hedefSiralama * (1 + plusPct / 100)));
            } else {
                const range = window.YKSCalculator.getRecommendedRange(hedefSiralama, marjYuzde);
                minSira = range.minSira;
                maxSira = range.maxSira;
            }
            this.state.filterParams.minSiralama = minSira;
            this.state.filterParams.maxSiralama = maxSira;

            const minRankInput = document.getElementById('filter-min-rank');
            const maxRankInput = document.getElementById('filter-max-rank');
            if (minRankInput) minRankInput.value = minSira;
            if (maxRankInput) maxRankInput.value = maxSira;
        },

        /**
         * Tercih robotunda aktif puan türünü değiştirir ve ilgili JSON verisini Lazy-Load eder.
         */
        selectFilterScoreType: function (puanTuru, scrollToResults = false) {
            const key = window.YKSFilterEngine.normalizeScoreType(puanTuru);
            this.state.activeScoreType = key;
            this.state.filterParams.puanTuru = key;
            this.state.filterParams.bolumAdi = 'Tümü';
            this.state.filterParams.sayfa = 1;

            // Puan türü filtre butonlarını güncelle
            document.querySelectorAll('[data-filter-score-type]').forEach(btn => {
                const isSelected = btn.getAttribute('data-filter-score-type') === key;
                if (isSelected) {
                    btn.className = 'px-3.5 py-2 rounded-xl font-extrabold text-xs sm:text-sm bg-primary-900 text-white shadow-md transition-all';
                } else {
                    btn.className = 'px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all';
                }
            });

            // Bölüm açılır listesini bu puan türüne göre güncelle
            this.populateDepartmentDropdown(key);

            // Eğer hesaplanmış bir sıralama varsa o puan türünün sıralamasını hedef sıralamaya yaz
            const scoreObj = this.state.calcResult?.puanlar?.[key];
            if (scoreObj && scoreObj.hesaplandi && scoreObj.yerlestirmeSira) {
                this.state.filterParams.hedefSiralama = scoreObj.yerlestirmeSira;
                const targetRankInput = document.getElementById('filter-target-rank');
                if (targetRankInput) targetRankInput.value = scoreObj.yerlestirmeSira;
                this.updateMinMaxFromMargin(scoreObj.yerlestirmeSira, this.state.filterParams.marjYuzde);
            }

            if (this.state.calcResult) {
                this.renderScoreCards(this.state.calcResult);
            }

            this.executeFilter();

            if (scrollToResults && window.innerWidth < 1024) {
                const filterSection = document.getElementById('tercih-listesi-bolumu');
                if (filterSection) {
                    filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        },

        /**
         * Arama ve rakam girişlerinde gereksiz render'ı önlemek için Debounce uygular.
         */
        triggerFilterWithDebounce: function (delay = 150) {
            if (this.state.searchDebounceTimer) {
                clearTimeout(this.state.searchDebounceTimer);
            }
            this.state.searchDebounceTimer = setTimeout(() => {
                this.executeFilter();
            }, delay);
        },

        /**
         * Arama kutusunun altında Üniversite, Bölüm ve Şehir önerilerini açılır liste olarak gösterir.
         */
        updateSearchAutocomplete: function (rawQuery) {
            const dropdown = document.getElementById('search-autocomplete-dropdown');
            if (!dropdown) return;

            const trimmed = String(rawQuery || '').trim();
            if (trimmed.length < 2) {
                this.hideSearchAutocomplete();
                return;
            }

            const normQ = window.YKSFilterEngine.normalizeTr(trimmed);
            const meta = window.YKSFilterEngine.meta;
            const activePt = this.state.activeScoreType;
            const programs = window.YKSFilterEngine.cache[activePt] || [];

            // 1. Eşleşen Üniversiteler (Aktif puan türündeki programlardan benzersiz)
            const uniMap = new Map();
            for (let i = 0; i < programs.length; i++) {
                const p = programs[i];
                if (!uniMap.has(p.uni)) {
                    const normUni = window.YKSFilterEngine.normalizeTr(p.uni);
                    if (normUni.includes(normQ)) {
                        uniMap.set(p.uni, {
                            text: p.uni,
                            sub: p.sehir,
                            startsWith: normUni.startsWith(normQ)
                        });
                    }
                }
            }
            const matchedUnis = Array.from(uniMap.values())
                .sort((a, b) => (b.startsWith ? 1 : 0) - (a.startsWith ? 1 : 0))
                .slice(0, 4);

            // 2. Eşleşen Bölümler
            const rawBolumler = meta?.bolumler?.[activePt] || [];
            const matchedBolumler = [];
            for (let i = 0; i < rawBolumler.length; i++) {
                const b = rawBolumler[i];
                const normB = window.YKSFilterEngine.normalizeTr(b);
                if (normB.includes(normQ)) {
                    matchedBolumler.push({
                        text: b,
                        startsWith: normB.startsWith(normQ)
                    });
                }
            }
            matchedBolumler.sort((a, b) => (b.startsWith ? 1 : 0) - (a.startsWith ? 1 : 0));
            const topBolumler = matchedBolumler.slice(0, 4);

            // 3. Eşleşen Şehirler
            const rawSehirler = meta?.sehirler || [];
            const matchedSehirler = [];
            for (let i = 0; i < rawSehirler.length; i++) {
                const s = rawSehirler[i];
                const normS = window.YKSFilterEngine.normalizeTr(s);
                if (normS.includes(normQ)) {
                    matchedSehirler.push({
                        text: s,
                        startsWith: normS.startsWith(normQ)
                    });
                }
            }
            matchedSehirler.sort((a, b) => (b.startsWith ? 1 : 0) - (a.startsWith ? 1 : 0));
            const topSehirler = matchedSehirler.slice(0, 2);

            const suggestions = [];
            matchedUnis.forEach(u => suggestions.push({ type: 'Üniversite', icon: 'fa-building-columns', color: 'text-blue-600 bg-blue-50', value: u.text, sub: u.sub }));
            topBolumler.forEach(b => suggestions.push({ type: 'Bölüm', icon: 'fa-graduation-cap', color: 'text-indigo-600 bg-indigo-50', value: b.text, sub: `${activePt} Programı` }));
            topSehirler.forEach(s => suggestions.push({ type: 'Şehir', icon: 'fa-location-dot', color: 'text-rose-600 bg-rose-50', value: s.text, sub: 'Şehir' }));

            if (suggestions.length === 0) {
                this.hideSearchAutocomplete();
                return;
            }

            let html = '';
            suggestions.slice(0, 8).forEach(item => {
                const safeValue = item.value.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                html += `
                    <button type="button"
                        onclick="window.TercihRobotuUI.selectAutocompleteItem('${safeValue}')"
                        class="w-full px-3.5 py-2.5 text-left hover:bg-blue-50/60 flex items-center justify-between gap-3 transition-colors">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <span class="w-7 h-7 rounded-lg ${item.color} flex items-center justify-center text-xs shrink-0">
                                <i class="fa-solid ${item.icon}"></i>
                            </span>
                            <span class="text-xs sm:text-sm font-bold text-gray-800 truncate">${item.value}</span>
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 shrink-0">
                            ${item.type}
                        </span>
                    </button>
                `;
            });

            dropdown.innerHTML = html;
            dropdown.classList.remove('hidden');
        },

        hideSearchAutocomplete: function () {
            const dropdown = document.getElementById('search-autocomplete-dropdown');
            if (dropdown) {
                dropdown.classList.add('hidden');
            }
        },

        selectAutocompleteItem: function (value) {
            const searchInput = document.getElementById('filter-search-input');
            const searchClearBtn = document.getElementById('filter-search-clear');
            if (searchInput) {
                searchInput.value = value;
            }
            if (searchClearBtn) {
                searchClearBtn.classList.remove('hidden');
            }
            this.state.filterParams.aramaMetni = value;
            this.state.filterParams.sayfa = 1;
            this.hideSearchAutocomplete();
            this.executeFilter();
        },

        /**
         * Tüm filtreleri varsayılan değerlerine sıfırlar.
         */
        resetFilters: function () {
            const key = this.state.activeScoreType;
            const scoreObj = this.state.calcResult?.puanlar?.[key];
            const defaultRank = scoreObj?.yerlestirmeSira || 20000;

            this.state.filterParams = {
                ...this.state.filterParams,
                hedefSiralama: defaultRank,
                marjYuzde: 20,
                customMarginActive: false,
                customMarginMinus: 20,
                customMarginPlus: 40,
                tumSiralamalariGoster: false,
                dolmayanlariGoster: false,
                aramaMetni: '',
                sehirler: 'Tümü',
                uniTurleri: 'Tümü',
                bursTurleri: 'Tümü',
                ogretimTurleri: 'Tümü',
                bolumAdi: 'Tümü',
                siralamaKriteri: 'siralama_artan',
                sayfa: 1
            };

            const targetRankInput = document.getElementById('filter-target-rank');
            if (targetRankInput) targetRankInput.value = defaultRank;
            this.updateMinMaxFromMargin(defaultRank, 20);

            const resetElements = {
                'filter-margin-percent': '20',
                'filter-search-input': '',
                'filter-sehir': 'Tümü',
                'filter-uni-tur': 'Tümü',
                'filter-burs': 'Tümü',
                'filter-ogretim': 'Tümü',
                'filter-bolum': 'Tümü',
                'filter-sort': 'siralama_artan'
            };
            for (const [id, val] of Object.entries(resetElements)) {
                const el = document.getElementById(id);
                if (el) el.value = val;
            }

            const allRanksCb = document.getElementById('filter-all-ranks');
            if (allRanksCb) allRanksCb.checked = false;
            const unfilledCb = document.getElementById('filter-show-unfilled');
            if (unfilledCb) unfilledCb.checked = false;
            const searchClearBtn = document.getElementById('filter-search-clear');
            if (searchClearBtn) searchClearBtn.classList.add('hidden');
            const customMarginWrapper = document.getElementById('custom-margin-inputs-wrapper');
            if (customMarginWrapper) customMarginWrapper.classList.add('hidden');
            this.hideSearchAutocomplete();

            this.executeFilter();
        },

        /**
         * YKSFilterEngine.filterPrograms() fonksiyonunu çalıştırır ve sonuçları ekrana basar.
         */
        executeFilter: async function () {
            const listContainer = document.getElementById('programs-results-container');
            const summaryBanner = document.getElementById('filter-summary-banner');

            if (listContainer && !window.YKSFilterEngine.cache[this.state.filterParams.puanTuru]) {
                listContainer.innerHTML = `
                    <div class="p-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div class="inline-block w-10 h-10 border-4 border-primary-900/20 border-t-primary-900 rounded-full animate-spin mb-3"></div>
                        <p class="text-sm font-semibold text-gray-600">${this.state.filterParams.puanTuru} program verileri yükleniyor...</p>
                    </div>
                `;
            }

            try {
                const result = await window.YKSFilterEngine.filterPrograms(this.state.filterParams);
                this.state.lastFilterResult = result;
                this.renderFilterSummary(result, summaryBanner);
                this.renderProgramList(result, listContainer);
                this.renderPagination(result);
            } catch (err) {
                console.error('Filtreleme hatası:', err);
                if (listContainer) {
                    listContainer.innerHTML = `
                        <div class="p-8 text-center bg-red-50 text-red-700 rounded-2xl border border-red-200">
                            <i class="fa-solid fa-triangle-exclamation text-2xl mb-2"></i>
                            <p class="font-bold">Veriler yüklenirken bir hata oluştu.</p>
                            <p class="text-xs mt-1">Lütfen sayfayı yerel bir sunucu (Live Server / http-server) üzerinden veya prodil.net üzerinden görüntüleyin.</p>
                        </div>
                    `;
                }
            }
        },

        /**
         * Eşleşen bölüm sayısını ve Zor / İdeal / Güvenli dağılım özetini gösterir.
         */
        renderFilterSummary: function (result, container) {
            if (!container) return;
            const { toplamKayit, uygulananAralik, dagilimOzeti } = result;

            const aralikMetni = this.state.filterParams.tumSiralamalariGoster
                ? 'Tüm Sıralamalar'
                : `${this.formatNumber(uygulananAralik.minSiralama)} – ${this.formatNumber(uygulananAralik.maxSiralama)} aralığında`;

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-primary-900 to-primary-700 text-white rounded-2xl p-4 shadow-md">
                    <div>
                        <div class="text-sm sm:text-base font-bold">
                            ${aralikMetni} <span class="text-amber-300 font-extrabold">${this.formatNumber(toplamKayit)}</span> tercih var
                        </div>
                        <p class="text-xs text-blue-100 mt-1">
                            Tahmini Sıralamanız: <strong>${this.formatNumber(uygulananAralik.hedefSiralama)}</strong>
                        </p>
                    </div>
                    <div class="flex flex-wrap items-center gap-4 text-xs pt-1 sm:pt-0">
                        <span class="text-amber-200 font-semibold text-xs">
                            🟠 Sürpriz: <strong>${dagilimOzeti.reach}</strong>
                        </span>
                        <span class="text-emerald-200 font-semibold text-xs">
                            🟢 İdeal: <strong>${dagilimOzeti.ideal}</strong>
                        </span>
                        <span class="text-sky-200 font-semibold text-xs">
                            🔵 Garanti: <strong>${dagilimOzeti.safe}</strong>
                        </span>
                    </div>
                </div>
            `;
        },

        /**
         * Eşleşen üniversite bölümlerini kart/tablo görünümünde ekrana basar.
         */
        renderProgramList: function (result, container) {
            if (!container) return;

            if (result.kayitlar.length === 0) {
                container.innerHTML = `
                    <div class="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
                        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-50 text-primary-900 flex items-center justify-center text-2xl">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <h3 class="text-lg font-bold text-gray-800">Bu kriterlere uygun bölüm bulunamadı</h3>
                        <p class="text-sm text-gray-500 max-w-md mx-auto mt-1">
                            Sıralama marjını genişletebilir (±%30 / ±%50), "Tüm Sıralamaları Göster" seçeneğini işaretleyebilir veya şehir/bölüm filtrelerini sıfırlayabilirsiniz.
                        </p>
                        <div class="mt-4 flex flex-wrap justify-center gap-2">
                            <button onclick="document.getElementById('filter-all-ranks').click()"
                                class="px-4 py-2 rounded-xl bg-primary-900 text-white text-xs font-bold hover:bg-primary-800 transition-all">
                                Tüm Sıralamaları Göster
                            </button>
                            <button onclick="window.TercihRobotuUI.resetFilters()"
                                class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-all">
                                Filtreleri Temizle
                            </button>
                        </div>
                    </div>
                `;
                return;
            }

            const prefList = window.YKSFilterEngine.getPreferenceList();
            const prefIds = new Set(prefList.map(item => item.id));

            const badgeStyles = {
                reach: 'bg-amber-50 text-amber-700 border-amber-200',
                ideal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                safe: 'bg-sky-50 text-sky-700 border-sky-200',
                unfilled: 'bg-gray-100 text-gray-600 border-gray-200',
                neutral: 'bg-blue-50 text-blue-700 border-blue-200'
            };

            const uniTurBadges = {
                'Devlet': 'bg-blue-50 text-blue-700 border-blue-200',
                'Vakıf': 'bg-purple-50 text-purple-700 border-purple-200',
                'KKTC': 'bg-orange-50 text-orange-700 border-orange-200',
                'Yurt Dışı': 'bg-teal-50 text-teal-700 border-teal-200'
            };

            const bursBadges = {
                'Ücretsiz': 'bg-emerald-50 text-emerald-700',
                'Burslu': 'bg-emerald-100 text-emerald-800 font-bold',
                '%50 İndirimli': 'bg-amber-50 text-amber-700',
                '%25 İndirimli': 'bg-orange-50 text-orange-700',
                'Ücretli': 'bg-gray-100 text-gray-700'
            };

            let html = '<div class="space-y-3">';

            result.kayitlar.forEach(p => {
                const inBasket = prefIds.has(p.id);
                const chanceStyle = badgeStyles[p.olasilik.kod] || badgeStyles.neutral;
                const uniStyle = uniTurBadges[p.uniTur] || 'bg-gray-100 text-gray-700';
                const bursStyle = bursBadges[p.burs] || 'bg-gray-100 text-gray-700';

                let farkText = '';
                if (p.olasilik.siralamaFarki !== null) {
                    const diff = p.olasilik.siralamaFarki;
                    if (diff > 0) {
                        farkText = `<span class="text-[11px] text-emerald-600 font-semibold">(Sıranızdan +${this.formatNumber(diff)} geride)</span>`;
                    } else if (diff < 0) {
                        farkText = `<span class="text-[11px] text-amber-600 font-semibold">(Sıranızdan ${this.formatNumber(Math.abs(diff))} önde)</span>`;
                    } else {
                        farkText = `<span class="text-[11px] text-blue-600 font-semibold">(Sıranızla birebir)</span>`;
                    }
                }

                const encodedProgram = encodeURIComponent(JSON.stringify({
                    id: p.id,
                    uni: p.uni,
                    fakulte: p.fakulte,
                    programAdi: p.programAdi,
                    bolum: p.bolum,
                    sehir: p.sehir,
                    uniTur: p.uniTur,
                    burs: p.burs,
                    puanTuru: p.puanTuru,
                    kontenjan: p.kontenjan,
                    tabanPuan: p.tabanPuan,
                    siralama: p.siralama
                }));

                html += `
                    <div class="bg-white rounded-2xl border ${inBasket ? 'border-emerald-400 ring-1 ring-emerald-400/30' : 'border-gray-200 hover:border-primary-700/50'} p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all">
                        <!-- Üst Etiketler -->
                        <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${chanceStyle}">
                                ${p.olasilik.etiket}
                            </span>
                            <span class="px-2 py-0.5 rounded-md text-[11px] font-bold border ${uniStyle}">
                                ${p.uniTur}
                            </span>
                            <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold ${bursStyle}">
                                ${p.burs}
                            </span>
                            <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-600">
                                <i class="fa-solid fa-location-dot text-red-500 mr-1"></i>${p.sehir}
                            </span>
                            ${p.ogretimTuru !== 'Örgün' ? `<span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700">${p.ogretimTuru}</span>` : ''}
                        </div>

                        <!-- Üniversite, Fakülte ve Bölüm Adı -->
                        <h3 class="text-sm sm:text-base font-extrabold text-primary-900 leading-snug">
                            ${p.uni}
                        </h3>
                        <p class="text-xs text-gray-500 mb-0.5">${p.fakulte}</p>
                        <div class="text-sm sm:text-base font-bold text-gray-800 leading-snug">
                            ${p.programAdi}
                        </div>

                        <!-- Sıralama Farkı (Sol) ve Tercihe Ekle Butonu (Sağda Hizalı) -->
                        <div class="flex items-center justify-between gap-2 mt-2">
                            <div class="min-w-0">
                                ${farkText}
                            </div>
                            <button onclick="window.TercihRobotuUI.toggleBasketItem('${encodedProgram}')"
                                class="ml-auto px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all inline-flex items-center justify-center gap-1.5 shrink-0 ${
                                    inBasket
                                        ? 'bg-emerald-600 text-white hover:bg-red-600'
                                        : 'bg-primary-900 text-white hover:bg-primary-800 shadow-sm'
                                }">
                                <i class="fa-solid ${inBasket ? 'fa-check' : 'fa-plus'}"></i>
                                <span>${inBasket ? 'Listede' : 'Tercihe Ekle'}</span>
                            </button>
                        </div>

                        <!-- Alt Kısım: Kontenjan, 2025 Taban Puan, 2025 Başarı Sırası (Dikey ve Yatay Ortalanmış) -->
                        <div class="grid grid-cols-3 gap-2 pt-2.5 mt-2.5 border-t border-gray-100 text-center">
                            <div class="bg-gray-50 rounded-xl px-2 py-2 border border-gray-100 flex flex-col items-center justify-center">
                                <div class="text-[10px] uppercase text-gray-400 font-bold leading-tight whitespace-nowrap">Kontenjan</div>
                                <div class="text-xs sm:text-sm font-extrabold text-gray-700 mt-0.5">${p.kontenjan}</div>
                            </div>
                            <div class="bg-gray-50 rounded-xl px-2 py-2 border border-gray-100 flex flex-col items-center justify-center">
                                <div class="text-[10px] uppercase text-gray-400 font-bold leading-tight">2025<br><span class="whitespace-nowrap">Taban Puan</span></div>
                                <div class="text-xs sm:text-sm font-extrabold text-gray-800 mt-0.5">${p.doluluk ? this.formatScore(p.tabanPuan, 2) : 'Dolmadı'}</div>
                            </div>
                            <div class="bg-blue-50/70 rounded-xl px-2 py-2 border border-blue-100 flex flex-col items-center justify-center">
                                <div class="text-[10px] uppercase text-blue-600 font-bold leading-tight">2025<br><span class="whitespace-nowrap">Başarı Sırası</span></div>
                                <div class="text-xs sm:text-sm font-extrabold text-primary-900 mt-0.5">${p.doluluk ? `${this.formatNumber(p.siralama)}` : 'Dolmadı'}</div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
            container.innerHTML = html;
        },

        /**
         * Sayfalama (Pagination) kontrollerini oluşturur.
         */
        renderPagination: function (result) {
            const container = document.getElementById('programs-pagination-container');
            if (!container) return;

            if (result.toplamSayfa <= 1) {
                container.innerHTML = '';
                return;
            }

            const { mevcutSayfa, toplamSayfa, toplamKayit } = result;
            let pagesHtml = '';

            const startPage = Math.max(1, mevcutSayfa - 2);
            const endPage = Math.min(toplamSayfa, mevcutSayfa + 2);

            for (let p = startPage; p <= endPage; p++) {
                pagesHtml += `
                    <button onclick="window.TercihRobotuUI.goToPage(${p})"
                        class="w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                            p === mevcutSayfa
                                ? 'bg-primary-900 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }">
                        ${p}
                    </button>
                `;
            }

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-2xl border border-gray-200 p-3.5 mt-4 shadow-sm">
                    <span class="text-xs text-gray-500">
                        Toplam <strong>${this.formatNumber(toplamKayit)}</strong> bölümden <strong>Sayfa ${mevcutSayfa} / ${toplamSayfa}</strong> gösteriliyor
                    </span>
                    <div class="flex items-center gap-1.5">
                        <button onclick="window.TercihRobotuUI.goToPage(1)" ${mevcutSayfa === 1 ? 'disabled' : ''}
                            class="px-2.5 h-9 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                            İlk
                        </button>
                        <button onclick="window.TercihRobotuUI.goToPage(${mevcutSayfa - 1})" ${mevcutSayfa === 1 ? 'disabled' : ''}
                            class="px-3 h-9 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        ${pagesHtml}
                        <button onclick="window.TercihRobotuUI.goToPage(${mevcutSayfa + 1})" ${mevcutSayfa === toplamSayfa ? 'disabled' : ''}
                            class="px-3 h-9 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                        <button onclick="window.TercihRobotuUI.goToPage(${toplamSayfa})" ${mevcutSayfa === toplamSayfa ? 'disabled' : ''}
                            class="px-2.5 h-9 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                            Son
                        </button>
                    </div>
                </div>
            `;
        },

        goToPage: async function (pageNumber) {
            this.state.filterParams.sayfa = pageNumber;
            await this.executeFilter();
            const resultsTarget = document.getElementById('programs-results-container');
            if (resultsTarget) {
                resultsTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },

        // ====================================================================
        // TERCİH SEPETİ (24 TERCİHLİK LİSTE) ARAYÜZ YÖNETİMİ
        // ====================================================================
        toggleBasketItem: function (encodedProgram) {
            try {
                const program = JSON.parse(decodeURIComponent(encodedProgram));
                const currentList = window.YKSFilterEngine.getPreferenceList();
                const exists = currentList.some(item => item.id === program.id);

                if (exists) {
                    window.YKSFilterEngine.removePreference(program.id);
                    this.showToast(`"${program.programAdi}" tercih listenizden çıkarıldı.`, 'info');
                } else {
                    const res = window.YKSFilterEngine.addPreference(program);
                    this.showToast(res.mesaj, res.basarili ? 'success' : 'warning');
                }

                this.updatePreferenceBadge();
                if (this.state.lastFilterResult) {
                    const listContainer = document.getElementById('programs-results-container');
                    this.renderProgramList(this.state.lastFilterResult, listContainer);
                }
                this.renderPreferenceModalList();
            } catch (e) {
                console.error('Tercih ekleme hatası:', e);
            }
        },

        updatePreferenceBadge: function () {
            const list = window.YKSFilterEngine.getPreferenceList();
            document.querySelectorAll('.pref-count-badge').forEach(el => {
                el.textContent = `${list.length}/24`;
            });
        },

        openPreferenceModal: function () {
            const modal = document.getElementById('preference-basket-modal');
            if (!modal) return;
            this.renderPreferenceModalList();
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        },

        closePreferenceModal: function () {
            const modal = document.getElementById('preference-basket-modal');
            if (!modal) return;
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        },

        renderPreferenceModalList: function () {
            const container = document.getElementById('preference-modal-items');
            if (!container) return;

            const list = window.YKSFilterEngine.getPreferenceList();
            if (list.length === 0) {
                container.innerHTML = `
                    <div class="p-8 text-center text-gray-500">
                        <i class="fa-solid fa-clipboard-list text-4xl text-gray-300 mb-3"></i>
                        <p class="font-bold text-gray-700">Tercih listeniz henüz boş.</p>
                        <p class="text-xs mt-1">Bölüm listesindeki "+ Tercihe Ekle" butonuna tıklayarak en fazla 24 bölüm ekleyebilirsiniz.</p>
                    </div>
                `;
                return;
            }

            let html = '<div class="divide-y divide-gray-100">';
            list.forEach((item, idx) => {
                html += `
                    <div class="py-3 px-2 flex items-center justify-between gap-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div class="flex items-center gap-3 min-w-0">
                            <span class="w-7 h-7 rounded-lg bg-primary-900 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                                ${idx + 1}
                            </span>
                            <div class="min-w-0">
                                <div class="flex items-center gap-1.5 text-[11px] text-gray-500">
                                    <span class="font-mono font-bold">#${item.id}</span>
                                    <span>•</span>
                                    <span>${item.sehir}</span>
                                    <span>•</span>
                                    <span class="font-semibold text-primary-900">${item.puanTuru}</span>
                                </div>
                                <div class="text-xs sm:text-sm font-extrabold text-gray-800 truncate">${item.uni}</div>
                                <div class="text-xs font-semibold text-gray-600 truncate">${item.programAdi} (${item.burs})</div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 shrink-0">
                            <div class="text-right mr-2 hidden sm:block">
                                <div class="text-xs font-extrabold text-primary-900">${item.siralama ? `${this.formatNumber(item.siralama)}` : 'Dolmadı'}</div>
                                <div class="text-[11px] text-gray-400">${item.tabanPuan ? this.formatScore(item.tabanPuan, 2) : '—'}</div>
                            </div>
                            <button onclick="window.TercihRobotuUI.moveBasketItem(${idx}, ${idx - 1})" ${idx === 0 ? 'disabled' : ''}
                                class="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 text-xs">
                                <i class="fa-solid fa-arrow-up"></i>
                            </button>
                            <button onclick="window.TercihRobotuUI.moveBasketItem(${idx}, ${idx + 1})" ${idx === list.length - 1 ? 'disabled' : ''}
                                class="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 text-xs">
                                <i class="fa-solid fa-arrow-down"></i>
                            </button>
                            <button onclick="window.TercihRobotuUI.removeBasketItem('${item.id}')"
                                class="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs" title="Sil">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            container.innerHTML = html;
        },

        moveBasketItem: function (fromIdx, toIdx) {
            window.YKSFilterEngine.movePreference(fromIdx, toIdx);
            this.renderPreferenceModalList();
        },

        removeBasketItem: function (id) {
            window.YKSFilterEngine.removePreference(id);
            this.updatePreferenceBadge();
            this.renderPreferenceModalList();
            if (this.state.lastFilterResult) {
                const listContainer = document.getElementById('programs-results-container');
                this.renderProgramList(this.state.lastFilterResult, listContainer);
            }
        },

        clearBasket: function () {
            window.YKSFilterEngine.clearPreferences();
            this.updatePreferenceBadge();
            this.renderPreferenceModalList();
            if (this.state.lastFilterResult) {
                const listContainer = document.getElementById('programs-results-container');
                this.renderProgramList(this.state.lastFilterResult, listContainer);
            }
            this.showToast('Tercih listeniz temizlendi.', 'info');
        },

        copyPreferenceListToClipboard: function () {
            const list = window.YKSFilterEngine.getPreferenceList();
            if (list.length === 0) {
                this.showToast('Kopyalanacak tercih bulunamadı.', 'warning');
                return;
            }
            const lines = list.map((item, idx) =>
                `${idx + 1}. [${item.id}] ${item.uni} - ${item.programAdi} (${item.sehir}) | 2025 Sıra: ${item.siralama ? this.formatNumber(item.siralama) : 'Dolmadı'} | Puan: ${item.tabanPuan ? this.formatScore(item.tabanPuan, 2) : '-'}`
            );
            const fullText = `PRODİL YKS 2025 TERCİH LİSTEM\n----------------------------------------\n` + lines.join('\n');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(fullText).then(() => {
                    this.showToast('Tercih listeniz panoya kopyalandı!', 'success');
                });
            }
        },

        showToast: function (message, type = 'info') {
            const container = document.getElementById('yks-toast-container');
            if (!container) return;

            const colors = {
                success: 'bg-emerald-600 text-white',
                warning: 'bg-amber-500 text-white',
                info: 'bg-primary-900 text-white'
            };

            const toast = document.createElement('div');
            toast.className = `px-4 py-3 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 transition-all duration-300 ${colors[type] || colors.info}`;
            toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${message}</span>`;
            container.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 2600);
        }
    };

    window.TercihRobotuUI = TercihRobotuUI;

    document.addEventListener('DOMContentLoaded', () => {
        TercihRobotuUI.init();
    });
})();
