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
import DoctorCreate from "../components/AdminDashboard/Doctor/create";
import DoctorEdit from "../components/AdminDashboard/Doctor/edit";
import Schedule from "../components/AdminDashboard/Schedule";
import Specializations from "../components/AdminDashboard/Specialization";
import SpecializationCreate from "../components/AdminDashboard/Specialization/create";
import SpecializationEdit from "../components/AdminDashboard/Specialization/edit";
import Clinics from "../components/AdminDashboard/Clinic";
import ClinicCreate from "../components/AdminDashboard/Clinic/create";
import ClinicEdit from "../components/AdminDashboard/Clinic/edit";
import UserProfile from "../pages/Client/Auth/userProfile";
import FamilyProfile from "../pages/Client/Auth/familyProfile";
import FamilyDoctors from "../pages/Client/FamilyDoctor";
import RequestFamilyDoctor from "../components/RequestFamilyDoctor";
import RequestFamilyDoctorDashboard from "../components/DoctorDashboard/RequesFamilyDoctor";
import ApprovedFamilyDashboard from "../components/DoctorDashboard/Family";
import Supporters from "../components/AdminDashboard/Supporter";
import Patients from "../components/AdminDashboard/Patient";
import PatientCreate from "../components/AdminDashboard/Patient/create";
import PatientEdit from "../components/AdminDashboard/Patient/edit";
import SupporterCreate from "../components/AdminDashboard/Supporter/create";
import SupporterEdit from "../components/AdminDashboard/Supporter/edit";
import Medicines from "../components/AdminDashboard/Medicine";
import MedicineCreate from "../components/AdminDashboard/Medicine/create";
import MedicineEdit from "../components/AdminDashboard/Medicine/edit";
import Prescriptions from "../components/AdminDashboard/Prescription";
import PrescriptionCreate from "../components/AdminDashboard/Prescription/create";
import PrescriptionDetail from "../components/AdminDashboard/Prescription/detail";
import PrescriptionEdit from "../components/AdminDashboard/Prescription/edit";
import Families from "../components/AdminDashboard/Family";
import FamilyDetail from "../components/AdminDashboard/Family/detail";
import FamilyDetailInDoctor from "../components/DoctorDashboard/Family/detail";
import ScheduleDoctor from "../components/DoctorDashboard/Schedule";
import DoctorCalendar from "../components/DoctorDashboard/Appointment";
import DoctorPrescriptions from "../components/DoctorDashboard/DoctorPrescriptions"
import Main from "../components/layout/Main"

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
            path: "user-profile",
            element: <UserProfile />
          },
          {
            path: "family-profile",
            element: <FamilyProfile />
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
      {
        path: "family-doctors",
        element: <FamilyDoctors />,
      },
      {
        path: "family/request/:doctorId",
        element: <RequestFamilyDoctor />
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
        <Main>
          <AdminLayout />
        </Main>
      </AdminRoute>
    ),
    children: [
      {
        path: "schedules",
        element: <Schedule />
      },
      {
        path: "doctors",
        element: <Doctors />,
      },
      {
        path: "doctors/create",
        element: <DoctorCreate />,
      },
      {
        path: "doctors/edit/:id",
        element: <DoctorEdit />,
      },
      {
        path: "specializations",
        element: <Specializations />,
      },
      {
        path: "specializations/create",
        element: <SpecializationCreate />,
      },
      {
        path: "specializations/edit/:id",
        element: <SpecializationEdit />,
      },
      {
        path: "clinics",
        element: <Clinics />,
      },
      {
        path: "clinics/create",
        element: <ClinicCreate />,
      },
      {
        path: "clinics/edit/:id",
        element: <ClinicEdit />,
      },
      {
        path: "supporters",
        element: <Supporters />,
      },
      {
        path: "supporters/create",
        element: <SupporterCreate />,
      },
      {
        path: "supporters/edit/:id",
        element: <SupporterEdit />,
      },
      {
        path: "patients",
        element: <Patients />,
      },
      {
        path: "patients/create",
        element: <PatientCreate />,
      },
      {
        path: "patients/edit/:id",
        element: <PatientEdit />,
      },
      {
        path: "medicines",
        element: <Medicines />,
      },
      {
        path: "medicines/create",
        element: <MedicineCreate />,
      },
      {
        path: "medicines/edit/:id",
        element: <MedicineEdit />,
      },
      {
        path: "prescriptions",
        element: <Prescriptions />,
      },
      {
        path: "prescriptions/create",
        element: <PrescriptionCreate />,
      },
      {
        path: "prescriptions/detail/:id",
        element: <PrescriptionDetail />,
      },
      {
        path: "prescriptions/edit/:id",
        element: <PrescriptionEdit />,
      },
      {
        path: "families",
        element: <Families />,
      },
      {
        path: "families/detail/:id",
        element: <FamilyDetail />,
      },
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
        path: "family",
        element: <ApprovedFamilyDashboard />
      },
      {
        path: "get-family-by-id/:id",
        element: <FamilyDetailInDoctor />
      },
      {
        path: "request-family-doctor",
        element: <RequestFamilyDoctorDashboard />
      },
      {
        path: "schedules",
        element: <ScheduleDoctor />
      },
      {
        path: "appointments",
        element: <DoctorCalendar />
      },
      {
        path: "my-prescriptions",
        element: <DoctorPrescriptions />
      },
      {
        path: "prescriptions/create",
        element: <PrescriptionCreate />
      },
      { path: "*", element: <h2>404 - Trang không tồn tại</h2> },
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
        path: "appointments",
        element: <SupporterAppointments />,
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