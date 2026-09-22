import { StoryVocabulary } from "./reading-stories";

export interface ListeningSpeaker {
    id: string;
    name: string;
    nativeName: string;
    role: string;
    avatar: string;
    pitch: number; // For SpeechSynthesis voice pitch variation
}

export interface ListeningLine {
    id: string;
    speakerId: string;
    text: string;
    phonetic?: string;
    translation: string;
    tonePrompt?: string; // e.g. "Gentle, welcoming tone", "Thoughtful and calm"
    vocabulary?: StoryVocabulary[];
}

export interface ListeningExercise {
    question: string;
    promptNative?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    zenAffirmation: string;
}

export interface ListeningTrack {
    id: string;
    languageId: string;
    title: string;
    nativeTitle: string;
    category: string;
    level: 'gentle' | 'growing' | 'deep';
    durationMinutes: number;
    soundscapeDescription: string;
    culturalContext: string;
    xpReward: number;
    speakers: ListeningSpeaker[];
    lines: ListeningLine[];
    exercise: ListeningExercise;
}

export const LISTENING_TRACKS: ListeningTrack[] = [
    // ==========================================
    // JAPANESE (日本語)
    // ==========================================
    {
        id: 'ja-track-1',
        languageId: 'japanese',
        title: 'Rainy Morning in a Gion Teahouse',
        nativeTitle: '祇園の朝、雨音と温かいお茶',
        category: 'Tea Sanctuary & Rain',
        level: 'gentle',
        durationMinutes: 2,
        soundscapeDescription: 'Soft raindrops pattering on cedar eaves, bamboo water basin (shishi-odoshi) rhythmic hollow clack, steaming matcha whisking.',
        culturalContext: 'In traditional Kyoto machiya teahouses, conversations flow softly. Whispering rain outside is viewed not as gloomy, but as nature providing a blanket of peace.',
        xpReward: 25,
        speakers: [
            {
                id: 'keiko',
                name: 'Keiko',
                nativeName: '恵子',
                role: 'Teahouse Hostess',
                avatar: '🍵',
                pitch: 1.15,
            },
            {
                id: 'kenji',
                name: 'Kenji',
                nativeName: '健二',
                role: 'Mindful Traveler',
                avatar: '🎋',
                pitch: 0.95,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'keiko',
                text: 'いらっしゃいませ。外は静かな雨ですね。どうぞ、お掛けください。',
                phonetic: 'Irasshaimase. Soto wa shizukana ame desu ne. Douzo, okake kudasai.',
                translation: 'Welcome. It is a quiet rain outside, isn\'t it? Please, have a seat.',
                tonePrompt: 'Gentle, welcoming whisper',
                vocabulary: [
                    { word: '静かな', phonetic: 'Shizukana', translation: 'Quiet / Peaceful', note: 'Essential adjective for serene spaces' },
                    { word: '雨', phonetic: 'Ame', translation: 'Rain', note: 'A symbol of renewal in Japanese aesthetic' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'kenji',
                text: 'ありがとうございます。雨の音を聞きながら、温かい抹茶をいただけますか？',
                phonetic: 'Arigatou gozaimasu. Ame no oto o kikinagara, atatakai matcha o itadakemasu ka?',
                translation: 'Thank you very much. While listening to the sound of rain, may I have warm matcha?',
                tonePrompt: 'Calm and polite',
                vocabulary: [
                    { word: '抹茶', phonetic: 'Matcha', translation: 'Powdered green tea', note: 'Central to the Japanese way of tea' },
                    { word: '温かい', phonetic: 'Atatakai', translation: 'Warm / Comforting', note: 'Used for comforting temperatures and hearts' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'keiko',
                text: 'かしこまりました。今朝挽いたばかりの宇治の抹茶をご用意いたします。',
                phonetic: 'Kashikomarimashita. Kesa hiita bakari no Uji no matcha o go-youi itashimasu.',
                translation: 'Certainly. I will prepare Uji matcha that was freshly stone-ground this morning.',
                tonePrompt: 'Graceful and attentive',
                vocabulary: [
                    { word: 'かしこまりました', phonetic: 'Kashikomarimashita', translation: 'Certainly / Understood (humble/polite)', note: 'Refined service phrase' },
                ],
            },
            {
                id: 'l4',
                speakerId: 'kenji',
                text: '中庭の苔が、雨に濡れてとても美しいですね。心が洗われます。',
                phonetic: 'Nakaniwa no koke ga, ame ni nurete totemo utsukushii desu ne. Kokoro ga arawaremasu.',
                translation: 'The moss in the courtyard garden is so beautiful moist from the rain. It cleanses the soul.',
                tonePrompt: 'Reflective and appreciative',
                vocabulary: [
                    { word: '中庭', phonetic: 'Nakaniwa', translation: 'Courtyard garden', note: 'Tsuboniwa courtyard typical of Kyoto homes' },
                    { word: '苔', phonetic: 'Koke', translation: 'Moss', note: 'Revered in wabi-sabi aesthetics for quiet endurance' },
                    { word: '美しい', phonetic: 'Utsukushii', translation: 'Beautiful', note: 'Deep aesthetic appreciation' },
                ],
            },
            {
                id: 'l5',
                speakerId: 'keiko',
                text: 'お待たせいたしました。季節の和菓子、紫陽花のきんとんと一緒にどうぞ。ごゆっくり。',
                phonetic: 'Omatase itashimashita. Kisetsu no wagashi, ajisai no kinton to issho ni douzo. Go-yukkuri.',
                translation: 'Thank you for waiting. Please enjoy it with our seasonal wagashi sweet, hydrangea bean paste. Take your time.',
                tonePrompt: 'Warm offering with a bowing cadence',
                vocabulary: [
                    { word: '季節', phonetic: 'Kisetsu', translation: 'Season', note: 'Seasonal awareness (shun) guides traditional sweets' },
                    { word: '和菓子', phonetic: 'Wagashi', translation: 'Traditional Japanese confectionery', note: 'Balances the bitterness of matcha' },
                    { word: 'ごゆっくり', phonetic: 'Go-yukkuri', translation: 'Take your time / At your leisure', note: 'A blessing of slow presence' },
                ],
            },
        ],
        exercise: {
            question: 'What seasonal sweet does Keiko offer alongside the warm matcha?',
            promptNative: '恵子さんは抹茶と一緒に何の季節の和菓子を出しましたか？',
            options: [
                'A cherry blossom rice cake (Sakura mochi)',
                'A hydrangea bean paste sweet (Ajisai no kinton)',
                'A roasted chestnut cake (Kuri manju)',
                'A bamboo leaf dumpling (Sasa dango)',
            ],
            correctIndex: 1,
            explanation: 'Keiko gently offers "紫陽花のきんとん" (Ajisai no kinton), a seasonal sweet reflecting the colors of blooming hydrangeas in the rain.',
            zenAffirmation: 'When your ears notice seasonal details, language becomes an intimate walk with nature.',
        },
    },

    {
        id: 'ja-track-2',
        languageId: 'japanese',
        title: 'The Artisan Paper Studio',
        nativeTitle: '和紙の工房：受け継がれる手の記憶',
        category: 'Craftsmanship & Texture',
        level: 'growing',
        durationMinutes: 3,
        soundscapeDescription: 'Rhythmic sloshing of water through wooden bamboo screens (suketa), mulberry fiber gentle brushing, soft pine crackle in the hearth.',
        culturalContext: 'Traditional Japanese washi papermaking requires immense concentration and harmonious dialogue between master and apprentice.',
        xpReward: 30,
        speakers: [
            {
                id: 'master-tanaka',
                name: 'Master Tanaka',
                nativeName: '田中親方',
                role: 'Master Papermaker',
                avatar: '📜',
                pitch: 0.88,
            },
            {
                id: 'yumi',
                name: 'Yumi',
                nativeName: '由美',
                role: 'Dedicated Apprentice',
                avatar: '🌿',
                pitch: 1.1,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'master-tanaka',
                text: '由美、水の揺れを急いではいけない。竹簀（たけす）の波を感じるんだ。',
                phonetic: 'Yumi, mizu no yure o isoide wa ikenai. Takesu no nami o kanjiru n da.',
                translation: 'Yumi, do not rush the swaying of the water. Feel the wave across the bamboo screen.',
                tonePrompt: 'Deep, calm teacher voice',
                vocabulary: [
                    { word: '急ぐ', phonetic: 'Isogu', translation: 'To rush / To hurry', note: 'In craft, haste disturbs fiber alignment' },
                    { word: '波', phonetic: 'Nami', translation: 'Wave', note: 'The flow of water across the paper screen' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'yumi',
                text: 'はい、親方。楮（こうぞ）の繊維が均等に広がるように、呼吸を合わせます。',
                phonetic: 'Hai, oyakata. Kouzo no seni ga kintou ni hirogaru you ni, kokyuu o awasemasu.',
                translation: 'Yes, Master. I will synchronize my breathing so that the mulberry fibers spread evenly.',
                tonePrompt: 'Humble and focused',
                vocabulary: [
                    { word: '呼吸', phonetic: 'Kokyuu', translation: 'Breath / Breathing', note: 'Matching breath with physical rhythm' },
                    { word: '均等に', phonetic: 'Kintou ni', translation: 'Evenly / Uniformly', note: 'Crucial for transparent, durable paper' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'master-tanaka',
                text: 'そうだ。力ではなく、水と紙漉きの重みに身体を預けることだ。',
                phonetic: 'Sou da. Chikara dewa naku, mizu to kamisuki no omomi ni karada o azukeru koto da.',
                translation: 'That is it. Not through force, but by entrusting your body to the weight of water and papermaking.',
                tonePrompt: 'Encouraging and serene',
                vocabulary: [
                    { word: '力', phonetic: 'Chikara', translation: 'Strength / Force', note: 'Mastery releases muscular tension' },
                    { word: '身体', phonetic: 'Karada', translation: 'Body', note: 'Physical intuition over intellectual effort' },
                ],
            },
            {
                id: 'l4',
                speakerId: 'yumi',
                text: '日光に透かすと、まるで冬の雲のように繊細で柔らかいですね。',
                phonetic: 'Nikkou ni sukasu to, marude fuyu no kumo no you ni sensai de yawarakai desu ne.',
                translation: 'When held against sunlight, it is as delicate and soft as a winter cloud.',
                tonePrompt: 'Gentle wonder',
                vocabulary: [
                    { word: '繊細', phonetic: 'Sensai', translation: 'Delicate / Subtle', note: 'Cornerstone of Japanese craft vocabulary' },
                    { word: '柔らかい', phonetic: 'Yawarakai', translation: 'Soft / Tender', note: 'Describes texture, light, and voice' },
                ],
            },
        ],
        exercise: {
            question: 'What does Master Tanaka instruct Yumi to synchronize with to spread the fibers evenly?',
            promptNative: '親方は何に身体を預けるよう教えましたか？',
            options: [
                'A loud metallic metronome',
                'Her breath and the weight of the water',
                'The heat of the open fire',
                'A timer on the workshop wall',
            ],
            correctIndex: 1,
            explanation: 'Master Tanaka teaches that paper is made not by force, but by synchronizing one\'s breath ("呼吸を合わせます") and entrusting oneself to the natural flow of water.',
            zenAffirmation: 'True listening happens when we let our breath align with the speaker\'s cadence.',
        },
    },

    {
        id: 'ja-track-3',
        languageId: 'japanese',
        title: 'Dusk in the Stone Temple Garden',
        nativeTitle: '石庭の夕暮れ：何もない豊かさ',
        category: 'Meditation & Stillness',
        level: 'deep',
        durationMinutes: 3,
        soundscapeDescription: 'Deep bronze temple bell (bonshō) long reverberation, evening cicadas fading into night wind through pine branches.',
        culturalContext: 'Karesansui (zen dry landscape) gardens use stones and gravel to evoke mountains, rivers, and the quiet void of the mind.',
        xpReward: 35,
        speakers: [
            {
                id: 'monk-sora',
                name: 'Monk Sora',
                nativeName: '空観',
                role: 'Zen Abbot',
                avatar: '🪨',
                pitch: 0.85,
            },
            {
                id: 'seeker',
                name: 'Ren',
                nativeName: '蓮',
                role: 'Seeker',
                avatar: '🌙',
                pitch: 1.05,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'seeker',
                text: '夕暮れの石庭を眺めていると、雑念が静かに消えていくようです。',
                phonetic: 'Yuugure no sekitei o nagamete iru to, zatsunen ga shizuka ni kiete iku you desu.',
                translation: 'While gazing at the dry stone garden in the twilight, worldly distractions seem to gently fade away.',
                tonePrompt: 'Contemplative whisper',
                vocabulary: [
                    { word: '夕暮れ', phonetic: 'Yuugure', translation: 'Twilight / Dusk', note: 'The transition hour of contemplative beauty' },
                    { word: '雑念', phonetic: 'Zatsunen', translation: 'Distracting thoughts / Worldly static', note: 'Zen concept of mind clutter' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'monk-sora',
                text: '石そのものは言葉を持ちません。しかし、ただそこにあることで、多くのことを語りかけてくれます。',
                phonetic: 'Ishi sono mono wa kotoba o mochimasen. Shikashi, tada soko ni aru koto de, ooku no koto o katarikakete kuremasu.',
                translation: 'The stones themselves possess no spoken words. Yet, simply by being there, they speak to us of many things.',
                tonePrompt: 'Deep, resonant, unhurried voice',
                vocabulary: [
                    { word: '言葉', phonetic: 'Kotoba', translation: 'Words / Language', note: 'Transcending words into direct experience' },
                    { word: '語る', phonetic: 'Kataru', translation: 'To speak / To narrate', note: 'Silent communication of nature' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'seeker',
                text: '白い砂に描かれた波紋は、永遠に止まっている川のようですね。',
                phonetic: 'Shiroi suna ni egakareta hamon wa, eien ni tomatte iru kawa no you desu ne.',
                translation: 'The ripples raked into the white gravel look like a river stopped in eternity.',
                tonePrompt: 'Soft poetic observation',
                vocabulary: [
                    { word: '波紋', phonetic: 'Hamon', translation: 'Ripples', note: 'The raked patterns representing ocean tides' },
                    { word: '永遠', phonetic: 'Eien', translation: 'Eternity', note: 'Timelessness of presence' },
                ],
            },
            {
                id: 'l4',
                speakerId: 'monk-sora',
                text: '耳を澄ませてごらんなさい。風の隙間に、本当の静けさがあります。',
                phonetic: 'Mimi o sumasete goran nasai. Kaze no sukima ni, hontou no shizukesa ga arimasu.',
                translation: 'Listen closely with a clear ear. In the spaces between the wind, true stillness resides.',
                tonePrompt: 'Guiding meditation tone',
                vocabulary: [
                    { word: '耳を澄ます', phonetic: 'Mimi o sumasu', translation: 'To listen closely / Clear the ears', note: 'Active mindful listening' },
                    { word: '静けさ', phonetic: 'Shizukesa', translation: 'Stillness / Serenity', note: 'The quiet center of being' },
                ],
            },
        ],
        exercise: {
            question: 'Where does Monk Sora say true stillness resides?',
            promptNative: '空観和尚はどこに本当の静けさがあると言いましたか？',
            options: [
                'Behind the temple doors',
                'In the spaces between the wind (風の隙間)',
                'Inside a heavy copper bell',
                'In an ancient mountain scroll',
            ],
            correctIndex: 1,
            explanation: 'Monk Sora reminds Ren: "風の隙間に、本当の静けさがあります" (In the spaces between the wind, true stillness resides).',
            zenAffirmation: 'Silence is not empty; it is the space where meaning awakens.',
        },
    },

    // ==========================================
    // SPANISH (Español)
    // ==========================================
    {
        id: 'es-track-1',
        languageId: 'spanish',
        title: 'The Morning Patio in Seville',
        nativeTitle: 'El patio matutino en Sevilla',
        category: 'Orange Blossoms & Coffee',
        level: 'gentle',
        durationMinutes: 2,
        soundscapeDescription: 'Trickling ceramic patio fountain, ceramic cups clinking lightly, gentle morning birds in orange trees.',
        culturalContext: 'In Andalusia, starting the day on a shaded courtyard patio with fresh coffee and tomato bread is a sacred ritual of presence and warmth.',
        xpReward: 25,
        speakers: [
            {
                id: 'carmen',
                name: 'Carmen',
                nativeName: 'Carmen',
                role: 'Patio Hostess',
                avatar: '☕',
                pitch: 1.15,
            },
            {
                id: 'mateo',
                name: 'Mateo',
                nativeName: 'Mateo',
                role: 'Neighbor & Reader',
                avatar: '🍊',
                pitch: 0.95,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'carmen',
                text: '¡Buenos días, Mateo! Qué mañana tan fresca y tranquila tenemos hoy.',
                phonetic: 'Bwe-nos DEE-as, mah-TE-o! Keh mah-NYAH-nah tan FRES-kah ee trahn-KEE-lah teh-NEH-mos oy.',
                translation: 'Good morning, Mateo! What a fresh and tranquil morning we have today.',
                tonePrompt: 'Cheerful and warm Andalusian welcome',
                vocabulary: [
                    { word: 'tranquila', phonetic: 'trahn-KEE-lah', translation: 'Tranquil / Calm', note: 'Essential adjective for peaceful spaces' },
                    { word: 'fresca', phonetic: 'FRES-kah', translation: 'Fresh / Cool', note: 'Morning cool before Andalusian heat' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'mateo',
                text: 'Buenos días, Carmen. El aroma a azahar de los naranjos llena todo el patio.',
                phonetic: 'Bwe-nos DEE-as, KAR-men. El ah-ROH-mah ah ah-zah-AHR deh los nah-RAHN-hos YEH-nah TOH-doh el PAH-tyo.',
                translation: 'Good morning, Carmen. The scent of orange blossoms fills the whole courtyard.',
                tonePrompt: 'Relaxed and appreciative',
                vocabulary: [
                    { word: 'azahar', phonetic: 'ah-zah-AHR', translation: 'Orange blossom', note: 'Iconic fragrance of spring in Seville' },
                    { word: 'patio', phonetic: 'PAH-tyo', translation: 'Courtyard patio', note: 'The cool architectural heart of Spanish homes' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'carmen',
                text: '¿Lo de siempre? ¿Un café con leche suave y tostada con aceite y tomate?',
                phonetic: 'Loh deh SYEM-preh? Oon kah-FEH kon LEH-cheh SWAH-veh ee tos-TAH-dah kon ah-SAY-teh ee toh-MAH-teh?',
                translation: 'The usual? A smooth coffee with milk and toast with olive oil and tomato?',
                tonePrompt: 'Friendly rhythm of daily care',
                vocabulary: [
                    { word: 'suave', phonetic: 'SWAH-veh', translation: 'Smooth / Gentle / Soft', note: 'Comforting description' },
                    { word: 'aceite', phonetic: 'ah-SAY-teh', translation: 'Olive oil', note: 'Virgin olive oil is gold on morning toast' },
                ],
            },
            {
                id: 'l4',
                speakerId: 'mateo',
                text: 'Por favor. No hay mejor melodía que el agua de la fuente mientras despierta el barrio.',
                phonetic: 'Por fah-VOR. Noh eye meh-HOR meh-loh-DEE-ah keh el AH-gwah deh lah FWEN-teh MYEN-trahs des-PYER-tah el BAHR-ryo.',
                translation: 'Please. There is no better melody than the fountain water while the neighborhood wakes up.',
                tonePrompt: 'Thoughtful and contented',
                vocabulary: [
                    { word: 'fuente', phonetic: 'FWEN-teh', translation: 'Fountain', note: 'Central water feature in Moorish Andalusian courtyards' },
                    { word: 'melodía', phonetic: 'meh-loh-DEE-ah', translation: 'Melody', note: 'The auditory appreciation of water' },
                ],
            },
        ],
        exercise: {
            question: 'What does Mateo describe as the best melody while the neighborhood awakens?',
            promptNative: '¿Qué describe Mateo como la mejor melodía de la mañana?',
            options: [
                'The church bells of the cathedral',
                'The water of the courtyard fountain (el agua de la fuente)',
                'The radio playing flamenco music',
                'The footsteps of the market vendors',
            ],
            correctIndex: 1,
            explanation: 'Mateo smiles: "No hay mejor melodía que el agua de la fuente..." (There is no better melody than the fountain water).',
            zenAffirmation: 'Every morning begins anew when we listen to the quiet water around us.',
        },
    },

    {
        id: 'es-track-2',
        languageId: 'spanish',
        title: 'Rainy Bookstore in Madrid',
        nativeTitle: 'Librería de viejo bajo la lluvia de Madrid',
        category: 'Literature & Rain',
        level: 'growing',
        durationMinutes: 3,
        soundscapeDescription: 'Distant cobblestone rain, wooden floorboards creaking softly, pages of aged paper gently turning.',
        culturalContext: 'Madrid\'s Barrio de las Letras is full of historic second-hand bookstores where conversation between lovers of literature is warm and respectful.',
        xpReward: 30,
        speakers: [
            {
                id: 'don-felipe',
                name: 'Don Felipe',
                nativeName: 'Don Felipe',
                role: 'Antiquarian Bookseller',
                avatar: '📚',
                pitch: 0.88,
            },
            {
                id: 'lucia',
                name: 'Lucía',
                nativeName: 'Lucía',
                role: 'Poetry Lover',
                avatar: '🌧️',
                pitch: 1.1,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'don-felipe',
                text: 'Pasa, pasa. Cierra el paraguas. El olor a papel viejo es el mejor refugio contra la tormenta.',
                phonetic: 'PAH-sah, PAH-sah. SYEH-rrah el pah-RAH-gwas. El oh-LOR ah pah-PEL VYEH-ho es el meh-HOR reh-FOO-hyo KON-trah lah tor-MEN-tah.',
                translation: 'Come in, come in. Close your umbrella. The scent of old paper is the finest refuge against the storm.',
                tonePrompt: 'Deep, kind elder bookseller voice',
                vocabulary: [
                    { word: 'refugio', phonetic: 'reh-FOO-hyo', translation: 'Refuge / Sanctuary', note: 'A peaceful haven from chaos' },
                    { word: 'tormenta', phonetic: 'tor-MEN-tah', translation: 'Storm', note: 'Rain outside deepens indoor comfort' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'lucia',
                text: 'Muchas gracias, Don Felipe. Busco una antología de versos serenos, algo para leer con calma.',
                phonetic: 'MOO-chas GRAH-syas, Don Feh-LEE-peh. BOOS-ko OO-nah ahn-toh-loh-HEE-ah deh VEHR-sos seh-REH-nos, AHL-goh PAH-rah leh-EHR kon KAHL-mah.',
                translation: 'Thank you very much, Don Felipe. I am looking for an anthology of serene verses, something to read calmly.',
                tonePrompt: 'Gentle and inquisitive',
                vocabulary: [
                    { word: 'serenos', phonetic: 'seh-REH-nos', translation: 'Serene / Peaceful (plural)', note: 'Qualities of calmness' },
                    { word: 'con calma', phonetic: 'kon KAHL-mah', translation: 'With calm / Leisurely', note: 'Core mindset of mindful learning' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'don-felipe',
                text: 'Mira este tomo encuadernado en tela. Poemas de Antonio Machado. Abre cualquier página al azar.',
                phonetic: 'MEE-rah EHS-teh TOH-moh en-kwah-der-NAH-doh en TEH-lah. Poh-EH-mas deh Ahn-TOH-nyo Mah-CHAH-doh. AH-breh kwal-KYEHR PAH-hee-nah ahl ah-ZAHR.',
                translation: 'Look at this volume bound in cloth. Poems by Antonio Machado. Open any page at random.',
                tonePrompt: 'Reverent guidance',
                vocabulary: [
                    { word: 'encuadernado', phonetic: 'en-kwah-der-NAH-doh', translation: 'Bound (book)', note: 'Artisanal bookbinding tradition' },
                ],
            },
            {
                id: 'l4',
                speakerId: 'lucia',
                text: '«Caminante, no hay camino, se hace camino al andar...» Qué hermosa manera de respirar.',
                phonetic: 'Kah-mee-NAHN-teh, noh eye kah-MEE-noh, seh AH-seh kah-MEE-noh ahl ahn-DAHR... Keh er-MOH-sah mah-NEH-rah deh res-pee-RAHR.',
                translation: '"Traveler, there is no road; you make the path by walking..." What a beautiful way to breathe.',
                tonePrompt: 'Soft recitation with poetic resonance',
                vocabulary: [
                    { word: 'caminante', phonetic: 'kah-mee-NAHN-teh', translation: 'Traveler / Wayfarer', note: 'Classic metaphor for life\'s mindful wanderer' },
                    { word: 'camino', phonetic: 'kah-MEE-noh', translation: 'Path / Way', note: 'Like Tao / Do in Japanese, the lived path' },
                ],
            },
        ],
        exercise: {
            question: 'Which renowned Spanish poet does Don Felipe suggest to Lucía for serene reading?',
            promptNative: '¿De qué poeta le recomienda un libro Don Felipe a Lucía?',
            options: [
                'Federico García Lorca',
                'Antonio Machado',
                'Pablo Neruda',
                'Miguel de Cervantes',
            ],
            correctIndex: 1,
            explanation: 'Don Felipe hands her a volume of Antonio Machado, known for his contemplative, walking poems on presence and simplicity.',
            zenAffirmation: 'We do not rush the path; each mindful phrase is the path itself.',
        },
    },

    {
        id: 'es-track-3',
        languageId: 'spanish',
        title: 'The Guitar Workshop in Granada',
        nativeTitle: 'Taller de guitarras en el Albaicín',
        category: 'Acoustics & Craft',
        level: 'deep',
        durationMinutes: 3,
        soundscapeDescription: 'Shavings of cedar falling on wood shavings, gentle tap of fingers testing the resonance of spruce wood soundboards, distant Alhambra wind.',
        culturalContext: 'In the hills of Granada\'s Albaicín, master luthiers shape Spanish guitars purely by ear, tapping the wood to hear its soul.',
        xpReward: 35,
        speakers: [
            {
                id: 'maestro-rafael',
                name: 'Maestro Rafael',
                nativeName: 'Maestro Rafael',
                role: 'Luthier & Guitar Maker',
                avatar: '🎸',
                pitch: 0.85,
            },
            {
                id: 'elena',
                name: 'Elena',
                nativeName: 'Elena',
                role: 'Acoustic Student',
                avatar: '🪵',
                pitch: 1.12,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'maestro-rafael',
                text: 'Escucha este golpe con el nudillo sobre la tapa de abeto. ¿Oyes el eco que sostiene?',
                phonetic: 'Es-KOO-chah EHS-teh GOL-peh kon el noo-DEE-yo SOH-breh lah TAH-pah deh ah-BEH-toh. OH-yes el EH-koh keh sos-TYEH-neh?',
                translation: 'Listen to this gentle tap with the knuckle on the spruce soundboard. Do you hear the echo it sustains?',
                tonePrompt: 'Attentive, quiet focus',
                vocabulary: [
                    { word: 'escucha', phonetic: 'es-KOO-chah', translation: 'Listen (imperative)', note: 'Direct command to tune in with awareness' },
                    { word: 'eco', phonetic: 'EH-koh', translation: 'Echo / Resonance', note: 'The acoustic memory of the tree' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'elena',
                text: 'Es un sonido profundo y cálido, como si la madera aún guardara la memoria del bosque.',
                phonetic: 'Es oon soh-NEE-doh proh-FOON-doh ee KAH-lee-doh, KOH-moh see lah mah-DEH-rah ah-OON gwar-DAH-rah lah meh-MOH-ryah del BOS-keh.',
                translation: 'It is a deep and warm sound, as if the wood still held the memory of the forest.',
                tonePrompt: 'Reverent acoustic observation',
                vocabulary: [
                    { word: 'profundo', phonetic: 'proh-FOON-doh', translation: 'Deep / Profound', note: 'Depth of sound and thought' },
                    { word: 'memoria', phonetic: 'meh-MOH-ryah', translation: 'Memory', note: 'Wood as a living vessel of history' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'maestro-rafael',
                text: 'Exactamente. Hacer una guitarra no es cortar madera; es aprender a guardar silencio para oírla vibrar.',
                phonetic: 'Ek-sak-tah-MEN-teh. Ah-SEHR OO-nah gee-TAHR-rah noh es kor-TAHR mah-DEH-rah; es ah-pren-DEHR ah gwar-DAHR see-LEN-syoh PAH-rah oh-EER-lah vee-BRAHR.',
                translation: 'Exactly. Making a guitar is not cutting wood; it is learning to keep silence in order to hear it vibrate.',
                tonePrompt: 'Philosophical craftsman wisdom',
                vocabulary: [
                    { word: 'silencio', phonetic: 'see-LEN-syoh', translation: 'Silence', note: 'The foundation of all music and comprehension' },
                    { word: 'vibrar', phonetic: 'vee-BRAHR', translation: 'To vibrate / Resonate', note: 'Natural acoustic frequency' },
                ],
            },
        ],
        exercise: {
            question: 'According to Maestro Rafael, what is the essential secret to making a guitar?',
            promptNative: 'Según el Maestro Rafael, ¿cuál es el secreto esencial de hacer una guitarra?',
            options: [
                'Using synthetic electric varnishes',
                'Learning to keep silence to hear the wood vibrate (guardar silencio)',
                'Building them as fast as possible for tourists',
                'Painting them in bright neon colors',
            ],
            correctIndex: 1,
            explanation: 'Maestro Rafael teaches that making a guitar is about patience and stillness: "aprender a guardar silencio para oírla vibrar".',
            zenAffirmation: 'When we cultivate inner silence, the nuances of speech sing like music.',
        },
    },

    // ==========================================
    // FRENCH (Français)
    // ==========================================
    {
        id: 'fr-track-1',
        languageId: 'french',
        title: 'Morning Boulangerie in Montmartre',
        nativeTitle: 'La boulangerie du matin à Montmartre',
        category: 'Bread & Warmth',
        level: 'gentle',
        durationMinutes: 2,
        soundscapeDescription: 'Golden crust crackling, bakery bell tinkling softly on wooden door, quiet morning footsteps on cobblestone steps.',
        culturalContext: 'In Paris, the morning ritual at the artisan bakery is an intimate moment of politeness, warmth, and appreciation for crafted nourishment.',
        xpReward: 25,
        speakers: [
            {
                id: 'mme-laurent',
                name: 'Mme Laurent',
                nativeName: 'Mme Laurent',
                role: 'Master Baker',
                avatar: '🥖',
                pitch: 1.15,
            },
            {
                id: 'julien',
                name: 'Julien',
                nativeName: 'Julien',
                role: 'Early Neighbor',
                avatar: '🥐',
                pitch: 0.95,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'mme-laurent',
                text: 'Bonjour Julien ! Vous êtes bien matinal. Laissez-moi deviner : le parfum du pain chaud ?',
                phonetic: 'Bohn-zhoor Zhoo-lyehn ! Voo zet byehn mah-tee-nahl. Leh-seh mwah duh-vee-neh : luh pahr-fuhn doo pehn shoh ?',
                translation: 'Good morning Julien! You are up very early. Let me guess: the scent of warm bread?',
                tonePrompt: 'Warm Parisian bakery greeting',
                vocabulary: [
                    { word: 'matinal', phonetic: 'mah-tee-nahl', translation: 'Early morning person / Early riser', note: 'A poetic French descriptor' },
                    { word: 'parfum', phonetic: 'pahr-fuhn', translation: 'Fragrance / Scent', note: 'Used affectionately for baking aromas' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'julien',
                text: 'Bonjour Madame Laurent ! Exactement. Une baguette tradition bien dorée, s\'il vous plaît.',
                phonetic: 'Bohn-zhoor Mah-dahm Loh-rahn ! Eg-zahk-tuh-mahn. Oon bah-get trah-dee-syohn byehn doh-reh, seel voo pleh.',
                translation: 'Good morning Madame Laurent! Exactly. A traditional baguette, nicely golden, please.',
                tonePrompt: 'Polite and delighted',
                vocabulary: [
                    { word: 'tradition', phonetic: 'trah-dee-syohn', translation: 'Traditional baguette recipe', note: 'Protected French standard of slow fermentation' },
                    { word: 'dorée', phonetic: 'doh-reh', translation: 'Golden / Crusty', note: 'Perfect crust color' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'mme-laurent',
                text: 'Elle sort tout juste du four. Écoutez le crépitement de la croûte... Elle chante !',
                phonetic: 'El sor too zhoost doo foor. Eh-koo-teh luh kreh-peet-mahn duh lah kroot... El shahnt !',
                translation: 'It just came out of the oven. Listen to the crackle of the crust... It is singing!',
                tonePrompt: 'Proud artisan sensory appreciation',
                vocabulary: [
                    { word: 'crépitement', phonetic: 'kreh-peet-mahn', translation: 'Crackling / Sizzle', note: 'The acoustic crack of cooling crust' },
                    { word: 'croûte', phonetic: 'kroot', translation: 'Crust', note: 'Symbol of artisanal crispness' },
                ],
            },
            {
                id: 'l4',
                speakerId: 'julien',
                text: 'C\'est une pure merveille. Merci infiniment. Bonne et douce journée à vous.',
                phonetic: 'Set oon poor mehr-vay. Mehr-see ehn-fee-nee-mahn. Buhn eh doos zhoor-neh ah voo.',
                translation: 'It is a pure marvel. Thank you so much. Have a good and gentle day.',
                tonePrompt: 'Grateful departing blessing',
                vocabulary: [
                    { word: 'merveille', phonetic: 'mehr-vay', translation: 'Marvel / Wonder', note: 'Expressing genuine delight in simple things' },
                    { word: 'douce', phonetic: 'doos', translation: 'Gentle / Sweet / Soft', note: 'Wishes for a peaceful, unhurried day' },
                ],
            },
        ],
        exercise: {
            question: 'What poetic sound does Madame Laurent invite Julien to listen to?',
            promptNative: 'Quel son poétique Madame Laurent invite-t-elle Julien à écouter ?',
            options: [
                'The rain dripping on the awning',
                'The crackling of the hot baguette crust (le crépitement de la croûte)',
                'The church organ in Montmartre',
                'The whistle of the baker\'s steam oven',
            ],
            correctIndex: 1,
            explanation: 'Madame Laurent invites him to listen to the cooling bread crust ("le crépitement de la croûte... Elle chante!"). French bakers say bread sings as it breathes.',
            zenAffirmation: 'Joy is found not in abundance, but in savoring the crust of the present moment.',
        },
    },

    {
        id: 'fr-track-2',
        languageId: 'french',
        title: 'The Herbalist Shop in Provence',
        nativeTitle: 'L\'herboristerie des collines de Provence',
        category: 'Herbs & Healing',
        level: 'growing',
        durationMinutes: 3,
        soundscapeDescription: 'Dried lavender flowers rustling into glass jars, pestle rhythmically grinding herbs, distant cicadas in summer pine heat.',
        culturalContext: 'In Provence villages, herbal apothecaries have offered remedies of wild thyme, vervain, and linden flowers for centuries with quiet care.',
        xpReward: 30,
        speakers: [
            {
                id: 'sophie',
                name: 'Sophie',
                nativeName: 'Sophie',
                role: 'Herbalist',
                avatar: '🌿',
                pitch: 1.1,
            },
            {
                id: 'marc',
                name: 'Marc',
                nativeName: 'Marc',
                role: 'Traveler',
                avatar: '🫖',
                pitch: 0.9,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'marc',
                text: 'Bonjour. J\'aimerais une tisane pour calmer l\'esprit le soir après une longue marche.',
                phonetic: 'Bohn-zhoor. Zhem-reh oon tee-zahn poor kahl-meh les-pree luh swahr ah-preh oon lohng mahrsh.',
                translation: 'Hello. I would like a herbal tea to calm the mind in the evening after a long walk.',
                tonePrompt: 'Gentle, fatigued traveler voice',
                vocabulary: [
                    { word: 'tisane', phonetic: 'tee-zahn', translation: 'Herbal infusion / Caffeine-free tea', note: 'Integral to French evening winding-down' },
                    { word: 'calmer', phonetic: 'kahl-meh', translation: 'To calm / To soothe', note: 'Mindful intentionality' },
                    { word: 'esprit', phonetic: 'es-pree', translation: 'Mind / Spirit', note: 'Mental balance and inner peace' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'sophie',
                text: 'Je vous conseille un mélange de verveine sauvage, de tilleul et d\'une touche de lavande bleue.',
                phonetic: 'Zhuh voo kohn-say uhn meh-lahnzh duh vehr-vehn soh-vahzh, duh tee-yul eh doon toosh duh lah-vahnd bluh.',
                translation: 'I recommend a blend of wild verbena, linden blossom, and a touch of blue lavender.',
                tonePrompt: 'Calming botanical advice',
                vocabulary: [
                    { word: 'verveine', phonetic: 'vehr-vehn', translation: 'Verbena', note: 'Classic European digestive and calming herb' },
                    { word: 'tilleul', phonetic: 'tee-yul', translation: 'Linden tree flower', note: 'Renowned for gentle sleep aid in France' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'marc',
                text: 'L\'odeur est déjà un apaisement. Comment préparez-vous l\'infusion idéale ?',
                phonetic: 'Loh-dur eh deh-zhah uhn ah-pez-mahn. Koh-mahn preh-pah-reh voo lehn-foo-zyohn ee-deh-ahl ?',
                translation: 'The scent alone is already soothing. How do you prepare the ideal infusion?',
                tonePrompt: 'Curious and relaxed',
                vocabulary: [
                    { word: 'apaisement', phonetic: 'ah-pez-mahn', translation: 'Soothing / Pacification / Relief', note: 'A profound sense of tranquility' },
                ],
            },
            {
                id: 'l4',
                speakerId: 'sophie',
                text: 'Versez de l\'eau frémissante, jamais bouillante. Couvrez la tasse, et respirez lentement pendant sept minutes.',
                phonetic: 'Vehr-seh duh loh freh-mee-sahnt, zhah-meh boo-yahnt. Koo-vreh lah tahs, eh res-pee-reh lahn-tuh-mahn pahn-dahn set mee-noot.',
                translation: 'Pour simmering water, never boiling. Cover the cup, and breathe slowly for seven minutes.',
                tonePrompt: 'Meditative instructional cadence',
                vocabulary: [
                    { word: 'frémissante', phonetic: 'freh-mee-sahnt', translation: 'Simmering / Shivering (water)', note: 'Water just before boiling point' },
                    { word: 'lentement', phonetic: 'lahn-tuh-mahn', translation: 'Slowly', note: 'The virtue of patience' },
                ],
            },
        ],
        exercise: {
            question: 'What mindful instruction does Sophie give regarding the water temperature?',
            promptNative: 'Quelle instruction attentive Sophie donne-t-elle sur la température de l\'eau ?',
            options: [
                'Use ice cold water from the well',
                'Use simmering water, never violently boiling (eau frémissante)',
                'Boil the water three times for strength',
                'Microwave the herbs in milk',
            ],
            correctIndex: 1,
            explanation: 'Sophie specifies "eau frémissante, jamais bouillante" so delicate aromatic oils in verbena and lavender are not burned.',
            zenAffirmation: 'Like warm tea, thoughts clarify when allowed to steep in patience.',
        },
    },

    {
        id: 'fr-track-3',
        languageId: 'french',
        title: 'Rain Walk Along the Seine',
        nativeTitle: 'Sous la pluie le long des quais de Seine',
        category: 'River & Philosophy',
        level: 'deep',
        durationMinutes: 3,
        soundscapeDescription: 'River current lapping against ancient stone embankments, soft rain on umbrella canvas, distant accordion melody crossing Pont des Arts.',
        culturalContext: 'Parisian bouquinistes (green book boxes along the river) have guarded historic engravings and philosophy books for hundreds of years.',
        xpReward: 35,
        speakers: [
            {
                id: 'claire',
                name: 'Claire',
                nativeName: 'Claire',
                role: 'Bouquiniste Bookseller',
                avatar: '🌊',
                pitch: 1.1,
            },
            {
                id: 'antoine',
                name: 'Antoine',
                nativeName: 'Antoine',
                role: 'Philosopher Flâneur',
                avatar: '🌂',
                pitch: 0.9,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'antoine',
                text: 'Regarder la Seine couler sous les gouttes d\'eau donne le sentiment que le temps s\'élargit.',
                phonetic: 'Ruh-gahr-deh lah Sehn koo-leh soo leh goot doh duhn luh sahn-tee-mahn kuh luh tahn seh-lahr-zhee.',
                translation: 'Watching the Seine flow under raindrops gives the feeling that time is expanding.',
                tonePrompt: 'Reflective flâneur cadence',
                vocabulary: [
                    { word: 'couler', phonetic: 'koo-leh', translation: 'To flow', note: 'Like thoughts or time, flowing without grasping' },
                    { word: 'sentiment', phonetic: 'sahn-tee-mahn', translation: 'Feeling / Sensation', note: 'Subtle emotional awareness' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'claire',
                text: 'C\'est vrai. Les ponts ont vu passer des siècles d\'orages, et pourtant l\'eau continue sa route.',
                phonetic: 'Seh vreh. Leh pohn ohn voo pah-seh deh syeh-kluh doh-rahzh, eh poor-tahn loh kohn-teen-oo sah root.',
                translation: 'That is true. The bridges have watched centuries of storms pass, and yet the water continues on its journey.',
                tonePrompt: 'Serene historical perspective',
                vocabulary: [
                    { word: 'siècles', phonetic: 'syeh-kluh', translation: 'Centuries', note: 'Perspective of long time' },
                    { word: 'orages', phonetic: 'oh-rahzh', translation: 'Storms / Tempests', note: 'Transient storms of life' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'antoine',
                text: 'Marcher ainsi, sans destination précise, c\'est peut-être la plus belle forme de liberté.',
                phonetic: 'Mahr-sheh ehn-see, sahn des-tee-nah-syohn preh-seez, seh puh-tehtr lah ploo bel form duh lee-behr-teh.',
                translation: 'Walking like this, without a precise destination, is perhaps the most beautiful form of freedom.',
                tonePrompt: 'Warm philosophical smile',
                vocabulary: [
                    { word: 'liberté', phonetic: 'lee-behr-teh', translation: 'Freedom', note: 'Core value of mindful presence' },
                ],
            },
        ],
        exercise: {
            question: 'What poetic truth does Claire observe about the Seine and its historic bridges?',
            promptNative: 'Quelle vérité poétique Claire observe-t-elle au sujet de la Seine ?',
            options: [
                'That the river has dried up completely',
                'That centuries of storms pass, yet the water continues its path (l\'eau continue sa route)',
                'That all bridges must be rebuilt in concrete',
                'That boats should move much faster',
            ],
            correctIndex: 1,
            explanation: 'Claire observes that centuries of storms come and go, but the river patiently keeps flowing, reminding us of equanimity.',
            zenAffirmation: 'No storm lasts forever; our inner current flows serenely onward.',
        },
    },

    // ==========================================
    // ITALIAN (Italiano)
    // ==========================================
    {
        id: 'it-track-1',
        languageId: 'italian',
        title: 'Morning Espresso Bar in Florence',
        nativeTitle: 'Il bar di quartiere a Firenze',
        category: 'Coffee & Bell Chimes',
        level: 'gentle',
        durationMinutes: 2,
        soundscapeDescription: 'Espresso portafilter tapping into grounds box, hiss of steam wand frothing milk, soft morning church bells of Santo Spirito.',
        culturalContext: 'In Italy, morning coffee is an art of human connection. People greet the barista by name, exchange brief kindness, and savor 30 seconds of pure warmth.',
        xpReward: 25,
        speakers: [
            {
                id: 'marco',
                name: 'Marco',
                nativeName: 'Marco',
                role: 'Florence Barista',
                avatar: '☕',
                pitch: 0.95,
            },
            {
                id: 'chiara',
                name: 'Chiara',
                nativeName: 'Chiara',
                role: 'Neighbor Artist',
                avatar: '🎨',
                pitch: 1.15,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'marco',
                text: 'Buongiorno Chiara! Come sempre, un cappuccino con schiuma vellutata?',
                phonetic: 'Bwon-JOR-noh KYAH-rah! KOH-meh SEM-preh, oon kahp-poo-CHEE-noh kon SKYOO-mah vel-loo-TAH-tah?',
                translation: 'Good morning Chiara! As always, a cappuccino with velvety foam?',
                tonePrompt: 'Brisk, musical Tuscan greeting',
                vocabulary: [
                    { word: 'buongiorno', phonetic: 'bwon-JOR-noh', translation: 'Good morning / Good day', note: 'Essential daily warm greeting' },
                    { word: 'vellutata', phonetic: 'vel-loo-TAH-tah', translation: 'Velvety / Silky', note: 'Describes perfect microfoam' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'chiara',
                text: 'Buongiorno Marco! Sì, grazie. E magari quel cornetto semplice, appena sfornato.',
                phonetic: 'Bwon-JOR-noh MAHR-koh! See, GRAHT-syeh. Eh mah-GAH-ree kwel kor-NET-toh SEM-plee-cheh, ahp-PEH-nah sfor-NAH-toh.',
                translation: 'Good morning Marco! Yes, thank you. And perhaps that plain croissant, just out of the oven.',
                tonePrompt: 'Gentle and smiling',
                vocabulary: [
                    { word: 'semplice', phonetic: 'SEM-plee-cheh', translation: 'Simple / Plain', note: 'Appreciation of unadorned beauty' },
                    { word: 'sfornato', phonetic: 'sfor-NAH-toh', translation: 'Fresh from the oven', note: 'Baked moments ago' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'marco',
                text: 'Ecco a te. Una spolverata di cacao. Ascolta le campane di Santo Spirito... che bella sinfonia.',
                phonetic: 'EK-koh ah teh. OO-nah spol-veh-RAH-tah deh kah-KAH-oh. Ahs-KOL-tah leh kahm-PAH-neh deh SAHN-toh SPEE-ree-toh... keh BEL-lah seen-foh-NEE-ah.',
                translation: 'Here you are. A dusting of cocoa. Listen to the bells of Santo Spirito... what a beautiful symphony.',
                tonePrompt: 'Heartfelt sensory invitation',
                vocabulary: [
                    { word: 'ascolta', phonetic: 'ahs-KOL-tah', translation: 'Listen (imperative)', note: 'Inviting attention to ambient harmony' },
                    { word: 'campane', phonetic: 'kahm-PAH-neh', translation: 'Bells', note: 'The acoustic heartbeat of historic Italian towns' },
                ],
            },
            {
                id: 'l4',
                speakerId: 'chiara',
                text: 'Il caffè preso con calma al mattino rimette in pace con il mondo. Grazie, Marco.',
                phonetic: 'Eel kahf-FEH PREH-zoh kon KAHL-mah ahl maht-TEE-noh ree-MET-teh een PAH-cheh kon eel MON-doh. GRAHT-syeh, MAHR-koh.',
                translation: 'Coffee taken calmly in the morning brings peace back with the world. Thank you, Marco.',
                tonePrompt: 'Grateful and centered',
                vocabulary: [
                    { word: 'pace', phonetic: 'PAH-cheh', translation: 'Peace', note: 'Inner harmony' },
                    { word: 'mondo', phonetic: 'MON-doh', translation: 'World', note: 'Reconciling with the cosmos' },
                ],
            },
        ],
        exercise: {
            question: 'What does Chiara say taking morning coffee with calm accomplishes?',
            promptNative: 'Cosa dice Chiara che fa il caffè preso con calma al mattino?',
            options: [
                'It makes her run faster to catch the bus',
                'It brings peace back with the world (rimette in pace con il mondo)',
                'It makes her forget her drawings',
                'It cools down the weather in the piazza',
            ],
            correctIndex: 1,
            explanation: 'Chiara sighs with gratitude: "Il caffè preso con calma al mattino rimette in pace con il mondo" (brings peace back with the world).',
            zenAffirmation: 'A minute of unhurried appreciation can restore your harmony with the entire day.',
        },
    },

    {
        id: 'it-track-2',
        languageId: 'italian',
        title: 'The Leather Atelier in Lucca',
        nativeTitle: 'La bottega del cuoio a Lucca',
        category: 'Craftsmanship & Patience',
        level: 'growing',
        durationMinutes: 3,
        soundscapeDescription: 'Waxed thread pulling smoothly through leather awl holes, gentle wooden hammer tapping edges, sunlight streaming through stone arch.',
        culturalContext: 'Tuscan leather workshops are sanctuaries of patient tactile craft where items are made to last decades with slow vegetable tanning.',
        xpReward: 30,
        speakers: [
            {
                id: 'maestro-bruno',
                name: 'Maestro Bruno',
                nativeName: 'Maestro Bruno',
                role: 'Master Craftsman',
                avatar: '🪡',
                pitch: 0.88,
            },
            {
                id: 'francesca',
                name: 'Francesca',
                nativeName: 'Francesca',
                role: 'Apprentice',
                avatar: '🧵',
                pitch: 1.1,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'maestro-bruno',
                text: 'Ogni punto deve avere la stessa tensione, Francesca. Il filo di lino cerato non va mai tirato con rabbia.',
                phonetic: 'ON-yee POON-toh DEH-veh ah-VEH-reh lah STES-sah ten-SYOH-neh, Frahn-CHES-kah. Eel FEE-loh deh LEE-noh cheh-RAH-toh non vah MY tee-RAH-toh kon RAHB-byah.',
                translation: 'Every stitch must have the same tension, Francesca. Waxed linen thread must never be pulled in anger.',
                tonePrompt: 'Patient master artisan tone',
                vocabulary: [
                    { word: 'tensione', phonetic: 'ten-SYOH-neh', translation: 'Tension', note: 'Physical balance in stitching' },
                    { word: 'punto', phonetic: 'POON-toh', translation: 'Stitch / Point', note: 'Careful step-by-step progress' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'francesca',
                text: 'Capisco, Maestro. È come il ritmo del respiro: costante e calmo.',
                phonetic: 'Kah-PEES-koh, Mah-EHS-troh. Eh KOH-meh eel REET-moh del res-PEE-roh: kos-TAHN-teh eh KAHL-moh.',
                translation: 'I understand, Maestro. It is like the rhythm of breathing: steady and calm.',
                tonePrompt: 'Understanding and aligned',
                vocabulary: [
                    { word: 'respiro', phonetic: 'res-PEE-roh', translation: 'Breath / Breathing', note: 'Rhythm of mindfulness' },
                    { word: 'costante', phonetic: 'kos-TAHN-teh', translation: 'Constant / Steady', note: 'Equanimity' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'maestro-bruno',
                text: 'Brava. Le cose fatte a mano hanno un\'anima proprio perché conservano il tempo di chi le ha create.',
                phonetic: 'BRAH-vah. Leh KOH-zeh FAHT-teh ah MAH-noh AHN-noh oon AH-nee-mah PROH-pryoh pehr-KEH kon-SEHR-vah-noh eel TEM-poh deh KEE leh ah kreh-AH-teh.',
                translation: 'Well done. Handmade things possess a soul precisely because they preserve the time of whoever created them.',
                tonePrompt: 'Affectionate and profound',
                vocabulary: [
                    { word: 'anima', phonetic: 'AH-nee-mah', translation: 'Soul', note: 'The living spirit in handcrafted works' },
                    { word: 'tempo', phonetic: 'TEM-poh', translation: 'Time', note: 'Patiently invested moments' },
                ],
            },
        ],
        exercise: {
            question: 'Why does Maestro Bruno say handmade objects possess a soul?',
            promptNative: 'Perché il Maestro Bruno dice che le cose fatte a mano hanno un\'anima?',
            options: [
                'Because they are extremely expensive',
                'Because they preserve the time of whoever created them (conservano il tempo)',
                'Because they are made in large automated factories',
                'Because they are stamped with gold foil',
            ],
            correctIndex: 1,
            explanation: 'Maestro Bruno shares: "Le cose fatte a mano hanno un\'anima proprio perché conservano il tempo di chi le ha create" (they preserve the invested time of their maker).',
            zenAffirmation: 'When you study with patience, every word you learn preserves the gift of your presence.',
        },
    },

    {
        id: 'it-track-3',
        languageId: 'italian',
        title: 'The Lemon Terrace in Sorrento',
        nativeTitle: 'La terrazza dei limoni a Sorrento',
        category: 'Sea & Citrus Wind',
        level: 'deep',
        durationMinutes: 3,
        soundscapeDescription: 'Mediterranean gentle waves on cliff rocks below, breeze rustling green lemon leaves under wooden pergolas, distant fishing boat motor.',
        culturalContext: 'High above the Bay of Naples, lemon pergolas are shaded havens of light and salt air where elders pass down generational wisdom.',
        xpReward: 35,
        speakers: [
            {
                id: 'nonna-maria',
                name: 'Nonna Maria',
                nativeName: 'Nonna Maria',
                role: 'Terrace Elder',
                avatar: '🍋',
                pitch: 1.1,
            },
            {
                id: 'lorenzo',
                name: 'Lorenzo',
                nativeName: 'Lorenzo',
                role: 'Grandson',
                avatar: '⛵',
                pitch: 0.95,
            },
        ],
        lines: [
            {
                id: 'l1',
                speakerId: 'lorenzo',
                text: 'Nonna, da quassù il mare sembra una tavola azzurra infinita.',
                phonetic: 'NOHN-nah, dah kwas-SOO eel MAH-reh SEM-brah OO-nah TAH-voh-lah ahd-DZOOR-rah een-fee-NEE-tah.',
                translation: 'Nonna, from up here the sea looks like an infinite azure slate.',
                tonePrompt: 'Young awe and reverence',
                vocabulary: [
                    { word: 'mare', phonetic: 'MAH-reh', translation: 'Sea / Ocean', note: 'Mediterranean vastness' },
                    { word: 'infinita', phonetic: 'een-fee-NEE-tah', translation: 'Infinite / Endless', note: 'Limitless perspective' },
                ],
            },
            {
                id: 'l2',
                speakerId: 'nonna-maria',
                text: 'Chiudi gli occhi, Lorenzo. Senti il profumo della zagara e della salsedine? Quella è la voce della nostra terra.',
                phonetic: 'KYOO-dee lyee OK-kee, Loh-REN-tsoh. SEN-tee eel proh-FOO-moh DEL-lah DZAH-gah-rah eh DEL-lah sahl-SEH-dee-neh? KWEL-lah eh lah VOH-cheh DEL-lah NOS-trah TEHR-rah.',
                translation: 'Close your eyes, Lorenzo. Do you smell the fragrance of lemon blossom and sea salt? That is the voice of our land.',
                tonePrompt: 'Loving, grounded maternal cadence',
                vocabulary: [
                    { word: 'profumo', phonetic: 'proh-FOO-moh', translation: 'Perfume / Fragrance', note: 'Sensory awareness' },
                    { word: 'zagara', phonetic: 'DZAH-gah-rah', translation: 'Citrus / Lemon blossom', note: 'Sweet white blossoms of southern Italy' },
                ],
            },
            {
                id: 'l3',
                speakerId: 'lorenzo',
                text: 'È vero. Anche senza guardare, si può capire dove ci troviamo.',
                phonetic: 'Eh VEH-roh. AHN-keh SEN-tsah gwar-DAH-reh, see pwoh kah-PEE-reh DOH-veh chee troh-VYAH-moh.',
                translation: 'It is true. Even without looking, one can understand where we are.',
                tonePrompt: 'Gentle realization',
                vocabulary: [
                    { word: 'capire', phonetic: 'kah-PEE-reh', translation: 'To understand / To comprehend', note: 'Holistic sensory understanding' },
                ],
            },
        ],
        exercise: {
            question: 'What does Nonna Maria tell Lorenzo to close his eyes and smell?',
            promptNative: 'Cosa dice Nonna Maria a Lorenzo di odorare a occhi chiusi?',
            options: [
                'Fresh diesel fuel from modern ships',
                'Lemon blossoms and sea salt (zagara e salsedine)',
                'Hot asphalt from the city road',
                'Cold winter snow',
            ],
            correctIndex: 1,
            explanation: 'Nonna Maria asks him to smell the lemon blossom and sea salt ("la zagara e la salsedine"), calling it the true voice of the land.',
            zenAffirmation: 'When sight rests, our other senses awaken to beauty we rarely notice.',
        },
    },
];
