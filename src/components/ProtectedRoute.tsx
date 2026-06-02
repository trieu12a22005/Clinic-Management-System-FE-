import { Outlet, useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useProfile();
  console.log("Logged as", user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, isLoading, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
