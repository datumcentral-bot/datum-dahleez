/**
 * DATUM DAHLEEZ Report Generator
 * Template-based report generation from consultation state
 */

class ReportGenerator {
    constructor(options = {}) {
        this.dataLoader = options.dataLoader || new DataLoader();
        this.templates = new Map();
    }

    async generateReport(state, reportType) {
        const blueprintGen = new BlueprintGenerator({ dataLoader: this.dataLoader });
        const blueprint = await blueprintGen.generate(state);
        
        const sections = {
            'consultation-summary': [blueprint.sections[0]],
            'emotional-dna': [blueprint.sections[1], blueprint.sections[2]],
            'space-dna': [blueprint.sections[1]],
            'design-philosophy': [blueprint.sections[3]],
            'material-report': [blueprint.sections[4]],
            'lighting-report': [blueprint.sections[5]],
            'air-wellness-report': [blueprint.sections[6]],
            'furniture-strategy': [blueprint.sections[7]],
            'technology-strategy': [blueprint.sections[8]],
            'budget-options': [blueprint.sections[9]],
            'implementation-roadmap': [blueprint.sections[10]],
            'maintenance-guide': [blueprint.sections[11]],
            'full-blueprint': blueprint.sections
        };

        const selectedSections = sections[reportType] || sections['full-blueprint'];
        
        return {
            title: blueprint.title,
            type: reportType,
            generatedAt: new Date().toISOString(),
            sections: selectedSections,
            metadata: blueprint.metadata
        };
    }

    renderReportHTML(report) {
        return `
            <div class="report" style="background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; max-width: 900px; margin: 0 auto; padding: 2rem;">
                <div class="report__header" style="border-bottom: 2px solid var(--gold); padding-bottom: 1.5rem; margin-bottom: 2rem;">
                    <div class="report__type mono" style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem;">${report.type}</div>
                    <h1 class="report__title display" style="font-size: 2rem; margin: 0;">${report.title}</h1>
                    <div class="report__meta mono" style="font-size: 0.8rem; color: var(--muted); margin-top: 0.5rem;">Generated: ${new Date(report.generatedAt).toLocaleString()}</div>
                </div>
                ${report.sections.map((section, i) => `
                    <div class="report__section" style="margin-bottom: 2rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                        <h2 class="report__section-title display" style="font-size: 1.3rem; margin: 0 0 0.5rem; color: var(--gold);">${i + 1}. ${section.title}</h2>
                        <p style="color: var(--soft-silver); line-height: 1.7;">${section.content}</p>
                    </div>
                `).join('')}
                <div class="report__footer" style="margin-top: 3rem; padding-top: 1.5rem; border-top: 2px solid var(--border); text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--muted);">
                    DATUM DAHLEEZ Environmental Intelligence Platform · Confidential Client Document
                </div>
            </div>
        `;
    }
}

window.ReportGenerator = ReportGenerator;
