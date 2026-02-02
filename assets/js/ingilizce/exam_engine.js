const EnglishExam = {
    currentData: [],
    currentQuestionIndex: 0,
    currentType: '',
    score: 0,

    init: function () {
        // Load data if available
        if (window.vocabularyData) {
            // Reference global data directly to share cache/state
            this.currentData = window.vocabularyData;
        }
    },

    start: function (type) {
        this.currentType = type;
        this.score = 0;
        this.currentQuestionIndex = 0;

        document.getElementById('eng-exam-grid').style.display = 'none';
        document.getElementById('eng-exam-interface').style.display = 'block';

        this.nextQuestion();
    },

    close: function () {
        document.getElementById('eng-exam-interface').style.display = 'none';
        document.getElementById('eng-exam-grid').style.display = 'grid';
    },

    nextQuestion: async function () {
        const qArea = document.getElementById('eng-exam-question-area');
        const feedback = document.getElementById('eng-exam-feedback');
        feedback.innerText = '';
        feedback.style.color = '#333';

        if (!this.currentData || this.currentData.length === 0) {
            qArea.innerHTML = 'Veri bulunamadı.';
            return;
        }

        // Show Loading
        qArea.innerHTML = '<div style="text-align:center; padding:40px;"><i class="fa-solid fa-spinner fa-spin" style="font-size:2rem; color:#ddd;"></i></div>';

        // Pick random item
        const randIndex = Math.floor(Math.random() * this.currentData.length);
        const item = this.currentData[randIndex];

        // --- Async Fetch if Data Missing ---
        if (item.path && !item.grammar_profile) {
            try {
                const res = await fetch(item.path);
                if (!res.ok) throw new Error("Load failed");
                const json = await res.json();
                Object.assign(item, json); // Cache in place
            } catch (e) {
                console.error(e);
                qArea.innerHTML = `<div style="text-align:center;">Veri yüklenemedi (${item.word}).<br>Sonraki soruya geçiliyor...</div>`;
                setTimeout(() => this.nextQuestion(), 1000);
                return;
            }
        }

        // RENDER BASED ON TYPE
        if (this.currentType === 'meaning') {
            this.renderMeaningQuestion(item, qArea);
        } else if (this.currentType === 'cloze') {
            this.renderClozeQuestion(item, qArea);
        } else if (this.currentType === 'antonym') {
            this.renderAntonymQuestion(item, qArea);
        } else if (this.currentType === 'morphology') {
            this.renderMorphologyQuestion(item, qArea);
        } else if (this.currentType === 'listening') {
            this.renderListeningQuestion(item, qArea);
        } else if (this.currentType === 'scramble') {
            this.renderScrambleQuestion(item, qArea);
        } else if (this.currentType === 'synonym') {
            this.renderSynonymQuestion(item, qArea);
        } else if (this.currentType === 'sentence_builder') {
            this.renderSentenceBuilderQuestion(item, qArea);
        } else if (this.currentType === 'true_false') {
            this.renderTrueFalseQuestion(item, qArea);
        }
    },

    renderMeaningQuestion: function (item, container) {
        document.getElementById('eng-exam-title').innerText = "Kelime Anlamı";

        // Prepare options (1 correct, 3 wrong)
        const def = item.definitions[0];
        const correctAnswer = def.core_meaning_tr;

        // Mock wrong answers just for demo (or pick from other words if available)
        // Since we only have limited words in array, we might not have enough distractors.
        // Let's generic distractors for now if array small.
        let distractors = ["Gitmek", "Koşmak", "Güzel", "Hızlı", "Yemek", "Uyku"];

        // Try to get real distractors
        if (this.currentData.length > 3) {
            distractors = this.currentData
                .filter(w => w.word !== item.word)
                .map(w => w.definitions[0].core_meaning_tr);
        }

        // Shuffle and pick 3
        const options = this.shuffle([correctAnswer, ...this.shuffle(distractors).slice(0, 3)]);

        let html = `
            <div style="text-align:center; margin-bottom:20px;">
                <h2 style="font-size:2.5rem; color:#2c3e50;">${item.word}</h2>
                <p style="color:#718096; font-style:italic;">kelimesi hangi anlama gelir?</p>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                ${options.map(opt => `
                    <button class="btn-outline" onclick="EnglishExam.checkAnswer(this, '${opt}', '${correctAnswer}')" style="padding:15px; text-align:left;">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
        container.innerHTML = html;
    },

    renderClozeQuestion: function (item, container) {
        document.getElementById('eng-exam-title').innerText = "Boşluk Doldurma";

        // Find a suitable sentence
        let sentenceObj = null;
        if (item.definitions[0].example) {
            sentenceObj = item.definitions[0].example;
        }

        if (!sentenceObj) {
            container.innerHTML = "Bu kelime için örnek cümle yok. Sonraki soruya geçiliyor...";
            setTimeout(() => this.nextQuestion(), 1000);
            return;
        }

        // Mask the word
        const cleanSentence = sentenceObj.sentence;
        // Regex to replace word (case insensitive)
        const regex = new RegExp(item.word, 'gi');
        const maskedSentence = cleanSentence.replace(regex, '_______');

        const distractors = ["is", "are", "the", "go", "make"]; // Dummy

        // If we have more words
        let realDistractors = [];
        if (this.currentData.length > 2) {
            realDistractors = this.currentData.filter(x => x.word !== item.word).map(x => x.word);
        } else {
            realDistractors = ["thing", "stuff", "make"];
        }

        const options = this.shuffle([item.word, ...this.shuffle(realDistractors).slice(0, 3)]);

        let html = `
            <div style="text-align:center; margin-bottom:20px;">
                <h3 style="font-size:1.4rem; color:#2c3e50; margin-bottom:10px;">"${maskedSentence}"</h3>
                <p style="color:#718096;">${sentenceObj.translation}</p>
            </div>
            <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                ${options.map(opt => `
                    <button class="btn" onclick="EnglishExam.checkAnswer(this, '${opt}', '${item.word}')">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
        container.innerHTML = html;
    },

    renderAntonymQuestion: function (item, container) {
        document.getElementById('eng-exam-title').innerText = "Zıt Anlam";

        // Check availability
        const nuance = item.lexical_nuance;
        if (!nuance || !nuance.antonyms || nuance.antonyms.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:#999;">Bu kelimenin zıt anlamlısı kayıtlı değil (${item.word}).<br>Otomatik geçiliyor...</div>`;
            setTimeout(() => this.nextQuestion(), 1500);
            return;
        }

        const antData = nuance.antonyms[0];
        const correctAntonym = (typeof antData === 'object') ? antData.word : antData; // Handle object or string

        // Distractors
        let distractors = ["good", "bad", "high", "low"];
        if (this.currentData.length > 2) {
            distractors = this.currentData.filter(x => x.word !== item.word && x.word !== correctAntonym).map(x => x.word);
        }

        const options = this.shuffle([correctAntonym, ...this.shuffle(distractors).slice(0, 3)]);

        let html = `
            <div style="text-align:center; margin-bottom:20px;">
                <h2 style="font-size:2.0rem; color:#c53030;">${item.word}</h2>
                <p>kelimesinin zıt anlamlısı hangisidir?</p>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                ${options.map(opt => `
                    <button class="btn-outline" onclick="EnglishExam.checkAnswer(this, '${opt}', '${correctAntonym}')" style="padding:15px; text-align:center;">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
        container.innerHTML = html;
    },

    renderMorphologyQuestion: function (item, container) {
        document.getElementById('eng-exam-title').innerText = "Kelime Ailesi";

        const fam = (item.morphology_tree && item.morphology_tree.family_members) ? item.morphology_tree.family_members : [];
        if (fam.length === 0) {
            container.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <p>Bu kelime için türev bilgisi yok.</p>
                <p>Geçiliyor...</p>
            </div>`;
            setTimeout(() => this.nextQuestion(), 1500);
            return;
        }

        const target = fam[Math.floor(Math.random() * fam.length)];
        const questionText = `<strong>"${item.word}"</strong> kelimesinin ${target.pos} hali nedir?`;

        // Distractors
        let options = [target.word];
        const fakes = [item.word + "ly", item.word + "tion", item.word + "ness", "un" + item.word];
        options = [...options, ...fakes.slice(0, 3)];
        options = this.shuffle(options);

        let html = `
            <div style="text-align:center; margin-bottom:20px;">
                <p style="font-size:1.2rem;">${questionText}</p>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                ${options.map(opt => `
                    <button class="btn-outline" onclick="EnglishExam.checkAnswer(this, '${opt}', '${target.word}')" style="padding:15px;">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
        container.innerHTML = html;
    },

    renderListeningQuestion: function (item, container) {
        document.getElementById('eng-exam-title').innerText = "Dinle ve Bul";

        let distractors = ["apple", "table", "cable", "stable"];
        if (this.currentData.length > 3) {
            distractors = this.currentData.filter(w => w.word !== item.word).map(w => w.word);
        }
        const options = this.shuffle([item.word, ...this.shuffle(distractors).slice(0, 3)]);

        window.playExamAudio = () => {
            if (window.vocabCard && window.vocabCard.playGoogleAudio) {
                window.vocabCard.playGoogleAudio(item.word);
            } else {
                const u = new SpeechSynthesisUtterance(item.word);
                u.lang = 'en-US';
                window.speechSynthesis.speak(u);
            }
        };

        let html = `
            <div style="text-align:center; margin-bottom:30px;">
                <button onclick="window.playExamAudio()" class="btn" style="border-radius:50%; width:80px; height:80px; font-size:2rem; background:var(--accent-color); color:white; border:none;">🔊</button>
                <p style="margin-top:10px; color:#666;">Butona bas ve duyduğun kelimeyi seç.</p>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                ${options.map(opt => `
                    <button class="btn-outline" onclick="EnglishExam.checkAnswer(this, '${opt}', '${item.word}')" style="padding:15px;">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
        container.innerHTML = html;
    },

    renderScrambleQuestion: function (item, container) {
        document.getElementById('eng-exam-title').innerText = "Harf Karıştırma";

        const meaning = item.definitions[0].core_meaning_tr;
        const letters = item.word.toUpperCase().split('');
        const shuffled = this.shuffle([...letters]);

        window.currentScrambleTarget = item.word.toUpperCase();
        window.currentScrambleInput = [];

        window.addScrambleLetter = (btn, char) => {
            window.currentScrambleInput.push(char);
            document.getElementById('scramble-result').innerText = window.currentScrambleInput.join('');
            btn.disabled = true;
            btn.style.opacity = 0.5;

            if (window.currentScrambleInput.length === window.currentScrambleTarget.length) {
                EnglishExam.checkScramble();
            }
        };

        window.resetScramble = () => {
            window.currentScrambleInput = [];
            document.getElementById('scramble-result').innerText = '_ _ _';
            const btns = document.querySelectorAll('.scramble-btn');
            btns.forEach(b => { b.disabled = false; b.style.opacity = 1; });
        };

        EnglishExam.checkScramble = function () {
            const input = window.currentScrambleInput.join('');
            const feedback = document.getElementById('eng-exam-feedback');
            if (input === window.currentScrambleTarget) {
                feedback.innerHTML = '<span style="color:#48bb78">Doğru! 🎉</span>';
                setTimeout(() => this.nextQuestion(), 1000);
            } else {
                feedback.innerHTML = '<span style="color:#e53e3e">Yanlış. Tekrar deneyin.</span>';
                setTimeout(() => window.resetScramble(), 1000);
            }
        };

        let html = `
            <div style="text-align:center; margin-bottom:20px;">
                <p style="font-size:1.1rem; color:#4a5568;">Anlamı: <strong>${meaning}</strong></p>
                <div id="scramble-result" style="font-family:monospace; font-size:2rem; letter-spacing:5px; margin:20px 0; min-height:40px; border-bottom:2px solid #ddd; display:inline-block; padding:0 20px;">
                    _ _ _
                </div>
            </div>
            <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                ${shuffled.map((char, idx) => `
                    <button class="btn-outline scramble-btn" onclick="addScrambleLetter(this, '${char}')" style="width:50px; height:50px; font-weight:bold; font-size:1.2rem;">
                        ${char}
                    </button>
                `).join('')}
            </div>
            <div style="text-align:center; margin-top:20px;">
                <button onclick="resetScramble()" style="background:none; border:none; text-decoration:underline; cursor:pointer; color:#718096;">Temizle</button>
            </div>
        `;
        container.innerHTML = html;
    },

    renderSynonymQuestion: function (item, container) {
        document.getElementById('eng-exam-title').innerText = "Eş Anlam Avcısı";

        const nuance = item.lexical_nuance;
        if (!nuance || !nuance.synonyms || nuance.synonyms.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:#999;">Bu kelimenin eş anlamlısı kayıtlı değil (${item.word}).<br>Otomatik geçiliyor...</div>`;
            setTimeout(() => this.nextQuestion(), 1500);
            return;
        }

        const synData = nuance.synonyms[0];
        const correctSynonym = (typeof synData === 'object') ? synData.word : synData;

        // Distractors
        let distractors = ["big", "small", "happy", "sad"];
        if (this.currentData.length > 2) {
            distractors = this.currentData.filter(x => x.word !== item.word && x.word !== correctSynonym).map(x => x.word);
        }
        const options = this.shuffle([correctSynonym, ...this.shuffle(distractors).slice(0, 3)]);

        let html = `
            <div style="text-align:center; margin-bottom:20px;">
                <h2 style="font-size:2.0rem; color:#234e52;">${item.word}</h2>
                <p>Kelimesinin <strong>EŞ</strong> anlamlısı hangisidir?</p>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                ${options.map(opt => `
                    <button class="btn-outline" onclick="EnglishExam.checkAnswer(this, '${opt}', '${correctSynonym}')" style="padding:15px; text-align:center;">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
        container.innerHTML = html;
    },

    renderSentenceBuilderQuestion: function (item, container) {
        document.getElementById('eng-exam-title').innerText = "Cümle Kur";

        let sentence = "";
        if (item.definitions && item.definitions[0].example) {
            sentence = item.definitions[0].example.sentence; // "She has the ability to..."
        }
        if (!sentence) {
            this.nextQuestion(); return;
        }

        const words = sentence.split(' ');
        if (words.length > 12) { // Too long
            this.nextQuestion(); return;
        }

        const shuffledWords = this.shuffle([...words]);
        window.currentSentenceTarget = sentence;
        window.currentSentenceInput = [];

        window.addSentenceWord = (btn, word, index) => {
            window.currentSentenceInput.push(word);
            document.getElementById('sentence-result').innerText = window.currentSentenceInput.join(' ');
            btn.style.display = 'none'; // Hide used word

            if (window.currentSentenceInput.length === words.length) {
                const attempt = window.currentSentenceInput.join(' ');
                const feedback = document.getElementById('eng-exam-feedback');
                if (attempt === window.currentSentenceTarget) {
                    feedback.innerHTML = '<span style="color:#48bb78">Harika! Doğru Cümle. 🎉</span>';
                    setTimeout(() => EnglishExam.nextQuestion(), 1500);
                } else {
                    feedback.innerHTML = '<span style="color:#e53e3e">Sıralama hatalı. Tekrar dene.</span>';
                    setTimeout(() => {
                        window.currentSentenceInput = [];
                        document.getElementById('sentence-result').innerText = '...';
                        document.querySelectorAll('.sentence-word-btn').forEach(b => b.style.display = 'inline-block');
                        feedback.innerHTML = '';
                    }, 2000);
                }
            }
        };

        let html = `
             <div style="text-align:center; margin-bottom:20px;">
                <p style="color:#666;">Kelimeleri doğru sıraya diz:</p>
                <div id="sentence-result" style="font-size:1.2rem; min-height:40px; border:1px dashed #ccc; padding:10px; margin-top:10px; background:#fafafa; border-radius:8px;">...</div>
            </div>
            <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
                ${shuffledWords.map((w, i) => `
                    <button class="btn-outline sentence-word-btn" onclick="addSentenceWord(this, '${w.replace(/'/g, "\\'")}', ${i})" style="padding:8px 15px;">
                        ${w}
                    </button>
                `).join('')}
            </div>
             <div style="text-align:center; margin-top:20px;">
                 <p style="font-size:0.8rem; color:#999;">İpucu: Kelimemiz <strong>${item.word}</strong></p>
            </div>
        `;
        container.innerHTML = html;
    },

    renderTrueFalseQuestion: function (item, container) {
        document.getElementById('eng-exam-title').innerText = "Doğru / Yanlış";

        // Decide truth
        const isTrue = Math.random() > 0.5;
        let displayedMeaning = "";

        if (isTrue) {
            displayedMeaning = item.definitions[0].core_meaning_tr;
        } else {
            const other = this.currentData[Math.floor(Math.random() * this.currentData.length)];
            displayedMeaning = other.definitions[0].core_meaning_tr;
            if (other.word === item.word) displayedMeaning = "Tamamen farklı bir şey";
        }

        let html = `
            <div style="text-align:center; margin-bottom:30px;">
                <h2 style="font-size:2rem; margin-bottom:10px;">${item.word}</h2>
                <div style="font-size:2rem; margin:10px 0;">👇</div>
                <div style="font-size:1.3rem; padding:15px; background:#f7fafc; border-radius:8px;">
                    "${displayedMeaning}"
                </div>
                <p style="margin-top:15px; color:#666;">Bu anlam doğru mu?</p>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <button class="btn" onclick="EnglishExam.checkTrueFalse(this, true, ${isTrue})" style="background:#48bb78; border:none; font-size:1.2rem;">DOĞRU ✔️</button>
                <button class="btn" onclick="EnglishExam.checkTrueFalse(this, false, ${isTrue})" style="background:#e53e3e; border:none; font-size:1.2rem;">YANLIŞ ❌</button>
            </div>
        `;
        container.innerHTML = html;

        EnglishExam.checkTrueFalse = function (btn, userSaidTrue, actuallyTrue) {
            const feedback = document.getElementById('eng-exam-feedback');
            if (userSaidTrue === actuallyTrue) {
                feedback.innerHTML = '<span style="color:#48bb78">Bildin! 🎉</span>';
                setTimeout(() => this.nextQuestion(), 800);
            } else {
                feedback.innerHTML = '<span style="color:#e53e3e">Hata yaptın.</span>';
                setTimeout(() => this.nextQuestion(), 1500);
            }
        }
    },

    checkAnswer: function (btn, selected, correct) {
        const feedback = document.getElementById('eng-exam-feedback');

        // Simple case insensitive check
        if (selected.toLowerCase() === correct.toLowerCase()) {
            btn.style.background = '#48bb78'; // Green
            btn.style.color = 'white';
            feedback.innerHTML = '<span style="color:#48bb78">Doğru! 🎉</span>';
            // Auto next
            setTimeout(() => this.nextQuestion(), 1000);
        } else {
            btn.style.background = '#e53e3e'; // Red
            btn.style.color = 'white';
            feedback.innerHTML = `<span style="color:#e53e3e">Yanlış. Doğru cevap: <strong>${correct}</strong></span>`;
            // Wait longer so they see logic
            setTimeout(() => this.nextQuestion(), 2000);
        }
    },

    shuffle: function (array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }
};

window.EnglishExam = EnglishExam;

// Loop and init wait
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main data to load
    setTimeout(() => EnglishExam.init(), 500);
});
