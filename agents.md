# Agents

## Project

This repository contains a **Task Management CRUD** application — a simple to-do manager that lets users create, view, update, and delete tasks.

- **Acceptance criteria:** Gherkin feature file at `specs/start/taskadmin.feature`
- **Technical specification:** `specs/start/spec.md`

### Key technical decisions

- **Architecture:** static single-page app — plain HTML, CSS, and JavaScript. No backend server, no API.
- **Persistence:** browser `localStorage` only. Single key `tasks` holding a JSON array of `{ "id", "title", "createdAt" }`. Deletion is a hard delete.
- **Storage access:** all reads/writes go through a small storage module (`listTasks`, `getTask`, `createTask`, `updateTask`, `deleteTask`); it is the single source of truth.
- **Validation:** `title` is required and non-empty after trimming; show an inline error and persist nothing on failure.
- **Routing:** hash-based client-side views: `#/` (list), `#/new`, `#/tasks/{id}`, `#/tasks/{id}/edit`.
- **Scope:** no authentication, no task descriptions/due dates/priorities, no filtering or pagination.

## Running the app

The app is fully static, so serve the repository root with `darkhttpd` (already installed):

```sh
darkhttpd . --port 8080
```

Then open <http://localhost:8080> in a browser. Routing is hash-based (`#/`, `#/new`, ...), so no server-side rewrites are needed.

## Environment

- **Operating System:** Alpine Linux v3.24 (kernel: Linux 6.18.54.1-microsoft-standard-WSL2, x86_64)
- **Package Manager:** `apk` (Alpine Package Keeper)

### Installing packages

```sh
apk update
apk add <package>
```

### Shells

Available login shells (from `/etc/shells`):

- `/bin/sh` — BusyBox ash (symlink to `/bin/busybox`, the default shell)
- `/bin/ash` — BusyBox ash (symlink to `/bin/busybox`)
- `/bin/bash` — GNU bash (installed at `/bin/bash`)
