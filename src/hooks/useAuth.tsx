import { apiClient } from "@/apis/axios";
import code from "@/enums";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";

const AUTH_CHECK_URL = "/auth/profile"; // Endpoint để kiểm tra token
async function fetchAuthentication() {
  try {
    const axiosRequest = await apiClient.get(AUTH_CHECK_URL);
    return axiosRequest.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.status === 401) {
        // Token không hợp lệ hoặc đã hết hạn
        throw new AxiosError("Hết phiên đăng nhập", error.code); // Trả về null để biểu thị không có người dùng hợp lệ
      } else {
        throw new AxiosError("Có lỗi xảy ra khi kiểm tra xác thực. Vui lòng thử lại sau.", error.code);
      }
    }
    throw error;
  }
}
const STALE_TIME = 10 * 60 * 1000; // 5 phút
function useAuth() {
  const { isPending, error, data } = useQuery({
    queryKey: ["authCheck"],
    queryFn: fetchAuthentication,
    staleTime: STALE_TIME,
    throwOnError: (error) => {
      if (isAxiosError(error)) {
        return error.code === code.err.badResponse;
        // Nếu lỗi axios bad response, thả về error boundary
      }
      return false;
    },
  });
  return { wait: isPending, error, data };
}

export default useAuth;
