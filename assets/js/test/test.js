class EnglishExam {
    constructor(config = {}) {
        this.containerId = config.containerId || 'exam-container';
        this.jsonPath = config.jsonPath || 'questions.json';
        this.questions = [];
        this.currentIndex = 0;
        this.score = { correct: 0, wrong: 0, total: 0 };
        this.timer = 0;
        this.timerInterval = null;
        this.isFinished = false;

        this.init();
    }

    async init() {
        try {
            const response = await fetch(this.jsonPath);
            const data = await response.json();
            this.questions = data.questions;
            this.totalQuestions = this.questions.length;
            this.renderTemplate();
            this.startTimer();
            this.showQuestion();
        } catch (error) {
            console.error("Failed to load questions:", error);
            document.getElementById(this.containerId).innerHTML = "<p>Questions could not be loaded.</p>";
        }
    }

    renderTemplate() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="exam-card">
                <div class="exam-header">
                    <div class="timer-box" id="exam-timer">00:00</div>
                    <div class="stats-group">
                        <div class="stat-item stat-correct">
                            <span class="stat-val" id="count-correct">0</span>
                            <span class="stat-label">Correct</span>
                        </div>
                        <div class="stat-item stat-wrong">
                            <span class="stat-val" id="count-wrong">0</span>
                            <span class="stat-label">Wrong</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-val"><span id="current-q">1</span>/${this.totalQuestions}</span>
                            <span class="stat-label">Question</span>
                        </div>
                    </div>
                </div>
                
                <div class="question-area" id="question-area">
                    <!-- Questions will be injected here -->
                </div>

                <div class="hint-container">
                    <div class="hint-box" id="hint-box"></div>
                </div>

                <div class="exam-footer">
                    <button class="btn-ctrl btn-prev" id="btn-prev" onclick="exam.prevQuestion()">Back</button>
                    <button class="btn-ctrl btn-hint" id="btn-hint" onclick="exam.toggleHint()">Hint</button>
                    <button class="btn-ctrl btn-next" id="btn-next" onclick="exam.nextQuestion()">Next</button>
                </div>
            </div>
        `;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            const minutes = Math.floor(this.timer / 60).toString().padStart(2, '0');
            const seconds = (this.timer % 60).toString().padStart(2, '0');
            const timerEl = document.getElementById('exam-timer');
            if (timerEl) timerEl.innerText = `${minutes}:${seconds}`;
        }, 1000);
    }

    showQuestion() {
        const question = this.questions[this.currentIndex];
        const area = document.getElementById('question-area');
        const currentQEl = document.getElementById('current-q');
        const hintBox = document.getElementById('hint-box');

        if (currentQEl) currentQEl.innerText = this.currentIndex + 1;
        hintBox.style.display = 'none';

        // handle both array based and object based options
        const isArray = Array.isArray(question.options);
        const optionKeys = isArray ? question.options.map((_, i) => i) : Object.keys(question.options);

        let optionsHtml = optionKeys.map((key, idx) => {
            let extraClass = "";
            let disabled = "";

            let optText = isArray ? question.options[key].text : question.options[key];
            let isCorrect = isArray ? question.options[key].isCorrect : (key === question.correct_option);
            let isSelected = question.answered && (question.selectedIndex === key || question.selectedKey === key);

            if (question.answered) {
                disabled = "disabled";
                if (isCorrect) extraClass = "correct";
                if (isSelected && !isCorrect) extraClass = "wrong";
                if (isSelected) extraClass += " selected";
            }

            const label = isArray ? String.fromCharCode(65 + idx) : key;

            return `
                <button class="option-btn ${extraClass}" ${disabled} onclick="exam.handleAnswer(${isArray ? key : `'${key}'`})">
                    <span class="option-label">${label})</span>
                    <span>${optText}</span>
                </button>
            `;
        }).join('');

        area.innerHTML = `
            <div class="question-text">${question.text}</div>
            <div class="options-grid">${optionsHtml}</div>
        `;

        this.updateButtons();
    }


    handleAnswer(keyOrIndex) {
        const question = this.questions[this.currentIndex];
        if (question.answered) return;

        question.answered = true;

        const isArray = Array.isArray(question.options);
        let isCorrect = false;

        if (isArray) {
            question.selectedIndex = keyOrIndex;
            isCorrect = question.options[keyOrIndex].isCorrect;
        } else {
            question.selectedKey = keyOrIndex;
            isCorrect = (keyOrIndex === question.correct_option);
        }

        if (isCorrect) {
            this.score.correct++;
        } else {
            this.score.wrong++;
        }

        this.updateStats();
        this.showQuestion();

        // Auto move to next after 1.5 seconds if correct
        if (isCorrect && this.currentIndex < this.totalQuestions - 1) {
            setTimeout(() => this.nextQuestion(), 1500);
        }
    }


    updateStats() {
        document.getElementById('count-correct').innerText = this.score.correct;
        document.getElementById('count-wrong').innerText = this.score.wrong;
    }

    updateButtons() {
        document.getElementById('btn-prev').disabled = this.currentIndex === 0;
        const nextBtn = document.getElementById('btn-next');
        if (this.currentIndex === this.totalQuestions - 1) {
            nextBtn.innerText = "Finish";
        } else {
            nextBtn.innerText = "Next";
        }
    }

    nextQuestion() {
        if (this.currentIndex < this.totalQuestions - 1) {
            this.currentIndex++;
            this.showQuestion();
        } else {
            this.finishExam();
        }
    }

    prevQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.showQuestion();
        }
    }

    toggleHint() {
        const hintBox = document.getElementById('hint-box');
        const question = this.questions[this.currentIndex];
        hintBox.innerText = question.hint || "No hint available for this question.";
        hintBox.style.display = hintBox.style.display === 'block' ? 'none' : 'block';
    }

    finishExam() {
        clearInterval(this.timerInterval);
        const area = document.getElementById('question-area');
        const footer = document.querySelector('.exam-footer');
        const hintContainer = document.querySelector('.hint-container');

        hintContainer.style.display = 'none';
        footer.style.display = 'none';

        area.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2 style="font-size: 2rem; color: #2d3748; margin-bottom: 20px;">Exam Completed!</h2>
                <div style="font-size: 1.2rem; margin-bottom: 30px;">
                    <p>Total Correct: <strong style="color: #38a169;">${this.score.correct}</strong></p>
                    <p>Total Wrong: <strong style="color: #e53e3e;">${this.score.wrong}</strong></p>
                    <p>Total Time: <strong>${Math.floor(this.timer / 60)}m ${this.timer % 60}s</strong></p>
                </div>
                <button class="btn-ctrl btn-next" onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
}

// Instance for the page
let exam;

