// components/AdminLayouts/SupporterLayout.jsx
import { Outlet, Link } from "react-router-dom";
import Cookies from "js-cookie";

function SupporterLayout() {
  const profile = Cookies.get("profile") ? JSON.parse(Cookies.get("profile")) : null;

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <nav className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h3 className="mb-4">Supporter Panel</h3>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin/supporter/dashboard" className="nav-link text-white">
              Tổng quan
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/supporter/tickets" className="nav-link text-white">
              Quản lý lịch đặt
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/supporter/customers" className="nav-link text-white">
              Quản lý Khách hàng
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/supporter/chat" className="nav-link text-white">
              Chat hỗ trợ
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-fill d-flex flex-column">
        {/* Header */}
        <header className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
          <h4>Welcome, {profile?.name || profile?.email || "Guest"}</h4>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              Cookies.remove("token");
              Cookies.remove("profile");
              window.location.href = "/admin/login";
            }}
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-fill p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SupporterLayout;