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

        this.init();

        // Swipe & Track Variables
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        this.currentIndex = 0;
        this.ghostCard = null;
        this.isDropdownInteraction = false;
    }

    init() {
        this.renderCard();
        this.addEventListeners();
    }

    renderCard() {
        try {
            // Ensure no lingering artifacts
            this.container.innerHTML = '';

            const item = this.data[this.currentIndex];
            if (!item) return;

            this.container.innerHTML = this.generateCardHTML(item, this.currentIndex);

            // Defer measurement to ensure rendering is complete
            requestAnimationFrame(() => {
                this.adjustDropdownWidth();
                // Ensure page starts at top for each new card
                window.scrollTo(0, 0);
            });
        } catch (error) {
            console.error(error);
            this.container.innerHTML = `<div style="color:red; padding:20px;">Hata oluştu: ${error.message}</div>`;
        }
    }

    generateCardHTML(item, index) {
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
            return map[text] || map[Object.keys(map).find(k => k.toLowerCase() === text.toLowerCase())] || text;
        };

        const availableSections = [];

        // Helper to wrap content with Accordion Structure
        const wrapSection = (id, title, content, isOpen = false) => {
            if (!content) return '';
            if (!availableSections.some(s => s.id === id)) {
                availableSections.push({ id, title });
            }
            const activeClass = isOpen ? 'open' : '';
            // If open, no hidden class. If closed, add hidden class.
            const showClass = isOpen ? '' : 'hidden';
            const iconClass = isOpen ? 'fa-chevron-up' : 'fa-chevron-down';

            return `
                <div id="${id}" class="section-wrapper ${activeClass}">
                    <div class="accordion-header">
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

        // 2. MAIN CONTENT PROCESSING
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
        if (definitionsHtml) {
            definitionsHtml = wrapSection('sec-definitions', 'Anlamlar', definitionsHtml, true);
        }

        let grammarHtml = '';


        let nuanceHtml = '';
        const nuance = item.lexical_nuance || {};
        if (nuance.synonym_scale || (nuance.antonyms && nuance.antonyms.length > 0)) {
            let scaleHtml = '';
            // --- 1. Synonyms (Green Section) ---
            if (nuance.synonym_scale && nuance.synonym_scale.scale) {
                scaleHtml = `
                <div class="nuance-group theme-green">
                    <div class="nuance-header" style="justify-content: space-between; align-items: center; display: flex;">
                        <span><i class="fa-solid fa-check" style="margin-right: 8px;"></i> EŞ ANLAM</span>
                        <span style="font-size:0.75rem; color:#718096; font-weight:normal; margin-right: 12px;">${nuance.synonym_scale.turkishConcept || ''}</span>
                    </div>
                    <div class="nuance-scale">
                        ${nuance.synonym_scale.scale.map(s => {
                    const percent = s.value * 10;
                    return `
                            <div class="scale-item" style="display:flex; flex-direction: column; align-items: flex-start; gap: 4px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; width:100%">
                                    <span><strong style="color: #1a202c; font-size: 1.1rem;">${s.word}</strong> <span style="font-size:0.8em; font-weight:normal; color: #4a5568;">(${s.turkish || ''})</span></span>
                                    <div style="display:flex; align-items:center; gap:1px;">
                                        <div style="width:50px; height:8px; background:#e2e8f0; border-radius:4px; overflow:hidden;">
                                            <div style="width:${percent}%; height:100%; background:#38a169; border-radius:4px;"></div>
                                        </div>
                                        <span style="font-size:0.85em; font-weight:bold; color:#2d3748; min-width:30px; text-align:right;">%${percent}</span>
                                    </div>
                                </div>
                                <div style="font-size:0.85em; color:#4a5568; margin-top:2px;">
                                    ${s.description_tr ? `${s.description_tr}` : (s.usage ? `${s.usage}` : '')}
                                    ${s.example_en ? ` "${s.example_en}" ${s.example_tr ? `(${s.example_tr})` : ''}` : ''}
                                </div>
                            </div>
                        `;
                }).join('')}
                    </div>
                </div>
            `;
            }

            // --- 2. Antonyms (Red Section) ---
            let antonymsHtml = '';
            if (nuance.antonyms && nuance.antonyms.length > 0) {
                const isObject = typeof nuance.antonyms[0] === 'object';
                let antonymItems = '';

                if (isObject) {
                    antonymItems = nuance.antonyms.map(a => {
                        const percent = a.value * 10;
                        return `
                        <div class="antonym-card">
                            <div class="antonym-header" style="justify-content:space-between; align-items:center; width:100%; display:flex;">
                                <span>
                                    <span class="antonym-word" style="color: #c53030; font-weight: 700; font-size: 1.1rem;">${a.word}</span>
                                    <span style="font-size:0.8em; font-weight:normal; color: #4a5568;">(${a.turkish || ''})</span>
                                </span>
                                <div style="display:flex; align-items:center; gap:1px;">
                                    <div style="width:50px; height:8px; background:#e2e8f0; border-radius:4px; overflow:hidden;">
                                        <div style="width:${100 - percent}%; height:100%; background:#e53e3e; border-radius:4px;"></div>
                                    </div>
                                    <span style="font-size:0.85em; font-weight:bold; color:#2d3748; min-width:30px; text-align:right;">%${percent}</span>
                                </div>
                            </div>
                            <div style="font-size:0.85em; color:#4a5568; margin-top:2px;">
                                ${a.description_tr ? `${a.description_tr}` : (a.note ? `${a.note}` : '')}
                                ${a.example_en ? ` "${a.example_en}" ${a.example_tr ? `(${a.example_tr})` : ''}` : ''}
                            </div>
                            ${a.warning ? `<div class="antonym-warning" style="color:#e53e3e; font-weight:bold; font-size: 0.7em;">⚠️ ${a.warning}</div>` : ''}
                        </div>
                    `;
                    }).join('');
                } else {
                    antonymItems = `
                        <div class="tag-cloud">
                            ${nuance.antonyms.map(a => `<span class="tag-antonym" style="background:#fff5f5; color:#c53030; border:1px solid #feb2b2;">${a}</span>`).join('')}
                        </div>
                    `;
                }

                antonymsHtml = `
                    <div class="nuance-group theme-red">
                        <div class="nuance-header">
                            <i class="fa-solid fa-xmark" style="margin-right: 4px;"></i> ZIT ANLAM
                        </div>
                        <div class="antonym-list">
                            ${antonymItems}
                        </div>
                    </div>
                `;
            }

            const content = `
            <div class="side-block">
                ${scaleHtml}
                ${antonymsHtml}
            </div>
            `;
            nuanceHtml = wrapSection('sec-nuance', 'Nüanslar', content);
        }

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
                                            <span class="collo-word">
                                                ${m.word} 
                                                ${m.turkish ? `<span style="font-size:0.8em; font-weight:normal; color:#718096; margin-left:4px;">(${m.turkish})</span>` : ''}
                                            </span>
                                            <span class="collo-example">${m.example}</span>
                                            ${m.example_tr ? `<div style="font-size:0.85em; color:#718096; margin-top:2px; font-style:italic;">${m.example_tr}</div>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            ${verbs.length > 0 ? `
                                <div class="collo-group">
                                    <h4 class="collo-header">Hangi Fiillerle?</h4>
                                    ${verbs.map(v => `
                                        <div class="collo-item">
                                            <span class="collo-word">
                                                ${v.word}
                                                 ${v.turkish ? `<span style="font-size:0.8em; font-weight:normal; color:#718096; margin-left:4px;">(${v.turkish})</span>` : ''}
                                            </span>
                                            <span class="collo-example">${v.example}</span>
                                            ${v.example_tr ? `<div style="font-size:0.85em; color:#718096; margin-top:2px; font-style:italic;">${v.example_tr}</div>` : ''}
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

        let pragmaticsHtml = '';
        if (item.pragmatics && item.pragmatics.idioms_and_phrases) {
            const content = `
                <div class="study-block">
                    <h3 class="section-title">Deyimler & İfadeler</h3>
                    <div class="idiom-list">
                        ${item.pragmatics.idioms_and_phrases.map(idm => `
                            <div class="idiom-card" style="display: flex; flex-direction: column; gap: 4px;">
                                <div class="idiom-phrase">
                                    ${idm.phrase}
                                    <span style="font-size:0.8em; font-weight:normal; color:#718096; margin-left:4px;">(${idm.meaning_tr})</span>
                                </div>
                                ${idm.example ? `<div style="font-size:0.8rem; color:#718096;">${idm.example}</div>` : ''}
                                ${idm.example_tr ? `<div style="font-size:0.85em; color:#718096; font-style:italic;">${idm.example_tr}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
             `;
            pragmaticsHtml = wrapSection('sec-idioms', 'Deyimler', content);
        }

        let cultureHtml = '';
        if (item.cultural_context) {
            const ctx = item.cultural_context;
            const content = `
                <div class="study-block">
                    <h3 class="section-title">Sosyo - Kültürel</h3>
                    <div class="culture-grid">
                        ${ctx.register ? `
                            <div class="context-card register-card">
                                <div class="card-content">
                                    <h4 class="context-title">
                                        <span class="inline-icon" style="color:#3182ce;">🗣️</span> 
                                        Kullanım Tonu (Register)
                                        <div class="reg-level ${ctx.register.level}" style="margin-left:auto;">${ctx.register.level.toUpperCase()}</div>
                                    </h4>
                                    <div class="register-bar">
                                        <span class="reg-desc">${ctx.register.description}</span>
                                    </div>
                                </div>
                            </div>
                        ` : ''}

                        ${ctx.inclusive_language ? `
                            <div class="context-card inclusive-card">
                                <div class="card-content">
                                    <h4 class="context-title">
                                        <span class="inline-icon">⚠️</span> 
                                        ${ctx.inclusive_language.title}
                                    </h4>
                                    <p>${ctx.inclusive_language.content}</p>
                                </div>
                            </div>
                        ` : ''}

                        ${ctx.grammar_nuance ? `
                            <div class="context-card nuance-card">
                                <div class="card-content">
                                    <h4 class="context-title">
                                        <span class="inline-icon">⚖️</span> 
                                        ${ctx.grammar_nuance.title}
                                    </h4>
                                    <p>${ctx.grammar_nuance.content}</p>
                                </div>
                            </div>
                        ` : ''}

                        ${ctx.business_english ? `
                            <div class="context-card business-card">
                                <div class="card-content">
                                    <h4 class="context-title">
                                        <span class="inline-icon">💼</span> 
                                        ${ctx.business_english.title}
                                    </h4>
                                    <p>${ctx.business_english.content}</p>
                                    ${ctx.business_english.keywords ? `
                                        <div class="keyword-tags">
                                            ${ctx.business_english.keywords.map(k => `<span>${k}</span>`).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        ` : ''}

                        ${ctx.trivia ? `
                            <div class="context-card trivia-card">
                                <div class="card-content">
                                    <h4 class="context-title">
                                        <span class="inline-icon">💡</span> 
                                        ${ctx.trivia.title}
                                    </h4>
                                    <p>${ctx.trivia.content}</p>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            cultureHtml = wrapSection('sec-culture', 'Sosyo - Kültürel', content);
        }

        let examHtml = '';
        if (item.exam_strategies) {
            const ex = item.exam_strategies;
            const content = `
                <div class="study-block">
                    <h3 class="section-title">ÖSYM Stratejileri</h3>
                    
                    ${ex.frequency ? `
                        <div class="exam-dashboard">
                            <h4 class="dashboard-title">Sınavda Karşılaşma Olasılığı</h4>
                            <div class="all-meters">
                                <div class="meter-group">
                                    <span class="exam-name">YDS</span>
                                    <div class="progress-bg"><div class="progress-fill" style="width:${ex.frequency.yds}%"></div></div>
                                    <span class="exam-score">%${ex.frequency.yds}</span>
                                </div>
                                <div class="meter-group">
                                    <span class="exam-name">YÖKDİL</span>
                                    <div class="progress-bg"><div class="progress-fill" style="width:${ex.frequency.yokdil}%"></div></div>
                                    <span class="exam-score">%${ex.frequency.yokdil}</span>
                                </div>
                                <div class="meter-group">
                                    <span class="exam-name">YDT</span>
                                    <div class="progress-bg"><div class="progress-fill" style="width:${ex.frequency.ydt}%"></div></div>
                                    <span class="exam-score">%${ex.frequency.ydt}</span>
                                </div>
                            </div>
                            <div class="dashboard-desc">${ex.frequency.description}</div>
                        </div>
                    ` : ''}

                    <div class="exam-grid">
                        ${ex.vocabulary ? `
                            <div class="exam-category">
                                <h4 class="category-header"><span class="cat-icon">🧠</span> Kelime Bilgisi</h4>
                                ${ex.vocabulary.map(strat => `
                                    <div class="exam-card vocab-strat">
                                        <div class="strat-title">${strat.title}</div>
                                        <div class="strat-content">${strat.content}</div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        ${ex.grammar ? `
                            <div class="exam-category">
                                <h4 class="category-header"><span class="cat-icon">🛑</span> Gramer Tuzakları</h4>
                                ${ex.grammar.map(strat => `
                                    <div class="exam-card grammar-strat">
                                        <div class="strat-title">${strat.title}</div>
                                        <div class="strat-content">${strat.content}</div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        ${ex.reading ? `
                            <div class="exam-category">
                                <h4 class="category-header"><span class="cat-icon">📖</span> Okuma & Çeviri</h4>
                                ${ex.reading.map(strat => `
                                    <div class="exam-card reading-strat">
                                        <div class="strat-title">${strat.title}</div>
                                        <div class="strat-content">${strat.content}</div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            examHtml = wrapSection('sec-exam', 'ÖSYM Stratejileri', content);
        }


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

        const combinedHistoryHtml = historyHtml + hintHtml;

        let storiesHtml = '';
        if (item.stories) {
            const storyLevels = Object.keys(item.stories);
            if (storyLevels.length > 0) {
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

        const rawIpa = phonetics.ipa_us || '';
        const cleanIpa = rawIpa.replace(/\//g, '');

        // --- SECTION ORDERING LOGIC ---
        const preferredOrder = [
            'sec-definitions',
            'sec-nuance',
            'sec-derivatives',
            'sec-exam',
            'sec-collocations',
            'sec-idioms',
            'sec-grammar',
            'sec-progression',
            'sec-errors',     // Sık Hatalar
            'sec-history',    // Köken & Tarihçe
            'sec-hint',       // Türkçe İpucu
            'sec-culture',    // Sosyo - Kültürel
            'sec-stories-main'
        ];

        availableSections.sort((a, b) => {
            const indexA = preferredOrder.indexOf(a.id);
            const indexB = preferredOrder.indexOf(b.id);
            // Items not in list go to end
            const safeIndexA = indexA === -1 ? 999 : indexA;
            const safeIndexB = indexB === -1 ? 999 : indexB;
            return safeIndexA - safeIndexB;
        });

        const dropdownItemsHtml = availableSections.map(s => `
            <div class="dropdown-item" data-section="${s.id}">
                ${s.html || s.title}
            </div>
        `).join('');

        // Compact Header Redesign
        const headerHtml = `
        <!-- Top Row: Controls (Not Sticky) -->
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%; border-bottom:1px solid #f0f0f0; padding:10px 15px; margin-bottom:0;">
            <!-- Left: Nav -->
            <div style="display:flex; align-items:center; gap:5px;">
                 <button onclick="vocabCard.prevCard()" class="nav-btn-small hover:bg-gray-50 text-gray-400" ${index === 0 ? 'disabled' : ''}>
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <span style="font-size:1.1rem; color:#718096; min-width:30px; text-align:center; font-weight:500;">
                    ${index + 1} / ${this.data.length}
                </span>
                <button onclick="vocabCard.nextCard()" class="nav-btn-small hover:bg-gray-50 text-gray-600">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>

            <!-- Right: Pronunciation -->
            <div style="display:flex; align-items:center; gap:5px;">
                <span style="font-family:'Courier New'; font-size:1.1rem; color:#4a5568; padding:0 4px; border-radius:3px;">
                    ${cleanIpa}
                </span>
                <button onclick="vocabCard.playGoogleAudio('${item.word}')" class="nav-btn-small rounded-full text-blue-600 bg-blue-50 border-transparent">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        </div>

        <div id="sticky-placeholder" style="height:0; width:100%;"></div>
        
        <!-- Sticky Wrapper (Only Word Line) -->
        <div class="sticky-header-wrapper">
            <!-- Bottom Row: Word & Dropdown (Ultra Compact) -->
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                <h1 style="font-size:2.0rem; font-weight:800; color:var(--text-main); margin:0; line-height:1; letter-spacing:-0.5px;">
                    ${item.word}
                </h1>
                
                <div class="custom-dropdown-container">
                    <div class="dropdown-trigger">
                        <span id="dropdown-label">Bölüme Git...</span>
                        <span style="font-size:0.7em; margin-left:6px;">▼</span>
                    </div>
                    <div class="dropdown-menu" id="vocab-dropdown-menu">
                        <div class="dropdown-item" data-section="toggle-all">
                            <span id="toggle-all-text" style="font-weight:bold; color:var(--primary);">➕ Hepsini Aç</span>
                        </div>
                        <div class="dropdown-item separator"></div>
                        ${dropdownItemsHtml}
                    </div>
                </div>
            </div>
        </div>
        `;

        const tagsHtml = `
            <div class="word-meta" style="padding: 8px 15px; border-bottom: 1px solid var(--border); display:flex; flex-wrap:wrap; gap:5px;">
                <span class="meta-chip" style="background:${this.getLevelColor(meta.cefr_level)}; color:white; border:none;">${meta.cefr_level || 'A1'}</span>
                <span class="meta-chip">${translate(meta.frequency_band) || 'Genel'}</span>
                ${(() => {
                const posRaw = meta.part_of_speech;
                let posArray = [];
                if (Array.isArray(posRaw)) {
                    posArray = posRaw;
                } else if (typeof posRaw === 'string') {
                    posArray = posRaw.split('/').map(s => s.trim());
                } else {
                    posArray = ['Kelime'];
                }
                return posArray.map(p => `<span class="meta-chip">${translate(p)}</span>`).join('');
            })()}
            </div>
        `;

        return `
            <div class="vocab-card">
                ${headerHtml}
                ${tagsHtml}
                <div class="content-grid">
                    <div class="main-content">
                        <div class="study-block" style="margin-top:0; margin-bottom:15px;">
                            ${definitionsHtml}
                        </div>
                        ${nuanceHtml}
                        ${derivativesHtml}
                        ${examHtml}
                        ${collocationsHtml}
                        ${pragmaticsHtml}
                        ${grammarHtml}
                        ${progressionHtml}
                        ${pedagogyHtml}
                        ${combinedHistoryHtml}
                        ${cultureHtml}
                        ${storiesHtml}
                    </div>
                </div>
            </div>
        `;
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
            // Ensure sticky state is correct after jump
            setTimeout(() => this.updateStickyState(), 50);
        } else {
            console.log("Kelime bulunamadı, navigasyon yapılmadı: " + word);
        }
    }

    nextCard() {
        const oldContent = this.container.innerHTML;

        if (this.currentIndex < this.data.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }

        this.renderCard();
        this.animateTransition('next', oldContent);
    }

    prevCard() {
        const oldContent = this.container.innerHTML;

        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            // Opsiyonel: Başa döngü veya durma. Şimdilik sınırda kalıyor.
            return;
        }

        this.renderCard();
        this.animateTransition('prev', oldContent);
    }

    animateTransition(direction, oldContent) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const newCard = this.container.querySelector('.vocab-card');
        if (!newCard) return;

        // 1. Ghost Card (Eski Kart) Hazırla
        const wrapper = document.createElement('div');
        wrapper.innerHTML = oldContent;
        const ghostCard = wrapper.firstElementChild;

        if (ghostCard) {
            ghostCard.classList.add('ghost-card');

            // Sticky header'ın etkisini kırmak için
            const ghostSticky = ghostCard.querySelector('.sticky-header-wrapper');
            if (ghostSticky) {
                ghostSticky.classList.remove('mobile-fixed');
                ghostSticky.style.position = 'static';
            }

            this.container.appendChild(ghostCard);

            // 2. Animasyon Sınıflarını Ekle
            if (direction === 'next') {
                ghostCard.classList.add('anim-slide-out-left');
                newCard.classList.add('anim-slide-in-right');
            } else {
                ghostCard.classList.add('anim-slide-out-right');
                newCard.classList.add('anim-slide-in-left');
            }

            // 3. Temizlik
            setTimeout(() => {
                if (ghostCard.parentNode) ghostCard.parentNode.removeChild(ghostCard);
                newCard.classList.remove('anim-slide-in-right', 'anim-slide-in-left');
                // Ensure sticky state is updated after animation
                this.updateStickyState();
            }, 400); // CSS animasyon süresi (0.4s) ile aynı
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
                const content = sec.querySelector('.accordion-content');
                const icon = sec.querySelector('.accordion-icon i');

                if (action === 'open') {
                    sec.classList.add('open');
                    if (content) content.classList.remove('hidden');
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                } else {
                    sec.classList.remove('open');
                    if (content) content.classList.add('hidden');
                    if (icon) {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
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

            // Helper to open a section
            const openSection = (sectionElement) => {
                if (!sectionElement.classList.contains('open')) {
                    sectionElement.classList.add('open');
                    const content = sectionElement.querySelector('.accordion-content');
                    const icon = sectionElement.querySelector('.accordion-icon i');
                    if (content) content.classList.remove('hidden');
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                }
            };

            // Open target
            openSection(el);

            // Recursively open all parent accordions
            let currentEl = el.parentElement;
            while (currentEl) {
                // Find closest parent section-wrapper
                const parentSection = currentEl.closest('.section-wrapper');
                if (parentSection) {
                    openSection(parentSection);
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
        if (this.eventsBound) return; // Prevent duplicate listeners
        this.eventsBound = true;

        // --- Buton Tıklamaları ---
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('#btn-prev')) this.prevCard();
            if (e.target.closest('#btn-next')) this.nextCard();
            if (e.target.closest('#btn-play-sound')) this.playSound();
        });

        // Toggle Expand/Collapse (Accordion)
        this.container.addEventListener('click', (e) => {
            const header = e.target.closest('.accordion-header');
            if (header) {
                // Find parent wrapper to sync with "Toggle All" logic
                const wrapper = header.closest('.section-wrapper');
                const content = header.nextElementSibling;
                const icon = header.querySelector('i');

                let isOpen = false;

                if (wrapper) {
                    // Toggle wrapper state
                    wrapper.classList.toggle('open');
                    isOpen = wrapper.classList.contains('open');
                } else {
                    // Fallback if no wrapper (legacy logic)
                    isOpen = content.classList.contains('hidden');
                }

                if (isOpen) {
                    content.classList.remove('hidden');
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                } else {
                    content.classList.add('hidden');
                    if (icon) {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                }
            }
        });

        // Dropdown Toggle
        this.container.addEventListener('click', (e) => {
            const trigger = e.target.closest('.dropdown-trigger');
            if (trigger) {
                this.isDropdownInteraction = true;
                const menu = trigger.nextElementSibling;
                menu.classList.toggle('show');
                const icon = trigger.querySelector('.fa-chevron-down, .fa-chevron-up');
                if (icon) {
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                }
            } else if (!e.target.closest('.custom-dropdown-container')) {
                this.closeDropdown();
            }
        });

        // Dropdown Item Selection
        this.container.addEventListener('click', (e) => {
            const item = e.target.closest('.dropdown-item');
            if (item) {
                const sectionId = item.getAttribute('data-section');
                if (sectionId) {
                    this.scrollToSection(sectionId);
                    this.closeDropdown();
                }
            }
        });

        // Close dropdown on scroll
        window.addEventListener('scroll', () => {
            if (!this.isDropdownInteraction) {
                this.closeDropdown();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextCard();
            if (e.key === 'ArrowLeft') this.prevCard();
        });

        // --- Mobile Swipe Events (Interactive) ---
        const touchStart = (event) => {
            // Dropdown içindeyse swipe başlatma
            if (event.target.closest('.custom-dropdown-container') || event.target.closest('.dropdown-menu')) {
                this.isDropdownInteraction = true;
                return;
            }

            this.isDragging = true;
            this.startPos = this.getPositionX(event);
            // Capture Y start position to detect vertical scroll intention
            this.startPosY = event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;

            // RESET LOCK STATE
            this.lockDirection = null; // 'horizontal' or 'vertical'

            this.animationID = requestAnimationFrame(this.animation);

            // Clear any existing transition
            const card = this.container.querySelector('.vocab-card');
            if (card) card.style.transition = 'none';
        }

        const touchMove = (event) => {
            if (!this.isDragging) return;

            const currentPosition = this.getPositionX(event);
            const currentPositionY = event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;

            const diff = currentPosition - this.startPos;
            const diffY = currentPositionY - this.startPosY;

            // --- AXIS LOCKING LOGIC ---
            // If direction isn't locked yet, check threshold
            if (!this.lockDirection) {
                const absDiffX = Math.abs(diff);
                const absDiffY = Math.abs(diffY);
                // Threshold of 5px to determine intent
                if (absDiffX > 5 || absDiffY > 5) {
                    if (absDiffX > absDiffY) {
                        this.lockDirection = 'horizontal';
                    } else {
                        this.lockDirection = 'vertical';
                        // If determined vertical, cancel dragging flag immediately to "release" swipe control
                        this.isDragging = false;
                        this.currentTranslate = 0;
                        this.setSliderPosition();
                        return;
                    }
                }
            }

            // If locked vertically, do nothing (let native scroll happen)
            if (this.lockDirection === 'vertical') {
                return;
            }

            // If locked horizontally, PREVENT NATIVE SCROLL and do swipe
            if (this.lockDirection === 'horizontal') {
                if (event.cancelable) event.preventDefault();
            }

            // 1. Block Prev Swipe on First Card
            if (this.currentIndex === 0 && diff > 0) {
                this.currentTranslate = 0;
                return;
            }

            this.currentTranslate = diff;

            // Ghost Kart Oluşturma (Henüz yoksa ve hareket belirginse)
            if (!this.ghostCard && Math.abs(diff) > 20) {
                this.createGhostCard(diff);
            }

            // Hareketli Ghost Kart Kontrolü
            if (this.ghostCard) {
                const width = window.innerWidth;
                if (diff > 0) { // Prev (Sağa çekiyoruz, soldan gelen görünmeli)
                    this.ghostCard.style.transform = `translateX(${-width + diff}px)`;
                } else { // Next (Sola çekiyoruz, sağdan gelen görünmeli)
                    this.ghostCard.style.transform = `translateX(${width + diff}px)`;
                }
            }
        }


        const touchEnd = () => {
            if (this.isDropdownInteraction) {
                setTimeout(() => {
                    this.isDropdownInteraction = false;
                }, 500);
                return;
            }

            this.isDragging = false;
            cancelAnimationFrame(this.animationID);

            const movedBy = this.currentTranslate;
            const threshold = 80; // Hassasiyet artırıldı (100 -> 80)

            // Eğer yeterince kaydırıldıysa aksiyon al
            if (Math.abs(movedBy) > threshold) {
                const direction = movedBy < 0 ? 'next' : 'prev';
                this.finishSwipe(direction);
            } else {
                // Yeterince kaydırılmadı, geri snap yap
                this.snapBack();
            }
            // Her durumda sıfırla
            this.currentTranslate = 0;
        }

        this.container.addEventListener('touchstart', touchStart, { passive: true });
        // Revert passive: false if swipe locking not working well, but keeping it for axis locking
        this.container.addEventListener('touchmove', touchMove, { passive: false });
        this.container.addEventListener('touchend', touchEnd);

        // JS Sticky Fallback for Mobile (Robustness)
        // We use a bound function so we can call it manually after render
        this.handleScroll = this.handleScroll.bind(this);
        window.addEventListener('scroll', this.handleScroll, { passive: true });

        // Initial check
        this.updateStickyState();
    }

    handleScroll() {
        if (window.innerWidth > 768) return;
        this.updateStickyState();
    }

    updateStickyState() {
        // Only run on mobile
        if (window.innerWidth > 768) return;

        const stickyWrapper = this.container.querySelector('.sticky-header-wrapper');
        const placeholder = this.container.querySelector('#sticky-placeholder');
        const topControls = this.container.querySelector('.vocab-card > div:first-child');

        if (!stickyWrapper || !placeholder || !topControls) return;

        // Calculate trigger point: Bottom of the top controls
        const triggerPoint = topControls.getBoundingClientRect().bottom;

        // Dynamic Navbar Height Calculation
        const header = document.querySelector('header');
        const navbarHeight = header ? header.offsetHeight : 50; // Fallback to 50px

        // If the top controls slide under the navbar, we stick.
        // If the top controls slide under the navbar, we stick.
        // LOGIC UPDATE: Use different triggers for adding vs removing to apply hysteresis and stability
        if (!stickyWrapper.classList.contains('mobile-fixed')) {
            // Activation Condition: Top controls bottom slides under navbar
            if (triggerPoint < navbarHeight) {
                stickyWrapper.classList.add('mobile-fixed');
                stickyWrapper.style.top = `${navbarHeight}px`;
                placeholder.style.height = `${stickyWrapper.offsetHeight}px`;
            }
        } else {
            // Deactivation Condition: Placeholder bottom slides back down BELOW navbar
            // usage of placeholder.getBoundingClientRect().top ensures we track the original position
            const placeholderRect = placeholder.getBoundingClientRect();
            // We unstick only if the placeholder (original psotion) moves clearly below the navbar
            // Using a slight offset (e.g. 5px) prevents rapid toggling
            if (placeholderRect.top > navbarHeight) {
                stickyWrapper.classList.remove('mobile-fixed');
                stickyWrapper.style.top = '';
                placeholder.style.height = '0';
            }
        }
    }


    getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    animation = () => {
        if (this.isDragging) {
            this.setSliderPosition();
            requestAnimationFrame(this.animation);
        }
    }

    setSliderPosition() {
        const card = this.container.querySelector('.vocab-card');
        if (card) {
            if (this.currentTranslate === 0) {
                // If 0, remove transform entirely so position:fixed works relative to viewport
                card.style.transform = '';
            } else {
                card.style.transform = `translateX(${this.currentTranslate}px)`;
            }
        }
    }

    createGhostCard(diff) {
        let targetIndex = -1;
        let startX = 0;

        if (diff > 0) {
            // Sağa kaydırma -> Önceki kart (Soldan gelecek)
            // Blocked in touchMove if index 0, but safe check:
            if (this.currentIndex > 0) {
                targetIndex = this.currentIndex - 1;
                startX = -window.innerWidth;
            }
        } else {
            // Sola kaydırma -> Sonraki kart (Sağdan gelecek)
            // Loop Logic:
            if (this.currentIndex === this.data.length - 1) {
                targetIndex = 0; // Loop to start
            } else {
                targetIndex = this.currentIndex + 1;
            }
            startX = window.innerWidth;
        }

        if (targetIndex >= 0 && targetIndex < this.data.length) {
            // Wrapper'a overflow class ekle (Sticky bozulmasın diye sadece animasyonda gizle)
            this.container.classList.add('animating');

            const item = this.data[targetIndex];
            const html = this.generateCardHTML(item, targetIndex);

            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            this.ghostCard = wrapper.firstElementChild;

            this.ghostCard.classList.add('ghost-card');
            this.ghostCard.style.position = 'absolute';
            this.ghostCard.style.top = '0';
            this.ghostCard.style.width = '100%';
            // Başlangıç pozisyonu ekran dışı
            this.ghostCard.style.transform = `translateX(${startX}px)`;
            this.ghostCard.style.zIndex = '1000'; // Üstte

            // Sticky header fix
            const ghostSticky = this.ghostCard.querySelector('.sticky-header-wrapper');
            if (ghostSticky) {
                ghostSticky.classList.remove('mobile-fixed');
                ghostSticky.style.position = 'static';
            }

            this.container.appendChild(this.ghostCard);
        }
    }

    finishSwipe(direction) {
        if (!this.ghostCard) {
            // Ghost card yoksa normal fonksiyonları çağır (failsafe)
            if (direction === 'next') this.nextCard();
            else this.prevCard();
            return;
        }

        const card = this.container.querySelector('.vocab-card');
        const width = window.innerWidth;

        // 1. Animasyonu Tamamla (Snap to Finish)
        this.ghostCard.style.transition = 'transform 0.3s ease-out';
        this.ghostCard.style.transform = 'translateX(0px)';

        if (card) {
            card.style.transition = 'transform 0.3s ease-out';
            card.style.transform = direction === 'next'
                ? `translateX(${-width}px)`
                : `translateX(${width}px)`;
        }

        // 2. Animasyon Bitince Datayı Güncelle
        setTimeout(() => {
            if (direction === 'next') {
                if (this.currentIndex < this.data.length - 1) this.currentIndex++;
                else this.currentIndex = 0;
            } else {
                if (this.currentIndex > 0) this.currentIndex--;
                else return; // Sınırda kal
            }

            // Normal render (Animasyonsuz, çünkü zaten görsel olarak oradayız)
            this.renderCard();

            // Değişkenleri sıfırla
            this.currentTranslate = 0;
            this.ghostCard = null; // renderCard overwrite ettiği için remove'a gerek yok, referansı kopar yeter

            // CRITICAL FIX: Ensure main card has no transform after render
            const card = this.container.querySelector('.vocab-card');
            if (card) {
                card.style.transform = '';
            }

            // Ensure sticky state is correct after swipe finish
            this.updateStickyState();
        }, 300);
    }

    removeGhostCard() {
        if (this.ghostCard) {
            this.ghostCard.remove();
            this.ghostCard = null;
        }

        // Wrapper'dan overflow class'ı kaldır
        this.container.classList.remove('animating');

        // Ana kartın pozisyonunu sıfırla (eğer değişmediyse)
        const card = this.container.querySelector('.vocab-card');
        if (card) {
            // CRITICAL FIX: Clear transform so sticky/fixed works relative to viewport
            card.style.transform = '';
            card.style.transition = 'transform 0.3s ease-out';
        }
    }

    snapBack() {
        const card = this.container.querySelector('.vocab-card');
        if (card) {
            card.style.transition = 'transform 0.3s ease-out';
            // CRITICAL FIX: Clear transform instead of setting to 0px
            card.style.transform = '';
        }
        if (this.ghostCard) {
            this.ghostCard.style.transition = 'transform 0.3s ease-out';
            // Ghost kartı geldiği yere geri gönder
            const width = window.innerWidth;
            const currentX = parseFloat(this.ghostCard.style.transform.replace('translateX(', '').replace('px)', ''));
            // Eğer currentX < 0 ise (Ghost sağda duruyor, sola çekilmiş), geri sağa gitmeli?
            // Mantık: Ghost Next ise (Sağdaysa) -> +width'e dönmeli. Ghost Prev ise (Soldaysa) -> -width'e dönmeli.
            // currentTranslate < 0 ise sola çekiyorduk (Next Card Geliyor). Ghost X > 0.

            // Basitçe createGhostCard'daki startX mantığının tersi
            // Eğer currentTranslate < 0 (Sola çekiş, Next Geliyor) -> Ghost +Width'teydi.
            if (this.currentTranslate < 0) {
                this.ghostCard.style.transform = `translateX(${width}px)`;
            } else {
                this.ghostCard.style.transform = `translateX(${-width}px)`;
            }

            // Animasyon bitince ghost'u sil
            setTimeout(() => {
                this.removeGhostCard();
            }, 300);
        }
    }

    adjustDropdownWidth() {
        // Scope to container to avoid any ghost card conflicts
        const menu = this.container.querySelector('#vocab-dropdown-menu');
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
