/**
 * DATUM DAHLEEZ Environmental Intelligence System
 * Renderer - Generic card/form renderer for questions, options, and navigation
 */

class Renderer {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = {
            theme: 'obsidian-noir',
            animation: 'fade',
            cardStyle: 'elevated',
            ...options
        };
        this.state = {
            currentStage: null,
            history: [],
            isTransitioning: false
        };
    }

    render(stage, state, callbacks = {}) {
        if (!stage || this.state.isTransitioning) return;
        
        this.state.isTransitioning = true;
        this.state.currentStage = stage;

        const content = this.buildStageContent(stage, state, callbacks);
        
        this.container.innerHTML = '';
        this.container.appendChild(content);

        this.state.isTransitioning = false;
        if (callbacks.onRendered) {
            callbacks.onRendered(stage, content);
        }
    }

    buildStageContent(stage, state, callbacks) {
        const wrapper = document.createElement('div');
        wrapper.className = `eis-stage eis-stage--${stage.type}`;
        wrapper.setAttribute('data-stage-id', stage.id);
        wrapper.setAttribute('data-stage-order', stage.order);

        const card = document.createElement('div');
        card.className = `eis-card eis-card--${this.options.cardStyle}`;

        const header = this.renderHeader(stage);
        card.appendChild(header);

        const body = document.createElement('div');
        body.className = 'eis-card__body';

        switch (stage.type) {
            case 'intro':
                body.appendChild(this.renderIntro(stage, state, callbacks));
                break;
            case 'selection':
                body.appendChild(this.renderSelection(stage, state, callbacks));
                break;
            case 'theme-gallery':
                body.appendChild(this.renderThemeGallery(stage, state, callbacks));
                break;
            case 'experience':
                body.appendChild(this.renderExperience(stage, state, callbacks));
                break;
            case 'results':
                body.appendChild(this.renderResults(stage, state, callbacks));
                break;
            case 'conversion':
                body.appendChild(this.renderConversion(stage, state, callbacks));
                break;
            default:
                body.appendChild(this.renderDefault(stage, state, callbacks));
        }

        card.appendChild(body);
        wrapper.appendChild(card);

        const navigation = this.renderNavigation(stage, state, callbacks);
        if (navigation) {
            wrapper.appendChild(navigation);
        }

        return wrapper;
    }

    renderHeader(stage) {
        const header = document.createElement('div');
        header.className = 'eis-card__header';

        if (stage.icon) {
            const icon = document.createElement('div');
            icon.className = 'eis-card__icon';
            icon.textContent = stage.icon;
            header.appendChild(icon);
        }

        const titleGroup = document.createElement('div');
        titleGroup.className = 'eis-card__title-group';

        const title = document.createElement('h2');
        title.className = 'eis-card__title display';
        title.textContent = stage.title;

        if (stage.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = 'eis-card__subtitle';
            subtitle.textContent = stage.subtitle;
            titleGroup.appendChild(title);
            titleGroup.appendChild(subtitle);
        } else {
            titleGroup.appendChild(title);
        }

        header.appendChild(titleGroup);
        return header;
    }

    renderIntro(stage, state, callbacks) {
        const intro = document.createElement('div');
        intro.className = 'eis-intro';

        const desc = document.createElement('p');
        desc.className = 'eis-intro__description';
        desc.textContent = stage.description;
        intro.appendChild(desc);

        const progress = this.renderProgress(state);
        intro.appendChild(progress);

        const startBtn = document.createElement('button');
        startBtn.className = 'eis-btn eis-btn--primary eis-btn--lg';
        startBtn.textContent = 'Begin Journey';
        startBtn.addEventListener('click', () => {
            if (callbacks.onStart) callbacks.onStart();
        });
        intro.appendChild(startBtn);

        return intro;
    }

    renderSelection(stage, state, callbacks) {
        const selection = document.createElement('div');
        selection.className = 'eis-selection';

        const desc = document.createElement('p');
        desc.className = 'eis-selection__description';
        desc.textContent = stage.description;
        selection.appendChild(desc);

        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'eis-options eis-options--grid';

        const currentValues = this.getCurrentValues(state, stage.id);

        stage.options.forEach(option => {
            const optionEl = document.createElement('button');
            optionEl.className = `eis-option ${currentValues.includes(option.id) ? 'eis-option--selected' : ''}`;
            optionEl.setAttribute('data-option-id', option.id);
            optionEl.setAttribute('data-value', option.id);

            if (option.icon) {
                const icon = document.createElement('span');
                icon.className = 'eis-option__icon';
                icon.textContent = option.icon;
                optionEl.appendChild(icon);
            }

            const label = document.createElement('span');
            label.className = 'eis-option__label';
            label.textContent = option.label;
            optionEl.appendChild(label);

            if (stage.multiSelect) {
                const check = document.createElement('span');
                check.className = 'eis-option__check';
                check.innerHTML = currentValues.includes(option.id) ? '&#10003;' : '';
                optionEl.appendChild(check);
            }

            optionEl.addEventListener('click', () => {
                if (callbacks.onOptionSelect) {
                    callbacks.onOptionSelect(stage, option, optionEl);
                }
            });

            optionsGrid.appendChild(optionEl);
        });

        selection.appendChild(optionsGrid);
        return selection;
    }

    renderThemeGallery(stage, state, callbacks) {
        const themeData = (typeof window !== 'undefined' && window.__eisThemeData) ? window.__eisThemeData : { themes: [] };
        const themes = themeData.themes || [];
        const currentValues = this.getCurrentValues(state, stage.id);

        const gallery = document.createElement('div');
        gallery.className = 'eis-theme-gallery';

        const desc = document.createElement('p');
        desc.className = 'eis-theme-gallery__description';
        desc.textContent = stage.description;
        gallery.appendChild(desc);

        const grid = document.createElement('div');
        grid.className = 'eis-theme-grid';

        themes.forEach(theme => {
            const btn = document.createElement('button');
            btn.className = `eis-theme-card ${currentValues.includes(theme.id) ? 'eis-theme-card--selected' : ''}`;
            btn.setAttribute('data-theme-id', theme.id);

            const img = document.createElement('div');
            img.className = 'eis-theme-card__image';
            img.style.backgroundImage = `url('${this.getThemeImage(theme)}')`;
            img.style.backgroundSize = 'cover';
            img.style.backgroundPosition = 'center';
            btn.appendChild(img);

            const label = document.createElement('div');
            label.className = 'eis-theme-card__label';
            const name = document.createElement('strong');
            name.textContent = theme.name;
            const count = document.createElement('span');
            count.textContent = `${(theme.subThemes || []).length} sub-themes`;
            label.appendChild(name);
            label.appendChild(document.createElement('br'));
            label.appendChild(count);
            btn.appendChild(label);

            if (currentValues.includes(theme.id)) {
                const check = document.createElement('span');
                check.className = 'eis-theme-card__check';
                check.innerHTML = '&#10003;';
                btn.appendChild(check);
            }

            btn.addEventListener('click', () => {
                if (callbacks.onOptionSelect) {
                    callbacks.onOptionSelect(stage, theme, btn);
                }
            });

            grid.appendChild(btn);
        });

        gallery.appendChild(grid);
        return gallery;
    }

    getThemeImage(theme) {
        const subThemes = theme.subThemes || [];
        for (const sub of subThemes) {
            if (sub.images && sub.images.length > 0) {
                return `DD-101 THEAMES/${theme.folder}/${sub.folder}/${sub.images[0]}`;
            }
        }
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23141414" width="400" height="300"/><text fill="%23555" font-family="sans-serif" font-size="14" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">No preview</text></svg>';
    }

    renderExperience(stage, state, callbacks) {
        const exp = document.createElement('div');
        exp.className = 'eis-experience';

        const desc = document.createElement('p');
        desc.className = 'eis-experience__description';
        desc.textContent = stage.description;
        exp.appendChild(desc);

        if (stage.duration) {
            const duration = document.createElement('span');
            duration.className = 'eis-experience__duration mono';
            duration.textContent = stage.duration;
            exp.appendChild(duration);
        }

        const preview = document.createElement('div');
        preview.className = 'eis-experience__preview';
        preview.innerHTML = `
            <div class="eis-experience__loader">
                <div class="eis-loader__spinner"></div>
                <p class="eis-loader__text">Generating your dream space...</p>
            </div>
        `;
        exp.appendChild(preview);

        if (callbacks.onExperienceStart) {
            callbacks.onExperienceStart(stage, preview);
        }

        return exp;
    }

    renderResults(stage, state, callbacks) {
        const results = document.createElement('div');
        results.className = 'eis-results';

        const desc = document.createElement('p');
        desc.className = 'eis-results__description';
        desc.textContent = stage.description;
        results.appendChild(desc);

        const collections = document.createElement('div');
        collections.className = 'eis-results__collections';
        collections.id = 'eis-recommendations-container';

        if (callbacks.onResultsReady) {
            callbacks.onResultsReady(stage, collections);
        }

        results.appendChild(collections);
        return results;
    }

    renderConversion(stage, state, callbacks) {
        const conversion = document.createElement('div');
        conversion.className = 'eis-conversion';

        const desc = document.createElement('p');
        desc.className = 'eis-conversion__description';
        desc.textContent = stage.description;
        conversion.appendChild(desc);

        if (callbacks.onConversionReady) {
            callbacks.onConversionReady(stage, conversion);
        }

        return conversion;
    }

    renderDefault(stage, state, callbacks) {
        const defaultEl = document.createElement('div');
        defaultEl.className = 'eis-default';

        const desc = document.createElement('p');
        desc.className = 'eis-default__description';
        desc.textContent = stage.description || 'Continue to the next step.';
        defaultEl.appendChild(desc);

        return defaultEl;
    }

    renderProgress(state) {
        const progress = document.createElement('div');
        progress.className = 'eis-progress';

        const bar = document.createElement('div');
        bar.className = 'eis-progress__bar';

        const currentStage = state.stagesCompleted?.length || 0;
        const totalStages = 18;
        const percentage = Math.round((currentStage / totalStages) * 100);

        bar.style.width = `${percentage}%`;
        progress.appendChild(bar);

        const label = document.createElement('span');
        label.className = 'eis-progress__label mono';
        label.textContent = `Step ${currentStage} of ${totalStages}`;
        progress.appendChild(label);

        return progress;
    }

    renderNavigation(stage, state, callbacks) {
        const nav = document.createElement('div');
        nav.className = 'eis-navigation';

        if (callbacks.onNavigationRender) {
            callbacks.onNavigationRender(stage, nav, state);
        }

        if (nav.children.length === 0) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'eis-btn eis-btn--primary';
            nextBtn.textContent = 'Continue';
            nextBtn.addEventListener('click', () => {
                if (callbacks.onNext) callbacks.onNext(stage);
            });
            nav.appendChild(nextBtn);
        }

        return nav;
    }

    getCurrentValues(state, stageId) {
        const stageAnswers = state.answers?.[stageId];
        if (Array.isArray(stageAnswers)) return stageAnswers;
        if (stageAnswers) return [stageAnswers];
        return [];
    }

    updateOptionSelection(optionEl, selected) {
        if (selected) {
            optionEl.classList.add('eis-option--selected');
        } else {
            optionEl.classList.remove('eis-option--selected');
        }
        const check = optionEl.querySelector('.eis-option__check');
        if (check) {
            check.innerHTML = selected ? '&#10003;' : '';
        }
    }

    showError(message) {
        const existing = this.container.querySelector('.eis-error');
        if (existing) existing.remove();

        const error = document.createElement('div');
        error.className = 'eis-error';
        error.textContent = message;
        this.container.appendChild(error);

        setTimeout(() => error.remove(), 3000);
    }

    showLoading() {
        const existing = this.container.querySelector('.eis-loading');
        if (existing) existing.remove();

        const loader = document.createElement('div');
        loader.className = 'eis-loading';
        loader.innerHTML = `
            <div class="eis-loader__spinner"></div>
            <p class="eis-loader__text">Processing...</p>
        `;
        this.container.appendChild(loader);
    }

    hideLoading() {
        const loader = this.container.querySelector('.eis-loading');
        if (loader) loader.remove();
    }
}

window.Renderer = Renderer;
