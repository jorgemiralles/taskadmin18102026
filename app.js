/* Task Management CRUD — static SPA, localStorage persistence. */

/* ---------- Storage module (single source of truth, spec §3) ---------- */

const STORAGE_KEY = "tasks";

/* Stored ids may be numbers or legacy strings — compare as strings. */
function sameId(a, b) {
  return String(a) === String(b);
}

const TaskStore = {
  listTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  getTask(id) {
    return this.listTasks().find((t) => sameId(t.id, id)) || null;
  },

  createTask(title) {
    const trimmed = (title || "").trim();
    if (!trimmed) return { ok: false, error: "Title is required" };

    const tasks = this.listTasks();
    const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    const task = {
      id: nextId,
      title: trimmed,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return { ok: true, task };
  },

  updateTask(id, title) {
    const trimmed = (title || "").trim();
    if (!trimmed) return { ok: false, error: "Title is required" };

    const tasks = this.listTasks();
    const task = tasks.find((t) => sameId(t.id, id));
    if (!task) return { ok: false, error: "Task not found" };

    task.title = trimmed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return { ok: true, task };
  },

  deleteTask(id) {
    const tasks = this.listTasks().filter((t) => !sameId(t.id, id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },
};

/* ---------- Small DOM helpers ---------- */

const app = document.getElementById("app");

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.append(child.nodeType ? child : document.createTextNode(child));
  }
  return node;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* ---------- Views (spec §4) ---------- */

function listView() {
  const tasks = TaskStore.listTasks();

  const list = tasks.length
    ? el(
        "ul",
        { class: "task-list" },
        tasks.map((task) =>
          el("li", {}, [
            el("a", { href: `#/tasks/${encodeURIComponent(task.id)}` }, task.title),
          ])
        )
      )
    : el("p", { class: "empty-state" }, "You have no tasks yet");

  return el("div", { class: "card" }, [
    el("h1", {}, "My Tasks"),
    list,
    el("div", { class: "actions" }, [
      el("a", { class: "btn", href: "#/new" }, "New Task"),
    ]),
  ]);
}

function formView({ title, initialTitle, onSave }) {
  const error = el("p", { class: "error" });
  const input = el("input", {
    type: "text",
    id: "task-title",
    maxlength: "200",
    placeholder: "What needs to be done?",
    value: initialTitle || "",
  });

  const submit = (event) => {
    event.preventDefault();
    const result = onSave(input.value);
    if (!result.ok) {
      error.textContent = result.error;
      input.focus();
      return;
    }
    location.hash = "#/";
  };

  return el("div", { class: "card" }, [
    el("h1", {}, title),
    el("form", { onsubmit: submit }, [
      el("label", { for: "task-title" }, "Title"),
      input,
      error,
      el("div", { class: "actions" }, [
        el("button", { type: "submit" }, "Save"),
        el("a", { class: "btn secondary", href: "#/" }, "Cancel"),
      ]),
    ]),
  ]);
}

function newTaskView() {
  return formView({
    title: "New Task",
    onSave: (title) => TaskStore.createTask(title),
  });
}

function detailView(id) {
  const task = TaskStore.getTask(id);
  if (!task) return notFoundView();

  return el("div", { class: "card" }, [
    el("h1", { class: "detail-title" }, task.title),
    el(
      "p",
      { class: "detail-meta" },
      `Created ${new Date(task.createdAt).toLocaleString()}`
    ),
    el("div", { class: "actions" }, [
      el("a", { class: "btn", href: `#/tasks/${encodeURIComponent(task.id)}/edit` }, "Edit"),
      el("button", { class: "danger", onclick: () => confirmDelete(task) }, "Delete"),
    ]),
  ]);
}

function editTaskView(id) {
  const task = TaskStore.getTask(id);
  if (!task) return notFoundView();

  return formView({
    title: "Edit Task",
    initialTitle: task.title,
    onSave: (title) => TaskStore.updateTask(task.id, title),
  });
}

function notFoundView() {
  return el("div", { class: "card" }, [
    el("h1", {}, "Task not found"),
    el("div", { class: "actions" }, [
      el("a", { class: "btn", href: "#/" }, "Back to My Tasks"),
    ]),
  ]);
}

function confirmDelete(task) {
  if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
    TaskStore.deleteTask(task.id);
    location.hash = "#/";
  }
}

/* ---------- Router (spec §4.1) ---------- */

function route() {
  const hash = location.hash || "#/";
  let match;

  if (hash === "#/" || hash === "#") {
    app.replaceChildren(listView());
  } else if (hash === "#/new") {
    app.replaceChildren(newTaskView());
  } else if ((match = hash.match(/^#\/tasks\/([^/]+)\/edit$/))) {
    app.replaceChildren(editTaskView(decodeURIComponent(match[1])));
  } else if ((match = hash.match(/^#\/tasks\/([^/]+)$/))) {
    app.replaceChildren(detailView(decodeURIComponent(match[1])));
  } else {
    app.replaceChildren(notFoundView());
  }

  const heading = app.querySelector("h1");
  if (heading) heading.setAttribute("tabindex", "-1");
}

window.addEventListener("hashchange", route);
route();
