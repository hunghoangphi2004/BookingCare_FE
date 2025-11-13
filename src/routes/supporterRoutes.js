// routes/supporterRoutes.js
import SupporterDashboard from "../pages/Admin/dashboard/SupporterDashboard";
import SupporterAppointments from "../components/SupporterAppointments";

export const supporterRoutes = [
  { path: "dashboard", element: <SupporterDashboard /> },
  { path: "appointments", element: <SupporterAppointments /> },
  { path: "customers", element: <h2>Quản lý Khách hàng</h2> },
  { path: "chat", element: <h2>Chat hỗ trợ</h2> },
];
