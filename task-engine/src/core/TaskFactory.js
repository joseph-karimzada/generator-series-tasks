// task-engine/src/core/TaskFactory.js
// import { SumOfGeometricProgressionsTask } from "../tasks/sumOfGeometricProgressionsTask.js";
// import { TelescopingSeriesTask } from "../tasks/telescopingSeriesTask.js";
import {Task} from "./Task.js";
import {SeededRandom} from "../utils/random.js";
import fs from 'fs';
import path from 'path';

export class TaskFactory {
    static templates = {};

    static loadTemplates(source) {
        const files = [];

        const absSource = path.resolve(source);
        const stat = fs.statSync(absSource);

        if (stat.isDirectory()) { // Adding templates from folder
            // Read all .json files in folder
            const entries = fs.readdirSync(absSource);
            for (const entry of entries) {
                if (entry.endsWith('.json')) {
                    files.push(path.join(absSource, entry));
                }
            }}
        else if (stat.isFile() && absSource.endsWith('.json')) files.push(absSource); // Adding template from single file
        else throw new Error(`Invalid source: ${source} (must be folder or .json file)`);

        // Load each file
        for (const file of files) {
            const raw = fs.readFileSync(file, 'utf8');
            let tmpl;

            try {
                tmpl = JSON.parse(raw); // Parsing JSON
            } catch (e) {
                throw new Error(`Invalid JSON in ${file}: ${e.message}`);
            }
            if (!tmpl.name) {
                throw new Error(`Template missing 'name' field: ${file}`);
            }
            if (TaskFactory.templates[tmpl.name]) {
                console.warn(`Warning: Template "${tmpl.name}" from ${file} overwrites previous one`);
            }

            TaskFactory.templates[tmpl.name] = tmpl;
        }
    }

    static _checkTemplate(templateName) {
        let template = TaskFactory.templates[templateName];
        if (!template) {
            throw new Error(`Template not found: ${templateName}`);
        } else {
            return template;
        }
    }

    constructor(seed) {
        this.seed = seed;
        this.rng = new SeededRandom(seed)
    }
    createTask(type) {
        switch (type.toLowerCase()) {
            case "geometric":
                return new Task(this.rng, TaskFactory._checkTemplate("sum-geometric-progressions"));
            case "telescoping":
                return new Task(this.rng, TaskFactory._checkTemplate("telescoping-series"));
            default:
                throw new Error(`Unknown task type: ${type}`);
        }
    }
}
