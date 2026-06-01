import { apiClient, configureAuthInterceptors } from "./axios";

/**
 * Response type for refresh token operation
 */
interface RefreshTokenResponse {
  message: string; // "Token refreshed"
}

class AuthApi {
  async login(data: { email: string; password: string }) {
    const response = await apiClient.post("/auth/login", data, {
      skipAuthRefresh: true,
    });
    return response.data;
  }

  async logout() {
    const response = await apiClient.get("/auth/logout");
    return response.data;
  }

  async getProfile() {
    const response = await apiClient.get("auth/profile");
    return response.data;
  }

  async updateProfile(data: { firstName?: string; lastName?: string; password?: string }) {
    const response = await apiClient.patch("/auth/update-profile", data);
    return response.data;
  }

  /**
   * Refresh access token
   *
   * @description
   * Refresh the access token using the refresh token via HTTP-only cookies.
   * No request body needed. New tokens are set in HTTP-only cookies automatically.
   *
   * @returns Promise<RefreshTokenResponse> - Response with success message
   *
   * @throws 401 - Unauthorized (Invalid or expired refresh token)
   * @throws 500 - Internal server error
   *
   * @example
   * const response = await authApi.refreshToken();
   * console.log(response.message); // "Token refreshed"
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh",
      {},
      {
        skipAuthRefresh: true,
      }
    );
    return response.data;
  }
}

const authApi = new AuthApi();

configureAuthInterceptors({
  refreshAccessToken: () => authApi.refreshToken(),
  onAuthFailure: () => {
    localStorage.removeItem("user");
    window.location.replace("/login");
  },
});

export default authApi;
