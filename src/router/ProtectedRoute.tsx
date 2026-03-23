import code from "@/enums";
import useAuth from "@/hooks/useAuth";
import ErrorPage from "@/pages/Error";
import { isAxiosError } from "axios";
import { useEffect } from "react";

import { Outlet, useNavigate } from "react-router-dom";

/* interface ProtectedRouteProps {
  // Có thể thêm các props khác nếu cần để kiểm tra bổ sung
  permissionCode?: string[];
} */

// Todo: Thêm authorization vào đây sau khi có role
function ProtectedRoute() {
  const navigate = useNavigate();
  const { wait, error } = useAuth();
  // console.dir(error);
  // if (error) navigate("/login", { replace: true });
  useEffect(() => {
    if (error && isAxiosError(error)) {
      if (error.code === code.err.badRequest) {
        navigate("/login", { replace: true });
      }
    } else if (error) {
      console.error(error);
    }
  }, [navigate, error]);
  // return <ErrorPage message={error?.message || "An unexpected error occurred."} />
  // if (wait) return <></>;

  return wait ? <></> : error ? <ErrorPage message={error?.message || "An unexpected error occurred."} /> : <Outlet />;
}

export default ProtectedRoute;
