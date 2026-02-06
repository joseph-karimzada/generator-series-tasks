// ParameterFactory.js
import { NumberParameter } from '../parameters/NumberParameter.js'
import { ChoiceParameter } from '../parameters/ChoiceParameter.js';
import { PolynomialParameter } from '../parameters/PolynomialParameter.js';

export class ParameterFactory {
    static registry = {
        'int': NumberParameter,
        'randint': NumberParameter,
        'choice': ChoiceParameter,
        'polynomial': PolynomialParameter,
    };

    // Allow custom parameter types to be registered
    static register(type, ParamClass) {
        ParameterFactory.registry[type] = ParamClass;
    }

    constructor(rng) {
        this.rng = rng;
    }

    sampleAll(defs) {
        const params = {}
        for (const [k, def] of Object.entries(defs)) {
            params[k] = this.sampleOne(def);
        }
        return params;
    }

    sampleOne(def) {
        const ParamClass = ParameterFactory.registry[def.type];
        if (!ParamClass) {
            throw new Error(`Unknown parameter type: ${def.type}`);
        }
        return ParamClass.sample(def, this.rng);
    }

}