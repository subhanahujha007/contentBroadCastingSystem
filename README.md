# Content Broadcasting System Frontend

A React frontend for an educational content broadcasting workflow. Teachers upload scheduled subject content, principals approve or reject it, and students can view the active broadcast from a public live page.

## Tech Stack

- React.js with Create React App
- React Router for protected and public routes
- React Hook Form and Zod for form validation
- Axios-ready service layer with a mock localStorage backend
- Tailwind CSS utility classes with small reusable component classes
- Sonner toasts and Lucide icons

## Setup

```bash
npm install
npm start
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Demo Accounts

- Principal: `principal@school.com` / `password123`
- Teacher: `teacher@school.com` / `password123`
- Teacher 2: `teacher2@school.com` / `password123`

## Routes

- `/login` - authentication page
- `/teacher/dashboard` - teacher summary
- `/teacher/upload` - content upload and scheduling form
- `/teacher/content` - teacher content status list
- `/principal/dashboard` - school-wide summary
- `/principal/approvals` - pending approval workflow
- `/principal/content` - searchable and paginated content archive
- `/live/:teacherId` - public student broadcast page, for example `/live/teacher-1`

## API Layer

All data access goes through `src/services`. The current implementation uses localStorage and simulated latency so the UI can be evaluated without a backend. To connect MongoDB, add an API server and replace the service methods with real HTTP calls through `apiClient`; the pages and components do not call APIs directly.
