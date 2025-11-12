import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function AdminRoute({ children, allowedRoles = ["admin"] }) {
  const profileCookie = Cookies.get("profile");
  const profile = profileCookie ? JSON.parse(profileCookie) : null;

  if (!profile) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowedRoles.includes(profile.role)) {
    // Redirect role khác về dashboard tương ứng
    switch (profile.role) {
      case "doctor":
        return <Navigate to="/admin/doctor/" replace />;
      case "supporter":
        return <Navigate to="/admin/supporter/dashboard" replace />;
      default:
        return <h2>404 - Bạn không có quyền truy cập trang này</h2>;
    }
  }

  return children;
}

export default AdminRoute;
