/**
 * PRODİL - YKS Tercih ve Puan Hesaplama Robotu
 * Faz 1: ÖSYM Excel (Tablo-3 & Tablo-4) ve 2025 Sayısal Bilgiler Ayrıştırıcı (Parser)
 *
 * Çalıştırma: node scripts/parse_osym_excel.js
 * Sıfır harici bağımlılık (Node.js yerleşik 'fs', 'path', 'zlib' modüllerini kullanır).
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const RAW_DIR = path.join(__dirname, '..', 'data', 'yks', 'raw');
const OUT_DIR = path.join(__dirname, '..', 'data', 'yks');

// ============================================================================
// 1. 2025-YKS RESMİ YIĞINSAL DAĞILIM VERİLERİ (sayisalbilgiler_tayd21072025.pdf)
// Sayfa 12: Sınav Puanlarının (Ham) Yığınsal Dağılımı
// Sayfa 13: Yerleştirme Puanlarının (OBP Eklenmiş) Yığınsal Dağılımı
// ============================================================================
const RANKINGS_2025 = {
    yil: 2025,
    kaynak: 'ÖSYM 2025-YKS Sınav Sonuçlarına İlişkin Sayısal Bilgiler (21.07.2025)',
    adaySayilari: {
        tytGecerli: 2351397,
        aytGecerli: 1549883,
        ydtGecerli: 156030
    },
    yerlestirme: {
        TYT: [
            { puan: 560, sira: 1 },
            { puan: 550, sira: 14 },
            { puan: 530, sira: 601 },
            { puan: 510, sira: 3648 },
            { puan: 490, sira: 11733 },
            { puan: 470, sira: 27141 },
            { puan: 450, sira: 52500 },
            { puan: 430, sira: 88915 },
            { puan: 410, sira: 137133 },
            { puan: 390, sira: 201126 },
            { puan: 370, sira: 286158 },
            { puan: 350, sira: 397823 },
            { puan: 330, sira: 545280 },
            { puan: 310, sira: 737144 },
            { puan: 290, sira: 976188 },
            { puan: 270, sira: 1251236 },
            { puan: 250, sira: 1542701 },
            { puan: 230, sira: 1835041 },
            { puan: 210, sira: 2099883 },
            { puan: 190, sira: 2270224 },
            { puan: 170, sira: 2308495 },
            { puan: 150, sira: 2310553 },
            { puan: 130, sira: 2310579 },
            { puan: 115, sira: 2310579 }
        ],
        SAY: [
            { puan: 560, sira: 1 },
            { puan: 550, sira: 57 },
            { puan: 530, sira: 1930 },
            { puan: 510, sira: 7081 },
            { puan: 490, sira: 16140 },
            { puan: 470, sira: 29410 },
            { puan: 450, sira: 46142 },
            { puan: 430, sira: 65449 },
            { puan: 410, sira: 87117 },
            { puan: 390, sira: 111498 },
            { puan: 370, sira: 139619 },
            { puan: 350, sira: 174355 },
            { puan: 330, sira: 217778 },
            { puan: 310, sira: 274252 },
            { puan: 290, sira: 348397 },
            { puan: 270, sira: 449880 },
            { puan: 250, sira: 596635 },
            { puan: 230, sira: 811201 },
            { puan: 210, sira: 1052783 },
            { puan: 190, sira: 1228141 },
            { puan: 170, sira: 1287932 },
            { puan: 150, sira: 1291491 },
            { puan: 130, sira: 1291531 },
            { puan: 115, sira: 1291531 }
        ],
        SOZ: [
            { puan: 560, sira: 1 },
            { puan: 550, sira: 1 },
            { puan: 530, sira: 7 },
            { puan: 510, sira: 26 },
            { puan: 490, sira: 77 },
            { puan: 470, sira: 254 },
            { puan: 450, sira: 721 },
            { puan: 430, sira: 1926 },
            { puan: 410, sira: 5036 },
            { puan: 390, sira: 12522 },
            { puan: 370, sira: 28323 },
            { puan: 350, sira: 57848 },
            { puan: 330, sira: 108894 },
            { puan: 310, sira: 190203 },
            { puan: 290, sira: 309551 },
            { puan: 270, sira: 468930 },
            { puan: 250, sira: 658973 },
            { puan: 230, sira: 849410 },
            { puan: 210, sira: 1010174 },
            { puan: 190, sira: 1121933 },
            { puan: 170, sira: 1168866 },
            { puan: 150, sira: 1173955 },
            { puan: 130, sira: 1174046 },
            { puan: 115, sira: 1174047 }
        ],
        EA: [
            { puan: 560, sira: 1 },
            { puan: 550, sira: 4 },
            { puan: 530, sira: 58 },
            { puan: 510, sira: 261 },
            { puan: 490, sira: 742 },
            { puan: 470, sira: 1629 },
            { puan: 450, sira: 3422 },
            { puan: 430, sira: 8145 },
            { puan: 410, sira: 20244 },
            { puan: 390, sira: 42590 },
            { puan: 370, sira: 76959 },
            { puan: 350, sira: 125389 },
            { puan: 330, sira: 192949 },
            { puan: 310, sira: 287630 },
            { puan: 290, sira: 418975 },
            { puan: 270, sira: 592803 },
            { puan: 250, sira: 806796 },
            { puan: 230, sira: 1042314 },
            { puan: 210, sira: 1262545 },
            { puan: 190, sira: 1425544 },
            { puan: 170, sira: 1489209 },
            { puan: 150, sira: 1494521 },
            { puan: 130, sira: 1494611 },
            { puan: 115, sira: 1494612 }
        ],
        DIL: [
            { puan: 560, sira: 1 },
            { puan: 550, sira: 12 },
            { puan: 530, sira: 151 },
            { puan: 510, sira: 596 },
            { puan: 490, sira: 1606 },
            { puan: 470, sira: 3514 },
            { puan: 450, sira: 6543 },
            { puan: 430, sira: 11267 },
            { puan: 410, sira: 17830 },
            { puan: 390, sira: 25711 },
            { puan: 370, sira: 34148 },
            { puan: 350, sira: 43151 },
            { puan: 330, sira: 52414 },
            { puan: 310, sira: 62210 },
            { puan: 290, sira: 72337 },
            { puan: 270, sira: 83162 },
            { puan: 250, sira: 94736 },
            { puan: 230, sira: 107318 },
            { puan: 210, sira: 120937 },
            { puan: 190, sira: 132272 },
            { puan: 170, sira: 138558 },
            { puan: 150, sira: 140478 },
            { puan: 130, sira: 140655 },
            { puan: 115, sira: 140657 }
        ]
    },
    ham: {
        TYT: [
            { puan: 500, sira: 1 },
            { puan: 480, sira: 180 },
            { puan: 460, sira: 2050 },
            { puan: 440, sira: 8163 },
            { puan: 420, sira: 21061 },
            { puan: 400, sira: 44193 },
            { puan: 380, sira: 79260 },
            { puan: 360, sira: 127655 },
            { puan: 340, sira: 193064 },
            { puan: 320, sira: 282276 },
            { puan: 300, sira: 404024 },
            { puan: 280, sira: 570335 },
            { puan: 260, sira: 794784 },
            { puan: 240, sira: 1073527 },
            { puan: 220, sira: 1379866 },
            { puan: 200, sira: 1686626 },
            { puan: 180, sira: 1977665 },
            { puan: 160, sira: 2210463 },
            { puan: 140, sira: 2303695 },
            { puan: 120, sira: 2310493 },
            { puan: 100, sira: 2310579 }
        ],
        SAY: [
            { puan: 500, sira: 1 },
            { puan: 480, sira: 701 },
            { puan: 460, sira: 4715 },
            { puan: 440, sira: 12449 },
            { puan: 420, sira: 24779 },
            { puan: 400, sira: 40857 },
            { puan: 380, sira: 60085 },
            { puan: 360, sira: 81946 },
            { puan: 340, sira: 106251 },
            { puan: 320, sira: 134493 },
            { puan: 300, sira: 169418 },
            { puan: 280, sira: 213365 },
            { puan: 260, sira: 270804 },
            { puan: 240, sira: 348345 },
            { puan: 220, sira: 458302 },
            { puan: 200, sira: 627659 },
            { puan: 180, sira: 892884 },
            { puan: 160, sira: 1149472 },
            { puan: 140, sira: 1277493 },
            { puan: 120, sira: 1291435 },
            { puan: 100, sira: 1291531 }
        ],
        SOZ: [
            { puan: 500, sira: 1 },
            { puan: 480, sira: 4 },
            { puan: 460, sira: 21 },
            { puan: 440, sira: 76 },
            { puan: 420, sira: 227 },
            { puan: 400, sira: 652 },
            { puan: 380, sira: 1782 },
            { puan: 360, sira: 4912 },
            { puan: 340, sira: 12653 },
            { puan: 320, sira: 29315 },
            { puan: 300, sira: 60680 },
            { puan: 280, sira: 115851 },
            { puan: 260, sira: 205996 },
            { puan: 240, sira: 338388 },
            { puan: 220, sira: 515827 },
            { puan: 200, sira: 723293 },
            { puan: 180, sira: 920945 },
            { puan: 160, sira: 1070609 },
            { puan: 140, sira: 1155714 },
            { puan: 120, sira: 1173742 },
            { puan: 100, sira: 1174047 }
        ],
        EA: [
            { puan: 500, sira: 1 },
            { puan: 480, sira: 32 },
            { puan: 460, sira: 175 },
            { puan: 440, sira: 560 },
            { puan: 420, sira: 1325 },
            { puan: 400, sira: 2823 },
            { puan: 380, sira: 6028 },
            { puan: 360, sira: 15691 },
            { puan: 340, sira: 35436 },
            { puan: 320, sira: 68083 },
            { puan: 300, sira: 115961 },
            { puan: 280, sira: 185253 },
            { puan: 260, sira: 285967 },
            { puan: 240, sira: 431085 },
            { puan: 220, sira: 629436 },
            { puan: 200, sira: 875112 },
            { puan: 180, sira: 1134243 },
            { puan: 160, sira: 1350772 },
            { puan: 140, sira: 1474465 },
            { puan: 120, sira: 1494355 },
            { puan: 100, sira: 1494612 }
        ],
        DIL: [
            { puan: 500, sira: 5 },
            { puan: 480, sira: 66 },
            { puan: 460, sira: 410 },
            { puan: 440, sira: 1231 },
            { puan: 420, sira: 2880 },
            { puan: 400, sira: 5789 },
            { puan: 380, sira: 10552 },
            { puan: 360, sira: 17443 },
            { puan: 340, sira: 25724 },
            { puan: 320, sira: 34564 },
            { puan: 300, sira: 43840 },
            { puan: 280, sira: 53317 },
            { puan: 260, sira: 63300 },
            { puan: 240, sira: 73733 },
            { puan: 220, sira: 85010 },
            { puan: 200, sira: 97273 },
            { puan: 180, sira: 111159 },
            { puan: 160, sira: 125793 },
            { puan: 140, sira: 135895 },
            { puan: 120, sira: 140051 },
            { puan: 100, sira: 140657 }
        ]
    }
};

// ============================================================================
// 2. 2025-YKS DERS KATSAYILARI VE TEST İSTATİSTİKLERİ (Sayfa 3)
// ============================================================================
const COEFFICIENTS_2025 = {
    yil: 2025,
    kaynak: 'ÖSYM 2025-YKS Sayısal Bilgiler (Sayfa 3) & YKS Puan Hesaplama Katsayıları',
    yanlisGoturmeOrani: 0.25,
    obpCarpani: {
        normal: 0.12,
        kirik: 0.06,
        diplomaCarpani: 5
    },
    tabanPuanlar: {
        TYT: 100.0,
        SAY: 100.0,
        EA: 100.0,
        SOZ: 100.0,
        DIL: 100.0
    },
    dersler: {
        tyt: {
            turkce: {
                ad: 'Türkçe',
                soruSayisi: 40,
                ortalama: 21.243,
                standartSapma: 7.848,
                katsayi: { TYT: 3.30, SAY: 1.32, EA: 1.32, SOZ: 1.32, DIL: 1.32 }
            },
            sosyal: {
                ad: 'Sosyal Bilimler',
                soruSayisi: 20,
                ortalama: 9.496,
                standartSapma: 4.042,
                katsayi: { TYT: 3.40, SAY: 1.36, EA: 1.36, SOZ: 1.36, DIL: 1.36 }
            },
            matematik: {
                ad: 'Temel Matematik',
                soruSayisi: 40,
                ortalama: 6.006,
                standartSapma: 7.067,
                katsayi: { TYT: 3.30, SAY: 1.32, EA: 1.32, SOZ: 1.32, DIL: 1.32 }
            },
            fen: {
                ad: 'Fen Bilimleri',
                soruSayisi: 20,
                ortalama: 4.122,
                standartSapma: 4.862,
                katsayi: { TYT: 3.40, SAY: 1.36, EA: 1.36, SOZ: 1.36, DIL: 1.36 }
            }
        },
        ayt: {
            matematik: {
                ad: 'AYT Matematik',
                soruSayisi: 40,
                ortalama: 6.798,
                standartSapma: 8.120,
                katsayi: { SAY: 3.00, EA: 3.00 }
            },
            fizik: {
                ad: 'Fizik',
                soruSayisi: 14,
                ortalama: 2.442,
                standartSapma: 3.313,
                katsayi: { SAY: 2.8571 }
            },
            kimya: {
                ad: 'Kimya',
                soruSayisi: 13,
                ortalama: 1.758,
                standartSapma: 3.229,
                katsayi: { SAY: 3.0769 }
            },
            biyoloji: {
                ad: 'Biyoloji',
                soruSayisi: 13,
                ortalama: 2.596,
                standartSapma: 3.227,
                katsayi: { SAY: 3.0769 }
            },
            edebiyat: {
                ad: 'Türk Dili ve Edebiyatı',
                soruSayisi: 24,
                ortalama: 6.630,
                standartSapma: 5.452,
                katsayi: { EA: 3.00, SOZ: 3.00 }
            },
            tarih1: {
                ad: 'Tarih-1',
                soruSayisi: 10,
                ortalama: 2.243,
                standartSapma: 2.423,
                katsayi: { EA: 2.80, SOZ: 2.80 }
            },
            cografya1: {
                ad: 'Coğrafya-1',
                soruSayisi: 6,
                ortalama: 1.436,
                standartSapma: 1.515,
                katsayi: { EA: 3.3333, SOZ: 3.3333 }
            },
            tarih2: {
                ad: 'Tarih-2',
                soruSayisi: 11,
                ortalama: 1.426,
                standartSapma: 1.965,
                katsayi: { SOZ: 2.9091 }
            },
            cografya2: {
                ad: 'Coğrafya-2',
                soruSayisi: 11,
                ortalama: 2.635,
                standartSapma: 2.808,
                katsayi: { SOZ: 2.9091 }
            },
            felsefe: {
                ad: 'Felsefe Grubu',
                soruSayisi: 12,
                ortalama: 1.918,
                standartSapma: 2.372,
                katsayi: { SOZ: 3.00 }
            },
            din: {
                ad: 'DKAB / Ek Felsefe',
                soruSayisi: 6,
                ortalama: 1.473,
                standartSapma: 1.796,
                katsayi: { SOZ: 3.3333 }
            }
        },
        ydt: {
            yabanciDil: {
                ad: 'Yabancı Dil (YDT)',
                soruSayisi: 80,
                ortalama: 35.096,
                standartSapma: 21.162,
                katsayi: { DIL: 3.00 }
            }
        }
    }
};

// ============================================================================
// 3. DOĞRUSAL İNTERPOLASYON (LINEAR INTERPOLATION) FONKSİYONU
// ============================================================================
function interpolateRanking(score, puanTuruKey, type = 'yerlestirme') {
    if (score === null || score === undefined || isNaN(score)) return null;
    const table = RANKINGS_2025[type][puanTuruKey];
    if (!table || table.length === 0) return null;

    // En yüksek puandan yüksekse 1. sıra
    if (score >= table[0].puan) return table[0].sira;
    // En düşük puandan düşükse son sıra
    if (score <= table[table.length - 1].puan) return table[table.length - 1].sira;

    // Hangi iki puan aralığında olduğunu bul (tablo azalan puan sırasındadır: P_ust >= score >= P_alt)
    for (let i = 0; i < table.length - 1; i++) {
        const upper = table[i];     // Daha yüksek puan, daha küçük (iyi) sıralama sayısı
        const lower = table[i + 1]; // Daha düşük puan, daha büyük sıralama sayısı

        if (score <= upper.puan && score >= lower.puan) {
            if (upper.puan === lower.puan) return lower.sira;
            // Doğrusal İnterpolasyon Formülü:
            // R = R_alt + ((score - P_alt) / (P_ust - P_alt)) * (R_ust - R_alt)
            const ratio = (score - lower.puan) / (upper.puan - lower.puan);
            const estimatedRank = lower.sira + ratio * (upper.sira - lower.sira);
            return Math.max(1, Math.round(estimatedRank));
        }
    }
    return null;
}

// ============================================================================
// 4. SIFIR BAĞIMLILIKLI XLSX OKUYUCU (ZIP + XML)
// ============================================================================
function decodeXmlEntities(str) {
    if (!str) return '';
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

function extractZipEntries(filePath, targetNames) {
    const buf = fs.readFileSync(filePath);
    const results = {};
    let offset = 0;

    while (offset < buf.length) {
        if (buf.readUInt32LE(offset) !== 0x04034b50) break;
        const compMethod = buf.readUInt16LE(offset + 8);
        const compSize = buf.readUInt32LE(offset + 18);
        const nameLen = buf.readUInt16LE(offset + 26);
        const extraLen = buf.readUInt16LE(offset + 28);
        const name = buf.toString('utf8', offset + 30, offset + 30 + nameLen);
        const dataStart = offset + 30 + nameLen + extraLen;

        if (targetNames.includes(name)) {
            const rawSlice = buf.subarray(dataStart, dataStart + compSize);
            results[name] = compMethod === 8
                ? zlib.inflateRawSync(rawSlice).toString('utf8')
                : rawSlice.toString('utf8');
        }
        offset = dataStart + compSize;
    }
    return results;
}

function colLettersToIndex(letters) {
    let idx = 0;
    for (let i = 0; i < letters.length; i++) {
        idx = idx * 26 + (letters.charCodeAt(i) - 64);
    }
    return idx - 1;
}

function readXlsxRows(filePath) {
    const entries = extractZipEntries(filePath, ['xl/sharedStrings.xml', 'xl/worksheets/sheet1.xml']);
    const sharedStrings = [];

    if (entries['xl/sharedStrings.xml']) {
        const siRegex = /<si>([\s\S]*?)<\/si>/g;
        let siMatch;
        while ((siMatch = siRegex.exec(entries['xl/sharedStrings.xml'])) !== null) {
            const tRegex = /<t(?:\s+[^>]*)?>([\s\S]*?)<\/t>/g;
            let tMatch;
            let text = '';
            while ((tMatch = tRegex.exec(siMatch[1])) !== null) {
                text += decodeXmlEntities(tMatch[1]);
            }
            sharedStrings.push(text);
        }
    }

    const rows = [];
    const sheetXml = entries['xl/worksheets/sheet1.xml'] || '';
    const rowRegex = /<row\b[^>]*>([\s\S]*?)<\/row>/g;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(sheetXml)) !== null) {
        const rowContent = rowMatch[1];
        const rowValues = [];
        const cellRegex = /<c\s+r="([A-Z]+)\d+"([^>]*)(?:>([\s\S]*?)<\/c>|\/>)/g;
        let cellMatch;

        while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
            const colIdx = colLettersToIndex(cellMatch[1]);
            const attrs = cellMatch[2] || '';
            const inner = cellMatch[3] || '';
            const typeMatch = /t="([^"]+)"/.exec(attrs);
            const cellType = typeMatch ? typeMatch[1] : '';

            let val = null;
            if (cellType === 'inlineStr') {
                const tMatch = /<t(?:\s+[^>]*)?>([\s\S]*?)<\/t>/.exec(inner);
                val = tMatch ? decodeXmlEntities(tMatch[1]) : '';
            } else {
                const vMatch = /<v>([\s\S]*?)<\/v>/.exec(inner);
                if (vMatch) {
                    const rawVal = vMatch[1];
                    if (cellType === 's') {
                        val = sharedStrings[parseInt(rawVal, 10)] ?? '';
                    } else if (cellType === 'str' || cellType === 'e') {
                        val = decodeXmlEntities(rawVal);
                    } else {
                        const num = Number(rawVal);
                        val = isNaN(num) ? rawVal : num;
                    }
                }
            }
            rowValues[colIdx] = val;
        }
        rows.push(rowValues);
    }
    return rows;
}

// ============================================================================
// 5. METİN VE VERİ NORMALİZASYON YARDIMCILARI
// ============================================================================
function toTitleCaseTr(str) {
    if (!str) return '';
    return str
        .trim()
        .toLocaleLowerCase('tr-TR')
        .replace(/\s*-\s*/g, ' - ')
        .split(/\s+/)
        .map(word => {
            if (!word || word === '-') return word;
            const first = word[0].toLocaleUpperCase('tr-TR');
            return first + word.slice(1);
        })
        .join(' ');
}

function normalizePuanTuru(pt) {
    const clean = String(pt || '').trim().toUpperCase();
    if (clean === 'DİL' || clean === 'DIL') return 'DIL';
    if (clean === 'SÖZ' || clean === 'SOZ') return 'SOZ';
    if (clean === 'SAY') return 'SAY';
    if (clean === 'EA') return 'EA';
    if (clean === 'TYT') return 'TYT';
    return clean;
}

function formatPuanTuruLabel(ptKey) {
    if (ptKey === 'DIL') return 'DİL';
    if (ptKey === 'SOZ') return 'SÖZ';
    return ptKey;
}

function normalizeUniTur(rawTur) {
    const t = String(rawTur || '').trim().toUpperCase();
    if (t === 'DEVLET') return 'Devlet';
    if (t === 'VAKIF' || t === 'VAKIF MYO') return 'Vakıf';
    if (t === 'KKTC') return 'KKTC';
    if (t.includes('YURTDISI') || t.includes('YURTDIŞI')) return 'Yurt Dışı';
    return toTitleCaseTr(t);
}

function extractUniAndCity(rawUniName, uniTur) {
    let uni = String(rawUniName || '').trim();
    let sehir = 'Belirtilmemiş';

    // Sonunda parantez içinde şehir varsa: örn. "ABDULLAH GÜL ÜNİVERSİTESİ (KAYSERİ)"
    const parenMatch = uni.match(/\(([^)]+)\)\s*$/);
    if (parenMatch) {
        const inside = parenMatch[1].trim();
        uni = uni.slice(0, parenMatch.index).trim();

        if (inside.toUpperCase().startsWith('KKTC-')) {
            const kktcCity = inside.slice(5).trim();
            sehir = 'KKTC (' + toTitleCaseTr(kktcCity) + ')';
        } else if (uniTur === 'Yurt Dışı') {
            sehir = toTitleCaseTr(inside);
        } else {
            sehir = toTitleCaseTr(inside);
        }
    } else {
        // Parantez yoksa üniversite adı şehir adıyla başlıyor demektir (Örn: "SAKARYA ÜNİVERSİTESİ")
        const upperUni = uni.toLocaleUpperCase('tr-TR');
        if (upperUni.startsWith('GEBZE ')) {
            sehir = 'Kocaeli';
        } else if (upperUni.startsWith('AFYONKARAHİSAR ')) {
            sehir = 'Afyonkarahisar';
        } else if (upperUni.startsWith('KAHRAMANMARAŞ ')) {
            sehir = 'Kahramanmaraş';
        } else if (upperUni.startsWith('ŞANLIURFA ')) {
            sehir = 'Şanlıurfa';
        } else {
            const firstWord = uni.split(/[\s-]+/)[0];
            sehir = toTitleCaseTr(firstWord);
        }
    }

    return { uni, sehir };
}

function parseProgramDetails(rawProgramName, uniTur) {
    const programAdi = String(rawProgramName || '').trim();
    const tags = [];
    const tagRegex = /\(([^)]+)\)/g;
    let m;
    while ((m = tagRegex.exec(programAdi)) !== null) {
        tags.push(m[1].trim());
    }

    // Saf bölüm adı (parantezlerden arındırılmış)
    const bolum = programAdi.replace(/\s*\([^)]*\)/g, '').trim();

    // Burs / Ücret durumu
    let burs = 'Ücretsiz';
    const joinedTagsUpper = tags.map(t => t.toLocaleUpperCase('tr-TR')).join(' | ');

    if (joinedTagsUpper.includes('BURSLU')) {
        burs = 'Burslu';
    } else if (joinedTagsUpper.includes('%50 İNDİRİMLİ') || joinedTagsUpper.includes('%50')) {
        burs = '%50 İndirimli';
    } else if (joinedTagsUpper.includes('%25 İNDİRİMLİ') || joinedTagsUpper.includes('%25')) {
        burs = '%25 İndirimli';
    } else if (joinedTagsUpper.includes('ÜCRETLİ')) {
        burs = 'Ücretli';
    } else if (uniTur === 'Vakıf' || uniTur === 'KKTC') {
        burs = 'Ücretli';
    }

    // Öğretim Türü
    let ogretimTuru = 'Örgün';
    if (joinedTagsUpper.includes('AÇIKÖĞRETİM')) {
        ogretimTuru = 'Açıköğretim';
    } else if (joinedTagsUpper.includes('UZAKTAN ÖĞRETİM')) {
        ogretimTuru = 'Uzaktan Öğretim';
    } else if (joinedTagsUpper.includes('İÖ') || joinedTagsUpper.includes('İKİNCİ ÖĞRETİM')) {
        ogretimTuru = 'İkinci Öğretim';
    }

    return {
        bolum,
        programAdi,
        detay: tags.join(', '),
        burs,
        ogretimTuru
    };
}

function parseNumeric(val) {
    if (val === null || val === undefined || val === '--' || val === '---' || val === '') return null;
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(',', '.').trim();
    const num = Number(cleaned);
    return isNaN(num) ? null : num;
}

// ============================================================================
// 6. ANA PARSE İŞLEMİ
// ============================================================================
function processExcelFile(filePath, tabloAdi) {
    console.log(`[OKUNUYOR] ${path.basename(filePath)} (${tabloAdi})...`);
    const rows = readXlsxRows(filePath);
    const programs = [];

    // İlk 3 satır başlıktır (0: Tablo Başlığı, 1: Kontenjan Grubu, 2: Sütun Başlıkları)
    for (let i = 3; i < rows.length; i++) {
        const r = rows[i];
        if (!r || !r[0]) continue;

        const id = String(r[0]).trim();
        // Program kodu 9 haneli sayısal bir kod olmalıdır
        if (!/^\d+$/.test(id)) continue;

        const uniTur = normalizeUniTur(r[1]);
        const { uni, sehir } = extractUniAndCity(r[2], uniTur);
        const fakulte = String(r[3] || '').trim();
        const { bolum, programAdi, detay, burs, ogretimTuru } = parseProgramDetails(r[4], uniTur);
        const puanTuruKey = normalizePuanTuru(r[5]);
        const puanTuru = formatPuanTuruLabel(puanTuruKey);

        const kontenjan = parseNumeric(r[6]) ?? 0;
        const yerlesen = parseNumeric(r[7]) ?? 0;
        const tabanPuanRaw = parseNumeric(r[8]);
        const tavanPuanRaw = parseNumeric(r[9]);
        const okulBirincisiKontenjan = parseNumeric(r[10]) ?? 0;

        const tabanPuan = tabanPuanRaw !== null ? Number(tabanPuanRaw.toFixed(5)) : null;
        const tavanPuan = tavanPuanRaw !== null ? Number(tavanPuanRaw.toFixed(5)) : null;
        const doluluk = tabanPuan !== null;

        // 2025 Yığınsal Dağılım Tablosu üzerinden 2025 başarı sıralamasını hesapla
        const siralama = doluluk ? interpolateRanking(tabanPuan, puanTuruKey, 'yerlestirme') : null;

        programs.push({
            id,
            uni,
            fakulte,
            bolum,
            programAdi,
            detay,
            burs,
            ogretimTuru,
            sehir,
            uniTur,
            tablo: tabloAdi,
            puanTuru,
            kontenjan,
            okulBirincisiKontenjan,
            yerlesen,
            tabanPuan,
            tavanPuan,
            siralama,
            doluluk
        });
    }

    console.log(`[TAMAMLANDI] ${tabloAdi}: ${programs.length} program ayrıştırıldı.`);
    return programs;
}

function main() {
    const startTime = Date.now();
    const JS_FALLBACK_DIR = path.join(OUT_DIR, 'js_fallback');
    if (!fs.existsSync(OUT_DIR)) {
        fs.mkdirSync(OUT_DIR, { recursive: true });
    }
    if (!fs.existsSync(JS_FALLBACK_DIR)) {
        fs.mkdirSync(JS_FALLBACK_DIR, { recursive: true });
    }

    const tablo3Path = path.join(RAW_DIR, 'tablo3_ykd25082025.xlsx');
    const tablo4Path = path.join(RAW_DIR, 'tablo4_ykd25082025.xlsx');

    const tablo3Programs = processExcelFile(tablo3Path, 'Tablo-3');
    const tablo4Programs = processExcelFile(tablo4Path, 'Tablo-4');
    const allPrograms = [...tablo4Programs, ...tablo3Programs];

    // Puan türlerine göre grupla (Sharding)
    const byScoreType = {
        DIL: [],
        SAY: [],
        EA: [],
        SOZ: [],
        TYT: []
    };

    for (const prog of allPrograms) {
        const key = normalizePuanTuru(prog.puanTuru);
        if (byScoreType[key]) {
            byScoreType[key].push(prog);
        }
    }

    // Her puan türünü kendi içinde başarı sıralamasına göre (küçükten büyüğe, dolmayanlar sona) sırala
    const metaCounts = {};
    for (const [key, list] of Object.entries(byScoreType)) {
        list.sort((a, b) => {
            if (a.siralama === null && b.siralama === null) return a.uni.localeCompare(b.uni, 'tr');
            if (a.siralama === null) return 1;
            if (b.siralama === null) return -1;
            if (a.siralama !== b.siralama) return a.siralama - b.siralama;
            return (b.tabanPuan || 0) - (a.tabanPuan || 0);
        });

        const outFileName = `programs_${key.toLowerCase()}.json`;
        const outPath = path.join(OUT_DIR, outFileName);
        const jsonStr = JSON.stringify(list);
        fs.writeFileSync(outPath, jsonStr, 'utf8');

        // Yerel dosya (file://) protokolünde açılışlar için Lazy-Load JS yedeği
        const jsFallbackPath = path.join(JS_FALLBACK_DIR, `programs_${key.toLowerCase()}.js`);
        fs.writeFileSync(
            jsFallbackPath,
            `window.__YKS_DATA_CACHE__ = window.__YKS_DATA_CACHE__ || {};\nwindow.__YKS_DATA_CACHE__["${key}"] = ${jsonStr};\n`,
            'utf8'
        );

        const fileSizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
        const doluCount = list.filter(p => p.doluluk).length;
        metaCounts[key] = {
            toplamProgram: list.length,
            doluProgram: doluCount,
            bosProgram: list.length - doluCount,
            dosya: outFileName,
            boyutKB: Number(fileSizeKB)
        };
        console.log(`[YAZILDI] ${outFileName} -> ${list.length} bölüm (${fileSizeKB} KB)`);
    }

    // Katsayılar ve Yığınsal Dağılım JSON dosyalarını kaydet
    const coeffPath = path.join(OUT_DIR, 'coefficients_2025.json');
    fs.writeFileSync(coeffPath, JSON.stringify(COEFFICIENTS_2025, null, 2), 'utf8');
    console.log(`[YAZILDI] coefficients_2025.json`);

    const rankPath = path.join(OUT_DIR, 'rankings_2025.json');
    fs.writeFileSync(rankPath, JSON.stringify(RANKINGS_2025, null, 2), 'utf8');
    console.log(`[YAZILDI] rankings_2025.json`);

    // Arayüz filtrelerinde hızlı kullanım için meta.json oluştur (Şehirler, Üniversiteler, Özet İstatistikler)
    const sehirSet = new Set();
    const uniSet = new Set();
    const bolumByPuanTuru = { DIL: new Set(), SAY: new Set(), EA: new Set(), SOZ: new Set(), TYT: new Set() };

    for (const p of allPrograms) {
        if (p.sehir) sehirSet.add(p.sehir);
        if (p.uni) uniSet.add(p.uni);
        const ptKey = normalizePuanTuru(p.puanTuru);
        if (bolumByPuanTuru[ptKey] && p.bolum) {
            bolumByPuanTuru[ptKey].add(p.bolum);
        }
    }

    const metaData = {
        yil: 2025,
        olusturulmaTarihi: new Date().toISOString(),
        toplamProgramSayisi: allPrograms.length,
        puanTurleriOzeti: metaCounts,
        sehirler: Array.from(sehirSet).sort((a, b) => a.localeCompare(b, 'tr')),
        universiteSayisi: uniSet.size,
        bolumler: {
            DIL: Array.from(bolumByPuanTuru.DIL).sort((a, b) => a.localeCompare(b, 'tr')),
            SAY: Array.from(bolumByPuanTuru.SAY).sort((a, b) => a.localeCompare(b, 'tr')),
            EA: Array.from(bolumByPuanTuru.EA).sort((a, b) => a.localeCompare(b, 'tr')),
            SOZ: Array.from(bolumByPuanTuru.SOZ).sort((a, b) => a.localeCompare(b, 'tr')),
            TYT: Array.from(bolumByPuanTuru.TYT).sort((a, b) => a.localeCompare(b, 'tr'))
        }
    };

    const metaPath = path.join(OUT_DIR, 'meta.json');
    fs.writeFileSync(metaPath, JSON.stringify(metaData, null, 2), 'utf8');
    fs.writeFileSync(
        path.join(JS_FALLBACK_DIR, 'meta.js'),
        `window.__YKS_META__ = ${JSON.stringify(metaData)};\n`,
        'utf8'
    );
    console.log(`[YAZILDI] meta.json (${metaData.sehirler.length} şehir/bölge, ${metaData.universiteSayisi} üniversite)`);
    console.log(`\n✅ Faz-1 Veri Hazırlama işlemi ${((Date.now() - startTime) / 1000).toFixed(2)} saniyede başarıyla tamamlandı!`);
}

main();
