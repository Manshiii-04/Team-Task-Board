import "../styles/Navbar.css";

function Navbar({ setPage }) {
  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : {
        name: "Tarni",
        role: "Admin"
      };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <span className="logo-icon">✓</span>
          TaskFlow
        </div>

        <button
          className="nav-link"
          onClick={() => setPage("board")}
        >
          Board
        </button>

        <button
          className="nav-link"
          onClick={() => setPage("mytasks")}
        >
          My Tasks
        </button>
      </div>

      <div className="navbar-right">
        <div className="user-info">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="user-name">
              {user?.name}
            </p>

            <p className="user-role">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
