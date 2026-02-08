
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { TaskFactory } from "../../task-engine/src/index.js";
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

// Get the directory where THIS FILE (server.js) is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..')

const app = express();
const PORT = 3001;
const execAsync = promisify(exec);

await TaskFactory.loadTemplates(path.join(projectRoot, "task-engine/src/templates"))

app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate", (req, res) => {
    const {order, seed, language} = req.body;  // order is an array of task types
    if (!Array.isArray(order) || order.length === 0) {
        return res.status(400).json({ error: "order must be a non-empty array" });
    }

    const taskFactory = new TaskFactory(seed, language);

    try {
        const results = order.map(type => {
            const task = taskFactory.createTask(type);
            task.generateParams();           // populate this.params
            return {
                type,
                params: task.params,
                text: task.text,
                latex: task.renderQuestion(),
                answer: task.computeAnswer(),
            };
        });

        res.json({ tasks: results });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/export', async (req, res) => {
    const { tasks, seed, includeAnswers, language = 'en' } = req.body;

    const t = (key) => {
        const translations = {
            en: {
                title: 'Σ Lab Worksheet',
                titleAnswers: 'Σ Lab - Answers',
                seed: 'Random Seed',
                generated: 'Generated',
                tasks: 'Tasks',
                answers: 'Answers'
            },
            ru: {
                title: 'Σ Lab',
                titleAnswers: 'Σ Lab - Ответы',
                seed: 'Сид Рандома',
                generated: 'Сгенерировано',
                tasks: 'Задачи',
                answers: 'Ответы'
            }
        };
        return translations[language]?.[key] || translations.en[key];
    };

    try {
        const tempDir = path.join(__dirname, 'temp');
        await fs.mkdir(tempDir, { recursive: true });

        const timestamp = Date.now();
        const langPackage = language === 'ru' ? '\\usepackage[russian]{babel}' : '';

        // Generate tasks document
        const tasksTexFile = path.join(tempDir, `tasks-${timestamp}.tex`);
        const tasksDocxFile = path.join(tempDir, `tasks-${timestamp}.docx`);

        let tasksLatex = `
\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
${langPackage}
\\usepackage{amsmath}
\\usepackage{amssymb}

\\title{${t('title')}}
\\author{${t('seed')}: ${seed}}
\\date{${t('generated')}: ${new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}}

\\begin{document}
\\maketitle

\\section*{${t('tasks')}}

`;

        tasks.forEach((task, index) => {
            tasksLatex += ` \\textbf{${index + 1}}. ${task.text}\n\n`;
            if (task.latex) tasksLatex += `\\[${task.latex}\\]\n\n`;
        });

        tasksLatex += `\\end{document}`;
        await fs.writeFile(tasksTexFile, tasksLatex, 'utf8');
        await execAsync(`pandoc "${tasksTexFile}" -o "${tasksDocxFile}" --from=latex --to=docx`);

        let files = [{ path: tasksDocxFile, name: `sigma-lab-tasks-${seed}.docx` }];

        // Generate answers document if requested
        if (includeAnswers) {
            const answersTexFile = path.join(tempDir, `answers-${timestamp}.tex`);
            const answersDocxFile = path.join(tempDir, `answers-${timestamp}.docx`);

            let answersLatex = `
\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
${langPackage}
\\usepackage{amsmath}
\\usepackage{amssymb}

\\title{${t('titleAnswers')}}
\\author{${t('seed')}: ${seed}}
\\date{${t('generated')}: ${new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}}

\\begin{document}
\\maketitle

\\section*{${t('answers')}}

`;

            tasks.forEach((task, index) => {
                if (task.answer !== null && task.answer !== undefined) {
                    answersLatex += `\\textbf{${index + 1}.} ${task.answer}\n\n`;
                }
            });

            answersLatex += `\\end{document}`;
            await fs.writeFile(answersTexFile, answersLatex, 'utf8');
            await execAsync(`pandoc "${answersTexFile}" -o "${answersDocxFile}" --from=latex --to=docx`);

            files.push({ path: answersDocxFile, name: `sigma-lab-answers-${seed}.docx` });

            await fs.unlink(answersTexFile);
        }
        // Create ZIP if multiple files
        if (files.length > 1) {
            const archive = archiver('zip');

            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename="sigma-lab-${seed}.zip"`);

            archive.pipe(res);
            files.forEach(f => archive.file(f.path, { name: f.name }));

            const archiveBuffer = await archive.finalize();
            res.send(archiveBuffer);

        } else {
            // Single file
            const buffer = await fs.readFile(files[0].path);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename="${files[0].name}"`);
            res.send(buffer);
        }

        // Cleanup
        await fs.unlink(tasksTexFile);
        for (const f of files) {
            await fs.unlink(f.path);
        }

    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to generate documents' });
    }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
