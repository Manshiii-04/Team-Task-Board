import { useState } from "react";
import "../styles/Board.css";
import TaskModal from "../components/TaskModal";
import TaskCard from "../components/TaskCard";

function Board() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = (newTask) => {
    setTasks((previousTasks) => [
      ...previousTasks,
      { ...newTask, id: Date.now() }
    ]);
    setShowModal(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    setEditingTask(null);
    setShowModal(false);
  };

  const handleDeleteTask = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== id)
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "done"
  );

  const renderTasks = (taskList) => {
    if (taskList.length === 0) {
      return <p className="empty-message">No tasks yet</p>;
    }

    return taskList.map((task) => (
      <TaskCard
        key={task.id}
        task={task}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    ));
  };

  return (
    <div className="board-page">
      <div className="board-header">
        <div>
          <h1>Task Board</h1>
          <p>Manage and track your team's tasks</p>
        </div>

        <button
          className="add-task-button"
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
        >
          + Add Task
        </button>
      </div>

      <div className="board-columns">
        <div className="board-column">
          <div className="column-header">
            <h2>To Do</h2>
            <span>{todoTasks.length}</span>
          </div>

          <div className="tasks-container">
            {renderTasks(todoTasks)}
          </div>
        </div>

        <div className="board-column">
          <div className="column-header">
            <h2>In Progress</h2>
            <span>{inProgressTasks.length}</span>
          </div>

          <div className="tasks-container">
            {renderTasks(inProgressTasks)}
          </div>
        </div>

        <div className="board-column">
          <div className="column-header">
            <h2>Done</h2>
            <span>{doneTasks.length}</span>
          </div>

          <div className="tasks-container">
            {renderTasks(doneTasks)}
          </div>
        </div>
      </div>

      {showModal && (
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