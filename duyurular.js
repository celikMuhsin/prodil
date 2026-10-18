/**
 * ============================================================================
 * PRODİL DUYURULAR VE DENEME CEVAP ANAHTARLARI YÖNETİM DOSYASI (duyurular.js)
 * ============================================================================
 * 
 * ÖZELLİKLER VE KULLANIM KILAVUZU:
 * --------------------------------
 * 1. OTOMATİK TARİH SIRALAMASI:
 *    - Eklediğiniz duyurular "tarih" alanına göre otomatik olarak YENİDEN ESKİYE
 *      (en ileri/güncel tarih en üstte olacak şekilde) sıralanır.
 *    - Tarihi "16.10.2026" veya "16 Ekim 2026" şeklinde yazabilirsiniz.
 * 
 * 2. İLERİ TARİHLİ / SAATLİ YAYINLAMA (ZAMANLAMA):
 *    - Cevap anahtarını önceden yükleyip, belirlediğiniz gün ve saatte açılmasını
 *      istiyorsanız "yayinZamani" alanına tarih ve saat yazın:
 *      Örnek: yayinZamani: "20.10.2026 16:30"
 *    - Eğer hemen yayınlansın istiyorsanız yayinZamani: "" olarak boş bırakın.
 *    - "kilitliGoster": true yaparsanız listede görünür ama tıklayınca geri sayım çıkar.
 *      false yaparsanız o saat gelene kadar listede hiç görünmez.
 * 
 * 3. TEK KİTAPÇIK / A-B KİTAPÇIK:
 *    - Tek kitapçıklı sınavlarda "cevaplarB": "" şeklinde boş bırakın.
 */

const PRODIL_DUYURULAR = [
    {
        id: "3",
        tur: "sinav",
        baslik: "IMPACT Practice Test 3",
        tarih: "19.10.2026",
        yayinZamani: "19.10.2026 20:30", // Bu tarih ve saatten önce cevaplar açılmaz, geri sayım gösterir!  "18.10.2026 17:00" biçiminde yaz  (Tırnak içi boş olursa Anında yayında)
        kilitliGoster: true, // true: Listede kilitli/geri sayımlı görünür | false: Saati gelene kadar tamamen gizlenir
        kategori: "Cevap Anahtarı",
        aciklama: "Cevap anahtarı 19 Ekim 2026 Pazartesi günü saat 20:30 da erişime açılacaktır.",
        cevaplarA: "BADEAEBCAECDDBEACECBBEDACCBADCEBDABDBCEAAECCABCDEBBAAEBDEADCBDDBCCABCEEAABDCBBDC",
        cevaplarB: ""  // Tek kitapçık olduğu için boş bırakıldı
    },
	
	/*
    {
        id: "takvim-kasim",
        tur: "duyuru",
        baslik: "Kasım Ayı Deneme Takvimi",
        tarih: "12.10.2026",
        yayinZamani: "",
        kategori: "Sınav Takvimi",
        aciklama: "Türkiye Geneli Özdebir ve YDS Publishing YDT deneme sınav tarihleri belirlendi.",
        detayMetni: "Kasım ayı içerisinde kurumumuzda uygulanacak Türkiye Geneli Özdebir, Töder ve YDS Publishing YDT/TYT deneme sınavlarının gün ve saat bilgileri belirlenmiştir. Öğrencilerimizin sınav saatinden en az 15 dakika önce sınıflarında hazır bulunmaları önemle rica olunur."
    },
    {
        id: "kelime-listesi",
        tur: "duyuru",
        baslik: "Haftalık YDT Kelime Listesi",
        tarih: "10.10.2026",
        yayinZamani: "",
        kategori: "Çalışma Materyali",
        aciklama: "Bu haftanın 100 temel akademik kelime listesi ve pratik testleri Çalışma Odası'na yüklendi.",
        detayMetni: "Bu haftaki YDT Akademik Kelime (Academic Vocabulary) çalışmamız, eş anlamlı (synonym) listelerimiz ve interaktif kelime egzersizlerimiz üst menüde yer alan 'Çalışma Odası' bölümüne eklenmiştir. İyi çalışmalar dileriz."
    } */
	
	
];
