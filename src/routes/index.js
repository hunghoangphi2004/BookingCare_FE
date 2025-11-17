import { adminRoutes } from "./adminRoutes";
import { doctorRoutes } from "./doctorRoutes";
import { supporterRoutes } from "./supporterRoutes";
import PrivateRoutes from "../components/PrivateRoutes"
import AdminRoute from "../components/AdminRoute"
import Main from "../components/layout/Main"
import LayoutDefault from "../Layouts/LayoutDefault"
import Home from "../pages/Client/Home/index"
import UserProfile from "../pages/Client/Auth/userProfile"
import FamilyProfile from "../pages/Client/Auth/familyProfile"
import Login from "../pages/Client/Auth/login"
import Register from "../pages/Client/Auth/register"
import Logout from "../pages/Client/Auth/logout"
import DoctorDetail from "../pages/Client/Doctor/Detail/index"
import DoctorSchedule from "../pages/Client/Doctor/Schedule/index"
import FamilyDoctors from "../pages/Client/FamilyDoctor/index"
import RequestFamilyDoctor from "../pages/Client/RequestFamilyDoctor"
import AdminLogin from "../pages/Admin/Auth/Login"
import { Navigate } from "react-router-dom";
import Dashboard from "../components/AdminDashboard/Dashboard"
import AllSpecialization from "../pages/Client/Specialization/AllSpecialization";
import AllClinic from "../pages/Client/Clinic/AllClinic";
import DetailSpecialization from "../pages/Client/Specialization/DetailSpecialization";
import DetailClinic from "../pages/Client/Clinic/DetailClinic";
import FeaturedDoctor from "../pages/Client/Doctor/FeaturedDoctor";

export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <PrivateRoutes />,
        children: [
          { path: "ho-so-ca-nhan", element: <UserProfile /> },
          { path: "ho-so-gia-dinh", element: <FamilyProfile /> },
        ],
      },
      { path: "dang-nhap", element: <Login /> },
      { path: "dang-ky", element: <Register /> },
      { path: "dang-xuat", element: <Logout /> },
      { path: "bac-si/:slug", element: <DoctorDetail /> },
      { path: "bac-si/:slug/ngay/:date", element: <DoctorSchedule /> },
      { path: "bac-si-gia-dinh", element: <FamilyDoctors /> },
      { path: "gia-dinh/yeu-cau/:doctorId", element: <RequestFamilyDoctor /> },
      { path: "kham-chuyen-khoa", element: <AllSpecialization /> },
      { path: "bac-si-noi-bat", element: <FeaturedDoctor /> },
      { path: "phong-kham", element: <AllClinic /> },
      { path: "kham-chuyen-khoa/:slug", element: <DetailSpecialization /> },
      { path: "phong-kham/:slug", element: <DetailClinic /> }
    ],
  },

  // Admin login
  { path: "/admin/login", element: <AdminLogin /> },

  {
    path: "/admin",
    element: (
      <AdminRoute allowedRoles={["admin", "doctor", "supporter"]}>
        <Main />
      </AdminRoute>
    ),
    children: [
      ...adminRoutes,
      ...doctorRoutes,
      ...supporterRoutes,
    ],
  },

  // fallback
  { path: "*", element: <Navigate to="/" /> },
];
