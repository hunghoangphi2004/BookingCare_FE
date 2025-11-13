import Cookies from "js-cookie";

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN; // Sử dụng biến môi trường

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

    // Nếu input là string, tự động prepend API_DOMAIN nếu chưa có http
    let url = input;
    if (typeof input === "string" && !/^https?:\/\//i.test(input)) {
      url = `${API_DOMAIN}${input}`;
    }

    let response = await originalFetch(url, init);

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
          const refreshResponse = await originalFetch(`${API_DOMAIN}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            Cookies.set("token", refreshData.accessToken, { expires: 1 });

            // Gửi lại request ban đầu
            init.headers.Authorization = `Bearer ${refreshData.accessToken}`;
            response = await originalFetch(url, init);
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
