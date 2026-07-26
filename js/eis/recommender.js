/**
 * DATUM DAHLEEZ Environmental Intelligence System
 * Recommender - Product recommendation engine scoring collections and returning ranked results
 */

class Recommender {
    constructor(options = {}) {
        this.dataLoader = options.dataLoader || new DataLoader();
        this.scoringWeights = {
            emotionMatch: 40,
            spaceMatch: 30,
            budgetMatch: 15,
            sensoryMatch: 10,
            styleMatch: 5,
            themeMatch: 5
        };
    }

    async getRecommendations(state) {
        const [
            recommendationsData,
            emotionsData,
            budgetData,
            spacesData,
            themesData
        ] = await Promise.all([
            this.dataLoader.load('recommendations', '../data/recommendations.json'),
            this.dataLoader.load('emotions', '../data/emotions.json'),
            this.dataLoader.load('budgetTiers', '../data/budget-tiers.json'),
            this.dataLoader.load('spaces', '../data/spaces.json'),
            this.dataLoader.load('themes', '../data/themes.json')
        ]);

        const targetEmotion = state.metadata?.targetEmotion;
        const currentEmotion = state.metadata?.currentEmotion;
        const budgetTier = state.metadata?.budgetTier;
        const selectedSpace = state.metadata?.selectedSpace || state.metadata?.selectedCategory;
        const sensoryPriority = state.metadata?.sensoryPriority || [];
        const stylePreference = state.metadata?.stylePreference;
        const selectedTheme = state.metadata?.theme;

        const matchedRules = this.findMatchingRules(
            recommendationsData,
            targetEmotion,
            selectedSpace,
            budgetTier
        );

        const scoredCollections = matchedRules.map(rule => {
            const score = this.calculateScore({
                rule,
                targetEmotion,
                currentEmotion,
                budgetTier,
                selectedSpace,
                sensoryPriority,
                stylePreference,
                selectedTheme,
                emotionsData,
                budgetData,
                themesData
            });

            return {
                ...rule,
                score,
                reasoning: this.buildReasoning(rule, score, targetEmotion, selectedSpace, selectedTheme, themesData)
            };
        });

        scoredCollections.sort((a, b) => b.score - a.score);

        return {
            collections: scoredCollections,
            inputProfile: {
                targetEmotion,
                currentEmotion,
                budgetTier,
                selectedSpace,
                sensoryPriority,
                stylePreference,
                selectedTheme
            },
            generatedAt: new Date().toISOString()
        };
    }

    findMatchingRules(recommendationsData, targetEmotion, selectedSpace, budgetTier) {
        const matched = [];
        const fallback = [];

        for (const rule of recommendationsData.rules) {
            const emotionMatch = targetEmotion && rule.emotions.includes(targetEmotion);
            const spaceMatch = rule.spaces.includes('*') || 
                (selectedSpace && rule.spaces.some(s => 
                    selectedSpace.includes(s) || s.includes(selectedSpace)
                ));
            const budgetMatch = !rule.budgetTiers || rule.budgetTiers.includes(budgetTier);

            if (emotionMatch && spaceMatch) {
                matched.push(rule);
            } else if (rule.spaces.includes('*')) {
                fallback.push(rule);
            }
        }

        return matched.length > 0 ? matched : fallback;
    }

    calculateScore(params) {
        let score = 0;
        const { rule, targetEmotion, currentEmotion, budgetTier, selectedSpace, sensoryPriority, stylePreference, selectedTheme, emotionsData, budgetData, themesData } = params;

        if (targetEmotion && rule.emotions.includes(targetEmotion)) {
            score += this.scoringWeights.emotionMatch;
        }

        if (selectedSpace && (rule.spaces.includes('*') || rule.spaces.some(s => selectedSpace.includes(s) || s.includes(selectedSpace)))) {
            score += this.scoringWeights.spaceMatch;
        }

        if (rule.budgetTiers && rule.budgetTiers.includes(budgetTier)) {
            score += this.scoringWeights.budgetMatch;
        } else if (!rule.budgetTiers) {
            score += this.scoringWeights.budgetMatch * 0.5;
        }

        if (sensoryPriority && sensoryPriority.length > 0) {
            const sensoryAlignment = rule.collections.some(c => 
                c.id.includes(sensoryPriority[0]) || c.sense === sensoryPriority[0]
            );
            if (sensoryAlignment) {
                score += this.scoringWeights.sensoryMatch;
            }
        }

        if (stylePreference) {
            const styleAlignment = rule.collections.some(c => 
                c.id.includes(stylePreference)
            );
            if (styleAlignment) {
                score += this.scoringWeights.styleMatch;
            }
        }

        if (selectedTheme && themesData) {
            const themeAlignment = rule.collections.some(c => 
                c.id.includes(selectedTheme) || c.theme === selectedTheme
            );
            if (themeAlignment) {
                score += this.scoringWeights.themeMatch;
            }
        }

        const emotionalGapBonus = currentEmotion && targetEmotion && currentEmotion !== targetEmotion ? 5 : 0;
        score += emotionalGapBonus;

        return Math.min(100, Math.round(score));
    }

    buildReasoning(rule, score, targetEmotion, selectedSpace, selectedTheme, themesData) {
        const reasons = [];

        if (targetEmotion && rule.emotions.includes(targetEmotion)) {
            reasons.push(`Aligns with your ${targetEmotion} emotional goal`);
        }

        if (selectedSpace && !rule.spaces.includes('*')) {
            const matchedSpace = rule.spaces.find(s => selectedSpace.includes(s) || s.includes(selectedSpace));
            if (matchedSpace) {
                reasons.push(`Curated for ${matchedSpace.replace(/-/g, ' ')} spaces`);
            }
        }

        if (selectedTheme && themesData) {
            const theme = themesData.themes.find(t => t.id === selectedTheme);
            if (theme) {
                reasons.push(`Reflects your ${theme.name} theme`);
            }
        }

        if (score >= 90) {
            reasons.push('Perfect match for your profile');
        } else if (score >= 70) {
            reasons.push('Strong alignment with your preferences');
        } else if (score >= 50) {
            reasons.push('Good foundational recommendation');
        }

        const topCollection = rule.collections[0];
        if (topCollection && topCollection.why) {
            reasons.push(topCollection.why);
        }

        return reasons.join('. ') + '.';
    }

    async getSingleRecommendation(state, context) {
        const recommendations = await this.getRecommendations(state);
        if (recommendations.collections.length === 0) {
            return null;
        }
        return recommendations.collections[0];
    }

    scoreProduct(product, state) {
        let score = 0;
        const { targetEmotion, budgetTier, stylePreference, sensoryPriority } = state.metadata || {};

        if (product.tags) {
            if (targetEmotion && product.tags.includes(targetEmotion)) {
                score += 30;
            }
            if (stylePreference && product.tags.includes(stylePreference)) {
                score += 25;
            }
            if (sensoryPriority && sensoryPriority.some(s => product.tags.includes(s))) {
                score += 20;
            }
        }

        if (budgetTier && product.price) {
            const budgetRange = this.getBudgetRange(budgetTier);
            if (budgetRange && product.price >= budgetRange.min && product.price <= budgetRange.max) {
                score += 25;
            }
        }

        if (product.featured) {
            score += 10;
        }

        return score;
    }

    getBudgetRange(tierId) {
        const budgetMap = {
            comfort: { min: 50000, max: 150000 },
            premium: { min: 150000, max: 500000 },
            luxury: { min: 500000, max: 1500000 },
            signature: { min: 1500000, max: 5000000 },
            bespoke: { min: 5000000, max: Infinity }
        };
        return budgetMap[tierId] || null;
    }
}

window.Recommender = Recommender;
