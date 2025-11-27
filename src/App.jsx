import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./auth/Login";
import Register from "./auth/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
    </Routes>
  );
}

export default App;
