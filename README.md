# 📝 Modular To-Do App  

👉 Live Demo: https://sushantshinde7.github.io/modular-todo-js/  
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=flat)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=flat)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat)
![Status](https://img.shields.io/badge/Status-Active-brightgreen&style=flat)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white&style=flat)
![License](https://img.shields.io/badge/License-MIT-blue&style=flat)


> “Now a full PWA — fast, installable, offline-ready, and built with clean modular JavaScript.”

A sleek, responsive, and customizable To-Do List web app built using modular JavaScript (ES Modules), HTML, and CSS.


## 🎥 Preview 

![To‑Do App Demo](./assets/Todo-app-Demo.gif)


## 📌 Features

| Feature | Description |
|----------|-------------|
| ✅ Add, edit, delete, pin | Full task control with smooth animations |
| 🔢 Auto numbering | Tasks are numbered and re-ordered on pin |
| 🌗 Theme switcher | Light/Dark mode with saved preference |
| 🎨 Color themes (FAB) | Pick background colors per mode |
| 💡 Dark mode colors | Custom hues for better contrast |
| 🌈 Color persistence | Remembers colors for each theme |
| ✨ FAB highlight | Shows the active color with animation |
| 🧼 Empty state | Illustrated view when no tasks exist |
| 🧠 Motivational quotes | Rotates quotes when 1–3 tasks exist |
| 🎭 Quote transitions | Smooth fade between quotes |
| 🔄 Task animations | Add, edit, pin/unpin, and clear-all |
| 🔔 Toast notifications | Instant feedback on actions |
| 💾 LocalStorage | Saves tasks and settings locally |
| ⚡ Offline alert | Detects lost connection temporarily |
| 📱 Responsive | Works across all devices |
| ♿ Accessibility | Keyboard shortcuts and ARIA labels |
| 🎨 Lucide icons | Clean, lightweight icon set |
| 🧩 Modular JS logic | Readable and scalable codebase |
| 📱 PWA Support | Installable on any device with offline mode and smart caching |
| 🔍 Task Filters | Filter tasks by All, Pending, Completed, or Pinned |
| 🖼️ Improved Empty States | New light/dark SVGs for no-task and no-pending views |
| 🎨 Dynamic Color Tooltip | Live accent-color preview for both themes |
| 🖱️ Themed Scrollbar | Scrollbar thumb adapts to your selected color |
| ✨ Enhanced Micro-Animations | Smoother CRUD and pin/unpin animations |



🚀 Getting Started
- Clone the repository 
- git clone https://github.com/sushantshinde7/To-Do-App.git 


📂 Open in your browser
- Option 1: Just open index.html in your browser.  
- Option 2: Use the Live Server extension in VS Code for auto-refresh while editing. 

 
🗂️ Project Structure
```
todo-modules-app/
├── .github/
│   └── workflows/
│       └── deploy.yml            → GitHub Pages deployment workflow
│
├── assets/
│   ├── icons/                    → Empty-state SVGs (light/dark variants)
│   │   ├── no-completed-dark.svg
│   │   ├── no-completed-light.svg
│   │   ├── no-pending-dark.svg
│   │   ├── no-pending-light.svg
│   │   ├── no-pinned-dark.svg
│   │   ├── no-pinned-light.svg
│   │   ├── no-task-dark.svg
│   │   ├── no-task-light.svg
│   │   └── no-tasks.svg
│   │
│   └── Todo-app-Demo.gif         → App demo preview
│
├── dom.js                        → DOM rendering & UI updates
├── favicon.ico                   → App icon
├── index.html                    → Main HTML structure
├── main.js                       → App bootstrap / initialization
├── manifest.json                 → PWA manifest (icons, theme, install config)
├── README.md                     → Project documentation
├── service-worker.js             → Offline caching + update logic (PWA)
├── styles.css                    → Main stylesheet (themes, layout, UI)
├── sw-register.js                → Registers service worker & update banner
└── todo.js                       → Core task logic (add/edit/delete/pin/filter)


```


🛠 Tech Stack

![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white&style=flat)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white&style=flat)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat)
![ES6 Modules](https://img.shields.io/badge/-ES6%20Modules-323330?logo=javascript&logoColor=yellow&style=flat)
![LocalStorage](https://img.shields.io/badge/-LocalStorage-FFA500?style=flat)
![Lucide Icons](https://img.shields.io/badge/-Lucide%20Icons-7E5BEF?style=flat)
> Developed using HTML5 for structure, CSS3 for styling and responsiveness, and modular JavaScript (ES6+) for clean logic. Tasks persist via LocalStorage, with a modern UI enhanced by Lucide Icons.

## 🆕 What's New
- Full PWA support with offline caching, install prompt & update banner  
- Brand-new task filtering (All / Pending / Completed / Pinned)  
- New empty-state illustrations for light & dark themes  
- Dynamic theme-color tooltip with live preview  
- Improved animations for CRUD actions and pin/unpin  
- Theme-adaptive scrollbar styling  

📐 UI & UX Highlights
- Smooth task animations for add, delete, edit, pin, and clear actions.
- Animated theme toggle with neon/pastel transitions.
- Empty-state illustration and motivational quote banners for better user engagement.
- Minimalist, accessible design with keyboard navigation and screen reader support.

## 👤 Author
**Sushant Shinde**  
[![GitHub](https://img.shields.io/badge/GitHub-@sushantshinde7-181717?logo=github)](https://github.com/sushantshinde7)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-@sushantshinde7-0077B5?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sushantshinde7/)

## 📄 License
This project is licensed under the [MIT License](LICENSE).

📬 Have suggestions? Open an issue or share feedback!
---
⭐ If you like this project, consider giving it a star — it motivates me to keep improving!


