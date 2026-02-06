import { Parameter} from "../core/Parameter.js";

export class NumberParameter extends Parameter {

    static sample(def, rng){
        const value = rng.randint(def.min, def.max);
        return new NumberParameter(value);
    }

    constructor(value) {
        super();
        this.value = value;
    }

    render() {
        return this.value;
    }

    toString() {
        return this.render()
    }
}