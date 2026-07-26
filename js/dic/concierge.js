/**
 * DATUM DAHLEEZ Intelligence Council (DIC)
 * DD-CONCIERGE — Lead Design Consultant
 */

window.DDAgents = (function() {
    'use strict';

    class ConciergeAgent {
        constructor(dicEngine) {
            this.engine = dicEngine;
            this.id = 'dd-concierge';
            this.name = 'DD-CONCIERGE';
            this.role = 'Lead Design Consultant';
            this.discoveryFields = [
                { key: 'projectType', question: 'What type of project is this? New construction, renovation, or refresh?', options: ['new-construction', 'renovation', 'refresh', 'extension'] },
                { key: 'propertyType', question: 'What type of property are we designing?', options: ['residential', 'commercial', 'hospitality', 'retail', 'healthcare', 'education', 'mixed-use'] },
                { key: 'spaceType', question: 'Which space will be the primary focus of this consultation?', options: ['living-room', 'bedroom', 'kitchen', 'bathroom', 'office', 'reception', 'lobby', 'retail-floor', 'restaurant', 'hotel-suite', 'clinic', 'classroom', 'studio'] },
                { key: 'occupants', question: 'Who will primarily use this space?', options: ['individual', 'couple', 'family-young-children', 'family-teens', 'elderly', 'employees', 'clients', 'patients', 'students', 'guests'] },
                { key: 'lifestyle', question: 'How would you describe the daily lifestyle in this space?', options: ['calm-quiet', 'social-gathering', 'focused-work', 'creative', 'healing-wellness', 'entertainment', 'mixed'] },
                { key: 'painPoints', question: 'What are the main challenges or pain points with the current space?', options: ['poor-lighting', 'bad-acoustics', 'uncomfortable-temperature', 'cluttered', 'outdated', 'poor-flow', 'lack-storage', 'privacy-issues', 'accessibility'] },
                { key: 'dreamOutcome', question: 'What emotion or feeling should this space evoke?', options: ['calm', 'energized', 'inspired', 'safe', 'connected', 'focused', 'luxurious', 'grounded', 'playful', 'mysterious'] },
                { key: 'budget', question: 'What investment range feels comfortable for this project?', options: ['comfort', 'premium', 'luxury', 'signature', 'bespoke'] },
                { key: 'timeline', question: 'What is the desired timeline?', options: ['asap', 'short', 'medium', 'long', 'phased', 'no-rush'] },
                { key: 'futurePlans', question: 'Are there any future expansion or adaptability needs?', options: ['no-plans', 'expand-space', 'add-tech', 'multi-generational', 'aging-in-place', 'work-from-home'] },
                { key: 'maintenance', question: 'How much maintenance effort is acceptable?', options: ['low', 'moderate', 'high', 'professional-only'] },
                { key: 'technology', question: 'How important is smart technology integration?', options: ['none', 'basic', 'moderate', 'extensive', 'fully-automated'] },
                { key: 'sustainability', question: 'How strong is the focus on sustainability?', options: ['standard', 'important', 'essential', 'net-zero-target'] },
                { key: 'accessibility', question: 'Are there specific accessibility requirements?', options: ['none', 'general', 'wheelchair', 'visual', 'auditory', 'multi-need'] }
            ];
        }

        startConsultation() {
            this.engine.state.startedAt = new Date().toISOString();
            this.engine.state.phase = 'discovery';
            this.engine.persist();
            return this.getNextQuestion();
        }

        getNextQuestion() {
            const answers = this.engine.state.answers;
            const unanswered = this.discoveryFields.find(f => !answers[f.key]);
            if (!unanswered) {
                this.engine.state.phase = 'specialist-referral';
                return this.finalizeConsultation();
            }
            this.engine.state.phase = 'discovery';
            return {
                agentId: this.id,
                type: 'question',
                field: unanswered.key,
                question: unanswered.question,
                options: unanswered.options,
                phase: 'discovery'
            };
        }

        submitAnswer(field, value) {
            this.engine.submitAnswer(value);
            const next = this.getNextQuestion();
            if (next.type === 'finalize') {
                this.engine.complete();
            }
            return next;
        }

        finalizeConsultation() {
            this.engine.state.phase = 'specialist-referral';
            const specialists = this.routeToSpecialists();
            this.engine.state.recommendations = specialists;
            this.engine.complete();
            return {
                agentId: this.id,
                type: 'summary',
                message: this.buildSummary(),
                specialists,
                phase: 'complete'
            };
        }

        routeToSpecialists() {
            const answers = this.engine.state.answers;
            const specialists = ['dd-interior'];
            if (['commercial', 'hospitality', 'retail'].includes(answers['propertyType'])) specialists.push('dd-hospitality', 'dd-retail');
            if (answers['spaceType'] === 'office') specialists.push('dd-workplace');
            if (['high', 'extensive', 'fully-automated'].includes(answers['technology'])) specialists.push('dd-future', 'dd-electra', 'dd-mech');
            if (['essential', 'net-zero-target'].includes(answers['sustainability'])) specialists.push('dd-sustain');
            if (answers['accessibility'] && answers['accessibility'] !== 'none') specialists.push('dd-code');
            specialists.push('dd-lux', 'dd-color', 'dd-material', 'dd-wellness', 'dd-acoustics', 'dd-qs', 'dd-pm');
            if (['new-construction', 'renovation'].includes(answers['projectType'])) specialists.push('dd-bse', 'dd-bim', 'dd-struct');
            return [...new Set(specialists)];
        }

        buildSummary() {
            const a = this.engine.state.answers;
            return `Thank you for this consultation. Here is your design direction summary:

Space: ${a['spaceType'] || 'Not specified'}
Property: ${a['propertyType'] || 'Not specified'}
Project: ${a['projectType'] || 'Not specified'}
Emotional Goal: ${a['dreamOutcome'] || 'Not specified'}
Budget Tier: ${a['budget'] || 'Not specified'}
Timeline: ${a['timeline'] || 'Not specified'}
Technology: ${a['technology'] || 'Not specified'}
Sustainability: ${a['sustainability'] || 'Not specified'}
Accessibility: ${a['accessibility'] || 'Not specified'}

Our specialist council will now prepare your integrated recommendation. You will receive one coordinated design proposal covering interiors, lighting, materials, wellness, technology, and project planning.`;
        }
    }

    return { ConciergeAgent };
})();
