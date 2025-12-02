import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ResellerPage from "./reseller/ResellerPage";
import AdminPage from "./admin/AdminPage";
import ForgotPassword from "./auth/ForgotPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Proteksi Role */}
        <Route
          path="/reseller"
          element={
            <ProtectedRoute role="reseller">
              <ResellerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </AuthProvider>
  );
}

export default App;
