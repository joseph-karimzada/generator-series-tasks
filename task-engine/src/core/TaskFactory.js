// task-engine/src/core/TaskFactory.js

import {Task} from "./Task.js";
import {SeededRandom} from "../utils/random.js";
import fs from 'fs';
import path from 'path';

export class TaskFactory {
    static templates = {};

    /**
     * Load task templates from a file or directory.
     * @param {string} source - Path to .json file or directory containing .json files
     */
    static loadTemplates(source) {
        const files = [];

        const absSource = path.resolve(source);
        const stat = fs.statSync(absSource);

        if (stat.isDirectory()) {
            // Read all .json files in folder
            const entries = fs.readdirSync(absSource);
            for (const entry of entries) {
                if (entry.endsWith('.json')) {
                    files.push(path.join(absSource, entry));
                }
            }
        } else if (stat.isFile() && absSource.endsWith('.json')) {
            files.push(absSource);
        } else {
            throw new Error(`Invalid source: ${source} (must be folder or .json file)`);
        }

        // Load each file
        for (const file of files) {
            const raw = fs.readFileSync(file, 'utf8');
            let tmpl;

            try {
                tmpl = JSON.parse(raw);
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

    constructor(seed, lang) {
        this.lang = lang;
        this.seed = seed;
        this.rng = new SeededRandom(seed);
    }

    /**
     * Create a task by template name.
     * @param {string} templateName - Name of the template (from template.name field)
     * @returns {Task}
     */
    createTask(templateName) {
        const template = TaskFactory.templates[templateName];

        if (!template) {
            const available = Object.keys(TaskFactory.templates).join(', ');
            throw new Error(`Template not found: ${templateName}. Available: ${available}`);
        }

        return new Task(this.rng, template, this.lang);
    }
}