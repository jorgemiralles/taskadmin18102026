# Technical Specification: Task Management CRUD

Derived from `specs/start/taskadmin.feature` (branch: `feature/technical-spec`).

## 1. Overview

A simple web-based to-do manager. The application exposes four core use cases:

| # | Use Case   | Feature tag      |
|---|------------|------------------|
| 1 | Create     | `@create @crud`  |
| 2 | View       | `@view @crud`    |
| 3 | Update     | `@update @crud`  |
| 4 | Delete     | `@delete @crud`  |

There is no authentication; the app manages a single flat list of tasks. The only required field is the task **title**.

## 2. Data Model

### Entity: `Task`

| Field     | Type         | Constraints                         |
|-----------|--------------|-------------------------------------|
| `id`      | integer      | Unique; new ids = max existing id + 1 |
| `title`   | string(200)  | Required, non-empty, trimmed        |
| `createdAt` | datetime   | ISO 8601 string, set on creation    |

Deletion is **hard delete**: the task is removed permanently (no soft-delete/archive flag).

## 3. Storage Design (localStorage)

There is no server or API. All data lives in the browser's `localStorage`.

- **Key:** `tasks`
- **Value:** JSON array of task objects, e.g.
  ```json
  [
    { "id": 1, "title": "Buy groceries", "createdAt": "2026-10-18T12:00:00Z" }
  ]
  ```

### Access layer

A small storage module wraps `localStorage` and is the single source of truth:

| Function            | Behavior |
|---------------------|----------|
| `listTasks()`       | Parse and return the array; return `[]` if the key is missing or corrupt. |
| `getTask(id)`       | Return the task with the given `id`, or `null`. |
| `createTask(title)` | Validate, assign `id` (max existing id + 1) and `createdAt`, append, persist. |
| `updateTask(id, title)` | Validate, replace `title`, persist. No-op if `id` not found. |
| `deleteTask(id)`    | Filter out the task and persist. |

### Validation rules

- `title` is required and must be non-empty after trimming whitespace → show an inline "Title is required" message and persist nothing.
- `id` collisions are avoided by deriving new ids from the current max id.

## 4. User Interface

### 4.1 Routes / Views

A single-page app; views are switched client-side (hash-based routing, e.g. `#/`, `#/new`, `#/tasks/{id}`, `#/tasks/{id}/edit`).

| Route / View        | Behavior |
|---------------------|----------|
| `#/` **My Tasks**   | Lists all tasks from `listTasks()`; shows "New Task" button. Empty list renders a friendly empty state. |
| `#/new` **New Task**| Form with a single `title` input and a "Save" button. |
| `#/tasks/{id}` **Task Detail** | Shows the task title plus "Edit" and "Delete" buttons. |
| `#/tasks/{id}/edit` **Edit Task** | Form pre-filled with the current title and a "Save" button. |

### 4.2 UI behavior per scenario

1. **Create** — "New Task" button on *My Tasks* opens the new-task view. On successful save, call `createTask(title)`, return to *My Tasks* where the new task appears in the list.
2. **View** — Clicking a task title on *My Tasks* navigates to its detail view, displaying that task via `getTask(id)`.
3. **Update** — "Edit" on the detail view opens the edit form. On save, call `updateTask(id, title)` and return to the list showing the updated title.
4. **Delete** — "Delete" on the detail view prompts a confirmation ("Are you sure?"). On confirm, call `deleteTask(id)` and return to the list with the task removed. On cancel, no change.

## 5. Technical Approach

- **Architecture:** static single-page app — plain HTML, CSS, and JavaScript; no backend server or API calls.
- **Persistence:** browser `localStorage` behind the storage module in §3.
- **Routing:** hash-based client-side routing (§4.1).

## 6. Acceptance Traceability

| Feature scenario   | Storage covered (§3) | UI covered (§4.2) |
|--------------------|----------------------|--------------------|
| Create a task      | `createTask`         | 1 |
| View a task        | `getTask`            | 2 |
| Update a task      | `updateTask`         | 3 |
| Delete a task      | `deleteTask`         | 4 |

## 7. Out of Scope (current iteration)

- Authentication / multiple users
- Task descriptions, due dates, priorities, and statuses
- Filtering, sorting, pagination, and search
- Soft delete / task archiving
