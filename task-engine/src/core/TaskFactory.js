// task-engine/src/core/TaskFactory.js
import { SumOfGeometricProgressionsTask } from "../tasks/sumOfGeometricProgressionsTask.js";
import { TelescopingSeriesTask } from "../tasks/telescopingSeriesTask.js";
import {SeededRandom} from "../utils/random.js";

export class TaskFactory {
    constructor(seed) {
        this.seed = seed;
        this.rng = new SeededRandom(seed)
    }
    createTask(type) {
        switch (type.toLowerCase()) {
            case "geometric":
                return new SumOfGeometricProgressionsTask(this.rng);
            case "telescoping":
                return new TelescopingSeriesTask(this.rng);
            default:
                throw new Error(`Unknown task type: ${type}`);
        }
    }
}
