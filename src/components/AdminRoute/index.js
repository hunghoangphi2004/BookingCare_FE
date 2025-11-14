import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function AdminRoute({ allowedRoles = ["admin", "doctor", "supporter"], children }) {
  const profileCookie = Cookies.get("profile");
  const profile = profileCookie ? JSON.parse(profileCookie) : null;
  console.log(profile)

  if (!profile) return <Navigate to="/admin/login" replace />;

  if (!allowedRoles.includes(profile.role)) {
    switch (profile.role) {
      case "doctor":
        return <Navigate to="/admin/doctor/" replace />;
      case "supporter":
        return <Navigate to="/admin/supporter/" replace />;
      default:
        return <h2>404 - Bạn không có quyền truy cập trang này</h2>;
    }
  }

  return children; // render trực tiếp Main và các route con bên trong
}

export default AdminRoute;
