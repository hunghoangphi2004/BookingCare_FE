import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

/**
 * Bảo vệ route admin
 * - Chỉ cho admin / doctor / supporter truy cập
 * - Nếu chưa login hoặc role không hợp lệ → redirect /admin/login
 */
function AdminRoute({ children, allowedRoles = ["admin"] }) {
  const profileCookie = Cookies.get("profile");
  const profile = profileCookie ? JSON.parse(profileCookie) : null;

  if (!profile) return <Navigate to="/admin/login" replace />;
  if (!allowedRoles.includes(profile.role)) return <Navigate to="/admin/login" replace />;

  return children;
}


export default AdminRoute;
