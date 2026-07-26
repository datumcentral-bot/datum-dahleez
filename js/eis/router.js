/**
 * DATUM DAHLEEZ Environmental Intelligence System
 * Router - Conditional stage routing based on state answers
 */

class Router {
    constructor(stagesData) {
        this.stages = stagesData.stages;
        this.rules = new Map();
        this.buildRules();
    }

    buildRules() {
        this.stages.forEach(stage => {
            if (stage.logic && stage.next) {
                this.rules.set(stage.id, {
                    baseNext: stage.next,
                    conditions: stage.logic.conditions || [],
                    jumpTargets: stage.logic.jumpTargets || {}
                });
            }
        });
    }

    getNextStage(currentStageId, state) {
        const stage = this.stages.find(s => s.id === currentStageId);
        if (!stage) return null;

        const baseNext = stage.next;
        if (!baseNext) return null;

        const rules = this.rules.get(currentStageId);
        if (!rules || rules.conditions.length === 0) {
            return this.resolveStage(baseNext);
        }

        const evaluated = this.evaluateConditions(rules.conditions, state);
        if (evaluated.jump) {
            return this.resolveStage(evaluated.jump);
        }

        return this.resolveStage(baseNext);
    }

    evaluateConditions(conditions, state) {
        for (const condition of conditions) {
            if (this.checkCondition(condition, state)) {
                return { jump: condition.jumpTo, matched: condition };
            }
        }
        return { jump: null, matched: null };
    }

    checkCondition(condition, state) {
        const { field, operator, value } = condition;
        const stateValue = this.getNestedValue(state, field);

        switch (operator) {
            case '==':
            case 'equals':
                return stateValue === value;
            case '!=':
            case 'notEquals':
                return stateValue !== value;
            case 'includes':
                return Array.isArray(stateValue) ? stateValue.includes(value) : stateValue === value;
            case 'notIncludes':
                return Array.isArray(stateValue) ? !stateValue.includes(value) : stateValue !== value;
            case 'exists':
                return stateValue !== undefined && stateValue !== null;
            case 'notExists':
                return stateValue === undefined || stateValue === null;
            case 'in':
                return Array.isArray(value) && value.includes(stateValue);
            case 'notIn':
                return Array.isArray(value) && !value.includes(stateValue);
            case 'greaterThan':
                return Number(stateValue) > Number(value);
            case 'lessThan':
                return Number(stateValue) < Number(value);
            case 'greaterThanOrEqual':
                return Number(stateValue) >= Number(value);
            case 'lessThanOrEqual':
                return Number(stateValue) <= Number(value);
            case 'contains':
                return typeof stateValue === 'string' && stateValue.includes(value);
            case 'startsWith':
                return typeof stateValue === 'string' && stateValue.startsWith(value);
            case 'endsWith':
                return typeof stateValue === 'string' && stateValue.endsWith(value);
            default:
                return false;
        }
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    resolveStage(stageId) {
        const stage = this.stages.find(s => s.id === stageId);
        if (!stage) {
            console.warn(`Router: Stage "${stageId}" not found`);
            return null;
        }
        return stage;
    }

    getAvailableStages(state, completedStageIds = []) {
        const currentStageId = this.getCurrentStageId(state);
        const nextStage = this.getNextStage(currentStageId, state);
        
        const available = [nextStage].filter(Boolean);
        const alwaysAvailable = this.stages.filter(s => 
            s.type === 'intro' || s.id === 'complete'
        );
        
        return [...available, ...alwaysAvailable].filter(s => !completedStageIds.includes(s.id));
    }

    getCurrentStageId(state) {
        return state.currentStageId || 'welcome';
    }

    addCondition(stageId, condition) {
        if (!this.rules.has(stageId)) {
            const stage = this.stages.find(s => s.id === stageId);
            if (stage) {
                this.rules.set(stageId, {
                    baseNext: stage.next,
                    conditions: [],
                    jumpTargets: {}
                });
            }
        }
        const rules = this.rules.get(stageId);
        if (rules) {
            rules.conditions.push(condition);
        }
    }

    removeCondition(stageId, conditionIndex) {
        const rules = this.rules.get(stageId);
        if (rules && rules.conditions[conditionIndex]) {
            rules.conditions.splice(conditionIndex, 1);
        }
    }

    validate() {
        const errors = [];
        this.stages.forEach(stage => {
            if (stage.next && !this.stages.find(s => s.id === stage.next)) {
                errors.push(`Stage "${stage.id}" references undefined next stage "${stage.next}"`);
            }
            if (stage.logic && stage.logic.conditions) {
                stage.logic.conditions.forEach((condition, index) => {
                    if (!condition.field || !condition.operator) {
                        errors.push(`Stage "${stage.id}" condition ${index} missing field or operator`);
                    }
                });
            }
        });
        return errors;
    }
}

window.Router = Router;
