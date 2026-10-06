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

        // Yükleniyor göstergesi
        const area = document.getElementById(this.config.questionAreaId);
        if (area) {
            area.innerHTML = `
                <div class="flex flex-col justify-center items-center h-40">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mb-4"></div>
                    <p class="text-gray-500 font-medium">Sorular hazırlanıyor...</p>
                </div>
            `;
        }

        this.loadQuestions(type);
    },

    /**
     * Soruları yükler
     * @param {string} type 
     */
    loadQuestions: async function (type) {
        console.log(`Loading questions for ${type}...`);

        if (!window.vocabularyData || window.vocabularyData.length === 0) {
            document.getElementById(this.config.questionAreaId).innerHTML = "<p class='text-center text-red-500'>Kelime verisi yüklenemedi.</p>";
            return;
        }

        try {
            // 1. Rastgele kelimeler seç (Main Index'ten)
            const selectedWords = ExamUtils.shuffleArray([...window.vocabularyData]).slice(0, 10);

            const detailedQuestions = [];

            for (const wordObj of selectedWords) {
                let questionData = null;

                // Veri çekme (Eğer path varsa)
                let details = null;
                if (wordObj.path) {
                    try {
                        const response = await fetch(wordObj.path);
                        if (response.ok) {
                            details = await response.json();
                        }
                    } catch (e) {
                        console.warn(`Failed to fetch details for ${wordObj.word}`, e);
                    }
                }

                // Soru Üretimi
                if (type === 'meaning') {
                    questionData = this.createMeaningQuestion(wordObj);
                } else if (type === 'listening') {
                    questionData = this.createListeningQuestion(wordObj);
                } else if (type === 'cloze') {
                    if (details) questionData = this.createClozeQuestion(wordObj, details);
                    else questionData = this.createMeaningQuestion(wordObj); // Fallback to meaning if no detailed data
                } else if (type === 'antonym') {
                    if (details) questionData = this.createAntonymQuestion(wordObj, details);
                    else questionData = this.createMeaningQuestion(wordObj); // Fallback
                } else if (type === 'synonym') {
                    if (details) questionData = this.createSynonymQuestion(wordObj, details);
                    else questionData = this.createMeaningQuestion(wordObj); // Fallback
                } else if (type === 'scramble') {
                    questionData = this.createScrambleQuestion(wordObj);
                } else if (type === 'true_false') {
                    questionData = this.createTrueFalseQuestion(wordObj);
                } else if (type === 'sentence_builder') {
                    if (details) questionData = this.createSentenceBuilderQuestion(wordObj, details);
                    else questionData = this.createScrambleQuestion(wordObj); // Fallback to Scramble
                } else {
                    // Default Fallback
                    questionData = this.createFallbackQuestion(wordObj, type);
                }

                if (questionData) {
                    detailedQuestions.push(questionData);
                }
            }

            this.questions = detailedQuestions;

            if (this.questions.length > 0) {
                this.showQuestion();
            } else {
                document.getElementById(this.config.questionAreaId).innerHTML = `
                    <div class="text-center p-6">
                        <p class="text-gray-600 mb-4">Bu egzersiz türü için yeterli veri bulunamadı.</p>
                        <button onclick="EnglishExam.close()" class="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700">Geri Dön</button>
                    </div>
                `;
            }

        } catch (error) {
            console.error("Error generating questions:", error);
            document.getElementById(this.config.questionAreaId).innerHTML = "<p class='text-center text-red-500'>Bir hata oluştu.</p>";
        }
    },

    // --- SORU ÜRETİM FONKSİYONLARI ---

    createMeaningQuestion: function (w) {
        const correctAnswer = w.definitions[0]?.core_meaning_tr || "Anlam Yok";
        const distractors = ExamUtils.shuffleArray(window.vocabularyData.filter(x => x.word !== w.word)).slice(0, 3);
        const options = [correctAnswer, ...distractors.map(d => d.definitions[0]?.core_meaning_tr)];

        return {
            type: 'meaning',
            text: `<span class="text-3xl font-bold text-primary-900 block mb-2">${w.word}</span> <span class="text-sm text-gray-500 font-normal">kelimesinin anlamı nedir?</span>`,
            options: ExamUtils.shuffleArray(options),
            correct: correctAnswer,
            word: w.word,
            answered: false
        };
    },

    createListeningQuestion: function (w) {
        const correctAnswer = w.word;
        const distractors = ExamUtils.shuffleArray(window.vocabularyData.filter(x => x.word !== w.word)).slice(0, 3);
        const options = [correctAnswer, ...distractors.map(d => d.word)];

        return {
            type: 'listening',
            text: `
                <div class="flex flex-col items-center gap-4 py-4">
                    <button onclick="EnglishExam.playAudio('${w.word}')" class="w-24 h-24 bg-primary-900 rounded-full flex items-center justify-center text-white text-4xl shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer group relative overflow-hidden">
                        <div class="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                        <i class="fa-solid fa-volume-high group-hover:animate-pulse"></i>
                    </button>
                    <span class="text-sm text-gray-500 font-medium">Dinlemek için butona tıkla</span>
                </div>
            `,
            options: ExamUtils.shuffleArray(options),
            correct: correctAnswer,
            audioWord: w.word,
            answered: false
        };
    },

    createClozeQuestion: function (summary, details) {
        if (!details.sentence_progression?.levels || details.sentence_progression.levels.length === 0) return null;

        const levelData = ExamUtils.shuffleArray(details.sentence_progression.levels)[0];
        const sentence = levelData.en;

        const regex = new RegExp(`\\b${summary.word}\\b`, 'gi');
        if (!regex.test(sentence)) return null;

        const maskedSentence = sentence.replace(regex, "______");

        const correctAnswer = summary.word;
        const distractors = ExamUtils.shuffleArray(window.vocabularyData.filter(x => x.word !== summary.word)).slice(0, 3);
        const options = [correctAnswer, ...distractors.map(d => d.word)];

        return {
            type: 'cloze',
            text: `<div class="text-xl font-medium text-gray-800 mb-2 leading-relaxed">"${maskedSentence}"</div><div class="text-sm text-gray-500">(${levelData.tr})</div>`,
            options: ExamUtils.shuffleArray(options),
            correct: correctAnswer,
            answered: false
        };
    },

    createAntonymQuestion: function (summary, details) {
        const antonyms = details.lexical_nuance?.antonyms;
        if (!antonyms || antonyms.length === 0) return null;

        const selectedAntonym = antonyms[0];
        const correctAnswer = selectedAntonym.word;

        // Çeldiriciler
        const distractors = ExamUtils.shuffleArray(window.vocabularyData.filter(x => x.word !== summary.word && x.word !== correctAnswer)).slice(0, 3);
        const options = [correctAnswer, ...distractors.map(d => d.word)];

        return {
            type: 'antonym',
            text: `<span class="text-3xl font-bold text-primary-900 block mb-2">${summary.word}</span> <span class="text-gray-600">kelimesinin <span class="text-red-600 font-bold">zıt anlamlısı</span> nedir?</span>`,
            options: ExamUtils.shuffleArray(options),
            correct: correctAnswer,
            answered: false
        };
    },

    createSynonymQuestion: function (summary, details) {
        const synonyms = details.lexical_nuance?.synonym_scale?.scale;
        if (!synonyms || synonyms.length <= 1) return null;

        const otherSynonyms = synonyms.filter(s => s.word.toLowerCase() !== summary.word.toLowerCase());
        if (otherSynonyms.length === 0) return null;

        const selectedSynonym = otherSynonyms[0].word;
        const correctAnswer = selectedSynonym;

        const distractors = ExamUtils.shuffleArray(window.vocabularyData.filter(x => x.word !== summary.word && x.word !== correctAnswer)).slice(0, 3);
        const options = [correctAnswer, ...distractors.map(d => d.word)];

        return {
            type: 'synonym',
            text: `<span class="text-3xl font-bold text-primary-900 block mb-2">${summary.word}</span> <span class="text-gray-600">kelimesinin <span class="text-green-600 font-bold">eş anlamlısı</span> nedir?</span>`,
            options: ExamUtils.shuffleArray(options),
            correct: correctAnswer,
            answered: false
        };
    },

    createScrambleQuestion: function (w) {
        // Kelimeyi karıştır
        const originalWord = w.word;
        const scrambled = originalWord.split('').sort(() => 0.5 - Math.random()).join('');

        const correctAnswer = originalWord;
        // Çeldiriciler: Rastgele kelimeler
        const distractors = ExamUtils.shuffleArray(window.vocabularyData.filter(x => x.word !== w.word)).slice(0, 3);
        const options = [correctAnswer, ...distractors.map(d => d.word)];

        return {
            type: 'scramble',
            text: `<div class="text-center">
                    <span class="text-sm text-gray-500 mb-2 block">Harfleri Karışık Verilen Kelimeyi Bul</span>
                    <span class="text-4xl font-mono font-bold text-indigo-600 tracking-widest bg-indigo-50 px-6 py-2 rounded-xl inline-block shadow-sm border border-indigo-100">${scrambled}</span>
                   </div>`,
            options: ExamUtils.shuffleArray(options),
            correct: correctAnswer,
            answered: false
        };
    },

    createTrueFalseQuestion: function (w) {
        // %50 ihtimalle doğru veya yanlış
        const isTrue = Math.random() < 0.5;
        const correctAnswer = isTrue ? "DOĞRU" : "YANLIŞ";

        let displayedMeaning = "";
        let realMeaning = w.definitions[0]?.core_meaning_tr || "";

        if (isTrue) {
            displayedMeaning = realMeaning;
        } else {
            // Rastgele başka bir kelimenin anlamını al
            const randomWord = ExamUtils.shuffleArray(window.vocabularyData.filter(x => x.word !== w.word))[0];
            displayedMeaning = randomWord.definitions[0]?.core_meaning_tr;
        }

        return {
            type: 'true_false',
            text: `<div class="text-center">
                    <span class="text-3xl font-bold text-primary-900 block mb-3">${w.word}</span>
                    <span class="text-lg text-gray-600">"${displayedMeaning}"</span>
                    <div class="mt-4 text-sm text-gray-400">Bu eşleşme doğru mu?</div>
                   </div>`,
            options: ["DOĞRU", "YANLIŞ"],
            correct: correctAnswer,
            answered: false
        };
    },

    createSentenceBuilderQuestion: function (w, details) {
        // "Sentence Builder" adına yakışır şekilde: Cümle tamamlama
        // Aslında 'Cümle Kur' diyor, yani kelimeleri sıraya dizmek.
        // Ama multiple choice yapısına uydurmak için: "Aşağıdaki cümlelerden hangisi kelimeyi doğru kullanır?"
        // Veya Cloze'un tersi: Anlamı ver, cümleyi seç.

        if (!details.sentence_progression?.levels) return null;

        const correctSentenceObj = ExamUtils.shuffleArray(details.sentence_progression.levels)[0];
        const correctSentence = correctSentenceObj.en;
        const correctMeaning = correctSentenceObj.tr;

        // Yanlış şıklar: Rastgele başka cümleler (başka kelimelerden)
        // Ama elimizde o an sadece bu kelime detayı var.
        // Bu yüzden "sentence scramble" yapalım: Kelimeleri karıştırılmış cümle.

        // Basitleştirme: Doğru cümleyi bul (Türkçesi verilen cümlenin İngilizcesi)
        // Şıklar: 1 Doğru cümle + 3 Rastgele cümle (window.vocabularyData yetmez, detay lazım).
        // Fallback olarak Scramble'a dönüyoruz şimdilik.
        // Veya basitçe: Kelime anlamı sor (ama soru metni farklı)

        return this.createClozeQuestion(w, details); // Şimdilik Cloze gibi davran
    },

    createFallbackQuestion: function (w, type) {
        // Güvenli Fallback: Asla "Yanlış Cevap" yazmasın.
        const correctAnswer = w.definitions[0]?.core_meaning_tr || "Bilinmiyor";

        // Gerçek distroctorlar
        const distractors = ExamUtils.shuffleArray(window.vocabularyData.filter(x => x.word !== w.word)).slice(0, 3);
        const options = [correctAnswer, ...distractors.map(d => d.definitions[0]?.core_meaning_tr)];

        return {
            type: 'fallback',
            text: `<span class="text-3xl font-bold text-primary-900 block mb-2">${w.word}</span> <span class="text-sm text-gray-500 font-normal">(${type} - Basitleştirilmiş Mod)<br>Anlamı nedir?</span>`,
            options: ExamUtils.shuffleArray(options),
            correct: correctAnswer,
            answered: false
        };
    },

    // --- 2. SORU GÖSTERİMİ ---

    showQuestion: function () {
        const q = this.questions[this.currentIndex];
        const area = document.getElementById(this.config.questionAreaId);
        const feedback = document.getElementById(this.config.feedbackId);

        if (feedback) feedback.innerHTML = ""; // Temizle

        let optionsHtml = q.options.map(opt => `
            <button class="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary-700 hover:bg-blue-50 transition-all font-semibold text-gray-700 mb-3 shadow-sm hover:shadow-md active:scale-[0.99]"
                onclick="EnglishExam.checkAnswer(this, '${opt.replace(/'/g, "\\'")}')">
                ${opt}
            </button>
        `).join('');

        // Şık sayısı 2 ise (True/False) yan yana göster
        if (q.options.length === 2) {
            optionsHtml = `
                <div class="grid grid-cols-2 gap-4">
                    ${q.options.map(opt => `
                        <button class="h-16 rounded-xl border-2 font-bold text-lg transition-all shadow-sm hover:shadow-md active:scale-95
                            ${opt === 'DOĞRU' ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300' : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300'}"
                            onclick="EnglishExam.checkAnswer(this, '${opt}')">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
             `;
        }

        area.innerHTML = `
            <div class="mb-6 text-center">
                <span class="inline-block px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-bold shadow-sm border border-gray-200">
                    Soru ${this.currentIndex + 1} / ${this.questions.length}
                </span>
            </div>
            <div class="text-xl text-center mb-8 min-h-[60px] flex items-center justify-center flex-col">
                ${q.text}
            </div>
            <div class="max-w-md mx-auto">
                ${optionsHtml}
            </div>
        `;

        // Listening
        if (q.type === 'listening' && q.audioWord) {
            // setTimeout(() => this.playAudio(q.audioWord), 500); 
        }
    },

    playAudio: function (word) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("TTS not supported");
        }
    },

    // --- 3. CEVAP KONTROLÜ ---

    checkAnswer: function (btn, answer) {
        const q = this.questions[this.currentIndex];
        if (q.answered) return;
        q.answered = true;

        const feedback = document.getElementById(this.config.feedbackId);

        if (answer === q.correct) {
            this.score.correct++;

            // True/False için özel stil değilse standart stil
            if (!btn.classList.contains('bg-green-50')) {
                btn.classList.add('bg-green-100', 'border-green-500', 'text-green-700');
            }

            if (feedback) feedback.innerHTML = `<span class="text-green-600 text-lg animate-bounce inline-block"><i class="fa-solid fa-check-circle"></i> Doğru!</span>`;

        } else {
            this.score.wrong++;

            if (!btn.classList.contains('bg-red-50')) {
                btn.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
            }

            // Doğru cevabı göster
            // True/False için parentElement içindeki doğruyu bul
            if (q.options.length === 2) {
                // True/False butonlarını bul
                // Grid yapısında parent bir div
                const siblings = btn.parentElement.children;
                for (let b of siblings) {
                    if (b.innerText.trim() === q.correct) {
                        b.classList.remove('bg-green-50', 'bg-red-50', 'border-green-200', 'border-red-200'); // Reset base styles potentially
                        b.classList.add('ring-4', 'ring-green-400', 'ring-opacity-50');
                    }
                }
            } else {
                const allBtns = btn.parentElement.querySelectorAll('button');
                allBtns.forEach(b => {
                    if (b.innerText.trim() === q.correct) {
                        b.classList.add('bg-green-50', 'border-green-300', 'text-green-600', 'ring-2', 'ring-green-400', 'ring-opacity-50');
                    }
                });
            }

            if (feedback) feedback.innerHTML = `<span class="text-red-600 text-lg"><i class="fa-solid fa-circle-xmark"></i> Yanlış. Doğru cevap: <strong>${q.correct}</strong></span>`;
        }

        // Otomatik geçiş
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
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

        const successRate = Math.round((this.score.correct / this.questions.length) * 100);
        let message = "Harika iş!";
        if (successRate < 50) message = "Daha çok çalışmalısın.";
        else if (successRate < 80) message = "Gayet iyisin!";

        area.innerHTML = `
            <div class="text-center py-8 fade-in">
                <div class="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Egzersiz Tamamlandı!</h2>
                <p class="text-gray-500 mb-8">${message}</p>
                
                <div class="flex justify-center gap-8 mb-8">
                    <div class="text-center p-4 bg-green-50 rounded-2xl w-24">
                        <div class="text-3xl font-bold text-green-600">${this.score.correct}</div>
                        <div class="text-xs text-green-700 font-bold uppercase tracking-wide mt-1">Doğru</div>
                    </div>
                    <div class="text-center p-4 bg-red-50 rounded-2xl w-24">
                        <div class="text-3xl font-bold text-red-500">${this.score.wrong}</div>
                        <div class="text-xs text-red-700 font-bold uppercase tracking-wide mt-1">Yanlış</div>
                    </div>
                </div>

                <div class="flex justify-center gap-4">
                     <button onclick="EnglishExam.close()" 
                        class="px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors">
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
            grid.style.display = 'grid'; // Grid moduna geri dön
        }
    }
};

window.EnglishExam = EnglishExam;
