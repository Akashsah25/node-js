import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../utils/api.js";

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="todoCard"
    >
      <button
        className={`check ${todo.completed ? "done" : ""}`}
        onClick={() => onToggle(todo)}
        type="button"
        aria-label="toggle completed"
      />
      <div className="todoBody">
        <div className="todoTitleRow">
          <div className={`todoTitle ${todo.completed ? "strike" : ""}`}>
            {todo.title}
          </div>
          <div className="todoActions">
            <button
              className="iconBtn"
              type="button"
              onClick={() => onEdit(todo)}
            >
              Edit
            </button>
            <button
              className="iconBtn danger"
              type="button"
              onClick={() => onDelete(todo)}
            >
              Delete
            </button>
          </div>
        </div>
        {todo.description ? (
          <div className="todoDesc">{todo.description}</div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all"); // all | open | done
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "open") return todos.filter((t) => !t.completed);
    if (filter === "done") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const fetchTodos = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.get("/todos");
      setTodos(data?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      if (editing) {
        const { data } = await api.patch(`/todos/${editing._id}`, {
          title,
          description,
        });
        setTodos((prev) =>
          prev.map((t) => (t._id === editing._id ? data.data : t))
        );
      } else {
        const { data } = await api.post("/todos", { title, description });
        setTodos((prev) => [data.data, ...prev]);
      }
      setTitle("");
      setDescription("");
      setEditing(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const onToggle = async (todo) => {
    const next = !todo.completed;
    setTodos((prev) =>
      prev.map((t) => (t._id === todo._id ? { ...t, completed: next } : t))
    );
    try {
      const { data } = await api.patch(`/todos/${todo._id}`, {
        completed: next,
      });
      setTodos((prev) =>
        prev.map((t) => (t._id === todo._id ? data.data : t))
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
      fetchTodos();
    }
  };

  const onDelete = async (todo) => {
    const snapshot = todos;
    setTodos((prev) => prev.filter((t) => t._id !== todo._id));
    try {
      await api.delete(`/todos/${todo._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed");
      setTodos(snapshot);
    }
  };

  const onEdit = (todo) => {
    setEditing(todo);
    setTitle(todo.title);
    setDescription(todo.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onCancelEdit = () => {
    setEditing(null);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="todosWrap">
      <div className="todosHeader">
        <div>
          <div className="kicker">Your workspace</div>
          <h1 className="title">Todos</h1>
          <p className="subtitle">Create, complete, edit, and delete tasks.</p>
        </div>
        <div className="segmented">
          <button
            className={filter === "all" ? "seg on" : "seg"}
            type="button"
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "open" ? "seg on" : "seg"}
            type="button"
            onClick={() => setFilter("open")}
          >
            Open
          </button>
          <button
            className={filter === "done" ? "seg on" : "seg"}
            type="button"
            onClick={() => setFilter("done")}
          >
            Done
          </button>
        </div>
      </div>

      <motion.section
        className="panel"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <form className="form" onSubmit={onSubmit}>
          <div className="row2">
            <label className="field">
              <span>{editing ? "Edit title" : "Title"}</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Finish Node + React project"
                required
              />
            </label>
            <label className="field">
              <span>Description</span>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional notes"
              />
            </label>
          </div>

          {error ? <div className="alert">{error}</div> : null}

          <div className="actionsRow">
            <motion.button
              whileTap={{ scale: 0.99 }}
              className="btn btnPrimary"
              disabled={busy}
              type="submit"
            >
              {busy
                ? "Saving…"
                : editing
                ? "Update todo"
                : "Add todo"}
            </motion.button>

            {editing ? (
              <button
                className="btn btnGhost"
                type="button"
                onClick={onCancelEdit}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </motion.section>

      <section className="list">
        {loading ? (
          <div className="center">
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="emptyTitle">No todos yet</div>
            <div className="muted">
              Add one above — the animation will make you smile.
            </div>
          </div>
        ) : (
          <motion.div layout className="cards">
            {filtered.map((t) => (
              <TodoItem
                key={t._id}
                todo={t}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}

