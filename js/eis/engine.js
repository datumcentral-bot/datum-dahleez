/**
 * DATUM DAHLEEZ Environmental Intelligence System
 * ConversationEngine - Manages state machine, getNextStage, submitAnswer, getAvailableStages
 */

class ConversationEngine {
    constructor(options = {}) {
        this.dataLoader = options.dataLoader || new DataLoader();
        this.router = options.router || null;
        this.renderer = options.renderer || null;
        
        this.state = {
            currentStageId: 'welcome',
            stagesCompleted: [],
            answers: {},
            contributors: [],
            weights: {},
            metadata: {
                startedAt: null,
                completedAt: null,
                userId: null,
                sessionId: this.generateSessionId(),
                resumedFrom: null
            }
        };

        this.callbacks = {
            onStageChange: options.onStageChange || null,
            onComplete: options.onComplete || null,
            onError: options.onError || null
        };

        this.initialized = false;
        this.storageKey = 'eis_session_v1';
    }

    async init() {
        try {
            const savedSession = this.loadSession();
            if (savedSession && savedSession.metadata && savedSession.metadata.resumedFrom) {
                this.state = savedSession;
                this.state.metadata.resumedFrom = this.state.currentStageId;
            } else {
                const profile = this.loadCustomerProfile();
                if (profile && profile.preferences) {
                    this.applyCustomerProfile();
                }
            }
            const stagesData = await this.dataLoader.load('stages', '../data/stages.json');
            this.router = new Router(stagesData);
            this.initialized = true;
            this.persistSession();
            return true;
        } catch (error) {
            console.error('Failed to initialize ConversationEngine:', error);
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
            return false;
        }
    }

    getCurrentStage() {
        if (!this.router) return null;
        return this.router.resolveStage(this.state.currentStageId);
    }

    async getNextStage() {
        if (!this.router) {
            throw new Error('Router not initialized');
        }
        return this.router.getNextStage(this.state.currentStageId, this.state);
    }

    getAvailableStages() {
        if (!this.router) {
            return [];
        }
        return this.router.getAvailableStages(this.state, this.state.stagesCompleted);
    }

    submitAnswer(stageId, answer) {
        if (!this.isValidStage(stageId)) {
            throw new Error(`Invalid stage ID: ${stageId}`);
        }

        const stage = this.router.stages.find(s => s.id === stageId);
        if (!stage) {
            throw new Error(`Stage not found: ${stageId}`);
        }

        if (stage.multiSelect) {
            if (!Array.isArray(this.state.answers[stageId])) {
                this.state.answers[stageId] = [];
            }
            const index = this.state.answers[stageId].indexOf(answer);
            if (index > -1) {
                this.state.answers[stageId].splice(index, 1);
            } else {
                const maxSelect = stage.maxSelect || Infinity;
                if (this.state.answers[stageId].length >= maxSelect) {
                    if (this.callbacks.onError) {
                        this.callbacks.onError(new Error(`Maximum ${maxSelect} selections allowed`));
                    }
                    return false;
                }
                this.state.answers[stageId].push(answer);
            }
        } else {
            this.state.answers[stageId] = answer;
        }

        if (typeof stage.weight === 'number' && stage.weight > 0) {
            this.state.weights[stageId] = stage.weight;
        }

        this.processLogic(stage, answer);
        this.persistSession();
        return true;
    }

    processLogic(stage, answer) {
        if (!stage.logic) return;

        if (stage.logic.storeSelectedSpace) {
            this.state.metadata.selectedSpace = answer;
        }
        if (stage.logic.storeCategory) {
            this.state.metadata.selectedCategory = answer;
        }
        if (stage.logic.storePurpose) {
            this.state.metadata.purpose = answer;
        }
        if (stage.logic.storeOccupants) {
            if (!this.state.metadata.occupants) {
                this.state.metadata.occupants = [];
            }
            if (Array.isArray(answer)) {
                this.state.metadata.occupants.push(...answer);
            } else {
                this.state.metadata.occupants.push(answer);
            }
        }
        if (stage.logic.storeRhythm) {
            this.state.metadata.rhythm = answer;
        }
        if (stage.logic.storeLightPreference) {
            this.state.metadata.lightPreference = answer;
        }
        if (stage.logic.storeAcousticNeeds) {
            this.state.metadata.acousticNeeds = answer;
        }
        if (stage.logic.storeAirQuality) {
            this.state.metadata.airQuality = answer;
        }
        if (stage.logic.storeTemperaturePreference) {
            this.state.metadata.temperaturePreference = answer;
        }
        if (stage.logic.storeTargetEmotion) {
            this.state.metadata.targetEmotion = answer;
        }
        if (stage.logic.storeCurrentEmotion) {
            this.state.metadata.currentEmotion = answer;
        }
        if (stage.logic.storeSensoryPriority) {
            if (!this.state.metadata.sensoryPriority) {
                this.state.metadata.sensoryPriority = [];
            }
            if (Array.isArray(answer)) {
                this.state.metadata.sensoryPriority.push(...answer);
            } else {
                this.state.metadata.sensoryPriority.push(answer);
            }
        }
        if (stage.logic.storeBudgetTier) {
            this.state.metadata.budgetTier = answer;
        }
        if (stage.logic.storeStylePreference) {
            this.state.metadata.stylePreference = answer;
        }
        if (stage.logic.storeTheme) {
            this.state.metadata.theme = answer;
        }
        if (stage.logic.storeTimeline) {
            this.state.metadata.timeline = answer;
        }

        if (stage.logic.calculateGap) {
            this.calculateEmotionalGap();
        }
    }

    calculateEmotionalGap() {
        const emotionsData = this.dataLoader.get('emotions');
        if (!emotionsData) return;

        const current = this.state.metadata.currentEmotion;
        const target = this.state.metadata.targetEmotion;

        const positive = emotionsData.positive.map(e => e.id);
        const negative = emotionsData.negative.map(e => e.id);

        const currentIsPositive = positive.includes(current);
        const targetIsPositive = positive.includes(target);

        this.state.metadata.emotionalGap = {
            current,
            target,
            isPositive: currentIsPositive,
            isTargetPositive: targetIsPositive,
            gapMagnitude: current === target ? 0 : 1,
            needsImprovement: current !== target
        };
    }

    async advance() {
        if (!this.router) {
            throw new Error('Router not initialized');
        }

        const currentStage = this.getCurrentStage();
        if (!currentStage) {
            throw new Error('No current stage');
        }

        this.state.stagesCompleted.push(currentStage.id);

        const nextStage = await this.getNextStage();
        
        if (!nextStage) {
            this.state.metadata.completedAt = new Date().toISOString();
            if (this.callbacks.onComplete) {
                this.callbacks.onComplete(this.state);
            }
            return null;
        }

        this.state.currentStageId = nextStage.id;
        
        if (this.callbacks.onStageChange) {
            this.callbacks.onStageChange(nextStage, this.state);
        }

        return nextStage;
    }

    goToStage(stageId) {
        const stage = this.router.resolveStage(stageId);
        if (!stage) {
            throw new Error(`Stage not found: ${stageId}`);
        }
        this.state.currentStageId = stageId;
        
        if (this.callbacks.onStageChange) {
            this.callbacks.onStageChange(stage, this.state);
        }
        return stage;
    }

    goBack() {
        if (this.state.stagesCompleted.length === 0) {
            return null;
        }

        const previousStageId = this.state.stagesCompleted.pop();
        this.state.currentStageId = previousStageId;
        
        const stage = this.router.resolveStage(previousStageId);
        if (stage && this.callbacks.onStageChange) {
            this.callbacks.onStageChange(stage, this.state);
        }
        return stage;
    }

    persistSession() {
        try {
            const payload = {
                ...this.state,
                persistedAt: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(payload));
            this.persistCustomerProfile();
        } catch (e) {
            console.warn('Failed to persist EIS session:', e);
        }
    }

    persistCustomerProfile() {
        try {
            const profile = {
                preferences: {
                    selectedSpace: this.state.metadata?.selectedSpace,
                    selectedCategory: this.state.metadata?.selectedCategory,
                    purpose: this.state.metadata?.purpose,
                    rhythm: this.state.metadata?.rhythm,
                    lightPreference: this.state.metadata?.lightPreference,
                    acousticNeeds: this.state.metadata?.acousticNeeds,
                    airQuality: this.state.metadata?.airQuality,
                    temperaturePreference: this.state.metadata?.temperaturePreference,
                    targetEmotion: this.state.metadata?.targetEmotion,
                    currentEmotion: this.state.metadata?.currentEmotion,
                    sensoryPriority: this.state.metadata?.sensoryPriority,
                    budgetTier: this.state.metadata?.budgetTier,
                    stylePreference: this.state.metadata?.stylePreference,
                    theme: this.state.metadata?.theme,
                    timeline: this.state.metadata?.timeline
                },
                projectHistory: [],
                updatedAt: new Date().toISOString()
            };
            const existing = JSON.parse(localStorage.getItem('eis_customer_profile') || '{}');
            const history = existing.projectHistory || [];
            if (this.state.metadata?.completedAt) {
                history.push({
                    completedAt: this.state.metadata.completedAt,
                    space: this.state.metadata.selectedSpace || this.state.metadata.selectedCategory,
                    emotion: this.state.metadata.targetEmotion,
                    budget: this.state.metadata.budgetTier
                });
                if (history.length > 20) history.shift();
                profile.projectHistory = history;
            }
            localStorage.setItem('eis_customer_profile', JSON.stringify(profile));
        } catch (e) {
            console.warn('Failed to persist customer profile:', e);
        }
    }

    loadCustomerProfile() {
        try {
            const raw = localStorage.getItem('eis_customer_profile');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    applyCustomerProfile() {
        const profile = this.loadCustomerProfile();
        if (!profile || !profile.preferences) return;
        const prefs = profile.preferences;
        const meta = this.state.metadata;
        
        Object.keys(prefs).forEach(key => {
            if (prefs[key] && !meta[key]) {
                meta[key] = prefs[key];
            }
        });
        
        const history = profile.projectHistory || [];
        if (history.length > 0) {
            meta.previousProjects = history;
        }
    }

    loadSession() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed && parsed.metadata && parsed.metadata.sessionId) {
                return parsed;
            }
            return null;
        } catch (e) {
            console.warn('Failed to load EIS session:', e);
            return null;
        }
    }

    clearSession() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (e) {
            console.warn('Failed to clear EIS session:', e);
        }
    }

    addContributor(role, name) {
        this.state.contributors.push({
            role: role || 'Contributor',
            name: name || 'Anonymous',
            joinedAt: new Date().toISOString()
        });
        this.persistSession();
    }

    removeContributor(index) {
        if (index >= 0 && index < this.state.contributors.length) {
            this.state.contributors.splice(index, 1);
            this.persistSession();
        }
    }

    getContributors() {
        return [...this.state.contributors];
    }

    recordWeight(stageId, weight) {
        this.state.weights[stageId] = weight;
        this.persistSession();
    }

    getWeightedAnswers() {
        return this.state.weights;
    }

    getState() {
        return { ...this.state };
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }

    reset() {
        this.state = {
            currentStageId: 'welcome',
            stagesCompleted: [],
            answers: {},
            contributors: [],
            weights: {},
            metadata: {
                startedAt: null,
                completedAt: null,
                userId: null,
                sessionId: this.generateSessionId(),
                resumedFrom: null
            }
        };
        this.clearSession();
    }

    isValidStage(stageId) {
        return this.router && this.router.stages.some(s => s.id === stageId);
    }

    generateSessionId() {
        return 'ses_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getProgress() {
        const completed = this.state.stagesCompleted.length;
        const total = this.router ? this.router.stages.length : 18;
        return {
            completed,
            total,
            percentage: Math.round((completed / total) * 100),
            currentStage: this.state.currentStageId
        };
    }
}

window.ConversationEngine = ConversationEngine;
