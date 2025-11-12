// components/AdminLayouts/DoctorLayout.jsx
import { Outlet, Link } from "react-router-dom";
import Cookies from "js-cookie";

function DoctorLayout() {
  const profile = Cookies.get("profile") ? JSON.parse(Cookies.get("profile")) : null;

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <nav className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h3 className="mb-4">Trang bác sĩ</h3>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin/doctor/schedules" className="nav-link text-white">
              Quản lý kế hoạch khám bệnh
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/doctor/request-family-doctor" className="nav-link text-white">
              Quản lý Yêu cầu Bác sĩ gia đình
            </Link>
          </li>
           <li className="nav-item mb-2">
            <Link to="/admin/doctor/family" className="nav-link text-white">
              Quản lý gia đình
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/doctor/appointments" className="nav-link text-white">
              Lịch hẹn
            </Link>
          </li>
           <li className="nav-item mb-2">
            <Link to="/admin/doctor/my-prescriptions" className="nav-link text-white">
              Quản lý toa thuốc
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