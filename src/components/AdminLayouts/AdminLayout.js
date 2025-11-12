// components/AdminLayouts/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { logoutAdmin } from "../../services/authService";

function AdminLayout() {
  const profile = Cookies.get("profile") ? JSON.parse(Cookies.get("profile")) : null;
  // console.log(profile)


  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <nav className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h3 className="mb-4">Trang quản trị viên</h3>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin/schedules" className="nav-link text-white">
              Quản lý kế hoạch khám bệnh
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/doctors" className="nav-link text-white">
              Quản lý bác sĩ
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/specializations" className="nav-link text-white">
              Quản lý chuyên khoa
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/clinics" className="nav-link text-white">
              Quản lý phòng khám
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/patients" className="nav-link text-white">
              Quản lý bệnh nhân
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/supporters" className="nav-link text-white">
              Quản lý hỗ trợ viên
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/medicines" className="nav-link text-white">
              Quản lý thuốc
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/prescriptions" className="nav-link text-white">
              Quản lý toa thuốc
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/families" className="nav-link text-white">
              Quản lý gia đình
            </Link>
          </li>

        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-fill d-flex flex-column">
        {/* Header */}
        <header className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
          <h4>Welcome, {profile.role == "admin" ? <>admin</> : ""}</h4>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={async () => {
              try {
                // Gọi API logout
                await logoutAdmin();

                // Xóa cookie
                Cookies.remove("token");
                Cookies.remove("profile");

                // Chuyển về trang login
                window.location.href = "/admin/login";
              } catch (err) {
                console.error("Lỗi khi logout:", err);
                alert("Logout thất bại, vui lòng thử lại!");
              }
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

export default AdminLayout;