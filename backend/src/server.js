import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { TaskFactory } from "../../task-engine/src/index.js";

const app = express();
const PORT = 3001;

TaskFactory.loadTemplates("task-engine/src/templates")

app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate", (req, res) => {
    const { order, seed } = req.body;  // order is an array of task types
    if (!Array.isArray(order) || order.length === 0) {
        return res.status(400).json({ error: "order must be a non-empty array" });
    }

    const taskFactory = new TaskFactory(seed);

    try {
        const results = order.map(type => {
            const task = taskFactory.createTask(type);
            task.generateParams();           // populate this.params
            return {
                type,
                params: task.params,
                latex: task.renderQuestion()
            };
        });

        res.json({ tasks: results });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
