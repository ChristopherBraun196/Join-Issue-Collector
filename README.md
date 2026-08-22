# Join – Issue Collector

Join is a vanilla JavaScript/HTML/CSS Kanban board (login, board with drag & drop, contacts, task details, summary dashboard) built on Firebase (Realtime Database + Authentication).

This repository extends the existing board with an **AI-powered issue collector**: stakeholders submit feature requests and bug reports by email, an n8n workflow analyzes the email content with Google Gemini, classifies and prioritizes it, and creates the ticket automatically in a dedicated "Triage" column on the board — with a clear, demoable AI logic end to end.

> **Status:** complete. Base Kanban board, stakeholder landing page, and the full email/AI pipeline (n8n workflow, Triage column, daily throttling, error handling, status-change notifications) are all implemented and tested end to end.

## Tech Stack

- Vanilla JavaScript, HTML5, CSS3 — no frameworks, no build step
- Firebase Realtime Database & Authentication
- n8n for the email-to-ticket automation (IMAP trigger, Google Gemini for classification, SMTP for notifications)

## Getting Started (Demo Usage)

### 1. Firebase project

The app needs its own Firebase project (Realtime Database + Authentication).

1. Copy `js/firebaseAuth.example.js` to `js/firebaseAuth.js`.
2. Fill in your Firebase project's config values (Firebase Console → Project Settings → General → Your apps).
3. Under **Authentication → Sign-in method**, enable both **Anonymous** (used for guest/board access and by the n8n workflow) and **Email/Password** (used by `index.html`'s signup/login) — both must be turned on explicitly, neither is enabled by default on a fresh Firebase project.
4. Set the Realtime Database rules so `contacts`, `tasks` and `users/$uid` require `auth != null` (see the rules already used in this project's Firebase console for the exact shape). Additionally add a narrowly-scoped public-read rule for `emailRequestCount/$date` (used by `stakeholder.html` to show the daily counter without exposing the full `tasks` tree).

`js/firebaseAuth.js` is gitignored — it is never committed, so every developer/demo instance uses its own project.

### 2. Run locally

The app uses native ES modules (`<script type="module">`), which browsers only load over `http://`, not via `file://`. Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8000
```

or the VS Code "Live Server" extension. Then open `http://localhost:8000/welcome.html` (or `index.html` directly for the login/signup screen).

### 3. Seed demo data

Open `seedDatabase.html` in the browser (served the same way as above). It signs in anonymously and lets you upload sample tasks/contacts to your Firebase project with one click — no manual data entry needed for a demo.

### 4. n8n email pipeline

The two workflows are exported at `n8n/issue-collector-workflow.json` and `n8n/status-change-notifications-workflow.json`.

1. Run n8n (e.g. via Docker: `docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n`) and open it at `http://localhost:5678`.
2. Import both workflow files (Workflows → Import from File).
3. In both imported workflows, replace `YOUR_FIREBASE_API_KEY` in the "Sign In Anonymously" node URL(s) with your Firebase project's Web API key (Firebase Console → Project Settings → General → Web API Key).
4. Set up three credentials in n8n and assign them to the matching nodes:
   - **IMAP** — the dedicated inbox that receives stakeholder emails (used by "Email Trigger (IMAP)" and the "MoveEmail..." nodes, which need the `n8n-nodes-imap` community node installed).
   - **SMTP** — for sending confirmation/limit/error/status-update emails.
   - **Google Gemini (PaLM) API** — for the "Google Gemini Chat Model" node that classifies incoming emails.
5. Publish both workflows.

Once set up, sending an email to the configured inbox creates a ticket in the board's "Triage" column within seconds (subject/body → AI-classified category, title, priority, deadline), moves the email to the "erledigt" IMAP folder, and sends the sender a confirmation email. Errors or a reached daily limit (10 emails/day) route to the "zu bearbeiten" folder with a distinct notice email instead.

## Demo Flow

1. Open `welcome.html` — choose "Feature Request stellen" (stakeholder) or "Als Teammitglied" (login/signup via `index.html`).
2. As a stakeholder: `stakeholder.html` shows the submission email address and the live daily-request counter, with a "limit reached" state once 10 requests have come in for the day.
3. Send a test email to the configured inbox — watch it appear as a new ticket in the board's Triage column, tagged "✨ Ai-generated ticket" with an "🌐 Extern" creator badge and the sender's name/email.
4. Move the ticket to another column — the original sender gets a status-update email (handled by the separate "Status Change Notifications" workflow, polling every 5 minutes).

## Project Structure

- `welcome.html`, `stakeholder.html`, `js/stakeholder.js` – public stakeholder-facing landing pages (role selection, feature-request submission info)
- `index.html`, `js/authService.js` – login & signup
- `js/authGuard.js` – route guarding/redirects based on Firebase auth state (anonymous/authenticated/unauthenticated)
- `board.html`, `js/board.js`, `js/boardTask.js` – Kanban board with drag & drop
- `addtask.html`, `js/addTask.js` – task creation
- `contacts.html`, `js/contact.js` – contact management
- `summary.html`, `js/summary.js` – dashboard overview
- `seedDatabase.html` – standalone demo data seeder
- `js/database.js` – thin Firebase Realtime Database wrapper (`loadData`/`postData`/`putData`/`deleteData`)
- `n8n/` – exported n8n workflow JSON (email pipeline + status-change notifications)
- `docs/` – JSDoc-generated API documentation for the JS files above, open `docs/index.html` in a browser to browse it

## License

See [LICENCE](LICENCE).
