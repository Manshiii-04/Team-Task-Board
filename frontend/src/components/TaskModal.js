import { useEffect, useState, useRef } from "react";
import "../styles/TaskModal.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5100";

function TaskModal({ onClose, onAddTask, editingTask, onUpdateTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");

  const [assigneeQuery, setAssigneeQuery] = useState("");
  const [assigneeResults, setAssigneeResults] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
      if (editingTask.assignee) {
        setSelectedAssignee(editingTask.assignee);
        setAssigneeQuery(editingTask.assignee.name);
      } else {
        setSelectedAssignee(null);
        setAssigneeQuery("");
      }
    } else {
      setTitle("");
      setDescription("");
      setStatus("Todo");
      setSelectedAssignee(null);
      setAssigneeQuery("");
    }
  }, [editingTask]);

  const handleAssigneeInput = (value) => {
    setAssigneeQuery(value);
    setSelectedAssignee(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setAssigneeResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/auth/search?q=${encodeURIComponent(value)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setAssigneeResults(res.ok ? data : []);
      } catch {
        setAssigneeResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleSelectAssignee = (user) => {
    setSelectedAssignee(user);
    setAssigneeQuery(user.name);
    setAssigneeResults([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedAssignee) {
      alert("Please select a valid assignee from the list");
      return;
    }

    const taskData = {
      title,
      description,
      status,
      assignee: selectedAssignee._id,
    };

    if (editingTask) {
      onUpdateTask({ ...taskData, _id: editingTask._id });
    } else {
      onAddTask(taskData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="task-modal">
        <div className="modal-header">
          <div>
            <h2>{editingTask ? "Edit Task" : "Create Task"}</h2>
            <p>{editingTask ? "Update task information" : "Add a new task to your board"}</p>
          </div>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter task description"
              rows="4"
              required
            />
          </div>

          <div className="form-group assignee-search-group">
            <label>Assignee</label>
            <input
              type="text"
              value={assigneeQuery}
              onChange={(event) => handleAssigneeInput(event.target.value)}
              placeholder="Search member by name..."
              autoComplete="off"
              required
            />
            {searching && <p className="assignee-hint">Searching...</p>}
            {assigneeResults.length > 0 && (
              <ul className="assignee-dropdown">
                {assigneeResults.map((u) => (
                  <li key={u._id} onClick={() => handleSelectAssignee(u)}>
                    <span className="assignee-name">{u.name}</span>
                    <span className="assignee-email">{u.email}</span>
                  </li>
                ))}
              </ul>
            )}
            {!searching &&
              assigneeQuery.trim().length >= 2 &&
              assigneeResults.length === 0 &&
              !selectedAssignee && <p className="assignee-hint">No matching users found</p>}
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(event) => setStatus(event.target.value)} required>
              <option value="Todo">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="create-button">
              {editingTask ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;