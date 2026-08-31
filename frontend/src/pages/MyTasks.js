import { useState, useEffect } from "react";
import "../styles/MyTasks.css";
import TaskCard from "../components/TaskCard";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5100";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load tasks");
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div className="my-tasks-page">
      <div className="my-tasks-header">
        <div>
          <h1>{isAdmin ? "All Tasks" : "My Tasks"}</h1>
          <p>
            {isAdmin
              ? "View and manage tasks across all users"
              : "View and manage tasks assigned to you"}
          </p>
        </div>
      </div>

      <div className="task-filters">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
          All
        </button>
        <button className={filter === "todo" ? "active" : ""} onClick={() => setFilter("todo")}>
          To Do
        </button>
        <button
          className={filter === "in-progress" ? "active" : ""}
          onClick={() => setFilter("in-progress")}
        >
          In Progress
        </button>
        <button className={filter === "done" ? "active" : ""} onClick={() => setFilter("done")}>
          Done
        </button>
      </div>

      <div className="my-tasks-content">
        {loading ? (
          <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading tasks...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "#b91c1c" }}>{error}</p>
        ) : filteredTasks.length === 0 ? (
          <div className="my-tasks-empty">
            <div className="empty-icon">✓</div>
            <h2>No tasks found</h2>
            <p>
              {isAdmin
                ? "No tasks have been created yet."
                : "Tasks assigned to you will appear here."}
            </p>
          </div>
        ) : (
          <div className="my-tasks-list">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                showOwner={isAdmin}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTasks;