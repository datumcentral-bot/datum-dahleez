/**
 * DATUM DAHLEEZ Environmental Intelligence System
 * Mono Vector Icon System - Inline SVG icons for consistent visual language
 */

const DD_ICONS = {
    // Welcome / Navigation
    welcome: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2.1"/></svg>',

    // Property Types
    residential: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12l9-8 9 8"/><rect x="5" y="10" width="14" height="11" rx="1"/><path d="M9 20v-5h6v5"/></svg>',
    bedroom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="6" width="18" height="13" rx="1"/><path d="M7 6V5a2 2 0 012-2h2a2 2 0 012 2v1"/><circle cx="17" cy="14" r="1.5"/></svg>',
    living: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="8" width="18" height="12" rx="1"/><path d="M6 8V6a2 2 0 012-2h2a2 2 0 012 2v2"/><rect x="8" y="12" width="4" height="3"/><rect x="14" y="12" width="3" height="3"/></svg>',
    'dining-kitchen': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="11" rx="1"/><path d="M3 12h18"/><circle cx="8" cy="15" r="1.5"/><circle cx="16" cy="15" r="1.5"/><path d="M6 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/></svg>',
    wellness: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    'work-study': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="3" width="16" height="14" rx="1"/><path d="M12 17v-4"/><path d="M9 21h6"/></svg>',
    hospitality: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18"/><rect x="4" y="7" width="16" height="11" rx="1"/><path d="M4 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/><circle cx="12" cy="14" r="1.5"/></svg>',
    retail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M3 12h18"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
    healthcare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>',
    education: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21l9-9 9 9"/><path d="M3 12l9-8 9 8"/></svg>',
    entertainment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="12" rx="1"/><circle cx="12" cy="13" r="3"/><path d="M9 10l2 2 4-4"/></svg>',
    spiritual: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20"/><path d="M2 12h20"/><circle cx="12" cy="12" r="9"/></svg>',
    transport: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2"/><circle cx="8" cy="17" r="1.5"/><circle cx="16" cy="17" r="1.5"/></svg>',
    outdoor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v18"/><path d="M8 7l4-4 4 4"/><path d="M6 11l6-4 6 4"/></svg>',

    // Primary Purpose
    'rest-relaxation': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="10" r="0.5"/><circle cx="15" cy="10" r="0.5"/></svg>',
    'social-gathering': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="6" r="3"/><circle cx="5" cy="17" r="2.5"/><circle cx="19" cy="17" r="2.5"/><path d="M12 9v5M5 14.5l4.5 2M19 14.5l-4.5 2"/></svg>',
    'focus-work': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>',
    'creative-expression': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>',
    'healing-wellness': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    'spiritual-practice': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20"/><path d="M2 12h20"/><circle cx="12" cy="12" r="9"/></svg>',
    learning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21l9-9 9 9"/><path d="M3 12l9-8 9 8"/></svg>',
    commercial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M3 12h18"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
    'mixed-use': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="4" rx="1"/><rect x="3" y="14" width="18" height="4" rx="1"/><path d="M12 7v8"/></svg>',

    // Occupants
    individual: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="6" r="3.5"/><path d="M12 10v7"/><path d="M9 17l-2 5M15 17l2 5"/></svg>',
    couple: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="6" r="2.5"/><circle cx="16" cy="6" r="2.5"/><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7"/></svg>',
    'family-young-children': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="4" r="2.5"/><circle cx="6" cy="9" r="1.8"/><circle cx="18" cy="9" r="1.8"/><path d="M4 22c0-4.5 3.5-8 8-8s8 3.5 8 8"/></svg>',
    'family-teens': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="5" r="2.5"/><circle cx="17" cy="5" r="2.5"/><path d="M3 22c0-4.5 3.5-8 8-8s8 3.5 8 8"/></svg>',
    'extended-family': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="4" r="2.5"/><circle cx="5" cy="9" r="1.8"/><circle cx="19" cy="9" r="1.8"/><circle cx="12" cy="8" r="1.5"/><path d="M2 22c0-4.5 3.5-8 8-8s8 3.5 8 8"/></svg>',
    elderly: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="6" r="3"/><path d="M12 10v12"/><path d="M8 22h8"/><path d="M9 14h6"/></svg>',
    pets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="10" r="5"/><circle cx="8" cy="6" r="1.5"/><circle cx="16" cy="6" r="1.5"/><path d="M9 14l-1 4M15 14l1 4"/></svg>',
    employees: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M3 12h18"/><circle cx="12" cy="15" r="1.5"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/></svg>',
    clients: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="6" r="3"/><path d="M12 10v12"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    patients: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>',
    students: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="6" r="3"/><path d="M12 10v7"/><path d="M5 17h14"/><path d="M8 17v3M16 17v3"/></svg>',
    guests: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="6" r="3"/><path d="M12 10v12M7 22h10"/></svg>',

    // Daily Rhythm
    morning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>',
    afternoon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M4 4l4 4M16 16l4 4"/></svg>',
    evening: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M20 12h2M2 12h2"/></svg>',
    night: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
    continuous: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>',
    weekend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M3 12h18"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',

    // Natural Light
    maximize: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"/></svg>',
    balanced: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v20"/><path d="M4 12h16"/></svg>',
    minimize: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/></svg>',
    'north-facing': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v20"/></svg>',
    'south-facing': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v20M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41"/></svg>',
    'artificial-only': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M9 9l6 6M15 9l-6 6"/></svg>',

    // Acoustic
    silent: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>',
    calm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 12c0-1.5 1-3 3-3s3 1.5 3 3-1 3-3 3"/></svg>',
    lively: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>',
    'immersive-audio': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>',
    privacy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="10" rx="1"/><path d="M3 12h18"/></svg>',
    open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="10" rx="1"/><path d="M3 10h18"/></svg>',

    // Air Quality
    critical: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>',
    important: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 10v4"/></svg>',
    standard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>',
    'humid-tropical': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2c-4 4-6 7-6 10a6 6 0 0012 0c0-3-2-6-6-10z"/><path d="M9 20h6"/></svg>',
    'dry-arid': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/></svg>',
    'odor-sensitive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 9c0-1.5 1-3 3-3s3 1.5 3 3"/></svg>',

    // Temperature
    cool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="9"/></svg>',
    moderate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v8"/></svg>',
    warm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41"/></svg>',
    hot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v20M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41"/></svg>',
    cold: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/></svg>',
    variable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>',

    // Emotions
    calm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 14c1-1 2-1.5 4-1.5s3 .5 4 1.5"/><circle cx="9" cy="10" r="0.8"/><circle cx="15" cy="10" r="0.8"/></svg>',
    energized: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    inspired: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    safe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    connected: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="6" r="3"/><circle cx="5" cy="17" r="2.5"/><circle cx="19" cy="17" r="2.5"/><path d="M12 9v5M5 14.5l4.5 2M19 14.5l-4.5 2"/></svg>',
    focused: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>',
    luxurious: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>',
    grounded: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V12M8 12l4-8 4 8"/><path d="M4 22h16"/></svg>',
    playful: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 9c0-1.5 1-3 3-3s3 1.5 3 3"/></svg>',
    mysterious: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 12h6"/></svg>',

    // Current Emotions
    stressed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 9c0-1.5 1-3 3-3s3 1.5 3 3"/><path d="M9 15c1 1 3.5 1 5 0"/></svg>',
    bored: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 11h8"/></svg>',
    overwhelmed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>',
    lonely: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3.5"/><path d="M12 12v6"/><path d="M7 22h10"/></svg>',
    uncomfortable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 10c0-1.5 1-3 3-3s3 1.5 3 3"/><path d="M9 15c1 1 3.5 1 5 0"/></svg>',
    neutral: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>',
    content: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>',
    happy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 10c0-1.5 1-3 3-3s3 1.5 3 3"/><path d="M9 14s1.5 2 4 2 4-2 4-2"/></svg>',

    // Sensory
    vision: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20"/><path d="M8 6v12M16 6v12"/></svg>',
    smell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="17" r="5"/><path d="M8 17c0-3 2-6 4-6s4 3 4 6"/></svg>',
    touch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 12c0-1.5 1-3 3-3s3 1.5 3 3"/></svg>',
    temperature: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 8v8"/></svg>',
    'air-quality': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12h18"/><path d="M5 8c2 2 4 6 7 6s5-4 7-6"/></svg>',

    // Budget
    comfort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M3 12h18"/></svg>',
    premium: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M3 12h18"/><path d="M7 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/></svg>',
    luxury: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>',
    signature: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    bespoke: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/><circle cx="12" cy="12" r="9"/></svg>',

    // Style Preferences
    minimal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="10" rx="1"/><path d="M3 12h18"/></svg>',
    modern: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 4l16 16M20 4L4 20"/></svg>',
    contemporary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>',
    classic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/></svg>',
    industrial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="10" rx="1"/><path d="M3 12h18M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
    scandinavian: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>',
    japandi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12c0-2.5 2-4.5 4-4.5s4 2 4 4.5"/></svg>',
    bohemian: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 9c0-1.5 1-3 3-3s3 1.5 3 3"/></svg>',
    'art-deco': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>',
    'mid-century': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 4l16 16M20 4L4 20"/><circle cx="12" cy="12" r="3"/></svg>',
    'ultra-luxury': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>',
    organic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V12M8 14c0-2 1.5-4 4-4s4 2 4 4"/><path d="M4 22c0-4 2-8 8-8s8 4 8 8"/></svg>',
    futuristic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    eclectic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg>',

    // Timeline
    asap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    short: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 6v12"/></svg>',
    medium: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>',
    long: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 12h6"/></svg>',
    phased: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="10" rx="1"/><path d="M3 12h18"/></svg>',
    'no-rush': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/></svg>',

    // Sensory Priority
    sensory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',

    // Walkthrough / Experience
    experience: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>',

    // Membership / Services
    membership: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    services: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M3 12h18"/></svg>',

    // Themes
    nature: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V12M8 14c0-2 1.5-4 4-4s4 2 4 4"/><path d="M4 22c0-4 2-8 8-8s8 4 8 8"/></svg>',
    'modern-sleek': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 4l16 16M20 4L4 20"/></svg>',
    playful: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 9c0-1.5 1-3 3-3s3 1.5 3 3"/></svg>',

    // DD-101 Theme codes
    'dd-t100': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V12M8 14c0-2 1.5-4 4-4s4 2 4 4"/><path d="M4 22c0-4 2-8 8-8s8 4 8 8"/></svg>',
    'dd-t200': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 4l16 16M20 4L4 20"/></svg>',
    'dd-t300': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 9c0-1.5 1-3 3-3s3 1.5 3 3"/></svg>',

    // DD-100 Categories
    'american-furniture': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="7" width="16" height="10" rx="1"/><path d="M4 12h16"/></svg>',
    ceilings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18"/></svg>',
    'charcoal-infused-water': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2c-4 4-6 7-6 10a6 6 0 0012 0c0-3-2-6-6-10z"/></svg>',
    decoratives: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    'fire-fighting-equipment': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="3" width="12" height="18" rx="1"/><path d="M6 9h12"/><circle cx="12" cy="15" r="1.5"/></svg>',
    flooring: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M3 12h18M7 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/></svg>',
    'ikea-like': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 4l16 16M20 4L4 20"/></svg>',
    'lighting-and-lamps': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 8v8"/><path d="M9 20h6"/></svg>',
    'office-and-commercial-fragrances': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="17" r="5"/><path d="M8 17c0-3 2-6 4-6s4 3 4 6"/></svg>',
    'office-cleaning-services': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 12c0-1.5 1-3 3-3s3 1.5 3 3"/></svg>',
    'perfume-for-bosses': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>',
    'planner-kits': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h8M8 11h8M8 15h4"/></svg>',
    plantation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V12M8 14c0-2 1.5-4 4-4s4 2 4 4"/><path d="M4 22c0-4 2-8 8-8s8 4 8 8"/></svg>',
    'traditional-furniture': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="10" width="16" height="10" rx="1"/><path d="M4 10V7a2 2 0 012-2h2a2 2 0 012 2v3M16 10V7a2 2 0 012-2h2a2 2 0 012 2v3"/></svg>',
    walls: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="10" rx="1"/><path d="M3 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/></svg>',
    windows: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="6" width="18" height="12" rx="1"/><path d="M12 6v12"/></svg>'
};

const DD_ICON_KEYS = Object.keys(DD_ICONS);

function getDDIcon(iconKey) {
    if (!iconKey) return '';
    const key = String(iconKey).toLowerCase().trim();
    if (DD_ICONS[key]) return DD_ICONS[key];
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/></svg>`;
}

window.DD_ICONS = DD_ICONS;
window.getDDIcon = getDDIcon;
