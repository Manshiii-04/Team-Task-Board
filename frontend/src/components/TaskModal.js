import { useEffect, useState } from "react";
import "../styles/TaskModal.css";

function TaskModal({ onClose, onAddTask, editingTask, onUpdateTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("todo");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setAssignee(editingTask.assignee);
      setStatus(editingTask.status);
    } else {
      setTitle("");
      setDescription("");
      setAssignee("");
      setStatus("todo");
    }
  }, [editingTask]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const taskData = {
      title,
      description,
      assignee,
      status
    };

    if (editingTask) {
      onUpdateTask({
        ...taskData,
        id: editingTask.id
      });
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
            <p>
              {editingTask
                ? "Update task information"
                : "Add a new task to your board"}
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
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

          <div className="form-group">
            <label>Assignee</label>
           <select
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            required
            >
            <option value="" disabled>
                Select assignee
            </option>
            <option value="Manshi">Manshi</option>
            <option value="Sneha">Sneha</option>
            <option value="Tarni">Tarni</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              required
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

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