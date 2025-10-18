import { Task } from "../core/Task.js";
import {pthL, pmL, mltL} from "../utils/latexHelpers.js";

export class TelescopingSeriesTask extends Task {

    ranges = {
        "a": [-4, 4],
        "b": [-4, 4],
        "c": [2, 16],
        "d": [1, 4]
    }

    constructor(rng) {
        super(rng, "telescopingSeriesTask");
    }
    /** Generates valid random variables for the geometric progression task. */
    generate() {
        let a, b, c, d;
        let attempts = 0
        d = this.rng.randint(...this.ranges['d']);
        do {
            a = this.rng.randint(...this.ranges['a']);
            b = this.rng.randint(...this.ranges['b']);
            c = this.rng.randint(...this.ranges['c']);
            attempts++;
            if (attempts > 1000) throw new Error("Could not generate valid variables.");
        } while (
            !(
                Number.isInteger(c / Math.abs(a - b)) &&
                c / Math.abs(a - b) > 0
            ));
        this.params = {a, b, c, d}
    }
    /** Converts task parameters into valid LaTeX text. */
    toLatex() {
        const {a, b, c, d} = this.params;
        return `\\sum_{n=${d}}^{\\infty}\\frac{${c}}{(n${pmL(a)})(n${pmL(b)})}`;
    }
}
