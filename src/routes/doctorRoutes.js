// routes/doctorRoutes.js
import ApprovedFamilyDashboard from "../components/DoctorDashboard/Family";
import FamilyDetailInDoctor from "../components/DoctorDashboard/Family/detail";
import RequestFamilyDoctorDashboard from "../components/DoctorDashboard/RequesFamilyDoctor";
import ScheduleDoctor from "../components/DoctorDashboard/Schedule";
import DoctorCalendar from "../components/DoctorDashboard/Appointment";
import DoctorPrescriptions from "../components/DoctorDashboard/DoctorPrescriptions";
import PrescriptionCreate from "../components/AdminDashboard/Prescription/create";

export const doctorRoutes = [
  { path: "family", element: <ApprovedFamilyDashboard /> },
  { path: "get-family-by-id/:id", element: <FamilyDetailInDoctor /> },
  { path: "request-family-doctor", element: <RequestFamilyDoctorDashboard /> },
  { path: "schedules", element: <ScheduleDoctor /> },
  { path: "appointments", element: <DoctorCalendar /> },
  { path: "my-prescriptions", element: <DoctorPrescriptions /> },
  { path: "prescriptions/create", element: <PrescriptionCreate /> },
  { path: "*", element: <h2>404 - Trang không tồn tại</h2> },
];
