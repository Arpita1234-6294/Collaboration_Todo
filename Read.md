# Collaborative Real-Time To-Do Board

A full-stack collaborative Kanban board application where multiple users can register, log in, and manage tasks together in real time. Users can create tasks, drag and drop them across Todo, In Progress, and Done columns, assign tasks to team members using smart logic, and see all changes instantly thanks to WebSocket-powered live sync. Every action is logged and visible in a real-time activity feed, with built-in conflict detection and resolution if two users edit the same task simultaneously.

## Tech Stack

- **Node.js:** JavaScript runtime for building fast, scalable server-side logic.
- **Express.js:** Minimalist web framework to handle routing and REST APIs for auth, tasks, and logs.
- **MongoDB:** NoSQL database to store users, tasks, and action logs securely.
- **React:** Component-based frontend for building an interactive Kanban board UI.
- **Socket.IO:** Real-time bi-directional communication so all users see updates instantly.
