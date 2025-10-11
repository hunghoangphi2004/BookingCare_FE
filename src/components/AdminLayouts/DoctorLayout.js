// components/AdminLayouts/DoctorLayout.jsx
import { Outlet, Link } from "react-router-dom";
import Cookies from "js-cookie";

function DoctorLayout() {
  const profile = Cookies.get("profile") ? JSON.parse(Cookies.get("profile")) : null;

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <nav className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h3 className="mb-4">Doctor Panel</h3>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin/doctor/dashboard" className="nav-link text-white">
              Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/doctor/patients" className="nav-link text-white">
              Quản lý Patients
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/doctor/schedule" className="nav-link text-white">
              Lịch khám
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/doctor/appointments" className="nav-link text-white">
              Lịch hẹn
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-fill d-flex flex-column">
        {/* Header */}
        <header className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
          <h4>Welcome, Dr. {profile?.name || profile?.email || "Guest"}</h4>
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

export default DoctorLayout;