/**
 * PRODİL - YKS Üniversite Tercih Filtreleme ve Sepet Motoru (Faz 2)
 *
 * Görevleri:
 * 1. Puan türüne göre parçalanmış (sharded) JSON dosyalarını (programs_dil.json vb.)
 *    yalnızca ihtiyaç duyulduğunda (Lazy-Load) yükler ve bellekte (Cache) tutar.
 * 2. Öğrencinin tahmini sıralamasına göre varsayılan ±%20 marj (örn: 50.000 -> 40.000 - 60.000)
 *    veya özel sıralama aralığında filtreleme yapar.
 * 3. Şehir, Üniversite Türü (Devlet/Vakıf/KKTC), Burs Oranı, Öğretim Türü ve Türkçe karakter
 *    duyarlı arama metni ile çoklu filtreleme sunar.
 * 4. Her bölümü öğrencinin sıralamasına göre ("Zor / Sürpriz", "İdeal Tercih", "Güvenli Tercih")
 *    olarak etiketler.
 * 5. Öğrencinin 24 tercihlik ÖSYM Tercih Listesini (LocalStorage destekli) yönetir.
 *
 * Hem tarayıcıda (window.YKSFilterEngine) hem de Node.js ortamında (module.exports) çalışır.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.YKSFilterEngine = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const STORAGE_KEY_PREFERENCES = 'prodil_yks_tercih_sepeti_2025';
    const MAX_PREFERENCES = 24;

    const YKSFilterEngine = {
        basePath: 'data/yks',
        meta: null,
        cache: {
            DIL: null,
            SAY: null,
            EA: null,
            SOZ: null,
            TYT: null
        },
        loadingPromises: {},

        /**
         * Türkçe karakter duyarlı küçük harfe çevirme ve arama normalizasyonu.
         * @param {string} text
         * @returns {string}
         */
        normalizeTr: function (text) {
            if (!text) return '';
            return String(text)
                .toLocaleLowerCase('tr-TR')
                .replace(/ı/g, 'i')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/\s+/g, ' ')
                .trim();
        },

        /**
         * Puan türü anahtarını normalize eder ('DİL' -> 'DIL', 'SÖZ' -> 'SOZ').
         * @param {string} puanTuru
         * @returns {string}
         */
        normalizeScoreType: function (puanTuru) {
            const clean = String(puanTuru || '').trim().toUpperCase();
            if (clean === 'DİL' || clean === 'DIL') return 'DIL';
            if (clean === 'SÖZ' || clean === 'SOZ') return 'SOZ';
            if (clean === 'SAY') return 'SAY';
            if (clean === 'EA') return 'EA';
            return 'TYT';
        },

        /**
         * Yerel dosya (file://) protokolünde CORS engeline takılmadan dinamik script yükler.
         * @param {string} src
         */
        loadScriptDynamic: function (src) {
            return new Promise((resolve, reject) => {
                if (typeof document === 'undefined') {
                    return reject(new Error('Document mevcut değil'));
                }
                const s = document.createElement('script');
                s.src = src;
                s.async = true;
                s.onload = () => resolve(true);
                s.onerror = () => reject(new Error(`Script yüklenemedi: ${src}`));
                document.head.appendChild(s);
            });
        },

        /**
         * Meta veriyi (şehirler, benzersiz bölümler, özet sayılar) yükler.
         * @param {string} [customBasePath]
         */
        loadMeta: async function (customBasePath) {
            if (customBasePath) this.basePath = customBasePath;
            if (this.meta) return this.meta;

            // Node.js ortamı desteği
            if (typeof window === 'undefined' && typeof require === 'function') {
                const fs = require('fs');
                const path = require('path');
                const filePath = path.resolve(this.basePath, 'meta.json');
                this.meta = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                return this.meta;
            }

            // Tarayıcı ortamı: Önce HTTP/HTTPS ise fetch dene, file:// ise veya hata alırsa JS fallback kullan
            if (window.location && window.location.protocol !== 'file:') {
                try {
                    const response = await fetch(`${this.basePath}/meta.json`);
                    if (response.ok) {
                        this.meta = await response.json();
                        return this.meta;
                    }
                } catch (_) {
                    // Fallback'e geç
                }
            }

            if (!window.__YKS_META__) {
                await this.loadScriptDynamic(`${this.basePath}/js_fallback/meta.js`);
            }
            this.meta = window.__YKS_META__;
            return this.meta;
        },

        /**
         * Seçilen puan türüne ait bölüm verilerini Lazy-Load ile yükler ve bellekte önbelleğe alır.
         * @param {string} puanTuru - 'DIL' | 'SAY' | 'EA' | 'SOZ' | 'TYT'
         * @returns {Promise<Array>}
         */
        loadPrograms: async function (puanTuru) {
            const key = this.normalizeScoreType(puanTuru);

            // Bellekte varsa doğrudan döndür (0ms)
            if (Array.isArray(this.cache[key])) {
                return this.cache[key];
            }

            // Halihazırda yükleniyorsa aynı Promise'i paylaş
            if (this.loadingPromises[key]) {
                return this.loadingPromises[key];
            }

            const fileName = `programs_${key.toLowerCase()}.json`;

            this.loadingPromises[key] = (async () => {
                try {
                    let data = null;
                    if (typeof window === 'undefined' && typeof require === 'function') {
                        const fs = require('fs');
                        const path = require('path');
                        const filePath = path.resolve(this.basePath, fileName);
                        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    } else {
                        if (window.location && window.location.protocol !== 'file:') {
                            try {
                                const response = await fetch(`${this.basePath}/${fileName}`);
                                if (response.ok) {
                                    data = await response.json();
                                }
                            } catch (_) {
                                // JS fallback'e geç
                            }
                        }

                        if (!data) {
                            window.__YKS_DATA_CACHE__ = window.__YKS_DATA_CACHE__ || {};
                            if (!window.__YKS_DATA_CACHE__[key]) {
                                await this.loadScriptDynamic(`${this.basePath}/js_fallback/programs_${key.toLowerCase()}.js`);
                            }
                            data = window.__YKS_DATA_CACHE__[key];
                        }
                    }

                    // Arama ve filtreleme performansını artırmak için her kayda önceden normalize edilmiş alanlar ekle
                    for (let i = 0; i < data.length; i++) {
                        const p = data[i];
                        p._sehirNorm = this.normalizeTr(p.sehir);
                        p._uniTurNorm = this.normalizeTr(p.uniTur);
                        p._bursNorm = this.normalizeTr(p.burs);
                        p._ogretimNorm = this.normalizeTr(p.ogretimTuru);
                        p._bolumNorm = this.normalizeTr(p.bolum);
                        p._uniNorm = this.normalizeTr(p.uni);
                        p._searchIndex = this.normalizeTr(
                            `${p.id} ${p.uni} ${p.bolum} ${p.programAdi} ${p.sehir} ${p.fakulte}`
                        );
                    }

                    this.cache[key] = data;
                    return data;
                } finally {
                    delete this.loadingPromises[key];
                }
            })();

            return this.loadingPromises[key];
        },

        /**
         * Öğrencinin sıralamasına göre bir bölümün yerleşme olasılığını sınıflandırır.
         * @param {number|null} bolumSiralama
         * @param {number|null} ogrenciSiralama
         */
        classifyPlacementChance: function (bolumSiralama, ogrenciSiralama) {
            if (bolumSiralama === null || bolumSiralama === undefined) {
                return {
                    kod: 'unfilled',
                    etiket: 'Kontenjanı Dolmadı',
                    renk: 'slate',
                    siralamaFarki: null
                };
            }

            if (!ogrenciSiralama || ogrenciSiralama <= 0) {
                return {
                    kod: 'neutral',
                    etiket: 'Sıralama Mevcut',
                    renk: 'blue',
                    siralamaFarki: null
                };
            }

            // Pozitif fark = Bölümün taban sırası öğrencinin sırasından daha büyük (daha rahat yerleşir)
            // Negatif fark = Bölümün taban sırası öğrencinin sırasından daha küçük/iyi (daha zor yerleşir)
            const fark = bolumSiralama - ogrenciSiralama;
            const oran = bolumSiralama / ogrenciSiralama;

            if (oran < 0.92) {
                return {
                    kod: 'reach',
                    etiket: 'Sürpriz',
                    renk: 'amber',
                    siralamaFarki: fark
                };
            } else if (oran <= 1.08) {
                return {
                    kod: 'ideal',
                    etiket: 'İdeal',
                    renk: 'emerald',
                    siralamaFarki: fark
                };
            } else {
                return {
                    kod: 'safe',
                    etiket: 'Garanti',
                    renk: 'sky',
                    siralamaFarki: fark
                };
            }
        },

        /**
         * Bölüm veritabanını çoklu kriterlere ve ±%20 sıralama marjına göre filtreler.
         *
         * @param {Object} filters
         * @param {string} filters.puanTuru - 'DIL' | 'SAY' | 'EA' | 'SOZ' | 'TYT'
         * @param {number} [filters.hedefSiralama] - Öğrencinin tahmini sıralaması (örn: 50000)
         * @param {number} [filters.marjYuzde=20] - Sıralama marj yüzdesi (varsayılan ±%20)
         * @param {number} [filters.minSiralama] - Özel alt sıralama sınırı (belirtilirse marj yerine geçer)
         * @param {number} [filters.maxSiralama] - Özel üst sıralama sınırı (belirtilirse marj yerine geçer)
         * @param {boolean} [filters.tumSiralamalariGoster=false] - Sıralama sınırını devre dışı bırakır
         * @param {boolean} [filters.dolmayanlariGoster=false] - Kontenjanı dolmayan bölümleri dahil eder
         * @param {string} [filters.aramaMetni] - Üniversite, bölüm, şehir veya kod araması
         * @param {string|Array<string>} [filters.sehirler] - Şehir filtresi
         * @param {string|Array<string>} [filters.uniTurleri] - 'Devlet', 'Vakıf', 'KKTC', 'Yurt Dışı'
         * @param {string|Array<string>} [filters.bursTurleri] - 'Ücretsiz', 'Burslu', '%50 İndirimli', '%25 İndirimli', 'Ücretli'
         * @param {string|Array<string>} [filters.ogretimTurleri] - 'Örgün', 'İkinci Öğretim', 'Açıköğretim', 'Uzaktan Öğretim'
         * @param {string} [filters.bolumAdi] - Spesifik bölüm adı filtresi
         * @param {string} [filters.uniAdi] - Spesifik üniversite adı filtresi
         * @param {string} [filters.siralamaKriteri='siralama_artan'] - 'siralama_artan' | 'siralama_azalan' | 'puan_azalan' | 'uni_az' | 'hedefe_yakin'
         * @param {number} [filters.sayfa=1] - Sayfa numarası
         * @param {number} [filters.sayfaBoyutu=25] - Sayfa başına kayıt sayısı
         */
        filterPrograms: async function (filters = {}) {
            const puanTuruKey = this.normalizeScoreType(filters.puanTuru || 'DIL');
            const programs = await this.loadPrograms(puanTuruKey);

            const hedefSiralama = Number(filters.hedefSiralama) || null;
            const marjYuzde = filters.marjYuzde !== undefined ? Number(filters.marjYuzde) : 20;

            // Sıralama alt ve üst sınırlarının belirlenmesi
            let minSira = filters.minSiralama !== undefined && filters.minSiralama !== '' && filters.minSiralama !== null
                ? Number(filters.minSiralama)
                : null;
            let maxSira = filters.maxSiralama !== undefined && filters.maxSiralama !== '' && filters.maxSiralama !== null
                ? Number(filters.maxSiralama)
                : null;

            if (!filters.tumSiralamalariGoster && minSira === null && maxSira === null && hedefSiralama && hedefSiralama > 0) {
                const ratio = Math.max(0, marjYuzde) / 100;
                minSira = Math.max(1, Math.round(hedefSiralama * (1 - ratio)));
                maxSira = Math.max(minSira + 50, Math.round(hedefSiralama * (1 + ratio)));
            }

            // Çoklu seçim filtrelerini normalize edilmiş Set'e dönüştürme yardımcısı
            const toNormalizedSet = (val) => {
                if (!val) return null;
                const arr = Array.isArray(val) ? val : [val];
                const clean = arr
                    .map(v => this.normalizeTr(v))
                    .filter(v => v && v !== 'tumu' && v !== 'all');
                return clean.length > 0 ? new Set(clean) : null;
            };

            const sehirSet = toNormalizedSet(filters.sehirler);
            const uniTurSet = toNormalizedSet(filters.uniTurleri);
            const bursSet = toNormalizedSet(filters.bursTurleri);
            const ogretimSet = toNormalizedSet(filters.ogretimTurleri);

            // Türkçe ünsüz yumuşaması (k -> ğ) desteği: örn. "öğretmenlik" -> "ogretmenli" ("öğretmenliği" ile eşleşir)
            const searchTokens = filters.aramaMetni
                ? this.normalizeTr(filters.aramaMetni)
                    .split(' ')
                    .filter(Boolean)
                    .map(token => (token.length >= 5 && token.endsWith('k') ? token.slice(0, -1) : token))
                : [];
            const bolumFilterNorm = filters.bolumAdi && filters.bolumAdi !== 'Tümü'
                ? this.normalizeTr(filters.bolumAdi)
                : null;
            const uniFilterNorm = filters.uniAdi && filters.uniAdi !== 'Tümü'
                ? this.normalizeTr(filters.uniAdi)
                : null;
            const dolmayanlariGoster = Boolean(filters.dolmayanlariGoster);

            const eslesenler = [];

            for (let i = 0; i < programs.length; i++) {
                const p = programs[i];

                // 1. Doluluk ve Sıralama Aralığı Kontrolü
                if (!p.doluluk || p.siralama === null) {
                    if (!dolmayanlariGoster) continue;
                } else if (!filters.tumSiralamalariGoster) {
                    if (minSira !== null && p.siralama < minSira) continue;
                    if (maxSira !== null && p.siralama > maxSira) continue;
                }

                // 2. Şehir Filtresi
                if (sehirSet && !sehirSet.has(p._sehirNorm)) continue;

                // 3. Üniversite Türü Filtresi (Devlet / Vakıf / KKTC / Yurt Dışı)
                if (uniTurSet && !uniTurSet.has(p._uniTurNorm)) continue;

                // 4. Burs / Ücret Filtresi
                if (bursSet && !bursSet.has(p._bursNorm)) continue;

                // 5. Öğretim Türü Filtresi
                if (ogretimSet && !ogretimSet.has(p._ogretimNorm)) continue;

                // 6. Spesifik Bölüm Adı Filtresi
                if (bolumFilterNorm && p._bolumNorm !== bolumFilterNorm) continue;

                // 7. Spesifik Üniversite Adı Filtresi
                if (uniFilterNorm && p._uniNorm !== uniFilterNorm) continue;

                // 8. Serbest Metin Araması (Tüm kelimeler eşleşmeli)
                if (searchTokens.length > 0) {
                    let allMatched = true;
                    for (let t = 0; t < searchTokens.length; t++) {
                        if (!p._searchIndex.includes(searchTokens[t])) {
                            allMatched = false;
                            break;
                        }
                    }
                    if (!allMatched) continue;
                }

                // Tercih olasılığı analizi ekle
                const olasilik = this.classifyPlacementChance(p.siralama, hedefSiralama);
                eslesenler.push({
                    ...p,
                    olasilik
                });
            }

            // Sıralama (Sorting)
            const siralamaKriteri = filters.siralamaKriteri || 'siralama_artan';
            eslesenler.sort((a, b) => {
                // Dolmayanlar her zaman en sonda yer alsın
                if (a.siralama === null && b.siralama === null) return a.uni.localeCompare(b.uni, 'tr');
                if (a.siralama === null) return 1;
                if (b.siralama === null) return -1;

                if (siralamaKriteri === 'siralama_azalan') {
                    return b.siralama - a.siralama;
                }
                if (siralamaKriteri === 'puan_azalan') {
                    return (b.tabanPuan || 0) - (a.tabanPuan || 0);
                }
                if (siralamaKriteri === 'uni_az') {
                    const cmp = a.uni.localeCompare(b.uni, 'tr');
                    return cmp !== 0 ? cmp : a.siralama - b.siralama;
                }
                if (siralamaKriteri === 'hedefe_yakin' && hedefSiralama) {
                    return Math.abs(a.siralama - hedefSiralama) - Math.abs(b.siralama - hedefSiralama);
                }
                // Varsayılan: siralama_artan (En iyi sıralamadan aşağı doğru)
                return a.siralama - b.siralama;
            });

            // İstatistiksel Dağılım Özeti (Zor / İdeal / Güvenli sayıları)
            const dagilimOzeti = {
                reach: 0,
                ideal: 0,
                safe: 0,
                unfilled: 0
            };
            for (let i = 0; i < eslesenler.length; i++) {
                const kod = eslesenler[i].olasilik.kod;
                if (dagilimOzeti[kod] !== undefined) dagilimOzeti[kod]++;
            }

            // Sayfalama (Pagination)
            const sayfaBoyutu = Math.max(1, Number(filters.sayfaBoyutu) || 25);
            const toplamKayit = eslesenler.length;
            const toplamSayfa = Math.max(1, Math.ceil(toplamKayit / sayfaBoyutu));
            const mevcutSayfa = Math.min(toplamSayfa, Math.max(1, Number(filters.sayfa) || 1));
            const baslangic = (mevcutSayfa - 1) * sayfaBoyutu;
            const sayfaKayitlari = eslesenler.slice(baslangic, baslangic + sayfaBoyutu);

            return {
                puanTuru: puanTuruKey,
                uygulananAralik: {
                    hedefSiralama,
                    marjYuzde,
                    minSiralama: minSira,
                    maxSiralama: maxSira
                },
                toplamKayit,
                toplamSayfa,
                mevcutSayfa,
                sayfaBoyutu,
                dagilimOzeti,
                kayitlar: sayfaKayitlari,
                tumEslesenler: filters.tumListeyiDon ? eslesenler : undefined
            };
        },

        // ====================================================================
        // TERCİH SEPETİ (24 TERCİHLİK ÖSYM LİSTESİ) YÖNETİMİ
        // ====================================================================
        getPreferenceList: function () {
            if (typeof localStorage === 'undefined') return [];
            try {
                const raw = localStorage.getItem(STORAGE_KEY_PREFERENCES);
                return raw ? JSON.parse(raw) : [];
            } catch (_) {
                return [];
            }
        },

        savePreferenceList: function (list) {
            if (typeof localStorage === 'undefined') return;
            try {
                localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(list));
            } catch (e) {
                console.warn('Tercih listesi kaydedilemedi:', e);
            }
        },

        addPreference: function (program) {
            const list = this.getPreferenceList();
            if (list.some(item => item.id === program.id)) {
                return { basarili: false, mesaj: 'Bu bölüm zaten tercih listenizde yer alıyor.', liste: list };
            }
            if (list.length >= MAX_PREFERENCES) {
                return { basarili: false, mesaj: `ÖSYM kurallarına göre en fazla ${MAX_PREFERENCES} tercih ekleyebilirsiniz.`, liste: list };
            }
            const cleanItem = {
                id: program.id,
                uni: program.uni,
                fakulte: program.fakulte,
                programAdi: program.programAdi,
                bolum: program.bolum,
                sehir: program.sehir,
                uniTur: program.uniTur,
                burs: program.burs,
                puanTuru: program.puanTuru,
                kontenjan: program.kontenjan,
                tabanPuan: program.tabanPuan,
                siralama: program.siralama
            };
            list.push(cleanItem);
            this.savePreferenceList(list);
            return { basarili: true, mesaj: 'Bölüm tercih listenize eklendi.', liste: list };
        },

        removePreference: function (programId) {
            const list = this.getPreferenceList().filter(item => item.id !== String(programId));
            this.savePreferenceList(list);
            return list;
        },

        movePreference: function (fromIndex, toIndex) {
            const list = this.getPreferenceList();
            if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
                return list;
            }
            const [moved] = list.splice(fromIndex, 1);
            list.splice(toIndex, 0, moved);
            this.savePreferenceList(list);
            return list;
        },

        clearPreferences: function () {
            this.savePreferenceList([]);
            return [];
        }
    };

    return YKSFilterEngine;
});
