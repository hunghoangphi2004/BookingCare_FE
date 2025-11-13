// routes/adminRoutes.js
import Schedule from "../components/AdminDashboard/Schedule";
import Doctors from "../components/AdminDashboard/Doctor";
import DoctorCreate from "../components/AdminDashboard/Doctor/create";
import DoctorEdit from "../components/AdminDashboard/Doctor/edit";
import Specializations from "../components/AdminDashboard/Specialization";
import SpecializationCreate from "../components/AdminDashboard/Specialization/create";
import SpecializationEdit from "../components/AdminDashboard/Specialization/edit";
import Clinics from "../components/AdminDashboard/Clinic";
import ClinicCreate from "../components/AdminDashboard/Clinic/create";
import ClinicEdit from "../components/AdminDashboard/Clinic/edit";
import Supporters from "../components/AdminDashboard/Supporter";
import SupporterCreate from "../components/AdminDashboard/Supporter/create";
import SupporterEdit from "../components/AdminDashboard/Supporter/edit";
import Patients from "../components/AdminDashboard/Patient";
import PatientCreate from "../components/AdminDashboard/Patient/create";
import PatientEdit from "../components/AdminDashboard/Patient/edit";
import Medicines from "../components/AdminDashboard/Medicine";
import MedicineCreate from "../components/AdminDashboard/Medicine/create";
import MedicineEdit from "../components/AdminDashboard/Medicine/edit";
import Prescriptions from "../components/AdminDashboard/Prescription";
import PrescriptionCreate from "../components/AdminDashboard/Prescription/create";
import PrescriptionDetail from "../components/AdminDashboard/Prescription/detail";
import PrescriptionEdit from "../components/AdminDashboard/Prescription/edit";
import Families from "../components/AdminDashboard/Family";
import FamilyDetail from "../components/AdminDashboard/Family/detail";
import ProfilePage from "../components/Profile";

export const adminRoutes = [
  { path: "schedules", element: <Schedule /> },
  { path: "doctors", element: <Doctors /> },
  { path: "doctors/create", element: <DoctorCreate /> },
  { path: "doctors/edit/:id", element: <DoctorEdit /> },
  { path: "specializations", element: <Specializations /> },
  { path: "specializations/create", element: <SpecializationCreate /> },
  { path: "specializations/edit/:id", element: <SpecializationEdit /> },
  { path: "clinics", element: <Clinics /> },
  { path: "clinics/create", element: <ClinicCreate /> },
  { path: "clinics/edit/:id", element: <ClinicEdit /> },
  { path: "supporters", element: <Supporters /> },
  { path: "supporters/create", element: <SupporterCreate /> },
  { path: "supporters/edit/:id", element: <SupporterEdit /> },
  { path: "patients", element: <Patients /> },
  { path: "patients/create", element: <PatientCreate /> },
  { path: "patients/edit/:id", element: <PatientEdit /> },
  { path: "medicines", element: <Medicines /> },
  { path: "medicines/create", element: <MedicineCreate /> },
  { path: "medicines/edit/:id", element: <MedicineEdit /> },
  { path: "prescriptions", element: <Prescriptions /> },
  { path: "prescriptions/create", element: <PrescriptionCreate /> },
  { path: "prescriptions/detail/:id", element: <PrescriptionDetail /> },
  { path: "prescriptions/edit/:id", element: <PrescriptionEdit /> },
  { path: "families", element: <Families /> },
  { path: "families/detail/:id", element: <FamilyDetail /> },
  { path: "profile", element: <ProfilePage /> },
];
