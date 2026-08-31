import "../styles/TaskCard.css";

function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-card-top">
        <span className="task-status">
          {task.status === "todo"
            ? "To Do"
            : task.status === "in-progress"
            ? "In Progress"
            : "Done"}
        </span>
      </div>

      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description}</p>

      <div className="task-card-bottom">
        <span className="task-assignee">{task.assignee}</span>
      </div>

      <div className="task-card-actions">
        <button
          className="edit-task-button"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="delete-task-button"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;