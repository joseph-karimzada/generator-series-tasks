import { Parameter} from "../core/Parameter.js";
export class ChoiceParameter extends Parameter {

    static sample(def, rng){
        const value = rng.choice(def.values);
        return new ChoiceParameter(value);
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