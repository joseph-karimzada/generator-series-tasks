import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { TaskFactory } from "../../task-engine/src/index.js";
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3001;
const execAsync = promisify(exec);

await TaskFactory.loadTemplates("task-engine/src/templates")

app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate", (req, res) => {
    const { order, seed, lang} = req.body;  // order is an array of task types
    if (!Array.isArray(order) || order.length === 0) {
        return res.status(400).json({ error: "order must be a non-empty array" });
    }

    const taskFactory = new TaskFactory(seed, lang);

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
    const { tasks, seed, includeAnswers} = req.body;

    try {
        // Create temporary directory
        const tempDir = path.join(process.cwd(), 'temp');
        await fs.mkdir(tempDir, { recursive: true });

        const timestamp = Date.now();
        const texFile = path.join(tempDir, `worksheet-${timestamp}.tex`);
        const docxFile = path.join(tempDir, `worksheet-${timestamp}.docx`);

        // Generate LaTeX content
        let latexContent = `
\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[russian,english]{babel}
\\usepackage{amsmath}
\\usepackage{amssymb}

\\title{ΣLab Worksheet}
\\author{Generated with seed: ${seed}}
\\date{${new Date().toLocaleDateString()}}

\\begin{document}
\\maketitle

`;

        // Add tasks
        tasks.forEach((task, index) => {
            latexContent += `\\section*{Problem ${index + 1}: }
`;

            if (task.text) {
                latexContent += `${task.text}\n\n`;
            }

            if (task.latex) {
                latexContent += `\\[${task.latex}\\]\n\n`;
            }
        });

        // Add answers section if requested
        if (includeAnswers) {
            latexContent += `\\newpage\n\\section*{Answers}\n\n`;
            tasks.forEach((task, index) => {
                if (task.answer !== null && task.answer !== undefined) {
                    latexContent += `\\textbf{${index + 1}.} ${task.answer}\n\n`;
                }
            });
        }

        latexContent += `\\end{document}`;

        // Write LaTeX file
        await fs.writeFile(texFile, latexContent, 'utf8');

        // Convert LaTeX to DOCX using Pandoc
        await execAsync(`pandoc "${texFile}" -o "${docxFile}" --from=latex --to=docx`);

        // Read the generated DOCX file
        const docxBuffer = await fs.readFile(docxFile);

        // Clean up temporary files
        await fs.unlink(texFile);
        await fs.unlink(docxFile);


        // Send file to client
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="sigma-lab-worksheet-${seed}.docx"`);
        res.send(docxBuffer);

    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to generate document' });
    }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
