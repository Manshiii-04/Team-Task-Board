import { useState, useEffect } from "react";
import "../styles/Board.css";
import TaskModal from "../components/TaskModal";
import TaskCard from "../components/TaskCard";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5100";

function Board() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

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

  const handleAddTask = async (newTask) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(newTask),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create task");
      setTasks((prev) => [...prev, data]);
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${updatedTask._id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(updatedTask),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update task");
      setTasks((prev) =>
        prev.map((task) => (task._id === data._id ? data : task))
      );
      setEditingTask(null);
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete task");
      }
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}/status`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? { ...task, status: newStatus } : task))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

const todoTasks = tasks.filter((task) => task.status === "Todo");
const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
const doneTasks = tasks.filter((task) => task.status === "Done");

  const renderTasks = (taskList) => {
    if (taskList.length === 0) {
      return <p className="empty-message">No tasks yet</p>;
    }
    return taskList.map((task) => (
      <TaskCard
        key={task._id}
        task={task}
        onEdit={isAdmin ? handleEditTask : undefined}
        onDelete={isAdmin ? handleDeleteTask : undefined}
        onStatusChange={handleStatusChange}
        showOwner={isAdmin}
      />
    ));
  };

  if (loading) {
    return <p style={{ textAlign: "center", padding: 40 }}>Loading tasks...</p>;
  }

  return (
    <div className="board-page">
      <div className="board-header">
        <div>
          <h1>Task Board</h1>
          <p>Manage and track your team's tasks</p>
        </div>
        {isAdmin && (
          <button
            className="add-task-button"
            onClick={() => {
              setEditingTask(null);
              setShowModal(true);
            }}
          >
            + Add Task
          </button>
        )}
      </div>

      {error && (
        <p style={{ textAlign: "center", color: "#b91c1c", marginBottom: 16 }}>
          {error}
        </p>
      )}

      <div className="board-columns">
        <div className="board-column">
          <div className="column-header">
            <h2>To Do</h2>
            <span>{todoTasks.length}</span>
          </div>
          <div className="tasks-container">{renderTasks(todoTasks)}</div>
        </div>
        <div className="board-column">
          <div className="column-header">
            <h2>In Progress</h2>
            <span>{inProgressTasks.length}</span>
          </div>
          <div className="tasks-container">{renderTasks(inProgressTasks)}</div>
        </div>
        <div className="board-column">
          <div className="column-header">
            <h2>Done</h2>
            <span>{doneTasks.length}</span>
          </div>
          <div className="tasks-container">{renderTasks(doneTasks)}</div>
        </div>
      </div>

      {showModal && isAdmin && (
        <TaskModal
          onClose={handleCloseModal}
          onAddTask={handleAddTask}
          editingTask={editingTask}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
}

export default Board;