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
    static async loadTemplates(source) {
        const absSource = path.resolve(source);
        const stat = fs.statSync(absSource);

        const files = [];
        if (stat.isDirectory()) {
            const entries = fs.readdirSync(absSource);
            for (const entry of entries) {
                // Accept both .json and .js files
                if (entry.endsWith('.json') || entry.endsWith('.js')) {
                    files.push(path.join(absSource, entry));
                }
            }
        } else {
            files.push(absSource);
        }

        for (const file of files) {
            let tmpl;

            if (file.endsWith('.js')) {
                // Import .js module
                tmpl = (await import(file)).default;
            } else {
                // Parse .json file
                const raw = fs.readFileSync(file, 'utf8');
                tmpl = JSON.parse(raw);
            }

            if (!tmpl.name) {
                throw new Error(`Template missing 'name' field: ${file}`);
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