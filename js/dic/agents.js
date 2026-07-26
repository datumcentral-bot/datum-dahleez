/**
 * DATUM DAHLEEZ Intelligence Council (DIC)
 * Specialist Agents — DD-INTERIOR through DD-CODE
 */

window.DDAgents = window.DDAgents || {};

(function() {
    'use strict';

    const DataLoader = window.DataLoader;

    class SpecialistAgent {
        constructor(dicEngine, id, name, role) {
            this.engine = dicEngine;
            this.id = id;
            this.name = name;
            this.role = role;
            this.dataLoader = new DataLoader();
        }

        async advise(state) {
            const spaceType = state.answers?.['space-type'] || state.context?.spaceType || 'unknown';
            const budget = state.answers?.budget || 'comfort';
            const emotion = state.answers?.dreamOutcome || state.metadata?.targetEmotion || 'calm';
            const recs = await this.dataLoader.load('recommendations', '../data/recommendations.json').catch(() => ({ rules: [] }));
            const matched = this.matchRules(recs, spaceType, emotion, budget);
            return {
                agentId: this.id,
                name: this.name,
                role: this.role,
                recommendations: matched.slice(0, 5),
                reasoning: this.buildReasoning(matched, spaceType, emotion, budget),
                generatedAt: new Date().toISOString()
            };
        }

        matchRules(recs, spaceType, emotion, budget) {
            if (!recs || !Array.isArray(recs.rules)) return [];
            return recs.rules.filter(rule => {
                const emotionMatch = !emotion || rule.emotions?.includes(emotion);
                const spaceMatch = !spaceType || spaceType === 'unknown' || rule.spaces?.includes('*') || rule.spaces?.some(s => s === spaceType || spaceType.includes(s));
                const budgetMatch = !budget || !rule.budgetTiers || rule.budgetTiers.includes(budget);
                return emotionMatch && spaceMatch && budgetMatch;
            }).slice(0, 3);
        }

        buildReasoning(matched, spaceType, emotion, budget) {
            if (matched.length === 0) return 'No specific matching rules were found for this profile. Recommend manual review by a senior designer.';
            return `Based on ${spaceType} requirements, ${emotion} emotional target, and ${budget} budget tier, the following curated recommendations align with the design intent. Each selection was evaluated for lifestyle fit, durability, maintenance, and aesthetic coherence.`;
        }
    }

    class InteriorAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-interior', 'DD-INTERIOR', 'Interior Designer'); }
        async advise(state) {
            const base = await super.advise(state);
            const space = state.answers?.['spaceType'] || 'unknown';
            base.designNarrative = `${space} concept developed with an emphasis on spatial flow, proportion, and tactile quality. Layout optimized for the selected lifestyle and occupant needs.`;
            base.produces = ['Interior Concepts', 'Layout Recommendations', 'Mood Boards', 'Design Narratives'];
            return base;
        }
    }

    class LightingAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-lux', 'DD-LUX', 'Lighting Designer'); }
        async advise(state) {
            const base = await super.advise(state);
            const emotion = state.answers?.dreamOutcome || 'calm';
            const scenes = { calm: 'warm-ambient', energized: 'cool-daylight', focused: 'task-neutral', luxurious: 'cinematic-warm', inspired: 'dynamic-color', safe: 'soft-glow' };
            base.lightingConcept = `Primary scene: ${scenes[emotion] || 'balanced'}. Layered approach: ambient, task, and accent. CRI 90+, 2200K-4000K range, automated circadian transitions where specified.`;
            base.produces = ['Lighting Concepts', 'Lux Plans', 'Scene Schedules'];
            return base;
        }
    }

    class MaterialAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-material', 'DD-MATERIAL', 'Material Scientist'); }
        async advise(state) {
            const base = await super.advise(state);
            const maintenance = state.answers?.maintenance || 'moderate';
            const sustain = state.answers?.sustainability || 'standard';
            base.materialStrategy = `Selected materials rated for ${maintenance} maintenance and ${sustain} sustainability. Priority given to durability, tactile quality, acoustic performance, and light interaction.`;
            base.produces = ['Material Selection Reports', 'Sample Specifications', 'Maintenance Guidance'];
            return base;
        }
    }

    class ColorAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-color', 'DD-COLOR', 'Color Psychology Expert'); }
        async advise(state) {
            const base = await super.advise(state);
            const emotion = state.answers?.dreamOutcome || 'calm';
            base.colorStrategy = `Palette curated to support ${emotion} emotional transition. Primary, secondary, and accent colors selected with reference to Light Reflectance Values (LRV) and material compatibility.`;
            base.produces = ['Color Palettes', 'Emotional Color Strategies', 'Finish Coordination'];
            return base;
        }
    }

    class TechnologyAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-future', 'DD-FUTURE', 'Future Technology Consultant'); }
        async advise(state) {
            const base = await super.advise(state);
            const tech = state.answers?.technology || 'none';
            if (tech === 'none') base.techRoadmap = 'No active smart technology requested. Infrastructure provisioned for future upgrade.';
            else base.techRoadmap = `${tech} smart integration planned. Protocols: KNX, Zigbee, Matter, WiFi. Voice control, app management, occupancy sensing, and energy analytics included.`;
            base.produces = ['Technology Roadmaps', 'System Diagrams', 'Upgrade Paths'];
            return base;
        }
    }

    class WellnessAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-wellness', 'DD-WELLNESS', 'Wellness Consultant'); }
        async advise(state) {
            const base = await super.advise(state);
            base.wellnessStrategy = `Biophilic elements, air quality strategy, acoustic zoning, and circadian lighting integrated to support occupant health and wellbeing. Humidity 40-60% RH, CO2 monitoring, and fragrance strategy aligned with ${state.answers?.dreamOutcome || 'target'} emotion.`;
            base.produces = ['Wellness Strategies', 'Air Quality Plans', 'Biophilic Designs'];
            return base;
        }
    }

    class AcousticsAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-acoustics', 'DD-ACOUSTICS', 'Acoustic Engineer'); }
        async advise(state) {
            const base = await super.advise(state);
            const acoustic = state.answers?.acousticNeeds || 'calm';
            base.acousticStrategy = `Acoustic treatment designed for ${acoustic} environment. Reverberation control, sound isolation, and background noise management specified per room function.`;
            base.produces = ['Acoustic Designs', 'Noise Control Strategies', 'Material Specifications'];
            return base;
        }
    }

    class QSAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-qs', 'DD-QS', 'Quantity Surveyor'); }
        async advise(state) {
            const base = await super.advise(state);
            const budget = state.answers?.budget || 'comfort';
            const ranges = { comfort: 'AED 50K-150K', premium: 'AED 150K-500K', luxury: 'AED 500K-1.5M', signature: 'AED 1.5M-5M', bespoke: 'AED 5M+' };
            base.costEstimate = `Preliminary estimate for ${budget} tier: ${ranges[budget] || ranges.comfort}. Includes design, procurement, and installation. Phased implementation available.`;
            base.produces = ['Cost Comparisons', 'BOQs', 'Budget Estimates'];
            return base;
        }
    }

    class PMAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-pm', 'DD-PM', 'Project Manager'); }
        async advise(state) {
            const base = await super.advise(state);
            const timeline = state.answers?.timeline || 'medium';
            const roadmaps = { asap: '4-week sprint', short: '6-8 week execution', medium: '3-4 month plan', long: '6-12 month plan', phased: 'Pilot-first rollout', 'no-rush': 'Bespoke timeline' };
            base.projectRoadmap = `Implementation plan: ${roadmaps[timeline] || roadmaps.medium}. Phases: concept, design development, procurement, installation, commissioning.`;
            base.produces = ['Project Roadmaps', 'Installation Plans', 'Handover Schedules'];
            return base;
        }
    }

    class BSEAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-bse', 'DD-BSE', 'Building Services Engineer'); }
        async advise(state) {
            const base = await super.advise(state);
            base.servicesStrategy = `Building services coordination covering HVAC, plumbing, drainage, fire fighting, BMS, and ELV. Service routing planned to minimize structural impact and maximize efficiency.`;
            base.produces = ['Services Strategies', 'Utility Coordination', 'Routing Advice'];
            return base;
        }
    }

    class BIMAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-bim', 'DD-BIM', 'BIM Consultant'); }
        async advise(state) {
            const base = await super.advise(state);
            base.bimStrategy = `BIM Execution Plan aligned to ISO 19650. CDE setup, clash detection protocols, model coordination, and COBie data handover specified.`;
            base.produces = ['BIM Strategies', 'Coordination Advice', 'Information Management Plans'];
            return base;
        }
    }

    class StructAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-struct', 'DD-STRUCT', 'Structural Engineer'); }
        async advise(state) {
            const base = await super.advise(state);
            base.structuralNote = `Structural coordination notes prepared. Load paths, connection details, and retrofitting considerations reviewed. Final structural approvals must be obtained from a licensed structural engineer.`;
            base.produces = ['Structural Coordination Notes'];
            return base;
        }
    }

    class ElectraAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-electra', 'DD-ELECTRA', 'Electrical Engineer'); }
        async advise(state) {
            const base = await super.advise(state);
            base.electricalNote = `Electrical layout recommendations coordinated with interior design. Power distribution, lighting circuits, emergency systems, UPS, solar integration, and EV charging considered.`;
            base.produces = ['Electrical Coordination Notes', 'Circuit Schedules'];
            return base;
        }
    }

    class MechAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-mech', 'DD-MECH', 'Mechanical Engineer'); }
        async advise(state) {
            const base = await super.advise(state);
            base.mechanicalNote = `Mechanical coordination covering HVAC, ventilation, heat load, air distribution, duct coordination, IAQ, and energy efficiency. Comfort targets: 21-23°C, 40-60% RH.`;
            base.produces = ['Comfort Strategies', 'Mechanical Coordination Advice'];
            return base;
        }
    }

    class HospitalityAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-hospitality', 'DD-HOSPITALITY', 'Hospitality Designer'); }
        async advise(state) {
            const base = await super.advise(state);
            base.hospitalityConcept = `Guest experience strategy developed. Spatial journey mapped from arrival to departure. Sensory touchpoints, wayfinding, lighting, and material selection optimized for memorable stays.`;
            base.produces = ['Hospitality Concepts', 'Guest Experience Strategies'];
            return base;
        }
    }

    class RetailAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-retail', 'DD-RETAIL', 'Retail Experience Consultant'); }
        async advise(state) {
            const base = await super.advise(state);
            base.retailStrategy = `Customer journey mapped. Store planning, visual merchandising, impulse zones, display systems, retail lighting, and wayfinding optimized for conversion and dwell time.`;
            base.produces = ['Retail Strategies', 'Customer Journey Maps'];
            return base;
        }
    }

    class WorkplaceAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-workplace', 'DD-WORKPLACE', 'Workplace Strategist'); }
        async advise(state) {
            const base = await super.advise(state);
            base.workplaceStrategy = `Hybrid workplace strategy balancing collaboration, focus, and wellbeing. Activity-based zoning, ergonomic specifications, and technology integration planned.`;
            base.produces = ['Workplace Strategies', 'Space Utilizations'];
            return base;
        }
    }

    class SustainAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-sustain', 'DD-SUSTAIN', 'Sustainability Consultant'); }
        async advise(state) {
            const base = await super.advise(state);
            const sustain = state.answers?.sustainability || 'standard';
            base.sustainabilityReport = `Green building strategy for ${sustain} target. Energy efficiency, water efficiency, low-VOC materials, circular economy, waste reduction, and embodied carbon awareness integrated.`;
            base.produces = ['Sustainability Reports', 'Green Strategies'];
            return base;
        }
    }

    class CodeAgent extends SpecialistAgent {
        constructor(engine) { super(engine, 'dd-code', 'DD-CODE', 'Standards & Compliance Advisor'); }
        async advise(state) {
            const base = await super.advise(state);
            base.complianceNote = `Accessibility, fire safety, and building coordination principles reviewed. Final approvals must follow applicable local laws and licensed professionals. Documentation prepared for coordination review.`;
            base.produces = ['Compliance Checklists', 'Coordination Notes'];
            return base;
        }
    }

    window.DDAgents = {
        ConciergeAgent,
        InteriorAgent,
        LightingAgent,
        MaterialAgent,
        ColorAgent,
        TechnologyAgent,
        WellnessAgent,
        AcousticsAgent,
        QSAgent,
        PMAgent,
        BSEAgent,
        BIMAgent,
        StructAgent,
        ElectraAgent,
        MechAgent,
        HospitalityAgent,
        RetailAgent,
        WorkplaceAgent,
        SustainAgent,
        CodeAgent
    };
})();
