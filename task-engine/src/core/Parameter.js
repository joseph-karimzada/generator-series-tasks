export class Parameter {

    static parseSpec(spec, rng){
        if (Parameter.isWeightedSpec(spec)) {
            return rng.weightedChoice(spec);
        } else {
            return spec;
        }
    }
    static resolveSpec(spec, rng){
        // Check if weighted specification
        if (Parameter.isWeightedSpec(spec)) {
            return rng.weightedChoice(spec).spec;
        }

        return spec;
    }
    static isWeightedSpec(spec) {
        return Array.isArray(spec) && spec.length > 0 && spec.every(item =>
            typeof item === 'object' && item !== null && 'weight' in item
        );
    }

    // Abstract static generator, parameter class may implement many generators but sample associates one generator with a specific parameter
    static sample(def, rng) {
        throw new Error("Must implement static sample()");
    }

    constructor() {
        if (new.target === Parameter) {
            throw new Error("Parameter is abstract");
        }
    }

    // Abstract instance method - renders to LaTeX with double backslashes, parameter class may implement many renders but toString associates one render with a specific parameter
    toString() {
        throw new Error("Must implement toString()");
    }

}