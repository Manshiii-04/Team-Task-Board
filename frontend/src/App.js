import { useState } from "react";
import Navbar from "./components/Navbar";
import Board from "./pages/Board";
import MyTasks from "./pages/MyTasks";

function App() {
  const [page, setPage] = useState("board");

  return (
    <div>
      <Navbar setPage={setPage} />

      {page === "board" && <Board />}
      {page === "mytasks" && <MyTasks />}
    </div>
  );
}

export default App;


