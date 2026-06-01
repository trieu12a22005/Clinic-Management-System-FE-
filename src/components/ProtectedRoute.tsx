import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UseAuth } from "@/AuthContext";

const ProtectedRoute = () => {
  const { user } = UseAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
