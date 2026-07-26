/**
 * DATUM DAHLEEZ Environmental Intelligence System
 * Blueprint Generator - Auto-generates structured 12-section report from consultation state
 */

class BlueprintGenerator {
    constructor(options = {}) {
        this.dataLoader = options.dataLoader || new DataLoader();
        this.templates = new Map();
    }

    async generate(state) {
        const [
            recommendations,
            spacesData,
            themesData,
            emotionsData,
            budgetData
        ] = await Promise.all([
            this.dataLoader.load('recommendations', '../data/recommendations.json'),
            this.dataLoader.load('spaces', '../data/spaces.json'),
            this.dataLoader.load('themes', '../data/themes.json'),
            this.dataLoader.load('emotions', '../data/emotions.json'),
            this.dataLoader.load('budgetTiers', '../data/budget-tiers.json')
        ]);

        const spaceName = (state.metadata.selectedSpace || state.metadata.selectedCategory || 'Your Space').replace(/-/g, ' ');
        const themeName = state.metadata.theme ? state.metadata.theme.replace(/-/g, ' ') : null;
        const targetEmotion = state.metadata.targetEmotion || 'calm';
        const currentEmotion = state.metadata.currentEmotion || 'neutral';
        const budgetTier = state.metadata.budgetTier || 'comfort';
        const stylePreference = state.metadata.stylePreference || 'modern';
        const rhythm = state.metadata.rhythm || 'continuous';
        const lightPreference = state.metadata.lightPreference || 'balanced';
        const acousticNeeds = state.metadata.acousticNeeds || 'calm';
        const airQuality = state.metadata.airQuality || 'standard';
        const temperaturePreference = state.metadata.temperaturePreference || 'moderate';
        const occupants = state.metadata.occupants || [];
        const contributors = state.contributors || [];

        const sections = [
            this.sectionExecutiveSummary(spaceName, targetEmotion, budgetTier, contributors),
            this.sectionSpaceDNA(state, spacesData),
            this.sectionEmotionalDNA(currentEmotion, targetEmotion, emotionsData),
            this.sectionDesignPhilosophy(stylePreference, themeName, targetEmotion),
            this.sectionMaterialStrategy(state, spacesData),
            this.sectionLightingPlan(state),
            this.sectionAirWellnessStrategy(airQuality, temperaturePreference),
            this.sectionFurnitureStrategy(state, recommendations),
            this.sectionTechnologyStrategy(state),
            this.sectionBudgetOptions(budgetTier, budgetData, recommendations),
            this.sectionImplementationRoadmap(state.metadata.timeline),
            this.sectionMaintenanceGuide()
        ];

        return {
            title: `Dream Space Blueprint — ${spaceName}`,
            spaceName,
            themeName,
            generatedAt: new Date().toISOString(),
            sections,
            metadata: {
                targetEmotion,
                currentEmotion,
                budgetTier,
                stylePreference,
                rhythm,
                lightPreference,
                acousticNeeds,
                airQuality,
                temperaturePreference,
                occupants,
                contributors
            }
        };
    }

    sectionExecutiveSummary(spaceName, targetEmotion, budgetTier, contributors) {
        const contributorNames = contributors.map(c => c.name).join(', ') || 'Primary stakeholder';
        return {
            title: 'Executive Summary',
            content: `This blueprint outlines the transformation of ${spaceName} into an environment that cultivates ${targetEmotion}. Prepared for ${contributorNames}. Investment range: ${budgetTier.charAt(0).toUpperCase() + budgetTier.slice(1)} tier. The design philosophy integrates spatial intelligence, sensory optimization, and emotional architecture to create a space that actively supports wellbeing and lifestyle objectives.`
        };
    }

    sectionSpaceDNA(state, spacesData) {
        const selectedSpace = state.metadata.selectedSpace || state.metadata.selectedCategory || 'unknown';
        const spaceEntry = (spacesData.categories || []).flatMap(c => c.spaces || []).find(s => s.id === selectedSpace);
        
        if (!spaceEntry) {
            return { title: 'Space DNA', content: `Space type: ${selectedSpace}. Detailed spatial analysis pending further data input.` };
        }

        const areaRange = `${spaceEntry.areaSqftMin}-${spaceEntry.areaSqftMax} sqft`;
        const climate = spaceEntry.climateZones ? spaceEntry.climateZones.join(', ') : 'All climates';
        const occupancy = spaceEntry.occupantCapacity ? `${spaceEntry.occupantCapacity[0]}-${spaceEntry.occupantCapacity[1]} people` : 'Flexible';

        return {
            title: 'Space DNA',
            content: `Space classification: ${spaceEntry.name}. Typical area range: ${areaRange}. Occupant capacity: ${occupancy}. Climate suitability: ${climate}. Default lux target: ${spaceEntry.defaultLux} lux. Acoustic target RT60: ${spaceEntry.acousticTargetRT60}s. Preferred temperature: ${spaceEntry.defaultTempC}°C. Preferred styles: ${(spaceEntry.preferredStyles || []).join(', ')}.`
        };
    }

    sectionEmotionalDNA(currentEmotion, targetEmotion, emotionsData) {
        const emotionalGap = currentEmotion !== targetEmotion;
        const gapText = emotionalGap 
            ? `The current emotional state (${currentEmotion}) differs from the target (${targetEmotion}). Design interventions prioritize bridging this gap through spatial, material, and sensory strategies.`
            : `The space already aligns with the ${targetEmotion} emotional goal. Recommendations focus on sustaining and deepening this quality.`;

        return {
            title: 'Emotional DNA',
            content: `Current emotional state: ${currentEmotion}. Target emotional state: ${targetEmotion}. ${gapText} Sensory priorities are weighted to reinforce the target emotion. Color palette supports the emotional transition. Lighting scenes are sequenced to guide circadian and psychological rhythm toward the desired state.`
        };
    }

    sectionDesignPhilosophy(stylePreference, themeName, targetEmotion) {
        const themeText = themeName ? `Theme: ${themeName}.` : 'No specific theme selected.';
        return {
            title: 'Design Philosophy',
            content: `Style direction: ${stylePreference.charAt(0).toUpperCase() + stylePreference.slice(1)}. ${themeText} Target emotion: ${targetEmotion}. The design integrates material honesty, sensory layering, and functional beauty. Every element from material selection to lighting temperature serves the emotional objective. The space is conceived as a living environment that adapts to daily rhythms while maintaining visual and tactile coherence.`
        };
    }

    sectionMaterialStrategy(state, spacesData) {
        const selectedSpace = state.metadata.selectedSpace || state.metadata.selectedCategory || 'unknown';
        const spaceEntry = (spacesData.categories || []).flatMap(c => c.spaces || []).find(s => s.id === selectedSpace);
        const compatible = spaceEntry?.compatibleMaterials || [];
        const incompatible = spaceEntry?.incompatibleMaterials || [];

        return {
            title: 'Material Strategy',
            content: compatible.length > 0
                ? `Recommended materials for ${selectedSpace.replace(/-/g, ' ')}: ${compatible.join(', ')}. These materials were selected for tactile quality, acoustic performance, light interaction, and durability. ${incompatible.length > 0 ? 'Avoid: ' + incompatible.join(', ') + '.' : 'No known material exclusions for this profile.'}`
                : 'Material recommendations pending space-specific analysis.'
        };
    }

    sectionLightingPlan(state) {
        const rhythm = state.metadata.rhythm || 'continuous';
        const emotion = state.metadata.targetEmotion || 'calm';
        
        let primaryScene = 'Ambient Glow';
        let colorTemp = '2200K';
        let brightness = '20%';
        
        if (rhythm === 'morning' || rhythm === 'afternoon') {
            primaryScene = 'Circadian Day';
            colorTemp = '6500K';
            brightness = '100%';
        } else if (emotion === 'focused') {
            primaryScene = 'Task Focused';
            colorTemp = '4000K';
            brightness = '100%';
        } else if (emotion === 'luxurious') {
            primaryScene = 'Cinematic';
            colorTemp = '2000K';
            brightness = '10%';
        }

        return {
            title: 'Lighting Plan',
            content: `Primary scene: ${primaryScene}. Color temperature: ${colorTemp}. Brightness: ${brightness}. Automated transitions follow circadian rhythm: energizing cool white during active hours, warm amber for evening wind-down. Layering includes ambient, task, and accent zones. All fixtures specified with high CRI (90+) for accurate color rendering. Smart control integration enables scene recall via voice, app, or schedule.`
        };
    }

    sectionAirWellnessStrategy(airQuality, temperaturePreference) {
        const tempMap = {
            cool: '18-20°C',
            moderate: '21-23°C',
            warm: '24-26°C',
            hot: '26-28°C with active cooling',
            cold: '18-20°C with active heating',
            variable: 'Zoned climate with seasonal automation'
        };
        
        const airMap = {
            critical: 'HEPA filtration + CO2 monitoring + active ventilation',
            important: 'MERV-13 filtration + regular air changes',
            standard: 'Natural ventilation with mechanical backup',
            'humid-tropical': 'Dehumidification + anti-microbial treatment',
            'dry-arid': 'Humidification + sealed envelope',
            'odor-sensitive': 'Activated carbon filtration + source control'
        };

        return {
            title: 'Air & Wellness Strategy',
            content: `Temperature target: ${tempMap[temperaturePreference] || tempMap.moderate}. Air quality approach: ${airMap[airQuality] || airMap.standard}. Supplemental strategies include biophilic elements (plants, water features), fragrance systems aligned with target emotion, and acoustic zoning for mental wellbeing. Humidity maintained between 40-60% RH for occupant health.`
        };
    }

    sectionFurnitureStrategy(state, recommendations) {
        const topCollections = (recommendations.collections || []).slice(0, 3).map(c => c.name);
        const collectionsText = topCollections.length > 0 ? topCollections.join(', ') : 'To be determined based on final selections';
        
        return {
            title: 'Furniture Strategy',
            content: `Primary collection focus: ${collectionsText}. Furniture layout optimized for traffic flow, social interaction, and task efficiency. Pieces selected for scale, proportion, and tactile quality. Ergonomic considerations integrated for seating and work surfaces. Flexible arrangements allow the space to adapt between modes (social, private, task). Storage solutions are woven into the architecture to maintain visual calm.`
        };
    }

    sectionTechnologyStrategy(state) {
        const hasSmart = ['living', 'bedroom', 'work-study', 'hospitality', 'retail-commercial'].includes(state.metadata.selectedSpace || '');
        const smartText = hasSmart ? 'Smart home integration includes: automated lighting scenes, climate control, voice commands, occupancy sensing, and app-based management.' : 'Technology integration limited to essential systems: lighting control, climate management, and audio-visual infrastructure where required.';
        
        return {
            title: 'Technology Strategy',
            content: `${smartText} Wiring and infrastructure designed for current needs with future expansion capacity. Wireless protocols: Zigbee, Z-Wave, Matter. Energy monitoring provides usage insights and optimization recommendations. Cybersecurity and privacy controls ensure data integrity.`
        };
    }

    sectionBudgetOptions(budgetTier, budgetData, recommendations) {
        const tiers = ['comfort', 'premium', 'luxury', 'signature', 'bespoke'];
        const currentIndex = tiers.indexOf(budgetTier);
        const options = tiers.slice(Math.max(0, currentIndex - 1)).map(t => {
            const range = { comfort: 'AED 50K-150K', premium: 'AED 150K-500K', luxury: 'AED 500K-1.5M', signature: 'AED 1.5M-5M', bespoke: 'AED 5M+' };
            return `${t.charAt(0).toUpperCase() + t.slice(1)}: ${range[t]}`;
        }).join(' / ');
        
        return {
            title: 'Budget Options',
            content: `Selected tier: ${budgetTier.charAt(0).toUpperCase() + budgetTier.slice(1)}. Alternative options: ${options}. Each tier maintains the same design intent but varies in material selection, craftsmanship level, and technology integration. Phased implementation allows the project to begin at Comfort tier and evolve toward Signature or Bespoke over time.`
        };
    }

    sectionImplementationRoadmap(timeline) {
        const roadmap = {
            'asap': 'Accelerated 4-week sprint: design freeze, procurement rush-order, parallel installation tracks, quality checks.',
            'short': '6-8 week execution: design freeze, staggered procurement, phased installation, punch list.',
            'medium': '3-4 month plan: concept development, design development, procurement, installation, commissioning.',
            'long': '6-12 month plan: full design process, custom fabrication, phased rollout, commissioning.',
            'phased': 'Pilot space first, validate design DNA, then roll out to remaining spaces. Allows learning and adjustment.',
            'no-rush': 'Bespoke timeline. Prioritize perfect material sourcing, artisan collaboration, and iterative refinement.'
        };

        return {
            title: 'Implementation Roadmap',
            content: roadmap[timeline] || roadmap.medium
        };
    }

    sectionMaintenanceGuide() {
        return {
            title: 'Maintenance Guide',
            content: 'Materials selected for durability and low-maintenance characteristics where possible. Cleaning protocols established per material type. Annual maintenance calendar covers: HVAC filter replacement, lighting inspection, fabric cleaning, stone sealing (where applicable), smart system updates, and warranty review. Long-term care preserves the design intent and extends asset life. Detailed maintenance schedules provided per room post-completion.'
        };
    }

    renderToHTML(blueprint) {
        return `
            <div class="blueprint" style="background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; line-height: 1.7;">
                <div class="blueprint__header" style="border-bottom: 2px solid var(--gold); padding-bottom: 1.5rem; margin-bottom: 2rem;">
                    <div class="blueprint__eyebrow" style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem;">Datum Dahleez Confidential</div>
                    <h1 class="blueprint__title display" style="font-size: clamp(2rem, 4vw, 3rem); margin: 0; line-height: 1.2;">${blueprint.title}</h1>
                    <div class="blueprint__meta" style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--muted); margin-top: 0.5rem;">Generated: ${new Date(blueprint.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                ${blueprint.sections.map((section, i) => `
                    <div class="blueprint__section" style="margin-bottom: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                        <h2 class="blueprint__section-title display" style="font-size: 1.5rem; margin: 0 0 0.75rem; color: var(--gold);">${i + 1}. ${section.title}</h2>
                        <p style="color: var(--soft-silver); margin: 0; font-size: 0.95rem;">${section.content}</p>
                    </div>
                `).join('')}
                <div class="blueprint__footer" style="margin-top: 3rem; padding-top: 1.5rem; border-top: 2px solid var(--border); font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--muted); text-align: center;">
                    DATUM DAHLEEZ Environmental Intelligence Platform · Confidential Client Document
                </div>
            </div>
        `;
    }
}

window.BlueprintGenerator = BlueprintGenerator;
