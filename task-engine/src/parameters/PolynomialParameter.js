// PolynomialParameter.js
import { Parameter } from './../core/Parameter.js';

export class PolynomialParameter extends Parameter {
    /**
     * Creates a polynomial parameter.
     * @param {Array<number>} coeffs - Coefficients [a₀, a₁, a₂, ...] for a₀ + a₁x + a₂x² + ...
     * @param {string} renderForm - How to render: 'standard' or 'factored'
     */
    constructor(degree, coeffs, renderForm, roots = [], leadingCoeff = undefined) {
        super();
        this.coeffs = coeffs;
        this.renderForm = renderForm;
        this.degree = degree;
        this.roots = roots;
        this.leadingCoeff = leadingCoeff;

    }

    /**
     * Sample polynomial by generating random coefficients.
     * @param {Object} def - Template definition with coeffs array
     * @param {SeededRandom} rng - Random number generator
     * @returns {PolynomialParameter}
     */
    static sampleByCoeffs(def, rng) {
        const degree = Parameter.resolveSpec(def.degree, rng);

        let coeffs;

        // Check if coeffs is a single spec (same range for all coefficients)
        if (def.coeffs.min !== undefined && def.coeffs.max !== undefined) {
            // Single spec for all coefficients
            coeffs = [];
            for (let i = 0; i <= degree; i++) {
                coeffs.push(rng.randint(def.coeffs.min, def.coeffs.max));
            }
        } else {
            // Array of individual specs for each coefficient
            coeffs = def.coeffs.map(spec => rng.randint(spec.min, spec.max));
        }

        // Ensure leading coefficient (last element) is not zero
        const lastIndex = coeffs.length - 1;
        const lastSpec = Array.isArray(def.coeffs) ? def.coeffs[lastIndex] : def.coeffs;

        while (coeffs[lastIndex] === 0) {
            coeffs[lastIndex] = rng.randint(lastSpec.min, lastSpec.max);
        }

        // Determine render form
        const renderForm = Parameter.resolveSpec(def.renderForm, rng);

        return new PolynomialParameter(degree, coeffs, renderForm);
    }

    /**
     * Sample polynomial by generating random roots and expanding.
     * @param {Object} def - Template definition with roots config
     * @param {SeededRandom} rng - Random number generator
     * @returns {PolynomialParameter}
     */
    static sampleByRoots(def, rng) {
        const { count, min, max, allowRepeated } = def.roots;

        // Generate roots
        const roots = [];
        for (let i = 0; i < count; i++) {
            let root;
            do {
                root = rng.randint(min, max);
            } while (!allowRepeated && roots.includes(root));
            roots.push(root);
        }
        roots;

        // Get leading coefficient (ensure it's not zero)
        let leadingCoeff;
        if (def.leadingCoeff) {
            do {
                leadingCoeff = rng.randint(def.leadingCoeff.min, def.leadingCoeff.max);
            } while (leadingCoeff === 0);
        } else {
            leadingCoeff = 1;
        }

        // Expand (x - r₁)(x - r₂)... into coefficients
        const coeffs = this._expandRoots(roots, leadingCoeff);

        // Determine render form
        const renderForm = Parameter.resolveSpec(def.renderForm, rng);

        const degree = Parameter.resolveSpec(def.degree, rng);

        return new PolynomialParameter(degree, coeffs, renderForm, roots, leadingCoeff);
    }


    /**
     * Expand roots into polynomial coefficients.
     * E.g., roots [2, 3] with leadingCoeff 1 → (x-2)(x-3) = x² - 5x + 6 → [6, -5, 1]
     * @param {Array<number>} roots - Array of roots
     * @param {number} leadingCoeff - Leading coefficient
     * @returns {Array<number>} Coefficients [a₀, a₁, ..., aₙ]
     */
    static _expandRoots(roots, leadingCoeff) {
        // Start with coefficients representing "1"
        let coeffs = [1];

        // Multiply by (x - root) for each root
        for (const root of roots) {
            const newCoeffs = new Array(coeffs.length + 1).fill(0);

            // Distribute: coeffs * x - coeffs * root
            for (let i = 0; i < coeffs.length; i++) {
                newCoeffs[i + 1] += coeffs[i];        // x term
                newCoeffs[i] += coeffs[i] * (-root);  // constant term
            }

            coeffs = newCoeffs;
        }

        // Multiply by leading coefficient
        return coeffs.map(c => c * leadingCoeff);
    }

    static sample(def, rng) {
        if (def.method === 'coeffs') {
            return this.sampleByCoeffs(def, rng);
        } else if (def.method === 'roots') {
            return this.sampleByRoots(def, rng);
        } else {
            throw new Error(`Unknown polynomial method: ${def.method}`);
        }
    }

    /**
     * Render polynomial in standard form: aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀
     * @returns {string} LaTeX string
     */
    renderStandard() {
        const terms = [];

        for (let i = this.degree; i >= 0; i--) {
            const coeff = this.coeffs[i];

            // Skip zero coefficients
            if (coeff === 0) continue;

            let term = '';

            // Handle coefficient
            if (i === 0) {
                // Constant term - always show the number
                term = String(Math.abs(coeff));
            } else if (Math.abs(coeff) === 1) {
                // Coefficient is ±1 - don't show the 1
                term = '';
            } else {
                // Regular coefficient
                term = String(Math.abs(coeff));
            }

            // Handle variable part
            if (i === 1) {
                term += 'x';
            } else if (i > 1) {
                term += `x^{${i}}`;
            }

            // Handle sign
            if (terms.length === 0) {
                // First term - only add minus if negative
                if (coeff < 0) term = '-' + term;
            } else {
                // Not first term - add + or -
                term = (coeff > 0 ? ' + ' : ' - ') + term;
            }

            terms.push(term);
        }

        return terms.length > 0 ? terms.join('') : '0';
    }

    /**
     * Render polynomial in factored form: a(x - r₁)(x - r₂)...(x - rₙ)
     * Only works if polynomial was sampled by roots.
     * @returns {string} LaTeX string
     */
    renderFactored() {
        // If no roots stored, fall back to standard form
        if (!this.roots || this.roots.length === 0) {
            return this.renderStandard();
        }

        let result = '';

        // Add leading coefficient if not 1
        const leadingCoeff = this.leadingCoeff || 1;
        if (leadingCoeff !== 1) {
            if (leadingCoeff === -1) {
                result = '-';
            } else {
                result = String(leadingCoeff);
            }
        }

        // Add each factor (x - r)
        for (const root of this.roots) {
            if (root === 0) {
                result += 'x';
            } else if (root > 0) {
                result += `(x - ${root})`;
            } else {
                result += `(x + ${Math.abs(root)})`;
            }
        }

        return result || '1';
    }

    /**
     * Render to LaTeX based on renderForm.
     * @returns {string} LaTeX string
     */
    toString() {
        if (this.renderForm === 'factored') {
            return this.renderFactored();
        } else if (this.renderForm === 'standard') {
            return this.renderStandard();
        } else {
            throw new Error(`Unknown render form: ${this.renderForm}`);
        }
    }
}