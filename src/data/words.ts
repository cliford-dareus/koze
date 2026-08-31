export const FALLBACK_WORDS = [
    // A
    'apple',
    'anchor',
    'arrow',
    'aurora',
    // B
    'breeze',
    'bridge',
    'bright',
    'bloom',
    // C
    'canvas',
    'cedar',
    'cloud',
    'coral',
    // D
    'dawn',
    'delta',
    'drift',
    'dune',
    // E
    'echo',
    'ember',
    'equinox',
    // F
    'feather',
    'field',
    'flame',
    'forest',
    // G
    'galaxy',
    'garden',
    'glade',
    'grain',
    // H
    'harbor',
    'haven',
    'haze',
    'horizon',
    // I
    'island',
    'ivy',
    // J
    'jade',
    'jungle',
    // K
    'keystone',
    // L
    'lagoon',
    'leaf',
    'light',
    'linden',
    // M
    'maple',
    'meadow',
    'mist',
    'moon',
    // N
    'nebula',
    'night',
    // O
    'oasis',
    'ocean',
    'orbit',
    // P
    'pearl',
    'pine',
    'plains',
    'prism',
    // Q
    'quartz',
    // R
    'rain',
    'reef',
    'ridge',
    'river',
    // S
    'sage',
    'sand',
    'sea',
    'sky',
    'stone',
    'stream',
    'sun',
    // T
    'tide',
    'timber',
    'trail',
    'tree',
    // U
    'umbra',
    // V
    'valley',
    'vapor',
    'vine',
    // W
    'wave',
    'willow',
    'wind',
    'wood',
    // Y
    'yew',
    // Z
    'zenith',
    'zephyr',
];

export function getRandomFallbackWord(): string {
    const i = Math.floor(Math.random() * FALLBACK_WORDS.length);
    return FALLBACK_WORDS[i];
}
