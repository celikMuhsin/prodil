class VocabCard {
    constructor(data) {
        this.data = data;
        this.currentIndex = 0;
        this.container = document.getElementById('vocabulary-wrapper');

        if (!this.data || this.data.length === 0) {
            console.warn('Kelime verisi bulunamadı.');
            return;
        }

        this.init();
    }

    init() {
        this.renderCard();
        this.addEventListeners();
    }

    renderCard() {
        try {
            const item = this.data[this.currentIndex];
            if (!item) return;

            // --- Helper: Safely get nested properties ---
            const meta = item.meta || {};
            const phonetics = item.phonetics || {};
            const definitions = item.definitions || [];
            const grammar = item.grammar_profile || { structures: [] };
            const progression = item.sentence_progression || { levels: [] };
            const morph = item.morphology_tree || { family_members: [] };
            const pedagogy = item.pedagogy_engine || { common_errors: [] };
            const history = item.word_journey || { timeline: [] };

            // --- HTML Construction ---

            // Helper to translate common English terms
            const translate = (text) => {
                const map = {
                    'noun': 'İsim', 'verb': 'Fiil', 'adjective': 'Sıfat', 'adverb': 'Zarf',
                    'preposition': 'Edat', 'conjunction': 'Bağlaç',
                    'High Frequency': 'Sık Kullanılan', 'Medium Frequency': 'Orta Sıklık', 'Low Frequency': 'Az Kullanılan',
                    'General': 'Genel', 'Academic': 'Akademik', 'Technical': 'Teknik'
                };
                // Return translation or original if not found (checking case-insensitive)
                return map[text] || map[Object.keys(map).find(k => k.toLowerCase() === text.toLowerCase())] || text;
            };

            // Toplayıcı dizi (Başlık ve ID'leri tutacak)
            const availableSections = [];

            // Helper to wrap content with Accordion Structure
            const wrapSection = (id, title, content, isOpen = false) => {
                if (!content) return '';

                // Prevent duplicates in dropdown list
                if (!availableSections.some(s => s.id === id)) {
                    availableSections.push({ id, title });
                }

                const activeClass = isOpen ? 'open' : '';
                const showClass = isOpen ? 'show' : '';
                // Always use 'down' icon. CSS rotates it 180deg when .open is present.
                const iconClass = 'fa-chevron-down';

                return `
                    <div id="${id}" class="section-wrapper ${activeClass}">
                        <div class="accordion-header" onclick="vocabCard.toggleAccordion('${id}')">
                            <div class="accordion-title">
                                <span style="font-size:0.8em; color:var(--accent); opacity:0.7;">●</span> ${title}
                            </div>
                            <div class="accordion-icon"><i class="fa-solid ${iconClass}"></i></div>
                        </div>
                        <div class="accordion-content ${showClass}">
                            ${content}
                        </div>
                    </div>
                `;
            };

            // 1. HEADER section
            // Dropdown Logic (Will be generated after collecting sections, but placed here in structure)
            // We'll use a placeholder and replace it later or simply generate header at the end if possible.
            // Easier approach: Generate content first, then header.

            // ... (Skipping Header generation for a moment to process content) ...

            // 2. MAIN CONTENT PROCESSING

            // Definitions
            let definitionsHtml = '';
            definitions.forEach((def, idx) => {
                definitionsHtml += `
                    <div class="definition-box">
                        <div class="def-row">
                            <div class="meaning-en">${idx + 1}. ${def.core_meaning_en || ''}</div>
                            <div class="meaning-tr">${def.core_meaning_tr || ''}</div>
                        </div>
                        ${def.example ? `
                        <div class="example-box">
                            "${def.example.sentence}"
                            <div class="example-tr">${def.example.translation}</div>
                        </div>` : ''}
                    </div>
                `;
            });
            // Definitions is always present, wrap it as OPEN by default
            if (definitionsHtml) {
                definitionsHtml = wrapSection('sec-definitions', 'Anlamlar', definitionsHtml, true);
            }

            let grammarHtml = '';
            // Combined Logic handled below

            let pedagogyHtml = '';
            if (pedagogy.common_errors && pedagogy.common_errors.length > 0) {
                const content = `
                    <div class="study-block">
                        <h3 class="section-title" style="color:#e53e3e;">⚠️ Sık Yapılan Hatalar</h3>
                        ${pedagogy.common_errors.map(err => `
                            <div class="alert-box">
                                <span class="alert-wrong">❌ ${err.incorrect}</span>
                                <span class="alert-correct">✅ ${err.correction}</span>
                                <div style="margin-top:5px; font-size:0.85rem; color:#4a5568;">${err.explanation}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
                pedagogyHtml = wrapSection('sec-errors', 'Sık Hatalar', content);
            }

            // 3. SIDE PANEL (Right Panel)

            // Derivatives
            let derivativesHtml = '';
            if (morph.family_members && morph.family_members.length > 0) {
                const content = `
                    <div class="side-block">
                        <h3 class="section-title">Kelime Ailesi (Türevler)</h3>
                        <ul class="derivative-list">
                            ${morph.family_members.map(fam => `
                                <li class="derivative-item" onclick="vocabCard.searchAndGo('${fam.word}')">
                                    <div>
                                        <span class="der-word">${fam.word}</span>
                                        <span class="der-pos">${fam.pos}</span>
                                    </div>
                                    <div class="der-note">${fam.note || ''}</div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
                derivativesHtml = wrapSection('sec-derivatives', 'Türevler', content);
            }

            // Progression Levels
            let progressionHtml = '';
            if (progression.levels && progression.levels.length > 0) {
                const content = `
                   <div class="side-block">
                       <h3 class="section-title">Seviye Gelişimi</h3>
                       <table class="progression-table">
                           ${progression.levels.map(lvl => `
                               <tr>
                                   <td>
                                       <span class="cefr-tag tag-${lvl.cefr}">${lvl.cefr}</span>
                                   </td>
                                   <td>
                                       <div style="font-weight:500;">${lvl.en}</div>
                                       <div style="color:#718096; font-style:italic;">${lvl.tr}</div>
                                   </td>
                               </tr>
                           `).join('')}
                       </table>
                   </div>
               `;
                progressionHtml = wrapSection('sec-progression', 'Seviye Gelişimi', content);
            }

            // History
            let historyHtml = '';
            if (history.timeline && history.timeline.length > 0) {
                const timelineContent = `
                    <div class="side-block">
                        <h3 class="section-title">Köken & Tarihçe</h3>
                        <div class="timeline-path">
                            ${history.timeline.map(step => `
                                <div class="timeline-step">
                                    <div class="timeline-era">${step.era || step.language}</div>
                                    <div class="timeline-content">
                                        <strong style="color:#2d3748;">${step.word}</strong>: ${step.meaning}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                historyHtml = wrapSection('sec-history', 'Köken & Tarihçe', timelineContent);
            }

            // --- NEW SECTIONS ---

            // 4. COLLOCATIONS (Main Content -> Now Side)
            let collocationsHtml = '';
            if (item.collocations) {
                const mods = item.collocations.modifiers_adverbs || [];
                const verbs = item.collocations.verbs_preceding || [];
                if (mods.length > 0 || verbs.length > 0) {
                    const content = `
                        <div class="study-block">
                            <h3 class="section-title">Eş Dizimler (Collocations)</h3>
                            <div class="collo-grid">
                                ${mods.length > 0 ? `
                                    <div class="collo-group">
                                        <h4 class="collo-header">Nasıl Kullanılır? (Zarflar)</h4>
                                        ${mods.map(m => `
                                            <div class="collo-item">
                                                <span class="collo-word">${m.word}</span>
                                                <span class="collo-example">"${m.example}"</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                                ${verbs.length > 0 ? `
                                    <div class="collo-group">
                                        <h4 class="collo-header">Hangi Fiillerle?</h4>
                                        ${verbs.map(v => `
                                            <div class="collo-item">
                                                <span class="collo-word">${v.word}</span>
                                                <span class="collo-example">"${v.example}"</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                    collocationsHtml = wrapSection('sec-collocations', 'Eş Dizimler', content);
                }
            }

            // 5. PRAGMATICS (Idioms) (Main Content -> Now Side)
            let pragmaticsHtml = '';
            if (item.pragmatics && item.pragmatics.idioms_and_phrases) {
                const content = `
                    <div class="study-block">
                        <h3 class="section-title">Deyimler & İfadeler</h3>
                        <div class="idiom-list">
                            ${item.pragmatics.idioms_and_phrases.map(idm => `
                                <div class="idiom-card">
                                    <div class="idiom-phrase">${idm.phrase}</div>
                                    <div class="idiom-meaning">${idm.meaning_tr}</div>
                                </div>
                            `).join('')}
                        </div>
                        ${item.pragmatics.sociolinguistics ? `
                            <div class="note-box">
                                <strong>💡 Sosyo-Kültürel Not:</strong> ${item.pragmatics.sociolinguistics.note_tr}
                            </div>
                        `: ''}
                    </div>
                 `;
                pragmaticsHtml = wrapSection('sec-idioms', 'Deyimler', content);
            }

            // 6. GRAMMAR LOGIC (Inside Grammar)
            let tenseLogicHtml = '';
            if (grammar.tense_logic) {
                tenseLogicHtml = `
                    <div class="logic-box">
                        <div class="logic-title">⚡ Mantık: ${grammar.tense_logic.why_use_it}</div>
                        ${grammar.tense_logic.critical_comparison ? `
                            <div class="logic-compare">
                                <strong>Kritik Ayrım:</strong> ${grammar.tense_logic.critical_comparison.rule}
                                <div class="logic-examples">
                                    <div class="wrong">❌ ${grammar.tense_logic.critical_comparison.example_wrong}</div>
                                    <div class="right">✅ ${grammar.tense_logic.critical_comparison.example_right}</div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
            }

            // Combine Grammar Sections
            const structsHtml = grammar.structures && grammar.structures.length > 0 ? `
                 <div class="grammar-grid">
                    ${grammar.structures.map(st => `
                        <div class="grammar-item">
                            <div class="grammar-pattern">${st.pattern}</div>
                            <div class="grammar-note">${st.notes_tr}</div>
                        </div>
                    `).join('')}
                 </div>
             ` : '';

            if (structsHtml || tenseLogicHtml) {
                const content = `
                    <div class="study-block">
                        <h3 class="section-title">Gramer & Mantık</h3>
                        ${structsHtml}
                        ${tenseLogicHtml}
                    </div>
                 `;
                grammarHtml = wrapSection('sec-grammar', 'Gramer', content);
            }

            // 7. LEXICAL NUANCE (Side Panel)
            let nuanceHtml = '';
            const nuance = item.lexical_nuance || {};
            if (nuance.synonym_scale || (nuance.antonyms && nuance.antonyms.length > 0)) {
                // ... content generation same as before ... 
                let scaleHtml = '';
                if (nuance.synonym_scale && nuance.synonym_scale.scale) {
                    scaleHtml = `
                    <div class="nuance-scale">
                        <div class="scale-title">${nuance.synonym_scale.turkishConcept || 'Güç Sıralaması'}</div>
                        ${nuance.synonym_scale.scale.map(s => `
                            <div class="scale-item" style="opacity: ${0.6 + (s.value / 20)}; flex-direction: column; align-items: flex-start; gap: 4px;">
                                <div style="display:flex; justify-content:space-between; width:100%">
                                    <span><strong>${s.word}</strong> <span style="font-size:0.8em; font-weight:normal">(${s.turkish || ''})</span></span>
                                    <span style="font-size:0.85em; background:rgba(255,255,255,0.3); padding:1px 6px; border-radius:10px; font-weight:bold;">${s.value}/10</span>
                                </div>
                                <div style="font-size:0.75em; font-style:italic;">${s.usage || s.note}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
                }

                let antonymsHtml = '';
                if (nuance.antonyms && nuance.antonyms.length > 0) {
                    // ... antonyms logic ... 
                    const isObject = typeof nuance.antonyms[0] === 'object';
                    if (isObject) {
                        antonymsHtml = `
                        <div style="margin-top:25px;">
                            <h4 class="section-title" style="font-size:0.9rem; color:#e53e3e;">Zıt Anlamlılar</h4>
                            <div class="antonym-list">
                                ${nuance.antonyms.map(a => `
                                    <div class="antonym-card">
                                        <div class="antonym-header">
                                            <span class="antonym-word">${a.word}</span>
                                            <span class="antonym-score">${a.value}/10</span>
                                        </div>
                                        <div class="antonym-meaning">${a.turkish}</div>
                                        ${a.note ? `<div class="antonym-note">${a.note}</div>` : ''}
                                        ${a.warning ? `<div class="antonym-warning">⚠️ ${a.warning}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                    } else {
                        antonymsHtml = `
                        <div style="margin-top:10px;">
                            <strong>Zıt Anlamlılar:</strong>
                            <div class="tag-cloud">
                                ${nuance.antonyms.map(a => `<span class="tag-antonym">${a}</span>`).join('')}
                            </div>
                        </div>
                    `;
                    }
                }
                const content = `
                <div class="side-block">
                    <h3 class="section-title">Kelime Nüansları</h3>
                    ${scaleHtml}
                    ${antonymsHtml}
                </div>
                `;
                nuanceHtml = wrapSection('sec-nuance', 'Nüanslar', content);
            }

            // 8. COGNATE HINT (Side Panel)
            let hintHtml = '';
            if (history.turkish_cognate_hint) {
                const h = history.turkish_cognate_hint;
                const formatItem = (text) => {
                    const parts = text.split(':');
                    if (parts.length > 1) {
                        return `<strong>${parts[0]}:</strong> ${parts.slice(1).join(':')}`;
                    }
                    return text;
                };

                const hintContent = `
                    <div class="hint-box">
                        <h3 class="section-title">Türkçe İpucu: ${h.word}</h3>
                        <div class="hint-story">${h.story}</div>
                        
                        <div class="hint-comparison">
                            ${h.example ? `<div class="hint-bridge">${h.example}</div>` : ''}
                            
                            ${(h.example2 || h.example3) ? `
                                <ul class="hint-list">
                                    ${h.example3 ? `<li>${formatItem(h.example3)}</li>` : ''} 
                                    ${h.example2 ? `<li>${formatItem(h.example2)}</li>` : ''}
                                </ul>
                            ` : ''}
                        </div>
                    </div>
                `;
                hintHtml = wrapSection('sec-hint', 'Türkçe İpucu', hintContent);
            }

            // Combine for display in sidebar
            const combinedHistoryHtml = historyHtml + hintHtml;

            // Stories Logic (Moved BACK to bottom for Dropdown Order)
            let storiesHtml = '';
            if (item.stories) {
                const storyLevels = Object.keys(item.stories);

                if (storyLevels.length > 0) {
                    // Dropdown için ANA BAŞLIĞI en başa ekleyelim
                    // ID'yi 'sec-stories-main' yaparak wrapSection ile aynı yapıyoruz -> Duplicate engelleniyor
                    availableSections.push({ id: 'sec-stories-main', title: 'Okuma Hikayeleri' });

                    const storyItemsHtml = storyLevels.map(level => {
                        const storyId = `sec-story-${level}`;

                        const exists = availableSections.some(s => s.id === storyId);
                        if (!exists) {
                            availableSections.push({
                                id: storyId,
                                title: `${level} Seviye Hikaye`,
                                html: `<span class="cefr-tag tag-${level}">${level}</span> <span style="font-size:0.85em; opacity:0.9;">Seviye Hikaye</span>`
                            });
                        }

                        // Content for inner accordions
                        const storyContent = `
                        <div class="story-container" style="border:none; box-shadow:none; margin:0;">
                             <div class="story-content">
                                <div class="story-lang english">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                        <h4 style="margin:0;">ENGLISH</h4>
                                        <button class="audio-mini-btn" onclick="vocabCard.playStoryAudio(this)" data-text="${encodeURIComponent(item.stories[level].en.replace(/<[^>]*>/g, ''))}" title="Hikayeyi Dinle">
                                            🔊
                                        </button>
                                    </div>
                                    <p>${item.stories[level].en}</p>
                                </div>
                                <div class="story-lang turkish">
                                    <h4 style="margin-bottom:10px;">TÜRKÇE</h4>
                                    <p>${item.stories[level].tr}</p>
                                </div>
                            </div>
                        </div>
                        `;
                        return wrapSection(storyId, `<span class="cefr-tag tag-${level}">${level}</span> Seviye Hikaye`, storyContent);
                    }).join('');

                    const content = `
                        <div style="display:flex; flex-direction:column; gap:10px;">${storyItemsHtml}</div>
                    `;
                    storiesHtml = wrapSection('sec-stories-main', 'Okuma Hikayeleri', content);
                }
            }




            // Clean IPA (remove slashes)
            const rawIpa = phonetics.ipa_us || '';
            const cleanIpa = rawIpa.replace(/\//g, '');

            // GENERATE HEADER WITH CUSTOM DROPDOWN
            const dropdownItemsHtml = availableSections.map(s => `
                <div class="dropdown-item" onclick="vocabCard.selectSection('${s.id}')">
                    ${s.html || s.title}
                </div>
            `).join('');

            const headerHtml = `
            <div class="controls-top">
                <!-- LEFT GROUP: Prev / Counter / Next -->
                <div class="nav-left">
                    <button class="nav-btn" onclick="vocabCard.prevCard()" ${this.currentIndex === 0 ? 'disabled' : ''} title="Önceki">←</button>
                    <span class="nav-counter">${this.currentIndex + 1} / ${this.data.length}</span>
                    <button class="nav-btn next" onclick="vocabCard.nextCard()" title="Sonraki">→</button>
                </div>

                <!-- RIGHT GROUP: Phonetics & Audio -->
                <div class="phonetics-row" style="margin-left:auto;">
                    <span class="ipa">${cleanIpa}</span>
                    <button class="audio-mini-btn" onclick="vocabCard.playGoogleAudio('${item.word}')" title="Telaffuzu Dinle">
                        🔊
                    </button>
                </div>
            </div>

            <div id="sticky-placeholder" style="height:0; width:100%;"></div>
            <div class="sticky-header-wrapper">
                <div class="word-header">
                    <!-- Word & Dropdown -->
                    <div class="word-title-row">
                        <div class="word-left-group" style="display:flex; align-items:center; gap:10px;">
                            <h1 class="main-word">${item.word}</h1>
                        </div>
                        
                        <!-- RIGHT: Custom Dropdown -->
                        <div class="custom-dropdown-container">
                            <div class="dropdown-trigger" onclick="vocabCard.toggleDropdown()">
                                <span id="dropdown-label">Bölüme Git...</span>
                                <span style="font-size:0.7em; margin-left:6px;">▼</span>
                            </div>
                            <div class="dropdown-menu" id="vocab-dropdown-menu">
                                <div class="dropdown-item" onclick="vocabCard.selectSection('toggle-all')">
                                    <span id="toggle-all-text" style="font-weight:bold; color:var(--primary);">➕ Hepsini Aç</span>
                                </div>
                                <div class="dropdown-item separator"></div>
                                ${dropdownItemsHtml}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

            // Tags (Outside Sticky Header)
            const tagsHtml = `
                <div class="word-meta" style="padding: 10px 30px; border-bottom: 1px solid var(--border);">
                    <span class="meta-chip" style="background:${this.getLevelColor(meta.cefr_level)}; color:white; border:none;">${meta.cefr_level || 'A1'}</span>
                    <span class="meta-chip">${translate(meta.frequency_band) || 'Genel'}</span>
                    ${(() => {
                    const posRaw = meta.part_of_speech;
                    let posArray = [];
                    if (Array.isArray(posRaw)) {
                        posArray = posRaw;
                    } else if (typeof posRaw === 'string') {
                        // Split 'noun / verb' style
                        posArray = posRaw.split('/').map(s => s.trim());
                    } else {
                        posArray = ['Kelime'];
                    }
                    return posArray.map(p => `<span class="meta-chip">${translate(p)}</span>`).join('');
                })()}
                </div>
            `;

            // --- Layout Assembly ---
            this.container.innerHTML = `
                <div class="vocab-card fade-in">
                    ${headerHtml}
                    ${tagsHtml}
                    
                    <div class="content-grid">
                        <!-- SINGLE COLUMN CONTENT -->
                        <div class="main-content">
                            <div class="study-block" style="margin-top:0; margin-bottom:15px;">
                                ${definitionsHtml}
                            </div>
                            
                            ${derivativesHtml}
                            ${grammarHtml}
                            ${progressionHtml}

                            ${pedagogyHtml}
                            
                            <!-- SIDEBAR CONTENT MOVED HERE -->
                            ${nuanceHtml}
                            ${combinedHistoryHtml} <!-- Köken & İpucu -->
                            ${collocationsHtml}
                            ${pragmaticsHtml} <!-- Deyimler -->

                            <!-- Stories at the bottom -->
                            ${storiesHtml}
                        </div>
                    </div>
                </div>
            `;

            // Adjust Width Dynamic
            this.adjustDropdownWidth();

        } catch (error) {
            console.error(error);
            this.container.innerHTML = `<div style="color:red; padding:20px;">Hata oluştu: ${error.message}</div>`;
        }
    }

    getLevelColor(level) {
        if (!level) return '#cbd5e0';
        const map = {
            'A1': 'var(--lvl-a1)',
            'A2': 'var(--lvl-a2)',
            'B1': 'var(--lvl-b1)',
            'B2': 'var(--lvl-b2)',
            'C1': 'var(--lvl-c1)',
            'C2': 'var(--lvl-c2)'
        };
        return map[level] || '#cbd5e0';
    }

    playGoogleAudio(word) {
        if (!word) return;

        // 1. Try Browser Native Speech (Most Reliable)
        if ('speechSynthesis' in window) {
            // Cancel previous speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US'; // American English
            utterance.rate = 0.9; // Slightly slower for clarity

            // Try to select a "Google" voice if available in Chrome
            const voices = window.speechSynthesis.getVoices();
            const googleVoice = voices.find(v => v.name.includes("Google US English"));
            if (googleVoice) {
                utterance.voice = googleVoice;
            }

            window.speechSynthesis.speak(utterance);
        } else {
            // Fallback for very old browsers
            const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&q=${encodeURIComponent(word)}&tl=en`;
            new Audio(audioUrl).play().catch(e => console.error("Audio error:", e));
        }
    }

    playStoryAudio(btn) {
        const textEncoded = btn.getAttribute('data-text');
        if (!textEncoded) return;

        const text = decodeURIComponent(textEncoded);

        if ('speechSynthesis' in window) {
            // Cancel previous speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85; // Slower for stories

            // Try to select a "Google" voice if available
            const voices = window.speechSynthesis.getVoices();
            const googleVoice = voices.find(v => v.name.includes("Google US English"));
            if (googleVoice) {
                utterance.voice = googleVoice;
            }

            window.speechSynthesis.speak(utterance);
        }
    }

    playAudio(path) {
        if (!path) return;
        const audio = new Audio(path);
        audio.play().catch(e => console.log("Audio play error:", e));
    }

    searchAndGo(word) {
        const index = this.data.findIndex(item => item.word.toLowerCase() === word.toLowerCase());
        if (index !== -1) {
            this.currentIndex = index;
            this.renderCard();
            // Scroll to top to see tabs and header
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.log("Kelime bulunamadı, navigasyon yapılmadı: " + word);
        }
    }

    nextCard() {
        if (this.currentIndex < this.data.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.renderCard();
    }

    prevCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderCard();
        }
    }

    handleDropdown(selectElement) {
        const value = selectElement.value;
        if (!value) return;

        // 1. İşlemi yap
        this.scrollToSection(value);

        // 2. Dropdown'u sıfırla ("Bölüme Git..." kalsın)

        // Hepsini Aç/Kapat özel durumu için buton metnini güncelle
        if (value === 'toggle-all') {
            const option = selectElement.querySelector('option[value="toggle-all"]');
            if (option) {
                // Mevcut duruma göre tersini ayarla (scrollToSection zaten işlemi yaptı, şimdi UI güncelle)
                // Not: scrollToSection içinde metin değişimi yapmıyoruz artık, burada UI yönetiyoruz.
                // Eğer şu an "Aç" yazıyorsa, işlem yapıldı -> "Kapat" yap.
                const currentText = option.textContent;
                if (currentText.includes('Aç')) {
                    option.textContent = '➖ Hepsini Kapat';
                } else {
                    option.textContent = '➕ Hepsini Aç';
                }
            }
        }

        selectElement.selectedIndex = 0; // "Bölüme Git..." option'ı
        selectElement.blur(); // Mobilde seçimi kapatmak için
    }

    scrollToSection(arg) {
        let id = arg;
        let selectEl = null;

        // If argument is the select element itself
        if (typeof arg === 'object' && arg.tagName === 'SELECT') {
            id = arg.value;
            selectEl = arg;
        }

        if (!id) return;

        // Reset dropdown to default "Bölüme Git..." immediately
        if (selectEl) {
            selectEl.selectedIndex = 0;
            selectEl.blur(); // Remove focus
        }

        // Handle Toggle All
        if (id === 'toggle-all') {
            const allSections = this.container.querySelectorAll('.section-wrapper');
            const toggleText = document.getElementById('toggle-all-text');

            let action = 'open'; // Default action

            // Determine action based on CURRENT TEXT
            if (toggleText) {
                const currentText = toggleText.textContent.trim();
                if (currentText.includes('Kapat')) {
                    action = 'close';
                } else {
                    action = 'open';
                }
            }

            allSections.forEach(sec => {
                if (action === 'open') {
                    sec.classList.add('open');
                } else {
                    sec.classList.remove('open');
                }
            });

            // Update Text AFTER action
            if (toggleText) {
                if (action === 'open') {
                    toggleText.textContent = '➖ Hepsini Kapat';
                } else {
                    toggleText.textContent = '➕ Hepsini Aç';
                }
            }
            return;
        }

        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Eğer kapalıysa aç
            if (!el.classList.contains('open')) {
                el.classList.add('open');
            }

            // Recursively open all parent accordions
            let currentEl = el.parentElement;
            while (currentEl) {
                // Find closest parent section-wrapper
                const parentSection = currentEl.closest('.section-wrapper');
                if (parentSection) {
                    if (!parentSection.classList.contains('open')) {
                        parentSection.classList.add('open');
                    }
                    // Continue searching up from the parent's parent
                    currentEl = parentSection.parentElement;
                } else {
                    // No more sections found up the tree
                    break;
                }
            }
        }
    }

    toggleAccordion(id) {
        const el = document.getElementById(id);
        if (!el) return;

        // 1. Durumu kaydet
        const wasOpen = el.classList.contains('open');

        // 2. Auto-Collapse Siblings Logic REMOVED
        // User wants multiple sections to stay open.
        /*
        const parent = el.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children).filter(child =>
                child.classList.contains('section-wrapper') && child.id !== id
            );

            siblings.forEach(sib => {
                if (sib.classList.contains('open')) {
                    sib.classList.remove('open');
                }
            });
        }
        */

        // 3. Hedefi Toggle Yap
        if (wasOpen) {
            el.classList.remove('open');
        } else {
            el.classList.add('open');
        }
    }

    // --- Custom Dropdown Methods ---
    toggleDropdown() {
        const menu = document.getElementById('vocab-dropdown-menu');
        if (menu) {
            menu.classList.toggle('show');
        }
    }

    selectSection(id) {
        this.closeDropdown();
        this.scrollToSection(id);
    }

    closeDropdown() {
        const menu = document.getElementById('vocab-dropdown-menu');
        if (menu) {
            menu.classList.remove('show');
        }
    }

    addEventListeners() {
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const container = document.querySelector('.custom-dropdown-container');
            if (container && !container.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Close dropdown on scroll
        window.addEventListener('scroll', () => {
            this.closeDropdown();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextCard();
            if (e.key === 'ArrowLeft') this.prevCard();
        });

        // --- JS Sticky Fallback for Mobile ---
        window.addEventListener('scroll', () => {
            // Only apply on mobile where CSS sticky might fail
            if (window.innerWidth > 768) return;

            const stickyEl = this.container.querySelector('.sticky-header-wrapper');
            const placeholder = document.getElementById('sticky-placeholder');

            if (!stickyEl || !placeholder) return;

            // Get the top position of the placeholder relative to viewport
            const rect = placeholder.getBoundingClientRect();

            // If placeholder barely touches top (scrolled past), fix the header
            if (rect.top <= 0) {
                if (!stickyEl.classList.contains('mobile-fixed')) {
                    stickyEl.classList.add('mobile-fixed');
                    placeholder.style.height = stickyEl.offsetHeight + 'px'; // Reserve space
                }
            } else {
                if (stickyEl.classList.contains('mobile-fixed')) {
                    stickyEl.classList.remove('mobile-fixed');
                    placeholder.style.height = '0px'; // Collapse space
                }
            }
        }, { passive: true });
    }

    adjustDropdownWidth() {
        const menu = document.getElementById('vocab-dropdown-menu');
        const container = this.container.querySelector('.custom-dropdown-container');

        if (!menu || !container) return;

        // 1. Make measurable
        // Save current styles
        const prevDisplay = menu.style.display;
        const prevVisibility = menu.style.visibility;

        // Force show invisibly
        menu.style.display = 'block';
        menu.style.visibility = 'hidden';

        // 2. Measure
        const menuWidth = menu.getBoundingClientRect().width;

        // 3. Restore
        menu.style.display = prevDisplay;
        menu.style.visibility = prevVisibility;

        // 4. Apply to Container
        // Add a tiny buffer for borders
        container.style.width = `${Math.ceil(menuWidth) + 2}px`;
    }
}

// Global Init
// Global Init
document.addEventListener('DOMContentLoaded', () => {
    if (window.vocabularyData) {
        window.vocabCard = new VocabCard(window.vocabularyData);
    }
});
