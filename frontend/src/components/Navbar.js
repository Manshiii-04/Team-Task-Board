import "../styles/Navbar.css";

function Navbar({ setPage, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <span className="logo-icon">✓</span>
          TaskFlow
        </div>

        {user && (
          <>
            <button className="nav-link" onClick={() => setPage("board")}>
              Board
            </button>
            <button className="nav-link" onClick={() => setPage("mytasks")}>
              My Tasks
            </button>
          </>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="user-info">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{user?.role}</p>
            </div>
            <button className="nav-link logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="nav-link" onClick={() => setPage("login")}>
              Login
            </button>
            <button className="nav-link nav-link-primary" onClick={() => setPage("signup")}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;