export interface StoryVocabulary {
    word: string;
    translation: string;
    phonetic?: string;
    note?: string;
}

export interface StoryParagraph {
    id: string;
    text: string;
    phonetic?: string;
    translation: string;
    vocabulary?: StoryVocabulary[];
}

export interface ReadingReflection {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    zenAffirmation: string;
}

export interface ReadingStory {
    id: string;
    languageId: string;
    title: string;
    nativeTitle: string;
    category: string;
    level: 'gentle' | 'growing' | 'deep';
    readTimeMinutes: number;
    culturalNote: string;
    summary: string;
    xpReward: number;
    paragraphs: StoryParagraph[];
    reflection: ReadingReflection;
}

export const READING_STORIES: ReadingStory[] = [
    // ===================== JAPANESE =====================
    {
        id: 'ja-story-1',
        languageId: 'japanese',
        title: '朝の緑茶',
        nativeTitle: 'Morning Green Tea',
        category: 'Nature & Tea',
        level: 'gentle',
        readTimeMinutes: 2,
        xpReward: 30,
        summary: 'A mindful morning ritual of brewing warm green tea as the sun rises over the garden.',
        culturalNote:
            'In Japan, preparing tea is treated not as a rushed morning chore, but as "ichigo ichie" (一期一会)—cherishing this single, unrepeatable moment with gratitude.',
        paragraphs: [
            {
                id: 'ja-s1-p1',
                text: '朝、静かな光が部屋に入ります。鳥の声が遠くから聞こえます。',
                phonetic: 'Asa, shizukana hikari ga heya ni hairimasu. Tori no koe ga tooku kara kikoemasu.',
                translation: 'In the morning, quiet light enters the room. Birdsong is heard from the distance.',
                vocabulary: [
                    { word: '朝', translation: 'Morning', phonetic: 'Asa', note: 'Essential time word' },
                    { word: '静かな', translation: 'Quiet / Peaceful', phonetic: 'Shizukana', note: 'Na-adjective' },
                    { word: '光', translation: 'Light', phonetic: 'Hikari' },
                    { word: '鳥', translation: 'Bird', phonetic: 'Tori' },
                ],
            },
            {
                id: 'ja-s1-p2',
                text: '私は温かいお湯を急須に注ぎます。緑茶の良い香りがゆっくりと広がります。',
                phonetic: 'Watashi wa atatakai oyu wo kyuusu ni sosogimasu. Ryokucha no yoi kaori ga yukkuri to hirogari masu.',
                translation: 'I pour warm water into the teapot. The sweet aroma of green tea gently spreads.',
                vocabulary: [
                    { word: 'お湯', translation: 'Hot water', phonetic: 'Oyu' },
                    { word: '急須', translation: 'Teapot (kyusu)', phonetic: 'Kyuusu' },
                    { word: '緑茶', translation: 'Green tea', phonetic: 'Ryokucha' },
                    { word: '香り', translation: 'Aroma / Scent', phonetic: 'Kaori' },
                ],
            },
            {
                id: 'ja-s1-p3',
                text: '湯呑みを両手で持ちます。温もりを感じて、静かに深呼吸をします。',
                phonetic: 'Yunomi wo ryoute de mochimasu. Nukumori wo kanjite, shizukani shinkokyuu wo shimasu.',
                translation: 'I hold the teacup with both hands. Feeling its warmth, I quietly take a deep breath.',
                vocabulary: [
                    { word: '湯呑み', translation: 'Japanese teacup', phonetic: 'Yunomi' },
                    { word: '両手', translation: 'Both hands', phonetic: 'Ryoute' },
                    { word: '温もり', translation: 'Warmth', phonetic: 'Nukumori' },
                    { word: '深呼吸', translation: 'Deep breath', phonetic: 'Shinkokyuu' },
                ],
            },
        ],
        reflection: {
            question: 'Why does the speaker hold the teacup with both hands?',
            options: [
                'To drink it as fast as possible',
                'To feel its warmth and cultivate a mindful, deep breath',
                'Because the cup was slipping on the table',
            ],
            correctIndex: 1,
            explanation: 'Holding tea with both hands is a Japanese tradition expressing respect, stillness, and tactile warmth.',
            zenAffirmation: 'With every breath and warm cup, find peace in the ordinary moments.',
        },
    },

    {
        id: 'ja-story-2',
        languageId: 'japanese',
        title: '竹林の静かな雨',
        nativeTitle: 'Quiet Rain in the Bamboo Grove',
        category: 'Nature & Zen',
        level: 'growing',
        readTimeMinutes: 3,
        xpReward: 40,
        summary: 'Walking under a bamboo grove as gentle summer rain cleanses the leaves and the soul.',
        culturalNote:
            'Bamboo in Japanese culture symbolizes flexibility, resilience, and inner emptiness (ku)—bending with the storm without ever breaking.',
        paragraphs: [
            {
                id: 'ja-s2-p1',
                text: '京都の嵐山で、小雨が降り始めました。緑の竹が風にそっと揺れています。',
                phonetic: 'Kyouto no Arashiyama de, kosame ga furihajimemashita. Midori no take ga kaze ni sotto yurete imasu.',
                translation: 'In Arashiyama, Kyoto, a light drizzle began to fall. Green bamboo gently sways in the breeze.',
                vocabulary: [
                    { word: '小雨', translation: 'Light drizzle / gentle rain', phonetic: 'Kosame' },
                    { word: '竹', translation: 'Bamboo', phonetic: 'Take' },
                    { word: '風', translation: 'Wind / Breeze', phonetic: 'Kaze' },
                ],
            },
            {
                id: 'ja-s2-p2',
                text: '雨粒が葉っぱに落ちる音が、美しい音楽のように森に響きます。傘を閉じて、立ち止まります。',
                phonetic: 'Amatsubu ga happa ni ochiru oto ga, utsukushii ongaku no you ni mori ni hibikimasu. Kasa wo tojite, tachidomarimasu.',
                translation: 'The sound of raindrops striking leaves echoes through the forest like soft music. I close my umbrella and pause.',
                vocabulary: [
                    { word: '雨粒', translation: 'Raindrop', phonetic: 'Amatsubu' },
                    { word: '葉っぱ', translation: 'Leaves', phonetic: 'Happa' },
                    { word: '響く', translation: 'To echo / resonate', phonetic: 'Hibiku' },
                    { word: '立ち止まる', translation: 'To pause / stop walking', phonetic: 'Tachidomaru' },
                ],
            },
            {
                id: 'ja-s2-p3',
                text: '心の中の急ぎ足が消えていきます。自然とともに呼吸する喜びを感じます。',
                phonetic: 'Kokoro no naka no isogiasi ga kiete ikimasu. Shizen to tomo ni kokyuu suru yorokobi wo kanjimasu.',
                translation: 'The hurried pace inside my heart fades away. I feel the quiet joy of breathing with nature.',
                vocabulary: [
                    { word: '急ぎ足', translation: 'Hurried pace / rush', phonetic: 'Isogiashi' },
                    { word: '自然', translation: 'Nature', phonetic: 'Shizen' },
                    { word: '喜び', translation: 'Joy / Delight', phonetic: 'Yorokobi' },
                ],
            },
        ],
        reflection: {
            question: 'What effect does the sound of rain in the bamboo grove have on the speaker?',
            options: [
                'It makes them hurry home quickly',
                'It calms their hurried pace, allowing them to breathe with nature',
                'It ruins their walk through Kyoto',
            ],
            correctIndex: 1,
            explanation: 'The rhythm of rain allows the mind to release hurry and sync with natural stillness.',
            zenAffirmation: 'Let the rhythm of the natural world soothe all urgency in your spirit.',
        },
    },

    {
        id: 'ja-story-3',
        languageId: 'japanese',
        title: '月夜の山小屋',
        nativeTitle: 'Moonlit Mountain Hermitage',
        category: 'Culture & Philosophy',
        level: 'deep',
        readTimeMinutes: 4,
        xpReward: 50,
        summary: 'Reflecting on the concept of Wabi-Sabi while gazing at the autumn moon from a wooden porch.',
        culturalNote:
            '"Wabi-Sabi" (侘寂) is the serene acceptance of transience and imperfection, finding transcendent beauty in weathered wood, aged stones, and fleeting moonlight.',
        paragraphs: [
            {
                id: 'ja-s3-p1',
                text: '秋の夜、満月が静かな山々を白く照らします。縁側に座り、夜風を迎えます。',
                phonetic: 'Aki no yoru, mangetsu ga shizukana yamayama wo shiroku terashimasu. Engawa ni suwari, yokaze wo mukaemasu.',
                translation: 'On an autumn night, the full moon casts a white radiance over the silent mountains. Sitting on the engawa porch, I welcome the night wind.',
                vocabulary: [
                    { word: '満月', translation: 'Full moon', phonetic: 'Mangetsu' },
                    { word: '山々', translation: 'Mountains', phonetic: 'Yamayama' },
                    { word: '縁側', translation: 'Traditional wooden veranda / porch', phonetic: 'Engawa' },
                    { word: '夜風', translation: 'Night breeze', phonetic: 'Yokaze' },
                ],
            },
            {
                id: 'ja-s3-p2',
                text: '古びた木の柱には、長い年月が刻まれています。不完全さの中にこそ、真の美しさがあります。',
                phonetic: 'Furubita ki no hashira ni wa, nagai nengetsu ga kizamarete imasu. Fukanzensa no naka ni koso, shin no utsukushisa ga arimasu.',
                translation: 'Into the weathered wooden pillars, long years have been engraved. It is precisely within imperfection that true beauty resides.',
                vocabulary: [
                    { word: '古びた', translation: 'Aged / Weathered', phonetic: 'Furubita' },
                    { word: '不完全さ', translation: 'Imperfection', phonetic: 'Fukanzensa' },
                    { word: '真の美しさ', translation: 'True beauty', phonetic: 'Shin no utsukushisa' },
                ],
            },
            {
                id: 'ja-s3-p3',
                text: '月は雲に隠れても、輝きを失いません。私たちもまた、ありのままで満ち足りています。',
                phonetic: 'Tsuki wa kumo ni kakuretemo, kagayaki wo ushinaimasen. Watashitachi mo mata, arinomama de michitarite imasu.',
                translation: 'Even when the moon is hidden behind clouds, it never loses its brilliance. We too are complete just as we are.',
                vocabulary: [
                    { word: '輝き', translation: 'Radiance / Brilliance', phonetic: 'Kagayaki' },
                    { word: 'ありのまま', translation: 'Just as one is / As it is', phonetic: 'Arinomama' },
                    { word: '満ち足りる', translation: 'To be complete / content', phonetic: 'Michitariru' },
                ],
            },
        ],
        reflection: {
            question: 'What philosophical teaching does the speaker draw from the moon and aged wood?',
            options: [
                'That old wooden houses should be rebuilt immediately',
                'That within natural imperfection and transience, we are already whole and complete',
                'That cloudy nights are bad for studying',
            ],
            correctIndex: 1,
            explanation: 'Wabi-Sabi reminds us that wear, age, and fleeting clouds do not diminish our inner fullness.',
            zenAffirmation: 'You are complete just as you are in this fleeting, beautiful moment.',
        },
    },

    // ===================== SPANISH =====================
    {
        id: 'es-story-1',
        languageId: 'spanish',
        title: 'El primer café de la mañana',
        nativeTitle: 'The First Morning Coffee',
        category: 'Daily Mindfulness',
        level: 'gentle',
        readTimeMinutes: 2,
        xpReward: 30,
        summary: 'Savoring a quiet café con leche in the gentle morning light before the world awakens.',
        culturalNote:
            'In Spain and Latin America, the morning coffee is rarely taken on the run. People pause at the counter or patio to greet the barista and savor the moment.',
        paragraphs: [
            {
                id: 'es-s1-p1',
                text: 'El sol entra suavemente por la ventana. La casa todavía duerme en silencio.',
                phonetic: 'El sol en-tra swa-ve-men-te por la ven-ta-na. La ca-sa to-da-ví-a dwer-me en si-len-syo.',
                translation: 'The sun enters softly through the window. The house is still sleeping in silence.',
                vocabulary: [
                    { word: 'suavemente', translation: 'Softly / Gently' },
                    { word: 'todavía', translation: 'Still / Yet' },
                    { word: 'silencio', translation: 'Silence' },
                ],
            },
            {
                id: 'es-s1-p2',
                text: 'Preparo un café con leche caliente. El aroma tostado llena la cocina de paz y calidez.',
                phonetic: 'Pre-pa-ro un ca-fé con le-che ca-lyen-te. El a-ro-ma tos-ta-do ye-na la co-si-na de pas y ka-li-des.',
                translation: 'I prepare a hot coffee with milk. The roasted aroma fills the kitchen with peace and warmth.',
                vocabulary: [
                    { word: 'caliente', translation: 'Warm / Hot' },
                    { word: 'aroma', translation: 'Aroma / Fragrance' },
                    { word: 'calidez', translation: 'Warmth / Kindness' },
                ],
            },
            {
                id: 'es-s1-p3',
                text: 'Tomo el primer sorbo con calma. Hoy es un nuevo día para aprender y sonreír.',
                phonetic: 'To-mo el pri-mer sor-bo con cal-ma. Oy es un nwe-vo dí-a pa-ra a-pren-der y son-re-ír.',
                translation: 'I take the first sip calmly. Today is a new day to learn and smile.',
                vocabulary: [
                    { word: 'sorbo', translation: 'Sip' },
                    { word: 'calma', translation: 'Calm / Composure' },
                    { word: 'sonreír', translation: 'To smile' },
                ],
            },
        ],
        reflection: {
            question: 'What is the spirit of the speaker while drinking the morning coffee?',
            options: [
                'They are stressed about being late for an appointment',
                'They take a peaceful sip and look forward to the day with calm gratitude',
                'They dislike the taste of the coffee',
            ],
            correctIndex: 1,
            explanation: 'Starting the morning with intentional calm sets a peaceful tone for the entire day.',
            zenAffirmation: 'A quiet morning sip brings quiet courage to the entire day.',
        },
    },

    {
        id: 'es-story-2',
        languageId: 'spanish',
        title: 'Bajo los olivos viejos',
        nativeTitle: 'Beneath the Ancient Olive Trees',
        category: 'Nature & Peace',
        level: 'growing',
        readTimeMinutes: 3,
        xpReward: 40,
        summary: 'A peaceful walk through an Andalusian olive grove rooted with centennial strength.',
        culturalNote:
            'Olive trees in Mediterranean culture are living symbols of peace, endurance, and wisdom, often living for over five hundred years.',
        paragraphs: [
            {
                id: 'es-s2-p1',
                text: 'Camino por un sendero de tierra roja en Andalucía. Los olivos centenarios tienen troncos retorcidos pero firmes.',
                phonetic: 'Ca-mi-no por un sen-de-ro de tye-rra ro-ja en An-da-lu-sí-a. Los o-li-vos sen-te-na-ryos tye-nen tron-cos re-tor-si-dos pe-ro fir-mes.',
                translation: 'I walk along a red dirt path in Andalusia. Centennial olive trees have twisted yet steadfast trunks.',
                vocabulary: [
                    { word: 'sendero', translation: 'Path / Footpath' },
                    { word: 'olivos', translation: 'Olive trees' },
                    { word: 'firmes', translation: 'Steadfast / Firm' },
                ],
            },
            {
                id: 'es-s2-p2',
                text: 'El viento acaricia las hojas plateadas. En este campo no hay prisa; el tiempo fluye como agua clara.',
                phonetic: 'El vyen-to a-ca-ri-sya las o-jas pla-te-a-das. En es-te cam-po no ay pri-sa; el tyem-po flwe-ye co-mo a-gwa cla-ra.',
                translation: 'The wind caresses the silvery leaves. In this countryside there is no rush; time flows like clear water.',
                vocabulary: [
                    { word: 'acariciar', translation: 'To caress / touch gently' },
                    { word: 'plateadas', translation: 'Silvery' },
                    { word: 'prisa', translation: 'Hurry / Rush' },
                ],
            },
            {
                id: 'es-s2-p3',
                text: 'Toco la corteza áspera de un árbol. Siento la fuerza profunda de la tierra que sostiene cada respiración.',
                phonetic: 'To-co la cor-te-sa ás-pe-ra de un ár-bol. Syen-to la fwer-sa pro-fun-da de la tye-rra ke sos-tye-ne ca-da res-pi-ra-syón.',
                translation: 'I touch the rough bark of a tree. I feel the deep strength of the earth that cradles every breath.',
                vocabulary: [
                    { word: 'corteza', translation: 'Tree bark' },
                    { word: 'áspera', translation: 'Rough / Textured' },
                    { word: 'sostiene', translation: 'Supports / Holds up' },
                ],
            },
        ],
        reflection: {
            question: 'What do the ancient olive trees teach the traveler?',
            options: [
                'That only modern trees grow tall',
                'Endurance, stillness, and living without anxious hurry',
                'That red soil is hard to walk on',
            ],
            correctIndex: 1,
            explanation: 'The twisted trunks of old olive trees demonstrate how enduring patience withstands all seasons.',
            zenAffirmation: 'Root your heart deeply, and bend with the gentle winds of life.',
        },
    },

    {
        id: 'es-story-3',
        languageId: 'spanish',
        title: 'La noche estrellada de Granada',
        nativeTitle: 'The Starry Night of Granada',
        category: 'Culture & Poetry',
        level: 'deep',
        readTimeMinutes: 4,
        xpReward: 50,
        summary: 'Watching the Alhambra fortress bathed in starlight with the gentle scent of jasmine.',
        culturalNote:
            'Granada inspired centuries of poets, including Federico García Lorca, who celebrated its fountains, courtyards, and silent moonlit nights.',
        paragraphs: [
            {
                id: 'es-s3-p1',
                text: 'Desde el mirador de San Nicolás, contemplo la colina de la Alhambra bajo una luna llena de nácar.',
                phonetic: 'Des-de el mi-ra-dor de San Ni-co-lás, con-tem-plo la co-li-na de la Al-ham-bra ba-jo u-na lu-na ye-na de ná-car.',
                translation: 'From the San Nicolás viewpoint, I contemplate the hill of the Alhambra beneath a mother-of-pearl full moon.',
                vocabulary: [
                    { word: 'mirador', translation: 'Viewpoint / Scenic overlook' },
                    { word: 'contemplo', translation: 'I contemplate / gaze upon' },
                    { word: 'nácar', translation: 'Mother-of-pearl' },
                ],
            },
            {
                id: 'es-s3-p2',
                text: 'El sonido de una guitarra española flota en el aire nocturno junto al aroma dulce de los jazmines en flor.',
                phonetic: 'El so-ni-do de u-na gi-ta-rra es-pa-nyo-la flo-ta en el ay-re noc-tur-no yun-to al a-ro-ma dul-se de los jas-mi-nes en flor.',
                translation: 'The chord of a Spanish guitar floats on the night air alongside the sweet perfume of blooming jasmine.',
                vocabulary: [
                    { word: 'guitarra', translation: 'Guitar' },
                    { word: 'nocturno', translation: 'Nightly / Nocturnal' },
                    { word: 'jazmines', translation: 'Jasmine flowers' },
                ],
            },
            {
                id: 'es-s3-p3',
                text: 'En el silencio del Albaicín, comprendo que la poesía no se escribe solo con palabras, sino con la presencia de cada instante.',
                phonetic: 'En el si-len-syo del Al-bay-sín, com-pren-do ke la po-e-sí-a no se es-cri-be so-lo con pa-la-bras, si-no con la pre-sen-sya de ca-da ins-tan-te.',
                translation: 'In the silence of the Albaicín, I understand that poetry is written not merely with words, but with presence in every moment.',
                vocabulary: [
                    { word: 'poesía', translation: 'Poetry' },
                    { word: 'presencia', translation: 'Presence' },
                    { word: 'instante', translation: 'Instant / Moment' },
                ],
            },
        ],
        reflection: {
            question: 'What realization comes to the speaker under the stars of Granada?',
            options: [
                'That guitars are too loud at night',
                'That true poetry is experienced through conscious presence in each moment',
                'That they should leave the viewpoint quickly',
            ],
            correctIndex: 1,
            explanation: 'Poetry is the mindful awareness of beauty unfolding in the quiet present.',
            zenAffirmation: 'Live each instant as if it were a verse of quiet poetry.',
        },
    },

    // ===================== FRENCH =====================
    {
        id: 'fr-story-1',
        languageId: 'french',
        title: 'Un matin au jardin du Luxembourg',
        nativeTitle: 'A Morning in the Luxembourg Gardens',
        category: 'Daily Mindfulness',
        level: 'gentle',
        readTimeMinutes: 2,
        xpReward: 30,
        summary: 'A tranquil stroll among the green metal chairs and fountains of Paris in early autumn.',
        culturalNote:
            'The green chairs of the Jardin du Luxembourg are iconic: unlike fixed park benches, visitors are free to move them anywhere to follow the sunlight.',
        paragraphs: [
            {
                id: 'fr-s1-p1',
                text: 'Le soleil du matin éclaire doucement les allées de gravier. L’air frais sent la mousse et les feuilles dorées.',
                phonetic: 'Luh so-lay dyoo ma-tan ay-kler doos-man lay za-lay duh gra-vyay. Lair fray san la moos ay lay fœy do-ray.',
                translation: 'The morning sun gently illuminates the gravel pathways. The crisp air smells of moss and golden leaves.',
                vocabulary: [
                    { word: 'doucement', translation: 'Gently / Softly' },
                    { word: 'gravier', translation: 'Gravel' },
                    { word: 'feuilles', translation: 'Leaves' },
                ],
            },
            {
                id: 'fr-s1-p2',
                text: 'Je m’assieds sur une chaise verte près du grand bassin. L’eau reflète les nuages blancs qui passent sans bruit.',
                phonetic: 'Zhuh ma-syay syoor oon shez vert pray dyoo gran ba-san. Lo ruh-flet lay noo-azh blan kee pass san brwee.',
                translation: 'I sit down on a green chair near the large fountain pond. The water reflects white clouds passing silently.',
                vocabulary: [
                    { word: 'chaise', translation: 'Chair' },
                    { word: 'bassin', translation: 'Pond / Pool' },
                    { word: 'sans bruit', translation: 'Silently / Without noise' },
                ],
            },
            {
                id: 'fr-s1-p3',
                text: 'J’ouvre mon livre et je prends le temps de respirer. Ici, la vie est simple et douce.',
                phonetic: 'Zhoovr mon leevr ay zhuh pran luh tan duh res-pee-ray. Ee-see, la vee ay sampl ay doos.',
                translation: 'I open my book and take the time to breathe. Here, life is simple and sweet.',
                vocabulary: [
                    { word: 'livre', translation: 'Book' },
                    { word: 'respirer', translation: 'To breathe' },
                    { word: 'douce', translation: 'Sweet / Gentle (feminine)' },
                ],
            },
        ],
        reflection: {
            question: 'What does the speaker do at the Luxembourg Gardens?',
            options: [
                'They run in a rush to catch the metro',
                'They sit quietly on a green chair, open a book, and take time to breathe',
                'They feed bread to noisy pigeons',
            ],
            correctIndex: 1,
            explanation: 'The Luxembourg garden offers a timeless Parisian sanctuary for reading and deep presence.',
            zenAffirmation: 'Allow yourself the luxury of pausing and breathing without hurry.',
        },
    },

    {
        id: 'fr-story-2',
        languageId: 'french',
        title: 'Le silence de la lavande',
        nativeTitle: 'The Silence of Lavender',
        category: 'Nature & Solitude',
        level: 'growing',
        readTimeMinutes: 3,
        xpReward: 40,
        summary: 'Standing in a purple field of Provence lavender where the gentle hum of bees creates peaceful meditation.',
        culturalNote:
            'In Provence, lavender fields bloom in midsummer. The scent has been used since Roman times to soothe tension and invite restorative sleep.',
        paragraphs: [
            {
                id: 'fr-s2-p1',
                text: 'Sur le plateau de Valensole, les champs de lavande s’étendent à perte de vue comme une mer violette.',
                phonetic: 'Syoor luh pla-to duh Va-lan-sol, lay shan duh la-vand say-tan a pert duh vyoo kom oon mer vyoh-let.',
                translation: 'On the Valensole plateau, lavender fields stretch as far as the eye can see like a purple sea.',
                vocabulary: [
                    { word: 'champs', translation: 'Fields' },
                    { word: 'à perte de vue', translation: 'As far as the eye can see' },
                    { word: 'mer', translation: 'Sea' },
                ],
            },
            {
                id: 'fr-s2-p2',
                text: 'Le parfum puissant apaise immédiatement l’esprit. Le chant doux des cigales accompagne le soleil couchant.',
                phonetic: 'Luh par-fan pwee-san a-pez ee-may-dyat-man les-pree. Luh shan doo day see-gal a-kom-pany luh so-lay koo-shan.',
                translation: 'The powerful fragrance immediately calms the mind. The gentle song of cicadas accompanies the setting sun.',
                vocabulary: [
                    { word: 'parfum', translation: 'Perfume / Scent' },
                    { word: 'apaise', translation: 'Soothes / Calms' },
                    { word: 'cigales', translation: 'Cicadas' },
                ],
            },
            {
                id: 'fr-s2-p3',
                text: 'Je ferme les yeux. Rien n’est à faire, rien n’est à prouver. Il suffit d’exister.',
                phonetic: 'Zhuh ferm lay zyœ. Rya nay ta fer, rya nay ta proo-vay. Eel soo-fee deks-ees-tay.',
                translation: 'I close my eyes. There is nothing to do, nothing to prove. It is enough simply to exist.',
                vocabulary: [
                    { word: 'ferme', translation: 'I close' },
                    { word: 'prouver', translation: 'To prove' },
                    { word: 'exister', translation: 'To exist' },
                ],
            },
        ],
        reflection: {
            question: 'What peaceful thought comes to the traveler in the lavender field?',
            options: [
                'That they should buy lavender soap immediately',
                'That there is nothing to prove—it is enough simply to exist in harmony with nature',
                'That summer days are too warm',
            ],
            correctIndex: 1,
            explanation: 'Lavender in Provence invites surrender from performance and quiet gratitude for existence.',
            zenAffirmation: 'You have nothing to prove. It is enough simply to be here, breathing and awake.',
        },
    },

    {
        id: 'fr-story-3',
        languageId: 'french',
        title: 'La lumière sur la Seine',
        nativeTitle: 'Light Upon the River Seine',
        category: 'Art & Atmosphere',
        level: 'deep',
        readTimeMinutes: 4,
        xpReward: 50,
        summary: 'A poetic meditation along the riverbanks of Paris, where water reflects centuries of art and reflection.',
        culturalNote:
            'The banks of the Seine are a UNESCO world heritage site and have inspired artists from Claude Monet to Paul Cézanne with their luminous reflections.',
        paragraphs: [
            {
                id: 'fr-s1-p1',
                text: 'À l’heure crépusculaire, la Seine devient un miroir d’or et d’ardoise. Les péniches glissent silencieusement sous les ponts de pierre.',
                phonetic: 'A lœr kray-poo-skyoo-ler, la Sen duh-vyan un mee-rwar dor ay dar-dwaz. Lay pay-neesh glees see-lan-syœz-man soo lay pon duh pyer.',
                translation: 'At twilight hour, the Seine becomes a mirror of gold and slate. Barges glide silently beneath the stone bridges.',
                vocabulary: [
                    { word: 'crépusculaire', translation: 'Twilight / Dusky' },
                    { word: 'miroir', translation: 'Mirror' },
                    { word: 'péniches', translation: 'River barges / houseboats' },
                    { word: 'pierre', translation: 'Stone' },
                ],
            },
            {
                id: 'fr-s1-p2',
                text: 'Les bouquinistes ferment lentement leurs boîtes vertes pleines d’anciens poèmes et de gravures jaunies par le temps.',
                phonetic: 'Lay boo-kee-neest ferm lan-tuh-man lœr bwat vert plen dan-syan po-em ay duh gra-vyoor zho-nee par luh tan.',
                translation: 'The riverside booksellers slowly close their green stalls filled with vintage poems and engravings yellowed by time.',
                vocabulary: [
                    { word: 'bouquinistes', translation: 'Antiquarian riverside booksellers' },
                    { word: 'lentement', translation: 'Slowly' },
                    { word: 'gravures', translation: 'Engravings / Prints' },
                ],
            },
            {
                id: 'fr-s1-p3',
                text: 'Le courant emporte nos pensées lourdes vers l’océan. Le cœur retrouve sa clarté originelle.',
                phonetic: 'Luh koo-ran an-port no pan-say loord ver lo-say-an. Luh kœr ruh-troov sa klar-tay o-ree-zhee-nel.',
                translation: 'The current carries our heavy thoughts toward the ocean. The heart reclaims its original clarity.',
                vocabulary: [
                    { word: 'courant', translation: 'Current / Stream' },
                    { word: 'pensées', translation: 'Thoughts' },
                    { word: 'clarté', translation: 'Clarity' },
                ],
            },
        ],
        reflection: {
            question: 'What happens to the heavy thoughts when observing the flowing river?',
            options: [
                'They multiply into more worries',
                'The water current carries them away toward the sea, restoring clarity',
                'They turn into books for the bouquinistes',
            ],
            correctIndex: 1,
            explanation: 'Watching moving water is an ancient mindfulness technique to release mental clutter.',
            zenAffirmation: 'Like water under bridges, let all worries pass without holding on.',
        },
    },

    // ===================== ITALIAN =====================
    {
        id: 'it-story-1',
        languageId: 'italian',
        title: 'Il profumo del basilico fresco',
        nativeTitle: 'The Scent of Fresh Basil',
        category: 'Daily Mindfulness',
        level: 'gentle',
        readTimeMinutes: 2,
        xpReward: 30,
        summary: 'A mindful moment watering fresh herbs on a terracotta balcony in sunny Italy.',
        culturalNote:
            'In Italian homes, fresh basil on the windowsill is more than a culinary herb—it represents hospitality, warmth, and the simple celebration of life.',
        paragraphs: [
            {
                id: 'it-s1-p1',
                text: 'Sul mio balcone di terracotta, il vaso di basilico verde brilla sotto la luce del mattino.',
                phonetic: 'Sool mee-o bal-co-ne dee ter-ra-cot-ta, eel va-zo dee ba-zee-lee-co ver-de breel-la sot-to la loo-che del mat-tee-no.',
                translation: 'On my terracotta balcony, the pot of green basil shines beneath the morning light.',
                vocabulary: [
                    { word: 'balcone', translation: 'Balcony' },
                    { word: 'vaso', translation: 'Pot / Vase' },
                    { word: 'brilla', translation: 'Shines / Glows' },
                ],
            },
            {
                id: 'it-s1-p2',
                text: 'Accarezzo una foglia tra le dita. Un profumo intenso e fresco riempie l’aria di gioia pura.',
                phonetic: 'Ac-ca-rets-tso oo-na fol-ya tra le dee-ta. Oon pro-foo-mo een-ten-so e fres-co ree-em-pye lay-ree-a dee jo-ya poo-ra.',
                translation: 'I gently brush a leaf between my fingers. An intense, fresh fragrance fills the air with pure joy.',
                vocabulary: [
                    { word: 'accarezzo', translation: 'I caress / brush gently' },
                    { word: 'foglia', translation: 'Leaf' },
                    { word: 'gioia', translation: 'Joy' },
                ],
            },
            {
                id: 'it-s1-p3',
                text: 'Non serve correre. La bellezza della vita abita nelle cose più semplici.',
                phonetic: 'Non ser-ve cor-re-re. La bel-lets-tsa del-la vee-ta a-bee-ta nel-le co-ze pyoo sem-plee-chee.',
                translation: 'There is no need to run. The beauty of life resides in the simplest things.',
                vocabulary: [
                    { word: 'correre', translation: 'To run / rush' },
                    { word: 'bellezza', translation: 'Beauty' },
                    { word: 'semplici', translation: 'Simple' },
                ],
            },
        ],
        reflection: {
            question: 'Where does the beauty of life reside according to this passage?',
            options: [
                'In busy schedules and fast running',
                'In the simplest, most present everyday things',
                'Only in expensive restaurants',
            ],
            correctIndex: 1,
            explanation: 'The Italian lifestyle celebrates "la dolcezza delle piccole cose"—the sweetness found in small things.',
            zenAffirmation: 'Slow down. The truest beauty always lives in the simplest moments.',
        },
    },

    {
        id: 'it-story-2',
        languageId: 'italian',
        title: 'Passeggiata al tramonto su Ponte Vecchio',
        nativeTitle: 'Sunset Stroll on Ponte Vecchio',
        category: 'City & Silence',
        level: 'growing',
        readTimeMinutes: 3,
        xpReward: 40,
        summary: 'Watching the Arno river turn into liquid amber as the bells of Florence ring at dusk.',
        culturalNote:
            'Ponte Vecchio in Florence has survived since medieval times. Looking out through its central arches at sunset is one of Italy’s most cherished contemplative vistas.',
        paragraphs: [
            {
                id: 'it-s2-p1',
                text: 'A Firenze, il fiume Arno scorre lento sotto gli archi antichi di Ponte Vecchio.',
                phonetic: 'A Fee-ren-tse, eel fyoo-me Ar-no scor-re len-to sot-to yee ar-kee an-tee-kee dee Pon-te Vek-kyo.',
                translation: 'In Florence, the river Arno flows slowly beneath the ancient arches of Ponte Vecchio.',
                vocabulary: [
                    { word: 'fiume', translation: 'River' },
                    { word: 'scorre', translation: 'Flows' },
                    { word: 'antichi', translation: 'Ancient' },
                ],
            },
            {
                id: 'it-s2-p2',
                text: 'Il tramonto dipinge il cielo di rosa e d’ambra. Le campane della cattedrale suonano la sera con grazia.',
                phonetic: 'Eel tra-mon-to dee-peen-je eel chye-lo dee ro-za e dam-bra. Le cam-pa-ne del-la cat-te-dra-le swo-na-no la se-ra con gra-tsya.',
                translation: 'Sunset paints the sky in rose and amber. The cathedral bells chime for the evening with grace.',
                vocabulary: [
                    { word: 'tramonto', translation: 'Sunset' },
                    { word: 'cielo', translation: 'Sky' },
                    { word: 'campane', translation: 'Bells' },
                ],
            },
            {
                id: 'it-s2-p3',
                text: 'Mi fermo a guardare l’acqua dorata. Ogni riflesso ricorda che ogni istante è prezioso e irripetibile.',
                phonetic: 'Mee fer-mo a gwar-da-re lak-kwa do-ra-ta. On-yee ree-fles-so ree-cor-da ke on-yee ees-tan-te è pre-tsyo-zo e eer-ree-pe-tee-bee-le.',
                translation: 'I pause to watch the golden water. Every reflection reminds me that every instant is precious and unrepeatable.',
                vocabulary: [
                    { word: 'dorata', translation: 'Golden' },
                    { word: 'prezioso', translation: 'Precious' },
                    { word: 'irripetibile', translation: 'Unrepeatable / Unique' },
                ],
            },
        ],
        reflection: {
            question: 'What does the golden reflection on the Arno river teach the viewer?',
            options: [
                'That gold coins are in the river',
                'That every single instant is precious, fleeting, and unrepeatable',
                'That bridges need repainting',
            ],
            correctIndex: 1,
            explanation: 'Like the current of the Arno, moments come and go; mindful awareness honors their unique beauty.',
            zenAffirmation: 'Every instant is a unique gift—receive it with open hands and heart.',
        },
    },

    {
        id: 'it-story-3',
        languageId: 'italian',
        title: 'Il giardino segreto di Bellagio',
        nativeTitle: 'The Secret Garden of Bellagio',
        category: 'Nature & Wonder',
        level: 'deep',
        readTimeMinutes: 4,
        xpReward: 50,
        summary: 'Discovering a secluded garden high above Lake Como, surrounded by cypress trees and crystal waters.',
        culturalNote:
            'The gardens along Lake Como blend Italian classical architecture with mountain flora, creating a microclimate where olive trees grow alongside Alpine flowers.',
        paragraphs: [
            {
                id: 'it-s3-p1',
                text: 'In cima a Bellagio, un cancello di ferro battuto si apre su un sentiero coperto di glicine lilla.',
                phonetic: 'Een chee-ma a Bel-la-jo, oon can-chel-lo dee fer-ro bat-too-to see a-pre soo oon sen-tye-ro co-per-to dee glee-chee-ne leel-la.',
                translation: 'At the top of Bellagio, a wrought-iron gate opens onto a pathway sheltered by lilac wisteria.',
                vocabulary: [
                    { word: 'cancello', translation: 'Gate' },
                    { word: 'sentiero', translation: 'Pathway / Trail' },
                    { word: 'glicine', translation: 'Wisteria flower' },
                ],
            },
            {
                id: 'it-s3-p2',
                text: 'Il lago di Como riposa silenzioso tra le montagne innevate. I cipressi scuri puntano fieri verso l’infinito.',
                phonetic: 'Eel la-go dee Co-mo ree-po-za see-len-tsyo-zo tra le mon-tan-ye een-ne-va-te. Ee chee-pres-see scoo-ree poon-ta-no fye-ree ver-so leen-fee-nee-to.',
                translation: 'Lake Como rests silent among the snow-dusted mountains. Dark cypresses point proudly toward infinity.',
                vocabulary: [
                    { word: 'lago', translation: 'Lake' },
                    { word: 'silenzioso', translation: 'Silent' },
                    { word: 'cipressi', translation: 'Cypress trees' },
                    { word: 'infinito', translation: 'Infinity / The boundless' },
                ],
            },
            {
                id: 'it-s3-p3',
                text: 'In questo angolo di quiete, il silenzio non è assenza di rumore, ma presenza profonda di armonia interiore.',
                phonetic: 'Een kwes-to an-go-lo dee kwye-te, eel see-len-tsyo non è as-sen-tsa dee roo-mo-re, ma pre-zen-tsa pro-fon-da dee ar-mo-nee-a een-te-ryo-re.',
                translation: 'In this corner of serenity, silence is not an absence of sound, but the profound presence of inner harmony.',
                vocabulary: [
                    { word: 'quiete', translation: 'Serenity / Quietude' },
                    { word: 'assenza', translation: 'Absence' },
                    { word: 'armonia', translation: 'Harmony' },
                    { word: 'interiore', translation: 'Inner' },
                ],
            },
        ],
        reflection: {
            question: 'How is silence described in the secret garden of Bellagio?',
            options: [
                'As empty and boring',
                'Not as absence of sound, but as the rich presence of inner harmony',
                'As something difficult to bear',
            ],
            correctIndex: 1,
            explanation: 'True silence is not a void; it is a full, harmonious awareness of the universe and self.',
            zenAffirmation: 'Silence is not emptiness—it is the space where harmony blooms.',
        },
    },
];
