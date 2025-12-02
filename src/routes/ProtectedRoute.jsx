import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
    const { currentUser, userData, loading } = useAuth();

    if (loading) return <p>Checking permissions...</p>;

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (role && userData?.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
