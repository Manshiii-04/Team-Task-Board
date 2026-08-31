import { useState } from "react";
import "../styles/MyTasks.css";
import TaskCard from "../components/TaskCard";

function MyTasks() {
  const [tasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div className="my-tasks-page">
      <div className="my-tasks-header">
        <div>
          <h1>My Tasks</h1>
          <p>View and manage tasks assigned to you</p>
        </div>
      </div>

      <div className="task-filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "todo" ? "active" : ""}
          onClick={() => setFilter("todo")}
        >
          To Do
        </button>

        <button
          className={filter === "in-progress" ? "active" : ""}
          onClick={() => setFilter("in-progress")}
        >
          In Progress
        </button>

        <button
          className={filter === "done" ? "active" : ""}
          onClick={() => setFilter("done")}
        >
          Done
        </button>
      </div>

      <div className="my-tasks-content">
        {filteredTasks.length === 0 ? (
          <div className="my-tasks-empty">
            <div className="empty-icon">✓</div>
            <h2>No tasks found</h2>
            <p>Tasks assigned to you will appear here.</p>
          </div>
        ) : (
          <div className="my-tasks-list">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTasks;