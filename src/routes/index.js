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


export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <PrivateRoutes />,
        children: [
          { path: "user-profile", element: <UserProfile /> },
          { path: "family-profile", element: <FamilyProfile /> },
        ],
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "logout", element: <Logout /> },
      { path: "doctor/:slug", element: <DoctorDetail /> },
      { path: "doctor/:slug/date/:date", element: <DoctorSchedule /> },
      { path: "family-doctors", element: <FamilyDoctors /> },
      { path: "family/request/:doctorId", element: <RequestFamilyDoctor /> },
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
    { index: true, element: <Dashboard/> }, 
    ...adminRoutes,
    ...doctorRoutes,
    ...supporterRoutes,
  ],
  },

  // fallback
  { path: "*", element: <Navigate to="/" /> },
];
