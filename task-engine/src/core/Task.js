export class Task {
    constructor(rng, taskText) {
        if (new.target === Task) {
            throw new Error("Cannot instantiate abstract class Task directly");
        }
        this.rng = rng;
        this.taskText = taskText;
        this.answer = null;
    }

    generate() {
        throw new Error("Method 'generate()' must be implemented in subclass");
    }

    toLatex() {
        throw new Error("Method 'toLatex()' must be implemented in subclass");
    }

    toJSON() {
        return {
            type: this.constructor.name,
            seed: this.seed,
            task: this.taskText,
            answer: this.answer
        };
    }
}
