/**
 * Prodil Exam Utils
 * Ortak yardımcı fonksiyonlar ve araçlar.
 */

const ExamUtils = {
    // --- 1. ARRAY & MATH HELPERS ---

    /**
     * Bir diziyi karıştırır (Fisher-Yates Shuffle).
     * @param {Array} array - Karıştırılacak dizi
     * @returns {Array} - Karıştırılmış dizi
     */
    shuffleArray: function (array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    },

    /**
     * Belirli bir aralıkta rastgele tam sayı döndürür.
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Saniye cinsinden süreyi "MM:SS" formatına çevirir.
     * @param {number} seconds 
     * @returns {string}
     */
    formatTime: function (seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    },

    // --- 2. DOM HELPERS ---

    /**
     * Elementi ID ile seçer.
     * @param {string} id 
     * @returns {HTMLElement}
     */
    id: function (id) {
        return document.getElementById(id);
    },

    /**
     * Elementi gösterir.
     * @param {string|HTMLElement} el 
     */
    show: function (el) {
        const element = typeof el === 'string' ? this.id(el) : el;
        if (element) element.style.display = 'block'; // veya 'flex', duruma göre değişebilir ama genelde block/flex
    },

    /**
     * Elementi gizler.
     * @param {string|HTMLElement} el 
     */
    hide: function (el) {
        const element = typeof el === 'string' ? this.id(el) : el;
        if (element) element.style.display = 'none';
    },

    /**
     * Elementin içeriğini değiştirir.
     * @param {string} id 
     * @param {string} html 
     */
    setHtml: function (id, html) {
        const el = this.id(id);
        if (el) el.innerHTML = html;
    },

    /**
     * Elementin text içeriğini değiştirir.
     * @param {string} id 
     * @param {string} text 
     */
    setText: function (id, text) {
        const el = this.id(id);
        if (el) el.innerText = text;
    },

    // --- 3. STORAGE HELPERS ---

    saveLocal: function (key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn("Storage Error:", e);
        }
    },

    getLocal: function (key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    }
};

// Global erişim için window objesine ekle (opsiyonel ama güvenli)
window.ExamUtils = ExamUtils;
