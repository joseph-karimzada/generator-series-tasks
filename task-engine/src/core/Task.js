// task-engine/src/core/Task.js
import {pmL, pthL, mltL} from "../utils/latexHelpers.js";

export class Task {

    constructor(rng, template, taskText = "") {
        this.rng = rng;
        this.taskText = taskText;

        this.params = null;
        this.question = null;
        this.answer = null;

        this.template = template;
        if (!this.template) {
            throw new Error(`Template not found}`);
        }
    }

    // ————————————————————————————————————————
    // PUBLIC API — Only these 4 methods
    // ————————————————————————————————————————

    generateParams() {
        const params = {};
        let attempts = 0;

        this._sampleAll(this.template.params, params);

        while (attempts++ < 10000 && !this.params) {
            const failed = (this.template.constraints || []) //Checking for failed constrains
                .filter(group => !this._checkConstraint(group, params));

            if (failed.length === 0) this.params = params; // Finally getting generated params if all constrains satisfied

            const toRegen = new Set(); // Creating set of failed params
            failed.forEach(g => g.params.forEach(p => toRegen.add(p)));

            for (const key of toRegen) { // Regenerating failed params
                params[key] = this._sampleOne(this.template.params[key]);
            }
        }
        if (!this.params){
            throw new Error(`Failed to generate valid params for "${this.template.name}"`);
        }
    }

    renderQuestion() {
        if (!this.params) throw new Error("Call generateParams() first");
        this.question = this._render();
        return this.question;
    }

    computeAnswer() {
        if (!this.params) throw new Error("There are not generated params. Call generateParams() first");
        if (!this.template.answer) { // Checking if template has function to evaluate answer
            this.answer = null;
            return null;
        }
        this.answer = this._evaluate("return " + this.template.answer, {Math, ...this.params});
        return this.answer;
    }

    toJSON() {
        return {
            type: this.constructor.name,
            question: this.question,
            answer: this.answer,
            params: this.params
        };
    }

    _sampleAll(defs, target) {
        for (const [k, def] of Object.entries(defs)) {
            target[k] = this._sampleOne(def);
        }
    }

    _sampleOne(def) {
        switch (def.type) {
            case "int":
            case "randint":
                return this.rng.randint(def.min, def.max);
            case "choice":
                return this.rng.choice(def.values);
            default:
                throw new Error(`Unknown type: ${def.type}`);
        }
    }

    _checkConstraint(group, params) {
        const scope = { Math, abs: Math.abs, pow: Math.pow, ...params};

        if (!group._fn) {
            group._fn = new Function(...Object.keys(scope), `return !!(${group.code})`);
        }
        try {
            return group._fn(...Object.values(scope));
        } catch (e) {
            console.warn("Constraint failed:", group.code, e);
            return false;
        }
    }

    _evaluate(code, scope) {
        const fn = new Function(...Object.keys(scope), code);
        return fn(...Object.values(scope));
    }

    _render() {
        const escapedLatex = this.template.latex.replace(/\\+/g, match => '\\'.repeat(match.length * 2));
        return this._evaluate(`return \`${escapedLatex}\``, {pmL: pmL, pthL: pthL, mltL: mltL, ...this.params});
    }
}