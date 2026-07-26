/**
 * DATUM DAHLEEZ Environmental Intelligence System
 * Data Loader - Fetches and caches JSON data files
 */

class DataLoader {
    constructor() {
        this.cache = new Map();
        this.loadingPromises = new Map();
    }

    async load(key, url) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }

        const promise = fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.cache.set(key, data);
                this.loadingPromises.delete(key);
                return data;
            })
            .catch(error => {
                this.loadingPromises.delete(key);
                console.error(`DataLoader error loading ${key}:`, error);
                throw error;
            });

        this.loadingPromises.set(key, promise);
        return promise;
    }

    get(key) {
        return this.cache.get(key) || null;
    }

    preload(keys) {
        return Promise.all(
            keys.map(key => {
                const url = this.getUrlForKey(key);
                return this.load(key, url);
            })
        );
    }

    getUrlForKey(key) {
        const map = {
            stages: '../data/stages.json',
            emotions: '../data/emotions.json',
            sensory: '../data/sensory.json',
            recommendations: '../data/recommendations.json',
            services: '../data/services.json',
            roadmap: '../data/roadmap.json',
            membership: '../data/membership.json',
            budgetTiers: '../data/budget-tiers.json',
            spaces: '../data/spaces.json'
        };
        return map[key] || `../data/${key}.json`;
    }

    clear() {
        this.cache.clear();
        this.loadingPromises.clear();
    }
}

window.DataLoader = DataLoader;
