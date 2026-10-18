# Agents

## Project

This repository contains a **Task Management CRUD** application — a simple to-do manager that lets users create, view, update, and delete tasks.

Acceptance criteria are written as Gherkin feature files in `specs/` (see `specs/start/taskadmin.feature`), and are developed on the `feature/task-management-crud` branch.

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
