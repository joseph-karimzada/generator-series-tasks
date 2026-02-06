import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "page.title": "Series generator - Σ Lab",
            "header.practice": "Practice",
            "header.tasks": "Task Types",
            "header.tasks.link": "https://github.com/joseph-karimzada/generator-series-tasks/blob/master/docs/tasks-description.md",
            "header.about": "About",
            "header.about.link": "https://github.com/joseph-karimzada/generator-series-tasks/blob/master/README.md",
            "logo.subtitle": "series generator",
            "config.title": "Configure Worksheet",
            "config.subtitle": "Design your custom series practice set",
            "config.seed.label": "Random Seed",
            "config.seed.hint": "Generates deterministic tasks",
            "config.seed.placeholder": "Enter seed...",
            "config.taskTypes.title": "Task Types",
            "config.taskTypes.total": "Total",
            "config.taskTypes.task": "task",
            "config.taskTypes.tasks": "tasks",
            "config.generate": "Generate Tasks",
            "config.generating": "Generating...",
            "config.clear": "Clear",
            "config.clearConfirm": "Clear all tasks and reset configuration?",
            "taskCategory.find-sum": "Series Sums",
            "taskCategory.necessary-cond": "Necessary Condition for Convergence",
            "taskType.sum-geometric-progressions": "Geometric Progression",
            "taskType.telescoping-series": "Telescoping Series",
            "taskType.necessary-cond-polynomial-frac-task": "Polynomial Fraction",
            "results.title": "Generated Worksheet",
            "results.problem": "Problem",
            "results.exportWord": "Word",
            "results.exportWithoutAnswers": "Without Answers",
            "results.exportWithAnswers": "With Answers",
            "results.viewDetails": "View Details",
            "results.viewCards": "Card View",
            "results.viewSimple": "Simple View",
            "results.parameters": "Parameters",
            "results.answer": "Answer",
            "placeholder.title": "No Tasks Generated Yet",
            "placeholder.text": "Configure your task types and click \"Generate Tasks\" to create your worksheet",
            "footer.text": "Built with mathematics and precision",
            "WIP": "Work In Progress"
        }
    },
    ru: {
        translation: {
            "page.title": "Генератор рядов - Σ Lab",
            "header.practice": "Практика",
            "header.tasks": "Типы Задач",
            "header.tasks.link": "https://github.com/joseph-karimzada/generator-series-tasks/blob/master/docs/tasks-description-ru.md",
            "header.about": "О проекте",
            "header.about.link": "https://github.com/joseph-karimzada/generator-series-tasks/blob/master/README-RU.md",
            "logo.subtitle": "генератор рядов",
            "config.title": "Настроить Задания",
            "config.subtitle": "Создайте свой набор задач по рядам",
            "config.seed.label": "Сид Рандома",
            "config.seed.hint": "Генерирует детерминированные задачи",
            "config.seed.placeholder": "Введите сид...",
            "config.taskTypes.title": "Типы Задач",
            "config.taskTypes.total": "Всего",
            "config.taskTypes.task": "задача",
            "config.taskTypes.tasks": "зад.",
            "config.generate": "Сгенерировать Задачи",
            "config.generating": "Генерация...",
            "config.clear": "Очистить",
            "config.clearConfirm": "Очистить все задачи и сбросить настройки?",
            "taskCategory.find-sum": "Суммы Ряда",
            "taskCategory.necessary-cond": "Необходимый Признак Сходимости",
            "taskType.sum-geometric-progressions": "Геометрическая Прогрессия",
            "taskType.telescoping-series": "Телескопический Ряд",
            "taskType.necessary-cond-polynomial-frac-task": "Дробь с Многочленами",
            "results.title": "Сгенерированные Задания",
            "results.problem": "Задача",
            "results.exportWord": "Word",
            "results.exportWithoutAnswers": "Без Ответов",
            "results.exportWithAnswers": "С Ответами",
            "results.viewDetails": "Показать Детали",
            "results.viewCards": "Карточки",
            "results.viewSimple": "Упрощенный Вид",
            "results.parameters": "Параметры",
            "results.answer": "Ответ",
            "placeholder.title": "Задачи Еще Не Сгенерированы",
            "placeholder.text": "Настройте типы задач и нажмите \"Сгенерировать Задачи\", чтобы создать задания",
            "footer.text": "Создано с математической точностью",
            "WIP": "В Разработке"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('language') || detectLanguage(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

// Detect user's language based on location/browser settings
function detectLanguage() {
    // Try to get browser language
    const browserLang = navigator.language || navigator.userLanguage;

    // Check if browser language starts with 'ru' (ru, ru-RU, etc.)
    if (browserLang.toLowerCase().startsWith('ru')) {
        return 'ru';
    }

    // Try to detect timezone (Russia has multiple timezones)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const russianTimezones = [
        'Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Samara',
        'Europe/Volgograd', 'Asia/Yekaterinburg', 'Asia/Omsk',
        'Asia/Novosibirsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk',
        'Asia/Yakutsk', 'Asia/Vladivostok', 'Asia/Magadan',
        'Asia/Kamchatka', 'Asia/Anadyr'
    ];

    if (russianTimezones.includes(timezone)) {
        return 'ru';
    }

    // Default to English
    return 'en';
}

export default i18n;