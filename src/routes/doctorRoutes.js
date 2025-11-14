// routes/doctorRoutes.js
import ApprovedFamilyDashboard from "../components/DoctorDashboard/Family";
import FamilyDetailInDoctor from "../components/DoctorDashboard/Family/detail";
import RequestFamilyDoctorDashboard from "../components/DoctorDashboard/RequesFamilyDoctor";
import ScheduleDoctor from "../components/DoctorDashboard/Schedule";
import DoctorCalendar from "../components/DoctorDashboard/Appointment";
import DoctorPrescriptions from "../components/DoctorDashboard/DoctorPrescriptions";
import PrescriptionCreate from "../components/AdminDashboard/Prescription/create";

export const doctorRoutes = [
  { path: "doctor/family", element: <ApprovedFamilyDashboard /> },
  { path: "doctor/get-family-by-id/:id", element: <FamilyDetailInDoctor /> },
  { path: "doctor/request-family-doctor", element: <RequestFamilyDoctorDashboard /> },
  { path: "doctor/schedules", element: <ScheduleDoctor /> },
  { path: "doctor/appointments", element: <DoctorCalendar /> },
  { path: "doctor/my-prescriptions", element: <DoctorPrescriptions /> },
  { path: "doctor/prescriptions/create", element: <PrescriptionCreate /> },
  { path: "*", element: <h2>404 - Trang không tồn tại</h2> },
];
