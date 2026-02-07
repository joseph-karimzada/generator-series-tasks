import { useState, useEffect, useRef } from "react";
import axios from "axios";
import katex from "katex";
import { useTranslation } from 'react-i18next';
import { taskTypes } from "./config/taskTypes.js";
import { useDocumentTitle } from './hooks/useDocumentTitle';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';
import "./App.css";

function Latex({ expression }) {
    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            katex.render(expression, ref.current, {
                throwOnError: false,
            });
        }
    }, [expression]);

    return <div ref={ref} className="latex-content" />;
}

function App() {
    const { t, i18n } = useTranslation();

    useDocumentTitle(t('page.title'))

    // Load saved state from localStorage
    const loadFromStorage = (key, defaultValue) => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            return defaultValue;
        }
    };

    const [seed, setSeed] = useState(() => loadFromStorage('sigma-seed', 'seed'));
    const [taskCounts, setTaskCounts] = useState(() => loadFromStorage('sigma-taskCounts', {
        "sum-geometric-progressions": 1,
        "telescoping-series": 1,
        "necessary-cond-polynomial-frac-task": 1
    }));
    const [tasks, setTasks] = useState(() => loadFromStorage('sigma-tasks', []));
    const [isGenerating, setIsGenerating] = useState(false);
    const [includeAnswers, setIncludeAnswers] = useState(false);
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'simple'

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('sigma-seed', JSON.stringify(seed));
    }, [seed]);

    useEffect(() => {
        localStorage.setItem('sigma-taskCounts', JSON.stringify(taskCounts));
    }, [taskCounts]);

    useEffect(() => {
        localStorage.setItem('sigma-tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Build order array from counts
            const order = [];
            Object.entries(taskCounts).forEach(([type, count]) => {
                for (let i = 0; i < count; i++) {
                    order.push(type);
                }
            });
            const res = await axios.post("http://localhost:3001/api/generate", {
                seed,
                order,
                lang: i18n.language,
            });
            setTasks(res.data.tasks);
        } catch (err) {
            console.error(err);
            alert("Error generating tasks: " + err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCountChange = (type, value) => {
        const count = Math.max(0, parseInt(value) || 0);
        setTaskCounts(prev => ({
            ...prev,
            [type]: count
        }));
    };

    const handleClear = () => {
        setSeed('seed');
        setTaskCounts({
            "sum-geometric-progressions": 1,
            "telescoping-series": 1,
            "necessary-cond-polynomial-frac-task": 1
        });
        setTasks([]);
        localStorage.removeItem('sigma-seed');
        localStorage.removeItem('sigma-taskCounts');
        localStorage.removeItem('sigma-tasks');
    };

    const handleExportWord = async (includeAnswers) => {
        try {
            const response = await axios.post('http://localhost:3001/api/export', {
                tasks,
                seed,
                includeAnswers
            }, {
                responseType: 'blob' // Important for file download
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `sigma-lab-worksheet-${seed}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export document');
        }
    };

    const totalTasks = Object.values(taskCounts).reduce((sum, count) => sum + count, 0);

    return (
        <div className="app">
            {/* Header */}
            <header className="header">
                <div className="header-container">
                    <a href="/" className="logo">
                        <div className="logo-symbol">Σ</div>
                        <div className="logo-text">
                            <span className="logo-main">Lab</span>
                            <span className="logo-sub">{t('logo.subtitle')}</span>
                        </div>
                    </a>
                    <nav className="nav">
                        <a href={t('header.tasks.link')} className="nav-link" target="_blank" rel="noopener noreferrer">{t('header.tasks')}</a>
                        <a href={t('header.about.link')} className="nav-link" target="_blank" rel="noopener noreferrer">{t('header.about')}</a>
                        <LanguageSwitcher />
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="main">
                <div className="container">
                    {/* Configuration Panel */}
                    <section className="config-panel">
                        <div className="panel-header">
                            <h2 className="panel-title">{t('config.title')}</h2>
                            <p className="panel-subtitle">
                                {t('config.subtitle')}
                            </p>
                        </div>

                        <div className="config-content">
                            {/* Seed Input */}
                            <div className="input-group">
                                <label className="input-label">
                                    {t('config.seed.label')}
                                    <span className="label-hint">{t('config.seed.hint')}</span>
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={seed}
                                    onChange={e => setSeed(e.target.value)}
                                    placeholder={t('config.seed.placeholder')}
                                />
                            </div>

                            {/* Task Types */}
                            <div className="task-order-section">
                                <div className="section-header">
                                    <h3 className="section-title">{t('config.taskTypes.title')}</h3>
                                    <div className="total-count">
                                        {t('config.taskTypes.total')}: {totalTasks} {totalTasks === 1 ? t('config.taskTypes.task') : t('config.taskTypes.tasks')}
                                    </div>
                                </div>

                                <div className="task-list">
                                    {Object.entries(taskTypes).map(([category, types]) => (
                                        <div className="task-category" key={category}>
                                            <div className="task-category-name">
                                                {t("taskCategory." + category) || category}
                                            </div>
                                            {types.map((type, index) => (
                                                <div key={type} className="task-item">
                                                    <div className="task-info">
                                                        <div className="task-type-name">
                                                            {t("taskType." + type) || type}
                                                        </div>
                                                    </div>
                                                    <div className="task-counter">
                                                        <button
                                                            className="counter-btn"
                                                            onClick={() => handleCountChange(type, taskCounts[type] - 1)}
                                                            disabled={taskCounts[type] === 0}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                            </svg>
                                                        </button>
                                                        <input
                                                            type="number"
                                                            className="counter-input"
                                                            value={taskCounts[type]}
                                                            onChange={(e) => handleCountChange(type, e.target.value)}
                                                            min="0"
                                                        />
                                                        <button
                                                            className="counter-btn"
                                                            onClick={() => handleCountChange(type, taskCounts[type] + 1)}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Generate and Clear Button */}
                            <div className="button-group">
                                {tasks.length > 0 ?
                                    <button
                                        className="btn-clear"
                                        onClick={handleClear}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        {t('config.clear')}
                                    </button> : ''}
                                <button
                                    className={`btn-generate ${isGenerating ? 'generating' : ''}`}
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="spinner"></span>
                                            {t('config.generating')}
                                        </>
                                    ) : (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                            {t('config.generate')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Generated Tasks Display or Placeholder */}
                    {tasks.length > 0 ? ( // Task Display
                        <section className="results-section">
                            <div className="results-header">
                                <h2 className="results-title">{t('results.title')}</h2>
                                <div className="results-actions">
                                    <div className="view-toggle">
                                        <button
                                            className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
                                            onClick={() => setViewMode('cards')}
                                            title={t('results.viewCards')}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                                                <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                                                <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                                                <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                                            </svg>
                                        </button>
                                        <button
                                            className={`toggle-btn ${viewMode === 'simple' ? 'active' : ''}`}
                                            onClick={() => setViewMode('simple')}
                                            title={t('results.viewSimple')}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="export-dropdown">
                                        <button className="btn-export">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8 2v8m0 0l3-3m-3 3L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                            {t('results.exportWord')}
                                        </button>
                                        <div className="export-options">
                                            <button className="export-option" onClick={() => handleExportWord(false)}>
                                                {t('results.exportWithoutAnswers')}
                                            </button>
                                            <button className="export-option" onClick={() => handleExportWord(true)}>
                                                {t('results.exportWithAnswers')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {viewMode === 'cards' ? ( // Cards View Mode
                                <div className="tasks-grid">
                                    {tasks.map((task, index) => (
                                        <article key={index} className="task-card">
                                            <div className="task-card-header">
                                                <div className="task-badge">
                                                    {t('results.problem')} {index + 1}
                                                </div>
                                                <div className="task-type">
                                                    {t("taskType." + task.type) || task.type}
                                                </div>
                                            </div>
                                            <div className="task-text">
                                                {task.text}
                                            </div>
                                            <div className="task-formula">
                                                <Latex expression={task.latex} />
                                            </div>

                                            <details className="task-details">
                                                <summary className="details-toggle">
                                                    {t('results.viewDetails')}
                                                </summary>
                                                <div className="details-content">
                                                    <div className="detail-group">
                                                        <h4 className="detail-label">{t('results.parameters')}</h4>
                                                        <pre className="detail-code">
                                                        {JSON.stringify(task.params, null, 2)}
                                                    </pre>
                                                    </div>
                                                    <div className="detail-group">
                                                        <h4 className="detail-label">{t('results.answer')}</h4>
                                                        <div className="detail-answer">
                                                            {task.answer || t('WIP')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </details>
                                        </article>
                                    ))}
                                </div>
                            ) : ( //Simple View Mode
                                <div className="tasks-simple">
                                    {tasks.map((task, index) => (
                                        <div key={index} className="task-simple-item">
                                            <div className="task-simple-content">
                                                {task.text && <div className="task-simple-text">{index + 1}. {task.text}</div>}
                                                {task.latex && (
                                                    <div className="task-simple-formula">
                                                        <Latex expression={task.latex} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ) : ( // Placeholder
                        <section className="placeholder-section">
                            <div className="placeholder-content">
                                <div className="placeholder-icon">
                                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                        <path d="M32 8V56M8 32H56" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.2"/>
                                        <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="3" opacity="0.2"/>
                                    </svg>
                                </div>
                                <h3 className="placeholder-title">{t('placeholder.title')}</h3>
                                <p className="placeholder-text">
                                    {t('placeholder.text')}
                                </p>
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <p className="footer-text">
                        {t('footer.text')}
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;