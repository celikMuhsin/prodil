/**
 * PRODİL - YKS Puan ve Sıralama Hesaplama Motoru (Faz 2)
 *
 * Görevleri:
 * 1. Öğrencinin TYT, AYT ve YDT doğru/yanlış sayılarından ders bazlı netleri hesaplar.
 * 2. 2025-YKS ders katsayıları ile çarparak Ham Puanı (100 - 500) bulur.
 * 3. Diploma notu / OBP ve kırık OBP durumuna göre Yerleştirme Puanını (100 - 560) hesaplar.
 * 4. 2025-YKS Yığınsal Dağılım Tablosu üzerinde Doğrusal İnterpolasyon (Linear Interpolation)
 *    yaparak öğrencinin tahmini Ham ve Yerleştirme Başarı Sıralamasını bulur.
 * 5. ±%20 varsayılan tercih marjı ile önerilen sıralama aralığını üretir.
 *
 * Hem tarayıcıda (window.YKSCalculator) hem de Node.js ortamında (module.exports) çalışır.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.YKSCalculator = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Tarayıcıda yerel dosya (file://) açılışlarında CORS engeline takılmamak için
    // 2025 resmi katsayı ve yığınsal dağılım verilerinin yerleşik yedeği (fallback)
    const DEFAULT_COEFFICIENTS_2025 = {
        yil: 2025,
        yanlisGoturmeOrani: 0.25,
        obpCarpani: { normal: 0.12, kirik: 0.06, diplomaCarpani: 5 },
        tabanPuanlar: { TYT: 100.0, SAY: 100.0, EA: 100.0, SOZ: 100.0, DIL: 100.0 },
        dersler: {
            tyt: {
                turkce: { ad: 'Türkçe', soruSayisi: 40, ortalama: 21.243, standartSapma: 7.848, katsayi: { TYT: 3.30, SAY: 1.32, EA: 1.32, SOZ: 1.32, DIL: 1.32 } },
                sosyal: { ad: 'Sosyal Bilimler', soruSayisi: 20, ortalama: 9.496, standartSapma: 4.042, katsayi: { TYT: 3.40, SAY: 1.36, EA: 1.36, SOZ: 1.36, DIL: 1.36 } },
                matematik: { ad: 'Temel Matematik', soruSayisi: 40, ortalama: 6.006, standartSapma: 7.067, katsayi: { TYT: 3.30, SAY: 1.32, EA: 1.32, SOZ: 1.32, DIL: 1.32 } },
                fen: { ad: 'Fen Bilimleri', soruSayisi: 20, ortalama: 4.122, standartSapma: 4.862, katsayi: { TYT: 3.40, SAY: 1.36, EA: 1.36, SOZ: 1.36, DIL: 1.36 } }
            },
            ayt: {
                matematik: { ad: 'AYT Matematik', soruSayisi: 40, ortalama: 6.798, standartSapma: 8.120, katsayi: { SAY: 3.00, EA: 3.00 } },
                fizik: { ad: 'Fizik', soruSayisi: 14, ortalama: 2.442, standartSapma: 3.313, katsayi: { SAY: 2.8571 } },
                kimya: { ad: 'Kimya', soruSayisi: 13, ortalama: 1.758, standartSapma: 3.229, katsayi: { SAY: 3.0769 } },
                biyoloji: { ad: 'Biyoloji', soruSayisi: 13, ortalama: 2.596, standartSapma: 3.227, katsayi: { SAY: 3.0769 } },
                edebiyat: { ad: 'Türk Dili ve Edebiyatı', soruSayisi: 24, ortalama: 6.630, standartSapma: 5.452, katsayi: { EA: 3.00, SOZ: 3.00 } },
                tarih1: { ad: 'Tarih-1', soruSayisi: 10, ortalama: 2.243, standartSapma: 2.423, katsayi: { EA: 2.80, SOZ: 2.80 } },
                cografya1: { ad: 'Coğrafya-1', soruSayisi: 6, ortalama: 1.436, standartSapma: 1.515, katsayi: { EA: 3.3333, SOZ: 3.3333 } },
                tarih2: { ad: 'Tarih-2', soruSayisi: 11, ortalama: 1.426, standartSapma: 1.965, katsayi: { SOZ: 2.9091 } },
                cografya2: { ad: 'Coğrafya-2', soruSayisi: 11, ortalama: 2.635, standartSapma: 2.808, katsayi: { SOZ: 2.9091 } },
                felsefe: { ad: 'Felsefe Grubu', soruSayisi: 12, ortalama: 1.918, standartSapma: 2.372, katsayi: { SOZ: 3.00 } },
                din: { ad: 'DKAB / Ek Felsefe', soruSayisi: 6, ortalama: 1.473, standartSapma: 1.796, katsayi: { SOZ: 3.3333 } }
            },
            ydt: {
                yabanciDil: { ad: 'Yabancı Dil (YDT)', soruSayisi: 80, ortalama: 35.096, standartSapma: 21.162, katsayi: { DIL: 3.00 } }
            }
        }
    };

    const DEFAULT_RANKINGS_2025 = {
        yil: 2025,
        adaySayilari: { tytGecerli: 2351397, aytGecerli: 1549883, ydtGecerli: 156030 },
        yerlestirme: {
            TYT: [
                { puan: 560, sira: 1 }, { puan: 550, sira: 14 }, { puan: 530, sira: 601 }, { puan: 510, sira: 3648 },
                { puan: 490, sira: 11733 }, { puan: 470, sira: 27141 }, { puan: 450, sira: 52500 }, { puan: 430, sira: 88915 },
                { puan: 410, sira: 137133 }, { puan: 390, sira: 201126 }, { puan: 370, sira: 286158 }, { puan: 350, sira: 397823 },
                { puan: 330, sira: 545280 }, { puan: 310, sira: 737144 }, { puan: 290, sira: 976188 }, { puan: 270, sira: 1251236 },
                { puan: 250, sira: 1542701 }, { puan: 230, sira: 1835041 }, { puan: 210, sira: 2099883 }, { puan: 190, sira: 2270224 },
                { puan: 170, sira: 2308495 }, { puan: 150, sira: 2310553 }, { puan: 130, sira: 2310579 }, { puan: 115, sira: 2310579 }
            ],
            SAY: [
                { puan: 560, sira: 1 }, { puan: 550, sira: 57 }, { puan: 530, sira: 1930 }, { puan: 510, sira: 7081 },
                { puan: 490, sira: 16140 }, { puan: 470, sira: 29410 }, { puan: 450, sira: 46142 }, { puan: 430, sira: 65449 },
                { puan: 410, sira: 87117 }, { puan: 390, sira: 111498 }, { puan: 370, sira: 139619 }, { puan: 350, sira: 174355 },
                { puan: 330, sira: 217778 }, { puan: 310, sira: 274252 }, { puan: 290, sira: 348397 }, { puan: 270, sira: 449880 },
                { puan: 250, sira: 596635 }, { puan: 230, sira: 811201 }, { puan: 210, sira: 1052783 }, { puan: 190, sira: 1228141 },
                { puan: 170, sira: 1287932 }, { puan: 150, sira: 1291491 }, { puan: 130, sira: 1291531 }, { puan: 115, sira: 1291531 }
            ],
            SOZ: [
                { puan: 560, sira: 1 }, { puan: 550, sira: 1 }, { puan: 530, sira: 7 }, { puan: 510, sira: 26 },
                { puan: 490, sira: 77 }, { puan: 470, sira: 254 }, { puan: 450, sira: 721 }, { puan: 430, sira: 1926 },
                { puan: 410, sira: 5036 }, { puan: 390, sira: 12522 }, { puan: 370, sira: 28323 }, { puan: 350, sira: 57848 },
                { puan: 330, sira: 108894 }, { puan: 310, sira: 190203 }, { puan: 290, sira: 309551 }, { puan: 270, sira: 468930 },
                { puan: 250, sira: 658973 }, { puan: 230, sira: 849410 }, { puan: 210, sira: 1010174 }, { puan: 190, sira: 1121933 },
                { puan: 170, sira: 1168866 }, { puan: 150, sira: 1173955 }, { puan: 130, sira: 1174046 }, { puan: 115, sira: 1174047 }
            ],
            EA: [
                { puan: 560, sira: 1 }, { puan: 550, sira: 4 }, { puan: 530, sira: 58 }, { puan: 510, sira: 261 },
                { puan: 490, sira: 742 }, { puan: 470, sira: 1629 }, { puan: 450, sira: 3422 }, { puan: 430, sira: 8145 },
                { puan: 410, sira: 20244 }, { puan: 390, sira: 42590 }, { puan: 370, sira: 76959 }, { puan: 350, sira: 125389 },
                { puan: 330, sira: 192949 }, { puan: 310, sira: 287630 }, { puan: 290, sira: 418975 }, { puan: 270, sira: 592803 },
                { puan: 250, sira: 806796 }, { puan: 230, sira: 1042314 }, { puan: 210, sira: 1262545 }, { puan: 190, sira: 1425544 },
                { puan: 170, sira: 1489209 }, { puan: 150, sira: 1494521 }, { puan: 130, sira: 1494611 }, { puan: 115, sira: 1494612 }
            ],
            DIL: [
                { puan: 560, sira: 1 }, { puan: 550, sira: 12 }, { puan: 530, sira: 151 }, { puan: 510, sira: 596 },
                { puan: 490, sira: 1606 }, { puan: 470, sira: 3514 }, { puan: 450, sira: 6543 }, { puan: 430, sira: 11267 },
                { puan: 410, sira: 17830 }, { puan: 390, sira: 25711 }, { puan: 370, sira: 34148 }, { puan: 350, sira: 43151 },
                { puan: 330, sira: 52414 }, { puan: 310, sira: 62210 }, { puan: 290, sira: 72337 }, { puan: 270, sira: 83162 },
                { puan: 250, sira: 94736 }, { puan: 230, sira: 107318 }, { puan: 210, sira: 120937 }, { puan: 190, sira: 132272 },
                { puan: 170, sira: 138558 }, { puan: 150, sira: 140478 }, { puan: 130, sira: 140655 }, { puan: 115, sira: 140657 }
            ]
        },
        ham: {
            TYT: [
                { puan: 500, sira: 1 }, { puan: 480, sira: 180 }, { puan: 460, sira: 2050 }, { puan: 440, sira: 8163 },
                { puan: 420, sira: 21061 }, { puan: 400, sira: 44193 }, { puan: 380, sira: 79260 }, { puan: 360, sira: 127655 },
                { puan: 340, sira: 193064 }, { puan: 320, sira: 282276 }, { puan: 300, sira: 404024 }, { puan: 280, sira: 570335 },
                { puan: 260, sira: 794784 }, { puan: 240, sira: 1073527 }, { puan: 220, sira: 1379866 }, { puan: 200, sira: 1686626 },
                { puan: 180, sira: 1977665 }, { puan: 160, sira: 2210463 }, { puan: 140, sira: 2303695 }, { puan: 120, sira: 2310493 },
                { puan: 100, sira: 2310579 }
            ],
            SAY: [
                { puan: 500, sira: 1 }, { puan: 480, sira: 701 }, { puan: 460, sira: 4715 }, { puan: 440, sira: 12449 },
                { puan: 420, sira: 24779 }, { puan: 400, sira: 40857 }, { puan: 380, sira: 60085 }, { puan: 360, sira: 81946 },
                { puan: 340, sira: 106251 }, { puan: 320, sira: 134493 }, { puan: 300, sira: 169418 }, { puan: 280, sira: 213365 },
                { puan: 260, sira: 270804 }, { puan: 240, sira: 348345 }, { puan: 220, sira: 458302 }, { puan: 200, sira: 627659 },
                { puan: 180, sira: 892884 }, { puan: 160, sira: 1149472 }, { puan: 140, sira: 1277493 }, { puan: 120, sira: 1291435 },
                { puan: 100, sira: 1291531 }
            ],
            SOZ: [
                { puan: 500, sira: 1 }, { puan: 480, sira: 4 }, { puan: 460, sira: 21 }, { puan: 440, sira: 76 },
                { puan: 420, sira: 227 }, { puan: 400, sira: 652 }, { puan: 380, sira: 1782 }, { puan: 360, sira: 4912 },
                { puan: 340, sira: 12653 }, { puan: 320, sira: 29315 }, { puan: 300, sira: 60680 }, { puan: 280, sira: 115851 },
                { puan: 260, sira: 205996 }, { puan: 240, sira: 338388 }, { puan: 220, sira: 515827 }, { puan: 200, sira: 723293 },
                { puan: 180, sira: 920945 }, { puan: 160, sira: 1070609 }, { puan: 140, sira: 1155714 }, { puan: 120, sira: 1173742 },
                { puan: 100, sira: 1174047 }
            ],
            EA: [
                { puan: 500, sira: 1 }, { puan: 480, sira: 32 }, { puan: 460, sira: 175 }, { puan: 440, sira: 560 },
                { puan: 420, sira: 1325 }, { puan: 400, sira: 2823 }, { puan: 380, sira: 6028 }, { puan: 360, sira: 15691 },
                { puan: 340, sira: 35436 }, { puan: 320, sira: 68083 }, { puan: 300, sira: 115961 }, { puan: 280, sira: 185253 },
                { puan: 260, sira: 285967 }, { puan: 240, sira: 431085 }, { puan: 220, sira: 629436 }, { puan: 200, sira: 875112 },
                { puan: 180, sira: 1134243 }, { puan: 160, sira: 1350772 }, { puan: 140, sira: 1474465 }, { puan: 120, sira: 1494355 },
                { puan: 100, sira: 1494612 }
            ],
            DIL: [
                { puan: 500, sira: 5 }, { puan: 480, sira: 66 }, { puan: 460, sira: 410 }, { puan: 440, sira: 1231 },
                { puan: 420, sira: 2880 }, { puan: 400, sira: 5789 }, { puan: 380, sira: 10552 }, { puan: 360, sira: 17443 },
                { puan: 340, sira: 25724 }, { puan: 320, sira: 34564 }, { puan: 300, sira: 43840 }, { puan: 280, sira: 53317 },
                { puan: 260, sira: 63300 }, { puan: 240, sira: 73733 }, { puan: 220, sira: 85010 }, { puan: 200, sira: 97273 },
                { puan: 180, sira: 111159 }, { puan: 160, sira: 125793 }, { puan: 140, sira: 135895 }, { puan: 120, sira: 140051 },
                { puan: 100, sira: 140657 }
            ]
        }
    };

    const YKSCalculator = {
        coefficients: DEFAULT_COEFFICIENTS_2025,
        rankings: DEFAULT_RANKINGS_2025,
        isInitialized: false,

        /**
         * Katsayı ve yığınsal dağılım JSON dosyalarını yükler (Tarayıcı fetch veya Node.js).
         * Hata durumunda yerleşik 2025 verilerine (fallback) geri döner.
         * @param {string} basePath - Veri klasörü yolu (varsayılan: 'data/yks')
         */
        init: async function (basePath = 'data/yks') {
            if (this.isInitialized) return true;

            const isFileProtocol = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
            if (typeof fetch === 'function' && !isFileProtocol) {
                try {
                    const [coeffRes, rankRes] = await Promise.all([
                        fetch(`${basePath}/coefficients_2025.json`),
                        fetch(`${basePath}/rankings_2025.json`)
                    ]);
                    if (coeffRes.ok) this.coefficients = await coeffRes.json();
                    if (rankRes.ok) this.rankings = await rankRes.json();
                } catch (_) {
                    // Yerleşik 2025 verileri kullanılır
                }
            }
            this.isInitialized = true;
            return true;
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
         * Tek bir ders için Doğru ve Yanlış sayısından Net ve 2025 Türkiye İstatistik Kıyaslaması üretir.
         * @param {number} dogru
         * @param {number} yanlis
         * @param {Object} dersMeta - { ad, soruSayisi, ortalama, standartSapma }
         */
        calculateSubjectNet: function (dogru, yanlis, dersMeta) {
            const maxSoru = dersMeta ? dersMeta.soruSayisi : 40;
            let d = Math.max(0, Number(dogru) || 0);
            let y = Math.max(0, Number(yanlis) || 0);

            // Toplam doğru + yanlış soru sayısını aşamaz
            let uyari = null;
            if (d > maxSoru) {
                d = maxSoru;
                uyari = `Doğru sayısı soru sayısını (${maxSoru}) aşamaz.`;
            }
            if (d + y > maxSoru) {
                y = Math.max(0, maxSoru - d);
                uyari = `Toplam doğru ve yanlış sayısı ${maxSoru} soruyu aşamaz.`;
            }

            const bos = maxSoru - (d + y);
            const goturme = this.coefficients.yanlisGoturmeOrani || 0.25;
            const hamNet = d - (y * goturme);
            const net = Number(Math.max(0, hamNet).toFixed(2));

            // 2025 Türkiye ortalaması ile kıyaslama
            const ortalama = dersMeta?.ortalama || 0;
            const stdSapma = dersMeta?.standartSapma || 1;
            const fark = Number((net - ortalama).toFixed(2));
            const zSkor = Number(((net - ortalama) / stdSapma).toFixed(2));

            return {
                ad: dersMeta?.ad || '',
                soruSayisi: maxSoru,
                dogru: d,
                yanlis: y,
                bos,
                net,
                turkiyeOrtalamasi: ortalama,
                ortalamaFarki: fark,
                zSkor,
                uyari
            };
        },

        /**
         * Diploma notu (50-100) veya OBP (250-500) üzerinden OBP katkı puanını hesaplar.
         * @param {Object} obpInput - { diplomaNotu, obp, kirikObp }
         */
        calculateOBP: function (obpInput = {}) {
            const { diplomaNotu, obp, kirikObp = false } = obpInput;
            let hesaplananObp = 400; // Varsayılan: 80 diploma notu = 400 OBP

            if (obp !== undefined && obp !== null && obp !== '') {
                const rawObp = Number(obp);
                if (!isNaN(rawObp)) {
                    hesaplananObp = Math.min(500, Math.max(250, rawObp));
                }
            } else if (diplomaNotu !== undefined && diplomaNotu !== null && diplomaNotu !== '') {
                const rawDip = Number(diplomaNotu);
                if (!isNaN(rawDip)) {
                    const clampedDip = Math.min(100, Math.max(50, rawDip));
                    hesaplananObp = clampedDip * (this.coefficients.obpCarpani?.diplomaCarpani || 5);
                }
            }

            const carpan = kirikObp
                ? (this.coefficients.obpCarpani?.kirik || 0.06)
                : (this.coefficients.obpCarpani?.normal || 0.12);

            const ekPuan = Number((hesaplananObp * carpan).toFixed(5));
            return {
                diplomaNotu: Number((hesaplananObp / 5).toFixed(2)),
                obp: Number(hesaplananObp.toFixed(2)),
                kirikObp: Boolean(kirikObp),
                carpan,
                ekPuan
            };
        },

        /**
         * Doğrusal İnterpolasyon (Linear Interpolation) ile puandan tahmini sıralama bulur.
         * @param {number} score - Hesaplanan puan
         * @param {string} puanTuru - 'TYT' | 'SAY' | 'EA' | 'SOZ' | 'DIL'
         * @param {string} rankType - 'yerlestirme' | 'ham'
         * @returns {number|null}
         */
        interpolateRanking: function (score, puanTuru, rankType = 'yerlestirme') {
            if (score === null || score === undefined || isNaN(score)) return null;
            const key = this.normalizeScoreType(puanTuru);
            const table = this.rankings?.[rankType]?.[key];
            if (!table || table.length === 0) return null;

            // Tavan puandan yüksek veya eşitse 1. sıra
            if (score >= table[0].puan) return table[0].sira;
            // Taban puandan düşük veya eşitse son sıra
            if (score <= table[table.length - 1].puan) return table[table.length - 1].sira;

            // Tabloda P_ust >= score >= P_alt aralığını bul ve doğrusal interpolasyon uygula
            for (let i = 0; i < table.length - 1; i++) {
                const upper = table[i];     // Daha yüksek puan (örn: 490 -> 1.606)
                const lower = table[i + 1]; // Daha düşük puan (örn: 470 -> 3.514)

                if (score <= upper.puan && score >= lower.puan) {
                    if (upper.puan === lower.puan) return lower.sira;
                    const ratio = (score - lower.puan) / (upper.puan - lower.puan);
                    const interpolated = lower.sira + ratio * (upper.sira - lower.sira);
                    return Math.max(1, Math.round(interpolated));
                }
            }
            return null;
        },

        /**
         * Tahmini sıralamaya göre ±%marj (varsayılan ±%20) tercih aralığı hesaplar.
         * @param {number} siralama - Öğrencinin tahmini sıralaması (örn: 50000)
         * @param {number} marginPercent - Yüzdelik marj (varsayılan: 20 -> ±%20)
         */
        getRecommendedRange: function (siralama, marginPercent = 20) {
            if (!siralama || siralama <= 0) {
                return { minSira: 1, maxSira: 100000, marjYuzde: marginPercent };
            }
            const ratio = Math.max(0, Number(marginPercent) || 20) / 100;
            const minSira = Math.max(1, Math.round(siralama * (1 - ratio)));
            const maxSira = Math.max(minSira + 100, Math.round(siralama * (1 + ratio)));
            return {
                hedefSiralama: siralama,
                minSira,
                maxSira,
                marjYuzde: marginPercent
            };
        },

        /**
         * Öğrencinin tüm sınav girdilerini alıp Net, Puan ve 2025 Tahmini Sıralamalarını hesaplar.
         *
         * @param {Object} studentInput
         * @param {Object} studentInput.tyt - { turkce: {d, y}, sosyal: {d, y}, matematik: {d, y}, fen: {d, y} }
         * @param {Object} [studentInput.ayt] - { matematik: {d, y}, fizik: {d, y}, ... }
         * @param {Object} [studentInput.ydt] - { yabanciDil: {d, y} }
         * @param {Object} [studentInput.obp] - { diplomaNotu: 85, kirikObp: false }
         * @param {number} [studentInput.marjYuzde=20] - Önerilen sıralama filtresi marjı (±%20)
         */
        calculateAll: function (studentInput = {}) {
            const dersConfig = this.coefficients.dersler;
            const marjYuzde = studentInput.marjYuzde ?? 20;

            // 1. Ders bazlı netlerin hesaplanması
            const netler = {
                tyt: {},
                ayt: {},
                ydt: {},
                toplamlar: {
                    tytToplamNet: 0,
                    aytSayNet: 0,
                    aytEaNet: 0,
                    aytSozNet: 0,
                    ydtNet: 0
                }
            };

            // TYT Dersleri
            for (const [key, meta] of Object.entries(dersConfig.tyt)) {
                const giris = studentInput.tyt?.[key] || {};
                const sonuc = this.calculateSubjectNet(giris.dogru ?? giris.d ?? 0, giris.yanlis ?? giris.y ?? 0, meta);
                netler.tyt[key] = sonuc;
                netler.toplamlar.tytToplamNet += sonuc.net;
            }
            netler.toplamlar.tytToplamNet = Number(netler.toplamlar.tytToplamNet.toFixed(2));

            // AYT Dersleri
            for (const [key, meta] of Object.entries(dersConfig.ayt)) {
                const giris = studentInput.ayt?.[key] || {};
                const sonuc = this.calculateSubjectNet(giris.dogru ?? giris.d ?? 0, giris.yanlis ?? giris.y ?? 0, meta);
                netler.ayt[key] = sonuc;

                if (meta.katsayi.SAY) netler.toplamlar.aytSayNet += sonuc.net;
                if (meta.katsayi.EA) netler.toplamlar.aytEaNet += sonuc.net;
                if (meta.katsayi.SOZ) netler.toplamlar.aytSozNet += sonuc.net;
            }
            netler.toplamlar.aytSayNet = Number(netler.toplamlar.aytSayNet.toFixed(2));
            netler.toplamlar.aytEaNet = Number(netler.toplamlar.aytEaNet.toFixed(2));
            netler.toplamlar.aytSozNet = Number(netler.toplamlar.aytSozNet.toFixed(2));

            // YDT Dersi
            for (const [key, meta] of Object.entries(dersConfig.ydt)) {
                const giris = studentInput.ydt?.[key] || {};
                const sonuc = this.calculateSubjectNet(giris.dogru ?? giris.d ?? 0, giris.yanlis ?? giris.y ?? 0, meta);
                netler.ydt[key] = sonuc;
                netler.toplamlar.ydtNet += sonuc.net;
            }
            netler.toplamlar.ydtNet = Number(netler.toplamlar.ydtNet.toFixed(2));

            // 2. OBP Hesabı
            const obpDetay = this.calculateOBP(studentInput.obp || {
                diplomaNotu: studentInput.diplomaNotu,
                obp: studentInput.obpPuani,
                kirikObp: studentInput.kirikObp
            });

            // 3. Puan Türlerine Göre Ham Puan, Yerleştirme Puanı ve 2025 Sıralama Hesabı
            // ÖSYM Kuralı: TYT puanının hesaplanması için Türkçe veya Temel Matematikten en az 0.5 net gerekir.
            const tytHesaplanabilir = (netler.tyt.turkce.net >= 0.5) || (netler.tyt.matematik.net >= 0.5);

            const puanTurleri = ['TYT', 'SAY', 'EA', 'SOZ', 'DIL'];
            const sonuclar = {};

            for (const pt of puanTurleri) {
                let hamPuan = this.coefficients.tabanPuanlar[pt] || 100.0;

                // TYT katkısı
                for (const [key, meta] of Object.entries(dersConfig.tyt)) {
                    const k = meta.katsayi[pt] || 0;
                    hamPuan += netler.tyt[key].net * k;
                }

                // AYT katkısı
                if (pt === 'SAY' || pt === 'EA' || pt === 'SOZ') {
                    for (const [key, meta] of Object.entries(dersConfig.ayt)) {
                        const k = meta.katsayi[pt] || 0;
                        hamPuan += netler.ayt[key].net * k;
                    }
                }

                // YDT katkısı
                if (pt === 'DIL') {
                    for (const [key, meta] of Object.entries(dersConfig.ydt)) {
                        const k = meta.katsayi[pt] || 0;
                        hamPuan += netler.ydt[key].net * k;
                    }
                }

                // İlgili puan türünün hesaplanabilirlik kontrolü (en az 0.5 alan neti + TYT koşulu)
                let hesaplandi = tytHesaplanabilir;
                if (pt === 'SAY' && netler.toplamlar.aytSayNet < 0.5) hesaplandi = false;
                if (pt === 'EA' && netler.toplamlar.aytEaNet < 0.5) hesaplandi = false;
                if (pt === 'SOZ' && netler.toplamlar.aytSozNet < 0.5) hesaplandi = false;
                if (pt === 'DIL' && netler.toplamlar.ydtNet < 0.5) hesaplandi = false;

                hamPuan = Math.min(500.0, Number(hamPuan.toFixed(5)));
                const yerlestirmePuani = Number((hamPuan + obpDetay.ekPuan).toFixed(5));

                const hamSira = hesaplandi ? this.interpolateRanking(hamPuan, pt, 'ham') : null;
                const yerlestirmeSira = hesaplandi ? this.interpolateRanking(yerlestirmePuani, pt, 'yerlestirme') : null;
                const onerilenAralik = yerlestirmeSira ? this.getRecommendedRange(yerlestirmeSira, marjYuzde) : null;

                sonuclar[pt] = {
                    puanTuru: pt === 'DIL' ? 'DİL' : (pt === 'SOZ' ? 'SÖZ' : pt),
                    puanTuruKey: pt,
                    hesaplandi,
                    hamPuan: hesaplandi ? hamPuan : 0,
                    yerlestirmePuani: hesaplandi ? yerlestirmePuani : 0,
                    hamSira,
                    yerlestirmeSira,
                    onerilenAralik
                };
            }

            return {
                yil: 2025,
                obp: obpDetay,
                netler,
                puanlar: sonuclar
            };
        }
    };

    return YKSCalculator;
});
