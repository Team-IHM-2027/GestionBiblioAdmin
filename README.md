# GestionBiblio — Administration Panel

This repository contains the Administration Panel of the GestionBiblio app suite. It provides the web UI and light server glue used by administrators to manage books, users, loans, settings, and analytics. This README explains the project role, structure, dependencies (external technologies), how to run and build the project, and guidelines for adding features without breaking the established structure.

---

## Table of contents

- Overview
- Role inside the app suite
- Quick start (install, run, build)
- Project structure (top-level + important folders/files)
- Recommended src layout and conventions
- Server layout (what to expect in `server/`)
- Environment variables
- How to add features safely (guidelines)
- Testing / linting / CI / deployment notes
- Full list of external technologies (dependencies & devDependencies)
- Contact / maintainers

---

## Overview

GestionBiblio Admin is a TypeScript + React + Vite application that serves as the administrative interface for the larger GestionBiblio suite. It includes an API server entrypoint (lightweight Express server used for local development / server-side endpoints) as well as the client app. The UI uses TailwindCSS for styling and i18n for translations.

---

## Role inside the app suite

- This repository is the administration panel (back-office) of the larger suite.
- It is intended to be used by librarians/administrators to manage data and get analytics.
- It integrates with other services used by the suite (e.g., Firebase, Cloudinary, email sending) and exposes the needed management functionality.

---

## Quick start

1. Clone the repository
   - git clone https://github.com/Design-IHM/GestionBiblioAdmin.git
2. Install dependencies
   - npm install
3. Local development
   - Frontend dev server: npm run dev
   - Server (local API): npm run server
   - Full development (runs both): npm run dev:full
4. Build
   - npm run build
5. Preview production build locally
   - npm run preview
6. Lint
   - npm run lint

Notes:
- The `server` script points to `server/index.ts`. Ensure environment variables are correctly set (see `.env.example`) before running the server.
- For production running of the server after building, use `npm start` (runs `node dist/server`).

---

## Top-level repository layout

- .env.example — Example environment variables to configure services (never commit secrets).
- .gitignore — Files and folders excluded from git.
- index.html — App HTML entry.
- package.json / package-lock.json — dependencies and scripts.
- postcss.config.js — PostCSS configuration for Tailwind.
- tailwind.config.ts — Tailwind CSS configuration.
- vite.config.js / vite.config.ts — Vite build configuration.
- tsconfig.json / tsconfig.app.json / tsconfig.node.json — TypeScript configurations.
- eslint.config.js — ESLint configuration.
- public/ — Static public assets (favicon, manifest, etc).
- src/ — Client application source (React + TypeScript).

---

## src/ recommended structure and description

The repository already contains a `src/` folder. Follow and maintain this structure when adding new code:

- src/
  - assets/             — images, fonts, static assets required by the app UI
  - components/         — small, reusable UI components (buttons, inputs, form controls)
  - layouts/            — app shells and higher-level layout components (AdminLayout, AuthLayout)
  - pages/              — route pages (Dashboard, Books, Users, Loans, Settings, Login, etc.)
  - routes.tsx             — router configuration and route guards
  - services/           — network/API client abstractions and modules (e.g., axios instances, endpoints)
  - hooks/              — custom React hooks
  - context/            — global state (React Context, query clients, or other state management)
  - i18n/               — translation resources and i18n setup
  - styles/             — Tailwind-related custom CSS, global styles
  - types/              — shared TypeScript types and interfaces
  - utils/              — utility functions (formatters, validators)
  - App.tsx / main.tsx  — app bootstrap and providers (Router, QueryProvider, i18n, Theme, etc.)

Conventions:
- Keep components small and focused. Prefer folder-per-component with `index.tsx`, `styles.css` and `types.ts` if needed.
- Use TypeScript for all new code. Keep types in `src/types/` or next to components when narrow in scope.
- Centralize API calls in `src/services/` — do not scatter axios/fetch code across components.
- Use React Query (present in dependencies) for server state and caching.

---

## Environment variables

- A `.env.example` exists at the repository root. Copy it to `.env` and fill secret credentials before running.
- Typical keys you will find/need:
  - API base URLs, Firebase credentials, Cloudinary credentials, email provider keys, JWT secrets, database URLs.
- Never commit `.env` with secrets.

---

## How to add features safely (guidelines to avoid breaking structure)

1. Branching & PRs
   - Create feature branches: `feature/<short-desc>` or `fix/<short-desc>`.
   - Open PRs and link related tasks; review changes before merging.
2. Type safety
   - Add TypeScript types for public interfaces and API responses.
   - Run `tsc -b` or `npm run build` to ensure type checks pass.
3. Linting & formatting
   - Run `npm run lint` and fix ESLint warnings/errors before merging.
4. Tests (recommended)
   - Add unit/integration tests for new logic. (Testing stack is not included by default — consider adding Jest/Testing Library as needed).
5. API changes
   - Centralize API endpoints in `src/services/`. If changing an endpoint or its shape, update types and all calling clients.
6. UI components
   - Place reusable UI components in `src/components/` and avoid direct DOM/CSS changes outside Tailwind classes.
7. Routes and navigation
   - Keep routing configuration in `src/routes.tsx`. When adding a page, add the route and guard (auth/permission) consistently.
8. Server changes
   - Preserve the server folder structure (routes/controllers/services). Do not mix server-only code into client `src`.
9. Dependencies
   - Prefer adding dependencies with a clear purpose. Document any new platform integrations in README.
   - When upgrading critical dependencies (React, TypeScript, Tailwind, Vite), perform local smoke tests and update types as necessary.
10. Backwards compatibility
    - When changing response payloads, keep compatibility or coordinate with other services that consume the APIs.

---

## Full list of external technologies used (from package.json)

The following are external packages the project depends on. The list includes the package name and a short purpose.

Runtime dependencies (used by the app at runtime):
- axios — HTTP client for API calls
- bcryptjs — Password hashing utility
- cloudinary — Cloudinary SDK (image upload & management)
- emailjs — Sending email from client/server (email integrations)
- firebase — Firebase SDK (auth, database, storage if used)
- i18next — Internationalization framework
- i18next-browser-languagedetector — Detect user language in browser
- i18next-http-backend — Load translations via HTTP
- lucide-react, react-icons — Icon components
- react-i18next — React bindings for i18next
- recharts — Charting library (analytics)
- tailwindcss — Utility first CSS framework
- typescript — TypeScript language

---

## Recommended workflow for adding new dependencies or upgrades

- Add a single dependency per PR and document why it is needed.
- If the package introduces global CSS or post-processing requirements, update `postcss.config.js` / `tailwind.config.ts` accordingly.
- Run the full dev stack (`npm run dev:full`) and smoke test pages that could be affected.

---

## Security and secrets

- Never commit secrets. Use `.env` (gitignored) and keep `.env.example` updated with variable names but not values.
- Validate and sanitize inputs server-side. Use multer carefully and scan uploaded files if needed.
- Rotate keys (Cloudinary, Firebase) regularly and restrict their scopes.

---

## If you are a new contributor: checklist

- Read `.env.example` and ask for necessary service credentials.
- Run `npm install` then `npm run dev:full`.
- Run `npm run lint` and fix any issues.
- Add types for any external data you consume.
- Open a PR and include screenshots for UI changes and notes for backend changes.

---

## Maintainers / Contact

Repository owner: Design-IHM (see GitHub organization/profile)
For questions about environment values or external services (e.g., Firebase, Cloudinary) contact the project maintainer(s) listed in the repository.

---

Thank you for contributing to the Administration Panel. Keep the code modular, typed, and well-documented — that will make it easy to grow the admin app while maintaining stability and interoperability with the rest of the GestionBiblio suite.

# <GI26 />
