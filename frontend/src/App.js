import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Board from "./pages/Board";
import MyTasks from "./pages/MyTasks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [page, setPage] = useState("board");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored || stored === "undefined") return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const isLoggedIn = Boolean(token && user);

  // If token exists but user doesn't (corrupted/incomplete session), force logout
  useEffect(() => {
    if (token && !user) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
    }
  }, [token, user]);

  useEffect(() => {
    if (!isLoggedIn && page !== "login" && page !== "signup") {
      setPage("login");
    }
  }, [isLoggedIn, page]);

  const handleAuthSuccess = (newToken, newUser) => {
    if (!newToken || !newUser) {
      console.error("Auth response missing token or user:", { newToken, newUser });
      return;
    }
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setPage("board");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setPage("login");
  };

  return (
    <div>
      <Navbar setPage={setPage} user={isLoggedIn ? user : null} onLogout={handleLogout} />
      {!isLoggedIn ? (
        page === "signup" ? (
          <Signup setPage={setPage} onAuthSuccess={handleAuthSuccess} />
        ) : (
          <Login setPage={setPage} onAuthSuccess={handleAuthSuccess} />
        )
      ) : (
        <>
          {page === "board" && <Board />}
          {page === "mytasks" && <MyTasks />}
        </>
      )}
    </div>
  );
}

export default App;