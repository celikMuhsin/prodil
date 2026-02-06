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

        // Scroll to top of list
        document.getElementById('testler-content-area').scrollIntoView({ behavior: 'smooth' });
    },

    getHtmlTemplate: function () {
        return `
            <div class="exam-card">
                <!-- Header -->
                <div class="exam-header">
                    <div class="header-left">
                        <span id="exam-timer" class="timer-text">00:00</span>
                        <div id="scratchpad-controls" style="display:flex; align-items:center; margin-left:8px; gap: 2px;">
                             <button id="btn-pen" onclick="ProdilExam.toggleDrawingMode()" class="header-tool-btn" title="Karalama Modu">✎</button>
                             <div id="extra-tools" style="display:none; align-items:center; gap:2px;">
                                  <button id="btn-eraser" onclick="ProdilExam.toggleEraser()" class="header-tool-btn small-icon" title="Silgi">🧼</button>
                                  <button id="btn-clear" onclick="ProdilExam.clearCanvas()" class="header-tool-btn small-icon" title="Temizle">🗑️</button>
                             </div>
                        </div>
                    </div>

                    <div class="header-center">
                        <div id="exam-speed" class="timer-text" style="display:flex; align-items:center; justify-content:center;">
                             <!-- Speed metrics injected by update wrapper -->
                             <span class="speed-unit">Hazırlanıyor...</span>
                        </div>
                    </div>
                    
                     <div class="header-right">
                         <div class="score-box score-correct" id="correct-box" style="display:none">0</div>
                         <div class="score-box score-wrong" id="wrong-box" style="display:none">0</div>
                         <button id="btn-close" onclick="ProdilExam.finishTestConfirm()" class="close-btn" title="Testi Bitir">✕</button>
                    </div>
                </div>

                <!-- Content -->
                <div id="soru-alan-kaplayici" style="position: relative; flex: 1;">
                    <div id="soru-alani" class="question-area"></div>
                    <canvas id="drawing-canvas"></canvas>
                </div>

                <!-- Hint -->
                <div id="ipucu-metni" class="hint-box" style="display:none;"></div>

                <!-- Footer -->
                <div id="kontrol-paneli" class="control-panel">
                    <button onclick="ProdilExam.prevQuestion()" class="btn-action btn-secondary" id="btn-prev">
                        <i class="fa-solid fa-chevron-left mr-2"></i> Geri
                    </button>

                    <button id="btn-hint" onclick="ProdilExam.toggleHint()" class="btn-action btn-secondary btn-hint-trig">
                        İpucu
                    </button>

                    <div class="level-selector">
                        <select style="padding:4px 8px; border-radius:6px; border:1px solid #d1d5db; background:#f9fafb; font-size:0.8rem; font-weight:600; color:#374151; cursor:pointer;">
                            <option value="1">Seviye 1</option>
                            <option value="2">Seviye 2</option>
                            <option value="3">Seviye 3</option>
                            <option value="4">Seviye 4</option>
                            <option value="5">Seviye 5</option>
                        </select>
                    </div>

                    <button onclick="ProdilExam.nextQuestion()" class="btn-action btn-primary" id="btn-next">
                        İleri <i class="fa-solid fa-chevron-right ml-2"></i>
                    </button>
                </div>
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
                    <span class="option-label">${letter}</span>
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
            setTimeout(() => this.nextQuestion(), 1000);
        } else {
            this.wrongCount++;
            btn.classList.add('wrong');
            // Show correct one
            const btns = document.querySelectorAll('.option-btn');
            q.siklar.forEach((opt, i) => {
                if (opt.dogruMu) btns[i].classList.add('correct');
            });
            setTimeout(() => this.nextQuestion(), 2000);
        }

        // Disable all
        const btns = document.querySelectorAll('.option-btn');
        btns.forEach(b => b.disabled = true);

        this.updateStatsUI();
    },

    toggleHint: function () {
        const box = document.getElementById('ipucu-metni');
        if (this.activeHint) {
            box.innerHTML = this.activeHint;
            box.style.display = box.style.display === 'none' ? 'block' : 'none';
        } else {
            box.innerHTML = "Bu soru için ipucu bulunmuyor.";
            box.style.display = 'block';
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
        const seen = this.currentIndex + 1; // Assuming linear progression
        const empty = Math.max(0, seen - this.correctCount - this.wrongCount); // Calculates empty among seen ones

        // Update boxes
        const cBox = document.getElementById('correct-box');
        const wBox = document.getElementById('wrong-box');

        if (cBox) {
            cBox.innerText = this.correctCount;
            cBox.style.display = this.correctCount > 0 ? 'flex' : 'none';
        }
        if (wBox) {
            wBox.innerText = this.wrongCount;
            wBox.style.display = this.wrongCount > 0 ? 'flex' : 'none';
        }

        // Speed Metrics
        const speedEl = document.getElementById('exam-speed');
        if (speedEl && this.timer > 0) {
            const qsPerHour = Math.round((seen / this.timer) * 3600);
            const correctPerHour = Math.round((this.correctCount / this.timer) * 3600);
            const wrongPerHour = Math.round((this.wrongCount / this.timer) * 3600);
            const emptyPerHour = Math.round((empty / this.timer) * 3600);

            speedEl.innerHTML = `
                <div class="speed-metric"><span class="speed-value">${qsPerHour}</span><span class="speed-unit">so/sa</span></div>
                <span class="speed-divider">|</span>
                <div class="speed-metric speed-correct"><span class="speed-value">${correctPerHour}</span><span class="speed-unit">do/sa</span></div>
                <span class="speed-divider">|</span>
                <div class="speed-metric speed-wrong"><span class="speed-value">${wrongPerHour}</span><span class="speed-unit">ya/sa</span></div>
                <span class="speed-divider">|</span>
                <div class="speed-metric speed-empty" style="color:#ca8a04"><span class="speed-value">${emptyPerHour}</span><span class="speed-unit">bo/sa</span></div>
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
        if (confirm("Testi bitirmek istediğine emin misin?")) {
            this.showReport();
        }
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

        // Speed
        const speed = durationSec > 0 ? Math.round((total / durationSec) * 3600) : 0;
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
        const accuracy = (correct / (correct + wrong)) || 0;
        let skeraScore = -2;
        if (accuracy > 0.9) skeraScore = 8;
        else if (accuracy > 0.7) skeraScore = 5;
        else if (accuracy > 0.5) skeraScore = 2;

        const skeraPercent = Math.min(100, Math.max(0, ((skeraScore + 10) / 20) * 100));
        let skeraColor = skeraScore > 0 ? "#16a34a" : "#dc2626";

        // Performance (Physical)
        let perfLevel = 3;
        if (speed > 100 && accuracy > 0.6) perfLevel = 8;
        else if (speed > 60) perfLevel = 6;
        let perfColor = perfLevel >= 7 ? "#16a34a" : "#ca8a04";

        // Messages
        const skeraTitle = skeraScore > 5 ? "Zihinsel Durum: Mükemmel" : "Zihinsel Durum: Geliştirilmeli";
        const skeraMsg = skeraScore > 5 ? "Soruları çözerken odağını çok iyi korudun." : "Dikkat dağınıklığı yaşamış olabilirsin.";

        const perfTitle = perfLevel > 5 ? "Fiziksel Durum: Dinamik" : "Fiziksel Durum: Yorgun";
        const perfMsg = perfLevel > 5 ? "Hızın ve ritmin gayet yerinde." : "Biraz daha tempoyu artırabilirsin.";

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
                        <div class="total-score-box">
                             <span class="score-val">${finalScore}</span>
                             <div class="score-lbl">TOPLAM PUAN</div>
                        </div>
                        <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                            (Maksimum 100 Puan)
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

                    <!-- STATS GRID -->
                    <div class="report-stats-grid">
                        <div class="stat-card" style="border-left: 4px solid #16a34a;">
                            <div class="val" style="color:#16a34a">${correct}</div>
                            <div class="lbl">Doğru</div>
                        </div>
                        <div class="stat-card" style="border-left: 4px solid #dc2626;">
                            <div class="val" style="color:#dc2626">${wrong}</div>
                            <div class="lbl">Yanlış</div>
                        </div>
                        <div class="stat-card" style="border-left: 4px solid #9ca3af;">
                            <div class="val" style="color:#9ca3af">${empty}</div>
                            <div class="lbl">Boş</div>
                        </div>
                         <div class="stat-card" style="border-left: 4px solid #3b82f6;">
                            <div class="val" style="color:#3b82f6;">${net.toFixed(2)}</div>
                            <div class="lbl">Net</div>
                        </div>
                    </div>
                    
                    <ul style="list-style: none; padding: 0; margin: 0 0 20px 0; font-size: 0.8rem; color: #4b5563; background:#f9fafb; padding:10px; border-radius:8px;">
                        <li style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Süre:</span> <strong>${Math.floor(durationMin)} dk ${durationSec % 60} sn</strong></li>
                        <li style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Soru Hızı:</span> <strong>${speed} soru/sa</strong></li>
                        <li style="display: flex; justify-content: space-between;"><span>Net Hızı:</span> <strong>${netSpeed} net/sa</strong></li>
                    </ul>

                    <!-- PERFORMANCE ANALYSIS -->
                    <div class="report-analysis-box" style="background:#fffbeb; border-color:#fde68a;">
                        <h4 style="color:#d97706; display:flex; justify-content:space-between;">
                            Performans Analizi (Fiziksel)
                            <span style="background:${perfColor}; color:white; padding:2px 8px; border-radius:4px; font-size:0.8rem;">Seviye ${perfLevel}/10</span>
                        </h4>
                        <div style="font-weight:bold; color:#78350f; margin-bottom:5px;">${perfTitle}</div>
                        <p style="margin:0; font-size:0.9rem; color:#92400e;">${perfMsg}</p>
                    </div>

                    <!-- SKERA ANALYSIS -->
                    <div class="report-analysis-box" style="background:#eff6ff; border-color:#dbeafe;">
                        <h4 style="color:#1e40af; display:flex; justify-content:space-between;">
                            SKERA Analizi (Zihinsel)
                            <span style="background:${skeraColor}; color:white; padding:2px 8px; border-radius:4px; font-size:0.8rem;">Puan: ${skeraScore > 0 ? '+' + skeraScore : skeraScore}</span>
                        </h4>
                        <div style="font-weight:bold; color:#1e3a8a; margin-bottom:5px;">${skeraTitle}</div>
                        <p style="margin:0; font-size:0.9rem; color:#1e3a8a;">${skeraMsg}</p>
                        <div style="margin-top:10px; background:rgba(255,255,255,0.5); height:6px; border-radius:3px;">
                            <div style="width:${skeraPercent}%; background:${skeraColor}; height:100%; border-radius:3px;"></div>
                        </div>
                    </div>

                    <!-- CONDITION CHART -->
                    <div class="report-analysis-box" style="background:#f5f3ff; border-color:#ede9fe;">
                        <h4 style="color:#7c3aed;">Kondisyon Analizi</h4>
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
                max-width: 800px;
                margin: 0 auto;
                background: transparent;
                min-height: 500px;
            }
            
            /* Copied & Adapted CSS */
            .exam-card { 
                background: white; 
                border-radius: 16px; 
                border: 1px solid #f3f4f6;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05); 
                overflow: hidden;
                display: flex;
                flex-direction: column;
                min-height: 500px;
                position: relative;
            }

            .exam-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 20px;
                background: #fff;
                border-bottom: 2px solid #f3f4f6;
                height: 50px;
            }
            
            .header-left, .header-right { flex: 1; display: flex; align-items: center; }
            .header-right { justify-content: flex-end; gap: 5px; }
            .header-center { flex: 2; display: flex; justify-content: center; }

            .timer-text {
                font-size: 1.1rem;
                font-weight: 700;
                color: #374151;
                font-features: tabular-nums;
            }
            
            .speed-metric {
                font-size: 0.75rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                line-height: 1;
                margin: 0 5px;
            }
            .speed-value { font-weight: 800; font-size: 1rem; }
            .speed-unit { font-size: 0.6rem; color: #9ca3af; text-transform: uppercase; }
             .speed-correct .speed-value { color: #16a34a; }
             .speed-wrong .speed-value { color: #dc2626; }
            
            .speed-divider { color: #e5e7eb; font-size: 1.2rem; font-weight: 300; }

            .close-btn {
                background: none; border: none; font-size: 1.2rem; color: #9ca3af; cursor: pointer;
            }
            .close-btn:hover { color: #ef4444; }

            /* Question Area */
            .question-area {
                padding: 30px;
                font-size: 1.1rem;
            }
            
            .math-text {
                margin-bottom: 25px;
                color: #1f2937;
                font-weight: 500;
                line-height: 1.6;
                display: flex;
            }
            .question-prefix { font-weight: 800; margin-right: 8px; color: #003366; }

            .options-grid {
                display: grid;
                gap: 12px;
            }
            
            .option-btn {
                padding: 16px 20px;
                border: 2px solid #f3f4f6;
                border-radius: 12px;
                background: white;
                text-align: left;
                cursor: pointer;
                font-size: 1rem;
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
                font-weight: 800;
                margin-right: 15px;
                color: #6b7280;
                width: 25px;
            }
            .option-btn.correct .option-label { color: #14532d; }
            .option-btn.wrong .option-label { color: #7f1d1d; }

            /* Footer */
            .control-panel {
                padding: 15px 20px;
                background: #f9fafb;
                border-top: 1px solid #f3f4f6;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .btn-action {
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
            }
            
            .btn-secondary { background: #e5e7eb; color: #374151; }
            .btn-secondary:hover:not(:disabled) { background: #d1d5db; }
            
            .btn-primary { background: #003366; color: white; }
            .btn-primary:hover { background: #002244; }
            
            .btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
            
            /* Tools */
            .header-tool-btn {
                background: transparent;
                border: none;
                font-size: 1.1rem;
                color: #9ca3af;
                cursor: pointer;
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
                margin: 0 20px 20px;
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
        // Fake it based on accuracy
        const accuracy = (correct / (correct + wrong)) || 0;
        let skeraScore = -2;
        if (accuracy > 0.9) skeraScore = 8;
        else if (accuracy > 0.7) skeraScore = 5;
        else if (accuracy > 0.5) skeraScore = 2;

        const skeraPercent = Math.min(100, Math.max(0, ((skeraScore + 10) / 20) * 100));
        let skeraColor = skeraScore > 0 ? "#16a34a" : "#dc2626";

        // Performance (Physical) - Speed/Efficiency
        let perfLevel = 3;
        if (speed > 100 && accuracy > 0.6) perfLevel = 8;
        else if (speed > 60) perfLevel = 6;

        let perfColor = perfLevel >= 7 ? "#16a34a" : "#ca8a04";

        // Condition Messages
        const skeraTitle = skeraScore > 5 ? "Zihinsel Durum: Mükemmel" : "Zihinsel Durum: Geliştirilmeli";
        const skeraMsg = skeraScore > 5 ? "Soruları çözerken odağını çok iyi korudun." : "Dikkat dağınıklığı yaşamış olabilirsin.";

        const perfTitle = perfLevel > 5 ? "Fiziksel Durum: Dinamik" : "Fiziksel Durum: Yorgun";
        const perfMsg = perfLevel > 5 ? "Hızın ve ritmin gayet yerinde." : "Biraz daha tempoyu artırabilirsin.";

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
                        <div class="total-score-box">
                             <span class="score-val">${finalScore}</span>
                             <div class="score-lbl">TOPLAM PUAN</div>
                        </div>
                        <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                            Net: <b>${net.toFixed(2)}</b> | Hız Bonusu: <b>+${speedBonus}</b>
                        </div>
                    </div>

                    <!-- STATS GRID -->
                    <div class="report-stats-grid">
                        <div class="stat-card correct">
                            <div class="val">${correct}</div>
                            <div class="lbl">Doğru</div>
                        </div>
                        <div class="stat-card wrong">
                            <div class="val">${wrong}</div>
                            <div class="lbl">Yanlış</div>
                        </div>
                        <div class="stat-card empty">
                            <div class="val">${empty}</div>
                            <div class="lbl">Boş</div>
                        </div>
                         <div class="stat-card time">
                            <div class="val" style="color:#3b82f6;">${Math.floor(durationMin)}dk</div>
                            <div class="lbl">Süre</div>
                        </div>
                    </div>

                    <!-- SKERA ANALYSIS -->
                    <div class="report-analysis-box" style="background:#eff6ff; border-color:#dbeafe;">
                        <h4 style="color:#1e40af; display:flex; justify-content:space-between;">
                            SKERA Analizi (Zihinsel)
                            <span style="background:${skeraColor}; color:white; padding:2px 8px; border-radius:4px; font-size:0.8rem;">Puan: ${skeraScore}</span>
                        </h4>
                        <div style="font-weight:bold; color:#1e3a8a; margin-bottom:5px;">${skeraTitle}</div>
                        <p style="margin:0; font-size:0.9rem; color:#1e3a8a;">${skeraMsg}</p>
                        <div style="margin-top:10px; background:rgba(255,255,255,0.5); height:6px; border-radius:3px;">
                            <div style="width:${skeraPercent}%; background:${skeraColor}; height:100%; border-radius:3px;"></div>
                        </div>
                    </div>

                    <!-- PERFORMANCE ANALYSIS -->
                    <div class="report-analysis-box" style="background:#fffbeb; border-color:#fde68a;">
                        <h4 style="color:#d97706; display:flex; justify-content:space-between;">
                            Performans Analizi (Fiziksel)
                            <span style="background:${perfColor}; color:white; padding:2px 8px; border-radius:4px; font-size:0.8rem;">Seviye ${perfLevel}/10</span>
                        </h4>
                        <div style="font-weight:bold; color:#78350f; margin-bottom:5px;">${perfTitle}</div>
                        <p style="margin:0; font-size:0.9rem; color:#92400e;">${perfMsg}</p>
                    </div>

                    <!-- CONDITION CHART -->
                    <div class="report-analysis-box" style="background:#f5f3ff; border-color:#ede9fe;">
                        <h4 style="color:#7c3aed;">Kondisyon Analizi</h4>
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
