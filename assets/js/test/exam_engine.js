/**
 * Prodil Exam Engine
 * Adapted from Uzman Matematik Engine
 * Handles JSON-based tests, visual timer, drawing canvas, and reporting.
 */

window.ProdilExam = {
    // --- STATE ---
    currentQuestions: [],
    currentIndex: -1,
    currentLevel: "beginner", // info only
    timer: 0,
    timerInterval: null,
    currentJsonPath: null, // Track current test path for switching

    correctCount: 0,
    wrongCount: 0,

    // Canvas State
    isDrawingMode: false,
    isEraser: false,
    canvas: null,
    ctx: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,

    // History for traversing back/next
    // We will store user answers in the question objects themselves

    initialized: false,
    testInfo: null,

    // --- INITIALIZATION ---
    /**
     * Loads a test from a JSON file and starts the exam
     * @param {string} jsonPath - Path to the JSON file
     */
    startTest: async function (jsonPath) {
        try {
            // Ensure loader exists and show it
            this.initLocalLoader();
            this.showLoader(true);

            // Fix Path encoding just in case
            // But usually browsers handle it. 
            // jsonPath is passed from HTML.

            // Store current path for switching logic
            this.currentJsonPath = jsonPath;

            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error("Test dosyasina erisilemedi: " + response.status + " " + response.statusText);

            const data = await response.json();

            // Transform data
            this.testInfo = data.test_info;
            this.currentQuestions = data.questions.map(q => this.transformQuestion(q));

            this.currentIndex = -1;
            this.timer = 0;
            this.correctCount = 0;
            this.wrongCount = 0;

            // Initialize UI
            this.openUI();
            this.syncSelector(); // Sync the dropdown value
            this.nextQuestion();
            this.startTimer();

            // Force hide ANY loader
            setTimeout(() => {
                this.showLoader(false);
                this.forceHideOtherLoaders();
            }, 500);

        } catch (e) {
            console.error(e);
            alert("Test başlatılamadı: " + e.message);
            this.showLoader(false);
        }
    },

    initLocalLoader: function () {
        if (!document.getElementById('prodil-exam-loader')) {
            const l = document.createElement('div');
            l.id = 'prodil-exam-loader';
            l.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.95); z-index:99999; display:none; flex-direction:column; justify-content:center; align-items:center;';
            l.innerHTML = '<div style="font-size:2rem; font-weight:bold; color:#003366; margin-bottom:10px;">Prodil Exam</div><div style="font-size:1rem; color:#666;">Sınav Hazırlanıyor...</div>';
            document.body.appendChild(l);
        }
    },

    /**
     * Switches between tests (Test 1, Test 2, etc.) within the same category
     * @param {string} testName - Name of the test (e.g. "Test 2")
     */
    switchTest: function (testName) {
        if (!this.currentJsonPath) return;

        // Current path example: assets/js/.../Test 1.json
        // We replace "Test X.json" with the new test name
        const parts = this.currentJsonPath.split('/');
        parts[parts.length - 1] = testName + ".json";
        const newPath = parts.join('/');

        this.startTest(newPath);
    },

    syncSelector: function () {
        if (!this.currentJsonPath) return;
        const selector = document.getElementById('test-selector');
        if (selector) {
            const fileName = this.currentJsonPath.split('/').pop().replace('.json', '');
            selector.value = fileName;
        }
    },

    forceHideOtherLoaders: function () {
        const ids = ['preloader', 'loader', 'loading', 'spinner', 'global-loader', 'page-loader'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
                el.style.zIndex = '-1';
            }
        });

        // Also check generic classes
        document.querySelectorAll('.preloader, .loader, .loading-screen, .spinner-wrapper').forEach(el => {
            el.style.display = 'none';
        });
    },

    transformQuestion: function (qJson) {
        // Convert "A": "..." options to array format expected by the engine
        // { text: "...", dogruMu: boolean }
        const options = [];
        const map = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4 };

        Object.keys(qJson.options).forEach(key => {
            options.push({
                text: qJson.options[key],
                dogruMu: key === qJson.correct_option,
                originalLabel: key
            });
        });

        return {
            id: qJson.id,
            metin: qJson.text,
            siklar: options,
            ipucu: qJson.hint,
            cozulduMu: false,
            secilenSikIndex: -1,
            canvasData: null, // Scracthpad data for this question
            cozumSaniyesi: 0
        };
    },

    openUI: function () {
        // Inject CSS if not present
        this.addStyles();

        // Switch visible container
        document.getElementById('accordion-main-container').style.display = 'none';
        document.querySelector('.level-tabs-container').style.display = 'none';

        const container = document.getElementById('prodil-exam-container');
        container.style.display = 'block';
        container.innerHTML = this.getHtmlTemplate();

        // Scroll to the very top so everything (logo, tabs, exam) is visible and not covered by fixed header
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Initialize Canvas
        setTimeout(() => this.initCanvas(), 100);
    },

    closeUI: function () {
        this.stopTimer();

        const container = document.getElementById('prodil-exam-container');
        container.style.display = 'none';
        container.innerHTML = "";

        document.getElementById('accordion-main-container').style.display = 'block';
        document.querySelector('.level-tabs-container').style.display = 'flex';

        // Scroll to the very top so everything (logo, tabs) is visible
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    getHtmlTemplate: function () {
        return `
            <div class="exam-card">
                <!-- Heading Group (Header + Speed Panel) -->
                <div class="exam-heading-group">
                    <!-- Header -->
                    <div class="exam-header">
                        <div class="header-left">
                            <span id="exam-timer" class="timer-text">00:00</span>
                             <div id="scratchpad-controls" style="display:flex; align-items:center; margin-left:8px; gap: 8px;"> <!-- Increased gap to match extra-tools -->
                                 <button id="btn-pen" onclick="ProdilExam.toggleDrawingMode()" class="header-tool-btn" title="Karalama Modu">✎</button>
                                 <div id="extra-tools" style="display:none; align-items:center; gap:8px;"> <!-- Increased gap -->
                                      <button id="btn-eraser" onclick="ProdilExam.toggleEraser()" class="header-tool-btn small-icon" title="Silgi">🧼</button>
                                      <button id="btn-clear" onclick="ProdilExam.clearCanvas()" class="header-tool-btn small-icon" title="Temizle">🗑️</button>
                                 </div>
                            </div>
                        </div>
    
                        <div class="header-center">
                            <button onclick="ProdilExam.toggleSpeedPanel()" class="speed-toggle-btn">
                                HIZ <i class="fa-solid fa-chevron-down ml-1" id="speed-toggle-icon"></i>
                            </button>
                        </div>
                       
                         <div class="header-right" style="display:flex; align-items:center; gap:8px;">                    
                             <span class="timer-text" id="correct-box" style="color:#4ade80;" title="Doğru">0</span> 
                             <span class="timer-text" id="wrong-box" style="color:#f87171;" title="Yanlış">0</span> 
                             <span class="timer-text" id="empty-box" style="color:#9ca3af;" title="Boş">0</span>
                             <button id="btn-close" onclick="ProdilExam.finishTestConfirm()" class="close-btn" title="Testi Bitir">✕</button>
                        </div>
                    </div>
    
                    <!-- Speed Panel (Hidden by default) -->
                    <div id="speed-panel" class="speed-panel" style="display:none;">
                        <div id="exam-speed" style="display:flex; align-items:center; justify-content:center; width:100%;">
                             <span class="speed-unit">Veriler toplanıyor...</span>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div id="soru-alan-kaplayici" style="position: relative; flex: 1;">
                    <div id="soru-alani" class="question-area"></div>
                    <canvas id="drawing-canvas"></canvas>
                </div>

                <!-- Footer -->
                <div id="kontrol-paneli" class="control-panel">
                    <button onclick="ProdilExam.prevQuestion()" class="btn-action btn-secondary" id="btn-prev">
                        <i class="fa-solid fa-chevron-left mr-2"></i> Geri
                    </button>

                    <button id="btn-hint" onclick="ProdilExam.toggleHint()" class="btn-action btn-secondary btn-hint-trig">
                        İpucu
                    </button>

                    <div class="level-selector">
                        <select id="test-selector" 
                                onfocus="this.classList.add('btn-active')" 
                                onblur="this.classList.remove('btn-active')"
                                onchange="ProdilExam.switchTest(this.value)">
                            <option value="Test 1">Test 1</option>
                            <option value="Test 2">Test 2</option>
                            <option value="Test 3">Test 3</option>
                            <option value="Test 4">Test 4</option>
                            <option value="Test 5">Test 5</option>
                        </select>
                    </div>

                    <button onclick="ProdilExam.nextQuestion()" class="btn-action btn-primary" id="btn-next">
                        İleri <i class="fa-solid fa-chevron-right ml-2"></i>
                    </button>
                </div>

                <!-- Hint (Moved below buttons) -->
                <div id="ipucu-metni" class="hint-box" style="display:none;"></div>
            </div>
        `;
    },

    // --- CORE LOGIC ---

    nextQuestion: function () {
        this.saveCurrentState();

        if (this.currentIndex < this.currentQuestions.length - 1) {
            this.currentIndex++;
            this.renderQuestion(this.currentQuestions[this.currentIndex]);
        } else {
            // End of test
            this.finishTestConfirm();
        }
        this.updateButtons();
        this.updateStatsUI();
    },

    prevQuestion: function () {
        this.saveCurrentState();

        // Flash "Back" button specifically
        const prevBtn = document.getElementById('btn-prev');
        if (prevBtn) {
            prevBtn.classList.remove('flash-btn');
            void prevBtn.offsetWidth; // Trigger reflow
            prevBtn.classList.add('flash-btn');
        }

        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderQuestion(this.currentQuestions[this.currentIndex]);
            this.updateButtons();
            this.updateStatsUI();
        }
    },

    renderQuestion: function (q) {
        const area = document.getElementById('soru-alani');

        // Hide hint
        const hintBox = document.getElementById('ipucu-metni');
        if (hintBox) hintBox.style.display = 'none';

        const hintBtn = document.getElementById('btn-hint');
        if (hintBtn) {
            hintBtn.innerHTML = 'İpucu';
            hintBtn.classList.remove('btn-active');
        }

        // Load Canvas
        this.loadCanvasState(q);

        const qNum = this.currentIndex + 1;

        let html = `
            <div class="math-text">
                <span class="question-prefix">${qNum}) </span>
                <div style="flex: 1;">${q.metin}</div>
            </div>
            <div class="options-grid">
        `;

        q.siklar.forEach((opt, idx) => {
            const letter = opt.originalLabel || ["A", "B", "C", "D", "E"][idx];

            let extraClass = '';
            let disabled = '';

            // If already solved
            if (q.cozulduMu) {
                disabled = 'disabled';
                if (q.secilenSikIndex === idx) {
                    extraClass = opt.dogruMu ? 'correct' : 'wrong';
                }
                if (opt.dogruMu) extraClass += ' correct'; // Always show correct one
            }

            html += `
                <button class="option-btn ${extraClass}" onclick="ProdilExam.checkAnswer(this, ${idx})" ${disabled}>
                    <span class="option-label">${letter})</span>
                    <span>${opt.text}</span>
                </button>
            `;
        });

        html += `</div>`;
        area.innerHTML = html;

        this.activeHint = q.ipucu;
    },

    checkAnswer: function (btn, idx) {
        const q = this.currentQuestions[this.currentIndex];
        if (q.cozulduMu) return;

        q.cozulduMu = true;
        q.secilenSikIndex = idx;
        q.cozumSaniyesi = this.timer;

        const isCorrect = q.siklar[idx].dogruMu;

        if (isCorrect) {
            this.correctCount++;
            btn.classList.add('correct');
            // Flash 0.5s before moving to next question (at 1000ms)
            setTimeout(() => this.flashNextButton(), 500);
            setTimeout(() => this.nextQuestion(), 1000);
        } else {
            this.wrongCount++;
            btn.classList.add('wrong');
            // Show correct one
            const btns = document.querySelectorAll('.option-btn');
            q.siklar.forEach((opt, i) => {
                if (opt.dogruMu) btns[i].classList.add('correct');
            });
            // Flash 0.5s before moving to next question (at 2000ms)
            setTimeout(() => this.flashNextButton(), 1500);
            setTimeout(() => this.nextQuestion(), 2000);
        }

        // Disable all
        const btns = document.querySelectorAll('.option-btn');
        btns.forEach(b => b.disabled = true);

        this.updateStatsUI();
    },

    flashNextButton: function () {
        const nextBtn = document.getElementById('btn-next');
        if (nextBtn) {
            nextBtn.classList.remove('flash-btn');
            void nextBtn.offsetWidth; // Trigger reflow
            nextBtn.classList.add('flash-btn');
        }
    },

    toggleHint: function () {
        const box = document.getElementById('ipucu-metni');
        const btn = document.getElementById('btn-hint');
        if (!box || !btn) return;

        const isVisible = box.style.display !== 'none';

        if (isVisible) {
            box.style.display = 'none';
            btn.innerHTML = 'İpucu';
            btn.classList.remove('btn-active');
        } else {
            if (this.activeHint) {
                box.innerHTML = this.activeHint;
            } else {
                box.innerHTML = "Bu soru için ipucu bulunmuyor.";
            }
            box.style.display = 'block';
            btn.classList.add('btn-active');
            const isMobile = window.innerWidth < 768;
            btn.innerHTML = isMobile ? 'Kapat' : 'İpucunu Kapat';
        }
    },

    toggleSpeedPanel: function () {
        const panel = document.getElementById('speed-panel');
        const icon = document.getElementById('speed-toggle-icon');
        if (panel.style.display === 'none') {
            panel.style.display = 'flex';
            if (icon) icon.className = "fa-solid fa-chevron-up ml-1";
            // Resize canvas if needed when layout changes
            setTimeout(() => this.initCanvas(), 50);
        } else {
            panel.style.display = 'none';
            if (icon) icon.className = "fa-solid fa-chevron-down ml-1";
            setTimeout(() => this.initCanvas(), 50);
        }
    },

    // --- CANVAS (SCRATCHPAD) ---
    initCanvas: function () {
        this.canvas = document.getElementById('drawing-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // Resize handling
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;

        // Events
        const start = (e) => this.startDrawing(e);
        const move = (e) => this.draw(e);
        const end = () => this.stopDrawing();

        this.canvas.addEventListener('mousedown', start);
        this.canvas.addEventListener('mousemove', move);
        this.canvas.addEventListener('mouseup', end);
        this.canvas.addEventListener('mouseout', end);

        this.canvas.addEventListener('touchstart', start, { passive: false });
        this.canvas.addEventListener('touchmove', move, { passive: false });
        this.canvas.addEventListener('touchend', end);
    },

    toggleDrawingMode: function () {
        this.isDrawingMode = !this.isDrawingMode;
        const btn = document.getElementById('btn-pen');
        const extras = document.getElementById('extra-tools');
        const canvas = document.getElementById('drawing-canvas');

        if (this.isDrawingMode) {
            btn.classList.add('active');
            extras.style.display = 'flex';
            canvas.style.pointerEvents = 'auto';
            canvas.style.zIndex = '10';
        } else {
            btn.classList.remove('active');
            extras.style.display = 'none';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '0';
        }
    },

    toggleEraser: function () {
        this.isEraser = !this.isEraser;
        const eBtn = document.getElementById('btn-eraser');
        if (this.isEraser) eBtn.classList.add('active');
        else eBtn.classList.remove('active');
    },

    clearCanvas: function () {
        if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    startDrawing: function (e) {
        if (!this.isDrawingMode) return;
        e.preventDefault();
        this.isDrawing = true;
        const pos = this.getPos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;

        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        if (this.isEraser) {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineWidth = 20;
        } else {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = '#ef4444';
        }
    },

    draw: function (e) {
        if (!this.isDrawing || !this.isDrawingMode) return;
        e.preventDefault();
        const pos = this.getPos(e);

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();

        this.lastX = pos.x;
        this.lastY = pos.y;
    },

    stopDrawing: function () {
        this.isDrawing = false;
    },

    getPos: function (e) {
        const rect = this.canvas.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.changedTouches && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        }
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    },

    saveCurrentState: function () {
        if (this.currentIndex >= 0 && this.canvas) {
            const q = this.currentQuestions[this.currentIndex];
            if (q) q.canvasData = this.canvas.toDataURL();
        }
    },

    loadCanvasState: function (q) {
        this.clearCanvas();
        if (q.canvasData && this.ctx) {
            const img = new Image();
            img.onload = () => this.ctx.drawImage(img, 0, 0);
            img.src = q.canvasData;
        }
    },

    // --- TIMERS & STATS ---
    startTimer: function () {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;

            // Update time display
            const el = document.getElementById('exam-timer');
            const m = Math.floor(this.timer / 60).toString().padStart(2, '0');
            const s = (this.timer % 60).toString().padStart(2, '0');
            if (el) el.innerText = `${m}:${s}`;

            this.updateStatsUI();
        }, 1000);
    },

    stopTimer: function () {
        if (this.timerInterval) clearInterval(this.timerInterval);
    },

    updateStatsUI: function () {
        const total = this.currentQuestions.length;

        // Calculate 'seen' based on whether current question is answered or not
        // This prevents the empty count from flickering when answering a question
        let seen = this.currentIndex;
        if (this.currentQuestions[this.currentIndex] && this.currentQuestions[this.currentIndex].cozulduMu) {
            seen += 1;
        }

        // Logic: Empty is (Questions Accounted For) - (Correct + Wrong)
        // If current is answered, it's accounted for. If not, it's not (it's pending).
        // Skipped questions from previous indices differ from pending current question.
        const empty = Math.max(0, seen - this.correctCount - this.wrongCount);

        // Update boxes
        const cBox = document.getElementById('correct-box');
        const wBox = document.getElementById('wrong-box');
        const eBox = document.getElementById('empty-box');

        if (cBox) {
            cBox.innerText = this.correctCount;
            cBox.style.display = this.correctCount > 0 ? 'inline' : 'none';
        }
        if (wBox) {
            wBox.innerText = this.wrongCount;
            wBox.style.display = this.wrongCount > 0 ? 'inline' : 'none';
        }
        if (eBox) {
            eBox.innerText = empty;
            eBox.style.display = empty > 0 ? 'inline' : 'none';
        }

        // Speed Metrics
        const speedEl = document.getElementById('exam-speed');
        if (speedEl && this.timer > 0) {
            const qsPerHour = Math.round((seen / this.timer) * 3600);
            const correctPerHour = Math.round((this.correctCount / this.timer) * 3600);
            const wrongPerHour = Math.round((this.wrongCount / this.timer) * 3600);
            const emptyPerHour = Math.round((empty / this.timer) * 3600);

            speedEl.innerHTML = `
                <div class="speed-metric"><span class="speed-value">${Math.max(0, qsPerHour)}</span><span class="speed-unit">so/sa</span></div>
                <span class="speed-divider">|</span>
                <div class="speed-metric speed-correct"><span class="speed-value">${Math.max(0, correctPerHour)}</span><span class="speed-unit">do/sa</span></div>
                <span class="speed-divider">|</span>
                <div class="speed-metric speed-wrong"><span class="speed-value">${Math.max(0, wrongPerHour)}</span><span class="speed-unit">ya/sa</span></div>
                <span class="speed-divider">|</span>
                <div class="speed-metric speed-empty"><span class="speed-value">${Math.max(0, emptyPerHour)}</span><span class="speed-unit">bo/sa</span></div>
            `;
        }
    },

    updateButtons: function () {
        const btnPrev = document.getElementById('btn-prev');
        if (btnPrev) {
            btnPrev.disabled = (this.currentIndex <= 0);
            btnPrev.style.opacity = (this.currentIndex <= 0) ? '0.5' : '1';
        }

        const btnNext = document.getElementById('btn-next');
        if (btnNext) {
            if (this.currentIndex === this.currentQuestions.length - 1) {
                btnNext.innerHTML = 'Bitir <i class="fa-solid fa-flag-checkered ml-2"></i>';
            } else {
                btnNext.innerHTML = 'İleri <i class="fa-solid fa-chevron-right ml-2"></i>';
            }
        }
    },

    // --- FINISH & REPORT ---
    finishTestConfirm: function () {
        this.showReport();
    },

    showReport: function () {
        // Stop timer
        this.stopTimer();

        // 1. Calculate Stats
        const total = this.currentQuestions.length;
        const correct = this.correctCount;
        const wrong = this.wrongCount;
        const empty = total - correct - wrong;
        const net = correct - (wrong * 0.25);

        const durationSec = this.timer;
        const durationMin = durationSec / 60;

        // Speed: Based on SEEN questions (currentIndex + 1), not TOTAL (20) if finished early.
        const visited = this.currentIndex + 1;
        const speed = durationSec > 0 ? Math.round((visited / durationSec) * 3600) : 0;
        const netSpeed = durationSec > 0 ? Math.round((net / durationMin) * 60) : 0;

        // --- SCORES ---
        // Base Score (0-100)
        let rawScore = (net / total) * 100;
        if (rawScore < 0) rawScore = 0;

        // Speed Bonus
        const avgTimePerQ = durationSec / total;
        let speedBonus = 0;
        if (avgTimePerQ < 40) speedBonus = 10;
        else if (avgTimePerQ < 60) speedBonus = 5;

        const finalScore = Math.min(100, Math.round(rawScore + speedBonus));

        // SKERA (Mental)
        // SKERA (Mental)
        // Accuracy based on TOTAL (20 questions), so empty/unseen questions reduce accuracy.
        const accuracy = (correct / total) || 0;
        let skeraScore = -2;
        if (accuracy > 0.9) skeraScore = 8;
        else if (accuracy > 0.7) skeraScore = 5;
        else if (accuracy > 0.5) skeraScore = 2;

        const skeraPercent = Math.min(100, Math.max(0, ((skeraScore + 10) / 20) * 100));
        let skeraColor = skeraScore > 0 ? "#16a34a" : "#dc2626";

        // Performance (Physical)
        let perfLevel = 3;
        if (speed > 180 && accuracy > 0.6) perfLevel = 8; // Harder threshold: > 180 q/h and > 60% accuracy
        else if (speed > 120) perfLevel = 6; // Harder threshold: > 120 q/h (2 q/min) for Dynamic
        let perfColor = perfLevel >= 7 ? "#16a34a" : "#ca8a04";

        // Messages
        const skeraTitle = skeraScore > 5 ? "Zihinsel Durum: Mükemmel" : "Zihinsel Durum: Geliştirilmeli";
        const skeraMsg = skeraScore > 5 ? "Soruları çözerken odağını çok iyi korudun." : "Dikkat dağınıklığı yaşamış olabilirsin.";

        const perfTitle = perfLevel >= 6 ? "Fiziksel Durum: Dinamik" : "Fiziksel Durum: Yorgun";
        const perfMsg = perfLevel >= 6 ? "Hızın ve ritmin gayet yerinde." : "Biraz daha tempoyu artırabilirsin.";

        const container = document.getElementById('prodil-exam-container');
        if (!container) return;

        container.innerHTML = `
            <div class="exam-card report-mode" style="padding: 0; overflow: hidden; height: auto; min-height: auto;">
                <div class="exam-header">
                     <div style="font-weight: bold;">SINAV SONUÇ RAPORU</div>
                     <button onclick="ProdilExam.closeUI()" class="close-btn" title="Kapat">✕</button>
                </div>

                <div style="padding: 25px; overflow-y: auto; max-height: 80vh;">
                    
                    <!-- SUMMARY HEADER -->
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div class="total-score-box" style="padding: 10px 0; display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 5px;">
                             <i class="fa-solid fa-trophy" style="font-size: 1.4rem; color: #f59e0b;"></i>
                             <div class="score-lbl" style="font-size: 1.2rem; margin:0; color: #374151; font-weight:600;">Toplam Puan :</div>
                             <span class="score-val" style="font-size: 1.8rem; font-weight:800; color:#111827;">${finalScore}</span>
                             <span style="font-size: 0.9rem; color: #9ca3af; margin-top:4px;">(Max 100)</span>
                        </div>
                         <div style="margin-top: 10px; display: flex; justify-content: center; gap: 8px; font-size: 0.8rem;">
                             <div style="background: #f9fafb; padding: 4px 8px; border-radius: 6px; border: 1px solid #e5e7eb; color: #4b5563;">
                                Net Puan: <strong>${net.toFixed(2)}</strong>
                             </div>
                             <div style="background: #eff6ff; padding: 4px 8px; border-radius: 6px; border: 1px solid #dbeafe; color: #1d4ed8;">
                                Hız: <strong>+${speedBonus}</strong>
                             </div>
                             <div style="background: ${skeraScore >= 0 ? '#f0fdf4' : '#fef2f2'}; padding: 4px 8px; border-radius: 6px; border: 1px solid ${skeraScore >= 0 ? '#bbf7d0' : '#fecaca'}; color: ${skeraScore >= 0 ? '#15803d' : '#b91c1c'};">
                                SKERA: <strong>${skeraScore >= 0 ? '+' + skeraScore : skeraScore}</strong>
                             </div>
                        </div>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 15px 0;">

                    <div style="display: flex; flex-wrap: wrap; gap: 10px; background:#f9fafb; padding:10px; border-radius:8px; margin-bottom: 20px;">
                        <!-- Left Column: Basic Stats -->
                        <ul style="flex: 1; list-style: none; padding: 0; margin: 0; min-width: 130px;">
                            <li style="display: flex; justify-content: flex-start; align-items: center; gap: 0; margin-bottom: 8px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; width: 70px; font-weight: bold;"><span style="width:8px; height:8px; background:#16a34a; border-radius:50%; margin-right:6px;"></span>Doğru:</span> 
                                <span style="color:#16a34a; font-size: 0.9rem;">${correct}</span>
                            </li>
                            <li style="display: flex; justify-content: flex-start; align-items: center; gap: 0; margin-bottom: 8px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; width: 70px; font-weight: bold;"><span style="width:8px; height:8px; background:#dc2626; border-radius:50%; margin-right:6px;"></span>Yanlış:</span> 
                                <span style="color:#dc2626; font-size: 0.9rem;">${wrong}</span>
                            </li>
                            <li style="display: flex; justify-content: flex-start; align-items: center; gap: 0; margin-bottom: 8px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; width: 70px; font-weight: bold;"><span style="width:8px; height:8px; background:#9ca3af; border-radius:50%; margin-right:6px;"></span>Boş:</span> 
                                <span style="color:#6b7280; font-size: 0.9rem;">${empty}</span>
                            </li>
                            <li style="display: flex; justify-content: flex-start; align-items: center; gap: 0; margin-bottom: 4px; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; width: 70px; font-weight: bold;"><span style="width:8px; height:8px; background:#3b82f6; border-radius:50%; margin-right:6px;"></span>Net:</span> 
                                <span style="color:#3b82f6; font-size: 0.9rem;">${net.toFixed(2)}</span>
                            </li>
                        </ul>

                        <!-- Right Column: Time & Speed Stats -->
                        <ul style="flex: 1; list-style: none; padding: 0; margin: 0; min-width: 130px;">
                            <li style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; font-weight: bold;"><i class="fa-regular fa-clock" style="margin-right:6px; color:#64748b; font-size: 0.9em;"></i>Süre:</span> 
                                <span style="color:#1e293b; font-size: 0.9rem;">${Math.floor(durationMin)} dk ${durationSec % 60} sn</span>
                            </li>
                            <li style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; font-weight: bold;"><i class="fa-solid fa-bolt" style="margin-right:6px; color:#f59e0b; font-size: 0.9em;"></i>Hız:</span> 
                                <span style="color:#1e293b; font-size: 0.9rem;">${speed} soru/saat</span>
                            </li>
                            <li style="display: flex; justify-content: space-between; margin-bottom: 4px; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; font-weight: bold;"><i class="fa-solid fa-chart-line" style="margin-right:6px; color:#8b5cf6; font-size: 0.9em;"></i>Net Hız:</span> 
                                <span style="color:#1e293b; font-size: 0.9rem;">${netSpeed} net/saat</span>
                            </li>
                        </ul>
                    </div>

                    <!-- PERFORMANCE ANALYSIS -->
                    <div class="report-analysis-box" style="background:#fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <h4 style="color:#d97706; display:flex; justify-content:space-between; font-weight: 800;">
                            Performans Analizi (Fiziksel)
                            <span style="background:${perfColor}; color:white; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight: 500;">Seviye ${perfLevel}/10</span>
                        </h4>
                        <div style="font-weight:500; color:#78350f; margin-bottom:5px;">${perfTitle}</div>
                        <p style="margin:0; font-size:0.9rem; color:#92400e;">${perfMsg}</p>
                    </div>

                    <!-- SKERA ANALYSIS -->
                    <div class="report-analysis-box" style="background:#fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <h4 style="color:#1e40af; display:flex; justify-content:space-between; font-weight: 800;">
                            SKERA Analizi (Zihinsel)
                            <span style="background:${skeraColor}; color:white; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight: 500;">Puan: ${skeraScore > 0 ? '+' + skeraScore : skeraScore}</span>
                        </h4>
                        <div style="font-weight:500; color:#1e3a8a; margin-bottom:5px;">${skeraTitle}</div>
                        <p style="margin:0; font-size:0.9rem; color:#1e3a8a;">${skeraMsg}</p>
                        <div style="margin-top:10px; background:rgba(255,255,255,0.5); height:6px; border-radius:3px;">
                            <div style="width:${skeraPercent}%; background:${skeraColor}; height:100%; border-radius:3px;"></div>
                        </div>
                    </div>

                    <!-- CONDITION CHART -->
                    <div class="report-analysis-box" style="background:transparent; border:none; padding:0; margin-bottom:20px; box-shadow:none;">
                        <h4 style="color:#7c3aed; font-weight: 800;">Kondisyon Analizi</h4>
                        <div style="height: 200px;">
                            <canvas id="kondisyonChart"></canvas>
                        </div>
                    </div>

                </div>

                <!-- FOOTER ACTIONS -->
                <div class="control-panel" style="padding: 15px; border-top: 1px solid #eee; display:flex; gap:10px;">
                    <button onclick="ProdilExam.restartExam()" class="btn-action btn-secondary" style="flex:1; justify-content:center;">🔄 TEKRAR</button>
                    <button onclick="ProdilExam.shareReport()" class="btn-action btn-primary" style="flex:1; justify-content:center;">📤 PAYLAŞ</button>
                </div>
            </div>
        `;

        // Render Chart
        setTimeout(() => {
            const ctx = document.getElementById('kondisyonChart');
            if (ctx && window.Chart) {
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['%0-20', '%20-40', '%40-60', '%60-80', '%80-100'],
                        datasets: [{
                            label: 'Net Hız (net/sa)',
                            data: [netSpeed * 0.8, netSpeed * 0.9, netSpeed, netSpeed * 0.95, netSpeed * 1.05],
                            borderColor: '#7c3aed',
                            backgroundColor: 'rgba(124, 58, 237, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });
            }
        }, 100);
    },

    restartExam: function () {
        this.closeUI();
        // Optionally restart immediately
        // this.startTest(this.currentPath);
    },

    shareReport: function () {
        if (window.html2canvas) {
            const el = document.querySelector('.exam-card');
            html2canvas(el).then(c => {
                const a = document.createElement('a');
                a.download = 'Sonuc_Raporu.png';
                a.href = c.toDataURL();
                a.click();
            });
        } else {
            alert("Paylaşım özelliği yüklenemedi.");
        }
    },

    // --- UTILS ---
    showLoader: function (show) {
        const l = document.getElementById('prodil-exam-loader'); // Use our own loader
        // Also check legacy
        const l2 = document.getElementById('preloader');

        if (show) {
            if (l) l.style.display = 'flex';
            if (l2) l2.style.display = 'flex';
        } else {
            if (l) l.style.display = 'none';
            if (l2) l2.style.display = 'none';
        }
    },

    addStyles: function () {
        if (document.getElementById('prodil-exam-styles')) return;
        const style = document.createElement('style');
        style.id = 'prodil-exam-styles';
        style.innerHTML = `
            /* Container Injection */
            #prodil-exam-container {
                max-width: 100%;
                margin: 0 auto;
                background: white;
                min-height: 100vh;
            }
            
            /* Copied & Adapted CSS */
            .exam-card { 
                background: white; 
                border-radius: 0; 
                border: none;
                box-shadow: none; 
                overflow: hidden;
                display: flex;
                flex-direction: column;
                min-height: 100vh;
                position: relative;
            }

            .exam-heading-group {
                background: #fff;
                /* border-bottom: 1px solid #e2e8f0; Removed here, moved to speed panel bottom if needed, or keep both? User said "line below it match line above it". Assuming line above came from this. */
                border-bottom: 1px solid #e2e8f0; 
                display: flex;
                flex-direction: column;
            }

            .exam-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 2px; /* Minimal padding to align with content border */
                background: transparent;
                height: 28px; /* Extremely compact mobile */
                position: relative;
                z-index: 2;
                transition: all 0.3s ease;
            }
            
            @media (min-width: 768px) {
                .exam-header {
                    height: 50px; /* Expanded for desktop */
                    padding: 0 20px; /* Better spacing */
                }
            }
            
            .header-left { display: flex; align-items: center; margin-left: -2px; } /* Reset from -10px to align with content below */
            
            .header-left, .header-right { flex: 1; display: flex; align-items: center; }
            .header-right { justify-content: flex-end; gap: 5px; }
            /* Center absolutely positioned to not be pushed by dynamic left/right content */
            .header-center { 
                position: absolute; 
                left: 50%; 
                transform: translateX(-50%);
                display: flex; 
                justify-content: center; 
                width: auto;
                z-index: 10;
            }

            .timer-text {
                font-size: 1.1rem;
                font-weight: 500; /* Reduced from 700 to look less bold but readable */
                color: #374151;
                color: #374151;
                font-variant-numeric: tabular-nums;
            }
            .header-left .timer-text { 
                width: 38px; /* Fixed width to prevent jitter */
                text-align: right; /* Align right towards the icon */
                padding-right: 4px; /* Small gap to icon */
                padding-left: 0;
            } 

            /* Desktop Overrides */
            @media (min-width: 768px) {
                .header-left .timer-text { 
                    width: 50px; /* Wider but left aligned */
                    text-align: left; 
                }
                .exam-header {
                    height: 50px; /* Expanded for desktop */
                    padding: 0 5px; /* Slight desktop offset */
                }
            }
            .header-right .timer-text {
                font-size: 1.0rem; 
            }
            /* Speed Stats Styling */
            .speed-metric { font-size: 0.75rem; display:flex; flex-direction:column; align-items:center; line-height: 1; margin: 0 5px; color: #64748b; } /* Default soft color */
            .speed-value { font-weight: 800; font-size: 0.85rem; margin-bottom: 2px; color: inherit; } /* Reduced from 1rem, inherit color */
            .speed-unit { font-size: 0.65rem; color: inherit; } /* Inherit color from parent */
            
            .speed-correct { color: #4ade80 !important; }
            .speed-wrong { color: #f87171 !important; }
            .speed-empty { color: #9ca3af !important; }
            
            .speed-divider { color: #f1f5f9; font-weight: 300; font-size: 1.2rem; margin: 0 2px; }

            .close-btn {
                background: none; border: none; font-size: 1.2rem; color: #000000; cursor: pointer;
                font-weight: 800; /* Made bolder as requested */
                margin-left: 5px; /* Added spacing from counters */
            }
            .close-btn:hover { color: #ef4444; }

            /* Question Area */
            .question-area {
                padding: 10px 5px 5px 2px; /* Shift left: Top Right Bottom Left */
                font-size: 1.2rem;
            }
            
            .math-text {
                margin-top: 8px; /* Push question down slightly */
                margin-bottom: 8px; /* Pull options up closer to question */
                color: #1f2937;
                font-weight: 500;
                line-height: 1.5;
                display: flex;
            }
            .question-prefix { font-weight: 800; margin-right: 8px; color: #000000; }

            .options-grid {
                display: grid;
                gap: 2px; /* Super tight gap on mobile */
            }
            
            .option-btn {
                padding: 4px 15px; /* Minimal padding */
                border: 1px solid transparent; /* Remove visible border by default, keep layout */
                border-radius: 8px; /* Slightly sharper radius */
                background: transparent; /* Remove background */
                text-align: left;
                cursor: pointer;
                font-size: 1.2rem;
                color: #374151;
                transition: all 0.2s;
                display: flex;
                align-items: center;
            }
            
            .option-btn:hover:not(:disabled) {
                border-color: #cbd5e1;
                background: #f8fafc;
            }
            
            .option-btn.correct {
                background: #dcfce7;
                border-color: #22c55e;
                color: #14532d;
            }
            
            .option-btn.wrong {
                background: #fee2e2;
                border-color: #ef4444;
                color: #7f1d1d;
            }
            
            .option-label {
                font-weight: 700;
                margin-right: 2px; /* Set to ~1 char space on mobile */
                color: #000000;
                width: 15px; /* Reduced width for tight mobile layout */
                flex-shrink: 0;
            }
            .option-btn.correct .option-label { color: #14532d; }
            .option-btn.wrong .option-label { color: #7f1d1d; }

            /* Desktop Overrides for Better Spacing */
            @media (min-width: 768px) {
                 .exam-header {
                    height: 40px; /* Reduced from 50px */
                    padding: 0 15px; /* Slightly reduced padding */
                }
                .timer-text {
                    font-size: 1.0rem; /* Slightly reduced */
                    line-height: 40px; /* Match new header height */
                }
                .header-right .timer-text {
                    font-size: 1.0rem; /* Keep them consistent */
                }
                .speed-toggle-btn {
                    height: 28px;
                    padding: 0 12px;
                    font-size: 0.85rem;
                }
                .header-tool-btn {
                    font-size: 1.0rem; /* Slightly reduced */
                    padding: 5px;
                }
                .option-label {
                    margin-right: 8px; /* Standard spacing on desktop */
                    width: 20px;
                }
                .question-area { padding: 20px; font-size: 1.1rem; } /* Restore padding but smaller than 30px */
                .options-grid { gap: 8px; } /* Restore gap on desktop */
                .option-btn { padding: 8px 15px; } /* Restore padding but smaller than 10px */
            }

            /* Footer Controls */
            .control-panel {
                padding: 16px 20px;
                background: #fff;
                border-top: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
            }
            
            .btn-action, .level-selector {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                min-width: 0; /* Prevent flex blowouts */
            }

            .btn-action, .level-selector select {
                width: 100%;
                height: 48px; /* Restored to original browser height */
                border-radius: 12px; /* Restored to original radius */
                font-family: 'Inter', sans-serif;
                font-weight: 600; /* Restored to original weight */
                font-size: 0.95rem; /* Restored to original size */
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                border: 2px solid #e2e8f0; /* Matching .tab-btn border */
                letter-spacing: 0.025em;
                outline: none; /* Remove default orange browser focus ring */
            }

            /* Secondary Buttons (Back, Hint) */
            .btn-secondary { 
                background: #f8fafc; 
                border: 1px solid #e2e8f0;
                color: #475569; 
            }
            .btn-secondary:hover:not(:disabled) { 
                background: #fff; 
                border-color: #cbd5e1;
                transform: translateY(-1px);
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            
            /* Active State (for Hint etc.) */
            .btn-active {
                background: #003366 !important;
                color: white !important;
                border-color: #003366 !important;
                box-shadow: 0 4px 6px rgba(0, 51, 102, 0.2);
            }
            
            /* Primary Button (Next) - Initially Neutral, Blue on Hover/Press */
            .btn-primary { 
                background: #f8fafc; 
                color: #475569; 
                border-color: #e2e8f0 !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .btn-primary:hover:not(:disabled), .btn-primary:active:not(:disabled) { 
                background: #003366 !important; 
                color: white !important;
                border-color: #003366 !important;
                transform: translateY(-2px);
                box-shadow: 0 8px 15px -4px rgba(0, 51, 102, 0.4);
            }
            
            /* Flash Animation for Auto-Next */
            .flash-btn {
                animation: flashBlue 0.5s ease-in-out;
            }
            @keyframes flashBlue {
                0% { background: #f8fafc; color: #475569; }
                50% { background: #003366; color: white; border-color: #003366; }
                100% { background: #f8fafc; color: #475569; }
            }
            
            /* Level Selector Styling as Button */
            .level-selector select {
                appearance: none;
                -webkit-appearance: none;
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                color: #475569;
                padding: 0 30px 0 15px; /* Right padding for custom arrow */
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 12px center;
                background-size: 16px;
                text-align-last: center; /* Center text but handle arrow */
            }
            .level-selector select:hover {
                background-color: #fff;
                border-color: #cbd5e1;
                transform: translateY(-1px);
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .level-selector select option {
                background: #ffffff !important;
                color: #334155 !important;
            }

            /* Responsive Adjustments for Mobile Footer */
            @media (max-width: 767px) {
                .control-panel {
                    padding: 8px 6px;
                    gap: 6px;
                }
                .btn-action, .level-selector select {
                    height: 30px; /* Isolated compact height for mobile only */
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    padding: 0 2px;
                }
                .level-selector select {
                    padding: 0 24px 0 8px;
                    background-position: right 8px center;
                    background-size: 12px; /* Reduced to match btn icon size */
                }
                .btn-action i {
                    margin: 0 !important;
                    font-size: 0.85rem;
                }
            }
            
            .btn-action:disabled { 
                opacity: 0.6; 
                cursor: not-allowed; 
                transform: none !important;
                box-shadow: none !important;
            }
                border-radius: 4px;
                padding: 4px;
                margin: 0 2px;
            }
            .header-tool-btn.active {
                color: #16a34a;
                background: #dcfce7;
            }
            .header-tool-btn:hover { color: #4b5563; }
            
            /* Canvas */
            #drawing-canvas {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                pointer-events: none;
                z-index: 0;
            }
            
            .hint-box {
                background: #eff6ff;
                border: 1px solid #dbeafe;
                color: #1e40af;
                padding: 15px;
                margin: 15px 0 0 0; /* Changed to top margin for beneath buttons spacing */
                border-radius: 8px;
                font-size: 0.95rem;
                line-height: 1.5;
            }
            
            /* Score Box */
            .score-box {
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 0.8rem;
                font-weight: 800;
                display: flex;
            /* --- DETAILED REPORT STYLES (Copied from report.css) --- */
            .exam-card.report-mode {
                max-width: 900px !important;
                background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
            }
            
            .report-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #f0f0f0;
                padding-bottom: 15px;
                margin-bottom: 20px;
            }
            .total-score-box {
                text-align: center;
                background: #003366;
                color: white;
                padding: 15px 25px;
                border-radius: 16px;
                box-shadow: 0 8px 15px rgba(0, 51, 102, 0.3);
            }
            .score-val { font-size: 2.2rem; font-weight: 900; line-height: 1; }
            .score-lbl { font-size: 0.8rem; opacity: 0.9; letter-spacing: 1px; }

            .report-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            .stat-card {
                background: white;
                padding: 15px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
                border: 1px solid #f1f5f9;
            }
            .stat-card .val { font-size: 1.4rem; font-weight: 800; color: #334155; }
            .stat-card .lbl { font-size: 0.8rem; color: #94a3b8; font-weight: 600; }
            .stat-card.correct .val { color: #16a34a; }
            .stat-card.wrong .val { color: #dc2626; }
            .stat-card.empty .val { color: #ca8a04; }

            .report-analysis-box {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            }
            .report-analysis-box h4 {
                margin: 0 0 10px 0;
                color: #1e293b;
                font-size: 1.1rem;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }

            @media print {
                .exam-card { 
                    box-shadow: none !important; 
                    border: none !important; 
                    width: 100% !important; 
                    max-width: none !important;
                }
                .control-panel, .close-btn { display: none !important; }
            }
            .speed-toggle-btn {
                background: #f1f5f9;
                border: 1px solid #e2e8f0;
                color: #64748b;
                padding: 0 8px; /* Minimal side padding */
                border-radius: 6px;
                font-size: 0.75rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
                height: 20px; /* Thinner button */
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .speed-toggle-btn:hover {
                background: #e2e8f0;
                color: #475569;
            }

            .speed-panel {
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0; /* Match top border color */
                padding: 20px 0; /* Significantly increased vertical padding */
                width: 100%;
                justify-content: center;
                align-items: center;
                animation: slideDown 0.3s ease-out;
                position: relative;
                z-index: 1;
            }

            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Unified Font Style for Numbers */
            .timer-text {
                font-family: 'Inter', sans-serif !important;
                font-weight: 500 !important; /* Reduced from 700 */
                font-size: 1.15rem; /* Mobile size */
                font-variant-numeric: tabular-nums;
                letter-spacing: -0.5px;
                line-height: 28px; /* Mobile line-height */
                color: #334155;
                margin-left: 0;
                display: flex; 
                align-items: center;
                height: 100%;
                transition: all 0.3s ease;
            }

            /* .counter-text class removed as we use timer-text now */
        `;
        document.head.appendChild(style);
    },

    // --- REPORT LOGIC ---

    finishExam: function () {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.showLoader(true);
        setTimeout(() => {
            this.calculateAndShowReport();
            this.showLoader(false);
        }, 500);
    },

    calculateAndShowReport: function () {
        // 1. Calculate Stats
        const total = this.currentQuestions.length;
        const correct = this.correctCount;
        const wrong = this.wrongCount;
        const empty = total - correct - wrong;
        const net = correct - (wrong * 0.25); // 4 wrong 1 correct

        const durationSec = this.timer;
        const durationMin = durationSec / 60;

        // Speed (Question per hour approx)
        const speed = durationSec > 0 ? Math.round((total / durationSec) * 3600) : 0;
        const netSpeed = durationSec > 0 ? Math.round((net / durationMin) * 60) : 0; // Net/Hour is weird, lets say Net/Exam * scale

        // --- SKERA & PERFORMANCE SIMULATION (Replicating Logic) ---
        // Since we don't have the original 'skeraPuan' or 'perfSeviye' algorithms, we approximate.

        // Base Score (0-100)
        let rawScore = (net / total) * 100;
        if (rawScore < 0) rawScore = 0;

        // Speed Bonus (Simple logic: < 1 min/q = bonus)
        const avgTimePerQ = durationSec / total;
        let speedBonus = 0;
        if (avgTimePerQ < 40) speedBonus = 10;
        else if (avgTimePerQ < 60) speedBonus = 5;

        const finalScore = Math.min(100, Math.round(rawScore + speedBonus));

        // SKERA (Mental) - Consistency
        // Fake it based on accuracy of TOTAL exam
        const accuracy = (correct / total) || 0;
        let skeraScore = -2;
        if (accuracy > 0.9) skeraScore = 8;
        else if (accuracy > 0.7) skeraScore = 5;
        else if (accuracy > 0.5) skeraScore = 2;

        const skeraPercent = Math.min(100, Math.max(0, ((skeraScore + 10) / 20) * 100));
        let skeraColor = skeraScore > 0 ? "#16a34a" : "#dc2626";

        // Performance (Physical) - Speed/Efficiency
        let perfLevel = 3;
        if (speed > 180 && accuracy > 0.6) perfLevel = 8; // Harder threshold
        else if (speed > 120) perfLevel = 6; // Harder threshold

        let perfColor = perfLevel >= 7 ? "#16a34a" : "#ca8a04";

        // Condition Messages
        const skeraTitle = skeraScore > 5 ? "Zihinsel Durum: Mükemmel" : "Zihinsel Durum: Geliştirilmeli";
        const skeraMsg = skeraScore > 5 ? "Soruları çözerken odağını çok iyi korudun." : "Dikkat dağınıklığı yaşamış olabilirsin.";

        const perfTitle = perfLevel >= 6 ? "Fiziksel Durum: Dinamik" : "Fiziksel Durum: Yorgun";
        const perfMsg = perfLevel >= 6 ? "Hızın ve ritmin gayet yerinde." : "Biraz daha tempoyu artırabilirsin.";

        // --- RENDER HTML ---
        const container = document.getElementById('prodil-exam-container');
        container.innerHTML = `
            <div class="exam-card report-mode" style="padding: 0; overflow: hidden;">
                <div class="exam-header">
                     <div style="font-weight: bold;">SINAV SONUÇ RAPORU</div>
                     <button onclick="ProdilExam.restartExam()" class="close-btn" title="Kapat">✕</button>
                </div>

                <div style="padding: 25px; overflow-y: auto; max-height: 80vh;">
                    
                    <!-- SUMMARY HEADER -->
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div class="total-score-box" style="padding: 10px 0; display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 5px;">
                             <i class="fa-solid fa-trophy" style="font-size: 1.4rem; color: #f59e0b;"></i>
                             <div class="score-lbl" style="font-size: 1.2rem; margin:0; color: #374151; font-weight:600;">Toplam Puan :</div>
                             <span class="score-val" style="font-size: 1.8rem; font-weight:800; color:#111827;">${finalScore}</span>
                             <span style="font-size: 0.9rem; color: #9ca3af; margin-top:4px;">(Max 100)</span>
                        </div>
                        <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                            Net: <b>${net.toFixed(2)}</b> | Hız Bonusu: <b>+${speedBonus}</b>
                        </div>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 15px 0;">

                    <div style="display: flex; flex-wrap: wrap; gap: 10px; background:#f9fafb; padding:10px; border-radius:8px; margin-bottom: 20px;">
                        <!-- Left Column: Basic Stats -->
                        <ul style="flex: 1; list-style: none; padding: 0; margin: 0; min-width: 130px;">
                            <li style="display: flex; justify-content: flex-start; align-items: center; gap: 0; margin-bottom: 8px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; width: 70px; font-weight: bold;"><span style="width:8px; height:8px; background:#16a34a; border-radius:50%; margin-right:6px;"></span>Doğru:</span> 
                                <span style="color:#16a34a; font-size: 0.9rem;">${correct}</span>
                            </li>
                            <li style="display: flex; justify-content: flex-start; align-items: center; gap: 0; margin-bottom: 8px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; width: 70px; font-weight: bold;"><span style="width:8px; height:8px; background:#dc2626; border-radius:50%; margin-right:6px;"></span>Yanlış:</span> 
                                <span style="color:#dc2626; font-size: 0.9rem;">${wrong}</span>
                            </li>
                            <li style="display: flex; justify-content: flex-start; align-items: center; gap: 0; margin-bottom: 8px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; width: 70px; font-weight: bold;"><span style="width:8px; height:8px; background:#9ca3af; border-radius:50%; margin-right:6px;"></span>Boş:</span> 
                                <span style="color:#6b7280; font-size: 0.9rem;">${empty}</span>
                            </li>
                            <li style="display: flex; justify-content: flex-start; align-items: center; gap: 0; margin-bottom: 4px; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; width: 70px; font-weight: bold;"><span style="width:8px; height:8px; background:#3b82f6; border-radius:50%; margin-right:6px;"></span>Net:</span> 
                                <span style="color:#3b82f6; font-size: 0.9rem;">${net.toFixed(2)}</span>
                            </li>
                        </ul>

                        <!-- Right Column: Time & Speed Stats -->
                        <ul style="flex: 1; list-style: none; padding: 0; margin: 0; min-width: 130px;">
                            <li style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; font-weight: bold;"><i class="fa-regular fa-clock" style="margin-right:6px; color:#64748b; font-size: 0.9em;"></i>Süre:</span> 
                                <span style="color:#1e293b; font-size: 0.9rem;">${Math.floor(durationMin)} dk ${durationSec % 60} sn</span>
                            </li>
                            <li style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; font-weight: bold;"><i class="fa-solid fa-bolt" style="margin-right:6px; color:#f59e0b; font-size: 0.9em;"></i>Hız:</span> 
                                <span style="color:#1e293b; font-size: 0.9rem;">${speed} soru/saat</span>
                            </li>
                            <li style="display: flex; justify-content: space-between; margin-bottom: 4px; padding-bottom: 4px;">
                                <span style="display:flex; align-items:center; font-size: 0.85rem; font-weight: bold;"><i class="fa-solid fa-chart-line" style="margin-right:6px; color:#8b5cf6; font-size: 0.9em;"></i>Net Hız:</span> 
                                <span style="color:#1e293b; font-size: 0.9rem;">${netSpeed} net/saat</span>
                            </li>
                        </ul>
                    </div>

                    <!-- SKERA ANALYSIS -->
                    <div class="report-analysis-box" style="background:#fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <h4 style="color:#1e40af; display:flex; justify-content:space-between; font-weight: 800;">
                            SKERA Analizi (Zihinsel)
                            <span style="background:${skeraColor}; color:white; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight: 500;">Puan: ${skeraScore}</span>
                        </h4>
                        <div style="font-weight:500; color:#1e3a8a; margin-bottom:5px;">${skeraTitle}</div>
                        <p style="margin:0; font-size:0.9rem; color:#1e3a8a;">${skeraMsg}</p>
                        <div style="margin-top:10px; background:rgba(255,255,255,0.5); height:6px; border-radius:3px;">
                            <div style="width:${skeraPercent}%; background:${skeraColor}; height:100%; border-radius:3px;"></div>
                        </div>
                    </div>

                    <!-- PERFORMANCE ANALYSIS -->
                    <div class="report-analysis-box" style="background:#fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <h4 style="color:#d97706; display:flex; justify-content:space-between; font-weight: 800;">
                            Performans Analizi (Fiziksel)
                            <span style="background:${perfColor}; color:white; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight: 500;">Seviye ${perfLevel}/10</span>
                        </h4>
                        <div style="font-weight:500; color:#78350f; margin-bottom:5px;">${perfTitle}</div>
                        <p style="margin:0; font-size:0.9rem; color:#92400e;">${perfMsg}</p>
                    </div>

                    <!-- CONDITION CHART -->
                    <div class="report-analysis-box" style="background:transparent; border:none; padding:0; margin-bottom:20px; box-shadow:none;">
                        <h4 style="color:#7c3aed; font-weight: 800;">Kondisyon Analizi</h4>
                        <div style="height: 200px;">
                            <canvas id="kondisyonChart"></canvas>
                        </div>
                    </div>

                </div>

                <!-- FOOTER ACTIONS -->
                <div class="control-panel" style="padding: 15px; border-top: 1px solid #eee; display:flex; gap:10px;">
                    <button onclick="ProdilExam.restartExam()" class="btn-action btn-secondary">🔄 TEKRAR</button>
                    <button onclick="ProdilExam.shareReport()" class="btn-action btn-primary">📤 PAYLAŞ / İNDİR</button>
                </div>
            </div>
        `;

        // DRAW CHART
        setTimeout(() => {
            this.drawChart(correct, wrong, empty);
        }, 100);
    },

    drawChart: function (c, w, e) {
        const ctx = document.getElementById('kondisyonChart');
        if (!ctx || !window.Chart) return;

        // Dummy data distribution over 5 segments for visual effect
        const total = c + w + e;
        const segment = Math.ceil(total / 5);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['%0-20', '%20-40', '%40-60', '%60-80', '%80-100'],
                datasets: [{
                    label: 'Performans Eğrisi',
                    data: [60, 75, 80, 85, 90], // Dummy curve for demo
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100 }
                }
            }
        });
    },

    restartExam: function () {
        // Simple reload for now to reset everything cleanly
        // Or re-fetch. Let's just reset state.
        this.openUI(); // Re-injects HTML template
        this.startTest(this.currentPath || window.location.href); // Need path storage? 
        // Better: Just location.reload() to be safe? 
        // The user might lose "Test" tab selection on reload.
        // Let's rely on stored data.
        this.currentIndex = -1;
        this.timer = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.currentQuestions.forEach(q => { q.answered = false; q.selectedKey = null; });
        this.openUI();
        this.nextQuestion();
        this.startTimer();
    },

    shareReport: function () {
        const el = document.querySelector('.exam-card');
        if (!el || !window.html2canvas) {
            alert("Rapor oluşturulamadı.");
            return;
        }

        html2canvas(el).then(canvas => {
            const link = document.createElement('a');
            link.download = 'Prodil_Sinav_Sonuc.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    }

};
