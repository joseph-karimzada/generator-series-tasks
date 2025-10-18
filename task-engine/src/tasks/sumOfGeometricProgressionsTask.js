import { Task } from "../core/Task.js";

export class SumOfGeometricProgressionsTask extends Task {

    ranges = {
        "a": [-5, -4, -3, -2, 2, 3, 4, 5],
        "i_a": [1, 3],
        "j_a": [-2, 2],
        "b": [-5, -4, -3, -2, 2, 3, 4, 5],
        "i_b": [1, 3],
        "j_b": [-2, 2],
        "c": [3, 9],
        "d": [1, 4]
    }

    constructor(rng) {
        super(rng, "sumOfGeometricProgressionsTask");
    }
    /** Generates valid random variables for the geometric progression task. */
    generate() {
        let a, b, c, d, i_a, i_b, j_a, j_b, pm;
        let attempts = 0
        d = this.rng.randint(...this.ranges['d']);
        j_a = this.rng.randint(...this.ranges['j_a']);
        j_b = this.rng.randint(...this.ranges['j_b']);
        pm = this.rng.choice(["+", "-"]);
        do {
            a = this.rng.choice(this.ranges['a']);
            b = this.rng.choice(this.ranges['b']);
            c = this.rng.randint(...this.ranges['c']);
            i_a = this.rng.randint(...this.ranges['i_a']);
            i_b = this.rng.randint(...this.ranges['i_b']);
            attempts++;
            if (attempts > 10000) throw new Error("Could not generate valid variables.");
        } while (
            a === b ||
            Math.abs(a) ** i_a >= c ||
            Math.abs(b) ** i_b >= c);
        this.params = {a, b, c, d, i_a, i_b, j_a, j_b, pm}
    }
    /** Converts task parameters into valid LaTeX text. */
    toLatex() {
        const { a, b, c, d, i_a, i_b, j_a, j_b, pm } = this.params;
        return `\\sum_{n=${d}}^{\\infty} \\frac{${a > 0 ? a : '('+a+')'}^{${i_a > 1 ? i_a : ''} n ${j_a === 0 ? '' : j_a > 0 ? '+' + j_a : j_a}} 
        ${pm} ${b > 0 ? b : '('+b+')'}^{${i_b > 1 ? i_b : ''} n ${j_b === 0 ? '' : j_b > 0 ? '+' + j_b : j_b}}}{${c}^n}`;
    }
}
