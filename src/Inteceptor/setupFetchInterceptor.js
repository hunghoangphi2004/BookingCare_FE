import Cookies from "js-cookie";

const API_DOMAIN = "http://localhost:3000";

export function setupFetchInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async (url, options = {}) => {
    const token = Cookies.get("token");

    // Gắn token vào tất cả request
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    let response = await originalFetch(url, { ...options, headers });

    // 🧠 Nếu token hết hạn (401)
    if (response.status === 401 && !url.includes("/auth/refresh-token")) {
      console.warn("⚠️ Token hết hạn → tự refresh...");

      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        console.error("❌ Không có refreshToken → đăng xuất");
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return response;
      }

      // 🌀 Gọi API refresh token
      const refreshResponse = await originalFetch(`${API_DOMAIN}/auth/refresh-token`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const refreshData = await refreshResponse.json();

      // ✅ Nếu refresh thành công
      if (refreshResponse.ok && refreshData.success && refreshData.accessToken) {
        Cookies.set("token", refreshData.accessToken);
        console.log("🔁 Token mới đã được cập nhật, gọi lại request cũ");

        // Gọi lại request cũ với token mới
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${refreshData.accessToken}`,
        };

        response = await originalFetch(url, { ...options, headers: retryHeaders });
      } else {
        console.error("❌ Refresh thất bại → đăng xuất");
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
      }
    }

    return response;
  };
}
