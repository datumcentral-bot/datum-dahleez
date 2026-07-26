/**
 * DATUM DAHLEEZ Intelligence Council (DIC)
 * Bootstrap — Load all specialist agents into the engine
 */

window.DICBootstrap = (function() {
    'use strict';

    async function bootstrap(engine) {
        if (!engine || !engine.registerAgent) {
            console.warn('DIC: Engine not ready for bootstrap');
            return false;
        }

        engine.registerDefaultAgents();
        engine.setActiveAgent('dd-concierge');
        engine.init();
        return true;
    }

    return { bootstrap };
})();
