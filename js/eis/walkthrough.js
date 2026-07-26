/**
 * DATUM DAHLEEZ Environmental Intelligence System
 * Walkthrough - Dream walkthrough template engine
 */

class Walkthrough {
    constructor(options = {}) {
        this.dataLoader = options.dataLoader || new DataLoader();
        this.templates = new Map();
        this.currentTemplate = null;
    }

    async loadTemplates() {
        const sensoryData = await this.dataLoader.load('sensory', '../data/sensory.json');
        this.buildTemplates(sensoryData);
    }

    buildTemplates(sensoryData) {
        this.templates.set('calm-bedroom', this.getCalmBedroomTemplate());
        this.templates.set('energized-living', this.getEnergizedLivingTemplate());
        this.templates.set('focused-office', this.getFocusedOfficeTemplate());
        this.templates.set('luxury-villa', this.getLuxuryVillaTemplate());
        this.templates.set('wellness-spa', this.getWellnessSpaTemplate());
        this.templates.set('creative-studio', this.getCreativeStudioTemplate());
        this.templates.set('social-gathering', this.getSocialGatheringTemplate());
        this.templates.set('spiritual-retreat', this.getSpiritualRetreatTemplate());
    }

    getTemplateKey(state) {
        const emotion = state.metadata?.targetEmotion;
        const space = state.metadata?.selectedSpace || state.metadata?.selectedCategory;
        const purpose = state.metadata?.purpose;

        if (emotion === 'calm' && (space === 'bedroom' || space === 'master-bedroom')) {
            return 'calm-bedroom';
        }
        if (emotion === 'energized' && (space === 'living-room' || space === 'family-room')) {
            return 'energized-living';
        }
        if (emotion === 'focused' && (space === 'home-office' || space === 'executive-office')) {
            return 'focused-office';
        }
        if (emotion === 'luxurious' && (space === 'villa' || space === 'mansion' || space === 'penthouse')) {
            return 'luxury-villa';
        }
        if (emotion === 'spiritual' && (space === 'meditation-room' || space === 'prayer-room')) {
            return 'spiritual-retreat';
        }
        if (emotion === 'inspired' && (purpose === 'creative-expression' || space === 'architecture-office')) {
            return 'creative-studio';
        }
        if (emotion === 'connected' && (space === 'living-room' || space === 'dining-room')) {
            return 'social-gathering';
        }
        if (emotion === 'calm' && (space === 'spa-bathroom' || space === 'wellness-room' || space === 'sauna')) {
            return 'wellness-spa';
        }

        return 'calm-bedroom';
    }

    async generate(state) {
        if (this.templates.size === 0) {
            await this.loadTemplates();
        }

        const key = this.getTemplateKey(state);
        this.currentTemplate = this.templates.get(key) || this.templates.get('calm-bedroom');

        const template = this.currentTemplate;
        const personalized = this.personalizeTemplate(template, state);

        return {
            key,
            title: personalized.title,
            duration: personalized.duration,
            scenes: personalized.scenes,
            sensoryProfile: personalized.sensoryProfile,
            productHighlights: personalized.productHighlights,
            quote: personalized.quote,
            generatedAt: new Date().toISOString()
        };
    }

    personalizeTemplate(template, state) {
        const budgetTier = state.metadata?.budgetTier || 'comfort';
        const style = state.metadata?.stylePreference || 'modern';
        const targetEmotion = state.metadata?.targetEmotion || 'calm';

        return {
            ...template,
            title: `${template.title} - ${style.charAt(0).toUpperCase() + style.slice(1)} ${budgetTier.charAt(0).toUpperCase() + budgetTier.slice(1)} Edition`,
            scenes: template.scenes.map(scene => ({
                ...scene,
                description: this.injectPersonalization(scene.description, state),
                duration: Math.round(scene.duration * (0.8 + Math.random() * 0.4))
            })),
            productHighlights: template.productHighlights.filter(() => Math.random() > 0.2)
        };
    }

    injectPersonalization(text, state) {
        const emotion = state.metadata?.targetEmotion || 'beautiful';
        const space = state.metadata?.selectedSpace || 'space';
        const purpose = state.metadata?.purpose || 'living';

        return text
            .replace('{emotion}', emotion)
            .replace('{space}', space.replace(/-/g, ' '))
            .replace('{purpose}', purpose.replace(/-/g, ' '));
    }

    renderToDOM(container, walkthroughData) {
        const el = typeof container === 'string' ? document.querySelector(container) : container;
        if (!el) return;

        el.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'eis-walkthrough';

        const header = document.createElement('div');
        header.className = 'eis-walkthrough__header';
        header.innerHTML = `
            <h3 class="display eis-walkthrough__title">${walkthroughData.title}</h3>
            <p class="eis-walkthrough__meta mono">${walkthroughData.duration} min experience</p>
        `;
        wrapper.appendChild(header);

        const quote = document.createElement('blockquote');
        quote.className = 'eis-walkthrough__quote';
        quote.textContent = `"${walkthroughData.quote}"`;
        wrapper.appendChild(quote);

        const scenesContainer = document.createElement('div');
        scenesContainer.className = 'eis-walkthrough__scenes';

        walkthroughData.scenes.forEach((scene, index) => {
            const sceneEl = document.createElement('div');
            sceneEl.className = 'eis-walkthrough__scene';
            sceneEl.style.animationDelay = `${index * 0.15}s`;

            const number = document.createElement('span');
            number.className = 'eis-walkthrough__scene-number mono';
            number.textContent = String(index + 1).padStart(2, '0');
            sceneEl.appendChild(number);

            const content = document.createElement('div');
            content.className = 'eis-walkthrough__scene-content';

            const title = document.createElement('h4');
            title.className = 'eis-walkthrough__scene-title';
            title.textContent = scene.title;
            content.appendChild(title);

            const desc = document.createElement('p');
            desc.className = 'eis-walkthrough__scene-desc';
            desc.textContent = scene.description;
            content.appendChild(desc);

            const sensory = document.createElement('div');
            sensory.className = 'eis-walkthrough__scene-sensory mono';
            const parts = String(scene.sensory || '').split(' ');
            const iconKey = parts.shift();
            const label = parts.join(' ');
            const iconSvg = getDDIcon(iconKey);
            sensory.innerHTML = `<span class="eis-badge">${iconSvg ? iconSvg + ' ' : ''}${label}</span> ${scene.duration}s`;
            content.appendChild(sensory);

            sceneEl.appendChild(content);
            scenesContainer.appendChild(sceneEl);
        });

        wrapper.appendChild(scenesContainer);

        const sensoryProfile = document.createElement('div');
        sensoryProfile.className = 'eis-walkthrough__profile';
        sensoryProfile.innerHTML = `
            <h4 class="display">Sensory Profile</h4>
            <div class="eis-walkthrough__profile-grid">
                ${walkthroughData.sensoryProfile.map(s => `
                    <div class="eis-walkthrough__profile-item">
                        <span class="eis-walkthrough__profile-icon">${getDDIcon(s.icon)}</span>
                        <span class="eis-walkthrough__profile-label">${s.label}</span>
                        <span class="eis-walkthrough__profile-value mono">${s.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
        wrapper.appendChild(sensoryProfile);

        el.appendChild(wrapper);
    }

    getCalmBedroomTemplate() {
        return {
            title: "The Sanctuary",
            duration: "3",
            quote: "A bedroom should be a retreat from the world.",
            sensoryProfile: [
                { icon: "vision", label: "Vision", value: "2700K Warm" },
                { icon: "sound", label: "Sound", value: "Silence" },
                { icon: "smell", label: "Smell", value: "Lavender" },
                { icon: "touch", label: "Touch", value: "Linen" },
                { icon: "temperature", label: "Temp", value: "20C" },
                { icon: "air-quality", label: "Air", value: "HEPA" }
            ],
            scenes: [
                { title: "Entry", description: "Soft light greets you as the door opens, {emotion} and unhurried.", sensory: "vision Vision", duration: 30 },
                { title: "Decompress", description: "Remove the day. A linen bench, a mirror, quiet breath.", sensory: "touch Touch", duration: 45 },
                { title: "Rest", description: "The bed awaits. Blackout curtains. Weighted blanket. You sink into {emotion}.", sensory: "touch Touch", duration: 60 },
                { title: "Drift", description: "Warm amber glow fades. Lavender fills the air. You fall into deep, restorative sleep.", sensory: "smell Smell", duration: 60 }
            ],
            productHighlights: ["bedroom-basics", "lighting-ambient", "curtains-blinds"]
        };
    }

    getEnergizedLivingTemplate() {
        return {
            title: "The Power Living Room",
            duration: "2",
            quote: "Energy flows where attention goes.",
            sensoryProfile: [
                { icon: "vision", label: "Vision", value: "4000K Bright" },
                { icon: "sound", label: "Sound", value: "Upbeat" },
                { icon: "smell", label: "Smell", value: "Citrus" },
                { icon: "touch", label: "Touch", value: "Leather" },
                { icon: "temperature", label: "Temp", value: "22C" },
                { icon: "air-quality", label: "Air", value: "Fresh" }
            ],
            scenes: [
                { title: "Morning Rush", description: "Sunlight floods in. Music starts. The space pulses with {emotion} energy.", sensory: "vision Vision", duration: 30 },
                { title: "Focus Zone", description: "Task lighting for projects. Acoustic panels keep sound crisp and clear.", sensory: "sound Sound", duration: 45 },
                { title: "Social Hub", description: "Seating arrangement invites conversation. Smart speakers fill the room.", sensory: "sound Sound", duration: 45 },
                { title: "Evening Wind-down", description: "Lights dim. Ambient glow returns. The space breathes with you.", sensory: "vision Vision", duration: 30 }
            ],
            productHighlights: ["lighting-architectural", "audio-systems", "smart-home"]
        };
    }

    getFocusedOfficeTemplate() {
        return {
            title: "The Deep Work Studio",
            duration: "2",
            quote: "Clarity of space brings clarity of mind.",
            sensoryProfile: [
                { icon: "vision", label: "Vision", value: "5000K Task" },
                { icon: "sound", label: "Sound", value: "White Noise" },
                { icon: "smell", label: "Smell", value: "Pine" },
                { icon: "touch", label: "Touch", value: "Bamboo" },
                { icon: "temperature", label: "Temp", value: "21C" },
                { icon: "air-quality", label: "Air", value: "HEPA" }
            ],
            scenes: [
                { title: "Morning Routine", description: "Adjustable desk rises. Task light illuminates your workspace.", sensory: "vision Vision", duration: 30 },
                { title: "Deep Focus", description: "White noise masks distractions. Ergonomic chair supports your posture.", sensory: "sound Sound", duration: 60 },
                { title: "Creative Break", description: "Stretch. Look at art. Sip tea. Reset for the next sprint.", sensory: "touch Touch", duration: 30 },
                { title: "Session End", description: "Lights warm. Desk lowers. Work complete. Mind clear.", sensory: "vision Vision", duration: 30 }
            ],
            productHighlights: ["lighting-task", "workspace-furniture", "smart-desk"]
        };
    }

    getLuxuryVillaTemplate() {
        return {
            title: "The Palace",
            duration: "5",
            quote: "Luxury is not about price. It is about the absence of compromise.",
            sensoryProfile: [
                { icon: "vision", label: "Vision", value: "Tunable 2700-5000K" },
                { icon: "sound", label: "Sound", value: "Spatial Audio" },
                { icon: "smell", label: "Smell", value: "Custom Blend" },
                { icon: "touch", label: "Touch", value: "Marble / Silk" },
                { icon: "temperature", label: "Temp", value: "22C Zone" },
                { icon: "air-quality", label: "Air", value: "Medical Grade" }
            ],
            scenes: [
                { title: "Grand Entry", description: "The doors open. Chandeliers illuminate marble floors. You are home.", sensory: "vision Vision", duration: 45 },
                { title: "Living Majesty", description: "Scenic lighting drapes the room in gold. Conversation flows effortlessly.", sensory: "vision Vision", duration: 60 },
                { title: "Private Spa", description: "Steam rises. Marble is warm. You enter a state of pure {emotion}.", sensory: "touch Touch", duration: 60 },
                { title: "Starlit Terrace", description: "The terrace glows. The city breathes below. This is your kingdom.", sensory: "vision Vision", duration: 45 }
            ],
            productHighlights: ["luxury-materials", "lighting-scenic", "bespoke-furniture"]
        };
    }

    getWellnessSpaTemplate() {
        return {
            title: "The Healing Space",
            duration: "4",
            quote: "Wellness is not a destination. It is a space you inhabit.",
            sensoryProfile: [
                { icon: "vision", label: "Vision", value: "Color Therapy" },
                { icon: "sound", label: "Sound", value: "Nature Sounds" },
                { icon: "smell", label: "Smell", value: "Eucalyptus" },
                { icon: "touch", label: "Touch", value: "Warm Stone" },
                { icon: "temperature", label: "Temp", value: "38C Water" },
                { icon: "air-quality", label: "Air", value: "Humidified" }
            ],
            scenes: [
                { title: "Arrival", description: "Soft light. Eucalyptus fills the air. Your shoulders drop.", sensory: "smell Smell", duration: 45 },
                { title: "Hydrotherapy", description: "Water embraces you. Jets pulse. Temperature perfect.", sensory: "temperature Temperature", duration: 60 },
                { title: "Steam & Sauna", description: "Heat expands pores. Stone radiates warmth. Detoxification begins.", sensory: "temperature Temperature", duration: 45 },
                { title: "Restoration", description: "Cool plunge. Herbal tea. You emerge renewed, in a state of {emotion}.", sensory: "touch Touch", duration: 60 }
            ],
            productHighlights: ["wellness-spa", "lighting-wellness", "air-quality"]
        };
    }

    getCreativeStudioTemplate() {
        return {
            title: "The Creative Forge",
            duration: "3",
            quote: "Every masterpiece begins with a single spark of inspiration.",
            sensoryProfile: [
                { icon: "vision", label: "Vision", value: "High CRI 95+" },
                { icon: "sound", label: "Sound", value: "Inspirational" },
                { icon: "smell", label: "Smell", value: "Fresh Paper" },
                { icon: "touch", label: "Touch", value: "Wood / Fabric" },
                { icon: "temperature", label: "Temp", value: "21C" },
                { icon: "air-quality", label: "Air", value: "Ventilated" }
            ],
            scenes: [
                { title: "Muse Board", description: "Color swatches, textures, references surround you. Inspiration everywhere.", sensory: "vision Vision", duration: 45 },
                { title: "Maker Zone", description: "Task lighting reveals detail. Tools at hand. The work begins.", sensory: "vision Vision", duration: 60 },
                { title: "Gallery Wall", description: "Finished pieces inspire the next. The cycle of creation continues.", sensory: "vision Vision", duration: 30 },
                { title: "Reflection", description: "You step back. The space holds your {emotion}. Ready for more.", sensory: "sound Sound", duration: 30 }
            ],
            productHighlights: ["lighting-studio", "art-supplies", "storage-organization"]
        };
    }

    getSocialGatheringTemplate() {
        return {
            title: "The Heart of the Home",
            duration: "3",
            quote: "The best spaces are the ones that bring people together.",
            sensoryProfile: [
                { icon: "vision", label: "Vision", value: "Layered Ambient" },
                { icon: "sound", label: "Sound", value: "Background Music" },
                { icon: "smell", label: "Smell", value: "Fresh Bread" },
                { icon: "touch", label: "Touch", value: "Velvet / Linen" },
                { icon: "temperature", label: "Temp", value: "22C" },
                { icon: "air-quality", label: "Air", value: "Fresh" }
            ],
            scenes: [
                { title: "Welcome", description: "Warm light greets guests. The space radiates {emotion} and hospitality.", sensory: "vision Vision", duration: 30 },
                { title: "Conversation", description: "Seating arranged for dialogue. Acoustics enhance every laugh.", sensory: "sound Sound", duration: 60 },
                { title: "Feast", description: "Table set. Ambrosial aromas fill the room. Connection deepens.", sensory: "smell Smell", duration: 60 },
                { title: "Toast", description: "Glasses clink. The moment lingers. You feel {emotion} and grateful.", sensory: "vision Vision", duration: 30 }
            ],
            productHighlights: ["lighting-social", "audio-entertainment", "furniture-living"]
        };
    }

    getSpiritualRetreatTemplate() {
        return {
            title: "The Sacred Space",
            duration: "4",
            quote: "In the architecture of silence, we find ourselves.",
            sensoryProfile: [
                { icon: "vision", label: "Vision", value: "Candlelight / Stained Glass" },
                { icon: "sound", label: "Sound", value: "Chant / Bell" },
                { icon: "smell", label: "Smell", value: "Sandalwood" },
                { icon: "touch", label: "Touch", value: "Brass / Stone" },
                { icon: "temperature", label: "Temp", value: "20C" },
                { icon: "air-quality", label: "Air", value: "Pure" }
            ],
            scenes: [
                { title: "Threshold", description: "You cross the threshold. Light shifts. The world outside falls away.", sensory: "vision Vision", duration: 45 },
                { title: "Centering", description: "Incense rises. Brass bells chime. You ground yourself in {emotion}.", sensory: "smell Smell", duration: 60 },
                { title: "Devotion", description: "Sacred geometry surrounds you. Acoustics carry prayer to the heavens.", sensory: "sound Sound", duration: 60 },
                { title: "Transcendence", description: "Light fades. You remain. Changed. Connected. At peace.", sensory: "vision Vision", duration: 45 }
            ],
            productHighlights: ["lighting-spiritual", "sacred-materials", "acoustic-sacred"]
        };
    }

    getCurrentTemplate() {
        return this.currentTemplate;
    }

    hasTemplate(key) {
        return this.templates.has(key);
    }
}

window.Walkthrough = Walkthrough;
