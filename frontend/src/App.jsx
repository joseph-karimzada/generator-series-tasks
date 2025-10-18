import { useState, useEffect, useRef} from "react";
import axios from "axios";
import katex from "katex";

function Latex({ expression }) {
    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            katex.render(expression, ref.current, {
                throwOnError: false,
            });
        }
    }, [expression]);

    return <div ref={ref} />;
}

function App() {
    const [seed, setSeed] = useState("seed");
    const [order, setOrder] = useState(["geometric", "telescoping"]);
    const [tasks, setTasks] = useState([]);

    const handleGenerate = async () => {
        try {
            const res = await axios.post("http://localhost:3001/api/generate", {
                seed,
                order
            });
            setTasks(res.data.tasks);
        } catch (err) {
            console.error(err);
            alert("Error generating tasks: " + err.message);
        }
    };

    const handleAddTask = () => setOrder([...order, "geometric"]);

    const handleChangeTaskType = (index, value) => {
        const newOrder = [...order];
        newOrder[index] = value;
        setOrder(newOrder);
    };

    const handleDeleteTask = index => {
        const newOrder = order.filter((_, i) => i !== index);
        setOrder(newOrder);
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Series Task Generator</h1>

            <div>
                <label>Seed: </label>
                <input value={seed} onChange={e => setSeed(e.target.value)} />
            </div>

            <h3>Task Order:</h3>
            {order.map((type, index) => (
                <div key={index} style={{ marginBottom: 5 }}>
                    <select
                        value={type}
                        onChange={e => handleChangeTaskType(index, e.target.value)}
                    >
                        <option value="geometric">Geometric</option>
                        <option value="telescoping">Telescoping</option>
                    </select>
                    <button onClick={() => handleDeleteTask(index)} style={{ marginLeft: 10 }}>
                        Delete
                    </button>
                </div>
            ))}
            <button onClick={handleAddTask} style={{ marginTop: 10 }}>Add Task</button>

            <div style={{ marginTop: 20 }}>
                <button onClick={handleGenerate}>Generate Tasks</button>
            </div>

            {tasks.length > 0 && (
                <div style={{ marginTop: 30 }}>
                    <h2>Generated Tasks</h2>
                    {tasks.map((task, index) => (
                        <div
                            key={index}
                            style={{ marginBottom: 20, padding: 10, border: "1px solid #ccc" }}
                        >
                            <h4>Task #{index + 1} ({task.type})</h4>
                            <strong>Params:</strong>
                            <pre>{JSON.stringify(task.params, null, 2)}</pre>
                            <strong>LaTeX:</strong>
                            <Latex expression={task.latex} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
