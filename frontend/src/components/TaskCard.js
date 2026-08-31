import "../styles/TaskCard.css";

function TaskCard({ task, onEdit, onDelete, onStatusChange, showOwner }) {
  return (
    <div className="task-card">
      <div className="task-card-top">
        <span className="task-status">{task.status}</span>
      </div>

      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description}</p>

      <div className="task-card-bottom">
        <span className="task-assignee">{task.assignee?.name || "Unassigned"}</span>
        {showOwner && task.createdBy?.name && (
          <span className="task-owner">by {task.createdBy.name}</span>
        )}
      </div>

      {onStatusChange && (
        <div className="form-group" style={{ marginTop: 10 }}>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="status-select"
          >
            <option value="Todo">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      )}

      {(onEdit || onDelete) && (
        <div className="task-card-actions">
          {onEdit && <button className="edit-task-button" onClick={() => onEdit(task)}>Edit</button>}
          {onDelete && <button className="delete-task-button" onClick={() => onDelete(task._id)}>Delete</button>}
        </div>
      )}
    </div>
  );
}

export default TaskCard;