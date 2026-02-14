/**
 * Prodil Exercise Engine
 * Egzersizler ve kelime oyunları için hafif motor.
 */

const EnglishExam = {
    // --- STATE ---
    config: {
        containerId: 'eng-exam-interface',
        questionAreaId: 'eng-exam-question-area',
        feedbackId: 'eng-exam-feedback',
        titleId: 'eng-exam-title'
    },
    questions: [],
    currentIndex: 0,
    score: { correct: 0, wrong: 0 },
    currentType: null, // 'meaning', 'cloze', 'antonym' etc.

    // --- 1. BAŞLATMA ---

    /**
     * Egzersiz modunu başlatır.
     * @param {string} type - Egzersiz tipi (örn: 'meaning', 'cloze')
     */
    start: function (type) {
        this.currentType = type;
        this.currentIndex = 0;
        this.score = { correct: 0, wrong: 0 };
        this.questions = [];

        // UI Hazırlığı
        const grid = document.getElementById('eng-exam-grid');
        const interface = document.getElementById(this.config.containerId);

        if (grid) grid.style.display = 'none';
        if (interface) interface.style.display = 'block';

        // Başlık Ayarla
        const titleMap = {
            'meaning': 'Kelime Anlamı',
            'cloze': 'Boşluk Doldurma',
            'antonym': 'Zıt Anlam',
            'synonym': 'Eş Anlam Avcısı',
            'morphology': 'Kelime Ailesi',
            'listening': 'Dinle ve Bul',
            'scramble': 'Harf Karıştırma',
            'sentence_builder': 'Cümle Kur',
            'true_false': 'Doğru / Yanlış'
        };
        const titleEl = document.getElementById(this.config.titleId);
        if (titleEl) titleEl.innerText = titleMap[type] || 'Egzersiz';

        this.loadQuestions(type);
    },

    /**
     * Soruları yükler (Şimdilik Mock Data veya Kelime Verisinden Üretim)
     * @param {string} type 
     */
    loadQuestions: function (type) {
        // NOT: Gerçek veriler window.vocabularyData'dan veya JSON'dan gelebilir.
        // Şimdilik demo amaçlı statik veya basit üretim yapıyoruz.
        // İleride burası ExamUtils.shuffleArray(window.vocabularyData) ile beslenebilir.

        console.log(`Loading questions for ${type}...`);

        // ÖRNEK: Kelime verisi varsa ondan soru üret
        if (window.vocabularyData && window.vocabularyData.length > 0) {
            this.generateQuestionsFromData(type);
        } else {
            // Veri yoksa hata veya mock
            document.getElementById(this.config.questionAreaId).innerHTML = "<p class='text-center text-red-500'>Kelime verisi yüklenemedi.</p>";
        }
    },

    generateQuestionsFromData: function (type) {
        // Kelimeleri karıştır
        const words = ExamUtils.shuffleArray([...window.vocabularyData]).slice(0, 10); // 10 soru

        this.questions = words.map(w => {
            // Basit bir soru şablonu (Tipe göre değişmeli)
            let qText = "";
            let correctAnswer = "";
            let options = [];

            if (type === 'meaning') {
                qText = `<span class="text-2xl font-bold text-primary-900">${w.word}</span> kelimesinin anlamı nedir?`;
                correctAnswer = w.definitions[0]?.core_meaning_tr || "Anlam Yok";
                // Çeldiriciler
                let distractors = ExamUtils.shuffleArray(window.vocabularyData.filter(x => x.word !== w.word)).slice(0, 3);
                options = [correctAnswer, ...distractors.map(d => d.definitions[0]?.core_meaning_tr)];
            } else {
                // Diğer tipler için placeholder
                qText = `${w.word} - (${type} implementation pending)`;
                correctAnswer = "Option A";
                options = ["Option A", "Option B", "Option C", "Option D"];
            }

            return {
                text: qText,
                options: ExamUtils.shuffleArray(options),
                correct: correctAnswer,
                answered: false
            };
        });

        if (this.questions.length > 0) {
            this.showQuestion();
        } else {
            document.getElementById(this.config.questionAreaId).innerHTML = "<p>Soru oluşturulamadı.</p>";
        }
    },

    // --- 2. SORU GÖSTERİMİ ---

    showQuestion: function () {
        const q = this.questions[this.currentIndex];
        const area = document.getElementById(this.config.questionAreaId);
        const feedback = document.getElementById(this.config.feedbackId);

        if (feedback) feedback.innerHTML = ""; // Temizle

        let optionsHtml = q.options.map(opt => `
            <button class="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary-700 hover:bg-blue-50 transition-all font-semibold text-gray-700 mb-3"
                onclick="EnglishExam.checkAnswer(this, '${opt.replace(/'/g, "\\'")}')">
                ${opt}
            </button>
        `).join('');

        area.innerHTML = `
            <div class="mb-6 text-center">
                <span class="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-bold">
                    Soru ${this.currentIndex + 1} / ${this.questions.length}
                </span>
            </div>
            <div class="text-xl text-center mb-8">${q.text}</div>
            <div class="max-w-md mx-auto">
                ${optionsHtml}
            </div>
        `;
    },

    // --- 3. CEVAP KONTROLÜ ---

    checkAnswer: function (btn, answer) {
        const q = this.questions[this.currentIndex];
        if (q.answered) return;
        q.answered = true;

        const feedback = document.getElementById(this.config.feedbackId);

        if (answer === q.correct) {
            this.score.correct++;
            btn.classList.add('bg-green-100', 'border-green-500', 'text-green-700');
            // Diğer butonları disable et
            if (feedback) feedback.innerHTML = `<span class="text-green-600"><i class="fa-solid fa-check"></i> Doğru!</span>`;
        } else {
            this.score.wrong++;
            btn.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
            if (feedback) feedback.innerHTML = `<span class="text-red-600"><i class="fa-solid fa-xmark"></i> Yanlış. Doğru cevap: <strong>${q.correct}</strong></span>`;
        }

        // Otomatik geçiş
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    },

    nextQuestion: function () {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.showQuestion();
        } else {
            this.finish();
        }
    },

    // --- 4. BİTİŞ ---

    finish: function () {
        const area = document.getElementById(this.config.questionAreaId);
        const feedback = document.getElementById(this.config.feedbackId);
        if (feedback) feedback.innerHTML = "";

        area.innerHTML = `
            <div class="text-center py-10">
                <div class="text-6xl mb-4">🎉</div>
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Egzersiz Tamamlandı!</h2>
                
                <div class="flex justify-center gap-8 mb-8">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-green-600">${this.score.correct}</div>
                        <div class="text-sm text-gray-500 uppercase tracking-wide">Doğru</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-red-500">${this.score.wrong}</div>
                        <div class="text-sm text-gray-500 uppercase tracking-wide">Yanlış</div>
                    </div>
                </div>

                <div class="flex justify-center gap-4">
                     <button onclick="EnglishExam.close()" 
                        class="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                        Listeye Dön
                    </button>
                    <button onclick="EnglishExam.start('${this.currentType}')" 
                        class="px-6 py-3 rounded-lg bg-primary-900 text-white font-bold hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Tekrar Oyna
                    </button>
                </div>
            </div>
        `;
    },

    close: function () {
        const grid = document.getElementById('eng-exam-grid');
        const interface = document.getElementById(this.config.containerId);

        if (interface) interface.style.display = 'none';
        if (grid) {
            grid.style.display = 'grid'; // Grid'e geri dön (flex değil)
            // Tailwind class override olabilir, js ile display grid veriyoruz.
            // Orijinal CSS class'ına göre 'grid' olmalı.
        }
    }
};

window.EnglishExam = EnglishExam;
