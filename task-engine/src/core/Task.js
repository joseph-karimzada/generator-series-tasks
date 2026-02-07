// task-engine/src/core/Task.js
import {pmL, pthL, mltL} from "../utils/latexHelpers.js";
import {ParameterFactory} from "./ParameterFactory.js";
import {Fraction} from "../utils/Fraction.js";

export class Task {

    static MAX_GENERATION_ATTEMPTS = 10000;

    constructor(rng, template, lang) {
        this.rng = rng;
        this.lang = lang;

        this.params = null;
        this.question = null;
        this.answer = null;

        this.template = template;
        if (!this.template) {
            throw new Error(`Template not found`);
        }

        this.text = this.template.text[this.lang];
    }

    // ————————————————————————————————————————
    // PUBLIC API — Only these 4 methods
    // ————————————————————————————————————————

    generateParams() {
        let attempts = 0;

        const paramsFactory = new ParameterFactory(this.rng)
        const params = paramsFactory.sampleAll(this.template.params)

        while (attempts++ < Task.MAX_GENERATION_ATTEMPTS && !this.params) {
            const failed = (this.template.constraints || []) //Checking for failed constrains
                .filter(group => !this._checkConstraint(group, params));

            if (failed.length === 0) this.params = params; // Finally getting generated params if all constrains satisfied

            const toRegen = new Set(); // Creating set of failed params
            failed.forEach(g => g.params.forEach(p => toRegen.add(p)));

            for (const key of toRegen) { // Regenerating failed params
                params[key] = paramsFactory.sampleOne(this.template.params[key]);
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
        if (!this.params) throw new Error("Call generateParams() first");
        if (!this.template.answer) {
            this.answer = null;
            return null;
        }

        const scope = {
            Math,
            ...this.params,
            // Fraction class for exact arithmetic
            Frac: Fraction
        };
        this.answer = this._evaluate("return " + this.template.answer, scope);
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