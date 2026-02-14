/**
 * Prodil Test Engine (Advanced)
 * Adapted from Uzman Matematik Engine
 * Handles JSON-based tests, visual timer, drawing canvas, and ICPE reporting.
 * Dependencies: ExamUtils, Chart.js, html2canvas
 */

/**
 * 🚀 AKILLI BİLİŞSEL YETERLİLİK MOTORU (ICPE v2.0)
 * =================================================================
 * Bu motor, kullanıcının sadece doğru/yanlış verisini değil;
 * - Bilişsel işlem hızını (CPS)
 * - Tereddütlerini (Hesitation)
 * - Dürtüsel davranışlarını (Impulsivity)
 * analiz ederek gerçekçi bir seviye belirler.
 */

// 1. GLOBAL KONFİGÜRASYON (Physics Engine Settings)
const ICPE_CONFIG = {
    LATENCY_PAD: 400,    // Göz odaklanması ve animasyon payı (ms) - Süreden düşülür.
    READING_LIMIT: 1000, // Bu sürenin altı "Şans/Sallama" kabul edilir.

    // Fitts Yasası: Şıkkın konumuna göre süre tolerans katsayıları
    FITTS_VECTOR: { 0: 1.0, 1: 1.1, 2: 1.2, 3: 1.3, 4: 1.4 }, // Index 0=A, 1=B...

    // Seviye Skalası (0-1000 Puan)
    LEVELS: [
        { d: 200, l: "A0", t: "Novice" },
        { d: 350, l: "A1", t: "Beginner" },
        { d: 450, l: "A1+", t: "High Beginner" },
        { d: 550, l: "A2", t: "Elementary" },
        { d: 650, l: "A2+", t: "Pre-Intermediate" },
        { d: 750, l: "B1", t: "Intermediate" },
        { d: 840, l: "B1+", t: "High Intermediate" },
        { d: 900, l: "B2", t: "Upper Intermediate" },
        { d: 940, l: "B2+", t: "Advanced Candidate" },
        { d: 970, l: "C1", t: "Advanced" },
        { d: 985, l: "C1+", t: "Proficient" },
        { d: 995, l: "C2", t: "Mastery" },
        { d: 1000, l: "C2+", t: "Native Reflex" }
    ]
};

// Seviye Aralıkları (Range Map)
const LEVEL_RANGES = [
    { min: 0, max: 200, id: "A0", label: "Novice" },
    { min: 201, max: 350, id: "A1", label: "Beginner" },
    { min: 351, max: 450, id: "A1+", label: "High Beginner" },
    { min: 451, max: 550, id: "A2", label: "Elementary" },
    { min: 551, max: 650, id: "A2+", label: "Pre-Intermediate" },
    { min: 651, max: 750, id: "B1", label: "Intermediate" },
    { min: 751, max: 840, id: "B1+", label: "High Intermediate" },
    { min: 841, max: 900, id: "B2", label: "Upper Intermediate" },
    { min: 901, max: 940, id: "B2+", label: "Advanced Candidate" },
    { min: 941, max: 970, id: "C1", label: "Advanced" },
    { min: 971, max: 985, id: "C1+", label: "Proficient" },
    { min: 986, max: 995, id: "C2", label: "Mastery" },
    { min: 996, max: 1000, id: "C2+", label: "Native Reflex" }
];

// Detaylı Geri Bildirim Motoru
function generateFeedbackMsg(score, range) {
    if (range.id === "C2+") return "Zirvedesin! Bundan ötesi yok.";
    let rangeSpan = range.max - range.min;
    let progress = score - range.min;
    let percentage = (progress / rangeSpan); // 0.0 ile 1.0 arası
    let nextLevelScore = range.max + 1;
    let msg = "";
    if (percentage < 0.30) {
        msg = `Bu seviyeye (${range.id}) yeni giriş yaptın. Temelleri sağlamlaştırmalısın.`;
    } else if (percentage < 0.70) {
        msg = `Bu seviyenin ortalarındasın. ${nextLevelScore} puana ulaştığında bir üst seviyeye geçmiş sayılacaksın.`;
    } else {
        msg = `Harika gidiyorsun! Bu seviyeyi tamamlamak üzeresin. Sadece ${nextLevelScore - score} puan daha lazım.`;
    }
    return msg;
}

// 2. YARDIMCI MATEMATİK FONKSİYONLARI (Artık çoğu ExamUtils içinde)
const ICPE_MATH = {
    // Kelime Sayısı Hesapla (Soru + Şıklar) -> W_eff
    calculateWordCount: function (q) {
        if (!q) return 0;
        let textWords = (q.metin || "").trim().split(/\s+/).length;
        let optionsWords = 0;
        if (q.siklar) {
            optionsWords = q.siklar.map(s => s.text).join(" ").trim().split(/\s+/).length;
        }
        return textWords + optionsWords;
    },

    // Güvenilirlik Katsayısı (G_i) Hesapla
    calculateReliability: function (rawTime, lastScrollTime, isVisible, isHesitant) {
        let g_i = 1.0; // Varsayılan: Tam Güvenilir

        // Kural 1: Scroll Impulse Cezası (<200ms)
        if (Date.now() - lastScrollTime < 200) {
            // console.log("⚠️ Impulse Detected (Scroll)");
            g_i *= 0.5;
        }

        // Kural 2: Görünürlük (Kör Tıklama)
        if (!isVisible) {
            // console.log("⚠️ Blind Click Detected");
            g_i = 0.0; // İptal
        }

        // Kural 3: Tereddüt (Hesitation)
        if (isHesitant) {
            g_i *= 0.8;
        }

        return g_i;
    }
};

window.ProdilExam = {
    // --- STATE ---
    currentQuestions: [],
    currentIndex: -1,
    currentLevel: "beginner", // info only
    timer: 0,
    timerInterval: null,
    currentJsonPath: null, // Track current test path for switching
    soruBaslamaZamani: null, // Soru bazlı süre takibi için

    // ICPE SESSION STATE
    icpeSession: {
        answers: [],          // Her cevabın detaylı analiz verisi
        lastScrollTime: 0,    // Impulse detection için
        optionsVisible: false, // Blind click detection için
        currentHesitation: false, // Mobil touch tereddüt
        startTime: 0          // Milisaniye hassasiyetli başlangıç
    },

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

            // [TREND FIX] Buffer'daki Skoru Tescil Et
            if (typeof localStorage !== 'undefined') {
                const bufferScore = localStorage.getItem('prodil_current_exam_score_buffer');
                if (bufferScore) {
                    localStorage.setItem('prodil_last_exam_score', bufferScore);
                    // Buffer'ı temizle ki aynı skoru tekrar tekrar tescil etmesin (Opsiyonel, kalsa da sorun olmaz)
                    localStorage.removeItem('prodil_current_exam_score_buffer');
                }
            }

            // Init Scroll Listener for Impulse Detection
            if (!this.scrollListenerAdded) {
                window.addEventListener("scroll", () => {
                    this.icpeSession.lastScrollTime = Date.now();
                }, { passive: true });
                this.scrollListenerAdded = true;
            }

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

            // Sıfırla ICPE
            this.icpeSession.answers = [];

            // Initialize UI
            this.openUI();
            this.syncSelector(); // Sync the dropdown value
            this.nextQuestion(); // İlk soruyu yükle
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
        // Yeni JSON yapısı: i (id), t (text), o (options), c (correct), d (difficulty), r (ref_time), h (hint)
        // Eski yapı desteği (fallback) de korumalıyız.

        const rawOptions = qJson.o || qJson.options || {};
        const correctKey = qJson.c || qJson.correct_option;

        // Convert "A": "..." options to array format expected by the engine
        // { text: "...", dogruMu: boolean }
        const options = [];

        Object.keys(rawOptions).forEach(key => {
            options.push({
                text: rawOptions[key],
                dogruMu: key === correctKey,
                originalLabel: key
            });
        });

        return {
            id: qJson.i || qJson.id,
            metin: qJson.t || qJson.text,
            siklar: options,
            ipucu: qJson.h || qJson.hint,
            difficulty: qJson.d || qJson.difficulty || 1.2, // Default zorluk
            refTime: qJson.r || null, // Referans Süre (Yeni)

            // Internal State
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

        // --- ICPE: Gecikmeli Başlatma (Latency Pad) ---
        // Soru ekrana geldi ancak göz odaklanması için süre tanıyoruz.
        // Sayaç hemen başlamaz. LATENCY_PAD kadar sonra başlar.
        this.soruBaslamaZamani = 0; // Henüz başlamadı
        this.icpeSession.currentHesitation = false;
        this.icpeSession.optionsVisible = false;

        // Load Canvas
        this.loadCanvasState(q);

        const qNum = this.currentIndex + 1;

        let html = `
            <div class="math-text">
                <span class="question-prefix">${qNum}) </span>
                <div style="flex: 1;">${q.metin}</div>
            </div>
            <div class="options-grid" id="options-grid-container">
        `;

        q.siklar.forEach((opt, idx) => {
            const letter = opt.originalLabel || ["A", "B", "C", "D", "E"][idx];

            let extraClass = '';
            let disabled = '';
            let clickAction = `onclick="ProdilExam.checkAnswer(this, ${idx})"`;

            // If already solved
            if (q.cozulduMu) {
                disabled = 'disabled';
                clickAction = ""; // No action
                if (q.secilenSikIndex === idx) {
                    extraClass = opt.dogruMu ? 'correct' : 'wrong';
                }
                if (opt.dogruMu) extraClass += ' correct'; // Always show correct one
            }

            // MOBİL TEREDDÜT ANALİZİ İÇİN EVENTLER BUTTON'A EKLENECEK
            // JS tarafında eklemek daha güvenli, string olarak buraya yazmıyoruz.
            html += `
                <button class="option-btn ${extraClass}" id="opt-btn-${idx}" ${disabled} ${clickAction}>
                    <span class="option-label">${letter})</span>
                    <span>${opt.text}</span>
                </button>
            `;
        });

        html += `</div>`;
        area.innerHTML = html;

        this.activeHint = q.ipucu;

        // --- EVENT BINDING & OBSERVER ---
        // HTML render edildikten sonra butonlara event ekle
        q.siklar.forEach((opt, idx) => {
            const btn = document.getElementById(`opt-btn-${idx}`);
            if (btn && !q.cozulduMu) {
                // Tereddüt Tespiti (Long Press)
                let touchStart = 0;
                btn.ontouchstart = () => { touchStart = Date.now(); };
                btn.ontouchend = () => {
                    if (Date.now() - touchStart > 300) {
                        this.icpeSession.currentHesitation = true;
                    }
                };
            }
        });

        // Görünürlük Kontrolü (IntersectionObserver)
        const optsContainer = document.getElementById("options-grid-container");
        if (optsContainer && window.IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    this.icpeSession.optionsVisible = true;
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            observer.observe(optsContainer);
        } else {
            // Fallback for no observer
            this.icpeSession.optionsVisible = true;
        }

        // Başlangıç Zamanını Ayarla (Gecikmeli)
        setTimeout(() => {
            this.soruBaslamaZamani = Date.now();
        }, ICPE_CONFIG.LATENCY_PAD);

    },

    checkAnswer: function (btn, idx, event) {
        const q = this.currentQuestions[this.currentIndex];
        if (q.cozulduMu) return;

        // --- ICPE v2.0 PHYSICS ENGINE ---
        // --------------------------------
        const endTime = Date.now();

        // 1. Fiziksel Süre (Raw Time)
        // Eğer soruBaslamaZamani henüz set edilmediyse (LATENCY_PAD içindeysek),
        // negatif çıkabilir, en az 100ms kabul edelim.
        let rawTime = this.soruBaslamaZamani > 0 ? (endTime - this.soruBaslamaZamani) : 100;
        if (rawTime < 100) rawTime = 100;

        // 2. Metrik Hesaplama
        const wordCount = ICPE_MATH.calculateWordCount(q);
        const fittsFactor = ICPE_CONFIG.FITTS_VECTOR[idx] || 1.2;

        // 3. Güvenilirlik (G_i)
        // isHesitant: Mobil için event'ten gelir, Desktop için uzun bekleme (>1500ms basit mantık veya hover)
        // Burada basitçe süre > 2000ms ise de tereddüt sayabiliriz veya sadece touch event'e güvenebiliriz.
        let isHesitant = this.icpeSession.currentHesitation;
        if (rawTime > 5000) isHesitant = true; // Çok uzun beklediyse de tereddüttür.

        let reliability = ICPE_MATH.calculateReliability(
            rawTime,
            this.icpeSession.lastScrollTime,
            this.icpeSession.optionsVisible,
            isHesitant
        );

        // 4. Bilişsel İşlem Hızı (CPS) - Kelime/Saniye
        // Normalized Time = RawTime / Fitts
        const normalizedTime = rawTime / fittsFactor;
        // CPS = (WordCount / (NormalizedTime / 1000))
        let cps = (wordCount / (normalizedTime / 1000));

        // 5. Performans İndeksi (PI) - Ham Puan
        // PI = isCorrect * Difficulty * log(CPS + 1) * 100 * Reliability
        const isCorrect = q.siklar[idx].dogruMu;
        const diff = q.difficulty || 1.2;
        let pi = (isCorrect ? 1 : 0) * diff * Math.log(cps + 1) * 100 * reliability;

        // Analizi Kaydet
        this.icpeSession.answers.push({
            qId: q.id,
            correct: isCorrect,
            rawTime: rawTime,
            cps: cps,
            pi: pi,
            reliability: reliability,
            // Yeni Alanlar (v3.0)
            d: diff,
            hesitation: isHesitant,
            wordCount: wordCount,
            content: q.metin,
            options: q.siklar
        });

        // Debug Log
        // console.log(`Q${q.id} Analiz: Time:${rawTime}ms, CPS:${cps.toFixed(1)}, PI:${pi.toFixed(1)}, Rel:${reliability}`);

        // --- END ICPE ---

        // --- UI UPDATES & FLOW ---
        if (isCorrect) {
            this.correctCount++;
            btn.classList.add('correct');
            setTimeout(() => this.flashNextButton(), 500);
            setTimeout(() => this.nextQuestion(), 1000);
        } else {
            this.wrongCount++;
            btn.classList.add('wrong');
            // Show correct one
            const btns = document.querySelectorAll('.option-btn');
            q.siklar.forEach((opt, i) => {
                if (opt.dogruMu && btns[i]) btns[i].classList.add('correct');
            });
            setTimeout(() => this.flashNextButton(), 500);
            setTimeout(() => this.nextQuestion(), 1000);
        }

        // Disable all
        const btns = document.querySelectorAll('.option-btn');
        btns.forEach(b => b.disabled = true);

        q.cozulduMu = true;
        q.secilenSikIndex = idx;
        q.cozumSaniyesi = this.timer; // Legacy support

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

        // Default state: pass through events
        if (!this.isDrawingMode) {
            this.canvas.style.pointerEvents = 'none';
        }

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
        // Kullanıcı isteği: Onay sormadan direkt raporu aç
        try {
            this.showReport();
        } catch (e) {
            console.error("Rapor oluşturulurken hata:", e);
            alert("Rapor Hatası:\n" + e.name + ": " + e.message + "\n\nSatır: " + (e.lineNumber || '?') + "\nStack: " + (e.stack || '').substring(0, 100));
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

        // --- PUANLAMA SİSTEMİ (v3 - Gelişmiş) ---
        // -------------------------------------------------------------

        const durationSec = this.timer > 0 ? this.timer : 1;
        const durationMin = durationSec / 60;

        // SON SORU KURALI (Kullanıcı İsteği):
        // Eğer son soru çözülmediyse VE 1 dakikadan (60000ms) AZ bakıldıysa, 
        // toplam soru sayısından düşmüyoruz Puan için (Sınav bütünlüğü),
        // ama HIZ hesaplaması ve Görülen Soru sayısından düşüyoruz.

        let visited = this.currentIndex + 1;

        if (this.soruBaslamaZamani) {
            const gecenSure = Date.now() - this.soruBaslamaZamani;
            const sonSoru = this.currentQuestions[this.currentIndex];
            // Son soru varsa ve çözülmediyse ve süre < 60sn
            if (sonSoru && !sonSoru.cozulduMu && gecenSure < 60000) {
                visited = Math.max(0, visited - 1);
                // console.log("Son soru < 1dk olduğu için hız hesabına katılmadı.");
            }
        }

        // 1. Temel Veriler
        // Kısmi Raporlama: Eğer sınav bitmediyse, visited (görülen soru) üzerinden hesapla.
        const effectiveTotal = visited > 0 ? visited : 1;

        // Boş Sorular: Görülenler içindeki boşlar
        // (Toplam Görülen) - (Doğru + Yanlış)
        // Eğer son soruyu görmediysek (zaman < 1dk kuralı), o zaman boş sayılmamalı.
        // Zaten visited azaltıldığı için formül doğru çalışır.
        const effectiveEmpty = Math.max(0, effectiveTotal - correct - wrong);

        const T = effectiveTotal; // Bölen artık görülen soru sayısı
        const birimPuan = 1000 / T;

        // 2. Net Hesabı (4 Yanlış 1 Doğruyu Götürür)
        // const net = correct - (wrong * 0.25); // Zaten yukarıda hesaplandı (Satır 691)
        // const netPuan = Math.max(0, net * birimPuan); // Aşağıda tekrar hesaplanıyor (Satır 740)
        const netSayisi = Math.max(0, net);

        // 3. Puan Kalemleri
        // A) Taban Puan (Potansiyel): Sadece doğrular
        const tabanPuan = Math.round(correct * birimPuan);

        // B) Net Puanı (Akademik - ANA PUAN): Netler üzerinden
        const finalNetPuan = Math.round(netSayisi * birimPuan); // ismini değiştirdim çakışmasın diye

        // C) Metrikler
        // ne_sa (Net/Saat): Saatte yapılan net sayısı
        // Formül: (Net / Süre(sn)) * 3600
        const ne_sa = Math.round((netSayisi / durationSec) * 3600);



        // Diğer Metrikler (Ekranda gösterim için)
        // Hız (so/sa) -> visited (görülen soru) üzerinden hesaplamak daha doğru.
        const speed = Math.round((visited / durationSec) * 3600);
        const netSpeed = ne_sa;

        // D) Hız Bonusu (Turbo Puan) - Kriter: ne_sa
        let speedBonus = 0;
        if (ne_sa > 60) speedBonus = 150;
        else if (ne_sa > 50) speedBonus = 100;
        else if (ne_sa > 40) speedBonus = 50;

        // Eğer hiç net yoksa hız bonusu verme (Sallamayı önle)
        if (netSayisi <= 0) speedBonus = 0;

        // Final Puan: Net Puan + Hız Bonusu + SKERA (Varsa)
        // SKERA henüz hesaplanmadığı için burada finalScore'u sadece tanımlıyoruz veya geçici 0 veriyoruz.
        // Asıl hesaplama SKERA bloğundan sonra yapılacak.
        let finalScore = 0;


        // --- SKERA (Stratejik Karar Eğilimi ve Risk Analizi) ---
        // -------------------------------------------------------------

        // 1. Hesaplama Mantığı (Algoritma)
        const so = T; // Toplam Soru (T değişkeni v3 puanlamada tanımlanmıştı)
        // Hata oranı: (1 - (Doğru / Toplam))
        const hata_orani = so > 0 ? (1 - (correct / so)) : 0;
        const yapilamayan = wrong + empty; // yanlis + bos

        // Dürtüsellik İndeksi (Impulsivity Index - I_imp)
        const i_imp = yapilamayan > 0 ? (wrong / yapilamayan) * hata_orani : 0;

        // Çekimserlik İndeksi (Timidity Index - I_timid)
        const i_timid = yapilamayan > 0 ? (empty / yapilamayan) * hata_orani : 0;

        // 2. Karar Ağacı (Logic Flow)
        let skeraTitle = ""; // skeraBaslik
        let skeraMsg = "";   // skeraDetay
        let skeraScore = 0;  // skeraPuan



        // =========================================================
        // SKERA v3.0 (DAVRANIŞSAL KARAKTER ANALİZİ)
        // =========================================================

        // Gerekli Ön Hesaplamalar (SKERA 3.0 için)
        // 1. Hesitation (Tereddüt) Sayısı
        let hesitationCount = 0;
        if (this.icpeSession.answers) {
            hesitationCount = this.icpeSession.answers.filter(a => a.hesitation).length;
        }

        // 2. Temel Metrikler (Basitleştirilmiş Tahmin)
        // Detaylı metrikler aşağıda calculateAdvancedPerformance ile gelecek ama
        // SKERA'yı burada hesaplamak için önden basitçe buluyoruz.
        // Hız (AGI): avgCPS * 10 (Max 100)
        let rawAGI = (speed / 3600) * 10; // Yaklaşık
        // Daha doğru AGI hesabı (calculateAdvancedPerformance mantığına benzer):
        let totalWordsEst = visited * 30; // Ort. 30 kelime varsayımı (Tam doğru değil ama yaklaşım)
        let agiEst = Math.min(100, (speed / 300) * 100); // 300 so/sa = 100 puan gibi. 
        // Kullanıcı 7.0 CPS = 100 puan demişti. 
        // Biz burada direkt speedScore (yukarıda hesaplanan) veya avgCPSVal kullanalım.
        // Yukarıda avgCPSVal henüz hesaplanmadı (Satır 1147).
        // Blok sırası aşağıda. O yüzden SKERA bloğunu METRİKLERDEN SONRAYA TAŞIMAK daha doğru olurdu ama
        // kod yapısını çok bozmamak için burada gerekli verileri çekiyoruz.

        // Hızlıca AGI, RFX, PWR, STA, RES hesaplayalım (Ön-Analiz)
        // Bu hesaplamalar calculateAdvancedPerformance içinde de var, kod tekrarı olacak ama
        // showReport fonksiyonu çok uzun ve spagetti olduğu için güvenli yol bu.

        // AGI (Hız)
        let _avgCPS = 0;
        if (this.icpeSession.answers && this.icpeSession.answers.length > 0) {
            const cpsVals = this.icpeSession.answers.map(a => a.cps || 0);
            _avgCPS = cpsVals.reduce((a, b) => a + b, 0) / cpsVals.length;
        }
        let agiScore = Math.min(100, (_avgCPS / 7.0) * 100);

        // RFX (Refleks) - Avanslı Modelin Basiti
        let rfxScore = 0;
        if (this.icpeSession.answers) {
            let _totalRfx = 0;
            let _cnt = 0;
            this.icpeSession.answers.forEach(a => {
                if (a.isCorrect) {
                    let limit = a.limit || 20;
                    let safe = Math.max(3.0, limit * 0.20);
                    let t = (a.netTime || 0) / 1000;
                    let s = 0;
                    if (t <= safe) s = 100;
                    else if (t >= limit) s = 0;
                    else s = 100 * ((limit - t) / (limit - safe));

                    if (a.hesitation) s *= 0.75;
                    _totalRfx += s;
                    _cnt++;
                }
            });
            rfxScore = _cnt > 0 ? (_totalRfx / _cnt) : 0;
        }

        // ACC (İsabet)
        let accScore = (visited > 0) ? (correct / visited) * 100 : 0;

        // PWR (Güç)
        let pwrScore = 0;
        if (this.icpeSession.answers) {
            let earned = this.icpeSession.answers.filter(a => a.isCorrect).reduce((s, a) => s + (a.d || 1), 0);
            let totalL = this.icpeSession.answers.reduce((s, a) => s + (a.d || 1), 0);
            pwrScore = totalL > 0 ? (earned / totalL) * 100 : 0;
        }

        // STA (Dayanıklılık)
        let staScore = 100;
        if (this.icpeSession.answers && this.icpeSession.answers.length > 10) {
            let mid = Math.floor(this.icpeSession.answers.length / 2);
            let h1 = this.icpeSession.answers.slice(0, mid).filter(a => a.isCorrect).length / mid;
            let h2 = this.icpeSession.answers.slice(mid).filter(a => a.isCorrect).length / (this.icpeSession.answers.length - mid);
            let drop = (h1 * 100) - (h2 * 100);
            staScore = drop > 0 ? Math.max(0, 100 - drop) : 100;
        }

        // RES (Direnç)
        let resScore = 100; // Hata yoksa 100
        if (wrong > 0 && this.icpeSession.answers) {
            let rebAtt = 0;
            let rebSuc = 0;
            for (let i = 0; i < this.icpeSession.answers.length - 1; i++) {
                if (!this.icpeSession.answers[i].isCorrect) {
                    rebAtt++;
                    if (this.icpeSession.answers[i + 1].isCorrect) rebSuc++;
                }
            }
            resScore = rebAtt > 0 ? (rebSuc / rebAtt) * 100 : 0;
        }



        // SKERA v3.0 Karar Ağacı
        skeraTitle = "Dengeli Öğrenci";
        let skeraIcon = "⚖️";
        skeraMsg = "Performansınızda belirgin bir uç nokta (aşırı hız veya aşırı yavaşlık) görülmüyor. Dengeli bir gelişim izliyorsunuz.";
        skeraScore = 50;
        let skeraClass = "info";

        // 1. THE GAMBLER (KUMARBAZ) - En Tehlikeli
        if (rfxScore > 80 && accScore < 45) {
            skeraTitle = "Kumarbaz Modu";
            skeraIcon = "🎲";
            skeraScore = -100;
            skeraClass = "danger";
            skeraMsg = "DİKKAT: İnanılmaz hızlısınız ama isabet oranınız çok düşük. Veriler, soruları okumadan 'Refleksif İşaretleme' (Sallama) yaptığınızı gösteriyor. Bu hız size puan kazandırmıyor, kaybettiriyor. Lütfen fren yapın.";
        }
        // 2. THE GLASS CANNON (KIRILGAN) - Psikolojik Düşüş
        else if (resScore < 35) {
            skeraTitle = "Domino Etkisi";
            skeraIcon = "📉";
            skeraScore = -50;
            skeraMsg = "Psikolojik direnç verileriniz düşük. Bir hata yaptıktan sonra toparlanmanız çok zor oluyor ve peş peşe hatalar (Seri Yanlışlar) geliyor. Hata yapmaktan korkmayın, 'Reset' atıp bir sonraki soruya odaklanın.";
        }
        // 3. THE PERFECTIONIST (MÜKEMMELİYETÇİ) - Kararsızlık
        else if (accScore > 75 && hesitationCount > 3 && agiScore < 45) {
            skeraTitle = "Analiz Felci";
            skeraIcon = "🐢";
            skeraScore = 20;
            skeraMsg = "Bilgi düzeyiniz gayet iyi (Doğrularınız yüksek), ancak karar verirken çok fazla 'Tereddüt' (Hesitation) yaşıyorsunuz. Şıklar arasında gidip gelmek size sınavı kaybettirir. İlk aklınıza gelene güvenin.";
        }
        // 4. THE SPRINTER (TÜKENMİŞ) - Kondisyon Sorunu
        else if (staScore < 40 && accScore > 50) {
            skeraTitle = "Kısa Mesafe Koşucusu";
            skeraIcon = "🔋";
            skeraScore = 10;
            skeraMsg = "Sınava harika başlıyorsunuz ama sonlara doğru 'Mental Piliniz' bitiyor. İkinci yarıdaki performans düşüşünüz, bilgi eksikliği değil, odaklanma kondisyonu eksikliğidir. Uzun süreli deneme pratikleri yapmalısınız.";
        }
        // 5. THE TANK (SAĞLAMCI) - Yavaş ama Güçlü
        else if (agiScore < 40 && rfxScore < 30 && accScore > 80) {
            skeraTitle = "Ağır Zırhlı";
            skeraIcon = "🚜";
            skeraScore = 80;
            skeraMsg = "Hiçbir riske girmiyor, refleks kullanmıyor, her soruyu didik didik ederek çözüyorsunuz. Doğruluk oranınız muazzam ama hızınız düşük. Bu strateji garantidir ancak süreli sınavlarda (YDT/YDS) soru yetiştirememe riski taşır.";
        }
        // 6. THE STRATEGIST (KURNAZ) - Seçici
        else if (accScore > 80 && pwrScore < 50) {
            skeraTitle = "Seçici Stratejist";
            skeraIcon = "🦊";
            skeraScore = 70;
            skeraMsg = "Akıllıca bir oyun. Yapabileceğiniz soruları kaçırmamış, boyunuzu aşan (Zor/Boss) sorularda ise fazla vakit kaybetmeden pas geçmiş veya takılmışsınız. Netlerinizi koruyan güvenli bir limandasınız ama zirve için zor sorulara saldırmalısınız.";
        }
        // 7. THE APEX PREDATOR (BÜYÜK ÜSTAD) - Zirve
        else if (accScore > 85 && rfxScore > 65 && pwrScore > 70) {
            skeraTitle = "Zirve Avcısı";
            skeraIcon = "👑";
            skeraScore = 100;
            skeraMsg = "Saygı duyulacak bir performans. Hızlısınız, doğrusunuz, zor sorularda (Güç) ezilmiyorsunuz ve hatadan sonra (Direnç) düşmüyorsunuz. Bir sınav öğrencisinin ulaşabileceği en üst bilişsel seviye budur.";
        }
        else {
            // Varsayılan: Dengeli
            if (accScore < 50) {
                skeraTitle = "Gelişime Açık";
                skeraIcon = "🌱";
                skeraMsg = "Henüz belirgin bir karakter profiliniz oturmamış. Bilgi eksiklerini giderdikçe kendi tarzınızı (Hızlı veya Sağlamcı) bulacaksınız.";
                skeraScore = 0;
            }
        }


        const skeraPercent = Math.min(100, Math.max(0, ((skeraScore + 100) / 200) * 100));
        let skeraColor = skeraScore > 0 ? "#16a34a" : (skeraScore < 0 ? "#dc2626" : "#ca8a04");

        // v3.0 Class Renk Mapping
        if (skeraClass === "danger") skeraColor = "#dc2626";
        else if (skeraClass === "warning") skeraColor = "#ca8a04";
        else if (skeraClass === "success") skeraColor = "#16a34a";
        else if (skeraClass === "info") skeraColor = "#3b82f6";

        // TOTAL SCORE UPDATE (SKERA DAHİL)
        // -------------------------------------------------------------
        // Yeni entegrasyon (Kullanıcı İsteği: Bilişsel Refleks Analizi Esaslı Puanlama):

        // 1. GEREKLİ VERİLERİ HAZIRLA
        let reflexScore = 0;
        const answers = this.icpeSession.answers; // Dizi güvenliği için kontrol edelim

        if (answers && answers.length > 0) {
            // 2. PI (Performans İndeksi) Toplamı
            const totalPI = answers.reduce((acc, a) => acc + (a.pi || 0), 0);

            // 3. Ortalama CPS (Bilişsel İşlem Hızı)
            const avgCPSVal = answers.reduce((acc, a) => acc + (a.cps || 0), 0) / answers.length;

            // 4. KALİBRASYON (Gerçek Veri Analizine Göre Revize Edildi)
            // Tavan Puanı (MaxPI): Soru Sayısı * 340 (Eski: 200 -> Yeni: 340)
            const maxPI = answers.length * 340;

            // Hız Puanı (SpeedScore): AvgCPS * 15 (Eski: 10 -> Yeni: 15)
            // Bu puan 100 üzerinden maksimum 100 olabilir.
            const speedScoreVal = Math.min(100, avgCPSVal * 15);

            // 5. FİNAL SKOR FORMÜLÜ
            // (ToplamPI / MaxPI) * 900 puanlık dilim + SpeedScore (100 puanlık dilim)
            // Böylece toplam 1000 puana ulaşılır.
            const piComponent = maxPI > 0 ? (totalPI / maxPI) * 900 : 0;

            reflexScore = Math.round(piComponent + speedScoreVal);
        }

        // 6. SKERA ETKİSİ (OPSİYONEL)
        // Kullanıcı "Net Puan + Hız + SKERA değil, Bilişsel Refleks Puanı olsun" dediği için
        // SKERA puanını doğrudan eklemiyoruz, ancak analiz olarak kalıyor.
        // Eğer ileride SKERA da puana etki etsin istenirse buraya + skeraScore eklenebilir.
        // Şimdilik saf Reflex Score kullanıyoruz.

        finalScore = Math.min(1000, Math.max(0, reflexScore));

        // HTML Template içinde kullanılacak değişken
        const sPuan = skeraScore;


        // --- YENİ PERFORMANS ANALİZİ ALANI ---
        // Buraya yeni hesaplama mantığı eklenecek.





        // --- LEVEL & PERSONA CALCULATION (Updated for ICPE v2.1) ---
        // 1. Find Level and Label using LEVEL_RANGES
        let currentRange = LEVEL_RANGES.find(r => finalScore >= r.min && finalScore <= r.max) || LEVEL_RANGES[0];
        let userLevel = currentRange.id;
        let userLevelDesc = currentRange.label;

        // 2. Generate Feedback Message
        let feedbackMsg = generateFeedbackMsg(finalScore, currentRange);

        // 3. Dynamic Color Assignment
        let userLevelColor = "#64748b"; // Slate
        if (userLevel.startsWith("C")) userLevelColor = "#7c3aed"; // Purple
        else if (userLevel.startsWith("B2")) userLevelColor = "#2563eb"; // Blue
        else if (userLevel.startsWith("B1")) userLevelColor = "#059669"; // Emerald
        else if (userLevel.startsWith("A2")) userLevelColor = "#d97706"; // Amber
        else if (userLevel.startsWith("A1")) userLevelColor = "#ca8a04"; // Yellow

        // 4. Persona Logic (ICPE v2.1)
        // Recalculate basic stats for persona logic
        // answers array might not have 'val.cps' as in the snippet, we use 'speed' variable which is questions/hour
        // We need 'speedScore' (0-100). Speed (questions/hour) map to 0-100. 
        // Let's approximate: 1000 q/h is crazy fast (100), 100 q/h is slow.
        // Or better, use existing 'speed' variable.
        // User provided logic: avgCPS * 10. We calculated avgCps in Pulse Report section but not here yet.
        // Let's re-calculate avgCPS here concisely.
        let avgCPS_val = 0;
        if (this.icpeSession.answers && this.icpeSession.answers.length > 0) {
            const cpsValues = this.icpeSession.answers.map(a => a.cps || 0);
            avgCPS_val = cpsValues.reduce((a, b) => a + b, 0) / cpsValues.length;
        }
        let speedScore = Math.min(100, avgCPS_val * 10);

        // Accuracy (0-100)
        let accuracy_val = (total > 0) ? (correct / total) * 100 : 0; // Using total questions or visited?
        // User snippet uses correct / answers.length. Let's use visited.
        accuracy_val = (visited > 0) ? (correct / visited) * 100 : 0;

        let userPersona = "";
        if (accuracy_val > 90) {
            if (speedScore > 80) userPersona = "THE MACHINE 🤖";
            else if (speedScore > 40) userPersona = "THE PROFESSIONAL 🎓";
            else userPersona = "THE SNIPER 🎯";
        } else if (accuracy_val > 70) {
            if (speedScore > 80) userPersona = "THE SPRINTER 🏃";
            else if (speedScore > 40) userPersona = "THE BALANCED ⚖️";
            else userPersona = "THE THINKER ♟️";
        } else {
            if (speedScore > 80) userPersona = "THE DAREDEVIL 🎢";
            else if (speedScore > 40) userPersona = "THE ROOKIE 🌱";
            else userPersona = "THE STRUGGLER 🐢";
        }
        let userPersonaIcon = ""; // Integrated into persona string in new logic (emojis)



        // --- YENİ PERFORMANS ANALİZİ ALANI (v3.0) ---
        // 1. Veri Hazırla (Advanced Perf için mapping)
        const advPerfInput = this.icpeSession.answers.map(a => ({
            isCorrect: a.correct,
            d: a.d || 1.2, // fallback
            netTime: a.rawTime,
            hesitation: a.hesitation || false,
            wordCount: a.wordCount,
            content: a.content,
            options: a.options
        }));

        // 2. Fonksiyonu Çağır
        let advPerfRes = { isPreviewMode: true, warningMsg: "Analiz Modülü Yüklenemedi." };
        if (typeof calculateAdvancedPerformance === 'function') {
            advPerfRes = calculateAdvancedPerformance(advPerfInput, total);
        }

        let advPerfHTML = "";
        if (advPerfRes.isPreviewMode) {
            advPerfHTML = `<div class="analysis-card warning" style="border-left-color:#eab308; background:#fefce8;">${advPerfRes.warningMsg}</div>`;
        } else {
            advPerfHTML = advPerfRes.htmlReport;
        }

        const container = document.getElementById('prodil-exam-container');
        if (!container) return;


        container.innerHTML = `
                <div id="prodil-exam-report-card" class="exam-card report-mode" style="padding: 0; overflow: hidden; height: auto; min-height: auto;">
                <div class="exam-header">
                     <div style="font-weight: bold;">SINAV SONUÇ RAPORU</div>
                     <button onclick="ProdilExam.closeUI()" class="close-btn" title="Kapat">✕</button>
                </div>

                <div style="padding: 25px;">
                    
                    <!-- UNFINISHED WARNING -->
                    ${visited < total ? `
                    <div style="background-color: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; display: flex; align-items: start; gap: 10px;">
                        <i class="fa-solid fa-triangle-exclamation" style="margin-top: 3px;"></i>
                        <div>
                            <strong>Dikkat:</strong> Sınavı erken bitirdiniz. 
                            Puanlamanız ${total} sorudan ${visited} tanesi üzerinden oranlanarak gerçeğe yakın yapılmıştır.
                        </div>
                    </div>
                    ` : ''}

                    <!-- SUMMARY HEADER -->
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div class="total-score-box" style="padding: 20px 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; margin-bottom: 10px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:white; border-radius:16px;">
                             <div class="score-lbl" style="font-size: 1rem; margin:0; opacity:0.8; font-weight:500;">GENEL EĞİLİM VE SKOR</div>
                             <div class="score-val" style="font-size: 3.5rem; font-weight:900; line-height:1;">${finalScore}</div>
                             
                             <div style="display:flex; align-items:center; gap:15px; margin-top:10px;">
                                <div style="background:rgba(255,255,255,0.1); padding:4px 12px; border-radius:8px; display:flex; align-items:center; gap:6px;">
                                    <span style="font-weight:800; font-size:1.1rem; color:${userLevelColor}; text-shadow: 0 0 10px rgba(255,255,255,0.2);">${userLevel} - ${userLevelDesc}</span>
                                </div>
                                <div style="background:rgba(255,255,255,0.1); padding:4px 12px; border-radius:8px; display:flex; align-items:center; gap:6px;">
                                    <span style="font-weight:700; font-size:0.9rem;">${userPersona}</span>
                                </div>
                             </div>
                             
                             <!-- Detail Feedback Message -->
                             <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.9; max-width: 90%; text-align: center; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 8px;">
                                ${feedbackMsg}
                             </div>
                        </div>

                         <!-- Score breakdown removed based on user request for unified score presentation -->
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
                                <span style="color:#6b7280; font-size: 0.9rem;">${effectiveEmpty}</span>
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





                        <!-- GELİŞMİŞ PERFORMANS ANALİZİ (v3.0) -->
                         <div style="margin-bottom: 20px;">
                            <h4 style="color:#d97706; font-weight: 800; margin-bottom:15px; display:flex; align-items:center; gap:8px;">
                                <i class="fa-solid fa-chart-radar"></i> PERFORMANS ANALİZİ (Yetenek Haritası)
                            </h4>
                            
                            ${!advPerfRes.isPreviewMode ? `
                            <!-- 1. Üst Bölüm: Radar & Trend -->
                            <div style="display:flex; gap:15px; flex-wrap:wrap; margin-bottom:15px;">
                                <!-- Radar Chart -->
                                <div style="flex:2; min-width:300px; background:white; border-radius:12px; padding:10px; border:1px solid #f3f4f6; box-shadow:0 2px 4px rgba(0,0,0,0.05); height:320px;">
                                    <div style="height:280px; position:relative;">
                                        <canvas id="performanceRadarChart"></canvas>
                                    </div>
                                </div>
                                
                                <!-- Trend & Skor Kartları -->
                                <div style="flex:1; min-width:150px; display:flex; flex-direction:column; gap:10px;">
                                    <!-- Trend -->
                                    <div style="background:#f8fafc; padding:15px; border-radius:12px; border:1px solid #e2e8f0; text-align:center;">
                                        <span style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase;">Gelişim Trendi</span>
                                        <div style="font-size:1.5rem; margin-top:5px; display:flex; justify-content:center;">
                                            ${advPerfRes.chartData?.trendHTML || '<span style="color:#9ca3af">-</span>'}
                                        </div>
                                    </div>
                                    <!-- Hız Skoru (AGI) -->
                                    <div style="background:#f0f9ff; padding:15px; border-radius:12px; border:1px solid #bae6fd; text-align:center;">
                                        <span style="font-size:0.75rem; color:#0369a1; font-weight:700; text-transform:uppercase;">Çeviklik (AGI)</span>
                                        <div style="font-size:1.8rem; font-weight:800; color:#0284c7; margin-top:0;">
                                            ${advPerfRes.metrics?.agi?.toFixed(0) || '0'}
                                        </div>
                                    </div>
                                    <!-- Bilişsel Hacim (VOL) -->
                                    <div style="background:#fdf4ff; padding:15px; border-radius:12px; border:1px solid #f0abfc; text-align:center;">
                                        <span style="font-size:0.75rem; color:#a21caf; font-weight:700; text-transform:uppercase;">Bilişsel Hacim (VOL)</span>
                                        <div style="font-size:1.8rem; font-weight:800; color:#c026d3; margin-top:0;">
                                            ${advPerfRes.metrics?.vol?.toFixed(0) || '0'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 2. Alt Bölüm: Heartbeat Chart -->
                            <div style="background:white; border-radius:12px; padding:15px; margin-bottom:20px; border:1px solid #f3f4f6; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                                <h5 style="margin:0 0 10px 0; font-size:0.85rem; color:#64748b;">⚡ Hız Ritmi (Nabız Analizi)</h5>
                                <div style="height: 120px; width: 100%;">
                                    <canvas id="heartbeatChart"></canvas>
                                </div>
                            </div>
                            ` : ''}

                            ${advPerfHTML}
                        </div>


                    <!-- SKERA ANALYSIS -->
                    <div class="report-analysis-box" style="background:#f3f4f6; border: 1px solid #d1d5db; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <h4 style="color:#1e40af; display:flex; justify-content:space-between; font-weight: 800; margin-bottom: -8px;">
                            DAVRANIŞ ANALİZİ (SKERA)
                            <span style="background:${skeraColor}; color:white; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight: 500;">Psycho-Metrics</span>
                        </h4>
                        <div style="font-weight:700; color:#000; margin: 0 0 2px 0; display:flex; justify-content:space-between; align-items:center; font-size: 1rem;">
                            <span>${skeraTitle}</span>
                            <span style="font-size: 1.2rem;">${skeraIcon}</span>
                        </div>
                        <p style="margin:0; font-size:0.9rem; color:#1e3a8a; line-height: 1.4;">${skeraMsg}</p>
                        <div style="margin-top:10px; background:rgba(255,255,255,0.5); height:6px; border-radius:3px;">
                            <div style="width:${skeraPercent}%; background:${skeraColor}; height:100%; border-radius:3px;"></div>
                        </div>
                    </div>



                    <!-- 3. Kısım: Nöro-Metrik Analiz (YENİ) -->
                    <!-- BİLİŞSEL REFLEKS VE İŞLEM KAPASİTESİ -->
                    <div class="report-analysis-box" style="background:#fff; border: 1px solid #8b5cf6; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.1);">
                         <h4 style="color:#6d28d9; display:flex; justify-content:space-between; font-weight: 800;">
                            REFLEKS ANALİZİ 
                            <span style="background:#8b5cf6; color:white; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight: 500;">Neuro-Metrics</span>
                        </h4>
                        
                        <!-- Calculations for Neuro-Metrics -->
                        ${(() => {
                // Helper to calculate metrics safely
                const answers = this.icpeSession.answers;
                if (!answers || answers.length === 0) return '<div style="color:gray;">Yeterli veri yok.</div>';

                const rawTimes = answers.map(a => a.rawTime);
                const cpsValues = answers.map(a => a.cps);
                const relValues = answers.map(a => a.reliability);

                // 1. Avg Reaction Time
                const avgTimeMs = rawTimes.reduce((a, b) => a + b, 0) / rawTimes.length;
                const avgTimeSec = (avgTimeMs / 1000).toFixed(2);

                // 2. Avg CPS
                const avgCps = (cpsValues.reduce((a, b) => a + b, 0) / cpsValues.length).toFixed(1);

                // 3. Stability (100 - CV)
                // CV = (StdDev / Mean) * 100
                const mean = avgTimeMs;
                const variance = rawTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / rawTimes.length;
                const stdDev = Math.sqrt(variance);
                const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
                let stability = Math.max(0, Math.min(100, 100 - cv));

                // Adjust stability visually (it's hard to get 100%)
                stability = Math.min(100, stability * 1.2);

                // 4. Decision Confidence (Reliability Avg)
                const avgRel = (relValues.reduce((a, b) => a + b, 0) / relValues.length) * 100;

                return `
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-top:15px;">
                                
                                <!-- Metric 1: Reaction Speed -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.9rem; color:#4b5563; font-weight:600;">
                                        <span>Ortalama Tepki Hızı</span>
                                        <span>${avgTimeSec} sn</span>
                                    </div>
                                    <div style="background:#e5e7eb; height:8px; border-radius:4px; overflow:hidden;">
                                        <!-- Inverse logic: 1s is fast (100%), 5s is slow (20%) -->
                                        <!-- Formula: 3000ms base. Percent = (1 - (time/5000)) * 100 -->
                                        <div style="width:${Math.max(10, Math.min(100, (1 - (avgTimeMs / 5000)) * 100))}%; background:#8b5cf6; height:100%; border-radius:4px;"></div>
                                    </div>
                                    <div style="font-size:0.75rem; color:#9ca3af; margin-top:3px;">Hedef: < 2.00 sn</div>
                                </div>

                                <!-- Metric 2: Processing Speed (CPS) -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.9rem; color:#4b5563; font-weight:600;">
                                        <span>Bilişsel İşlem (CPS)</span>
                                        <span>${avgCps} kelime/sn</span>
                                    </div>
                                    <div style="background:#e5e7eb; height:8px; border-radius:4px; overflow:hidden;">
                                        <!-- Max logic: 5.0 cps is 100% -->
                                        <div style="width:${Math.min(100, (avgCps / 5) * 100)}%; background:#06b6d4; height:100%; border-radius:4px;"></div>
                                    </div>
                                    <div style="font-size:0.75rem; color:#9ca3af; margin-top:3px;">Okuma + Karar Verme Hızı</div>
                                </div>

                                <!-- Metric 3: Focus Stability -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.9rem; color:#4b5563; font-weight:600;">
                                        <span>Odaklanma Kararlılığı</span>
                                        <span>%${stability.toFixed(0)}</span>
                                    </div>
                                    <div style="background:#e5e7eb; height:8px; border-radius:4px; overflow:hidden;">
                                        <div style="width:${stability}%; background:${stability > 70 ? '#10b981' : (stability > 40 ? '#f59e0b' : '#ef4444')}; height:100%; border-radius:4px;"></div>
                                    </div>
                                    <div style="font-size:0.75rem; color:#9ca3af; margin-top:3px;">Ritim tutarlılığı</div>
                                </div>
                                
                                <!-- Metric 4: Decision Confidence -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.9rem; color:#4b5563; font-weight:600;">
                                        <span>Karar Güvenilirliği</span>
                                        <span>%${avgRel.toFixed(0)}</span>
                                    </div>
                                    <div style="background:#e5e7eb; height:8px; border-radius:4px; overflow:hidden;">
                                        <div style="width:${avgRel}%; background:${avgRel > 80 ? '#10b981' : '#f59e0b'}; height:100%; border-radius:4px;"></div>
                                    </div>
                                    <div style="font-size:0.75rem; color:#9ca3af; margin-top:3px;">Tereddüt ve Şans Faktörü</div>
                                </div>

                            </div>

                                ${(() => {
                        // 5. Pulse Report Variables (Min/Max Time)
                        const minTime = Math.min(...rawTimes) / 1000;
                        const maxTime = Math.max(...rawTimes) / 1000;

                        // Pulse Report Logic
                        const stabilityValue = stability.toFixed(1);
                        const stdDevValue = (stdDev / 1000).toFixed(1); // Convert ms to sec
                        const avgTimeValue = Number(avgTimeSec); // Ensure number for comparison
                        const minTimeValue = minTime.toFixed(1);
                        const maxTimeValue = maxTime.toFixed(1);
                        // Calculate Accuracy (0-100) based on correct/seen
                        const accuracy = (visited > 0) ? Math.round((this.correctCount / visited) * 100) : 0;

                        let pulseComment = "";

                        // 1. GÜVENLİK DUVARI: "SALLAMA" VEYA "AŞIRI HIZ KÖRLÜĞÜ" KONTROLÜ
                        // Eğer çok hızlıysa (< 5 sn) VE doğruluğu kötüyse (< %50) -> Ritim değil, ciddiyet sorunu vardır.
                        if (avgTimeValue < 5 && accuracy < 50) {
                            pulseComment = `
                            <h4 style="margin: 0 0 -5px 0;">
                                <div class="analysis-card-header">
                                    <span class="analysis-subtitle" style="margin: 0;">Kontrolsüz Hız ve Refleksif Hatalar (Ortalama: ${avgTimeValue} sn)</span>
                                    <span>⚠️</span>
                                </div>
                            </h4>
                            <p style="margin: -8px 0 0 0; line-height: 1.4;">Veriler, soruları okuma hızının üzerinde bir süratle geçtiğinizi gösteriyor. Standart sapmanızın düşük olması burada bir başarı değil; soruları analiz etmeden, mekanik bir şekilde işaretlediğinizi düşündürüyor. Bu ritim, "Hız Körlüğü"ne işaret eder. Potansiyelinizi yansıtmak için biraz yavaşlamalısınız.</p>`;
                        }
                        // -----------------------------------------------------------
                        // 10 KADEMELİ RİTİM ANALİZİ (Decile System)
                        // -----------------------------------------------------------
                        else if (stability > 90) {
                            pulseComment = `
                            <h4 style="margin: 0 0 -5px 0;">
                                <div class="analysis-card-header">
                                    <span class="analysis-subtitle" style="margin: 0;">Mükemmel Ritim ve Ustalık (Kararlılık: %${stabilityValue})</span>
                                    <span>💎</span>
                                </div>
                            </h4>
                            <p style="margin: -8px 0 0 0; line-height: 1.4;">Zihinsel nabzınız kusursuza yakın atıyor. Sorular arası geçişlerde standart sapmanız yalnızca ${stdDevValue} saniye. Bu istikrar, sınav stratejinizin tamamen oturduğunu ve konulara hakim olduğunuzu gösterir. En hızlı (${minTimeValue} sn) ile en yavaş (${maxTimeValue} sn) cevabınız arasındaki farkın azlığı, "Takılmadan İlerleyen Bir Profesyonel" olduğunuzun kanıtıdır.</p>`;
                        }
                        else if (stability > 80) {
                            pulseComment = `
                            <h4 style="margin: 0 0 -5px 0;">
                                <div class="analysis-card-header">
                                    <span class="analysis-subtitle" style="margin: 0;">Profesyonel Akış (Kararlılık: %${stabilityValue})</span>
                                    <span>✅</span>
                                </div>
                            </h4>
                            <p style="margin: -8px 0 0 0; line-height: 1.4;">Zihinsel ritminiz oldukça tutarlı. İngilizce sınavlarında en büyük tuzak olan “bir soruda takılıp kalma” problemini neredeyse hiç yaşamamışsınız. Standart sapmanız (${stdDevValue} sn) makul seviyede. Zorlandığınız anlarda bile (${maxTimeValue} sn) kontrolü kaybetmemişsiniz.</p>`;
                        }
                        else if (stability > 70) {
                            pulseComment = `
                            <h4 style="margin: 0 0 -5px 0;">
                                <div class="analysis-card-header">
                                    <span class="analysis-subtitle" style="margin: 0;">İyi ve Dengeli (Kararlılık: %${stabilityValue})</span>
                                    <span>👍</span>
                                </div>
                            </h4>
                                                        <p style="margin: -8px 0 0 0; line-height: 1.4;">Genel olarak iyi bir tempoda ilerlemişsiniz. Ortalama süreniz ${avgTimeValue} saniye. Ufak tefek hız değişimleri olsa da, genel akışınız sağlıklı. Hızlı çözdüğünüz sorular (${minTimeValue} sn) reflekslerinizin iyi olduğunu gösteriyor.</p>`;
                        }
                        else if (stability > 60) {
                            pulseComment = `
                            <h4 style="margin: 0 0 -5px 0;">
                                <div class="analysis-card-header">
                                    <span class="analysis-subtitle" style="margin: 0;">Doğal Dalgalanma (Kararlılık: %${stabilityValue})</span>
                                    <span>⚖️</span>
                                </div>
                            </h4>
                                                        <p style="margin: -8px 0 0 0; line-height: 1.4;">Sınav içinde hızınızın metnin türüne göre değiştiğini görüyoruz. (Standart sapma: ${stdDevValue} sn). Bu, "Bildiğimi hızlı yaparım, bilmediğimde düşünürüm" stratejisidir ve normaldir.</p>`;
                        }
                        else if (stability > 50) {
                            pulseComment = `
                            <h4 style="margin: 0 0 -5px 0;">
                                <div class="analysis-card-header">
                                    <span class="analysis-subtitle" style="margin: 0;">Odak Değişimleri (Kararlılık: %${stabilityValue})</span>
                                    <span>📉</span>
                                </div>
                            </h4>
                                                        <p style="margin: -8px 0 0 0; line-height: 1.4;">Zihinsel ritminizde belirgin oynamalar var. En hızlı soru ${minTimeValue} sn iken en yavaş soru ${maxTimeValue} sn. Bu veri, sınavın bazı bölümlerinde çok akıcı ilerlediğinizi, ancak bazı soru tiplerinde tempoyu kaybettiğinizi gösteriyor.</p>`;
                        }
                        else if (stability > 40) {
                            pulseComment = `
                            <h4 style="margin: 0 0 -5px 0;">
                                <div class="analysis-card-header">
                                    <span class="analysis-subtitle" style="margin: 0;">Ritim Bozukluğu (Kararlılık: %${stabilityValue})</span>
                                    <span>🌊</span>
                                </div>
                            </h4>
                                                        <p style="margin: -8px 0 0 0; line-height: 1.4;">Verilerinizde ciddi duraklamalar görüyoruz. Bir soruyu ortalama ${avgTimeValue} saniyede çözerken, takıldığınız bir soruda süreyi çok uzatmışsınız. Bu genellikle gramer kuralları arasında kararsız kalmaktan kaynaklanır. Karar verme mekanizmanızı hızlandırmanız gerekiyor.</p>`;
                        }
                        else if (stability > 30) {
                            pulseComment = `
                            <h4 style="margin: 0 0 -5px 0;">
                                <div class="analysis-card-header">
                                    <span class="analysis-subtitle" style="margin: 0;">Dikkat Dağınıklığı (Kararlılık: %${stabilityValue})</span>
                                    <span>⚠️</span>
                                </div>
                            </h4>
                                                        <p style="margin: -8px 0 0 0; line-height: 1.4;">Zihinsel ritminiz tehlikeli bölgeye yakın. Standart sapmanız ${stdDevValue} saniye. Soruların yarısında çok hızlı, diğer yarısında çok yavaşsınız. Bu dengesizlik, sınav konsantrasyonunuzun sık sık bölündüğünü gösteriyor olabilir.</p>`;
                        }
                        else if (stability > 20) {
                            pulseComment = `
                            <h4 style="margin: 0 0 -5px 0;">
                                <div class="analysis-card-header">
                                    <span class="analysis-subtitle" style="margin: 0;">Yüksek Tutarsızlık (Kararlılık: %${stabilityValue})</span>
                                    <span>🌪️</span>
                                </div>
                            </h4>
                                                        <p style="margin: -8px 0 0 0; line-height: 1.4;">Sınav boyunca zihinsel ritminiz sürekli kesintiye uğramış. En yavaş soruda ${maxTimeValue} saniye beklemiş, en hızlıda ${minTimeValue} saniyeyle geçmişsiniz. Makas çok açık. Bu durum, okuma alışkanlığınızın henüz oturmadığını işaret ediyor.</p>`;
                        }
                        else if (stability > 10) {
                            pulseComment = `
                            <h4 style="margin: 0 0 -5px 0;">
                                <div class="analysis-card-header">
                                    <span class="analysis-subtitle" style="margin: 0;">Kritik Kopuşlar (Kararlılık: %${stabilityValue})</span>
                                    <span>❌</span>
                                </div>
                            </h4>
                                                        <p style="margin: -8px 0 0 0; line-height: 1.4;">Hızınız o kadar değişken ki saniyesi saniyesine uymuyor (Standart sapma: ${stdDevValue} sn). Bu, sınav stratejisinden ziyade, temel bilgi eksikliği veya sınav anında yaşanan yoğun stresten kaynaklanabilir.</p>`;
                        }
                        else {
                            pulseComment = `
                            <h4 style="margin: 0 0 -5px 0;">
                                <div class="analysis-card-header">
                                    <span class="analysis-subtitle" style="margin: 0;">Kaotik ve Rastgele (Kararlılık: %${stabilityValue})</span>
                                    <span>🚨</span>
                                </div>
                            </h4>
                                                        <p style="margin: -8px 0 0 0; line-height: 1.4;">Bu sınavdaki süre verileriniz herhangi bir stratejiye işaret etmiyor. Soruların bir kısmını okumadan geçmiş, bir kısmında ise aşırı uzun süre beklemiş görünüyorsunuz. Bu performansla sağlıklı bir ölçüm yapmak zor.</p>`;
                        }

                        return `
                    <div style="margin-top:15px; padding:15px; background:#f5f3ff; border-radius:12px; font-size:0.9rem; color:#4c1d95; border-left:4px solid #7c3aed; line-height: 1.6; box-shadow: 0 2px 4px rgba(124, 58, 237, 0.1);">
                        <strong style="display:block; margin-bottom:0; font-size:1rem; color:#6d28d9;"><i class="fa-solid fa-heart-pulse" style="margin-right:8px;"></i>NABIZ RAPORU</strong>
                        ${pulseComment}
                    </div>
                    `;
                    })()}
                    `;
            })()}
                </div>

                </div>

                <!--FOOTER ACTIONS-->
                <div class="control-panel" style="padding: 15px; border-top: 1px solid #eee; display:flex; gap:10px;">
                    <button onclick="ProdilExam.restartExam()" class="btn-action btn-secondary" style="flex:1; justify-content:center;">🔄 TEKRAR</button>
                    <button onclick="window.print()" class="btn-action btn-secondary" style="flex:0.8; justify-content:center;">🖨️ YAZDIR</button>
                    <button onclick="ProdilExam.shareReport()" class="btn-action btn-primary" style="flex:1.2; justify-content:center;">📤 PAYLAŞ</button>
                </div>
            </div>
                `;


        // --- 4. Chart.js Entegrasyonu (Grafiği Çizdir) ---
        console.log("📊 Chart.js Başlatılıyor (v3.0)...");

        if (!advPerfRes.isPreviewMode && window.Chart) {
            setTimeout(() => {
                // --- A) RADAR CHART (6 Eksen) ---
                const ctxRadar = document.getElementById('performanceRadarChart');
                if (ctxRadar) {
                    try {
                        const chartRadar = Chart.getChart(ctxRadar);
                        if (chartRadar) chartRadar.destroy();

                        new Chart(ctxRadar, {
                            type: 'radar',
                            data: {
                                labels: advPerfRes.chartData.labels, // ["ÇEVİKLİK", "REFLEKS"...]
                                datasets: [{
                                    label: 'Yetenek Profili',
                                    data: advPerfRes.chartData.data, // [agi, rfx, acc...]
                                    fill: true,
                                    backgroundColor: 'rgba(217, 35, 46, 0.15)',
                                    borderColor: '#D9232E',
                                    borderWidth: 2,
                                    pointBackgroundColor: '#D9232E',
                                    pointBorderColor: '#fff',
                                    pointHoverBackgroundColor: '#fff',
                                    pointHoverBorderColor: '#D9232E',
                                    pointRadius: 3
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    r: {
                                        angleLines: { display: true, color: '#f1f5f9' },
                                        grid: { color: '#f1f5f9' },
                                        suggestedMin: 0,
                                        suggestedMax: 100,
                                        ticks: { display: false, stepSize: 25 },
                                        pointLabels: {
                                            font: { size: 10, weight: '700', family: "'Inter', sans-serif" },
                                            color: '#475569'
                                        }
                                    }
                                },
                                plugins: { legend: { display: false } }
                            }
                        });
                    } catch (e) { console.error("Radar Chart Error:", e); }
                }

                // --- B) HEARTBEAT LINE CHART (Hız-Zaman Çizgisi) ---
                const ctxLine = document.getElementById('heartbeatChart');
                if (ctxLine && advPerfRes.chartData && advPerfRes.chartData.heartbeat) {
                    try {
                        const chartLine = Chart.getChart(ctxLine);
                        if (chartLine) chartLine.destroy();

                        // Soru numaraları (1, 2, 3...)
                        const labels = advPerfRes.chartData.heartbeat.map((_, i) => (i + 1).toString());

                        new Chart(ctxLine, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Süre (sn)',
                                    data: advPerfRes.chartData.heartbeat,
                                    // Görsel Referansa Uygun Renkler (EKG Modu)
                                    borderColor: '#ef4444', // Red 500 (Kalp Ritmi Kırmızısı)
                                    backgroundColor: 'transparent', // Dolgu Yok
                                    borderWidth: 2,
                                    tension: 0,   // Zigzag (Keskin Hatlar - EKG Style)
                                    fill: false,  // Alan Dolgusu Kapalı
                                    pointRadius: 3,
                                    pointBackgroundColor: '#ef4444', // Kırmızı Nokta
                                    pointBorderColor: '#fff',        // Beyaz Çerçeve
                                    pointBorderWidth: 2,
                                    pointHoverRadius: 5,
                                    pointHoverBackgroundColor: '#fff',
                                    pointHoverBorderColor: '#ef4444'
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                interaction: {
                                    intersect: false,
                                    mode: 'index',
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            color: '#f1f5f9', // Hafif Gri Yatay Çizgiler
                                            drawBorder: false
                                        },
                                        ticks: {
                                            font: { size: 10, family: "'Inter', sans-serif" },
                                            color: '#64748b'
                                        }
                                    },
                                    x: {
                                        grid: { display: false }, // Dikey Çizgiler Kapalı
                                        ticks: {
                                            font: { size: 10, family: "'Inter', sans-serif" },
                                            color: '#94a3b8'
                                        }
                                    }
                                },
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: '#1e293b',
                                        titleFont: { size: 12 },
                                        bodyFont: { size: 12 },
                                        padding: 10,
                                        cornerRadius: 8,
                                        displayColors: false,
                                        callbacks: {
                                            title: (items) => `Soru ${items[0].label}`,
                                            label: (context) => `⏱️ Süre: ${context.parsed.y} sn`
                                        }
                                    }
                                }
                            }
                        });
                    } catch (e) { console.error("Line Chart Error:", e); }
                }

            }, 800);
        } else if (!advPerfRes.isPreviewMode) {
            console.error("❌ Chart.js bulunamadı (v3.0)");
            // Simple Fallback text
            const radarArea = document.getElementById('performanceRadarChart')?.parentElement;
            if (radarArea) radarArea.innerHTML = '<div style="color:red; font-size:0.8rem; text-align:center; padding:20px;">Grafik Modülü Yüklenemedi</div>';
        }

    },

    restartExam: function () {
        this.closeUI();
        // Optionally restart immediately
        // this.startTest(this.currentPath);
    },

    shareReport: function () {
        if (window.html2canvas) {
            // Use specific ID instead of class to avoid capturing background/other cards
            const originalEl = document.getElementById('prodil-exam-report-card');

            if (!originalEl) {
                alert("Rapor bulunamadı.");
                return;
            }

            // 1. Clone the element to manipulate styles without affecting the UI
            const clone = originalEl.cloneNode(true);

            // 2. Set styles to ensure full height is captured (off-screen)
            clone.style.width = originalEl.offsetWidth + 'px';
            clone.style.height = 'auto';
            clone.style.position = 'fixed'; // Use fixed to avoid scroll offsets affecting position
            clone.style.top = '-10000px';
            clone.style.left = '0';
            clone.style.zIndex = '-1';
            clone.style.overflow = 'visible';
            clone.style.borderRadius = '0'; // Prevent rounded corners clipping

            // 3. Find and expand the scrollable content div
            // The template uses inline styles: style="padding: 25px; overflow-y: auto; max-height: 80vh;"
            // We find it and reset its height restrictions.
            const scrollableDivs = clone.querySelectorAll('div[style*="overflow-y: auto"]');
            scrollableDivs.forEach(div => {
                div.style.maxHeight = 'none';
                div.style.height = 'auto';
                div.style.overflow = 'visible';
            });

            // 4. Manually copy Canvas content (Charts)
            // cloneNode does NOT copy the canvas drawing context/bitmap.
            const originalCanvases = originalEl.querySelectorAll('canvas');
            const clonedCanvases = clone.querySelectorAll('canvas');

            originalCanvases.forEach((orig, i) => {
                if (clonedCanvases[i]) {
                    const dest = clonedCanvases[i];
                    const ctx = dest.getContext('2d');
                    // Ensure dimensions match
                    dest.width = orig.width;
                    dest.height = orig.height;
                    ctx.drawImage(orig, 0, 0);
                }
            });

            // Append to body to render
            document.body.appendChild(clone);

            // 5. Capture
            html2canvas(clone, {
                scale: 2, // High resolution
                useCORS: true,
                backgroundColor: '#ffffff',
                windowHeight: clone.scrollHeight + 100 // Ensure full height is recognized
            }).then(canvas => {
                const a = document.createElement('a');
                a.download = 'Prodil_Sinav_Raporu.png';
                a.href = canvas.toDataURL('image/png');
                a.click();

                // Cleanup
                document.body.removeChild(clone);
            }).catch(err => {
                console.error("Screenshot error:", err);
                alert("Rapor oluşturulurken bir hata oluştu: " + err.message);
                if (document.body.contains(clone)) {
                    document.body.removeChild(clone);
                }
            });
        } else {
            alert("Paylaşım özelliği yüklenemedi (html2canvas eksik).");
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

            @media(min-width: 768px) {
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
                font-variant-numeric: tabular-nums;
            }
            .header-left .timer-text {
                width: 38px; /* Fixed width to prevent jitter */
                text-align: right; /* Align right towards the icon */
                padding-right: 4px; /* Small gap to icon */
                padding-left: 0;
            }

            /* Desktop Overrides */
            @media(min-width: 768px) {
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
            .speed-metric { font-size: 0.75rem; display: flex; flex-direction: column; align-items: center; line-height: 1; margin: 0 3px; color: #64748b; } /* Reduced margin from 5px to 3px */
            .speed-value { font-weight: 800; font-size: 0.85rem; margin-bottom: 2px; color: inherit; } /* Reduced from 1rem, inherit color */
            .speed-unit { font-size: 0.65rem; color: inherit; } /* Inherit color from parent */
            
            .speed-correct { color: #4ade80!important; }
            .speed-wrong { color: #f87171!important; }
            .speed-empty { color: #9ca3af!important; }
            
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
            
            .question-area {
                position: relative;
                z-index: 5; /* Ensure it's above canvas */
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
            @media(min-width: 768px) {
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
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }

            /* Active State (for Hint etc.) */
            .btn-active {
                background: #003366!important;
                color: white!important;
                border-color: #003366!important;
                box-shadow: 0 4px 6px rgba(0, 51, 102, 0.2);
            }

            /* Primary Button (Next) - Initially Neutral, Blue on Hover/Press */
            .btn-primary {
                background: #f8fafc;
                color: #475569;
                border-color: #e2e8f0!important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            .btn-primary:hover:not(:disabled), .btn-primary:active:not(:disabled) {
                background: #003366!important;
                color: white!important;
                border-color: #003366!important;
                transform: translateY(-2px);
                box-shadow: 0 8px 15px-4px rgba(0, 51, 102, 0.4);
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
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            .level-selector select option {
                background: #ffffff!important;
                color: #334155!important;
            }

            /* Responsive Adjustments for Mobile Footer */
            @media(max-width: 767px) {
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
                    margin: 0!important;
                    font-size: 0.85rem;
                }
            }
            
            .btn-action:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none!important;
                box-shadow: none!important;
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
            }

            /* --- DETAILED REPORT STYLES (Copied from report.css) --- */
            .exam-card.report-mode {
                max-width: 900px!important;
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
            .stat-card.val { font-size: 1.4rem; font-weight: 800; color: #334155; }
            .stat-card.lbl { font-size: 0.8rem; color: #94a3b8; font-weight: 600; }
            .stat-card.correct .val { color: #16a34a; }
            .stat-card.wrong .val { color: #dc2626; }
            .stat-card.empty .val { color: #ca8a04; }

            .report-analysis-box {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
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
                    box-shadow: none!important;
                    border: none!important;
                    width: 100%!important;
                    max-width: none!important;
                }
                .control-panel, .close-btn { display: none!important; }
            }
            .speed-toggle-btn {
                background: transparent;
                border: none;
                color: #64748b;
                padding: 0 4px; /* Minimal side padding */
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: 600; /* Medium instead of bold */
                cursor: pointer;
                transition: all 0.2s;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .speed-toggle-btn:hover {
                background: transparent;
                color: #334155;
            }

            .speed-panel {
                background: transparent;
                border-bottom: none;
                padding: 4px 0; /* Further reduced padding */
                width: fit-content; /* Only take needed width */
                margin: 0 auto; /* Center it */
                justify-content: center;
                align-items: center;
                animation: slideDown 0.3s ease-out;
                position: relative;
                z-index: 1;
                align-self: center; /* Center horizontally if flex col */
            }

            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Kondisyon Kartı Stilleri */
            .condition-card {
                margin-top: 20px;
                padding: 15px;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                background: linear-gradient(to right, #f8fafc, #fff);
            }
            .condition-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .condition-title {
                font-weight: 800;
                color: #334155;
                font-size: 1.1rem;
            }
            .condition-badge {
                background: #3b82f6;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 700;
            }
            .condition-body {
                font-size: 0.95rem;
                color: #475569;
                line-height: 1.5;
                margin-bottom: 10px;
            }
            .condition-advice {
                font-size: 0.9rem;
                color: #059669;
                background: #ecfdf5;
                padding: 10px;
                border-radius: 8px;
                border-left: 4px solid #10b981;
                font-style: italic;
            }

            .timer-text {
                font-family: 'Inter', sans-serif!important;
                font-weight: 500!important; /* Reduced from 700 */
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
            this.showReport();
            this.showLoader(false);
        }, 500);
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

/**
 * 🚀 GELİŞMİŞ PERFORMANS VE STRATEJİ ANALİZİ (v3.0)
 * Bilişsel verilerden "Sınav Karakteri" analizi çıkarır.
 */
/**
 * 🚀 GELİŞMİŞ PERFORMANS VE STRATEJİ ANALİZİ (v3.0)
 * Bilişsel verilerden "Sınav Karakteri" analizi çıkarır.
 */
function calculateAdvancedPerformance(answers, totalQuestions) {

    // --- 0. GÜVENLİK DUVARI (Anti-Cheat Kill Switch) ---
    // İnsan biyolojisi bir soruyu okuyup anlamak için minimum süreye ihtiyaç duyar.
    // Eğer ortalama süre 0.8 saniyenin altındaysa bu bir anomalidir.
    const totalDuration = answers.reduce((sum, a) => sum + (a.netTime || 0), 0);
    // netTime ms cinsinden olabilir, kontrol edelim. Genelde saniye olarak saklanıyor bu projede (rawTime).
    // exam_engine.js:1198'de rawTime kullanılmış.
    const durationSec = totalDuration / 1000;

    if (durationSec < (answers.length * 0.8)) {
        return {
            isPreviewMode: true,
            isCheat: true,
            warningMsg: `⛔ <b>ANOMALİ TESPİTİ</b><br>
            Sınav verilerinizde "İnsan Dışı Hız" tespit edildi. Soruları okumadan işaretlediğiniz veya bir script kullandığınız anlaşılıyor.<br>
            Analiz iptal edildi.`
        };
    }

    // --- 1. GÜVENLİK DUVARI: YETERSİZ VERİ (Preview Mode) ---
    if (answers.length < 10) {
        return {
            isPreviewMode: true,
            warningMsg: `⚠️ <b>YETERSİZ VERİ ANALİZİ</b><br>
            Testi erken tamamladığınız için (Çözülen: ${answers.length}), Bilişsel Dayanıklılık ve Strateji haritanız oluşturulamadı.
            Gerçek sınav karakterinizi görmek için lütfen testi tamamlayın.`
        };
    }

    // --- DATA HAZIRLIĞI ---
    let correctAttempts = answers.filter(a => a.isCorrect);
    let wrongAttempts = answers.filter(a => !a.isCorrect);

    // --- 2. RADAR GRAFİĞİ METRİKLERİ (6 KÖŞELİ HEXAGON) ---

    // [ACC] - Accuracy (İsabet)
    let accScore = (correctAttempts.length / answers.length) * 100;

    // [AGI] - Agility (Gerçek Okuma Hızı / CPS) - v3.1 Revize

    // 1. ADIM: Toplam Kelime Hacmini Hesapla (HTML Temizliği ile)
    let totalWords = answers.reduce((sum, a) => {
        // A) Hazır sayı varsa kullan
        if (typeof a.wordCount === 'number') {
            return sum + a.wordCount;
        }
        // B) Yoksa Soru + Şıklar metnini birleştir
        let rawText = a.content || a.text || a.question || "";

        // Şıkları kontrol et ve metne ekle (Veri yapısına göre options veya choices olabilir)
        let optionsArray = a.options || a.choices || a.answers;
        if (Array.isArray(optionsArray)) {
            optionsArray.forEach(opt => {
                // Şık bir obje ise (opt.metin - bizim yapıda bu) veya direkt string ise
                // ProdilExam yapısında q.siklar[{metin: "..."}] şeklindedir.
                let optText = (typeof opt === 'object') ? (opt.metin || opt.text || opt.content || "") : opt;
                rawText += " " + optText;
            });
        }

        // HTML temizliği ve Sayım
        if (rawText) {
            // HTML etiketlerini sil
            let cleanText = rawText.replace(/<[^>]*>/g, ' ');
            // Boşlukları sil ve kelimeleri say
            let calculatedCount = cleanText.trim().split(/\s+/).filter(w => w.length > 0).length;
            return sum + calculatedCount;
        }

        return sum;
    }, 0);

    // 2. ADIM: Saniye Başına Kelime (Words Per Second)
    let avgCPS = durationSec > 0 ? (totalWords / durationSec) : 0;

    // 3. ADIM: Puanlama (YENİ REFERANS: 7.0 CPS = 100 Puan)
    // 5.0 yerine 7.0 yaparak 100 almayı zorlaştırıyoruz.
    let agiScore = Math.min(100, (avgCPS / 7.0) * 100);

    // --- [PWR] POWER (YÜK KAPASİTESİ MODELİ) ---
    // Mantık: Kaldırılan Yük / Toplam Yük

    // 1. Doğru bildiği soruların zorluklarını topla (Puan)
    let earnedLoad = correctAttempts.reduce((sum, a) => sum + (a.d || 1), 0);

    // 2. Çözdüğü (Attempted) tüm soruların zorluklarını topla (Potansiyel)
    let totalLoad = answers.reduce((sum, a) => sum + (a.d || 1), 0);

    // 3. Oranla (0'a bölünme hatasını önle)
    let pwrScore = totalLoad > 0 ? (earnedLoad / totalLoad) * 100 : 0;
    let rawPower = pwrScore; // Eski değişken ismini rapor kısmında kullanıyorsa uyumluluk için

    // [STA] - Stamina (Dayanıklılık)
    let midPoint = Math.floor(answers.length / 2);
    let firstHalf = answers.slice(0, midPoint);
    let secondHalf = answers.slice(midPoint);
    let acc1 = (firstHalf.filter(a => a.isCorrect).length / firstHalf.length) * 100;
    let acc2 = (secondHalf.filter(a => a.isCorrect).length / secondHalf.length) * 100;
    let staminaDrop = acc1 - acc2;
    let staScore = staminaDrop > 0 ? Math.max(0, 100 - staminaDrop) : 100;

    // [RES] - Resilience (Direnç)
    let reboundAttempts = 0;
    let reboundSuccess = 0;
    for (let i = 0; i < answers.length - 1; i++) {
        if (!answers[i].isCorrect) {
            reboundAttempts++;
            if (answers[i + 1].isCorrect) {
                reboundSuccess++;
            }
        }
    }
    let resScore = (wrongAttempts.length === 0) ? 100 :
        (reboundAttempts > 0 ? (reboundSuccess / reboundAttempts) * 100 : 0);


    // --- [RFX] REFLEKS (AVANSLI DOĞRUSAL MODEL) ---
    // Mantık: İlk %20'lik sürede 100 tam puan. Sonrasında 0'a kadar düz (lineer) iniş.

    let totalReflexPoints = 0;
    let countedQuestions = 0;

    correctAttempts.forEach(a => {
        // Soru Limiti (Yoksa 20sn varsay)
        let qLimit = a.limit || 20;

        // 1. GÜVENLİ BÖLGE (AVANS)
        // Limitin %20'si. Ancak insan biyolojisi gereği en az 3 saniye avans verelim.
        let safeZone = Math.max(3.0, qLimit * 0.20);

        let timeSec = a.netTime / 1000; // ms to sec
        let qScore = 0;

        // 2. PUANLAMA
        if (timeSec <= safeZone) {
            // Avans Bölgesi -> 100 Tam Puan
            qScore = 100;
        } else if (timeSec >= qLimit) {
            // Süre Doldu -> 0 Puan
            qScore = 0;
        } else {
            // Avans ile Bitiş Arasında Doğrusal Hesap
            // Formül: 100 * ((ToplamSüre - GeçenSüre) / (ToplamSüre - AvansSüresi))
            qScore = 100 * ((qLimit - timeSec) / (qLimit - safeZone));
        }

        // 3. CEZA
        // Tereddüt (Hesitation) varsa puanı %25 kır.
        if (a.hesitation) {
            qScore *= 0.75;
        }

        totalReflexPoints += qScore;
        countedQuestions++;
    });

    // Toplamı soru sayısına böl
    let rfxScore = countedQuestions > 0 ? (totalReflexPoints / countedQuestions) : 0;


    // --- 3. GÖRSELLEŞTİRME VERİLERİ (UI Data) ---

    // Heartbeat Data (Hız Çizgisi)
    let heartbeatData = answers.map(a => (a.netTime / 1000).toFixed(1));

    // Trend Indicator (Gelişim Oku)
    let trendHTML = "";
    if (typeof localStorage !== 'undefined') {
        const lastScore = localStorage.getItem('prodil_last_exam_score');
        const currentScore = ((correctAttempts.length / answers.length) * 100).toFixed(0);

        if (lastScore !== null) {
            let diff = currentScore - parseFloat(lastScore);
            if (diff > 0) {
                trendHTML = `<span style="color:#16a34a; font-weight:800; display:flex; align-items:center; gap:4px;"><i class="fa-solid fa-arrow-trend-up"></i> +${diff.toFixed(0)}</span>`;
            } else if (diff < 0) {
                trendHTML = `<span style="color:#ef4444; font-weight:800; display:flex; align-items:center; gap:4px;"><i class="fa-solid fa-arrow-trend-down"></i> ${diff.toFixed(0)}</span>`;
            } else {
                trendHTML = `<span style="color:#64748b; font-weight:800; display:flex; align-items:center; gap:4px;"><i class="fa-solid fa-minus"></i> 0</span>`;
            }
        } else {
            trendHTML = `<span style="color:#94a3b8; font-size:0.8rem;">İlk Veri</span>`;
        }
        // [ONEMLI] Buraya last_score update'i KOYMA. O iş startTest'te.
        // Sadece Buffer'a at.
        localStorage.setItem('prodil_current_exam_score_buffer', currentScore);
    }


    // --- 4. DETAYLI YORUM MOTORU (NARRATIVE ENGINE v3.0 - PRO ANALYTICS) ---
    let htmlReport = "";

    // ------------------------------------------
    // 1. İSABET (ACCURACY) - ADİL PUANLAMA
    // ------------------------------------------

    // SENARYO 1: MÜKEMMEL (%85 ve Üzeri)
    if (accScore >= 85) {
        htmlReport += `
        <div class="analysis-card success">
            <h4>
                <div class="analysis-card-header">
                    <span>İSABET ANALİZİ (%${accScore.toFixed(0)})</span>
                    <span>🎯</span>
                </div>
                <span class="analysis-subtitle">Üst Düzey Odak ve Hakimiyet</span>
            </h4>
            <p>Sınav genelindeki %${accScore.toFixed(0)}'lik doğruluk oranı, konu hakimiyetinizin ve dikkat seviyenizin sınav standartlarının çok üzerinde olduğunu kanıtlıyor. Yanıltıcı şıklara düşmeden, net doğrularla ilerlemişsiniz. Bu performans, rastlantısal değil, oturmuş bir bilgi birikiminin sonucudur.</p>
        </div>`;
    }
    // SENARYO 2: KRİTİK (%60'ın Altı )
    else if (accScore < 60) {
        htmlReport += `
        <div class="analysis-card alert">
            <h4>
                <div class="analysis-card-header">
                    <span>İSABET ANALİZİ (%${accScore.toFixed(0)})</span>
                    <span>⚠️</span>
                </div>
                <span class="analysis-subtitle">Kritik Bilgi ve Dikkat Eksikliği</span>
            </h4>
            <p>Mevcut %${accScore.toFixed(0)}'lik başarı oranı, sınav hazırlık sürecinizde bazı boşluklar olduğunu gösteriyor. Soruların önemli bir kısmında hatalı tercih yapmanız, konu eksiği veya soru köklerini analiz etme hatasından kaynaklanıyor olabilir. Hızlanmayı bırakıp, temelden konu tekrarına dönmelisiniz.</p>
        </div>`;
    }
    // SENARYO 3: ORTA / GELİŞİME AÇIK)
    else {
        htmlReport += `
        <div class="analysis-card info">
            <h4>
                <div class="analysis-card-header">
                    <span>İSABET ANALİZİ (%${accScore.toFixed(0)})</span>
                    <span>⚖️</span>
                </div>
                <span class="analysis-subtitle">Potansiyel Var / Pratik Gerekli</span>
            </h4>
            <p>Sınavda %${accScore.toFixed(0)} oranında doğruya ulaştınız. Temeliniz sağlam ancak detaylarda veya çeldirici sorularda puan kaybediyorsunuz. Bildiğiniz konularda netsiniz, ancak karmaşık yapılarda (complex structures) biraz daha dikkatli olmanız gerekiyor. Hatalı sorularınızı inceleyerek %90 bandına rahatlıkla çıkabilirsiniz.</p>
        </div>`;
    }

    // ------------------------------------------
    // 2. ÇEVİKLİK (AGILITY) - 4 Senaryo (Daha Detaylı)
    // ------------------------------------------
    if (agiScore > 90) {
        htmlReport += `
        <div class="analysis-card success">
            <h4>
                <div class="analysis-card-header">
                    <span>ÇEVİKLİK (Puan: ${agiScore.toFixed(0)})</span>
                    <span>🤸‍♀️</span>
                </div>
                <span class="analysis-subtitle">Optimum Bilişsel İşlem Hızı</span>
            </h4>
            <p>Metin işleme ve anlama hızınız (CPS), anadil seviyesine (Native) oldukça yakın. Soruları okurken tercüme yapmadan, doğrudan İngilizce düşünerek ilerliyorsunuz. Bu akıcılık, özellikle uzun paragraflı sınavlarda size büyük bir zaman avantajı sağlayacaktır.</p>
        </div>`;
    } else if (agiScore > 65) {
        htmlReport += `
        <div class="analysis-card info">
            <h4>
                <div class="analysis-card-header">
                    <span>ÇEVİKLİK (Puan: ${agiScore.toFixed(0)})</span>
                    <span>🥋</span>
                </div>
                <span class="analysis-subtitle">Standart Sınav Temposu</span>
            </h4>
            <p>Okuma hızınız sınavı yetiştirmek için yeterli düzeyde ancak sınırda geziniyorsunuz. Metinleri işlerken zaman zaman duraksadığınız veya başa döndüğünüz görülüyor. Hız puanınızı %15-20 daha artırmak, sınav sonunda kontroller için size vakit kazandıracaktır.</p>
        </div>`;
    } else if (agiScore < 40) {
        htmlReport += `
        <div class="analysis-card alert">
            <h4>
                <div class="analysis-card-header">
                    <span>ÇEVİKLİK (Puan: ${agiScore.toFixed(0)})</span>
                    <span>🐢</span>
                </div>
                <span class="analysis-subtitle">Yavaş Okuma / Süre Yönetimi Riski</span>
            </h4>
            <p>Veriler, okuma hızınızın olması gerekenin çok altında kaldığını gösteriyor. Muhtemelen kelimeleri tek tek okuyor veya içinizden seslendiriyorsunuz. Bu yöntemle YDT/YDS gibi uzun sınavlarda süreyi yetiştirmeniz matematiksel olarak imkansızlaşır. Acilen "Blok Okuma" (Chunking) egzersizlerine başlamalısınız.</p>
        </div>`;
    } else { // Aşırı Hızlı ve Dikkatsiz (Hile Korumasına takılmayan ama çok hızlı olanlar)
        htmlReport += `
        <div class="analysis-card warning">
            <h4>
                <div class="analysis-card-header">
                    <span>ÇEVİKLİK</span>
                    <span>⚠️</span>
                </div>
                <span class="analysis-subtitle">Kontrolsüz Hız / Okumadan İşaretleme</span>
            </h4>
            <p>Okuma hızınız şaşırtıcı derecede yüksek ancak bu durum doğruluğunuza yansımıyor. Metinleri gerçekten okumak yerine "göz gezdirip" (skimming) geçiyor olabilirsiniz. Hız, kontrolsüz yapıldığında felakettir. Biraz yavaşlayıp anlamaya odaklanın.</p>
        </div>`;
    }

    // ------------------------------------------
    // 3. GÜÇ (POWER) - 3 Senaryo
    // ------------------------------------------
    if (pwrScore > 80) {
        htmlReport += `
        <div class="analysis-card success">
            <h4>
                <div class="analysis-card-header">
                    <span>ZORLUK YÖNETİMİ (Güç: ${pwrScore.toFixed(0)})</span>
                    <span>💪</span>
                </div>
                <span class="analysis-subtitle">Kriz Anlarında Üstün Başarı</span>
            </h4>
            <p>Sınavın en seçici ve zorlayıcı %25'lik diliminde (Zorluk Katsayısı Yüksek Sorular) %${rawPower.toFixed(0)} oranında başarı sağladınız. Çoğu adayın elendiği bu sorularda gösterdiğiniz performans, sadece dil bilginizin değil, "Analitik Çıkarım" yeteneğinizin de üst düzeyde olduğunu kanıtlıyor.</p>
        </div>`;
    } else if (pwrScore < 40) {
        htmlReport += `
        <div class="analysis-card warning">
            <h4>
                <div class="analysis-card-header">
                    <span>ZORLUK YÖNETİMİ (Güç: ${pwrScore.toFixed(0)})</span>
                    <span>🛡️</span>
                </div>
                <span class="analysis-subtitle">Savunma Hattı Zayıf / Direnç Kırılması</span>
            </h4>
            <p>Standart sorularda performansınız kabul edilebilir seviyedeyken, sınavın zorluk seviyesi arttığında (Boss Sorular) başarı oranınız dramatik şekilde düşüyor. Zorlayıcı cümle yapıları ve çeldiriciler karşısında pes etme eğilimindesiniz. Bu "Kırılganlık" sınav puanınızı limitleyen en büyük faktördür.</p>
        </div>`;
    } else {
        htmlReport += `
        <div class="analysis-card info">
            <h4>
                <div class="analysis-card-header">
                    <span>ZORLUK YÖNETİMİ (Güç: ${pwrScore.toFixed(0)})</span>
                    <span>⚖️</span>
                </div>
                <span class="analysis-subtitle">Dengeli Ama Geliştirilmeli</span>
            </h4>
            <p>Zorluk düzeyi arttıkça performansınızda kısmi bir düşüş yaşanıyor ancak tamamen kopmuyorsunuz. Karşınıza çıkan en zor soruların yarısını doğru yönetebilmişsiniz. Bu, potansiyelinizin olduğunu ancak "Derin Okuma" gerektiren sorularda daha fazla pratiğe ihtiyacınız olduğunu gösterir.</p>
        </div>`;
    }

    // ------------------------------------------
    // 4. DAYANIKLILIK (STAMINA) - 3 Senaryo
    // ------------------------------------------
    if (staminaDrop < -5) {
        htmlReport += `
        <div class="analysis-card success">
            <h4>
                <div class="analysis-card-header">
                    <span>BİLİŞSEL DAYANIKLILIK</span>
                    <span>⚠️</span>
                </div>
                <span class="analysis-subtitle">Pozitif İvme (Isınma Etkisi)</span>
            </h4>
            <p>Sınavın başında yaşadığınız tutukluğu atıp, ikinci yarıda performansınızı %${Math.abs(staminaDrop).toFixed(1)} oranında artırmışsınız. Stres faktörünü zamanla yönetip odağını artıran aday profilindesiniz. Bu özellik, uzun sınavlarda en büyük silahınızdır.</p>
        </div>`;
    } else if (staminaDrop > 15) {
        htmlReport += `
        <div class="analysis-card alert">
            <h4>
                <div class="analysis-card-header">
                    <span>BİLİŞSEL DAYANIKLILIK</span>
                    <span>🚧</span>
                </div>
                <span class="analysis-subtitle">Mental Yorgunluk ve Odak Çöküşü</span>
            </h4>
            <p>Sınavın ilk yarısında gösterdiğiniz başarı, ikinci yarıda %${staminaDrop.toFixed(1)} oranında düşmüş. Bu, bilgi eksikliğinden ziyade "Bilişsel Pilinizin" erken tükendiğini gösterir. Odak süreniz sınavın tamamını kapsamaya yetmiyor. Beyniniz yorulduğunda basit hatalar yapmaya başlıyorsunuz.</p>
        </div>`;
    } else {
        htmlReport += `
        <div class="analysis-card success">
            <h4>
                <div class="analysis-card-header">
                    <span>BİLİŞSEL DAYANIKLILIK</span>
                    <span>🧱</span>
                </div>
                <span class="analysis-subtitle">Sürdürülebilir Odak (Stabil)</span>
            </h4>
            <p>Sınavın ilk sorusundan son sorusuna kadar dikkatinizi aynı seviyede korumayı başarmışsınız. Performans eğrinizde sapma yok. Bu zihinsel kondisyon, sınav stratejinizin oturduğunu gösterir.</p>
        </div>`;
    }

    // ------------------------------------------
    // 5. DİRENÇ (RESILIENCE) - 3 Senaryo
    // ------------------------------------------
    if (wrongAttempts.length === 0) {
        htmlReport += `
        <div class="analysis-card gold">
            <h4>
                <div class="analysis-card-header">
                    <span>DİRENÇ ANALİZİ</span>
                    <span>🚀</span>
                </div>
                <span class="analysis-subtitle">Kusursuz Akış</span>
            </h4>
            <p>Sınav boyunca hiç hata yapmadığınız için negatif psikolojiyle baş etme durumunuz test edilemedi. Mükemmel bir odaklanma örneği.</p>
        </div>`;
    } else if (resScore < 40) {
        htmlReport += `
        <div class="analysis-card warning">
            <h4>
                <div class="analysis-card-header">
                    <span>DİRENÇ ANALİZİ</span>
                    <span>⚠️</span>
                </div>
                <span class="analysis-subtitle">Domino Etkisi / Seri Hata Riski</span>
            </h4>
            <p>Verilerinizde tehlikeli bir psikolojik desen tespit edildi: Bir yanlış yaptıktan sonra moral veya odak kaybı yaşıyorsunuz. Yanlıştan hemen sonra gelen sorularda başarı oranınız sadece %${resScore.toFixed(0)}. Bir hatanın diğer soruları zehirlemesine izin veriyorsunuz. Bu zinciri kırmanız şart.</p>
        </div>`;
    } else {
        htmlReport += `
        <div class="analysis-card info">
            <h4>
                <div class="analysis-card-header">
                    <span>DİRENÇ ANALİZİ</span>
                    <span>🛡️</span>
                </div>
                <span class="analysis-subtitle">Mental Toparlanma Gücü</span>
            </h4>
            <p>Hata yapsanız bile bu durumun bir sonraki soruyu etkilemesine izin vermiyorsunuz. Yanlışlardan sonra %${resScore.toFixed(0)} oranında doğruyla dönmeniz, sınav psikolojisini ve stres yönetimini başardığınızı gösterir.</p>
        </div>`;
    }

    // ------------------------------------------
    // 6. REFLEKS (REFLEX) - 3 Senaryo (Revize Edilmiş Aralıklar)
    // ------------------------------------------
    if (rfxScore > 75) { // Eşiği 80'den 75'e çektik, ulaşılabilir olsun
        htmlReport += `
        <div class="analysis-card success">
            <h4>
                <div class="analysis-card-header">
                    <span>REFLEKS (Puan: %${rfxScore.toFixed(0)})</span>
                    <span>⚡</span>
                </div>
                <span class="analysis-subtitle">Otomatikleşmiş Bilgi</span>
            </h4>
            <p>Soruların %${rfxScore.toFixed(0)}'ini tereddüt etmeden ve ortalama sürenin altında çözmüşsünüz. Bu, konuları düşünerek değil, refleksif olarak bildiğiniz gösterir. En kalıcı öğrenme düzeyi budur.</p>
        </div>`;
    } else if (rfxScore < 40) { // Eşiği 30'dan 40'a çıkardık, uyarı alanı genişledi
        htmlReport += `
        <div class="analysis-card warning">
            <h4>
                <div class="analysis-card-header">
                    <span>REFLEKS (Puan: %${rfxScore.toFixed(0)})</span>
                    <span>🤔</span>
                </div>
                <span class="analysis-subtitle">Karar Güvensizliği ve Tereddüt</span>
            </h4>
            <p>Doğru cevapladığınız sorularda bile şıklar arasında çok fazla gidip geliyorsunuz (Hover/Bekleme). Bilginiz var ama kendinize güveniniz eksik. Bu tereddütler sınavda size ciddi zaman kaybettiriyor. İlk aklınıza gelen şıkkın genellikle doğru olduğunu unutmayın.</p>
        </div>`;
    } else { // %40 - %75 Arası (Senin eklediğin harika senaryo)
        htmlReport += `
        <div class="analysis-card info">
            <h4>
                <div class="analysis-card-header">
                    <span>REFLEKS (Puan: %${rfxScore.toFixed(0)})</span>
                    <span>🧠</span>
                </div>
                <span class="analysis-subtitle">Bilinçli İşlem ve Doğrulama</span>
            </h4>
            <p>Soruyu çözerken bilgiye ulaşmakta zorlanmıyorsunuz ancak yanıtı vermeden önce bir kez daha doğrulama ("Double-Check") ihtiyacı duyuyorsunuz. Bu kontrollü yaklaşım güvenli olsa da, sınavın hız gerektiren bölümlerinde refleksif karar mekanizmanızı biraz daha hızlandırmanız gerekebilir.</p>
        </div>`;
    }

    // ------------------------------------------
    // 7. ZAMAN STRATEJİSİ (HIZ + DOĞRULUK + ORAN ANALİZİ)
    // ------------------------------------------

    // 1. Hesaplamalar
    // Zorluk (d) >= 2.0 olanlar "Zor", altı "Kolay" kabul edilir.
    let hardQs = answers.filter(q => q.d >= 2.0);
    let easyQs = answers.filter(q => q.d < 2.0);

    // Ortalama süreleri hesapla (Veri yoksa 0 veya 1 alarak hatayı önle)
    let avgTimeHard = hardQs.length ? hardQs.reduce((s, q) => s + q.netTime, 0) / hardQs.length : 0;
    let avgTimeEasy = easyQs.length ? easyQs.reduce((s, q) => s + q.netTime, 0) / easyQs.length : 1;

    // Genel Sınav Hızı (Soru Başına Düşen Ortalama Saniye)
    // durationSec değişkeni daha önce hesaplanmış olmalı (toplam sınav süresi / soru sayısı)
    let avgExamTimePerQ = durationSec / answers.length;

    // Strateji Oranı (Zor Soru Süresi / Kolay Soru Süresi)
    let timeRatio = avgTimeHard / (avgTimeEasy || 1);

    // Strateji Puanı (Grafik veya veri için 0-100 arası normalize edilmiş değer)
    let strategyScore = Math.min(100, timeRatio * 50);

    // 2. Karar Mekanizması ve Raporlama
    // -----------------------------------

    // SENARYO A: AŞIRI HIZLI ÇÖZÜM (Biyolojik Sınır Altı)
    if (avgExamTimePerQ < 7) {
        // A1: Hızlı ve Yüksek Doğruluk (%85 üzeri) -> MASTERMIND
        if (accScore > 85) {
            htmlReport += `
            <div class="analysis-card success">
                <h4>
                    <div class="analysis-card-header">
                        <span>ZAMAN STRATEJİSİ</span>
                        <span>🚀</span>
                    </div>
                    <span class="analysis-subtitle">"Mastermind" ve Fotoğrafik Okuma</span>
                </h4>
                <p>Olağanüstü bir veri! Soruları ortalama <b>${avgExamTimePerQ.toFixed(1)} saniye</b> gibi biyolojik okuma sınırının altında çözmenize rağmen <b>%${accScore.toFixed(0)}</b> doğruluk oranını yakaladınız. Bu istatistik, metinleri kelime kelime okumadığınızı, "görsel tarama" (skimming/scanning) yöntemiyle işlediğinizi ve konuya Native seviyesinde hakim olduğunuzu kanıtlar.</p>
            </div>`;
        }
        // A2: Hızlı ve Düşük Doğruluk -> KUMAR / SALLAMA
        else {
            htmlReport += `
            <div class="analysis-card alert">
                <h4>
                    <div class="analysis-card-header">
                        <span>ZAMAN STRATEJİSİ</span>
                        <span>🎲</span>
                    </div>
                    <span class="analysis-subtitle">Okumadan İşaretleme / Rastgele Seçim</span>
                </h4>
                <p>Verilerinizde ciddi bir anomali var. Soruları ortalama <b>${avgExamTimePerQ.toFixed(1)} saniye</b> içinde geçtiniz ancak bu hız size başarı getirmedi. Bu süre, sorunun kökünü ve çeldiricileri analiz etmek için matematiksel olarak yetersizdir. Strateji uygulamıyor, şans faktörüne dayalı bir ilerleme sergiliyorsunuz. Lütfen soruları okuyun.</p>
            </div>`;
        }
    }
    // SENARYO B: NORMAL HIZDA YANLIŞ STRATEJİ (Oran < 0.8)
    else if (timeRatio < 0.8) {
        htmlReport += `
        <div class="analysis-card warning">
            <h4>
                <div class="analysis-card-header">
                    <span>ZAMAN STRATEJİSİ (Oran: ${timeRatio.toFixed(2)})</span>
                    <span>⏳</span>
                </div>
                <span class="analysis-subtitle">Hatalı Önceliklendirme</span>
            </h4>
            <p>Analiz verileri, sınavın kolay sorularına gereğinden fazla zaman harcadığınızı, asıl puan getirecek zor sorularda ise sürenizi yetiştiremediğinizi (veya acele ettiğinizi) gösteriyor. Kolay sorulardaki işlem hızınızı artırıp, "Zaman Kredisi'ni" zor sorulara aktarmadığınız sürece potansiyel netinize ulaşamazsınız.</p>
        </div>`;
    }
    // SENARYO C: RİSKLİ EŞİTLİK (0.8 <= Oran < 1.2)
    else if (timeRatio >= 0.8 && timeRatio < 1.2) {
        htmlReport += `
        <div class="analysis-card info">
            <h4>
                <div class="analysis-card-header">
                    <span>ZAMAN STRATEJİSİ (Oran: ${timeRatio.toFixed(2)})</span>
                    <span>⚖️</span>
                </div>
                <span class="analysis-subtitle">Riskli Eşitlik</span>
            </h4>
            <p>Zorluk katsayısı yüksek sorularla, basit sorulara neredeyse eşit vakit ayırıyorsunuz. İdeal bir sınav stratejisinde, kolay sorular "zaman kazanılan", zor sorular ise "zaman harcanan" alanlardır. Aradaki makasın bu kadar kapalı olması, zorlayıcı paragraf sorularında analiz için yeterli derinliğe inemediğinizi gösterir.</p>
        </div>`;
    }
    // SENARYO D: PROFESYONEL (Oran >= 1.2)
    else {
        htmlReport += `
        <div class="analysis-card success">
            <h4>
                <div class="analysis-card-header">
                    <span>ZAMAN STRATEJİSİ (Oran: ${timeRatio.toFixed(2)})</span>
                    <span>🧠</span>
                </div>
                <span class="analysis-subtitle">Profesyonel Zaman Yönetimi</span>
            </h4>
            <p>Zamanı yönetme algoritmanız kusursuz işliyor. Kolay ve bildiğiniz soruları seri bir şekilde geçip (Speed), buradan tasarruf ettiğiniz dakikaları analiz ve çıkarım gerektiren zor sorulara (Power) yatırım yapmışsınız. Sınavdan maksimum verim almanızı sağlayan, akademik açıdan en doğru strateji budur.</p>
        </div>`;
    }

    // ------------------------------------------
    // 8. RADAR ALANI HESAPLAMA (COGNITIVE VOLUME)
    // ------------------------------------------
    // Bu fonksiyon, radar grafiğinin kapladığı geometrik alanı hesaplar.
    // Alan hesabı, "Dengeli" profilleri ödüllendirir. Bir köşe düşükse alan dramatik düşer.

    // Puanları sırasıyla bir diziye al (Saat yönünde)
    // Puanları sırasıyla bir diziye al (Saat yönünde)
    // Sıralama (YENİ): AGI -> RFX -> ACC -> PWR -> STA -> RES
    let scores = [
        agiScore, // 1. HIZ
        rfxScore, // 2. REFLEKS
        accScore, // 3. İSABET
        pwrScore, // 4. GÜÇ
        staScore, // 5. DAYANIKLILIK
        resScore  // 6. DİRENÇ
    ];

    let totalArea = 0;
    // Sin(60 derece) * 1/2 = 0.43301
    const areaFactor = 0.43301;

    for (let i = 0; i < scores.length; i++) {
        // Şu anki puan ile bir sonraki puanı (sonuncuyda ilki) al
        let current = scores[i];
        let next = scores[(i + 1) % scores.length]; // Modülo ile başa sarar

        // Üçgen alanı: 1/2 * a * b * sin(60)
        totalArea += (current * next * areaFactor);
    }

    // NORMALİZASYON:
    // Eğer tüm puanlar 100 olsaydı Maksimum Alan ne olurdu?
    // MaxArea = 6 * (100 * 100 * 0.43301) = 25980.6
    const maxPossibleArea = 25980.6;

    // Alan Puanını 0-1000 skalasına çekelim
    let volumeScore = (totalArea / maxPossibleArea) * 1000;

    // [UI UPDATE] HTML raporun altına eklemiyoruz, yukarıdaki karta taşıdık.
    // htmlReport += ... (Kaldırıldı)


    return {
        isPreviewMode: false,
        // DİKKAT: Sıralama burada çok önemli. Alan hesabı bu sıraya göre yapılacak.
        metrics: {
            agi: agiScore, // 1. HIZ
            rfx: rfxScore, // 2. REFLEKS
            acc: accScore, // 3. İSABET
            pwr: pwrScore, // 4. GÜÇ
            sta: staScore, // 5. DAYANIKLILIK
            res: resScore, // 6. DİRENÇ

            str: strategyScore,
            vol: volumeScore
        },
        chartData: {
            // Front-End bu sırayla çizecek
            labels: ["Refleks", "İsabet", "Güç", "Dayanıklılık", "Direnç", "Çeviklik"],
            data: [rfxScore, accScore, pwrScore, staScore, resScore, agiScore],
            heartbeat: heartbeatData,
            trendHTML: trendHTML
        },
        htmlReport: htmlReport
    };
}
