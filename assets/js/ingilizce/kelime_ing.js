window.vocabularyData = [

    {  // able
        "id": "1001-able", "word": "able",
        "meta": {
            "version": "2.2.0",
            "dictionary_type": "learner_advanced",
            "cefr_level": "A2",
            "frequency_rank": 350,
            "frequency_band": "High Frequency",
            "part_of_speech": ["adjective"]
        },
        "phonetics": {
            "ipa_us": "/ˈeɪ.bəl/",
            "ipa_uk": "/ˈeɪ.bəl/",
            "audio_us": "/assets/audio/us/able.mp3",
            "audio_uk": "/assets/audio/uk/able.mp3",
            "syllabification": ["a", "ble"],
            "stress_data": {
                "primary_stress_index": 0,
                "pattern": "Trochee (Strong-Weak)"
            }
        },
        "definitions": [
            {
                "sense_id": "def_1",
                "core_meaning_en": "having the ability, power, or skill to do something",
                "core_meaning_tr": "bir şeyi yapabilen, muktedir, gücü yeten",
                "context_tags": ["general", "capability"],
                "grammar_pattern": "be able to + infinitive",
                "example": {
                    "sentence": "Will you be able to come to the meeting?",
                    "translation": "Toplantıya gelebilecek misin?"
                }
            },
            {
                "sense_id": "def_2",
                "core_meaning_en": "clever, skillful, and capable",
                "core_meaning_tr": "yetenekli, becerikli, zeki",
                "context_tags": ["formal", "academic"],
                "grammar_pattern": "attributive adjective (before noun)",
                "example": {
                    "sentence": "She is one of the most able students in the class.",
                    "translation": "Sınıftaki en yetenekli öğrencilerden biridir."
                }
            }
        ],
        "grammar_profile": {
            "structures": [
                {
                    "pattern": "be able to + V1",
                    "usage_level": "Core",
                    "notes_tr": "Tüm zamanlarda (Tenses) çekimlenebilir (is able to, was able to, will be able to)."
                },
                {
                    "pattern": "seem/feel + able to + V1",
                    "usage_level": "Advanced",
                    "notes_tr": "Genellikle his veya görünüş bildiren fiillerle kullanılır."
                }
            ],
            "tense_logic": {
                "why_use_it": "Can modal'ının eksik olduğu zamanlar (Future, Perfect Tenses) için zorunludur.",
                "critical_comparison": {
                    "context": "Past Specific Achievement",
                    "rule": "Geçmişte zor bir durumda 'başarma' anlamı varsa 'could' yerine 'was/were able to' tercih edilir.",
                    "example_wrong": "The fire spread quickly, but everyone could escape. (Yanlış)",
                    "example_right": "The fire spread quickly, but everyone was able to escape. (Doğru)"
                }
            }
        },
        "sentence_progression": {
            "description": "Kelimenin seviyelere göre kullanım karmaşıklığı",
            "levels": [
                {
                    "cefr": "A2",
                    "en": "He is able to read English very well.",
                    "tr": "O, İngilizceyi çok iyi okuyabilir.",
                    "grammar_focus": "Present Tense / General Ability"
                },
                {
                    "cefr": "B1",
                    "en": "After fixing the engine, we were able to continue our journey.",
                    "tr": "Motoru tamir ettikten sonra yolculuğumuza devam edebildik.",
                    "grammar_focus": "Past Tense / Specific Achievement"
                },
                {
                    "cefr": "B2",
                    "en": "With this new funding, the company will be able to expand into new markets.",
                    "tr": "Bu yeni fonla birlikte şirket yeni pazarlara açılabilecek.",
                    "grammar_focus": "Future Tense / Possibility"
                },
                {
                    "cefr": "C1",
                    "en": "Being able to adapt to changing circumstances is a vital skill.",
                    "tr": "Değişen koşullara uyum sağlayabilmek hayati bir beceridir.",
                    "grammar_focus": "Gerund Form (Subject position)"
                }
            ]
        },
        "collocations": {
            "modifiers_adverbs": [
                {
                    "word": "perfectly",
                    "turkish": "tamamen, fazlasıyla",
                    "strength": "strong",
                    "example": "I am perfectly able to look after myself.",
                    "example_tr": "Kendime bakabilecek durumdayım."
                },
                {
                    "word": "barely",
                    "turkish": "ancak, güçbela",
                    "strength": "weak",
                    "example": "He was barely able to stand.",
                    "example_tr": "Ayakta zor durabiliyordu."
                },
                {
                    "word": "physically",
                    "turkish": "fiziksel olarak",
                    "strength": "neutral",
                    "example": "Is he physically able to travel?",
                    "example_tr": "Seyahat edebilecek fiziksel güce sahip mi?"
                },
                {
                    "word": "financially",
                    "turkish": "maddi açıdan",
                    "strength": "neutral",
                    "example": "We are not financially able to buy a house.",
                    "example_tr": "Bir ev alacak maddi gücümüz yok."
                }
            ],
            "verbs_preceding": [
                {
                    "word": "seem",
                    "turkish": "görünmek",
                    "example": "They seem able to cope.",
                    "example_tr": "Başa çıkabiliyor gibi görünüyorlar."
                },
                {
                    "word": "feel",
                    "turkish": "hissetmek",
                    "example": "I don't feel able to drive right now.",
                    "example_tr": "Şu an araba kullanabilecek gibi hissetmiyorum."
                }
            ]
        },
        "lexical_nuance": {
            "synonym_scale": {
                "concept": "Capability Intensity",
                "turkishConcept": "Yetenek Yoğunluğu",
                "description": "Yeterlilik bildiren kelimelerin güç sıralaması",
                "scale": [
                    {
                        "word": "can",
                        "value": 3,
                        "turkish": "yapabilmek",
                        "note": "En temel, gündelik",
                        "usage": "Günlük konuşma: 'I can swim.'",
                        "description_tr": "Günlük konuşma dilinde, en temel yetenek ifadesidir.",
                        "example_en": "I can swim very fast.",
                        "example_tr": "Çok hızlı yüzebilirim.",
                        "example": "I can speak basic English.",
                        "strength": "Düşük"
                    },
                    {
                        "word": "able",
                        "value": 6,
                        "turkish": "muktedir, yapabilen",
                        "note": "Daha resmi, eylem odaklı",
                        "usage": "İş/akademik: 'She is able to lead the team.'",
                        "description_tr": "Daha resmi, bir işi yapmaya gücü yetme veya muktedir olma durumudur.",
                        "example_en": "She is able to lead the team to success.",
                        "example_tr": "Ekibi başarıya götürebilecek yetkinliktedir.",
                        "example": "He is able to solve complex problems.",
                        "strength": "Orta"
                    },
                    {
                        "word": "capable",
                        "value": 8,
                        "turkish": "yetenekli, kapasiteli",
                        "note": "Potansiyel ve kapasite vurgusu",
                        "usage": "Potansiyel: 'He's capable of great things.'",
                        "description_tr": "Potansiyel, kapasite ve doğal yetenek vurgusu taşır.",
                        "example_en": "He's capable of achieving great things.",
                        "example_tr": "Harika şeyler başarabilecek kapasitededir.",
                        "example": "She is capable of learning quickly.",
                        "strength": "Yüksek"
                    },
                    {
                        "word": "proficient",
                        "value": 10,
                        "turkish": "ustalık derecesinde, yetkin",
                        "note": "Uzmanlık derecesinde yetkinlik",
                        "usage": "Teknik/uzmanlık: 'She is proficient in Python.'",
                        "description_tr": "Bir konuda uzmanlık, ustalık ve ileri düzey beceri belirtir.",
                        "example_en": "She is proficient in three languages.",
                        "example_tr": "Üç dilde uzmanlık derecesinde yetkindir.",
                        "example": "He is proficient in three languages.",
                        "strength": "En Üst"
                    }
                ]
            },
            "antonyms": [
                {
                    "word": "unable",
                    "value": 2,
                    "turkish": "yapamaz, aciz",
                    "note": "Geçici veya durumsal yapamama",
                    "description_tr": "Genellikle geçici veya o ana özgü yapamama durumunu anlatır.",
                    "example_en": "I am unable to attend the meeting today.",
                    "example_tr": "Bugün toplantıya katılamıyorum.",
                    "example": "I'm unable to attend the meeting."
                },
                {
                    "word": "incapable",
                    "value": 1,
                    "turkish": "yetersiz, yeteneksiz",
                    "note": "Kalıcı veya yapısal yetersizlik",
                    "description_tr": "Kalıcı yetersizlik veya bir şeyi yapacak yapıda (kapasitede) olmama durumudur.",
                    "example_en": "He is incapable of hurting a fly.",
                    "example_tr": "O, bir karıncayı bile incitebilecek yapıda değildir.",
                    "example": "He's incapable of understanding the problem."
                },
                {
                    "word": "inept",
                    "value": 0,
                    "turkish": "beceriksiz, acemi",
                    "note": "Beceriksiz, sakar, tamamen uyumsuz",
                    "description_tr": "Beceriksiz, sakar veya işe yatkın olmayan demektir.",
                    "example_en": "His inept handling of the situation caused problems.",
                    "example_tr": "Durumu beceriksizce yönetmesi sorunlara yol açtı.",
                    "example": "His inept handling made things worse.",
                    "warning": "Hakaret içerebilir, dikkatli kullanın!"
                }
            ]
        },
        "pragmatics": {
            "idioms_and_phrases": [
                {
                    "phrase": "ready, willing, and able",
                    "meaning_tr": "dünden razı, her şeye hazır ve nazır",
                    "register": "cliché/idiomatic",
                    "example": "I am ready, willing, and able to work.",
                    "example_tr": "Çalışmaya dünden razıyım."
                },
                {
                    "phrase": "able-bodied",
                    "meaning_tr": "eli ayağı tutan, fiziksel engeli olmayan",
                    "register": "neutral",
                    "example": "Every able-bodied man was called to fight.",
                    "example_tr": "Eli ayağı tutan her erkek savaşmaya çağrıldı."
                }
            ],
            "sociolinguistics": {
                "topic": "Inclusive Language",
                "note_en": "In modern contexts, be mindful of ableist language. 'Disabled' is generally preferred over euphemisms like 'differently abled' by the community.",
                "note_tr": "Modern İngilizcede engellilik bağlamında dil kullanımına dikkat edilmelidir."
            }
        },
        "cultural_context": {
            "register": {
                "level": "formal",
                "description": "Günlük konuşmada genellikle 'can' tercih edilirken, 'able' daha çok yazılı, resmi veya akademik dilde yetkinliği vurgulamak için kullanılır."
            },
            "inclusive_language": {
                "title": "Kapsayıcı Dil (Inclusive Language)",
                "content": "Modern İngilizcede 'disabled' (engelli) kelimesi yerine bazen 'differently abled' gibi terimler tartışılsa da, 'able-bodied' (fiziksel engeli olmayan) terimi hukuki ve tıbbi metinlerde hala yaygındır ancak günlük dilde dikkatli kullanılmalıdır."
            },
            "grammar_nuance": {
                "title": "Able vs Capable Farkı",
                "content": "'Able' genellikle o anki, geçici bir yapabilme durumunu (örn: toplantıya gelebilmek) anlatırken; 'Capable' daha kalıcı, potansiyel bir yeteneği (örn: cinayet işleyebilecek kapasitede olmak) ifade eder."
            },
            "business_english": {
                "title": "İş Dünyası & CV",
                "content": "İş ilanlarında 'able to work under pressure' (baskı altında çalışabilen) veya 'problem-solving ability' kalıpları çok sık geçer. Bu kelime profesyonel yetkinlik (competence) sinyali verir.",
                "keywords": ["able to work under pressure", "problem-solving ability"]
            },
            "trivia": {
                "title": "Biliyor muydunuz?",
                "content": "'Ready, willing, and able' kalıbı Amerikan hukuk dilinden günlük dile yerleşmiş, bir şeyi yapmaya hem hazır hem istekli hem de muktedir olmayı anlatan meşhur bir üçlemedir."
            }
        },
        "exam_strategies": {
            "frequency": {
                "yds": 85,
                "yokdil": 90,
                "ydt": 70,
                "description": "ÖSYM havuzunda en sık geçen ilk 500 kelime arasındadır."
            },
            "vocabulary": [
                {
                    "title": "Edat Farkı (Prepositions)",
                    "content": "Sınavlarda 'able <b>TO</b> do' ile 'capable <b>OF</b> doing' ayrımı sıkça sorulur. Boşluktan sonra 'to V1' varsa 'able', 'of Ving' varsa 'capable' seçin."
                },
                {
                    "title": "Kelime Türetme",
                    "content": "Şıklarda 'able' (sıfat) ve 'enable' (fiil) birlikte verilebilir. Cümle fiil arıyorsa (örn: 'This law ___ us to...') 'enable' tercih edilmelidir."
                },
                {
                    "title": "Suffix Analizi (-able)",
                    "content": "-able eki eklendiği fiile 'yapılabilir' anlamı katar (readable, doable). Bilmediğiniz kelimelerde bu mantığı kurun."
                },
                {
                    "title": "Eşdizim (Collocations)",
                    "content": "Cloze testlerde 'perfectly able' veya 'barely able' ikilileri yaygındır. 'Able' öncesi boşlukta zarf arayın."
                }
            ],
            "grammar": [
                {
                    "title": "Gramer Tuzağı: Geçmiş Yetenek",
                    "content": "Geçmişte tek seferlik zor bir başarı anlatılıyorsa 'could' yerine 'was able to' veya 'managed to' kullanılır. (e.g. He was able to escape the fire)."
                },
                {
                    "title": "Pasif Yapı (Passive)",
                    "content": "Modalların pasif hali kafa karıştırabilir. 'It must be able to be done' (Yapılabilmesi gerekir) gibi yapılar YÖKDİL metinlerinde çıkar."
                }
            ],
            "reading": [
                {
                    "title": "Akademik Çeviri",
                    "content": "'Able to' ifadesini 'muktedir olmak' diye değil, '-ebilmek' veya 'kapasitesine sahip olmak' şeklinde çevirin. Örn: 'Technologies able to reduce emissions'."
                },
                {
                    "title": "Paraphrase (Zıt Anlam)",
                    "content": "Soruda 'unable' görüyorsanız, cevapta 'failed to', 'could not' veya 'lacked the ability' gibi yapılar arayın."
                },
                {
                    "title": "Alan Bağlamı (YÖKDİL)",
                    "content": "Sağlıkta 'disabled' (engelli), Fende 'viable' (yaşayabilir/able to survive), Sosyalde 'enable' (yetkilendirmek/empower) sık çıkar."
                }
            ]
        },
        "morphology_tree": {
            "root": "habilis (Latin)",
            "family_members": [
                { "word": "able", "pos": "adj", "level": "A2", "note": "yapabilecek, yetkin, becerikli, yetenekli" },
                { "word": "unable", "pos": "adj", "level": "B1", "prefix": "un-", "note": "yapamayan, aciz, gücü yetmeyen" },
                { "word": "ability", "pos": "n", "level": "A2", "suffix": "-ity", "note": "yetenek, kabiliyet, beceri, yapma yeteneği" },
                { "word": "enable", "pos": "v", "level": "B2", "prefix": "en-", "note": "mümkün kılmak, yetki vermek" },
                { "word": "disable", "pos": "v", "level": "B2", "prefix": "dis-", "note": "engellemek, devre dışı bırakmak, yetki almak" }
            ]
        },
        "pedagogy_engine": {
            "common_errors": [
                {
                    "error_id": "err_modal_double",
                    "incorrect": "I can able to do it.",
                    "correction": "I am able to do it.",
                    "explanation": "'Can' ve 'be able to' aynı cümlede yan yana gelmez."
                },
                {
                    "error_id": "err_verb_be",
                    "incorrect": "I able to swim.",
                    "correction": "I am able to swim.",
                    "explanation": "'Be' fiili (am/is/are/was/were) unutulmamalıdır."
                }
            ],
            "exam_prep": {
                "ielts_tag": "Grammatical Range",
                "tip": "Speaking Part 2 veya Writing Task 1'de sürekli 'can' demek yerine 'was able to' veya 'have been able to' yapılarını kullanmak puanınızı artırır.",
                "keywords": ["capability", "achievement"]
            },
            "gamification": {
                "challenge_type": "gap_fill",
                "question": "Despite the heavy rain, they ___ able to reach the summit.",
                "answer": "were",
                "distractors": ["can", "did", "are"]
            }
        },
        "word_journey": {
            "timeline": [
                { "era": "Latin", "word": "habilis", "meaning": "handy, manageable" },
                { "era": "Old French", "word": "hable/able", "meaning": "capable" },
                { "era": "Modern English", "word": "able", "meaning": "having the power to do" }
            ],
            "turkish_cognate_hint": {
                "word": "Kabiliyet",
                "connection_type": "Conceptual",
                "story": "İngilizce 'capable' ve 'able' kelimeleri ile Türkçedeki 'kabiliyet' (Arapça kökenli olsa da) benzer tını ve anlama sahiptir. Bilimsel (etimolojik) olarak doğrudan akraba değillerdir, ancak anlam mantığı ve ses benzerliği %100 örtüşmektedir.",
                "example": "Bu iki kelime farklı dil ailelerinden gelir, yani 'kardeş' değil, 'benzer giyinen iki yabancı' gibidirler.",
                "example2": "Able / Capable (İngilizce): Kökeni Latince \"Capere\" (tutmak, kavramak, içine almak) fiiline dayanır. Hint-Avrupa dil ailesindendir. (Buradan türeyen diğer kelimeler: Capture, Capacity, Capsule).",
                "example3": "Kabiliyet (Türkçe < Arapça): Kökeni Arapça \"Kabul\" (k-b-l kökü: almak, kabul etmek, önünde olmak) kelimesine dayanır. Hami-Sami dil ailesindendir. (Buradan türeyen kelimeler: Kıble, İkbal, Kabul)."
            }
        },
        "stories": {
            "A1": {
                "tr": "Ben Ela. Birçok şeyi <strong>yapabiliyorum</strong>. Koşabiliyorum ve şarkı söyleyebiliyorum. Ama <strong>uçamıyorum</strong>, bu benim <strong>yetenek</strong>im değil. Öğretmenim bana yardım ediyor. Bu yardım öğrenmemi kolaylaştırıyor. Çok çalışıyorum. Yarın daha iyi <strong>olacağım</strong>.",
                "en": "I am Ela. I <strong>am able</strong> to do many things. I <strong>am able</strong> to run and sing. But I <strong>am unable</strong> to fly, that is not my <strong>ability</strong>. My teacher helps me. This help <strong>enables</strong> my learning. I work hard. Tomorrow I <strong>will be</strong> better."
            },
            "A2": {
                "tr": "Ahmet İngilizce öğreniyor. Dün sınavda bazı soruları <strong>cevaplayamadı</strong>. Çok üzüldü. Ama öğretmeni ona yardım etti. Bu yardım sayesinde daha iyi oldu. Şimdi Ahmet İngilizce <strong>konuşabiliyor</strong>. Onun <strong>yetenek</strong>i arttı. Öğretmeni ona 'Artık kitap <strong>okuyabilirsin</strong>' dedi. Ahmet çok mutlu. Gelecek sınavda tüm soruları <strong>cevaplayabilecek</strong>.",
                "en": "Ahmet is learning English. Yesterday in the exam, he <strong>was unable</strong> to answer some questions. He was sad. But his teacher helped him. This help <strong>enabled</strong> him to improve. Now Ahmet <strong>is able</strong> to speak English. His <strong>ability</strong> increased. His teacher said, 'You <strong>are able</strong> to read a book now.' Ahmet is very happy. In the next exam, he <strong>will be able</strong> to answer all questions."
            },
            "B1": {
                "tr": "Mühendis Can, önemli bir sunum hazırlıyordu. Ancak sunum programı aniden <strong>bozuldu</strong>. Bu sorun onun sunum yapmasını <strong>engelledi</strong>. Can bu sorunu hemen <strong>çözebildi</strong> mi? Evet! Onun hızlı düşünme <strong>yetenek</strong>leri işe yaradı. Teknik bilgisi sorunu çözmesini <strong>mümkün kıldı</strong>. Sunumu zamanında yapmayı <strong>başardı</strong>. Patronu, 'Bu sorunun üstesinden <strong>gelebildiğin</strong> için tebrikler' dedi. Can'ın bu <strong>becerisi</strong> tüm ekibi güçlendirdi.",
                "en": "Engineer Can was preparing an important presentation. However, the presentation software suddenly <strong>became disabled</strong>. This problem <strong>disabled</strong> his presentation. <strong>Was</strong> Can <strong>able</strong> to fix it immediately? Yes! His quick-thinking <strong>abilities</strong> worked. His technical knowledge <strong>enabled</strong> him to solve the problem. He <strong>was able</strong> to present on time. His boss said, 'Congratulations for <strong>being able</strong> to overcome this problem.' Can's <strong>ability</strong> strengthened the whole team."
            },
            "B2": {
                "tr": "Girişimci Deniz, projesi için finansal destek arıyordu. Başlangıçta yatırımcıları <strong>ikna edemedi</strong>. Bu durum projesini <strong>durdurma</strong> tehlikesi yarattı. Ancak pes etmedi ve yeni bir strateji <strong>geliştirmeyi başardı</strong>. Detaylı planı yatırımcıların potansiyeli görmesini <strong>sağladı</strong>. Sonunda gerekli fonu <strong>temin edebildi</strong>. Bu başarı hem kişisel <strong>yetkinliğ</strong>inden hem de azminden kaynaklandı. Şimdi ekibinin yenilik yapmasına <strong>imkan tanıyor</strong>. Gelecekte daha büyük zorlukların üstesinden <strong>gelebilecekler</strong>ine inanıyor.",
                "en": "Entrepreneur Deniz needed financial support for his project. Initially, he <strong>was unable</strong> to persuade investors. This situation created a <strong>disabling</strong> threat to his project. However, he didn't give up and <strong>was able</strong> to develop a new strategy. His detailed plan <strong>enabled</strong> investors to see the potential. Finally, he <strong>was able</strong> to secure the necessary funds. This success came from both his personal <strong>ability</strong> and determination. Now he <strong>is enabling</strong> his team to innovate. He believes they <strong>will be able</strong> to overcome greater challenges in the future."
            },
            "C1": {
                "tr": "Dilbilimci Profesör İdil, yetişkin dil edinimindeki sınırlamaları inceliyordu. Geleneksel görüş, yetişkin beyninin dil inceliklerini öğrenmekten <strong>yoksun</strong> olduğunu savunuyordu. İdil bu <strong>sınırlayıcı</strong> bakış açısını yetersiz buluyordu. Araştırması, bilişsel esnekliği artıran yöntemlerin bu görünürdeki <strong>yetersizliği</strong> nasıl <strong>ortadan kaldırabileceğini</strong> gösterdi. Doğru yaklaşımlar yetişkin öğrencilerin akıcılığa ulaşmalarını <strong>mümkün kılıyor</strong>du. '<strong>Yetenek</strong> statik değil, geliştirilebilir bir kapasitedir' diye savundu. Bir konferansta, 'Eski bir sistemi <strong>devre dışı bırakmak</strong>, daha kapsayıcı yeni sistemler inşa etmemizi <strong>sağlar</strong>' açıklamasını yaptı. Çalışması eğitim yöntemlerini yeniden şekillendirme <strong>potansiyeli</strong> taşıyordu.",
                "en": "Linguist Professor İdil was researching limitations in adult language acquisition. The traditional view claimed the adult brain was inherently <strong>unable</strong> to acquire linguistic subtleties. Idil found this <strong>disabling</strong> perspective inadequate. Her research showed how methods increasing cognitive flexibility could <strong>disable</strong> this apparent <strong>inability</strong>. Correct approaches <strong>enabled</strong> adult learners to achieve fluency. She argued, '<strong>Ability</strong> is not static but an expandable capacity.' At a conference, she stated, '<strong>Disabling</strong> an old system <strong>enables</strong> us to build more inclusive ones.' Her work <strong>had the ability</strong> to reshape educational methodologies."
            },
            "C2": {
                "tr": "Nörobilimci Dr. Alp, travma sonrası rehabilitasyonun sinirsel mekanizmalarını araştırıyordu. Hastası Efe, bir kaza sonrası yürüme <strong>yetisini</strong> kaybetmişti. Alp'ın ekibi, geliştirdikleri nöro-arayüzün beynin hasarlı bölgelerini atlatmasını <strong>sağlayabileceğini</strong> düşünüyordu. Ancak eski sinir yollarını tamamen <strong>devre dışı bırakmak</strong> riskliydi. Temel soru şuydu: Beynin uyum kapasitesi yeni bağlantılar oluşturmasına ne derece <strong>imkan tanıyacaktı</strong>? Terapi ilerledikçe, Efe bacaklarına minimal sinyaller <strong>gönderebildi</strong>. Bu küçük başarı, sistemin işlevselliğini kaybetmeden uyum <strong>sağlayabildiğinin</strong> kanıtıydı. Nihai hedef Efe'nin bağımsız yürüyebilmesini tamamen <strong>mümkün kılmaktı</strong>. Alp şöyle özetledi: '<strong>Yapabilmenin</strong> özü biyolojik bir lütuf değil, nöral plastisitenin ürünüdür. Bir <strong>yetersizliği etkisiz hale getirmek</strong>, mevcut potansiyeli <strong>kullanılabilir kılmaktır</strong>.' Bu çalışma, <strong>yetenek</strong> ve <strong>imkan tanıma</strong> kavramlarının sınırlarını yeniden tanımlıyordu.",
                "en": "Neuroscientist Dr. Alp was studying the neural mechanisms of post-trauma rehabilitation. His patient Efe had lost the <strong>ability</strong> to walk after an accident. Alp's team theorized their neuro-interface <strong>might be able to enable</strong> the brain to bypass damaged areas. However, <strong>to completely disable</strong> the old neural pathways was risky. The fundamental question was: To what extent would the brain's adaptive capacity <strong>enable</strong> it to form new connections? As therapy progressed, Efe <strong>was able</strong> to send minimal signals to his legs. This minor success proved the system <strong>was able</strong> to adapt without <strong>disabling</strong> its functionality. The ultimate goal was <strong>to fully enable</strong> Efe to walk independently. Alp concluded: 'The essence of <strong>being able</strong> is not biological grace but a product of neural plasticity. <strong>To disable a disability is to enable</strong> the existing potential.' This work was redefining the boundaries of <strong>ability</strong> and <strong>enabling</strong>."
            }
        }
    },
    {  // age
        "id": "1002-age", "word": "age",
        "meta": {
            "version": "2.2.0",
            "dictionary_type": "learner_advanced",
            "cefr_level": "A1",
            "frequency_rank": 120,
            "frequency_band": "High Frequency",
            "part_of_speech": ["noun", "verb"]
        },
        "phonetics": {
            "ipa_us": "/eɪdʒ/",
            "ipa_uk": "/eɪdʒ/",
            "audio_us": "/assets/audio/us/age.mp3",
            "audio_uk": "/assets/audio/uk/age.mp3",
            "syllabification": ["age"],
            "stress_data": {
                "pattern": "One Syllable",
                "primary_stress_index": 0
            }
        },
        "definitions": [
            {
                "sense_id": "def_1",
                "core_meaning_en": "the length of time that a person has lived or a thing has existed",
                "core_meaning_tr": "yaş, var olma süresi",
                "context_tags": ["general"],
                "grammar_pattern": "at the age of [number]",
                "example": {
                    "sentence": "He left home at the age of 18.",
                    "translation": "18 yaşında evden ayrıldı."
                }
            },
            {
                "sense_id": "def_2",
                "core_meaning_en": "a particular period of history",
                "core_meaning_tr": "çağ, devir, dönem",
                "context_tags": ["history", "academic"],
                "example": {
                    "sentence": "We live in the digital age.",
                    "translation": "Dijital çağda yaşıyoruz."
                }
            },
            {
                "sense_id": "def_3",
                "core_meaning_en": "to become older",
                "core_meaning_tr": "yaşlanmak, yıllanmak",
                "context_tags": ["verb"],
                "example": {
                    "sentence": "Stress ages you faster.",
                    "translation": "Stres seni daha hızlı yaşlandırır."
                }
            }
        ],
        "grammar_profile": {
            "structures": [
                {
                    "pattern": "at the age of X",
                    "usage_level": "Core",
                    "notes_tr": "Kesin bir yaştan bahsederken kullanılır. Sık yapılan hata: 'in the age of' (yanlış)."
                },
                {
                    "pattern": "act your age",
                    "usage_level": "Intermediate",
                    "notes_tr": "Emir kipi olarak: 'Yaşına göre davran (çocuklaşma)' anlamında."
                },
                {
                    "pattern": "age gracefully",
                    "usage_level": "Advanced",
                    "notes_tr": "Genelde 'iyi yaşlanmak', 'zamanla güzelleşmek' için kullanılan kalıptır."
                }
            ],
            "tense_logic": {
                "why_use_it": "Hem durum (noun) hem de süreç (verb) bildirebilir.",
                "critical_comparison": {
                    "context": "Age vs Grow up",
                    "rule": "'Age' biyolojik yaşlanmayı (hücresel) veya nesnelerin eskimini/yıllanmasını anlatır. 'Grow up' ise çocukluktan yetişkinliğe geçiş (büyümek) anlamındadır.",
                    "example_wrong": "My son is aging fast. (Çocuk büyüyor demek isterken yanlış)",
                    "example_right": "My son is growing up fast. (Doğru)"
                }
            }
        },
        "sentence_progression": {
            "description": "Kelimenin seviyelere göre kullanım karmaşıklığı",
            "levels": [
                {
                    "cefr": "A1",
                    "en": "What is your age?",
                    "tr": "Yaşınız kaç?",
                    "grammar_focus": "Basic Question"
                },
                {
                    "cefr": "A2",
                    "en": "People usually retire at the age of 65.",
                    "tr": "İnsanlar genellikle 65 yaşında emekli olur.",
                    "grammar_focus": "Preposition Phrase (at the age of)"
                },
                {
                    "cefr": "B1",
                    "en": "Wine usually improves as it ages.",
                    "tr": "Şarap genellikle yaşlandıkça (yıllandıkça) güzelleşir.",
                    "grammar_focus": "Verb Usage (aging)"
                },
                {
                    "cefr": "B2",
                    "en": "We are living in an age of rapid technological change.",
                    "tr": "Hızlı bir teknolojik değişim çağında yaşıyoruz.",
                    "grammar_focus": "Abstract Noun Usage (Era/Period)"
                },
                {
                    "cefr": "C1",
                    "en": "His face had aged visibly since the accident.",
                    "tr": "Kazadan beri yüzü gözle görülür şekilde yaşlanmıştı.",
                    "grammar_focus": "Past Perfect + Adverb"
                }
            ]
        },
        "morphology_tree": {
            "root": "aetatem (Latin)",
            "family_members": [
                { "word": "age", "pos": "n/v", "level": "A1", "note": "yaş, çağ; yaşlanmak" },
                { "word": "aged", "pos": "adj", "level": "B1", "note": "yaşlı, ... yaşındaki (middle-aged)" },
                { "word": "aging", "pos": "n/adj", "level": "B2", "note": "yaşlanma, yaşlanan" },
                { "word": "ageless", "pos": "adj", "level": "C1", "suffix": "-less", "note": "yaşsız, ebedi, hiç yaşlanmayan" },
                { "word": "ageism", "pos": "n", "level": "C2", "suffix": "-ism", "note": "yaş ayrımcılığı" }
            ]
        },
        "collocations": {
            "modifiers_adverbs": [
                {
                    "word": "advanced",
                    "turkish": "ileri",
                    "strength": "strong",
                    "example": "He died at an advanced age.",
                    "example_tr": "İleri bir yaşta vefat etti."
                },
                {
                    "word": "early",
                    "turkish": "erken",
                    "strength": "neutral",
                    "example": "She started reading at an early age.",
                    "example_tr": "Erken yaşta okumaya başladı."
                },
                {
                    "word": "tender",
                    "turkish": "henüz çok genç",
                    "strength": "literary",
                    "example": "He left home at the tender age of 14.",
                    "example_tr": "14 gibi henüz çok genç (körpe) bir yaşta evden ayrıldı."
                },
                {
                    "word": "middle",
                    "turkish": "orta",
                    "strength": "neutral",
                    "example": "Men in middle age often buy sports cars.",
                    "example_tr": "Orta yaştaki erkekler genelde spor araba alır."
                }
            ],
            "verbs_preceding": [
                {
                    "word": "reach",
                    "turkish": "ulaşmak, basmak",
                    "example": "When you reach the age of 18, you can vote.",
                    "example_tr": "18 yaşına bastığında oy kullanabilirsin."
                },
                {
                    "word": "look",
                    "turkish": "göstermek",
                    "example": "She doesn't look her age at all.",
                    "example_tr": "Hiç yaşını göstermiyor."
                },
                {
                    "word": "feel",
                    "turkish": "hissetmek",
                    "example": "I'm starting to feel my age.",
                    "example_tr": "Yaşlandığımı (yaşımı) hissetmeye başlıyorum."
                }
            ]
        },
        "lexical_nuance": {
            "synonym_scale": {
                "concept": "Time Period / Era",
                "turkishConcept": "Zaman Dilimi / Çağ",
                "description": "Zaman dilimlerini ifade eden kelimelerin kapsam sıralaması",
                "scale": [
                    {
                        "word": "period",
                        "value": 3,
                        "turkish": "dönem",
                        "note": "Belirli bir süre",
                        "usage": "General: 'a difficult period'",
                        "description_tr": "Kısa veya uzun, başlangıcı ve sonu olan herhangi bir zaman dilimi.",
                        "example_en": "The post-war period was difficult.",
                        "example_tr": "Savaş sonrası dönem zordu.",
                        "example": "a short period of time",
                        "strength": "Genel"
                    },
                    {
                        "word": "age",
                        "value": 6,
                        "turkish": "çağ",
                        "note": "Kültürel/Tarihi bütünlük",
                        "usage": "Historical: 'The Iron Age'",
                        "description_tr": "Belirgin karakteristik özellikleri (teknoloji, kültür vb.) olan uzun tarihsel dönem.",
                        "example_en": "We live in the information age.",
                        "example_tr": "Bilgi çağında yaşıyoruz.",
                        "example": "The Bronze Age",
                        "strength": "Orta"
                    },
                    {
                        "word": "era",
                        "value": 8,
                        "turkish": "devir",
                        "note": "Köklü değişimle başlayan dönem",
                        "usage": "Grand: 'A new era of exploration'",
                        "description_tr": "Genellikle önemli bir olay, kişi veya değişimle başlayan yeni ve farklı bir düzen.",
                        "example_en": "The fall of the wall marked the end of an era.",
                        "example_tr": "Duvarın yıkılışı bir devrin sonunu işaret ediyordu.",
                        "example": "The Victorian Era",
                        "strength": "Güçlü"
                    },
                    {
                        "word": "epoch",
                        "value": 10,
                        "turkish": "epok",
                        "note": "Jeolojik/Evrensel dönem",
                        "usage": "Scientific: 'The Holocene Epoch'",
                        "description_tr": "Jeolojide veya tarihte çok köklü, geri döndürülemez değişimlerin olduğu çok uzun dönem.",
                        "example_en": "This discovery marked a new epoch in medicine.",
                        "example_tr": "Bu keşif tıpta yeni bir çığır (epok) açtı.",
                        "example": "A new epoch in history",
                        "strength": "Akademik"
                    }
                ]
            },
            "antonyms": [
                {
                    "word": "youth",
                    "value": 8,
                    "turkish": "gençlik",
                    "note": "Yaşlılığın karşıtı",
                    "description_tr": "Gençlik dönemi, tazelik.",
                    "example_en": "She wants to recapture her youth.",
                    "example_tr": "Gençliğini yeniden yakalamak istiyor."
                },
                {
                    "word": "childhood",
                    "value": 6,
                    "turkish": "çocukluk",
                    "note": "Yetişkinliğin karşıtı",
                    "description_tr": "Çocuk olma evresi.",
                    "example_en": "He had a happy childhood.",
                    "example_tr": "Mutlu bir çocukluğu vardı."
                }
            ]
        },
        "pragmatics": {
            "idioms_and_phrases": [
                {
                    "phrase": "act your age",
                    "meaning_tr": "yaşına göre davran, çocuklaşma",
                    "register": "informal/command",
                    "example": "Stop crying and act your age!",
                    "example_tr": "Ağlamayı kes ve yaşına göre davran!"
                },
                {
                    "phrase": "come of age",
                    "meaning_tr": "reşit olmak, rüştünü ispatlamak",
                    "register": "neutral",
                    "example": "The movie is a coming-of-age story.",
                    "example_tr": "Film, bir olgunlaşma (büyüme) hikayesidir."
                },
                {
                    "phrase": "age is just a number",
                    "meaning_tr": "yaş sadece bir sayıdır",
                    "register": "cliché",
                    "example": "She started running at 70; age is just a number.",
                    "example_tr": "70'inde koşmaya başladı; yaş sadece bir sayıdır."
                }
            ]
        },
        "cultural_context": {
            "register": {
                "level": "neutral",
                "description": "'Age' kelimesi nötrdür. Ancak insanlardan bahsederken 'old' demek yerine 'elderly' veya 'senior' demek nezaket gereğidir."
            },
            "inclusive_language": {
                "title": "Yaş Ayrımcılığı (Ageism)",
                "content": "Batı kültüründe, özellikle kadınlara 'How old are you?' diye sormak kabalık (rude) sayılabilir. Bunun yerine dolaylı yollar tercih edilir veya konu açılmaz."
            },
            "grammar_nuance": {
                "title": "Age vs Grow",
                "content": "'Aging' biyolojik yıpranmayı veya şarap gibi olgunlaşmayı ifade eder. 'Growing up' ise çocukluktan yetişkinliğe geçişi (büyümeyi) anlatır."
            },
            "business_english": {
                "title": "İş Dünyası Terimleri",
                "content": "'Retirement age' (emeklilik yaşı) ve 'working-age population' (çalışma çağındaki nüfus) ekonomi haberlerinin vazgeçilmez terimleridir.",
                "keywords": ["retirement age", "working-age"]
            },
            "trivia": {
                "title": "Middle Age Değişimi",
                "content": "Eskiden 40 yaş 'middle age' (orta yaş) kabul edilirken, insan ömrü uzadığı için artık 50'ler hatta 60'lar 'new middle age' olarak anılmaktadır."
            }
        },
        "exam_strategies": {
            "frequency": {
                "yds": 90,
                "yokdil": 95,
                "ydt": 85,
                "description": "ÖSYM sınavlarında hem okuma parçalarında (tarihsel çağlar) hem kelime sorularında (insan yaşı) çok sık çıkar."
            },
            "vocabulary": [
                {
                    "title": "Edat (Preposition): AT",
                    "content": "Bir eylemin kaç yaşında yapıldığını anlatırken '<b>AT</b> the age of...' kalıbı kullanılır. 'In the age' bu bağlamda hatalıdır."
                },
                {
                    "title": "Kelime Ayrımı: Era vs Age",
                    "content": "Soruda jeolojik veya çok uzun bir dönemden (Buzul çağı gibi) bahsediyorsa 'Age' veya 'Epoch' uygundur. Politik veya kültürel bir dönemse 'Era' (Reagan Era) seçilebilir."
                }
            ],
            "grammar": [
                {
                    "title": "Fiil Olarak Age",
                    "content": "Parçada 'The population is aging' (Nüfus yaşlanıyor) cümlesindeki 'aging' fiildir. Genellikle continuous tense ile kullanılır."
                },
                {
                    "title": "Sıfat Tamlaması Kuralı",
                    "content": "'A five-year-old child' yapısında 'years' kelimesi çoğul eki (-s) ALMAZ. Bu klasik bir gramer tuzağıdır."
                }
            ],
            "reading": [
                {
                    "title": "Demografi Metinleri",
                    "content": "YÖKDİL Sosyal ve Sağlık metinlerinde 'Aging population' (Yaşlanan nüfus) konusu çok popülerdir. 'Silver economy' (Gümüş/Yaşlı ekonomisi) terimine aşina olun."
                }
            ]
        },
        "morphology_tree": {
            "root": "aetatem (Latin)",
            "family_members": [
                { "word": "age", "pos": "n/v", "level": "A1", "note": "yaş, çağ; yaşlanmak" },
                { "word": "aged", "pos": "adj", "level": "B1", "note": "yaşlı, ... yaşındaki (middle-aged)" },
                { "word": "aging", "pos": "n/adj", "level": "B2", "note": "yaşlanma, yaşlanan nüfus" },
                { "word": "ageless", "pos": "adj", "level": "C1", "suffix": "-less", "note": "yaşsız, ebedi, hiç yaşlanmayan" },
                { "word": "ageism", "pos": "n", "level": "C2", "suffix": "-ism", "note": "yaş ayrımcılığı" }
            ]
        },
        "pedagogy_engine": {
            "common_errors": [
                {
                    "error_id": "err_have_age",
                    "incorrect": "I have 25 years.",
                    "correction": "I am 25 years old.",
                    "explanation": "Türkçe mantığıyla 'sahip olmak' (have) kullanılmaz, 'olmak' (be) kullanılır."
                },
                {
                    "error_id": "err_noun_adj",
                    "incorrect": "a twenty-years-old man",
                    "correction": "a twenty-year-old man",
                    "explanation": "Sıfat tamlaması yaparken araya tire girince 'year' -s eki almaz."
                }
            ],
            "exam_prep": {
                "ielts_tag": "Vocabulary",
                "tip": "Writing Task 2'de 'old people' yerine 'people of advanced age' veya 'the elderly' kullanmak daha akademik görünür.",
                "keywords": ["elderly", "senior citizens", "adolescent"]
            }
        },
        "word_journey": {
            "timeline": [
                { "era": "Latin", "word": "aetatem", "meaning": "period of life, age" },
                { "era": "Old French", "word": "aage/eage", "meaning": "age, life" },
                { "era": "Middle English", "word": "age", "meaning": "time of life" }
            ],
            "turkish_cognate_hint": {
                "word": "Ebedi / Ezel",
                "connection_type": "Distant Conceptual",
                "story": "İngilizce 'Age' (Çağ/Yaş) kelimesinin kökü Latince 'aevum' (çağ) kelimesine dayanır. 'Age of Empires' oyunundaki çağ atlama mantığını düşünebilirsiniz. Ayrıca 'Ağaç' kelimesindeki **A-G-Ç** sesleri ile 'Age' kelimesi arasında kodlama yapabilirsiniz: Ağaçların yaşı halkalarla sayılır.",
                "example": "Ağaç -> Age (Yaş/Çağ)",
                "example2": "Age of Empires -> Çağlar"
            }
        },
        "stories": {
            "A1": {
                "tr": "Benim adım Ali. Ben 10 <strong>yaşındayım</strong>. Babam 40 <strong>yaşında</strong>. O çok <strong>yaşlı</strong> değil. Bizim evimiz eski. Onun <strong>yaş</strong>ı 100. Ben okulu seviyorum. Okulda benimle aynı <strong>yaş</strong>ta çok arkadaşım var.",
                "en": "My name is Ali. I am 10 years of <strong>age</strong> (old). My father is 40 years of <strong>age</strong>. He is not very <strong>old</strong>. Our house is old. Its <strong>age</strong> is 100. I love school. I have many friends of the same <strong>age</strong> at school."
            },
            "A2": {
                "tr": "Dedemlerin köyünde büyük bir ağaç var. Kimse onun tam <strong>yaşını</strong> bilmiyor. Babam, 'Bu ağaç benimle aynı <strong>yaşta</strong>' diyor. Ama ağaç çok daha büyük görünüyor. Köydeki insanlar uzun zaman önce bu ağacın altında toplanırmış. O zamanlar farklı bir <strong>çağ</strong>dı. Teknoloji yoktu ama insanlar mutluydu.",
                "en": "There is a big tree in my grandfather's village. Nobody knows its exact <strong>age</strong>. My father says, 'This tree is the same <strong>age</strong> as me.' But the tree looks much bigger. People in the village used to gather under this tree long ago. That was a different <strong>age</strong>. There was no technology, but people were happy."
            },
            "B1": {
                "tr": "Orta <strong>yaşa</strong> gelmek ilginç bir deneyim. Annem her zaman '<strong>Yaş</strong> sadece bir sayıdır' der. Ama geçen yıl cildinin <strong>yaşlandığını</strong> fark etmeye başladı. Aynaya baktı ve 'Sanırım yaşlanıyorum' dedi. Ben ona 'Harika görünüyorsun, <strong>yaşlanmak</strong> doğal bir süreç' dedim. Önemli olan kaç yaşında olduğun değil, nasıl hissettiğindir.",
                "en": "Reaching middle <strong>age</strong> is an interesting experience. My mother always says, '<strong>Age</strong> is just a number.' But last year, she started to notice her skin <strong>aging</strong>. She looked in the mirror and said, 'I think I am getting old.' I told her, 'You look great, <strong>aging</strong> is a natural process.' What matters is not what <strong>age</strong> you are, but how you feel."
            },
            "B2": {
                "tr": "Modern tıp sayesinde ortalama yaşam süresi artıyor. Artık insanlar çok ileri bir <strong>yaşa</strong> kadar aktif kalabiliyorlar. Ancak, toplumumuzda hala <strong>yaş ayrımcılığı</strong> var. Bazı şirketler belirli bir <strong>yaşın</strong> üzerindeki insanları işe almak istemiyor. Bu adil değil. Deneyim <strong>yaşla</strong> gelir. <strong>Bilgi çağı</strong>nda, deneyimli insanların bilgeliğine her zamankinden daha çok ihtiyacımız var.",
                "en": "Thanks to modern medicine, life expectancy is increasing. Now people can remain active until a very advanced <strong>age</strong>. However, there is still <strong>ageism</strong> in our society. Some companies do not want to hire people over a certain <strong>age</strong>. This is not fair. Experience comes with <strong>age</strong>. In the <strong>information age</strong>, we need the wisdom of experienced people more than ever."
            },
            "C1": {
                "tr": "Şarap uzmanı, mahzeni gezdirirken yıllanma sürecini anlattı. 'Bu şarap,' dedi, 'meşe fıçılarda zarafetle <strong>yaşlandı</strong>.' Şarabın <strong>yaşlanma</strong> potansiyeli, üzümün kalitesine bağlıdır. Bazı şaraplar gençken içilmelidir, bazıları ise olgunlaşmak için zamana ihtiyaç duyar. Tıpkı insanlar gibi, bazı karakterler zamanla, yani <strong>yaşla</strong> birlikte derinleşir ve karmaşıklaşır. Bu <strong>zamansız</strong> (ageless) bir gerçektir.",
                "en": "The wine expert explained the maturation process while touring the cellar. 'This wine,' he said, 'has <strong>aged</strong> gracefully in oak barrels.' The <strong>aging</strong> potential of a wine depends on the quality of the grape. Some wines should be drunk young, while others need time to mature. Just like people, some characters deepen and become complex with time, that is, with <strong>age</strong>. This is an <strong>ageless</strong> truth."
            },
            "C2": {
                "tr": "Antropoloji profesörü, insanlık tarihini 'Masumiyet <strong>Çağı</strong>' ve 'Deneyim <strong>Çağı</strong>' olarak ikiye ayırdı. Medeniyetimizin teknolojik olarak <strong>reşit olduğunu</strong> (came of age), ancak ahlaki olarak hala emekleme döneminde olduğunu savundu. 'Nükleer <strong>çağ</strong>,' diye uyardı, 'çocukça dürtülerle yönetilemeyecek kadar tehlikeli.' Ona göre, türümüzün hayatta kalması, bilgeliğimizin teknolojimizle aynı hızda <strong>olgunlaşması</strong>na (maturing/aging) bağlıydı. Aksi takdirde, kendi yarattığımız bu <strong>çağın</strong> kurbanı olabiliriz.",
                "en": "The anthropology professor divided human history into the '<strong>Age</strong> of Innocence' and the '<strong>Age</strong> of Experience.' He argued that our civilization technically <strong>came of age</strong>, but morally remains in infancy. 'The nuclear <strong>age</strong>,' he warned, 'is too dangerous to be governed by childish impulses.' According to him, the survival of our species depends on our wisdom <strong>aging</strong> (maturing) at the same pace as our technology. Otherwise, we might become victims of this very <strong>age</strong> we created."
            }
        }
    },
    {  // album
        "id": "1003-album", "word": "album",
        "meta": {
            "version": "2.2.0",
            "dictionary_type": "learner_advanced",
            "cefr_level": "A2",
            "frequency_rank": 850,
            "frequency_band": "High Frequency",
            "part_of_speech": ["noun"]
        },
        "phonetics": {
            "ipa_us": "/ˈæl.bəm/",
            "ipa_uk": "/ˈæl.bəm/",
            "audio_us": "/assets/audio/us/album.mp3",
            "audio_uk": "/assets/audio/uk/album.mp3",
            "syllabification": ["al", "bum"],
            "stress_data": {
                "pattern": "Trochee (Strong-Weak)",
                "primary_stress_index": 0
            }
        },
        "definitions": [
            {
                "sense_id": "def_1",
                "core_meaning_en": "a collection of music recordings issued as a single item",
                "core_meaning_tr": "müzik albümü",
                "context_tags": ["music", "art"],
                "example": {
                    "sentence": "The band released their debut album yesterday.",
                    "translation": "Grup dün ilk albümünü yayınladı."
                }
            },
            {
                "sense_id": "def_2",
                "core_meaning_en": "a book with blank pages for holding photos, stamps, etc.",
                "core_meaning_tr": "fotoğraf/pul albümü",
                "context_tags": ["memory", "physical"],
                "example": {
                    "sentence": "She showed me her wedding album.",
                    "translation": "Bana düğün albümünü gösterdi."
                }
            }
        ],
        "grammar_profile": {
            "structures": [
                {
                    "pattern": "release/drop an album",
                    "usage_level": "Core",
                    "notes_tr": "Müzik bağlamında en sık kullanılan fiillerdir. 'Drop' daha sokak ağzıdır (slang/informal)."
                },
                {
                    "pattern": "on the album",
                    "usage_level": "Intermediate",
                    "notes_tr": "Bir şarkının albümde olduğunu söylerken 'in' değil 'on' edatı kullanılır. (e.g., 'The best song ON the album')."
                }
            ],
            "tense_logic": {
                "why_use_it": "Sayılabilir (countable) bir isimdir.",
                "critical_comparison": {
                    "context": "Album vs Record",
                    "rule": "'Record' hem tekil şarkı (single) hem de albüm anlamına gelebilir. 'Album' ise her zaman bir koleksiyonu/bütünlüğü ifade eder.",
                    "example_wrong": "I bought a new album featuring just one song. (Genelde yanlış)",
                    "example_right": "I bought a new single. (Doğru)"
                }
            }
        },
        "sentence_progression": {
            "description": "Kelimenin seviyelere göre kullanım karmaşıklığı",
            "levels": [
                {
                    "cefr": "A1",
                    "en": "This is my photo album.",
                    "tr": "Bu benim fotoğraf albümüm.",
                    "grammar_focus": "Demonstrative Pronoun"
                },
                {
                    "cefr": "A2",
                    "en": "I bought a new music album yesterday.",
                    "tr": "Dün yeni bir müzik albümü aldım.",
                    "grammar_focus": "Past Simple"
                },
                {
                    "cefr": "B1",
                    "en": "Have you heard the third track on this album?",
                    "tr": "Bu albümdeki üçüncü parçayı duydun mu?",
                    "grammar_focus": "Present Perfect / Preposition 'on'"
                },
                {
                    "cefr": "B2",
                    "en": "The artist's latest album experiments with jazz influences.",
                    "tr": "Sanatçının son albümü caz etkileşimleri ile deneyler yapıyor.",
                    "grammar_focus": "Subject-Verb Agreement"
                },
                {
                    "cefr": "C1",
                    "en": "Critics praised the album for its cohesive narrative structure.",
                    "tr": "Eleştirmenler, albümü bütünlüklü anlatı yapısı nedeniyle övdü.",
                    "grammar_focus": "Academic vocabulary (cohesive, narrative)"
                }
            ]
        },
        "morphology_tree": {
            "root": "albus (Latin 'White')",
            "family_members": [
                { "word": "album", "pos": "n", "level": "A2", "note": "beyaz tablet -> liste -> albüm" },
                { "word": "albino", "pos": "n/adj", "level": "C1", "note": "renk pigmenti olmayan, beyaz" },
                { "word": "albumen", "pos": "n", "level": "C2", "note": "yumurta akı (beyazı)" },
                { "word": "albedo", "pos": "n", "level": "C2", "note": "yüzeyin ışığı yansıtma gücü (beyazlık derecesi)" }
            ]
        },
        "collocations": {
            "modifiers_adverbs": [
                {
                    "word": "debut",
                    "turkish": "ilk çıkış",
                    "strength": "strong",
                    "example": "Their debut album sold millions.",
                    "example_tr": "İlk (çıkış) albümleri milyonlar sattı."
                },
                {
                    "word": "solo",
                    "turkish": "solo, bireysel",
                    "strength": "strong",
                    "example": "The guitarist released a solo album.",
                    "example_tr": "Gitarist solo bir albüm çıkardı."
                },
                {
                    "word": "instrumental",
                    "turkish": "enstrümantal (sözsüz)",
                    "strength": "neutral",
                    "example": "an instrumental album",
                    "example_tr": "sözsüz (enstrümantal) bir albüm"
                },
                {
                    "word": "platinum",
                    "turkish": "platin (çok satan)",
                    "strength": "colloquial",
                    "example": "The album went platinum in a week.",
                    "example_tr": "Albüm bir haftada platin (satış rekoru) oldu."
                }
            ],
            "verbs_preceding": [
                {
                    "word": "release",
                    "turkish": "piyasaya sürmek",
                    "example": "They will release the album in May.",
                    "example_tr": "Albümü Mayıs'ta çıkaracaklar."
                },
                {
                    "word": "record",
                    "turkish": "kaydetmek",
                    "example": "The band is recording a new album in London.",
                    "example_tr": "Grup Londra'da yeni bir albüm kaydediyor."
                },
                {
                    "word": "dedicate",
                    "turkish": "ithaf etmek",
                    "example": "He dedicated the album to his late mother.",
                    "example_tr": "Albümü merhum annesine ithaf etti."
                }
            ]
        },
        "lexical_nuance": {
            "synonym_scale": {
                "concept": "Music Collection Formats",
                "turkishConcept": "Müzik Formatları",
                "description": "Müzik yayın formatlarının kapsam sıralaması",
                "scale": [
                    {
                        "word": "single",
                        "value": 2,
                        "turkish": "tekli",
                        "note": "Tek şarkılık çıkış",
                        "usage": "Radio hit",
                        "description_tr": "Genellikle albümden önce yayınlanan ve radyolarda çalınan tek şarkıdır.",
                        "example_en": "They released the first single from the album.",
                        "example_tr": "Albümden çıkan ilk single'ı yayınladılar.",
                        "strength": "Kısa"
                    },
                    {
                        "word": "EP",
                        "value": 4,
                        "turkish": "kısa çalar",
                        "note": "Extended Play (4-6 şarkı)",
                        "usage": "Indie bands: 'A 5-track EP'",
                        "description_tr": "Single'dan uzun ama albümden kısa (genelde 4-6 şarkılık) kayıttır.",
                        "example_en": "The band recorded a 5-track EP.",
                        "example_tr": "Grup 5 şarkılık bir EP kaydetti.",
                        "strength": "Orta"
                    },
                    {
                        "word": "album",
                        "value": 7,
                        "turkish": "albüm",
                        "note": "LP (Long Play), tam uzunlukta",
                        "usage": "Standard release (10+ songs)",
                        "description_tr": "Sanatçının 10-15 şarkıdan oluşan standart uzunluktaki ana çalışmasıdır.",
                        "example_en": "Her new album has 12 songs.",
                        "example_tr": "Yeni albümünde 12 şarkı var.",
                        "strength": "Standart"
                    },
                    {
                        "word": "compilation",
                        "value": 8,
                        "turkish": "derleme",
                        "note": "Farklı sanatçılar veya hit şarkılar",
                        "usage": "Greatest Hits",
                        "description_tr": "En sevilen şarkıların veya farklı sanatçıların şarkılarının toplandığı albümdür.",
                        "example_en": "They bought a compilation of 80s hits.",
                        "example_tr": "80'lerin hitlerinden oluşan bir derleme aldılar.",
                        "strength": "Toplama"
                    },
                    {
                        "word": "discography",
                        "value": 10,
                        "turkish": "diskografi",
                        "note": "Bir sanatçının tüm eserleri",
                        "usage": "Entire career",
                        "description_tr": "Bir sanatçının kariyeri boyunca çıkardığı tüm albümlerin bütünüdür.",
                        "example_en": "I have the band's entire discography.",
                        "example_tr": "Grubun tüm diskografisine sahibim.",
                        "strength": "Bütüncül"
                    }
                ]
            },
            "antonyms": []
        },
        "pragmatics": {
            "idioms_and_phrases": [
                {
                    "phrase": "family album",
                    "meaning_tr": "aile albümü (fotoğraf)",
                    "register": "general",
                    "example": "We looked through the old family album.",
                    "example_tr": "Eski aile albümüne göz attık."
                },
                {
                    "phrase": "concept album",
                    "meaning_tr": "kavramsal albüm (bir hikaye anlatan)",
                    "register": "music",
                    "example": "Pink Floyd is famous for concept albums.",
                    "example_tr": "Pink Floyd konsept albümleriyle ünlüdür."
                }
            ],
            "sociolinguistics": {
                "topic": "Vinyl Revival",
                "note_en": "Referring to an album as a 'record' or 'LP' has become trendy again due to the resurgence of vinyl. The 'Album Experience' (listening start-to-finish) is valued by audiophiles.",
                "note_tr": "Plakların (vinyl) geri dönüşüyle 'record' kelimesi tekrar popüler oldu. Odyofiller albümü baştan sona dinleme deneyimine önem verir."
            }
        },
        "cultural_context": {
            "register": {
                "level": "neutral",
                "description": "Genel kullanım."
            },
            "inclusive_language": null,
            "grammar_nuance": {
                "title": "On vs In",
                "content": "Bir şarkının albümde olduğunu söylerken 'ON the album' denir. Kitapta (IN the book) mantığından farklıdır. Çünkü albüm bir yüzey (disk) formatıdır."
            },
            "business_english": {
                "title": "Success Terms",
                "content": "'Go Gold' (Altın Plak) ve 'Go Platinum' (Platin Plak) terimleri albüm satış başarısını gösterir."
            },
            "trivia": {
                "title": "Beyaz Sayfalar",
                "content": "'Album' kelimesi Latincede 'beyaz tablet' (albus) anlamına gelir. Roma'da üzerine duyuruların yazıldığı beyaz tahtalardı, zamanla 'boş kitap/koleksiyon' anlamına evrildi."
            }
        },
        "exam_strategies": {
            "frequency": {
                "yds": 55,
                "yokdil": 50,
                "ydt": 75,
                "description": "Daha çok YDT (Dil Sınavı) ve sanat/sosyal içerikli YDS metinlerinde çıkar."
            },
            "vocabulary": [
                {
                    "title": "Preposition Tuzağı (ON)",
                    "content": "Sınavda 'The best song ___ the album' sorulursa 'ON' seçin. 'In' çeldiricisidir."
                },
                {
                    "title": "Fiil Seçimi: Release",
                    "content": "Kitaplar 'publish', albümler 'release' edilir. Film ve albüm için 'release' (salmak/yayınlamak) kullanılır."
                }
            ],
            "grammar": [],
            "reading": [
                {
                    "title": "Debut (İlk Çıkış)",
                    "content": "Parçada 'their debut album' ifadesi geçiyorsa, bu o sanatçının kariyerinin başlagıcıdır. Kronoloji sorularında 'first work' şıkkını arayın."
                }
            ]
        },
        "morphology_tree": {
            "root": "albus (Latin 'White')",
            "family_members": [
                { "word": "album", "pos": "n", "level": "A2", "note": "beyaz tablet -> koleksiyon defteri -> müzik albümü" },
                { "word": "albino", "pos": "n/adj", "level": "C1", "note": "renk pigmenti olmayan, beyaz tenli canlı" },
                { "word": "albumen", "pos": "n", "level": "C2", "note": "yumurta akı (beyaz kısmı)" },
                { "word": "albedo", "pos": "n", "level": "C2", "note": "yüzeyin ışığı yansıtma gücü (beyazlık oranı)" }
            ]
        },
        "pedagogy_engine": {
            "common_errors": [
                {
                    "error_id": "err_prep_in_on",
                    "incorrect": "My favorite song is in this album.",
                    "correction": "My favorite song is on this album.",
                    "explanation": "Mesafe/yüzey mantığıyla: Şarkılar diskin/kaydın 'üzerine' (on) işlenir."
                }
            ],
            "exam_prep": {
                "ielts_tag": "Arts & Media",
                "tip": "Speaking sınavında 'I prefer listening to full albums rather than shuffled playlists' demek, sanatsal bütülüğe verdiğiniz önemi gösteren kaliteli bir cümledir.",
                "keywords": ["tracklist", "cover art", "lyrics"]
            },
            "gamification": {
                "challenge_type": "association",
                "question": "Which word does NOT belong?",
                "answer": "Novel",
                "distractors": ["EP", "Track", "Single", "Novel"]
            }
        },
        "word_journey": {
            "timeline": [
                { "era": "Latin", "word": "albus", "meaning": "white" },
                { "era": "Roman Empire", "word": "album", "meaning": "blank white tablet for notices" },
                { "era": "17th Century", "word": "album", "meaning": "blank book for autographs/collection" },
                { "era": "20th Century", "word": "album", "meaning": "collection of phonograph records" }
            ],
            "turkish_cognate_hint": {
                "word": "Albino",
                "connection_type": "Direct Root",
                "story": "Latincede 'Albus' BEYAZ demektir. Türkçedeki 'Albino' (beyaz tenli) buradan gelir. 'Albüm' de aslında içi boş, BEYAZ sayfalı defter demektir. Fotoğraflar bu beyazlığın üzerine yapıştırılır.",
                "example": "Albus Dumbledore -> İsmi 'Beyaz' (iyilik/ak sakal) demektir."
            }
        },
        "stories": {
            "A1": {
                "tr": "Bu benim evim. Oturma odasında eski bir kitap var. Bu bir fotoğraf <strong>albüm</strong>ü. İçinde ailemin resimleri var. Annem ve babam genç görünüyor. Ben de bebek gibiyim. <strong>Albüm</strong>e bakmayı seviyorum. O beni mutlu ediyor.",
                "en": "This is my house. There is an old book in the living room. It is a photo <strong>album</strong>. There are pictures of my family in it. My mother and father look young. I look like a baby too. I like looking at the <strong>album</strong>. It makes me happy."
            },
            "A2": {
                "tr": "Dün bir müzik mağazasına gittim. En sevdiğim şarkıcı yeni bir <strong>albüm</strong> çıkardı (released). <strong>Albüm</strong>ün adı 'Mavi Gökyüzü'. İçinde on şarkı var. CD'yi aldım ve eve koştum. Hemen dinledim. <strong>Albümdeki</strong> (on the album) tüm şarkılar harika.",
                "en": "Yesterday I went to a music store. My favorite singer released a new <strong>album</strong>. The name of the <strong>album</strong> is 'Blue Sky'. There are ten songs in it. I bought the CD and ran home. I listened to it immediately. All the songs <strong>on the album</strong> are great."
            },
            "B1": {
                "tr": "Dijital müzikten önce insanlar fiziksel <strong>albüm</strong>ler biriktirirdi. Babamın büyük bir plak (vinyl) koleksiyonu var. Her bir <strong>albüm</strong>ün güzel bir kapağı var. Hafta sonları bir <strong>albüm</strong> seçer ve baştan sona dinleriz. Şarkıları atlamayız. Bu, sadece bir şarkı dinlemekten farklı bir duygu.",
                "en": "Before digital music, people used to collect physical <strong>albums</strong>. My father has a large vinyl collection. Each <strong>album</strong> has a beautiful cover. On weekends, we choose an <strong>album</strong> and listen to it from start to finish. We don't skip songs. This is a different feeling from just listening to a single song."
            },
            "B2": {
                "tr": "1960'larda Beatles, müzik endüstrisini değiştirdi. Sadece popüler şarkılar (singles) yayınlamak yerine, 'konsept <strong>albüm</strong>' fikrine odaklandılar. Bir <strong>albüm</strong>, birbirine bağlı şarkılardan oluşan bir hikaye gibiydi. 'Sgt. Pepper' buna en iyi örnektir. Sanatçılar <strong>albüm</strong> formatını kullanarak daha derin duygular ifade etmeye başladılar.",
                "en": "In the 1960s, The Beatles changed the music industry. Instead of just releasing popular singles, they focused on the idea of the 'concept <strong>album</strong>'. An <strong>album</strong> was like a story made of connected songs. 'Sgt. Pepper' is the best example of this. Artists started to express deeper emotions using the <strong>album</strong> format."
            },
            "C1": {
                "tr": "Günümüz yayın (streaming) çağında, <strong>albüm</strong> formatının bütünlüğü tehdit altında. Dinleyiciler genellikle seçkiler (playlist) oluşturarak parçaları bağlamından koparıyor. Sanatçılar, dinleyicinin dikkatini 45 dakika boyunca tutacak uyumlu bir <strong>albüm</strong> yaratmakta zorlanıyor. Yine de, birçok eleştirmen <strong>albüm</strong>ün sanatsal ifadenin zirvesi olarak kalması gerektiğini savunuyor; tıpkı bir romanın bölümleri gibi, parçalar bir bütünü oluşturmalı.",
                "en": "In today's streaming era, the integrity of the <strong>album</strong> format is under threat. Listeners often create playlists, tearing tracks out of their context. Artists struggle to create a cohesive <strong>album</strong> that holds the listener's attention for 45 minutes. Nevertheless, many critics argue that the <strong>album</strong> must remain the pinnacle of artistic expression; just like chapters in a novel, the tracks should constitute a whole."
            },
            "C2": {
                "tr": "Dijital parçalanma, '<strong>albüm</strong>ün ölümü' tartışmalarını alevlendirdi. Ancak bu kehanet henüz gerçekleşmedi. Aksine, vinil plakların yeniden dirilişi, somut, dokunsal ve küratörlüğü yapılmış bir deneyime duyulan özlemi kanıtlıyor. Bir <strong>albüm</strong>ü kapağından şarkı sıralamasına kadar bir sanat eseri (artifact) olarak deneyimlemek, algoritma tabanlı tüketimin yüzeyselliğine bir başkaldırıdır. Bu bağlamda <strong>albüm</strong>, sadece bir depolama birimi değil, kültürel bir direnç sembolüdür.",
                "en": "Digital fragmentation has fueled debates about the 'death of the <strong>album</strong>'. However, this prophecy has not yet materialized. On the contrary, the resurrection of vinyl proves the longing for a tangible, tactile, and curated experience. Experiencing an <strong>album</strong> as an artifact, from its cover art to its track sequencing, is a rebellion against the superficiality of algorithm-based consumption. In this context, the <strong>album</strong> is not merely a storage unit, but a symbol of cultural resistance."
            }
        }
    },
    {  // alcohol
        "id": "1004-alcohol", "word": "alcohol",
        "meta": {
            "version": "2.2.0",
            "dictionary_type": "learner_advanced",
            "cefr_level": "B1",
            "frequency_rank": 1500,
            "frequency_band": "Medium Frequency",
            "part_of_speech": ["noun"]
        },
        "phonetics": {
            "ipa_us": "/ˈæl.kə.hɑːl/",
            "ipa_uk": "/ˈæl.kə.hɒl/",
            "audio_us": "/assets/audio/us/alcohol.mp3",
            "audio_uk": "/assets/audio/uk/alcohol.mp3",
            "syllabification": ["al", "co", "hol"],
            "stress_data": {
                "pattern": "Dactyl (Strong-Weak-Weak)",
                "primary_stress_index": 0
            }
        },
        "definitions": [
            {
                "sense_id": "def_1",
                "core_meaning_en": "drinks such as wine, beer, or spirits",
                "core_meaning_tr": "alkol, alkollü içki",
                "context_tags": ["beverage", "social"],
                "example": {
                    "sentence": "He doesn't drink alcohol for religious reasons.",
                    "translation": "Dini nedenlerle alkol kullanmıyor."
                }
            },
            {
                "sense_id": "def_2",
                "core_meaning_en": "a chemical substance used as fuel or in medicine",
                "core_meaning_tr": "ispirto, etil alkol (kimyasal)",
                "context_tags": ["chemistry", "medical"],
                "example": {
                    "sentence": "Use alcohol to clean the wound.",
                    "translation": "Yarayı temizlemek için alkol kullanın."
                }
            }
        ],
        "grammar_profile": {
            "structures": [
                {
                    "pattern": "uncountable noun",
                    "usage_level": "Core",
                    "notes_tr": "Genellikle sayılamaz (-s almaz). 'Two alcohols' denmez, 'two types of alcohol' denir."
                },
                {
                    "pattern": "alcohol-free",
                    "usage_level": "Intermediate",
                    "notes_tr": "Sıfat olarak: 'alkolsüz' (ör: alcohol-free beer)."
                }
            ],
            "tense_logic": {
                "why_use_it": "Kimyasal madde veya içecek kategorisi olarak.",
                "critical_comparison": {
                    "context": "Alcohol vs Drink/Booze",
                    "rule": "'Alcohol' en resmi ve bilimsel terimdir. 'Drink' genelde 'içki' (sosyal) anlamındadır. 'Booze' ise kaba/argo (zıkkım) anlamındandır.",
                    "example_wrong": "Let's go buy some chemical drinks. (Doğal değil)",
                    "example_right": "Let's go buy some booze. (Argo/Doğal)"
                }
            }
        },
        "sentence_progression": {
            "description": "Kelimenin seviyelere göre kullanım karmaşıklığı",
            "levels": [
                {
                    "cefr": "A1",
                    "en": "No alcohol, please.",
                    "tr": "Alkol olmasın, lütfen.",
                    "grammar_focus": "Imperative / Request"
                },
                {
                    "cefr": "A2",
                    "en": "You must be 18 to buy alcohol.",
                    "tr": "Alkol almak için 18 yaşında olmalısınız.",
                    "grammar_focus": "Modal Verbs (Obligation)"
                },
                {
                    "cefr": "B1",
                    "en": "The doctor advised him to cut down on alcohol.",
                    "tr": "Doktor ona alkolü azaltmasını tavsiye etti.",
                    "grammar_focus": "Phrasal Verb (cut down on)"
                },
                {
                    "cefr": "B2",
                    "en": "Alcohol consumption has decreased among young people.",
                    "tr": "Gençler arasında alkol tüketimi azaldı.",
                    "grammar_focus": "Formal Subject (consumption)"
                },
                {
                    "cefr": "C1",
                    "en": "Excessive alcohol intake impairs cognitive functions.",
                    "tr": "Aşırı alkol alımı bilişsel işlevleri bozar.",
                    "grammar_focus": "Scientific/Academic Register"
                }
            ]
        },
        "morphology_tree": {
            "root": "al-kuhl (Arabic)",
            "family_members": [
                { "word": "alcohol", "pos": "n", "level": "B1", "note": "alkol" },
                { "word": "alcoholic", "pos": "n/adj", "level": "B2", "note": "alkolik, alkol içeren" },
                { "word": "alcoholism", "pos": "n", "level": "C1", "suffix": "-ism", "note": "alkolizm (hastalık)" },
                { "word": "non-alcoholic", "pos": "adj", "level": "B1", "prefix": "non-", "note": "alkolsüz" },
                { "word": "workaholic", "pos": "n", "level": "C1", "note": "işkolik (analoji ile türetilmiş)" }
            ]
        },
        "collocations": {
            "modifiers_adverbs": [
                {
                    "word": "rubbing",
                    "turkish": "pansuman alkolü/ispirto",
                    "strength": "specific",
                    "example": "Use rubbing alcohol to clean the wound.",
                    "example_tr": "Yarayı temizlemek için ispirto kullanın."
                },
                {
                    "word": "pure",
                    "turkish": "saf",
                    "strength": "strong",
                    "example": "Pure alcohol is lethal.",
                    "example_tr": "Saf alkol öldürücüdür."
                },
                {
                    "word": "binge",
                    "turkish": "tıkınırcasına/aşırı",
                    "strength": "colloquial",
                    "example": "Binge drinking is a serious problem on campuses.",
                    "example_tr": "Tıkınırcasına (kısa sürede aşırı) içki içmek kampüslerde ciddi bir sorundur."
                }
            ],
            "verbs_preceding": [
                {
                    "word": "consume",
                    "turkish": "tüketmek",
                    "example": "He admitted to consuming alcohol.",
                    "example_tr": "Alkol tükettiğini itiraf etti."
                },
                {
                    "word": "abuse",
                    "turkish": "kötüye kullanmak (bağımlılık)",
                    "example": "People who abuse alcohol need help.",
                    "example_tr": "Alkolü kötüye kullananların (bağımlıların) yardıma ihtiyacı vardır."
                },
                {
                    "word": "abstain from",
                    "turkish": "uzak durmak / içmemek",
                    "example": "He abstains from alcohol for health reasons.",
                    "example_tr": "Sağlık nedenleriyle alkolden uzak duruyor."
                }
            ]
        },
        "lexical_nuance": {
            "synonym_scale": {
                "concept": "Intoxicating Beverages",
                "turkishConcept": "Alkollü İçecekler",
                "description": "İçki türlerinin resmilik ve sertlik derecelendirmesi",
                "scale": [
                    {
                        "word": "drink",
                        "value": 3,
                        "turkish": "içki",
                        "note": "En genel, sosyal tabir",
                        "usage": "Social: 'Let's have a drink.'",
                        "description_tr": "Genel anlamda içki (su hariç) demektir, sosyal ortamda alkollü içki kast edilir.",
                        "example_en": "Can I buy you a drink?",
                        "example_tr": "Sana bir içki ısmarlayabilir miyim?",
                        "strength": "Nötr"
                    },
                    {
                        "word": "alcohol",
                        "value": 5,
                        "turkish": "alkol",
                        "note": "Madde veya kategori adı",
                        "usage": "Formal/Medical: 'Contains alcohol.'",
                        "description_tr": "Kimyasal madde olarak veya genel kategori adı olarak kullanılır.",
                        "example_en": "This product contains 5% alcohol.",
                        "example_tr": "Bu ürün %5 alkol içerir.",
                        "strength": "Resmi"
                    },
                    {
                        "word": "liquor",
                        "value": 7,
                        "turkish": "sert içki",
                        "note": "Viski, votka vb. (ABD)",
                        "usage": "Hard liquor",
                        "description_tr": "Genellikle damıtılmış, alkol oranı yüksek sert içkiler (viski, votka) için kullanılır (US).",
                        "example_en": "The store sells beer and liquor.",
                        "example_tr": "Mağaza bira ve sert içki satıyor.",
                        "strength": "Spesifik"
                    },
                    {
                        "word": "spirits",
                        "value": 8,
                        "turkish": "ispirto / sert içki",
                        "note": "Damıtılmış yüksek alkol (UK/Official)",
                        "usage": "Wines and Spirits",
                        "description_tr": "Sert alkollü içkilerin resmi ve teknik adıdır (UK).",
                        "example_en": "Sales of spirits have increased.",
                        "example_tr": "Sert içki satışları arttı.",
                        "strength": "Teknik"
                    },
                    {
                        "word": "booze",
                        "value": 2,
                        "turkish": "zıkkım / içki",
                        "note": "Sokak ağzı, argo",
                        "usage": "Party: 'Bring the booze!'",
                        "description_tr": "Argoda içki anlamında kullanılır, biraz kaba kaçabilir.",
                        "example_en": "They brought a lot of booze to the party.",
                        "example_tr": "Partiye bolca içki (zıkkım) getirdiler.",
                        "strength": "Argo"
                    }
                ]
            },
            "antonyms": [
                {
                    "word": "sobriety",
                    "value": 10,
                    "turkish": "ayıklık",
                    "note": "Alkol etkisinde olmama veya hiç içmeme durumu.",
                    "description_tr": "Ayık olma durumu veya alkol kullanmama yaşam tarzıdır.",
                    "example_en": "He celebrated ten years of sobriety.",
                    "example_tr": "On yıllık ayıklığını (alkolsüzlüğünü) kutladı."
                },
                {
                    "word": "teetotaler",
                    "value": 9,
                    "turkish": "yeşilaycı",
                    "note": "Prensip olarak ağzına içki sürmeyen kişi.",
                    "description_tr": "Asla alkol kullanmayan, prensip sahibi kişi.",
                    "example_en": "She acts like a teetotaler but she drinks sometimes.",
                    "example_tr": "Yeşilaycı gibi davranıyor ama bazen içer."
                }
            ]
        },
        "pragmatics": {
            "idioms_and_phrases": [
                {
                    "phrase": "Dutch courage",
                    "meaning_tr": "içkiden gelen (sahte) cesaret",
                    "register": "idiomatic",
                    "example": "He needed some Dutch courage to talk to her.",
                    "example_tr": "Onunla konuşmak için biraz içki cesaretine ihtiyacı vardı."
                },
                {
                    "phrase": "hair of the dog",
                    "meaning_tr": "çivi çiviyi söker (akşamdan kalmalığa karşı sabah içilen içki)",
                    "register": "idiomatic"
                },
                {
                    "phrase": "under the influence",
                    "meaning_tr": "etkisi altında (sarhoş)",
                    "register": "legal/formal",
                    "example": "Driving under the influence (DUI) is a crime.",
                    "example_tr": "Alkollü (etki altında) araç kullanmak suçtur."
                }
            ],
            "sociolinguistics": {
                "topic": "Social Drinking",
                "note_en": "In many cultures, refusing a toast (cheers) can be seen as rude. However, 'Mocktails' (alcohol-free cocktails) are becoming popular for non-drinkers.",
                "note_tr": "Kadeh kaldırmayı (şerefe) reddetmek bazı kültürlerde kabalık olabilir. Ancak alkol kullanmayanlar için 'Mocktail' kültürü yaygınlaşmaktadır."
            }
        },
        "cultural_context": {
            "register": {
                "level": "mixed",
                "description": "Tıbbi bağlamda nötr, sosyal bağlamda dikkatli kullanılması gereken bir kelimedir."
            },
            "inclusive_language": null,
            "grammar_nuance": {
                "title": "Uncountable",
                "content": "Alkol sıvı/madde olduğu için sayılamaz. 'I drank two alcohols' denmez, 'two drinks' veya 'two beers' denir."
            },
            "business_english": {
                "title": "Sin Taxes",
                "content": "Ekonomide alkol ve tütün üzerine konulan vergilere 'Sin Tax' (Günah Vergisi) denir. Bu terim okuma parçalarında çıkabilir.",
                "keywords": ["sin tax", "excise duty"]
            },
            "trivia": {
                "title": "Prohibition (Yasak Dönemi)",
                "content": "ABD'de 1920-1933 yılları arasında alkol satışı yasaktı. Bu döneme 'Prohibition Era' denir. 'Speakeasy' (gizli bar) ve 'Moonshine' (kaçak içki) kelimeleri bu dönemden kalmadır."
            }
        },
        "exam_strategies": {
            "frequency": {
                "yds": 70,
                "yokdil": 85,
                "ydt": 60,
                "description": "YÖKDİL Sağlık (bağımlılık/karaciğer) ve Sosyal (trafik kazaları/suç) metinlerinde sık geçer."
            },
            "vocabulary": [
                {
                    "title": "Formal Eş Anlamlılar",
                    "content": "Essay yazarken 'drunk people' yerine 'intoxicated individuals' derseniz puanınız artar."
                },
                {
                    "title": "Related Words",
                    "content": "'Beverage' her türlü içecek (su dahil) demektir. 'Spirit' ise yüksek alkollü içkidir (viski vb.)."
                }
            ],
            "grammar": [],
            "reading": [
                {
                    "title": "Bağımlılık Metinleri",
                    "content": "Parçada 'substance abuse' geçiyorsa, genellikle uyuşturucu veya alkol kötüye kullanımından bahsediliyordur. 'Withdrawal symptoms' (yoksunluk belirtileri) terimine dikkat."
                }
            ]
        },
        "morphology_tree": {
            "root": "al-kuhl (Arabic)",
            "family_members": [
                { "word": "alcohol", "pos": "n", "level": "B1", "note": "alkol" },
                { "word": "alcoholic", "pos": "n/adj", "level": "B2", "note": "alkolik, alkol içeren" },
                { "word": "alcoholism", "pos": "n", "level": "C1", "suffix": "-ism", "note": "alkolizm (hastalık)" },
                { "word": "non-alcoholic", "pos": "adj", "level": "B1", "prefix": "non-", "note": "alkolsüz" },
                { "word": "workaholic", "pos": "n", "level": "C1", "note": "işkolik (analoji ile türetilmiş)" }
            ]
        },
        "pedagogy_engine": {
            "common_errors": [
                {
                    "error_id": "err_plural_s",
                    "incorrect": "They sell many alcohols.",
                    "correction": "They sell many types of alcohol.",
                    "explanation": "Alkol kütle ismidir (uncountable), -s çoğul eki almaz. Çeşit kastediliyorsa 'types of' eklenir."
                }
            ],
            "exam_prep": {
                "ielts_tag": "Health & Society",
                "tip": "Essay yazarken 'drinking' yerine 'alcohol consumption' veya 'substance abuse' demek daha akademik görünür.",
                "keywords": ["addiction", "rehabilitation", "social impact"]
            },
            "gamification": {
                "challenge_type": "true_false",
                "question": "Alcohol is a stimulant.",
                "answer": "False",
                "explanation": "Yanlış. Alkol teknik olarak bir 'Depressant' (merkezi sinir sistemini baskılayıcı) maddedir."
            }
        },
        "word_journey": {
            "timeline": [
                { "era": "Arabic", "word": "al-kuhl", "meaning": "fine powder (sürme)" },
                { "era": "Medieval Latin", "word": "alcohol", "meaning": "distilled essence/spirit" },
                { "era": "18th Century", "word": "alcohol", "meaning": "intoxicating ingredient" }
            ],
            "turkish_cognate_hint": {
                "word": "Alkol",
                "connection_type": "Direct Loan",
                "story": "Kelimenin aslı Arapça 'El-Kuhl' (Göz sürmesi). Simyacılar, damıtma yoluyla elde edilen saf öze bu ismi verdiler ('şarabın ruhu/özü'). Türkçeye olduğu gibi geçmiştir.",
                "example": "Spirit (Ruh) kelimesinin hem 'hayalet' hem de 'ispirto' anlamına gelmesi bu simya geleneğindendir."
            }
        },
        "stories": {
            "A1": {
                "tr": "Partideyiz. Masada çok içecek var. Meyve suyu, su ve kola var. Ayrıca <strong>alkol</strong> de var. Ben <strong>alkol</strong> sevmem. Tadı acı. Portakal suyu içiyorum. Arkadaşım bira içiyor.",
                "en": "We are at a party. There are many drinks on the table. There is juice, water, and cola. There is also <strong>alcohol</strong>. I do not like <strong>alcohol</strong>. It tastes bitter. I am drinking orange juice. My friend is drinking beer."
            },
            "A2": {
                "tr": "Polis arabamı durdurdu. Bana '<strong>Alkol</strong> içtin mi?' diye sordu. 'Hayır memur bey,' dedim. 'Sadece su içtim.' Polis bana inandı ama test yaptı. Test sonucu temiz çıktı. Araba kullanırken asla <strong>alkol</strong> almam. Bu çok tehlikeli.",
                "en": "The police stopped my car. He asked me, 'Did you drink <strong>alcohol</strong>?' I said, 'No officer. I only drank water.' The police believed me but did a test. The test result was clean. I never drink <strong>alcohol</strong> while driving. It is very dangerous."
            },
            "B1": {
                "tr": "Hastanede hemşire kolumu temizledi. Pamukta keskin bir koku vardı. Bu <strong>ispirto</strong> (birtür alkol) kokusuydu. 'Bu biraz yakabilir,' dedi. <strong>Alkol</strong> yaradaki mikropları öldürür. İğneden korkuyordum ama acımadı. Tıbbi <strong>alkol</strong> içmek için değildir, sadece temizlik içindir.",
                "en": "At the hospital, the nurse cleaned my arm. There was a sharp smell on the cotton. It was the smell of <strong>rubbing alcohol</strong>. 'This might sting a little,' she said. <strong>Alcohol</strong> kills germs in the wound. I was afraid of the needle, but it didn't hurt. Medical <strong>alcohol</strong> is not for drinking, it is only for cleaning."
            },
            "B2": {
                "tr": "Üniversitede sosyal hayat genellikle partiler etrafında döner. Ancak oda arkadaşım bir 'yeşilaycı' (teetotaler). Yani hiç <strong>alkol</strong> kullanmıyor. İlk başta partilerde sıkılacağını düşündüm. Ama yanılmışım. O, <strong>alkol</strong> olmadan da eğlenmeyi biliyor. Hatta sabahları akşamdan kalma (hangover) olmadığı için bizden daha enerjik oluyor.",
                "en": "In college, social life often revolves around parties. However, my roommate is a teetotaler. That means he doesn't consume any <strong>alcohol</strong>. At first, I thought he would be bored at parties. But I was wrong. He knows how to have fun without <strong>alcohol</strong>. In fact, since he doesn't get hangovers, he is more energetic than us in the mornings."
            },
            "C1": {
                "tr": "Yasak Dönemi'nde (Prohibition Era), hükümet <strong>alkol</strong> satışını yasadışı ilan etti. Amaç suçu azaltmaktı, ama tam tersi oldu. İnsanlar gizli barlarda (speakeasies) kalitesiz ve tehlikeli içkiler üretmeye başladılar. Bu dönem bize şunu öğretti: Bir maddeyi yasaklamak, ona olan talebi yok etmez, sadece yeraltına iter. <strong>Alkol</strong>, insanlık tarihi kadar eski, karmaşık bir sosyal fenomendir.",
                "en": "During the Prohibition Era, the government declared the sale of <strong>alcohol</strong> illegal. The aim was to reduce crime, but the opposite happened. People started producing poor quality and dangerous drinks in speakeasies. This era taught us: Banning a substance does not eliminate the demand, it just pushes it underground. <strong>Alcohol</strong> is a complex social phenomenon as old as human history."
            },
            "C2": {
                "tr": "Biyokimyasal açıdan <strong>alkol</strong> (etanol), merkezi sinir sistemi üzerinde baskılayıcı bir etkiye sahiptir. İlk başta dopamin salınımını tetikleyerek bir öfori (neşe) hissi yaratsa da, aslında beyin fonksiyonlarını yavaşlatır. Kronik maruziyet, karaciğerin metabolize etme kapasitesini aşarak siroza yol açabilir. Toplumun <strong>alkol</strong> ile olan bu çalkantılı ilişkisi, hem kutlamaların neşesi hem de bağımlılığın trajedisi arasındaki ince çizgide yürür.",
                "en": "Biochemically, <strong>alcohol</strong> (ethanol) has a depressant effect on the central nervous system. Although it initially triggers dopamine release creating a sense of euphoria, it actually slows down brain functions. Chronic exposure can overwhelm the liver's metabolizing capacity, leading to cirrhosis. Society's turbulent relationship with <strong>alcohol</strong> walks a fine line between the joy of celebration and the tragedy of addiction."
            }
        }
    },
    {  // all right
        "id": "1005-all-right", "word": "all right",
        "meta": {
            "version": "2.2.0",
            "dictionary_type": "learner_advanced",
            "cefr_level": "A1",
            "frequency_rank": 300,
            "frequency_band": "High Frequency",
            "part_of_speech": ["adjective", "adverb", "interjection"]
        },
        "phonetics": {
            "ipa_us": "/ˌɑːl ˈraɪt/",
            "ipa_uk": "/ˌɔːl ˈraɪt/",
            "audio_us": "/assets/audio/us/all-right.mp3",
            "audio_uk": "/assets/audio/uk/all-right.mp3",
            "syllabification": ["all", "right"],
            "stress_data": {
                "pattern": "Spondee (Equal Stress)",
                "primary_stress_index": 1
            }
        },
        "definitions": [
            {
                "sense_id": "def_1",
                "core_meaning_en": "satisfactory, safe, or well",
                "core_meaning_tr": "iyi, yolunda, sorunsuz",
                "context_tags": ["state", "health"],
                "example": {
                    "sentence": "Is everything all right?",
                    "translation": "Her şey yolunda mı?"
                }
            },
            {
                "sense_id": "def_2",
                "core_meaning_en": "used to ask someone or agree to a suggestion",
                "core_meaning_tr": "tamam, pekala, olur",
                "context_tags": ["agreement", "discourse"],
                "example": {
                    "sentence": "'Let's go.' 'All right.'",
                    "translation": "'Gidelim.' 'Tamam/Olur.'"
                }
            }
        ],
        "grammar_profile": {
            "structures": [
                {
                    "pattern": "predicate adjective",
                    "usage_level": "Core",
                    "notes_tr": "Genellikle 'be' fiilinden sonra gelir (The car is all right). İsimden önce (attributive) pek kullanılmaz ('an all right car' nadirdir)."
                },
                {
                    "pattern": "discourse marker",
                    "usage_level": "Intermediate",
                    "notes_tr": "Konuşmada yeni bir konuya geçerken 'Pekala...' anlamında cümlenin başında kullanılır (All right, let's start)."
                }
            ],
            "tense_logic": {
                "why_use_it": "Durum bildirmek veya onay vermek için.",
                "critical_comparison": {
                    "context": "All right vs Alright",
                    "rule": "'All right' (iki kelime) tek resmi ve doğru kabul edilen yazılıştır. 'Alright' (bitişik) çok yaygın olsa da resmiyette (akademik/iş) hala yanlış veya gayriresmi kabul edilir.",
                    "example_wrong": "The essay was alright. (Akademik olarak eksi puan alır)",
                    "example_right": "The essay was all right. (Doğru)"
                }
            }
        },
        "sentence_progression": {
            "description": "Kelimenin seviyelere göre kullanım karmaşıklığı",
            "levels": [
                {
                    "cefr": "A1",
                    "en": "I am all right, thank you.",
                    "tr": "İyiyim, teşekkür ederim.",
                    "grammar_focus": "Subject + Be + Adjective"
                },
                {
                    "cefr": "A2",
                    "en": "Everything will be all right.",
                    "tr": "Her şey yoluna girecek (iyi olacak).",
                    "grammar_focus": "Future Simple (Prediction)"
                },
                {
                    "cefr": "B1",
                    "en": "Did you get home all right last night?",
                    "tr": "Dün gece eve sağ salim (sorunsuz) vardın mı?",
                    "grammar_focus": "Adverbial Usage"
                },
                {
                    "cefr": "B2",
                    "en": "All right, I admit I was wrong.",
                    "tr": "Pekala, haksız olduğumu kabul ediyorum.",
                    "grammar_focus": "Discourse Marker (Concession)"
                },
                {
                    "cefr": "C1",
                    "en": "The performance was strictly all right, nothing spectacular.",
                    "tr": "Performans sadece 'eh işte' (vasat) idi, muhteşem bir şey değildi.",
                    "grammar_focus": "Nuance describing mediocrity"
                }
            ]
        },
        "morphology_tree": {
            "root": "eall + riht (Old English)",
            "family_members": [
                { "word": "all right", "pos": "adj/adv", "level": "A1", "note": "tamamen doğru -> tamam/iyi" },
                { "word": "right", "pos": "adj", "level": "A1", "note": "doğru, haklı" },
                { "word": "all", "pos": "det", "level": "A1", "note": "bütün, hepsi" },
                { "word": "alright", "pos": "adj/adv", "level": "A2", "note": "gayriresmi yazılış (günlük kullanım)" }
            ]
        },
        "collocations": {
            "modifiers_adverbs": [
                {
                    "word": "quite",
                    "turkish": "gayet/oldukça",
                    "strength": "strong",
                    "example": "It's quite all right to be nervous.",
                    "example_tr": "Gergin olmak gayet normaldir (sorun değildir)."
                },
                {
                    "word": "perfectly",
                    "turkish": "tamamen/fazlasıyla",
                    "strength": "strong",
                    "example": "The car runs perfectly all right.",
                    "example_tr": "Araba (mekanik olarak) tamamen sorunsuz çalışıyor."
                },
                {
                    "word": "seem",
                    "turkish": "görünmek",
                    "example": "Does this size seem all right to you?",
                    "example_tr": "Bu beden sana uygun görünüyor mu?"
                }
            ],
            "verbs_preceding": [
                {
                    "word": "turn out",
                    "turkish": "sonuçlanmak",
                    "example": "Everything turned out all right in the end.",
                    "example_tr": "Sonunda her şey tatlıya (iyiye) bağlandı."
                },
                {
                    "word": "feel",
                    "turkish": "hissetmek",
                    "example": "I don't feel quite all right today.",
                    "example_tr": "Bugün kendimi pek iyi hissetmiyorum."
                },
                {
                    "word": "make",
                    "turkish": "düzeltmek/telafi etmek",
                    "example": "I want to make everything all right again.",
                    "example_tr": "Her şeyi tekrar düzeltmek (yoluna koymak) istiyorum."
                }
            ]
        },
        "lexical_nuance": {
            "synonym_scale": {
                "concept": "Levels of Wellness/Agreement",
                "turkishConcept": "İyilik/Onay Seviyeleri",
                "description": "Nötr'den pozitife doğru iyilik durumları",
                "scale": [
                    {
                        "word": "so-so",
                        "value": 3,
                        "turkish": "şöyle böyle",
                        "note": "Ne iyi ne kötü",
                        "usage": "I'm feeling so-so.",
                        "description_tr": "Durumun ne iyi ne kötü, vasat olduğunu belirtir.",
                        "example_en": "How was the movie? It was so-so.",
                        "example_tr": "Film nasıldı? Şöyle böyleydi.",
                        "strength": "Nötr-Negatif"
                    },
                    {
                        "word": "all right",
                        "value": 5,
                        "turkish": "iyi/yolunda",
                        "note": "Yeterli, sorunsuz, tatmin edici",
                        "usage": "The movie was all right.",
                        "description_tr": "Her şeyin yolunda olduğunu veya bir şeyin kabul edilebilir seviyede olduğunu anlatır.",
                        "example_en": "Is everything all right here?",
                        "example_tr": "Burada her şey yolunda mı?",
                        "strength": "Nötr-Pozitif"
                    },
                    {
                        "word": "fine",
                        "value": 6,
                        "turkish": "iyi/hoş",
                        "note": "Standart iyi, bazen 'peki' (isteksiz) anlamında",
                        "usage": "I'm fine, thanks.",
                        "description_tr": "Genel iyilik halidir, bazen konuyu kapatmak için de kullanılır.",
                        "example_en": "Just do whatever you want, it's fine.",
                        "example_tr": "Ne istiyorsan yap, sorun değil (iyi).",
                        "strength": "Pozitif"
                    },
                    {
                        "word": "great",
                        "value": 9,
                        "turkish": "harika",
                        "note": "Beklenenden iyi",
                        "usage": "I feel great!",
                        "description_tr": "Durumun standarttan çok daha iyi olduğunu vurgular.",
                        "example_en": "You look great today!",
                        "example_tr": "Bugün harika görünüyorsun!",
                        "strength": "Güçlü"
                    }
                ]
            },
            "antonyms": [
                {
                    "word": "wrong",
                    "value": 1,
                    "turkish": "ters/yanlış",
                    "note": "'Something is wrong' (Bir terslik var)",
                    "description_tr": "İşlerin yolunda gitmediğini, bir terslik olduğunu belirtir.",
                    "example_en": "Something feels wrong about this deal.",
                    "example_tr": "Bu anlaşmada ters gelen bir şeyler var."
                },
                {
                    "word": "unacceptable",
                    "value": 0,
                    "turkish": "kabul edilemez",
                    "note": "Onay vermeme durumu",
                    "description_tr": "Bir durumun kesinlikle uygun olmadığını ifade eder.",
                    "example_en": "This behavior is unacceptable.",
                    "example_tr": "Bu davranış kabul edilemez."
                }
            ]
        },
        "pragmatics": {
            "idioms_and_phrases": [
                {
                    "phrase": "Are you all right?",
                    "meaning_tr": "Naber? / İyi misin?",
                    "register": "British English",
                    "example": "Alright mate? (Naber dostum?)",
                    "example_tr": "İngiltere'de selamlaşma kalıbıdır, sağlık sorusu değildir."
                },
                {
                    "phrase": "It'll be all right on the night",
                    "meaning_tr": "Kervan yolda düzülür (son anda işler yoluna girer)",
                    "register": "idiomatic",
                    "example": "Rehearsals were chaotic, but it'll be all right on the night.",
                    "example_tr": "Provalar kaotikti ama gösteri zamanı her şey düzelir."
                },
                {
                    "phrase": "That's quite all right",
                    "meaning_tr": "Hiç önemli değil / Rica ederim",
                    "register": "polite/formal",
                    "example": "Use this phrase to accept an apology graciously.",
                    "example_tr": "Bir özrü nazikçe kabul etmek için kullanılır."
                }
            ],
            "sociolinguistics": {
                "topic": "Signposting (Konuşma Yönlendirme)",
                "note_en": "In spoken English, 'All right' is often used to signal a change of topic or to close a conversation. (e.g., 'All right then, see you later.')",
                "note_tr": "Konuşmada 'All right' demek, genellikle 'Peki o zaman...' diyerek konuyu değiştirme veya vedalaşma işaretidir."
            }
        },
        "cultural_context": {
            "register": {
                "level": "neutral",
                "description": "Hem resmi hem günlük dilde kullanılır. Yazımda 'Alright' kullanmaktan kaçının."
            },
            "inclusive_language": null,
            "grammar_nuance": {
                "title": "Predicate Adjective",
                "content": "'All right' genellikle fiilden sonra gelir (Results are all right). İsimden önce (an all right movie) kullanımı daha nadirdir ve gayriresmidir."
            },
            "business_english": {
                "title": "Closing Deals",
                "content": "Toplantı sonunda 'Is that all right with everyone?' demek, 'Herkes mutabık mı/Onaylıyor mu?' demektir ve anlaşmayı mühürler."
            },
            "trivia": {
                "title": "Spelling War: Alright vs All Right",
                "content": "'Alright' kelimesi 'Already' ve 'Altogether' gibi analoji ile türetilmiştir ancak hala (yüzyıllardır) dilbilgisi otoriteleri tarafından 'standart dışı' kabul edilir. Sınavda asla 'Alright' yazmayın."
            }
        },
        "exam_strategies": {
            "frequency": {
                "yds": 40,
                "yokdil": 30,
                "ydt": 80,
                "description": "Diyalog sorularında (YDT) ve dinleme bölümlerinde (IELTS/TOEFL) frekansı çok yüksektir."
            },
            "vocabulary": [
                {
                    "title": "Diyalog İpuçları",
                    "content": "Bir konuşmacı 'All right...' diyorsa, muhtemelen yeni bir konuya geçiyor veya bir teklifi kabul ediyordur. Tonlamaya dikkat edin."
                },
                {
                    "title": "Yazım Hatası Tuzağı",
                    "content": "Şıklarda 'Alright' ve 'All right' varsa, her zaman ayrı yazılan 'All right' seçeneği gramer açısından güvenlidir."
                }
            ],
            "grammar": [],
            "reading": [
                {
                    "title": "Understatement (Hafife Alma)",
                    "content": "İngilizler çok iyi bir şeye bile sadece 'It was all right' diyebilirler. Bağlama göre bu 'eh işte' veya 'muhteşemdi' anlamına gelebilir (British Understatement)."
                }
            ]
        },
        "morphology_tree": {
            "root": "eall + riht (Old English)",
            "family_members": [
                { "word": "all right", "pos": "adj/adv", "level": "A1", "note": "tamamen doğru -> tamam/iyi" },
                { "word": "right", "pos": "adj", "level": "A1", "note": "doğru, haklı" },
                { "word": "all", "pos": "det", "level": "A1", "note": "bütün, hepsi" },
                { "word": "alright", "pos": "adj/adv", "level": "A2", "note": "gayriresmi yazılış (günlük kullanım için, sınavda kullanmayın)" }
            ]
        },
        "pedagogy_engine": {
            "common_errors": [
                {
                    "error_id": "err_spelling_alright",
                    "incorrect": "The movie was alright.",
                    "correction": "The movie was all right.",
                    "explanation": "'Alright' yazımı mesajlaşmada kabul görse de, sınavlarda ve resmi yazılarda hala hata sayılır. Her zaman iki kelime olarak yazın."
                }
            ],
            "exam_prep": {
                "ielts_tag": "Listening",
                "tip": "Dinleme sınavında konuşmacı bir konuyu kapatıp diğerine geçerken ses tonunu yükseltip 'All right...' der. Bu bir 'işaret'tir (signpost).",
                "keywords": ["signposting", "transition"]
            },
            "gamification": {
                "challenge_type": "multiple_choice",
                "question": "Which spelling is formally correct?",
                "answer": "All right",
                "distractors": ["Alright", "Allright", "Al-right"]
            }
        },
        "word_journey": {
            "timeline": [
                { "era": "Old English", "word": "eall riht", "meaning": "completely just/correct" },
                { "era": "Middle English", "word": "al right", "meaning": "properly, safely" },
                { "era": "19th Century", "word": "alright", "meaning": "disputed spelling emerges (analogy to already)" }
            ],
            "turkish_cognate_hint": {
                "word": "Ray",
                "connection_type": "Distant Conceptual",
                "story": "'Right' (doğru/sağ) kelimesi 'düz gitmek' kökünden gelir. Türkçedeki 'Ray' (tren rayı) kelimesiyle uzaktan akrabadır. 'All Right' demek, her şeyin 'rayında' olması, düzgün gitmesi demektir.",
                "example": "All right -> Her şey rayında."
            }
        },
        "stories": {
            "A1": {
                "tr": "Ali parkta düştü. Ben koştum. 'İyi misin?' diye sordum. Ali kalktı. Üstünü temizledi. 'Evet, ben <strong>iyiyim</strong> (all right)' dedi. Biz oyun oynamaya devam ettik. Her şey <strong>yolunda</strong>ydı.",
                "en": "Ali fell in the park. I ran. 'Are you <strong>all right</strong>?' I asked. Ali got up. He cleaned his clothes. 'Yes, I am <strong>all right</strong>,' he said. We continued to play. Everything was <strong>all right</strong>."
            },
            "A2": {
                "tr": "Öğretmenim, 'Ödevini yaptın mı?' diye sordu. Ben, 'Üzgünüm, unuttum' dedim. Öğretmen gülümsedi. '<strong>Sorun değil</strong> (That's all right), yarın getirirsin' dedi. Çok mutlu oldum. '<strong>Tamam</strong> (All right), söz veriyorum' dedim.",
                "en": "My teacher asked, 'Did you do your homework?' I said, 'Sorry, I forgot.' The teacher smiled. 'That is <strong>all right</strong>, bring it tomorrow,' she said. I was very happy. '<strong>All right</strong>, I promise,' I said."
            },
            "B1": {
                "tr": "Dün geceki fırtına çok korkutucuydu. Elektrikler kesildi. Annemi aradım, ulaşamadım. Çok endişelendim. Sabah olunca nihayet telefonu açtı. 'Merak etme, biz <strong>iyiyiz</strong> (all right)' dedi. O cümleyi duymak beni rahatlattı. Sonunda her şeyin <strong>yoluna girdiğini</strong> bilmek güzeldi.",
                "en": "The storm last night was very scary. The electricity went out. I called my mom but couldn't reach her. I was very worried. In the morning, she finally answered. 'Don't worry, we are <strong>all right</strong>,' she said. Hearing that sentence relieved me. It was good to know that everything turned out <strong>all right</strong>."
            },
            "B2": {
                "tr": "Bir iş görüşmesindeydim. Görüşme biraz gergin başladı. Sonra, '<strong>Pekala</strong> (All right), şimdi deneyimlerinizden konuşalım' dedi müdür. Bu ifade (all right), konuşmanın resmiyet seviyesini düşürdü ve daha rahat bir aşamaya geçtiğimizi işaret etti. Görüşmenin geri kalanı gayet <strong>iyi</strong> (all right) geçti, ne harikaydı ne de kötü.",
                "en": "I was at a job interview. It started a bit tense. Then, '<strong>All right</strong>, let's talk about your experience now,' said the manager. This phrase signaled a shift to a more comfortable stage. The rest of the interview went quite <strong>all right</strong>; it wasn't amazing, but not bad either."
            },
            "C1": {
                "tr": "Dilbilimciler arasında 'alright' kelimesinin yazımı üzerine bitmeyen bir tartışma vardır. Gelenekselciler bunun tembel bir yazım hatası olduğunu savunur. Ancak, 'already' ve 'altogether' gibi kelimelerin dilde kabul görmesi, 'alright'ın da zamanla meşrulaşacağının sinyalini veriyor. Yazar, 'Eğer anlam açıksa, yazım biçimi <strong>sorun olmamalı</strong> (should be all right)' diyerek betimleyici (descriptive) bir tavır takındı.",
                "en": "There is an endless debate among linguists regarding the spelling of 'alright'. Traditionalists argue it is a lazy spelling error. However, the acceptance of words like 'already' and 'altogether' signals that 'alright' will also be legitimized in time. The author took a descriptive stance, implying that 'If the meaning is clear, the spelling should be <strong>all right</strong>.'"
            },
            "C2": {
                "tr": "Varoluşsal bir krizin ortasında, insan her şeyin kaotik olduğunu düşünme eğilimindedir. Ancak Stoacı felsefe, evrenin doğası gereği mükemmel ve <strong>yerli yerinde</strong> (all right) olduğunu savunur. Olanı olduğu gibi kabul etmek, 'her şey <strong>yolunda</strong>' diyebilen bir zihin yapısına ulaşmaktır. Bu, pasif bir boyun eğme değil, kozmik düzene (Order) aktif bir uyumdur. Bob Marley'in dediği gibi: 'Her küçük şey <strong>yoluna girecek</strong>.'",
                "en": "In the midst of an existential crisis, one tends to think everything is chaotic. However, Stoic philosophy argues that the universe is inherently perfect and <strong>all right</strong>. Accepting what is, implies reaching a mindset that can say 'everything is <strong>all right</strong>.' This is not passive submission, but active attunement to the cosmic Order. As Bob Marley said: 'Every little thing is gonna be <strong>all right</strong>.'"
            }
        }
    },
    {  // alphabet
        "id": "1006-alphabet", "word": "alphabet",
        "meta": {
            "version": "2.2.0",
            "dictionary_type": "learner_advanced",
            "cefr_level": "A2",
            "frequency_rank": 2000,
            "frequency_band": "Medium Frequency",
            "part_of_speech": ["noun"]
        },
        "phonetics": {
            "ipa_us": "/ˈæl.fə.bet/",
            "ipa_uk": "/ˈæl.fə.bet/",
            "audio_us": "/assets/audio/us/alphabet.mp3",
            "audio_uk": "/assets/audio/uk/alphabet.mp3",
            "syllabification": ["al", "pha", "bet"],
            "stress_data": {
                "pattern": "Dactyl (Strong-Weak-Weak)",
                "primary_stress_index": 0
            }
        },
        "definitions": [
            {
                "sense_id": "def_1",
                "core_meaning_en": "a set of letters arranged in a fixed order",
                "core_meaning_tr": "alfabe, abece",
                "context_tags": ["language", "writing"],
                "example": {
                    "sentence": "The English alphabet has 26 letters.",
                    "translation": "İngiliz alfabesinde 26 harf vardır."
                }
            },
            {
                "sense_id": "def_2",
                "core_meaning_en": "the basic elements of any subject (rudiments)",
                "core_meaning_tr": "temel ilkeler, alfabe (mecazi)",
                "context_tags": ["figurative"],
                "example": {
                    "sentence": "The alphabet of genetics.",
                    "translation": "Genetiğin alfabesi (temelleri)."
                }
            }
        ],
        "grammar_profile": {
            "structures": [
                {
                    "pattern": "in alphabetical order",
                    "usage_level": "Core",
                    "notes_tr": "En sık kullanılan kalıptır: 'Alfabetik sırayla' (e.g., The books are arranged in alphabetical order)."
                },
                {
                    "pattern": "the [Language] alphabet",
                    "usage_level": "Intermediate",
                    "notes_tr": "Belirli bir dilin alfabesinden bahsederken 'the' kullanılır (the Greek alphabet)."
                }
            ],
            "tense_logic": {
                "why_use_it": "Bir sistem veya sıralama bütünü olarak.",
                "critical_comparison": {
                    "context": "Alphabet vs Letter",
                    "rule": "'Letter' tek bir harftir (A, B, C). 'Alphabet' ise bu harflerin oluşturduğu setin tamamıdır.",
                    "example_wrong": "I learned the alphabets A and B. (Yanlış - harfler öğrenilir, alfabe bir bütündür)",
                    "example_right": "I learned the letters A and B. (Doğru)"
                }
            }
        },
        "sentence_progression": {
            "description": "Kelimenin seviyelere göre kullanım karmaşıklığı",
            "levels": [
                {
                    "cefr": "A1",
                    "en": "A is the first letter of the alphabet.",
                    "tr": "A, alfabenin ilk harfidir.",
                    "grammar_focus": "Superlative (first)"
                },
                {
                    "cefr": "A2",
                    "en": "Can you say the alphabet backwards?",
                    "tr": "Alfabeyi tersten sayabilir misin?",
                    "grammar_focus": "Adverb (backwards)"
                },
                {
                    "cefr": "B1",
                    "en": "Please arrange these files in alphabetical order.",
                    "tr": "Lütfen bu dosyaları alfabetik sıraya göre düzenleyin.",
                    "grammar_focus": "Imperative + Collocation"
                },
                {
                    "cefr": "B2",
                    "en": "The Cyrillic alphabet is used in Russia and Bulgaria.",
                    "tr": "Kiril alfabesi Rusya ve Bulgaristan'da kullanılır.",
                    "grammar_focus": "Passive Voice"
                },
                {
                    "cefr": "C1",
                    "en": "The phonetic alphabet is crucial for clear communication in aviation.",
                    "tr": "Fonetik alfabe, havacılıkta net iletişim için hayati önem taşır.",
                    "grammar_focus": "Specific Terminology"
                }
            ]
        },
        "morphology_tree": {
            "root": "Alpha + Beta (Greek)",
            "family_members": [
                { "word": "alphabet", "pos": "n", "level": "A2", "note": "alfabe" },
                { "word": "alphabetical", "pos": "adj", "level": "B1", "suffix": "-ical", "note": "alfabetik, abecesel" },
                { "word": "alphabetize", "pos": "v", "level": "C1", "suffix": "-ize", "note": "alfabetik sıraya koymak" },
                { "word": "literacy", "pos": "n", "level": "B2", "note": "okuryazarlık (alfabe bilgisi)" }
            ]
        },
        "collocations": {
            "modifiers_adverbs": [
                {
                    "word": "phonetic",
                    "turkish": "fonetik/sesçil",
                    "strength": "technical",
                    "example": "NATO phonetic alphabet (NATO fonetik alfabesi - Alpha, Bravo...)",
                    "example_tr": "Havacılıkta NATO fonetik alfabesi kullanılır."
                },
                {
                    "word": "Latin/Roman",
                    "turkish": "Latin",
                    "strength": "standard",
                    "example": "Turkish uses the Latin alphabet.",
                    "example_tr": "Türkçe Latin alfabesini kullanır."
                },
                {
                    "word": "Cyrillic",
                    "turkish": "Kiril",
                    "strength": "specific",
                    "example": "Russian is written in the Cyrillic alphabet.",
                    "example_tr": "Rusça Kiril alfabesiyle yazılır."
                }
            ],
            "verbs_preceding": [
                {
                    "word": "recite",
                    "turkish": "ezbere okumak",
                    "example": "The child can recite the alphabet.",
                    "example_tr": "Çocuk alfabeyi ezbere sayabiliyor."
                },
                {
                    "word": "devise",
                    "turkish": "icat etmek/tasarlamak",
                    "example": "He devised a new alphabet for the language.",
                    "example_tr": "Dil için yeni bir alfabe tasarladı."
                },
                {
                    "word": "transliterate",
                    "turkish": "harf çevirisi yapmak",
                    "example": "Names are transliterated into the Latin alphabet.",
                    "example_tr": "İsimler Latin alfabesine çevrilir (harf harf)."
                }
            ]
        },
        "lexical_nuance": {
            "synonym_scale": {
                "concept": "Writing Systems",
                "turkishConcept": "Yazı Sistemleri",
                "scale": [
                    {
                        "word": "alphabet",
                        "value": 5,
                        "turkish": "alfabe/abece",
                        "note": "Harflerden oluşan ses temelli set (A, B, C)",
                        "description_tr": "Her sesin bir harfle karşılandığı standart yazı sistemidir.",
                        "example_en": "The Greek alphabet is thousands of years old.",
                        "example_tr": "Yunan alfabesi binlerce yıllıktır.",
                        "strength": "Fonetik"
                    },
                    {
                        "word": "script",
                        "value": 6,
                        "turkish": "yazı sistemi/hat",
                        "note": "Bir dilin yazım şekli (Arabic Script, cursive script)",
                        "description_tr": "Bir dilin karakterlerinin el yazısı veya basılı özgün biçimidir.",
                        "example_en": "Urdu is written in the Arabic script.",
                        "example_tr": "Urduca Arap yazısıyla (hattıyla) yazılır.",
                        "strength": "Teknik"
                    },
                    {
                        "word": "character set",
                        "value": 9,
                        "turkish": "karakter seti",
                        "note": "Dijital ortamdaki sembollerin tamamı (ASCII, Unicode)",
                        "description_tr": "Bilgisayar sistemlerinde kullanılan tüm harf ve sembollerin listesidir.",
                        "example_en": "UTF-8 covers almost every character set.",
                        "example_tr": "UTF-8 neredeyse tüm karakter setlerini kapsar.",
                        "strength": "Dijital"
                    },
                    {
                        "word": "hieroglyphics",
                        "value": 8,
                        "turkish": "hiyeroglif",
                        "note": "Resim yazısı (harf değil sembol)",
                        "description_tr": "Antik Mısır'da kullanılan resim temelli yazı sistemidir.",
                        "example_en": "They deciphered the hieroglyphics on the wall.",
                        "example_tr": "Duvardaki hiyeroglifleri çözdüler.",
                        "strength": "Tarihi"
                    }
                ]
            },
            "antonyms": [
                {
                    "word": "illiteracy",
                    "value": 1,
                    "turkish": "cahillik / okuma yazma bilmeme",
                    "note": "Alfabeye hakim olmama durumu",
                    "description_tr": "Okuma yazma becerisinin olmaması durumudur.",
                    "example_en": "They started a campaign to fight illiteracy.",
                    "example_tr": "Cahillikle (okuma yazma bilmemekle) savaşmak için kampanya başlattılar."
                }
            ]
        },
        "pragmatics": {
            "idioms_and_phrases": [
                {
                    "phrase": "alphabet soup",
                    "meaning_tr": "kısaltma çorbası (çok fazla kısaltma içeren metin)",
                    "register": "humorous",
                    "example": "The report was a veritable alphabet soup of government agencies.",
                    "example_tr": "Rapor, devlet kurumlarının kısaltmalarıyla dolu bir çorbaya dönmüştü."
                },
                {
                    "phrase": "the ABCs of something",
                    "meaning_tr": "bir işin alfabesi (temel kuralları)",
                    "register": "idiomatic",
                    "example": "He taught me the ABCs of investing.",
                    "example_tr": "Bana yatırım yapmanın alfabesini (temelini) öğretti."
                }
            ],
            "sociolinguistics": {
                "topic": "Code Names",
                "note_en": "Government agencies often use 'Alphabet Agencies' (FBI, CIA, NSA) as a term. It refers to organizations known by their acronyms.",
                "note_tr": "FBI, CIA gibi kurumlar 'Alphabet Agencies' olarak bilinir."
            }
        },
        "cultural_context": {
            "register": {
                "level": "neutral",
                "description": "Akademik ve günlük dilde ortaktır."
            },
            "inclusive_language": null,
            "grammar_nuance": {
                "title": "Alphabet vs Letters",
                "content": "İngilizcede 26 'harf' (letters) vardır, 26 'alfabe' değil. 'Alphabet' tekil bir setin adıdır. 'Do you know your alphabets?' sorusu yanlıştır, 'Do you know your letters?' denir."
            },
            "business_english": {
                "title": "Alphabet Inc.",
                "content": "Google'ın çatı şirketi 'Alphabet Inc.'dir. Bu isim, dilin temeli (alfabe) ve yatırım getirisi (Alpha-bet) kelime oyununa dayanır."
            },
            "trivia": {
                "title": "& (Ampersand)",
                "content": "Eskiden '&' işareti alfabenin 27. harfi sayılırdı ve 'and, per se, and' olarak okunurdu. Zamanla 'Ampersand' ismini aldı."
            }
        },
        "exam_strategies": {
            "frequency": {
                "yds": 30,
                "yokdil": 50,
                "ydt": 40,
                "description": "Linguistics (Dilbilim) ve Tarih metinlerinde (Fenikeliler vb.) çıkar."
            },
            "vocabulary": [
                {
                    "title": "Acronym vs Initialism",
                    "content": "NATO (okunur) bir 'Acronym', FBI (harf harf okunur) bir 'Initialism'dir. Her ikisi de alfabe temellidir."
                },
                {
                    "title": "Vowel & Consonant",
                    "content": "Sınavda 'vowel' (ünlü) ve 'consonant' (ünsüz) terimleri 'alphabet' ile bağlantılı sorulabilir."
                }
            ],
            "grammar": [],
            "reading": [
                {
                    "title": "Tarihsel Metinler",
                    "content": "Parçada 'cuneiform' (çivi yazısı) veya 'hieroglyph' geçiyorsa, konu muhtemelen alfabenin evrimi ve yazı tarihidir."
                }
            ]
        },
        "morphology_tree": {
            "root": "Alpha + Beta (Greek)",
            "family_members": [
                { "word": "alphabet", "pos": "n", "level": "A2", "note": "alfabe" },
                { "word": "alphabetical", "pos": "adj", "level": "B1", "suffix": "-ical", "note": "alfabetik, abecesel" },
                { "word": "alphabetize", "pos": "v", "level": "C1", "suffix": "-ize", "note": "alfabetik sıraya koymak" },
                { "word": "literacy", "pos": "n", "level": "B2", "note": "okuryazarlık (alfabe bilgisi)" },
                { "word": "illiterate", "pos": "adj", "level": "B2", "note": "okuma yazma bilmeyen" }
            ]
        },
        "pedagogy_engine": {
            "common_errors": [
                {
                    "error_id": "err_plural_count",
                    "incorrect": "English contains 26 alphabets.",
                    "correction": "English contains 26 letters.",
                    "explanation": "İngilizcede 1 alfabe (set), 26 harf (parça) vardır. 'Alphabets' derseniz birden fazla dil sistemi (Yunan, Latin, Arap vb.) kastedersiniz."
                }
            ],
            "exam_prep": {
                "ielts_tag": "Linguistics",
                "tip": "Reading parçalarında 'literacy rate' (okuryazarlık oranı) konusu geçtiğinde 'alphabet equivalent' veya 'script' kelimelerine dikkat edin.",
                "keywords": ["phoneme", "grapheme", "transliteration"]
            },
            "gamification": {
                "challenge_type": "sequence",
                "question": "Which comes first in alphabetical order?",
                "answer": "Abacus",
                "distractors": ["Abandon", "Ability", "Abroad"],
                "explanation": "Abacus (A-B-A), Abandon (A-B-A-N)... C, N'den önce gelir."
            }
        },
        "word_journey": {
            "timeline": [
                { "era": "Phoenician", "word": "Aleph+Beth", "meaning": "ox + house (first two letters)" },
                { "era": "Greek", "word": "Alpha+Beta", "meaning": "first two letters of Greek alphabet" },
                { "era": "Latin", "word": "alphabetum", "meaning": "list of letters" }
            ],
            "turkish_cognate_hint": {
                "word": "Alfabe",
                "connection_type": "Direct Loan",
                "story": "Türkçedeki 'Alfabe' ile İngilizce 'Alphabet' %100 aynı kökten gelir: Yunan alfabesinin ilk iki harfi 'Alpha' (A) ve 'Beta' (B). Nasıl ki biz eskiden 'Elif-Ba' (Arap alfabesinin ilk iki harfi) diyorsak, batı dilleri de 'Alpha-Beta' demiştir.",
                "example": "Alpha (A) + Beta (B) = Alphabet."
            }
        },
        "stories": {
            "A1": {
                "tr": "Okulda <strong>alfabe</strong>yi öğreniyoruz. Öğretmenimiz tahtaya 'A, B, C' yazıyor. Biz şarkı söylüyoruz. 'A elma (apple) için, B top (ball) için.' <strong>Alfabe</strong> şarkısını çok seviyorum. Tüm harfleri biliyorum.",
                "en": "We are learning the <strong>alphabet</strong> at school. Our teacher writes 'A, B, C' on the board. We sing a song. 'A is for apple, B is for ball.' I love the <strong>alphabet</strong> song. I know all the letters."
            },
            "A2": {
                "tr": "Kütüphanede kitap bulmak kolaydır. Çünkü kitaplar <strong>alfabetik</strong> sıraya (alphabetical order) göredir. Yazarın adını biliyorsan, kitabı bulabilirsin. 'Z' harfindeki bir kitabı arıyorsan, en sona bakmalısın. <strong>Alfabe</strong> bize düzen sağlar.",
                "en": "Finding a book in the library is easy. Because books are in <strong>alphabetical order</strong>. If you know the author's name, you can find the book. If you are looking for a book at the letter 'Z', you must look at the very end. The <strong>alphabet</strong> provides us order."
            },
            "B1": {
                "tr": "Tarihte ilk gerçek <strong>alfabe</strong>yi Fenikeliler icat etti. Onlar tüccardı ve hızlı yazmaları gerekiyordu. Mısırlıların hiyeroglifleri (resim yazısı) çok zordu. Fenikeliler her ses için bir sembol yaptı. Bu sistem çok basitti. Yunanlılar bunu alıp geliştirdiler ve bugünkü <strong>alfabe</strong>mizin temelini attılar.",
                "en": "In history, the Phoenicians invented the first real <strong>alphabet</strong>. They were merchants and needed to write quickly. Egyptian hieroglyphs (picture writing) were too difficult. Phoenicians made one symbol for each sound. This system was very simple. The Greeks took this and improved it, laying the foundation of our current <strong>alphabet</strong>."
            },
            "B2": {
                "tr": "Uluslararası uçuşlarda pilotlar ve kuleler NATO Fonetik <strong>Alfabe</strong>sini kullanır. Bir harfi yanlış anlamak felakete yol açabilir. Bu yüzden 'B' demezler, 'Bravo' derler. 'M' ve 'N' telefonda çok karışır, bu yüzden 'Mike' ve 'November' kullanılır. Bu standartlaştırılmış <strong>alfabe</strong>, dünya çapında havacılık güvenliğini sağlar.",
                "en": "On international flights, pilots and towers use the NATO Phonetic <strong>Alphabet</strong>. Misunderstanding a letter can lead to disaster. That's why they don't say 'B', they say 'Bravo'. 'M' and 'N' get confused easily on the phone, so 'Mike' and 'November' are used. This standardized <strong>alphabet</strong> ensures aviation safety worldwide."
            },
            "C1": {
                "tr": "Türkiye Cumhuriyeti'nin kuruluşuyla birlikte yapılan en büyük devrimlerden biri Harf Devrimi'ydi. 1928'de Arap alfabesinden Latin <strong>alfabe</strong>sine geçildi. Bu sadece bir sembol değişikliği (transliterasyon) değildi; kültürel bir yön değişimiydi. Yeni <strong>alfabe</strong>, Türkçenin sesli harf yapısına (vokal uyumu) daha uygundu ve okuryazarlık oranının hızla artmasını sağladı.",
                "en": "One of the greatest revolutions following the foundation of the Turkish Republic was the Letter Revolution. In 1928, there was a shift from the Arabic script to the Latin <strong>alphabet</strong>. This was not merely a change of symbols (transliteration); it was a cultural reorientation. The new <strong>alphabet</strong> was more suitable for the vowel structure of Turkish and facilitated a rapid increase in the literacy rate."
            },
            "C2": {
                "tr": "Medeniyet tarihçileri, <strong>alfabe</strong>nin icadını insan zihninin en büyük soyutlama başarısı olarak görür. Somut bir resmi (bir öküz başı) alıp onu soyut bir sesi (/a/) temsil eden bir çizgiye indirgemek, bilişsel bir sıçramadır. Bu 'demokratik' teknoloji, bilgiyi elit rahiplerin tekelinden çıkarıp sıradan insana sunmuştur. Marshall McLuhan'ın dediği gibi, 'Fonetik <strong>alfabe</strong>, gözü kulağa tercih eden, rasyonel ve çizgisel düşünen modern insanı yaratmıştır.'",
                "en": "Historians of civilization view the invention of the <strong>alphabet</strong> as the human mind's greatest feat of abstraction. Taking a concrete image (an ox head) and reducing it to a line representing an abstract sound (/a/) is a cognitive leap. This 'democratic' technology took knowledge out of the monopoly of elite priests and offered it to the common man. As Marshall McLuhan said, 'The phonetic <strong>alphabet</strong> created the modern man who prefers the eye to the ear and thinks rationally and linearly.'"
            }
        }
    },
    {  // ambulance
        "id": "1007-ambulance", "word": "ambulance",
        "meta": {
            "version": "2.2.0",
            "dictionary_type": "learner_advanced",
            "cefr_level": "A2",
            "frequency_rank": 2500,
            "frequency_band": "Medium Frequency",
            "part_of_speech": ["noun"]
        },
        "phonetics": {
            "ipa_us": "/ˈæm.bjə.ləns/",
            "ipa_uk": "/ˈæm.bjə.ləns/",
            "audio_us": "/assets/audio/us/ambulance.mp3",
            "audio_uk": "/assets/audio/uk/ambulance.mp3",
            "syllabification": ["am", "bu", "lance"],
            "stress_data": {
                "pattern": "Dactyl (Strong-Weak-Weak)",
                "primary_stress_index": 0
            }
        },
        "definitions": [
            {
                "sense_id": "def_1",
                "core_meaning_en": "a special vehicle used to take sick or injured people to hospital",
                "core_meaning_tr": "ambulans, cankurtaran",
                "context_tags": ["medical", "emergency"],
                "example": {
                    "sentence": "The ambulance arrived within ten minutes.",
                    "translation": "Ambulans on dakika içinde geldi."
                }
            }
        ],
        "grammar_profile": {
            "structures": [
                {
                    "pattern": "call an ambulance",
                    "usage_level": "Core",
                    "notes_tr": "En hayati kalıptır. 'Phone' veya 'ring' yerine genellikle 'call' kullanılır."
                },
                {
                    "pattern": "go by ambulance / in an ambulance",
                    "usage_level": "Intermediate",
                    "notes_tr": "Ulaşım aracı olarak: 'He was taken to hospital by ambulance.'"
                }
            ],
            "tense_logic": {
                "why_use_it": "Acil durum aracı olarak.",
                "critical_comparison": {
                    "context": "Ambulance vs Paramedic",
                    "rule": "'Ambulance' araçtır. 'Paramedic' veya 'EMT' ise o aracın içindeki sağlık personelidir.",
                    "example_wrong": "The ambulance treated me. (Yanlış - Araç tedavi etmez)",
                    "example_right": "The paramedics in the ambulance treated me. (Doğru)"
                }
            }
        },
        "sentence_progression": {
            "description": "Kelimenin seviyelere göre kullanım karmaşıklığı",
            "levels": [
                {
                    "cefr": "A1",
                    "en": "Look, an ambulance!",
                    "tr": "Bak, bir ambulans!",
                    "grammar_focus": "Exclamation / Noun"
                },
                {
                    "cefr": "A2",
                    "en": "We need to call an ambulance immediately.",
                    "tr": "Hemen bir ambulans çağırmalıyız.",
                    "grammar_focus": "Modal (need to) + Adverb"
                },
                {
                    "cefr": "B1",
                    "en": "The ambulance siren was very loud.",
                    "tr": "Ambulans sireni çok gürültülüydü.",
                    "grammar_focus": "Past Tense Description"
                },
                {
                    "cefr": "B2",
                    "en": "Drivers must pull over to let the ambulance pass.",
                    "tr": "Sürücüler ambulansın geçmesi için kenara çekilmelidir.",
                    "grammar_focus": "Phrasal Verb (pull over) + Purpose Clause"
                },
                {
                    "cefr": "C1",
                    "en": "He was rushed to the hospital in an ambulance.",
                    "tr": "Hastaneye ambulansla aceleyle yetiştirildi.",
                    "grammar_focus": "Passive Voice + Idiomatic Verb (rush)"
                }
            ]
        },
        "morphology_tree": {
            "root": "ambulare (Latin 'to walk')",
            "family_members": [
                { "word": "ambulance", "pos": "n", "level": "A2", "note": "yürüyen hastane -> ambulans" },
                { "word": "ambulator", "pos": "v", "level": "C2", "note": "gezinmek, yürümek (tıbbi)" },
                { "word": "ambulatory", "pos": "adj", "level": "C2", "note": "ayakta tedavi edilen, yürüyebilen" },
                { "word": "somnambulist", "pos": "n", "level": "C2", "prefix": "somn-", "note": "uyurgezer" },
                { "word": "pram", "pos": "n", "level": "B2", "note": "perambulator kısaltması (bebek arabası)" }
            ]
        },
        "collocations": {
            "modifiers_adverbs": [
                {
                    "word": "air",
                    "turkish": "hava ambulansı (helikopter)",
                    "strength": "specific",
                    "example": "The injured hiker was evacuated by air ambulance.",
                    "example_tr": "Yaralı yürüyüşçü hava ambulansı ile tahliye edildi."
                },
                {
                    "word": "private",
                    "turkish": "özel",
                    "strength": "standard",
                    "example": "Private ambulance services charge a fee.",
                    "example_tr": "Özel ambulans servisleri ücret talep eder."
                },
                {
                    "word": "blue-light",
                    "turkish": "tepe lambalı (acil giden)",
                    "strength": "idiomatic",
                    "example": "It was a blue-light run to the hospital.",
                    "example_tr": "Hastaneye (sirenler açık) acil bir sürüş yapıldı."
                }
            ],
            "verbs_preceding": [
                {
                    "word": "call",
                    "turkish": "çağırmak (telefonda)",
                    "example": "Call an ambulance immediately!",
                    "example_tr": "Derhal bir ambulans çağırın!"
                },
                {
                    "word": "dispatch",
                    "turkish": "sevk etmek (merkezden)",
                    "example": "The operator dispatched two ambulances to the scene.",
                    "example_tr": "Operatör olay yerine iki ambulans sevk etti."
                },
                {
                    "word": "rush",
                    "turkish": "aceleyle yetiştirmek",
                    "example": "He was rushed to hospital by ambulance.",
                    "example_tr": "Ambulansla hastaneye yetiştirildi."
                }
            ]
        },
        "lexical_nuance": {
            "synonym_scale": {
                "concept": "Emergency Transport",
                "turkishConcept": "Acil Taşıtlar",
                "scale": [
                    {
                        "word": "ambulance",
                        "value": 5,
                        "turkish": "ambulans",
                        "note": "Standart acil durum aracı",
                        "description_tr": "Hasta ve yaralı taşımak için donatılmış standart araçtır.",
                        "example_en": "The ambulance rushed to the scene.",
                        "example_tr": "Ambulans olay yerine hızla gitti.",
                        "strength": "Genel"
                    },
                    {
                        "word": "paramedic unit",
                        "value": 7,
                        "turkish": "ilk yardım birimi",
                        "note": "Daha teknik, personeli ve tıbbi müdahaleyi vurgular",
                        "description_tr": "İçinde ileri yaşam desteği sunabilen uzman personelin bulunduğu birimdir.",
                        "example_en": "A paramedic unit was dispatched immediately.",
                        "example_tr": "Derhal bir ilk yardım birimi sevk edildi.",
                        "strength": "Teknik"
                    },
                    {
                        "word": "medevac",
                        "value": 9,
                        "turkish": "tıbbi tahliye aracı",
                        "note": "Genellikle askeri veya helikopterle tahliye (Medical Evacuation)",
                        "description_tr": "Genellikle helikopter veya uçakla yapılan acil tıbbi tahliyedir.",
                        "example_en": "The soldier was airlifted by medevac.",
                        "example_tr": "Asker, tıbbi tahliye aracıyla (helikopterle) hava yoluyla taşındı.",
                        "strength": "Askeri/Kritik"
                    },
                    {
                        "word": "first responder",
                        "value": 4,
                        "turkish": "ilk müdahale aracı",
                        "note": "Olay yerine ambulansdan önce varan polis/itfaiye aracı",
                        "description_tr": "Olay yerine ilk varan polis, itfaiye veya gönüllü sağlık ekibi aracıdır.",
                        "example_en": "First responder vehicles are smaller and faster.",
                        "example_tr": "İlk müdahale araçları daha küçük ve daha hızlıdır.",
                        "strength": "Hızlı"
                    }
                ]
            },
            "antonyms": []
        },
        "pragmatics": {
            "idioms_and_phrases": [
                {
                    "phrase": "ambulance chaser",
                    "meaning_tr": "kazaları kovalayan çıkarcı avukat",
                    "register": "derogatory",
                    "example": "He's just an ambulance chaser looking for a lawsuit.",
                    "example_tr": "O sadece dava açmak için fırsat kollayan çıkarcı bir avukat."
                },
                {
                    "phrase": "monitor situation",
                    "meaning_tr": "durumu izlemek (sirenler kapalı)",
                    "register": "police/medical",
                    "example": "We are monitoring the patient in the ambulance.",
                    "example_tr": "Ambulansın içinde hastayı izliyoruz (takip ediyoruz)."
                }
            ],
            "sociolinguistics": {
                "topic": "Siren Etiquette",
                "note_en": "In Western countries, 'pulling over' (moving to the side) for an ambulance is a strict legal and moral duty. Drivers create an 'emergency corridor'.",
                "note_tr": "Batı ülkelerinde siren çalan ambulansa yol vermek (kenara çekilmek) katı bir yasal ve ahlaki görevdir."
            }
        },
        "cultural_context": {
            "register": {
                "level": "neutral",
                "description": "Her seviyede kullanılır."
            },
            "inclusive_language": null,
            "grammar_nuance": {
                "title": "Vehicle Prepositions",
                "content": "Ambulansın 'içinde' tedavi oluyorsanız 'in the ambulance', ulaşım aracı olarak bahsediyorsanız 'by ambulance' kullanılır."
            },
            "business_english": {
                "title": "Private Medical Transport",
                "content": "Sigorta şirketleri 'Patient Transport Service' (PTS) terimini kullanır. Bu, acil olmayan (non-emergency) hasta nakil ambulansıdır.",
                "keywords": ["PTS", "medical repatriation"]
            },
            "trivia": {
                "title": "Star of Life",
                "content": "Ambulansların üzerindeki mavi, altı uçlu yıldız ve yılanlı asa sembolüne 'Star of Life' denir. Yılanlı asa, tıbbın sembolü 'Asclepius'un asası'dır."
            }
        },
        "exam_strategies": {
            "frequency": {
                "yds": 55,
                "yokdil": 75,
                "ydt": 50,
                "description": "Sağlık bilimleri (YÖKDİL) ve trafik kazası haberlerinde (YDS) sık geçer."
            },
            "vocabulary": [
                {
                    "title": "İlgili Terimler",
                    "content": "'Stretcher' (sedye), 'Siren' (siren), 'Resuscitate' (hayata döndürmek/kalp masajı) kelimeleri ambulans bağlamında sık sorulur."
                },
                {
                    "title": "Passive Voice",
                    "content": "'He was taken to hospital' cümlesinde 'by ambulance' gizli özne gibidir, çoğu zaman yazılmaz ama ima edilir."
                }
            ],
            "grammar": [],
            "reading": [
                {
                    "title": "Afet Yönetimi (Triage)",
                    "content": "Parçada 'triage' (seçme/ayırma) geçiyorsa, ambulansların hastaları aciliyet sırasına göre taşıdığı bir afet senaryosu anlatılıyordur."
                }
            ]
        },
        "morphology_tree": {
            "root": "ambulare (Latin 'to walk')",
            "family_members": [
                { "word": "ambulance", "pos": "n", "level": "A2", "note": "yürüyen hastane -> ambulans" },
                { "word": "ambulator", "pos": "v", "level": "C2", "note": "gezinmek, yürümek (tıbbi)" },
                { "word": "ambulatory", "pos": "adj", "level": "C2", "note": "ayakta tedavi edilen, yürüyebilen hasta" },
                { "word": "somnambulist", "pos": "n", "level": "C2", "prefix": "somn-", "note": "uyurgezer (uykuda yürüyen)" },
                { "word": "pram", "pos": "n", "level": "B2", "note": "perambulator kısaltması (bebek arabası)" }
            ]
        },
        "pedagogy_engine": {
            "common_errors": [
                {
                    "error_id": "err_wrong_prep",
                    "incorrect": "She went to hospital with ambulance.",
                    "correction": "She went to hospital by ambulance.",
                    "explanation": "Taşıt araçlarıyla ulaşım belirtirken 'by' kullanılır. 'With' (ile) birliktelik bildirir, araç bildirmez."
                }
            ],
            "exam_prep": {
                "ielts_tag": "Health / Emergencies",
                "tip": "Acil durum senaryosu anlatılırken 'The ambulance arrived' yerine 'Paramedics arrived promptly via ambulance' demek kelime çeşitliliğini gösterir.",
                "keywords": ["critical condition", "stabilize", "paramedics"]
            },
            "gamification": {
                "challenge_type": "sequence",
                "question": "Order the emergency response stages:",
                "answer": "Call -> Dispatch -> Arrival -> Transport",
                "distractors": ["Transport -> Call -> Dispatch", "Arrival -> Dispatch -> Call"],
                "explanation": "Önce aranır (Call), merkez aracı yollar (Dispatch), araç varır (Arrival), hasta taşınır (Transport)."
            }
        },
        "word_journey": {
            "timeline": [
                { "era": "Latin", "word": "ambulare", "meaning": "to walk" },
                { "era": "French", "word": "hôpital ambulant", "meaning": "walking (mobile) hospital (Napoleon Era)" },
                { "era": "Modern English", "word": "ambulance", "meaning": "vehicle for transporting sick" }
            ],
            "turkish_cognate_hint": {
                "word": "Ambulans / Pera",
                "connection_type": "Loanword",
                "story": "Ambulans kelimesi 'Ambul-' (yürümek) kökünden gelir. Napolyon zamanında savaşta yaralanan askerlere giden seyyar hastanelere 'Hôpital Ambulant' (Yürüyen Hastane) denirdi. Zamanla sadece sondaki 'Ambulant/Ambulance' kaldı. Ayrıca 'Somnambulist' (Uyurgezer) kelimesinde de aynı 'ambul' (yürüme) kökü vardır.",
                "example": "Som (Uyku) + Ambul (Yürü) = Uyurgezer."
            }
        },
        "stories": {
            "A1": {
                "tr": "Caddede yüksek bir ses var. 'Vi-vu, vi-vu!' Bu bir <strong>ambulans</strong>. Kırmızı ışıkları yanıp sönüyor. Arabalar duruyor. <strong>Ambulans</strong> hızlı gidiyor. İçinde hasta bir insan var. Doktorlar ona yardım edecek.",
                "en": "There is a loud noise on the street. 'Wee-woo, wee-woo!' It is an <strong>ambulance</strong>. Its red lights are flashing. Cars stop. The <strong>ambulance</strong> is going fast. There is a sick person inside. Doctors will help him."
            },
            "A2": {
                "tr": "Dün okulda Ali merdivenlerden düştü. Bacağı çok acıyordu. Öğretmenimiz '112'yi arayın!' dedi. Bir <strong>ambulans</strong> çağırdık. Beş dakika sonra geldiler. Sağlık görevlileri (paramedics) çok nazikti. Ali'yi <strong>ambulans</strong>a koyup hastaneye götürdüler.",
                "en": "Yesterday at school, Ali fell down the stairs. His leg hurt a lot. Our teacher said, 'Call 112!' We called an <strong>ambulance</strong>. They arrived after five minutes. The paramedics were very kind. They put Ali in the <strong>ambulance</strong> and took him to the hospital."
            },
            "B1": {
                "tr": "Trafik çok sıkışıktı ama arkadan bir siren sesi duyduk. Herkes sağa çekildi ve bir koridor (şerit) açtı. <strong>Ambulans</strong> bu güvenlik şeridinden hızla geçti. Bir hayat kurtarmak için saniyeler önemlidir. Sürücülerin <strong>ambulans</strong>a yol vermesi hayati bir kuraldır.",
                "en": "The traffic was very heavy but we heard a siren from behind. Everyone pulled over to the right and opened a corridor (lane). The <strong>ambulance</strong> passed quickly through this emergency lane. Seconds are important to save a life. It is a vital rule for drivers to yield to the <strong>ambulance</strong>."
            },
            "B2": {
                "tr": "Paramedikler sadece şoför değildir; onlar hareket halindeki bir acil servistir. <strong>Ambulans</strong>ın içinde, hastayı stabilize etmek için gelişmiş ekipmanlar bulunur. Kalp krizi geçiren bir hastaya hastaneye varmadan önce müdahale edebilirler. Modern tıpta <strong>ambulans</strong>, tedavinin başladığı yerdir, sadece bir taksi değildir.",
                "en": "Paramedics are not just drivers; they are an emergency room in motion. Inside the <strong>ambulance</strong>, there is advanced equipment to stabilize the patient. They can intervene with a patient having a heart attack before reaching the hospital. In modern medicine, the <strong>ambulance</strong> is where treatment begins, it is not just a taxi."
            },
            "C1": {
                "tr": "Acil tıpta 'Altın Saat' (Golden Hour) kavramı vardır. Travma sonrası ilk bir saat hayatta kalma şansı için kritiktir. Hava <strong>ambulans</strong>ları (helikopterler) bu yüzden çok önemlidir. Trafiğin olmadığı gökyüzünde, uzak bölgelerdeki hastaları dakikalar içinde travma merkezine ulaştırabilirler. Bu hızlı tahliye (medevac) yeteneği, ölüm oranlarını ciddi şekilde düşürür.",
                "en": "In emergency medicine, there is the concept of the 'Golden Hour'. The first hour after trauma is critical for survival chances. That is why air <strong>ambulances</strong> (helicopters) are so important. In the sky where there is no traffic, they can transport patients in remote areas to a trauma center within minutes. This rapid evacuation (medevac) capability significantly reduces mortality rates."
            },
            "C2": {
                "tr": "Afet yönetiminde, kaynakların tahsisi etik bir ikilem yaratır: Sınırlı sayıdaki <strong>ambulans</strong> kime gönderilecek? Triyaj (seçme/ayırma) sistemi bu noktada devreye girer. En ağır yaralılar değil, kurtarılma şansı en yüksek olanlar önceliklendirilebilir. Bu soğukkanlı rasyonellik, kaos anında duygusal tepkilerin önüne geçmelidir. Bir <strong>ambulans</strong>ın rotası sadece bir harita sorunu değil, aynı zamanda bir ahlak felsefesi sorunudur.",
                "en": "In disaster management, resource allocation creates an ethical dilemma: To whom will the limited number of <strong>ambulances</strong> be sent? The triage system comes into play at this point. Not the most severely injured, but those with the highest chance of survival might be prioritized. This cold-blooded rationality must override emotional reactions during chaos. The route of an <strong>ambulance</strong> is not just a map problem, but also a problem of moral philosophy."
            }
        }
    },
    {  // aquarium
        "id": "1008-aquarium", "word": "aquarium",
        "meta": {
            "version": "2.2.0",
            "dictionary_type": "learner_advanced",
            "cefr_level": "A2",
            "frequency_rank": 3200,
            "frequency_band": "Low Frequency",
            "part_of_speech": ["noun"]
        },
        "phonetics": {
            "ipa_us": "/əˈkwer.i.əm/",
            "ipa_uk": "/əˈkweə.ri.əm/",
            "audio_us": "/assets/audio/us/aquarium.mp3",
            "audio_uk": "/assets/audio/uk/aquarium.mp3",
            "syllabification": ["a", "quar", "i", "um"],
            "stress_data": {
                "pattern": "Amphibrach (Weak-Strong-Weak)",
                "primary_stress_index": 1
            }
        },
        "definitions": [
            {
                "sense_id": "def_1",
                "core_meaning_en": "a glass container for keeping fish and water animals",
                "core_meaning_tr": "akvaryum (ev tipi)",
                "context_tags": ["hobby", "home"],
                "example": {
                    "sentence": "I have a goldfish in my aquarium.",
                    "translation": "Akvaryumumda bir japon balığım var."
                }
            },
            {
                "sense_id": "def_2",
                "core_meaning_en": "a building where people go to see sea animals",
                "core_meaning_tr": "dev akvaryum binası / su canlıları müzesi",
                "context_tags": ["tourism", "education"],
                "example": {
                    "sentence": "We visited the Antalya Aquarium yesterday.",
                    "translation": "Dün Antalya Akvaryumu'nu ziyaret ettik."
                }
            }
        ],
        "grammar_profile": {
            "structures": [
                {
                    "pattern": "visit the aquarium",
                    "usage_level": "Core",
                    "notes_tr": "Müze/bina anlamında kullanıldığında genellikle 'the' alır."
                },
                {
                    "pattern": "setup an aquarium",
                    "usage_level": "Intermediate",
                    "notes_tr": "Akvaryum kurmak için 'set up' fiili kullanılır."
                }
            ],
            "tense_logic": {
                "why_use_it": "Latince kökenli kelime.",
                "critical_comparison": {
                    "context": "Plural: Aquariums vs Aquaria",
                    "rule": "İngilizcede her ikisi de doğrudur. 'Aquariums' günlük dilde daha yaygındır. 'Aquaria' ise daha bilimsel/teknik metinlerde geçer.",
                    "example_wrong": "The museum has two big aquaria. (Doğru ama çok resmi)",
                    "example_right": "The museum has two big aquariums. (Daha yaygın)"
                }
            }
        },
        "sentence_progression": {
            "description": "Kelimenin seviyelere göre kullanım karmaşıklığı",
            "levels": [
                {
                    "cefr": "A1",
                    "en": "The fish in the aquarium are orange.",
                    "tr": "Akvaryumdaki balıklar turuncudur.",
                    "grammar_focus": "Preposition Phrase (in the...)"
                },
                {
                    "cefr": "A2",
                    "en": "We saw a shark at the aquarium.",
                    "tr": "Akvaryumda (dev akvaryum binası) bir köpekbalığı gördük.",
                    "grammar_focus": "Past Simple"
                },
                {
                    "cefr": "B1",
                    "en": "Keeping an aquarium requires patience and regular cleaning.",
                    "tr": "Akvaryum beslemek (bakmak), sabır ve düzenli temizlik gerektirir.",
                    "grammar_focus": "Gerund Subject"
                },
                {
                    "cefr": "B2",
                    "en": "The marine biologist works at the city aquarium.",
                    "tr": "Deniz biyoloğu şehir akvaryumunda çalışıyor.",
                    "grammar_focus": "Professional Vocabulary"
                },
                {
                    "cefr": "C1",
                    "en": "Public aquariums play a vital role in the conservation of endangered species.",
                    "tr": "Halka açık akvaryumlar, nesli tükenmekte olan türlerin korunmasında hayati bir rol oynar.",
                    "grammar_focus": "Academic (conservation, endangered)"
                }
            ]
        },
        "morphology_tree": {
            "root": "Aqua (Water) + -arium (Place)",
            "family_members": [
                { "word": "aquarium", "pos": "n", "level": "A2", "note": "su yeri -> akvaryum" },
                { "word": "aquatic", "pos": "adj", "level": "B2", "note": "suda yaşayan, suyla ilgili" },
                { "word": "aquarius", "pos": "n", "level": "C1", "note": "kova burcu (su taşıyıcı)" },
                { "word": "terrarium", "pos": "n", "level": "C1", "note": "kara canlıları için cam kafes (terra: toprak)" },
                { "word": "planetarium", "pos": "n", "level": "B2", "note": "gökevi (gezegen yeri)" }
            ]
        },
        "collocations": {
            "modifiers_adverbs": [
                {
                    "word": "saltwater",
                    "turkish": "tuzlu su",
                    "strength": "specific",
                    "example": "Saltwater aquariums are harder to maintain.",
                    "example_tr": "Tuzlu su akvaryumlarının bakımı daha zordur."
                },
                {
                    "word": "freshwater",
                    "turkish": "tatlı su",
                    "strength": "specific",
                    "example": "Goldfish live in freshwater aquariums.",
                    "example_tr": "Japon balıkları tatlı su akvaryumlarında yaşar."
                },
                {
                    "word": "public",
                    "turkish": "halka açık (dev)",
                    "strength": "standard",
                    "example": "We visited the public aquarium downtown.",
                    "example_tr": "Şehir merkezindeki halka açık akvaryumu ziyaret ettik."
                }
            ],
            "verbs_preceding": [
                {
                    "word": "maintain",
                    "turkish": "bakımını yapmak",
                    "example": "It takes time to maintain a large aquarium.",
                    "example_tr": "Büyük bir akvaryumun bakımını yapmak zaman alır."
                },
                {
                    "word": "set up",
                    "turkish": "kurmak",
                    "example": "I want to set up a tropical aquarium.",
                    "example_tr": "Tropikal bir akvaryum kurmak istiyorum."
                },
                {
                    "word": "stock",
                    "turkish": "balıkla doldurmak",
                    "example": "He stocked the aquarium with neon tetras.",
                    "example_tr": "Akvaryumu neon tetra balıklarıyla doldurdu."
                }
            ]
        },
        "lexical_nuance": {
            "synonym_scale": {
                "concept": "Enclosures for Aquatic Life",
                "turkishConcept": "Su Canlıları Alanları",
                "scale": [
                    {
                        "word": "fish bowl",
                        "value": 2,
                        "turkish": "fanus",
                        "note": "Küçük, yuvarlak, filtresiz cam kap (genellikle Japon balığı için)",
                        "description_tr": "Genellikle tek bir balık için kullanılan küçük, yuvarlak cam kap.",
                        "example_en": "You shouldn't keep a goldfish in a small bowl.",
                        "example_tr": "Bir japon balığını küçük bir fanusta beslememelisin.",
                        "strength": "Basit"
                    },
                    {
                        "word": "fish tank",
                        "value": 5,
                        "turkish": "balık tankı",
                        "note": "Ev tipi, genellikle dikdörtgen cam sistem",
                        "description_tr": "Evde balık beslemek için kullanılan standart dikdörtgen cam prizmadır.",
                        "example_en": "He cleaned the algae off the fish tank.",
                        "example_tr": "Balık tankındaki yosunları temizledi.",
                        "strength": "Standart"
                    },
                    {
                        "word": "aquarium",
                        "value": 8,
                        "turkish": "akvaryum",
                        "note": "Hem evdeki tank hem de devasa turistik tesis",
                        "description_tr": "Hem ev tipi tankı hem de içinde gezilebilen büyük su canlıları müzesini ifade eder.",
                        "example_en": "The city aquarium has a shark tunnel.",
                        "example_tr": "Şehir akvaryumunda bir köpekbalığı tüneli var.",
                        "strength": "Kapsamlı"
                    },
                    {
                        "word": "oceanarium",
                        "value": 10,
                        "turkish": "okyanus akvaryumu",
                        "note": "Açık denize bağlı veya devasa deniz parkı (SeaWorld vb.)",
                        "description_tr": "Okyanus canlılarını büyük ölçekte barındıran devasa tesistir.",
                        "example_en": "The oceanarium houses whales and dolphins.",
                        "example_tr": "Okyanus akvaryumu balinalara ve yunuslara ev sahipliği yapıyor.",
                        "strength": "Devasa"
                    }
                ]
            },
            "antonyms": []
        },
        "pragmatics": {
            "idioms_and_phrases": [
                {
                    "phrase": "living in a fishbowl",
                    "meaning_tr": "kendi halinde/göz önünde yaşamak (gizlisi saklısı olmamak)",
                    "register": "idiomatic",
                    "example": "Celebrities often feel like they are living in a fishbowl.",
                    "example_tr": "Ünlüler genellikle fanusta yaşıyormuş gibi hissederler (her an izleniyorlar)."
                }
            ],
            "sociolinguistics": {
                "topic": "Conservation",
                "note_en": "Modern aquariumsbrand themselves as 'conservation centers' rather than zoos to emphasize their role in saving endangered species.",
                "note_tr": "Modern akvaryumlar kendilerini hayvanat bahçesi olarak değil, 'koruma merkezi' olarak tanıtır."
            }
        },
        "cultural_context": {
            "register": {
                "level": "neutral",
                "description": "Bilimsel ve günlük dilde kullanılır."
            },
            "inclusive_language": null,
            "grammar_nuance": {
                "title": "Plural: Aquariums vs Aquaria",
                "content": "Latince kökenli olduğu için çoğulu 'Aquaria' olabilir ama modern İngilizcede %95 oranında 'Aquariums' kullanılır. 'Aquaria' aşırı teknik kaçar."
            },
            "business_english": {
                "title": "Aquascape",
                "content": "Akvaryum peyzajı mimarlığına 'Aquascaping' denir. Bu, niş bir iş koludur ve sanat dalı olarak kabul edilir.",
                "keywords": ["hardscape", "substrate", "flora"]
            },
            "trivia": {
                "title": "Feng Shui",
                "content": "Asya kültüründe ve Feng Shui felsefesinde akvaryumlar zenginlik ve bereket getirdiğine inanıldığı için iş yerlerinde çok yaygındır."
            }
        },
        "exam_strategies": {
            "frequency": {
                "yds": 20,
                "yokdil": 30,
                "ydt": 25,
                "description": "Çevre ve Biyoloji metinlerinde (Environment/Biology) nadiren çıkar."
            },
            "vocabulary": [
                {
                    "title": "Tank",
                    "content": "Sınavda 'aquarium' yerine 'tank' veya 'vessel' kelimeleri eş anlamlı olarak kullanılabilir."
                },
                {
                    "title": "Marine vs Aquatic",
                    "content": "'Marine' (deniz/tuzlu su) ve 'Aquatic' (sucul/genel) ayrımına dikkat edin. Akvaryumlar her ikisini de barındırabilir."
                }
            ],
            "grammar": [],
            "reading": [
                {
                    "title": "Esaret Tartışması",
                    "content": "Parçada 'captivity' (esaret) ve 'conservation' (koruma) zıtlığı varsa, konu hayvanat bahçeleri veya akvaryumların etiğidir."
                }
            ]
        },
        "morphology_tree": {
            "root": "Aqua (Water) + -arium (Place)",
            "family_members": [
                { "word": "aquarium", "pos": "n", "level": "A2", "note": "su yeri -> akvaryum" },
                { "word": "aquatic", "pos": "adj", "level": "B2", "note": "suda yaşayan, suyla ilgili" },
                { "word": "aquarius", "pos": "n", "level": "C1", "note": "kova burcu (su taşıyıcı)" },
                { "word": "terrarium", "pos": "n", "level": "C1", "note": "kara canlıları için cam kafes (terra: toprak)" },
                { "word": "vivarium", "pos": "n", "level": "C2", "note": "canlılar için yaşam alanı (genel terim)" },
                { "word": "planetarium", "pos": "n", "level": "B2", "note": "gökevi (gezegen yeri)" }
            ]
        },
        "pedagogy_engine": {
            "common_errors": [
                {
                    "error_id": "err_spelling_agua",
                    "incorrect": "aguarium",
                    "correction": "aquarium",
                    "explanation": "İspanyolcadaki 'agua' ile karıştırılıp 'g' ile yazılmamalıdır. Latince 'aqua' (q) köküdür."
                }
            ],
            "exam_prep": {
                "ielts_tag": "Environment",
                "tip": "Speaking sınavında hobilerinizden bahsederken 'aquascaping' (su altı peyzajı) terimini kullanmak çok etkileyici ve ileri seviye bir kelimedir.",
                "keywords": ["ecosystem", "marine life", "coral reef"]
            },
            "gamification": {
                "challenge_type": "analogy",
                "question": "Bird is to Cage as Fish is to _____",
                "answer": "Aquarium (or Tank)",
                "distractors": ["Pool", "Sea", "Net"]
            }
        },
        "word_journey": {
            "timeline": [
                { "era": "Latin", "word": "aquarium", "meaning": "watering place for cattle" },
                { "era": "19th Century", "word": "aquarium", "meaning": "vessel for aquatic plants/animals (vivarium derivative)" }
            ],
            "turkish_cognate_hint": {
                "word": "Akvaryum / Solaryum",
                "connection_type": "Suffix Pattern",
                "story": "İngilizcede ve Türkçede sonu '-arium' veya '-aryum' ile biten kelimeler hep 'bir şeyin yapıldığı YER' anlamına gelir. \n- Aquarium: Aqua (Su) + Arium (Yer) = Su yeri.\n- Solarium: Solar (Güneş) + Arium (Yer) = Güneşlenme yeri.\n- Terrarium: Terra (Toprak) + Arium (Yer) = Toprak yeri (sürüngenler için).\n- Planetarium: Planet (Gezegen) + Arium (Yer) = Gezegen evi.",
                "example": "Aqua -> Akvaryum."
            }
        },
        "stories": {
            "A1": {
                "tr": "Odamda küçük bir <strong>akvaryum</strong> var. İçinde üç balık var. İsimleri Mavi, Kırmızı ve Sarı. Onları izlemeyi seviyorum. Suda yüzüyorlar. Ben onlara her sabah yem veriyorum. <strong>Akvaryum</strong> benim için televizyondan daha güzel.",
                "en": "There is a small <strong>aquarium</strong> in my room. There are three fish inside. Their names are Blue, Red, and Yellow. I like watching them. They swim in the water. I give them food every morning. The <strong>aquarium</strong> is better than television for me."
            },
            "A2": {
                "tr": "Sınıf gezisinde büyük bir <strong>akvaryum</strong>a gittik. Dev bir tünel vardı. Başımızın üstünde köpekbalıkları yüzüyordu. Çok heyecan vericiydi. Rehber bize deniz kaplumbağalarını gösterdi. <strong>Akvaryum</strong>da flaşlı fotoğraf çekmek yasaktı çünkü balıklar korkabilir.",
                "en": "On a class trip, we went to a big <strong>aquarium</strong>. There was a giant tunnel. Sharks were swimming above our heads. It was very exciting. The guide showed us the sea turtles. Taking photos with flash was forbidden in the <strong>aquarium</strong> because fish can get scared."
            },
            "B1": {
                "tr": "Ağabeyim geçen hafta eve tuzlu su <strong>akvaryum</strong>u kurmaya karar verdi. Bu, normal bir akvaryumdan çok daha zor. Suyun tuz oranını ve sıcaklığını sürekli kontrol etmesi gerekiyor. Ayrıca özel ışıklar ve mercanlar (corals) satın aldı. <strong>Akvaryum</strong> hobisi (aquarium keeping) pahalı ama rahatlatıcı bir uğraş.",
                "en": "My brother decided to set up a saltwater <strong>aquarium</strong> at home last week. This is much harder than a normal aquarium. He needs to check the water salinity and temperature constantly. He also bought special lights and corals. <strong>Aquarium</strong> keeping is an expensive but relaxing hobby."
            },
            "B2": {
                "tr": "Bir <strong>akvaryum</strong> sadece su dolu bir cam kutu değildir; o kapalı bir ekosistemdir. Balıkların atıkları suyu kirletir, ancak yararlı bakteriler bu atığı temizler. Eğer bu denge bozulursa, balıklar ölür. Başarılı bir <strong>akvaryum</strong> sahibi olmak için biraz kimya, biraz biyoloji bilmek gerekir. Doğanın döngüsünü taklit etmek büyüleyicidir.",
                "en": "An <strong>aquarium</strong> is not just a glass box full of water; it is a closed ecosystem. Fish waste pollutes the water, but beneficial bacteria clean this waste. If this balance is disturbed, the fish die. To be a successful <strong>aquarium</strong> owner, one needs to know a little chemistry and biology. Mimicking nature's cycle is fascinating."
            },
            "C1": {
                "tr": "Modern şehir <strong>akvaryum</strong>ları artık sadece eğlence merkezi değil, aynı zamanda araştırma enstitüleridir. Birçok deniz canlısı, okyanus kirliliği ve iklim değişikliği nedeniyle tehdit altındadır. <strong>Akvaryum</strong>lar, bu türler için güvenli üreme programları yürütür. Eleştirmenler hayvanların hapsedilmesine karşı çıksa da, destekçiler bu tesislerin eğitim ve farkındalık yarattığını savunuyor.",
                "en": "Modern city <strong>aquariums</strong> are no longer just entertainment centers, but also research institutes. Many marine creatures are threatened by ocean pollution and climate change. <strong>Aquariums</strong> conduct safe breeding programs for these species. While critics oppose the confinement of animals, supporters argue that these facilities create education and awareness."
            },
            "C2": {
                "tr": "Filozoflar bazen insanlık durumunu bir <strong>akvaryum</strong>a benzetir. Görünmez cam duvarlarla (kültürel normlar, dil, algı sınırları) çevriliyizdir ve içinde yüzdüğümüz suyun farkında değilizdir. Platon'un mağarası gibi, <strong>akvaryum</strong>daki balık da dış dünyayı sadece camdaki yansımalardan ibaret sanır. Özgürlük, belki de o camı kırmak değil, suyun (içinde yaşadığımız gerçekliğin) doğasını anlamaktır.",
                "en": "Philosophers sometimes compare the human condition to an <strong>aquarium</strong>. We are surrounded by invisible glass walls (cultural norms, language, perceptual limits) and are unaware of the water we swim in. Like Plato's cave, the fish in the <strong>aquarium</strong> thinks the outside world consists only of reflections on the glass. Freedom is perhaps not breaking that glass, but understanding the nature of the water (the reality we live in)."
            }
        }
    },
    {  // arrive
        "id": "1009-arrive", "word": "arrive",
        "meta": {
            "version": "2.2.0",
            "dictionary_type": "learner_advanced",
            "cefr_level": "A1",
            "frequency_rank": 600,
            "frequency_band": "High Frequency",
            "part_of_speech": ["verb"]
        },
        "phonetics": {
            "ipa_us": "/əˈraɪv/",
            "ipa_uk": "/əˈraɪv/",
            "audio_us": "/assets/audio/us/arrive.mp3",
            "audio_uk": "/assets/audio/uk/arrive.mp3",
            "syllabification": ["ar", "rive"],
            "stress_data": {
                "pattern": "Iamb (Weak-Strong)",
                "primary_stress_index": 1
            }
        },
        "definitions": [
            {
                "sense_id": "def_1",
                "core_meaning_en": "to reach a place, especially at the end of a journey",
                "core_meaning_tr": "varmak, ulaşmak, gelmek",
                "context_tags": ["travel", "movement"],
                "example": {
                    "sentence": "The train arrived at the station on time.",
                    "translation": "Tren istasyona zamanında vardı."
                }
            },
            {
                "sense_id": "def_2",
                "core_meaning_en": "to happen or start to exist",
                "core_meaning_tr": "gelip çatmak (zaman vb.), ortaya çıkmak",
                "context_tags": ["time", "event"],
                "example": {
                    "sentence": "The moment of decision has arrived.",
                    "translation": "Karar anı gelip çattı."
                }
            }
        ],
        "grammar_profile": {
            "structures": [
                {
                    "pattern": "arrive at [Place/Point]",
                    "usage_level": "Core",
                    "notes_tr": "Küçük yerler veya belirli noktalar için 'at' kullanılır (arrive at the airport, arrive at school)."
                },
                {
                    "pattern": "arrive in [City/Country]",
                    "usage_level": "Core",
                    "notes_tr": "Büyük yerler, şehirler ve ülkeler için 'in' kullanılır (arrive in London, arrive in Turkey). ASLA 'arrive to' kullanılmaz."
                }
            ],
            "tense_logic": {
                "why_use_it": "Sonuç odaklı bir eylem fiili.",
                "critical_comparison": {
                    "context": "Arrive vs Reach vs Get to",
                    "rule": "'Arrive' edat (at/in) alır. 'Reach' edat almaz (reach the station). 'Get to' ise 'to' alır (get to the station).",
                    "example_wrong": "I arrived to London. (HATA - 'to' kullanılmaz)",
                    "example_right": "I arrived in London. / I got to London."
                }
            }
        },
        "sentence_progression": {
            "description": "Kelimenin seviyelere göre kullanım karmaşıklığı",
            "levels": [
                {
                    "cefr": "A1",
                    "en": "When do you arrive?",
                    "tr": "Ne zaman varırsın/gelirsin?",
                    "grammar_focus": "Present Simple (Schedule)"
                },
                {
                    "cefr": "A2",
                    "en": "We arrived home late last night.",
                    "tr": "Dün gece eve geç vardık.",
                    "grammar_focus": "Adverb (Home takes no preposition)"
                },
                {
                    "cefr": "B1",
                    "en": "The police arrived at the scene of the crime.",
                    "tr": "Polis olay yerine intikal etti (vardı).",
                    "grammar_focus": "Preposition Phase (at the scene)"
                },
                {
                    "cefr": "B2",
                    "en": "We finally arrived at a conclusion after hours of debate.",
                    "tr": "Saatler süren tartışmadan sonra nihayet bir sonuca vardık.",
                    "grammar_focus": "Metaphorical usage (arrive at a conclusion)"
                },
                {
                    "cefr": "C1",
                    "en": "With his new bestseller, the author has officially arrived.",
                    "tr": "Yeni çok satan kitabıyla yazar resmen 'oldum' dedi (başarıya ulaştı/tanındı).",
                    "grammar_focus": "idiomatic meaning (to achieve success)"
                }
            ]
        },
        "morphology_tree": {
            "root": "Ad (to) + Ripa (Shore) -> Arripare",
            "family_members": [
                { "word": "arrive", "pos": "v", "level": "A1", "note": "kıyıya çıkmak -> varmak" },
                { "word": "arrival", "pos": "n", "level": "B1", "suffix": "-al", "note": "varış, geliş" },
                { "word": "river", "pos": "n", "level": "A1", "note": "nehir (kıyısı olan su)" },
                { "word": "riparian", "pos": "adj", "level": "C2", "note": "kıyı ile ilgili, nehir kıyısında bulunan" }
            ]
        },
        "collocations": {
            "modifiers_adverbs": [
                {
                    "word": "safe and sound",
                    "turkish": "sağ salim/kazasız belasız",
                    "strength": "idiomatic",
                    "example": "They arrived home safe and sound.",
                    "example_tr": "Eve sağ salim vardılar."
                },
                {
                    "word": "unexpectedly",
                    "turkish": "beklenmedik bir anda",
                    "strength": "strong",
                    "example": "Guests arrived unexpectedly.",
                    "example_tr": "Misafirler çat kapı (beklenmedik anda) geldi."
                },
                {
                    "word": "punctually",
                    "turkish": "tam vaktinde",
                    "strength": "formal",
                    "example": "Please arrive punctually for the meeting.",
                    "example_tr": "Lütfen toplantı için tam vaktinde orada olun."
                }
            ],
            "verbs_preceding": [
                {
                    "word": "fail to",
                    "turkish": "ulaşmamak/gelmemek",
                    "example": "The package failed to arrive.",
                    "example_tr": "Paket yerine ulaşmadı."
                },
                {
                    "word": "be due to",
                    "turkish": "gelmesi beklenmek/planlanmak",
                    "example": "The train is due to arrive at 10.",
                    "example_tr": "Trenin 10'da gelmesi planlanıyor."
                },
                {
                    "word": "await",
                    "turkish": "gelmesini beklemek",
                    "example": "We are awaiting his arrival.",
                    "example_tr": "Onun gelişini bekliyoruz."
                }
            ]
        },
        "lexical_nuance": {
            "synonym_scale": {
                "concept": "Movement to Destination",
                "turkishConcept": "Hedefe Ulaşma",
                "scale": [
                    {
                        "word": "come",
                        "value": 3,
                        "turkish": "gelmek",
                        "note": "Hareket konuşana doğru (Come here)",
                        "description_tr": "Konuşmacının olduğu yere doğru hareketi ifade eder.",
                        "example_en": "Can you come here please?",
                        "example_tr": "Buraya gelebilir misin lütfen?",
                        "strength": "Basit"
                    },
                    {
                        "word": "get to",
                        "value": 5,
                        "turkish": "gitmek/varmak",
                        "note": "Günlük dil, süreç içerir (How do I get to...?)",
                        "description_tr": "Günlük dilde bir yere ulaşmayı anlatır, genellikle yol tarifi sorarken kullanılır.",
                        "example_en": "How do I get to the nearest bank?",
                        "example_tr": "En yakın bankaya nasıl giderim?",
                        "strength": "Konuşma Dili"
                    },
                    {
                        "word": "arrive",
                        "value": 7,
                        "turkish": "varmak",
                        "note": "Anlık bir olay, sonuç odaklı (The plane arrived)",
                        "description_tr": "Yolculuğun sonunda hedefe ulaşma anını belirtir.",
                        "example_en": "We arrived just in time.",
                        "example_tr": "Tam zamanında vardık.",
                        "strength": "Standart"
                    },
                    {
                        "word": "reach",
                        "value": 8,
                        "turkish": "ulaşmak/erişmek",
                        "note": "Çaba ve zorluk içerir (Reach the summit)",
                        "description_tr": "Genellikle bir çaba sonucu veya zorlukla bir noktaya erişmeyi ifade eder.",
                        "example_en": "They finally reached the top of the mountain.",
                        "example_tr": "Sonunda dağın zirvesine ulaştılar.",
                        "strength": "Güçlü"
                    }
                ]
            },
            "antonyms": [
                {
                    "word": "depart",
                    "value": 1,
                    "turkish": "kalkmak/hareket etmek",
                    "note": "Resmi (uçak/tren için)",
                    "description_tr": "Bir taşıtın veya kişinin bir yerden resmen ayrılmasıdır.",
                    "example_en": "The train departs at 09:00.",
                    "example_tr": "Tren saat 09:00'da kalkar."
                },
                {
                    "word": "leave",
                    "value": 2,
                    "turkish": "ayrılmak",
                    "note": "Genel kullanım",
                    "description_tr": "Bir yerden gitmek, çıkmak anlamında en genel fiildir.",
                    "example_en": "I have to leave now.",
                    "example_tr": "Şimdi gitmem (çıkmam) lazım."
                }
            ]
        },
        "pragmatics": {
            "idioms_and_phrases": [
                {
                    "phrase": "Dead on arrival (DOA)",
                    "meaning_tr": "Hastaneye vardığında ölü / (Mecazi) Başından başarısız, ölü doğmuş fikir",
                    "register": "medical/slang",
                    "example": "The proposal was dead on arrival.",
                    "example_tr": "Teklif daha sunulduğu an reddedildi (ölü doğdu)."
                },
                {
                    "phrase": "To have arrived",
                    "meaning_tr": "Başarmak, statü sahibi olmak, 'yırtmak'",
                    "register": "idiomatic",
                    "example": "With her new mansion, she felt she had finally arrived.",
                    "example_tr": "Yeni malikanesiyle sonunda 'başardığını/olduğunu' hissetti."
                }
            ],
            "sociolinguistics": {
                "topic": "Punctuality",
                "note_en": "In English-speaking cultures (UK/USA/Canada), 'arriving on time' for business usually means arriving 5-10 minutes early. Being exactly on time is barely acceptable, late is rude.",
                "note_tr": "İngiliz kültüründe iş randevusuna 'zamanında varmak', aslında 5-10 dakika erken gitmektir."
            }
        },
        "cultural_context": {
            "register": {
                "level": "neutral",
                "description": "Her seviyede kullanılır."
            },
            "inclusive_language": null,
            "grammar_nuance": {
                "title": "Home Rule",
                "content": "'Home' kelimesi yönelme durumunda edat almaz. 'Arrive at home' YANLIŞTIR. Doğrusu: 'Arrive home', 'Go home', 'Come home'."
            },
            "business_english": {
                "title": "ETA",
                "content": "Lojistik ve iş dünyasında 'ETA' (Estimated Time of Arrival - Tahmini Varış Zamanı) çok sık kullanılır.",
                "keywords": ["ETA", "ETD (Estimated Time of Departure)"]
            },
            "trivia": {
                "title": "River Connection",
                "content": "'Arrive' kelimesi 'River' (Nehir) ile aynı kökten gelir (Ad-Ripa: Kıyıya gitmek). Eskiden yolculuklar hep suyla biterdi."
            }
        },
        "exam_strategies": {
            "frequency": {
                "yds": 60,
                "yokdil": 50,
                "ydt": 70,
                "description": "Özellikle edat sorularında (arrive AT/IN) çok sık test edilir."
            },
            "vocabulary": [
                {
                    "title": "Reach vs Arrive",
                    "content": "Sınavda boşluktan sonra edat (at/in) varsa 'arrive', yoksa 'reach' seçilmelidir. 'Reach to' yanlıştır."
                },
                {
                    "title": "Get to",
                    "content": "'Get at' (ulaşmak/demeye getirmek) ve 'Get to' (varmak) phrasal verb ayrımlarına dikkat edin."
                }
            ],
            "grammar": [],
            "reading": [
                {
                    "title": "Varış Yanılgısı",
                    "content": "Psikoloji metinlerinde 'Arrival Fallacy' (bir hedefe varınca sonsuza dek mutlu olma yanılgısı) terimi çıkabilir."
                }
            ]
        },
        "morphology_tree": {
            "root": "Ad (to) + Ripa (Shore) -> Arripare",
            "family_members": [
                { "word": "arrive", "pos": "v", "level": "A1", "note": "kıyıya çıkmak -> varmak" },
                { "word": "arrival", "pos": "n", "level": "B1", "suffix": "-al", "note": "varış, geliş" },
                { "word": "river", "pos": "n", "level": "A1", "note": "nehir (kıyısı olan su)" },
                { "word": "riparian", "pos": "adj", "level": "C2", "note": "nehir kıyısına ait, kıyısal" }
            ]
        },
        "pedagogy_engine": {
            "common_errors": [
                {
                    "error_id": "err_arrive_to",
                    "incorrect": "We arrived to the hotel.",
                    "correction": "We arrived at the hotel.",
                    "explanation": "'Arrive' fiili yönelme (movement towards) değil nokta (point) bildirir, bu yüzden 'to' almaz. Küçük yerler için 'at', şehir/ülke için 'in' alır."
                },
                {
                    "error_id": "err_arrive_at_home",
                    "incorrect": "I arrived at home.",
                    "correction": "I arrived home.",
                    "explanation": "'Home' kelimesi burada bir zarftır (yer-yön zarfı), bu yüzden edat almaz."
                }
            ],
            "exam_prep": {
                "ielts_tag": "Transportation",
                "tip": "Havaalanı duyurularında 'Arrivals' (Gelen Yolcu) ve 'Departures' (Giden Yolcu) tabelaları temel kelimelerdir.",
                "keywords": ["ETA (Estimated Time of Arrival)", "schedule", "delay"]
            },
            "gamification": {
                "challenge_type": "fill_in_blank",
                "question": "The plane arrived ____ New York ____ 5 PM.",
                "answer": "in / at",
                "explanation": "Büyük yerler (şehir) için 'in', saatler için 'at'."
            }
        },
        "word_journey": {
            "timeline": [
                { "era": "Latin", "word": "ad (to) + ripa (shore)", "meaning": "to the shore" },
                { "era": "Old French", "word": "arriver", "meaning": "come to land" },
                { "era": "Middle English", "word": "arrive", "meaning": "reach a destination" }
            ],
            "turkish_cognate_hint": {
                "word": "River / Arrive",
                "connection_type": "Shared Root",
                "story": "İngilizcede 'River' (Nehir) kelimesi 'Ripa' (Kıyı) kökünden gelir. 'Arrive' kelimesi de (Ad-Ripa) 'Kıyıya çıkmak' demektir. Eskiden deniz yolculuğu ana ulaşım şekliydi, bir yere 'varmak' aslında karaya ayak basmaktı.",
                "example": "River (Nehir-Kıyı) -> Arrive (Kıyıya varmak)."
            }
        },
        "stories": {
            "A1": {
                "tr": "Okul otobüsü saat 8'de <strong>varıyor</strong>. Ben durakta bekliyorum. Otobüs geliyor ve kapılar açılıyor. Okula zamanında <strong>varıyoruz</strong>. Derse geç kalmayı sevmem.",
                "en": "The school bus <strong>arrives</strong> at 8 o'clock. I wait at the stop. The bus comes and the doors open. We <strong>arrive</strong> at school on time. I don't like being late for class."
            },
            "A2": {
                "tr": "Tatile gittik. Uçağımız İstanbul'a geç <strong>vardı</strong>. Havaalanından otele taksiyle gittik. Otele <strong>vardığımızda</strong> (arrived at the hotel) resepsiyon kapalıydı. Çok yorgunduk ama mutluyduk. Sonunda tatil başlamıştı.",
                "en": "We went on vacation. Our plane <strong>arrived</strong> in Istanbul late. We went to the hotel by taxi from the airport. When we <strong>arrived</strong> at the hotel, the reception was closed. We were very tired but happy. Finally, the vacation had started."
            },
            "B1": {
                "tr": "Arkadaşım dün gece bana bir mesaj attı: 'Eve sağ salim <strong>vardım</strong> (arrived safe and sound).' Yolda çok kar vardı, bu yüzden endişelenmiştim. 'Arrive' fiilini kullanırken dikkatli olmalısın. Eve <strong>vardım</strong> derken 'arrive home' denir, 'arrive at home' denmez. Çünkü 'home' burada bir zarftır.",
                "en": "My friend sent me a message last night: 'I <strong>arrived</strong> safe and sound.' There was a lot of snow on the road, so I was worried. You have to be careful when using the verb 'arrive'. When saying 'I arrived home', you don't say 'arrive at home'. Because 'home' is an adverb here."
            },
            "B2": {
                "tr": "Dedektifler olay yerine <strong>vardıklarında</strong>, kanıtlar çoktan yok olmuştu. Görünüşe göre suçlular polis <strong>varmadan</strong> hemen önce kaçmıştı. Şef, 'Yanlış bir sonuca <strong>varmak</strong> (arrive at a conclusion) istemiyorum ama bu içeriden birinin işi olabilir' dedi. Soruşturma yeni başlamıştı.",
                "en": "When the detectives <strong>arrived</strong> at the scene, the evidence had already disappeared. Appearenly, the criminals had escaped just before the police <strong>arrived</strong>. The chief said, 'I don't want to <strong>arrive</strong> at a wrong conclusion, but this might be an inside job.' The investigation had just begun."
            },
            "C1": {
                "tr": "Teknolojinin hayatımıza getirdiği en büyük illüzyon, 'anında <strong>varış</strong>' hissidir. E-postalar saniyeler içinde ulaşır, görüntülü aramalar mesafeleri yok eder. Ancak fiziksel olarak bir yere <strong>varmak</strong>, hala zaman ve çaba gerektirir. 'Varmak' kelimesinin kökündeki 'kıyıya çıkmak' metaforu bize şunu hatırlatır: Her <strong>varış</strong>, zorlu bir denizin aşılmasını gerektirir.",
                "en": "The greatest illusion technology brings to our lives is the sense of 'instant <strong>arrival</strong>'. Emails arrive in minutes, video calls annihilate distances. However, physically <strong>arriving</strong> somewhere still requires time and effort. The metaphor 'coming to shore' in the root of the word 'arrive' reminds us: Every <strong>arrival</strong> necessitates crossing a rough sea."
            },
            "C2": {
                "tr": "Mutluluk bir varış noktası (destination) mıdır, yoksa yolculuğun kendisi mi? Birçok insan, 'Şuraya <strong>vardığımda</strong> mutlu olacağım' diyerek hayatı erteler. Buna 'Varış Yanılgısı' (Arrival Fallacy) denir. Hedefe <strong>vardığınızda</strong> hissettiğiniz tatmin geçicidir. Asıl mesele, süreçten keyif alabilmektir. Çünkü nihai <strong>varış</strong> noktamız (ölüm) kaçınılmazdır; önemli olan oraya nasıl seyahat ettiğimizdir.",
                "en": "Is happiness a destination or the journey itself? Many people postpone life saying 'I will be happy when I <strong>arrive</strong> there.' This is called the 'Arrival Fallacy'. The satisfaction you feel when you <strong>arrive</strong> at the goal is temporary. The main point is to enjoy the process. Because our ultimate point of <strong>arrival</strong> (death) is inevitable; what matters is how we travel there."
            }
        }
    },
    {  // autumn
        "id": "1010-autumn", "word": "autumn",
        "meta": {
            "version": "2.2.0",
            "dictionary_type": "learner_advanced",
            "cefr_level": "A1",
            "frequency_rank": 1200,
            "frequency_band": "High Frequency",
            "part_of_speech": ["noun"]
        },
        "phonetics": {
            "ipa_us": "/ˈɔː.t̬əm/",
            "ipa_uk": "/ˈɔː.təm/",
            "audio_us": "/assets/audio/us/autumn.mp3",
            "audio_uk": "/assets/audio/uk/autumn.mp3",
            "syllabification": ["au", "tumn"],
            "stress_data": {
                "pattern": "Trochee (Strong-Weak)",
                "primary_stress_index": 0
            }
        },
        "definitions": [
            {
                "sense_id": "def_1",
                "core_meaning_en": "the season after summer and before winter",
                "core_meaning_tr": "sonbahar, güz",
                "context_tags": ["season", "time"],
                "example": {
                    "sentence": "Leaves turn brown in autumn.",
                    "translation": "Sonbaharda yapraklar kahverengiye döner."
                }
            },
            {
                "sense_id": "def_2",
                "core_meaning_en": "a period of maturity or incipient decline",
                "core_meaning_tr": "sonbahar (ömrün son dönemi/olgunluk)",
                "context_tags": ["figurative", "literary"],
                "example": {
                    "sentence": "She is in the autumn of her life.",
                    "translation": "Hayatının sonbaharını yaşıyor."
                }
            }
        ],
        "grammar_profile": {
            "structures": [
                {
                    "pattern": "in (the) autumn",
                    "usage_level": "Core",
                    "notes_tr": "Mevsimlerden önce 'in' kullanılır. 'The' opsiyoneldir (in autumn / in the autumn)."
                },
                {
                    "pattern": "autumnal (Adjective)",
                    "usage_level": "Advanced",
                    "notes_tr": "Sıfat hali: 'autumnal colors' (sonbahar renkleri)."
                }
            ],
            "tense_logic": {
                "why_use_it": "Zaman ve döngü bildirmek için.",
                "critical_comparison": {
                    "context": "Autumn vs Fall",
                    "rule": "'Autumn' İngiliz İngilizcesinde (UK) standarttır. 'Fall' Amerikan İngilizcesinde (US) standarttır. Ancak Amerikalılar da 'Autumn' kelimesini daha şiirsel/resmi bağlamda kullanır.",
                    "example_wrong": "I like the fall. (İngiltere'de biraz yabancı kaçabilir)",
                    "example_right": "I like autumn. (UK & US)"
                }
            }
        },
        "sentence_progression": {
            "description": "Kelimenin seviyelere göre kullanım karmaşıklığı",
            "levels": [
                {
                    "cefr": "A1",
                    "en": "I like autumn.",
                    "tr": "Sonbaharı severim.",
                    "grammar_focus": "Present Simple"
                },
                {
                    "cefr": "A2",
                    "en": "It rains a lot in autumn.",
                    "tr": "Sonbaharda çok yağmur yağar.",
                    "grammar_focus": "Impersonal 'It' + Adverb of Frequency"
                },
                {
                    "cefr": "B1",
                    "en": "Autumn is the best season for hiking.",
                    "tr": "Sonbahar, doğa yürüyüşü için en iyi mevsimdir.",
                    "grammar_focus": "Superlative (best)"
                },
                {
                    "cefr": "B2",
                    "en": "The autumnal equinox occurs in September.",
                    "tr": "Sonbahar ekinoksu Eylül ayında gerçekleşir.",
                    "grammar_focus": "Scientific Vocabulary (equinox)"
                },
                {
                    "cefr": "C1",
                    "en": "The forest was ablaze with autumnal colors.",
                    "tr": "Orman, sonbahar renkleriyle alev alevdi (kıp kırmızıydı).",
                    "grammar_focus": "Descriptive/Literary (ablaze)"
                }
            ]
        },
        "morphology_tree": {
            "root": "Autumnus (Latin)",
            "family_members": [
                { "word": "autumn", "pos": "n", "level": "A1", "note": "sonbahar" },
                { "word": "autumnal", "pos": "adj", "level": "C1", "note": "sonbahara ait, hazin" },
                { "word": "fall", "pos": "n", "level": "A1", "note": "sonbahar (US - yaprakların düşmesinden)" },
                { "word": "harvest", "pos": "n", "level": "B1", "note": "hasat (sonbahar aktivitesi)" }
            ]
        },
        "collocations": {
            "modifiers_adverbs": [
                {
                    "word": "golden",
                    "turkish": "altın sarısı",
                    "strength": "literary",
                    "example": "We walked through the golden autumn leaves.",
                    "example_tr": "Altın sarısı sonbahar yapraklarının arasında yürüdük."
                },
                {
                    "word": "crisp",
                    "turkish": "serin ve taze",
                    "strength": "common",
                    "example": "I love the crisp autumn air.",
                    "example_tr": "Serin ve taze sonbahar havasını severim."
                },
                {
                    "word": "mild",
                    "turkish": "yumuşak/ılıman",
                    "strength": "weather",
                    "example": "It was an unusually mild autumn.",
                    "example_tr": "Alışılmadık derecede ılıman bir sonbahardı."
                }
            ],
            "verbs_preceding": [
                {
                    "word": "arrive / set in",
                    "turkish": "gelmek / bastırmak",
                    "example": "Autumn has finally set in.",
                    "example_tr": "Sonbahar nihayet bastırdı (tamamen geldi)."
                },
                {
                    "word": "turn",
                    "turkish": "(yaprakların) rengi dönmek",
                    "example": "The leaves turn brown in autumn.",
                    "example_tr": "Sonbaharda yapraklar kahverengiye döner."
                }
            ]
        },
        "lexical_nuance": {
            "synonym_scale": {
                "concept": "The Third Season",
                "turkishConcept": "Üçüncü Mevsim",
                "scale": [
                    {
                        "word": "fall",
                        "value": 5,
                        "turkish": "sonbahar (US)",
                        "note": "Amerikan İngilizcesi (Yaprakların düşmesinden: Fall of the leaves)",
                        "description_tr": "Kuzey Amerika'da sonbahar mevsimi için kullanılan standart terimdir.",
                        "example_en": "We are going to visit Vermont this fall.",
                        "example_tr": "Bu sonbaharda Vermont'u ziyaret edeceğiz.",
                        "strength": "Yaygın (US)"
                    },
                    {
                        "word": "autumn",
                        "value": 7,
                        "turkish": "sonbahar (UK/US)",
                        "note": "İngiliz (Standart), Amerikan (Daha resmi/şiirsel)",
                        "description_tr": "İngiltere'de standart, Amerika'da ise daha resmi veya edebi kullanılan terimdir.",
                        "example_en": "Autumn days are getting shorter.",
                        "example_tr": "Sonbahar günleri kısalıyor.",
                        "strength": "Standart"
                    },
                    {
                        "word": "harvest",
                        "value": 9,
                        "turkish": "hasat zamanı",
                        "note": "Eski İngilizcede mevsimin asıl adıydı (Harvest). Şimdi sadece tarımsal dönem.",
                        "description_tr": "Tarımsal ürünlerin toplandığı dönemdir, eskiden mevsim adıydı.",
                        "example_en": "The harvest festival is next week.",
                        "example_tr": "Hasat festivali haftaya.",
                        "strength": "Tarihi/Kırsal"
                    }
                ]
            },
            "antonyms": [
                {
                    "word": "spring",
                    "value": 1,
                    "turkish": "ilkbahar",
                    "note": "Doğanın uyanışı (Spring) vs Doğanın uykuya dalışı (Autumn)",
                    "description_tr": "Kıştan sonra gelen, doğanın canlandığı mevsimdir.",
                    "example_en": "I prefer spring to autumn.",
                    "example_tr": "İlkbaharı sonbahara tercih ederim."
                }
            ]
        },
        "pragmatics": {
            "idioms_and_phrases": [
                {
                    "phrase": "Autumn years",
                    "meaning_tr": "ömrün sonbaharı (yaşlılık dönemi)",
                    "register": "polite/literary",
                    "example": "He spent his autumn years gardening.",
                    "example_tr": "Ömrünün sonbaharını bahçe işleriyle geçirdi."
                },
                {
                    "phrase": "Indian summer",
                    "meaning_tr": "pastırma yazı (sonbaharda aniden ısınan hava)",
                    "register": "idiomatic",
                    "example": "We had a lovely Indian summer this year.",
                    "example_tr": "Bu yıl harika bir pastırma yazı yaşadık."
                }
            ],
            "sociolinguistics": {
                "topic": "Back to School",
                "note_en": "Culturally, autumn is associated with 'new beginnings' as much as January, because the academic year starts in September.",
                "note_tr": "Kültürel olarak sonbahar, en az Ocak ayı kadar 'yeni başlangıçlar' demektir çünkü okul dönemi başlar."
            }
        },
        "cultural_context": {
            "register": {
                "level": "neutral",
                "description": "Günlük ve edebi dilde kullanılır."
            },
            "inclusive_language": null,
            "grammar_nuance": {
                "title": "Capitalization",
                "content": "Mevsim isimleri (spring, summer, autumn, winter) İngilizcede özel isim değildir, cümle başında değilse küçük harfle yazılır."
            },
            "business_english": null,
            "trivia": {
                "title": "Fall Back",
                "content": "Saatlerin geri alınmasını hatırlamak için: 'Spring forward, Fall back' (Baharda ileri, Güzün geri) tekerlemesi kullanılır."
            }
        },
        "exam_strategies": {
            "frequency": {
                "yds": 40,
                "yokdil": 45,
                "ydt": 50,
                "description": "Mevsimler genelde okuma parçalarında zaman zarfı olarak geçer."
            },
            "vocabulary": [
                {
                    "title": "Foliage",
                    "content": "'Foliage' (yaprak örtüsü), sonbahar manzaralarını anlatırken sık kullanılan ileri seviye bir kelimedir."
                },
                {
                    "title": "Equinox",
                    "content": "'Autumnal Equinox' (Güz Ekinoksu - 23 Eylül) fen bilimleri metinlerinde çıkabilir."
                }
            ],
            "grammar": [],
            "reading": [
                {
                    "title": "Metaforik Anlam",
                    "content": "Edebi metinlerde 'autumn', bir medeniyetin veya kişinin çöküş/olgunluk dönemini (decline/maturity) simgeler."
                }
            ]
        },
        "morphology_tree": {
            "root": "Autumnus (Latin)",
            "family_members": [
                { "word": "autumn", "pos": "n", "level": "A1", "note": "sonbahar" },
                { "word": "autumnal", "pos": "adj", "level": "C1", "note": "sonbahara ait, hazin" },
                { "word": "fall", "pos": "n", "level": "A1", "note": "sonbahar (US - yaprakların düşmesinden)" },
                { "word": "harvest", "pos": "n", "level": "B1", "note": "hasat (ürün toplama)" }
            ]
        },
        "pedagogy_engine": {
            "common_errors": [
                {
                    "error_id": "err_capitalization",
                    "incorrect": "I love Autumn.",
                    "correction": "I love autumn.",
                    "explanation": "Mevsim isimleri İngilizcede (özel bir şiirsel kişileştirme yoksa) büyük harfle yazılmaz."
                },
                {
                    "error_id": "err_pronunciation_n",
                    "incorrect": "Pronouncing the 'n' at the end.",
                    "correction": "Silent 'n' (/ˈɔː.təm/)",
                    "explanation": "Kelimenin sonundaki 'n' harfi okunmaz (Silent N). Yanlış: 'O-tumn'. Doğru: 'O-tım'."
                }
            ],
            "exam_prep": {
                "ielts_tag": "Nature & Weather",
                "tip": "Essay yazarken 'In the fall' yerine 'During the autumnal months' demek kelime hazinenizi gösterir.",
                "keywords": ["foliage", "deciduous", "migration"]
            },
            "gamification": {
                "challenge_type": "odd_one_out",
                "question": "Which word is NOT a season?",
                "answer": "Easter",
                "distractors": ["Autumn", "Winter", "Spring"]
            }
        },
        "word_journey": {
            "timeline": [
                { "era": "Etruscan/Latin", "word": "Autumnus", "meaning": "drying up season?" },
                { "era": "Old French", "word": "autompne", "meaning": "autumn" },
                { "era": "16th Century", "word": "Fall", "meaning": "short for 'fall of the leaf' (became US standard)" }
            ],
            "turkish_cognate_hint": {
                "word": "Column / Autumn",
                "connection_type": "Silent N Pattern",
                "story": "Autumn kelimesinin kökeni belirsizdir ama sonundaki 'N' harfinin okunmaması, 'Column' (Kolon), 'Damn' (Lanet) veya 'Hymn' (İlahi) kelimeleriyle aynı kuraldır. Telaffuz ederken sondaki 'n' harfini yutun.",
                "example": "Column (Kolın) -> Autumn (O-tım)."
            }
        },
        "stories": {
            "A1": {
                "tr": "Bak, ağaçlar değişiyor. Yapraklar kırmızı ve sarı. Hava biraz soğuk. Rüzgar esiyor. Bu <strong>sonbahar</strong>. Ceketimi giyiyorum. Parkta yürüyoruz.",
                "en": "Look, the trees are changing. The leaves are red and yellow. The weather is a little cold. The wind is blowing. It is <strong>autumn</strong>. I put on my jacket. We are walking in the park."
            },
            "A2": {
                "tr": "<strong>Sonbahar</strong>da okullar açılır. Yaz tatili biter. Ben yeni defterler ve kalemler alırım. Eylül, Ekim ve Kasım <strong>sonbahar</strong> aylarıdır. Kuşlar sıcak ülkelere uçar. Biz evde sıcak çikolata içeriz.",
                "en": "Schools open in <strong>autumn</strong>. Summer vacation ends. I buy new notebooks and pencils. September, October, and November are the <strong>autumn</strong> months. Birds fly to warm countries. We drink hot chocolate at home."
            },
            "B1": {
                "tr": "Çiftçiler için <strong>sonbahar</strong> çok meşgul bir zamandır. Buna 'hasat zamanı' derler. Elmalar ve kabaklar toplanmaya hazırdır. Cadılar Bayramı (Halloween) <strong>sonbahar</strong>da kutlanır. İnsanlar evlerini turuncu balkabakları ile süslerler. Doğa kış uykusuna hazırlanır.",
                "en": "For farmers, <strong>autumn</strong> is a very busy time. They call it 'harvest time'. Apples and pumpkins are ready to be picked. Halloween is celebrated in <strong>autumn</strong>. People decorate their houses with orange pumpkins. Nature prepares for winter sleep."
            },
            "B2": {
                "tr": "İngiltere'de insanlar genelde 'Autumn' der. Amerikalılar ise 'Fall' kelimesini tercih eder çünkü bu mevsimde yapraklar ağaçlardan düşer (fall). İki kelime de doğrudur. Bence <strong>sonbahar</strong> en romantik mevsimdir. Hava ne çok sıcak ne de çok soğuktur; dışarıda 'gevrek' (crisp) bir hava vardır, tam yürüyüş havasıdır.",
                "en": "In England, people usually say 'Autumn'. Americans prefer the word 'Fall' because leaves fall from the trees in this season. Both words are correct. I think <strong>autumn</strong> is the most romantic season. The weather is neither too hot nor too cold; there is a 'crisp' air outside, perfect for walking."
            },
            "C1": {
                "tr": "Bazen Kasım ayında hava aniden ısınır; güneş parlar ve sanki yaz geri gelmiş gibi hissedersiniz. Buna 'Pastırma Yazı' (Indian Summer) denir. Bu, kışın acı soğuğundan önceki son hediyedir. <strong>Sonbahar</strong>ın bu geçici sıcaklığı, doğanın bize sunduğu tatlı bir aldatmacadır. Ağaçların 'yaprak örtüsü' (foliage) en canlı renklerine bu dönemde ulaşır.",
                "en": "Sometimes in November, the weather suddenly warms up; the sun shines and you feel as if summer has returned. This is called 'Indian Summer'. This is the last gift before the bitter cold of winter. This transient warmth of <strong>autumn</strong> is a sweet deception nature offers us. The 'foliage' of the trees reaches its most vibrant colors during this period."
            },
            "C2": {
                "tr": "Edebiyatta <strong>sonbahar</strong>, genellikle melankoli ve olgunluk metaforu olarak kullanılır. John Keats, ünlü şiirinde onu 'sisler ve meyve dolu bereket mevsimi' olarak tanımlar. Gençliğin baharı bitmiştir, ama kışın ölümü henüz gelmemiştir. Bu, hayatın 'altın çağı'dır; tecrübenin hasat edildiği, dingin bir kabul dönemidir.",
                "en": "In literature, <strong>autumn</strong> is often used as a metaphor for melancholy and maturity. John Keats, in his famous ode, defines it as the 'season of mists and mellow fruitfulness'. The spring of youth is over, but the death of winter has not yet arrived. This is the 'golden age' of life; a period of serene acceptance where experience is harvested."
            }
        }
    }
];
