# Join – Issue Collector

Join is a vanilla JavaScript/HTML/CSS Kanban board (login, board with drag & drop, contacts, task details, summary dashboard) built on Firebase (Realtime Database + Authentication).

This repository extends the existing board with an **AI-powered issue collector**: stakeholders will be able to submit feature requests and bug reports by email. An n8n workflow analyzes the email content, classifies and prioritizes it, and creates the ticket automatically in a dedicated "Triage" column on the board — with a clear, demoable AI logic end to end.

> **Status:** the base Kanban board is implemented. The email/AI pipeline (n8n workflow, Triage column, stakeholder landing page, throttling) is in progress — see open items below.

## Tech Stack

- Vanilla JavaScript, HTML5, CSS3 — no frameworks, no build step
- Firebase Realtime Database & Authentication
- n8n (planned) for the email-to-ticket automation

## Getting Started (Demo Usage)

### 1. Firebase project

The app needs its own Firebase project (Realtime Database + Authentication, with Anonymous sign-in enabled).

1. Copy `js/firebaseAuth.example.js` to `js/firebaseAuth.js`.
2. Fill in your Firebase project's config values (Firebase Console → Project Settings → General → Your apps).
3. Set the Realtime Database rules so `contacts`, `tasks` and `users/$uid` require `auth != null` (see the rules already used in this project's Firebase console for the exact shape).

`js/firebaseAuth.js` is gitignored — it is never committed, so every developer/demo instance uses its own project.

### 2. Run locally

The app uses native ES modules (`<script type="module">`), which browsers only load over `http://`, not via `file://`. Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8000
```

or the VS Code "Live Server" extension. Then open `http://localhost:8000/index.html`.

### 3. Seed demo data

Open `seedDatabase.html` in the browser (served the same way as above). It signs in anonymously and lets you upload sample tasks/contacts to your Firebase project with one click — no manual data entry needed for a demo.

## Project Structure

- `index.html`, `js/authService.js` – login & signup
- `board.html`, `js/board.js`, `js/boardTask.js` – Kanban board with drag & drop
- `addtask.html`, `js/addTask.js` – task creation
- `contacts.html`, `js/contact.js` – contact management
- `summary.html`, `js/summary.js` – dashboard overview
- `seedDatabase.html` – standalone demo data seeder
- `js/database.js` – thin Firebase Realtime Database wrapper (`loadData`/`postData`/`putData`/`deleteData`)

## License

See [LICENCE](LICENCE).
