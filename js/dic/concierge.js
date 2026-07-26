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
            if (!field || !value) return this.getNextQuestion();
            this.engine.state.answers[field] = value;
            this.engine.state.context[field] = { ...this.engine.state.context[field], lastAnswer: value };
            this.engine.persist();
            const next = this.getNextQuestion();
            if (next.type === 'summary' || next.type === 'finalize') {
                this.engine.complete();
            }
            return next;
        }

        answerQuestion(text) {
            const lower = text.toLowerCase();
            const answers = this.engine.state.answers;
            const unanswered = this.discoveryFields.find(f => !answers[f.key]);
            if (!unanswered) {
                return {
                    agentId: this.id,
                    type: 'summary',
                    message: this.buildSummary(),
                    specialists: this.routeToSpecialists(),
                    phase: 'complete'
                };
            }

            let matchedValue = null;
            for (const opt of unanswered.options) {
                const optWords = opt.replace(/-/g, ' ');
                if (lower.includes(optWords) || optWords.includes(lower)) {
                    matchedValue = opt;
                    break;
                }
            }

            if (!matchedValue) {
                const fuzzyMap = {
                    'apartment|flat|condo': 'residential',
                    'home|house|villa': 'residential',
                    'hotel|resort|suite': 'hospitality',
                    'shop|store|mall': 'retail',
                    'hospital|clinic|medical': 'healthcare',
                    'school|university|campus': 'education',
                    'office|coworking|commercial': 'commercial',
                    'bedroom|master bedroom': 'bedroom',
                    'kitchen|cooking': 'kitchen',
                    'bathroom|toilet|washroom': 'bathroom',
                    'living|lounge|sitting': 'living-room',
                    'reception|lobby|entrance': 'reception'
                };
                for (const [keys, value] of Object.entries(fuzzyMap)) {
                    if (keys.split('|').some(k => lower.includes(k))) {
                        matchedValue = value;
                        break;
                    }
                }
            }

            if (!matchedValue) {
                return {
                    agentId: this.id,
                    type: 'clarify',
                    question: `Could you clarify: ${unanswered.question}?`,
                    options: unanswered.options,
                    phase: 'discovery'
                };
            }

            return this.submitAnswer(unanswered.key, matchedValue);
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
            return `Thank you for this consultation. Here is your design direction summary:\n\nSpace: ${a['spaceType'] || 'Not specified'}\nProperty: ${a['propertyType'] || 'Not specified'}\nProject: ${a['projectType'] || 'Not specified'}\nEmotional Goal: ${a['dreamOutcome'] || 'Not specified'}\nBudget Tier: ${a['budget'] || 'Not specified'}\nTimeline: ${a['timeline'] || 'Not specified'}\nTechnology: ${a['technology'] || 'Not specified'}\nSustainability: ${a['sustainability'] || 'Not specified'}\nAccessibility: ${a['accessibility'] || 'Not specified'}\n\nOur specialist council will now prepare your integrated recommendation. You will receive one coordinated design proposal covering interiors, lighting, materials, wellness, technology, and project planning.`;
        }
    }

    return { ConciergeAgent };
})();
