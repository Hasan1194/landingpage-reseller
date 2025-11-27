import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ResellerPage from "./reseller/ResellerPage";
import AdminPage from "./admin/AdminPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/reseller" element={<ResellerPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
