# ΣLab - Mathematical Series Task Generator

A web-based application for generating customizable mathematical series practice problems with deterministic seeding and multi-language support.

## 🎯 Overview

ΣLab is an educational tool designed to help students practice various types of mathematical series problems. Teachers can generate consistent problem sets using seeds, while students can work through different series types including geometric progressions, telescoping series, and polynomial fractions.

## ✨ Features

### Core Functionality
- **Deterministic Generation**: Use seeds to generate reproducible problem sets
- **Multiple Task Types**:
  - Geometric Progressions
  - Telescoping Series
  - Polynomial Fractions (with Parameter system for complex math objects)
- **Customizable Worksheets**: Choose quantity of each task type
- **Multi-Language Support**: English and Russian with automatic detection
- **Persistent State**: Auto-save configuration and generated tasks using localStorage
- **Multiple View Modes**:
  - Card View: Rich, interactive problem cards with expandable details
  - Simple View: Clean, document-style layout perfect for printing
- **Export Functionality**: Export worksheets to Word format (with/without answers)

### Technical Features
- Professional LaTeX rendering using KaTeX
- Responsive design (desktop and mobile)
- Modular architecture with skill-based task generation
- RESTful API backend
- Seeded random number generation for reproducibility
- Exact fractional arithmetic for precise answers

## 🛠️ Technology Stack

### Frontend
- **React** (v18+) - UI framework
- **Vite** - Build tool and dev server
- **KaTeX** - LaTeX math rendering
- **i18next** - Internationalization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Pandoc** - Document conversion (LaTeX to Word)

### Task Generation Engine
- Custom parameter system supporting:
  - Numbers
  - Fractions (exact arithmetic)
  - Polynomials
  - Arrays and complex objects
- Template-based task generation with JSON configuration
- Constraint validation system
- Deterministic RNG using seeded PCG algorithm

## 📁 Project Structure

```
generator-series-tasks/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express API server
│   │   ├── filters/               # Pandoc filters
│   │   │   └── pagebreak.lua      # Page break filter for Word export
│   │   └── temp/                  # Temporary files (auto-created)
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── index.html             # Entry HTML with meta tags
│   │   └── logo.svg               # ΣLab logo
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── LanguageSwitcher.css
│   │   ├── config/                # Configuration files
│   │   │   ├── i18n.js            # Internationalization config
│   │   │   └── taskTypes.js       # Task type definitions
│   │   ├── hooks/                 # Custom React hooks
│   │   │   └── useDocumentTitle.js
│   │   ├── App.jsx                # Main application component
│   │   ├── App.css                # Application styles
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── vite.config.js
│   └── package.json
│
├── task-engine/                   # Core task generation system
│   ├── src/
│   │   ├── core/                  # Base classes
│   │   │   ├── Task.js            # Base task class
│   │   │   ├── TaskFactory.js     # Task factory pattern
│   │   │   ├── Parameter.js       # Abstract parameter class
│   │   │   └── ParameterFactory.js
│   │   ├── parameters/            # Parameter implementations
│   │   │   ├── NumberParameter.js
│   │   │   ├── ChoiceParameter.js
│   │   │   └── PolynomialParameter.js
│   │   ├── templates/             # JSON task templates
│   │   │   ├── sumOfGeometricProgressions.json
│   │   │   ├── telescopingSeries.json
│   │   │   └── NecessaryConditionPolynomialFractionTask.json
│   │   ├── utils/                 # Utility functions
│   │   │   ├── random.js          # Seeded RNG (PCG algorithm)
│   │   │   ├── Fraction.js        # Exact fraction arithmetic
│   │   │   └── latexHelpers.js    # LaTeX utilities
│   │   └── index.js
│   └── package.json
│
├── docs/                          # Documentation
│   ├── tasks-description.md       # Task types documentation (EN)
│   └── tasks-description-ru.md    # Task types documentation (RU)
│
├── shared/                        # Shared utilities (optional)
├── scripts/                       # Build/deployment scripts (optional)
└── package.json                   # Root package.json (workspace)
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Pandoc (for export functionality)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/joseph-karimzada/generator-series-tasks.git
cd generator-series-tasks
```

2. **Install dependencies**
```bash
# Install all workspace dependencies from root
npm install

# Or install individually:
cd backend && npm install
cd ../frontend && npm install
cd ../task-engine && npm install
```

3. **Install Pandoc** (for document export)
```bash
# Ubuntu/Debian
sudo apt-get install pandoc texlive-latex-base texlive-fonts-recommended

# macOS
brew install pandoc

# Windows
# Download from https://pandoc.org/installing.html
```

4. **Start the development servers**

```bash
# Terminal 1 - Backend (from project root)
node backend/src/server.js
# Runs on http://localhost:3001

# Terminal 2 - Frontend
cd frontend
npm run dev
# Runs on http://localhost:5173
```

5. **Open in browser**
Navigate to `http://localhost:5173`

## 📖 Usage Guide

### Generating Tasks

1. **Enter a Seed**: Any string that determines the random generation
2. **Select Task Types**: Use +/- buttons to choose how many of each type
3. **Click "Generate Tasks"**: Creates your custom worksheet
4. **View Results**: Toggle between card and simple view

### Exporting Worksheets

1. Click the **Export to Word** button
2. Choose:
   - **Without Answers**: Problem set only
   - **With Answers**: Includes answer key on separate page
3. Document downloads as `.docx` file

### Multi-Language Support

- Click **EN/RU** in the header to switch languages
- Language is auto-detected based on browser/timezone
- Preference is saved in localStorage

## 🎨 Configuration

### Adding New Task Types

1. **Create a template** in `task-engine/src/templates/`:
```json
{
  "name": "my-new-task",
  "params": {
    "a": { "type": "int", "min": 1, "max": 10 },
    "b": { "type": "int", "min": 1, "max": 10 }
  },
  "constraints": [
    { "code": "a < b", "params": ["a", "b"] }
  ],
  "latex": "\\displaystyle\\sum_{n=${a}}^{${b}} n",
  "answer": "((b - a + 1) * (a + b)) / 2"
}
```

2. **Register in TaskFactory**: Templates are auto-loaded from the templates directory

3. **Add to frontend** in `src/config/taskTypes.js`

### Customizing Styles

Edit `frontend/src/App.css` - CSS variables at the top:
```css
:root {
  --color-primary: #2563eb;
  --color-accent: #d97706;
  --font-display: 'Libre Baskerville', Georgia, serif;
  --font-body: 'IBM Plex Sans', sans-serif;
}
```

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Task engine tests
cd task-engine
npm test
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

## 📝 API Documentation

### POST `/api/generate`
Generate tasks based on seed and order.

**Request:**
```json
{
  "seed": "string",
  "order": ["task-type-1", "task-type-2", ...],
  "language": "en" | "ru"
}
```

**Response:**
```json
{
  "tasks": [
    {
      "type": "geometric-progression",
      "text": "Calculate the sum...",
      "latex": "\\sum_{n=1}^{10} 2^n",
      "params": { "a": 2, "n": 10 },
      "answer": "2046"
    }
  ]
}
```

### POST `/api/export`
Export worksheet to Word format.

**Request:**
```json
{
  "tasks": [...],
  "seed": "string",
  "includeAnswers": boolean,
  "taskTypeLabels": {...},
  "language": "en" | "ru"
}
```

**Response:** Binary `.docx` file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Yusif Karimzada** 
- **Anastasia Artamonova**
