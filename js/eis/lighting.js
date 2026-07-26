/**
 * DATUM DAHLEEZ Environmental Intelligence System
 * Lighting Intelligence Engine - Lux calculations, scene presets, and product mapping
 */

class LightingEngine {
    constructor(options = {}) {
        this.dataLoader = options.dataLoader || new DataLoader();
        this.presets = new Map();
        this.spaceDefaults = new Map();
    }

    async init() {
        const presetsData = await this.dataLoader.load('lighting-presets', '../data/lighting-presets.json').catch(() => ({ presets: [] }));
        const spacesData = await this.dataLoader.load('spaces', '../data/spaces.json').catch(() => ({ categories: [] }));
        
        if (presetsData.presets) {
            presetsData.presets.forEach(p => this.presets.set(p.id, p));
        }
        
        if (spacesData.categories) {
            spacesData.categories.forEach(cat => {
                (cat.spaces || []).forEach(space => {
                    this.spaceDefaults.set(space.id, {
                        defaultLux: space.defaultLux || 300,
                        defaultTempC: space.defaultTempC || 22,
                        areaSqftMin: space.areaSqftMin || 100,
                        areaSqftMax: space.areaSqftMax || 500
                    });
                });
            });
        }
    }

    calculateLuxRequirement(spaceId, areaSqft, ceilingHeightM) {
        const defaults = this.spaceDefaults.get(spaceId) || { defaultLux: 300 };
        const baseLux = defaults.defaultLux;
        
        let adjustment = 1.0;
        if (ceilingHeightM > 3.0) adjustment += 0.2;
        if (ceilingHeightM > 4.0) adjustment += 0.3;
        if (areaSqft > 500) adjustment -= 0.1;
        if (areaSqft > 1000) adjustment -= 0.15;
        
        const targetLux = Math.round(baseLux * adjustment);
        const totalLumens = Math.round(targetLux * areaSqft * 10.764);
        
        return {
            spaceId,
            areaSqft,
            ceilingHeightM,
            targetLux,
            totalLumens,
            adjustment,
            recommendations: this.getFixtureCount(totalLumens)
        };
    }

    getFixtureCount(totalLumens) {
        const fixtureOptions = [
            { type: 'Downlight 400lm', lumens: 400, count: Math.ceil(totalLumens / 400) },
            { type: 'Downlight 600lm', lumens: 600, count: Math.ceil(totalLumens / 600) },
            { type: 'Downlight 800lm', lumens: 800, count: Math.ceil(totalLumens / 800) },
            { type: 'Linear 1200lm', lumens: 1200, count: Math.ceil(totalLumens / 1200) },
            { type: 'Linear 1800lm', lumens: 1800, count: Math.ceil(totalLumens / 1800) },
            { type: 'Pendant 800lm', lumens: 800, count: Math.ceil(totalLumens / 800) },
            { type: 'Pendant 1200lm', lumens: 1200, count: Math.ceil(totalLumens / 1200) },
            { type: 'Strip 400lm/m', lumens: 400, count: Math.ceil(totalLumens / 400) }
        ];
        
        return fixtureOptions.filter(f => f.count > 0).slice(0, 4);
    }

    getPreset(presetId) {
        return this.presets.get(presetId) || null;
    }

    getPresetsForRhythm(rhythm) {
        const rhythmMap = {
            'morning': ['circadian-day', 'task-focused'],
            'afternoon': ['circadian-day', 'task-focused'],
            'evening': ['circadian-evening', 'ambient-glow'],
            'night': ['ambient-glow', 'cinematic'],
            'continuous': ['circadian-day', 'task-focused'],
            'weekend': ['ambient-glow', 'cinematic']
        };
        
        const presetIds = rhythmMap[rhythm] || ['ambient-glow'];
        return presetIds.map(id => this.presets.get(id)).filter(Boolean);
    }

    getSceneRecommendations(state) {
        const rhythm = state.metadata?.rhythm;
        const space = state.metadata?.selectedSpace || state.metadata?.selectedCategory;
        const emotion = state.metadata?.targetEmotion;
        
        const presets = this.getPresetsForRhythm(rhythm || 'continuous');
        
        const sceneRecs = presets.map(preset => ({
            id: preset.id,
            name: preset.name,
            description: preset.description,
            colorTempK: preset.colorTempK,
            brightness: preset.brightness,
            duration: preset.duration,
            transitionTime: preset.transitionTime,
            emotionalFit: this.scoreEmotionalFit(preset, emotion)
        }));
        
        sceneRecs.sort((a, b) => b.emotionalFit - a.emotionalFit);
        
        return {
            space,
            rhythm,
            targetEmotion: emotion,
            scenes: sceneRecs,
            primaryScene: sceneRecs[0] || null
        };
    }

    scoreEmotionalFit(preset, emotion) {
        if (!emotion) return 50;
        const emotionMap = {
            calm: ['ambient-glow', 'circadian-evening'],
            energized: ['circadian-day', 'task-focused'],
            inspired: ['circadian-day', 'ambient-glow'],
            focused: ['task-focused', 'circadian-day'],
            luxurious: ['cinematic', 'ambient-glow'],
            playful: ['circadian-day', 'ambient-glow'],
            mysterious: ['cinematic', 'ambient-glow']
        };
        
        const preferred = emotionMap[emotion] || [];
        if (preferred.includes(preset.id)) return 100;
        if (preset.id.includes('circadian')) return 70;
        return 50;
    }

    generateLightingPlan(spaceId, areaSqft, ceilingHeightM, state) {
        const luxCalc = this.calculateLuxRequirement(spaceId, areaSqft, ceilingHeightM);
        const sceneRecs = this.getSceneRecommendations(state);
        
        return {
            spaceId,
            areaSqft,
            ceilingHeightM,
            luxRequirement: luxCalc,
            sceneRecommendations: sceneRecs,
            estimatedFixtureCount: luxCalc.recommendations,
            energyEfficiencyTips: [
                'Use dimmable drivers with 0-10V or DALI control',
                'Integrate daylight harvesting sensors',
                'Specify high CRI (90+) for color accuracy',
                'Consider human-centric circadian tuning'
            ]
        };
    }
}

window.LightingEngine = LightingEngine;
