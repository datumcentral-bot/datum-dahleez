/**
 * DATUM DAHLEEZ Intelligence Council (DIC) Core
 * Agent registry, routing, memory, and ethics
 */

window.DIC = (function() {
    'use strict';

    const AgentStatus = {
        IDLE: 'idle',
        ACTIVE: 'active',
        ENGAGED: 'engaged',
        WAITING: 'waiting'
    };

    class AgentRegistry {
        constructor() {
            this.agents = new Map();
            this.activeChain = [];
            this.currentAgent = null;
        }

        register(agent) {
            if (!agent || !agent.id) throw new Error('Agent must have an id');
            this.agents.set(agent.id, {
                id: agent.id,
                name: agent.name,
                role: agent.role,
                expertise: agent.expertise || [],
                produces: agent.produces || [],
                status: AgentStatus.IDLE,
                createdAt: new Date().toISOString()
            });
        }

        get(id) { return this.agents.get(id); }
        getAll() { return Array.from(this.agents.values()); }
        setStatus(id, status) { const a = this.agents.get(id); if (a) a.status = status; }
    }

    class DICMemory {
        constructor() {
            this.storageKey = 'dic_session_v1';
            this.profileKey = 'dic_customer_profile';
        }

        getSession() {
            try { return JSON.parse(localStorage.getItem(this.storageKey) || '{}'); }
            catch (e) { return {}; }
        }

        saveSession(session) {
            try { localStorage.setItem(this.storageKey, JSON.stringify({ ...session, persistedAt: new Date().toISOString() })); }
            catch (e) { console.warn('DIC session save failed:', e); }
        }

        getProfile() {
            try { return JSON.parse(localStorage.getItem(this.profileKey) || '{}'); }
            catch (e) { return {}; }
        }

        saveProfile(profile) {
            try { localStorage.setItem(this.profileKey, JSON.stringify({ ...profile, updatedAt: new Date().toISOString() })); }
            catch (e) { console.warn('DIC profile save failed:', e); }
        }

        appendHistory(entry) {
            const key = 'dic_consultation_history';
            try {
                const history = JSON.parse(localStorage.getItem(key) || '[]');
                history.push({ ...entry, id: 'dic_' + Date.now(), createdAt: new Date().toISOString() });
                localStorage.setItem(key, JSON.stringify(history.slice(-50)));
            } catch (e) { console.warn('DIC history save failed:', e); }
        }
    }

    class DICEthics {
        static validateRecommendation(rec) {
            if (!rec || typeof rec !== 'object') return false;
            if (!rec.why || !rec.how) return false;
            if (rec.budgetImplication === undefined) return false;
            return true;
        }

        static sanitizeOutput(text) {
            if (typeof text !== 'string') return text;
            return text.replace(/\b(AED\s*[\d,]+)\b/g, '[budget range]')
                .replace(/\b(\d{4,})\b/g, '[reference]');
        }

        static requiresProfessional(recommendationType) {
            const regulated = ['structural', 'electrical', 'plumbing', 'gas', 'fire-safety', 'structural-engineering'];
            return regulated.some(t => (recommendationType || '').includes(t));
        }
    }

    class DICEngine {
        constructor() {
            this.registry = new AgentRegistry();
            this.memory = new DICMemory();
            this.state = {
                currentAgentId: 'dd-concierge',
                phase: 'discovery',
                consultationComplete: false,
                answers: {},
                context: {},
                recommendations: [],
                startedAt: null,
                completedAt: null
            };
            this.callbacks = {
                onAgentChange: null,
                onMessage: null,
                onRecommendation: null,
                onComplete: null,
                onError: null
            };
        }

        init() {
            this.registerDefaultAgents();
            const profile = this.memory.getProfile();
            if (profile && profile.consultationState) {
                this.state = { ...this.state, ...profile.consultationState };
            }
            return true;
        }

        registerDefaultAgents() {
            const agents = [
                { id: 'dd-concierge', name: 'DD-CONCIERGE', role: 'Lead Design Consultant', expertise: ['Client Discovery', 'Consultation', 'Emotional Intelligence', 'Lifestyle Analysis', 'Budget Discovery', 'Project Direction'], produces: ['Consultation Summary', 'Project Direction', 'Specialist Referrals'] },
                { id: 'dd-interior', name: 'DD-INTERIOR', role: 'Interior Designer', expertise: ['Interior Design', 'Interior Architecture', 'Furniture', 'Decoration', 'Luxury Design', 'Hospitality', 'Healthcare', 'Retail', 'Residential', 'Space Planning', 'Universal Design', 'Human Ergonomics'], produces: ['Interior Concepts', 'Layout Recommendations', 'Mood Boards', 'Design Narratives'] },
                { id: 'dd-bse', name: 'DD-BSE', role: 'Building Services Engineer', expertise: ['Building Services', 'HVAC', 'Plumbing', 'Drainage', 'Water Supply', 'Fire Fighting', 'Smoke Extraction', 'Lifts', 'Escalators', 'BMS', 'ELV', 'Sustainability'], produces: ['Building Services Strategy', 'Utility Coordination', 'Service Routing Advice'] },
                { id: 'dd-bim', name: 'DD-BIM', role: 'BIM Consultant', expertise: ['ISO 19650', 'BIM Execution Plans', 'CDE', 'Clash Detection', 'Model Coordination', 'Revit', 'Navisworks', 'IFC', 'Digital Twin', 'Asset Information', 'COBie'], produces: ['BIM Strategy', 'Model Coordination Advice', 'Information Management Plans'] },
                { id: 'dd-struct', name: 'DD-STRUCT', role: 'Structural Engineer', expertise: ['RCC', 'Steel', 'Timber', 'Foundations', 'Load Paths', 'Structural Coordination', 'Retrofitting', 'Seismic Considerations'], produces: ['Structural Coordination Notes'] },
                { id: 'dd-electra', name: 'DD-ELECTRA', role: 'Electrical Engineer', expertise: ['Electrical Layouts', 'Power Distribution', 'Lighting Circuits', 'Emergency Lighting', 'UPS', 'Generators', 'Solar Integration', 'Earthing', 'Lightning Protection', 'EV Charging'], produces: ['Electrical Coordination Notes'] },
                { id: 'dd-mech', name: 'DD-MECH', role: 'Mechanical Engineer', expertise: ['HVAC', 'Ventilation', 'Heat Load Concepts', 'Air Distribution', 'Duct Coordination', 'Indoor Air Quality', 'Energy Efficiency'], produces: ['Comfort Strategies', 'Mechanical Coordination Advice'] },
                { id: 'dd-lux', name: 'DD-LUX', role: 'Lighting Designer', expertise: ['Architectural Lighting', 'Decorative Lighting', 'Human-Centric Lighting', 'Circadian Lighting', 'DMX', 'DALI', 'KNX', 'Lux Levels', 'CRI', 'Glare Control', 'Layered Lighting'], produces: ['Complete Lighting Concepts'] },
                { id: 'dd-color', name: 'DD-COLOR', role: 'Color Psychology Expert', expertise: ['Color Theory', 'Emotional Design', 'Hospitality Colors', 'Retail Psychology', 'Workplace Psychology', 'Healthcare Colors', 'Cultural Preferences', 'Light Reflectance'], produces: ['Color Palettes', 'Emotional Color Strategies', 'Finish Coordination'] },
                { id: 'dd-material', name: 'DD-MATERIAL', role: 'Material Scientist', expertise: ['Stone', 'Wood', 'Metal', 'Glass', 'Concrete', 'Ceramics', 'Porcelain', 'Microcement', 'Epoxy', 'Resin', 'Laminates', 'Paint Systems', 'Acoustic Materials', 'Sustainable Materials'], produces: ['Material Selection Reports'] },
                { id: 'dd-future', name: 'DD-FUTURE', role: 'Future Technology Consultant', expertise: ['AI Buildings', 'Smart Homes', 'Robotics', 'IoT', 'Digital Twins', 'Spatial Computing', 'AR', 'VR', 'Mixed Reality', 'Adaptive Architecture', 'Responsive Materials', 'Smart Glass', 'OLED Surfaces', 'Energy Storage', 'Building Analytics'], produces: ['Future-Ready Technology Roadmaps'] },
                { id: 'dd-wellness', name: 'DD-WELLNESS', role: 'Wellness Consultant', expertise: ['Biophilic Design', 'Indoor Air Quality', 'Fragrance Strategy', 'Circadian Rhythm', 'Acoustic Comfort', 'Thermal Comfort', 'Ergonomics', 'Healthy Materials'], produces: ['Wellness Strategies'] },
                { id: 'dd-acoustics', name: 'DD-ACOUSTICS', role: 'Acoustic Engineer', expertise: ['Reverberation', 'Noise Control', 'Sound Isolation', 'Recording Studios', 'Home Cinema', 'Podcast Studios', 'Conference Rooms', 'Healthcare Acoustics'], produces: ['Acoustic Designs', 'Noise Control Strategies'] },
                { id: 'dd-hospitality', name: 'DD-HOSPITALITY', role: 'Hospitality Designer', expertise: ['Hotels', 'Restaurants', 'Resorts', 'Spas', 'Lounges', 'Luxury Suites', 'Guest Experience'], produces: ['Hospitality Concepts', 'Guest Experience Strategies'] },
                { id: 'dd-retail', name: 'DD-RETAIL', role: 'Retail Experience Consultant', expertise: ['Customer Journey', 'Store Planning', 'Visual Merchandising', 'Impulse Buying', 'Display Systems', 'Retail Lighting', 'Wayfinding'], produces: ['Retail Strategies', 'Customer Journey Maps'] },
                { id: 'dd-workplace', name: 'DD-WORKPLACE', role: 'Workplace Strategist', expertise: ['Hybrid Offices', 'Collaboration Spaces', 'Focus Rooms', 'Meeting Rooms', 'Employee Wellbeing', 'Productivity', 'Ergonomics'], produces: ['Workplace Strategies', 'Space Utilizations'] },
                { id: 'dd-qs', name: 'DD-QS', role: 'Quantity Surveyor', expertise: ['BOQs', 'Cost Planning', 'Budget Estimates', 'Procurement Strategy', 'Value Engineering', 'Life-Cycle Costing'], produces: ['Cost Comparisons', 'Quantity-Based Estimates'] },
                { id: 'dd-pm', name: 'DD-PM', role: 'Project Manager', expertise: ['Scheduling', 'Resource Planning', 'Risk Management', 'Procurement Coordination', 'Installation Sequencing', 'Handover Planning'], produces: ['Project Roadmaps', 'Installation Plans'] },
                { id: 'dd-sustain', name: 'DD-SUSTAIN', role: 'Sustainability Consultant', expertise: ['Green Building Principles', 'Energy Efficiency', 'Water Efficiency', 'Low-VOC Materials', 'Circular Economy', 'Waste Reduction', 'Embodied Carbon Awareness'], produces: ['Sustainability Reports', 'Green Strategy'] },
                { id: 'dd-code', name: 'DD-CODE', role: 'Standards & Compliance Advisor', expertise: ['Accessibility Principles', 'Fire and Life Safety Concepts', 'Building Coordination Requirements', 'International Best Practices', 'Documentation Quality'], produces: ['Compliance Checklists', 'Coordination Notes'] }
            ];
            agents.forEach(a => this.registerAgent(a));
        }

        registerAgent(agent) { this.registry.register(agent); }

        setActiveAgent(agentId) {
            const agent = this.registry.get(agentId);
            if (!agent) return;
            if (this.registry.currentAgent) this.registry.setStatus(this.registry.currentAgent, 'idle');
            this.registry.currentAgent = agentId;
            this.registry.setStatus(agentId, 'active');
            this.state.currentAgentId = agentId;
            if (this.callbacks.onAgentChange) this.callbacks.onAgentChange(agentId, agent);
            return agent;
        }

        submitAnswer(answer) {
            this.state.answers[this.registry.currentAgentId] = answer;
            this.state.context[this.registry.currentAgentId] = { ...this.state.context[this.registry.currentAgentId], lastAnswer: answer };
            this.persist();
        }

        complete() {
            this.state.consultationComplete = true;
            this.state.completedAt = new Date().toISOString();
            this.memory.saveProfile({ consultationState: this.state });
            this.memory.appendHistory({ state: this.state, summary: this.generateSummary() });
            if (this.callbacks.onComplete) this.callbacks.onComplete(this.state);
        }

        generateSummary() {
            const answers = this.state.answers;
            return {
                goals: answers['goals'] || 'Not specified',
                priorities: answers['priorities'] || 'Not specified',
                spaceType: answers['space-type'] || 'Not specified',
                budget: answers['budget'] || 'Not specified',
                timeline: answers['timeline'] || 'Not specified',
                specialists: this.state.recommendations.map(r => r.agentId).filter(Boolean)
            };
        }

        persist() {
            this.memory.saveProfile({ consultationState: this.state });
        }

        reset() {
            this.state = {
                currentAgentId: 'dd-concierge',
                phase: 'discovery',
                consultationComplete: false,
                answers: {},
                context: {},
                recommendations: [],
                startedAt: this.state.startedAt || new Date().toISOString(),
                completedAt: null
            };
            this.registry.currentAgent = null;
            this.registry.getAll().forEach(a => a.status = 'idle');
            this.setActiveAgent('dd-concierge');
            this.persist();
        }
    }

    return {
        AgentRegistry,
        DICMemory,
        DICEthics,
        DICEngine,
        AgentStatus
    };
})();
