import Home from "../pages/Client/Home/index";
import Login from "../pages/Client/Auth/login";
import Logout from "../pages/Client/Auth/logout";
import LayoutDefault from "../Layouts/LayoutDefault/index";
import PrivateRoutes from "../components/PrivateRoutes";
import { Navigate } from "react-router-dom";
import Register from "../pages/Client/Auth/register";
import DoctorDetail from "../pages/Client/Doctor/Detail";
import DoctorSchedule from "../pages/Client/Doctor/Schedule";
import AdminLogin from "../pages/Admin/Auth/Login";
import AdminLayout from "../components/AdminLayouts/AdminLayout";
import DoctorLayout from "../components/AdminLayouts/DoctorLayout";
import SupporterLayout from "../components/AdminLayouts/SupporterLayout";
import AdminRoute from "../components/AdminRoute";
import SupporterDashboard from "../pages/Admin/dashboard/SupporterDashboard";
import SupporterAppointments from "../components/SupporterAppointments";
import Doctors from "../components/AdminDashboard/Doctor";
import Schedule from "../components/AdminDashboard/Schedule";
import Specializations from "../components/AdminDashboard/Specialization";
import Clinics from "../components/AdminDashboard/Clinic";
import DoctorCreate from "../components/AdminDashboard/Doctor/create";
import Users from "../components/AdminDashboard/User";

export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "profile",
            element: <h2>Trang Profile</h2>,
          },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "doctor/:slug",
        element: <DoctorDetail />,
      },
      {
        path: "doctor/:slug/date/:date",
        element: <DoctorSchedule />,
      },
    ],
  },

  // ================= Admin Login =================
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  // ================= Admin Routes =================
  {
    path: "/admin",
    element: (
      <AdminRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "schedules",
        element: <Schedule/>
      },
      {
        path: "doctors",
        element: <Doctors/>,
      },
      {
        path: "doctors/create",
        element: <DoctorCreate/>,
      },
      {
        path: "specializations",
        element: <Specializations/>,
      },
      {
        path: "clinics",
        element: <Clinics/>,
      },
      {
        path: "users",
        element: <Users/>,
      }
    ],
  },

  // ================= Doctor Routes =================
  {
    path: "/admin/doctor",
    element: (
      <AdminRoute allowedRoles={["doctor"]}>
        <DoctorLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <h2>Doctor Dashboard</h2>,
      },
      {
        path: "patients",
        element: <h2>Quản lý Patients của tôi</h2>,
      },
      {
        path: "schedule",
        element: <h2>Lịch khám của tôi</h2>,
      },
      {
        path: "appointments",
        element: <h2>Lịch hẹn</h2>,
      },
    ],
  },

  // ================= Supporter Routes =================
  {
    path: "/admin/supporter",
    element: (
      <AdminRoute allowedRoles={["supporter"]}>
        <SupporterLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <SupporterDashboard />,
      },
      {
        path: "tickets",
        element: <SupporterAppointments/>,
      },
      {
        path: "customers",
        element: <h2>Quản lý Khách hàng</h2>,
      },
      {
        path: "chat",
        element: <h2>Chat hỗ trợ</h2>,
      },
    ],
  },

  { path: "*", element: <Navigate to="/" /> },
];