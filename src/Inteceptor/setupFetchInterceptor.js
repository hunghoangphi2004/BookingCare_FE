import Cookies from "js-cookie";

export function setupFetchInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async (input, init = {}) => {
    const token = Cookies.get("token");

    const isFormData = init.body instanceof FormData;

    // 🔧 Luôn có headers, kể cả khi chưa đăng nhập
    init.headers = {
      ...init.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    let response = await originalFetch(input, init);

    // ======= Xử lý token hết hạn =======
    if (response.status === 401) {
      const data = await response.clone().json().catch(() => ({}));
      if (data.message === "TokenExpired") {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          window.location.href = "/login";
          return response;
        }

        try {
          const refreshResponse = await originalFetch(
            "http://localhost:3000/auth/refresh-token",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            }
          );

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            Cookies.set("token", refreshData.accessToken, { expires: 1 });

            // Gửi lại request ban đầu
            init.headers.Authorization = `Bearer ${refreshData.accessToken}`;
            response = await originalFetch(input, init);
          } else {
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            Cookies.remove("profile");
            window.location.href = "/login";
          }
        } catch (error) {
          console.error("Refresh token error:", error);
          Cookies.remove("token");
          Cookies.remove("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return response;
  };
}
