// routes/supporterRoutes.js
import SupporterDashboard from "../pages/Admin/dashboard/SupporterDashboard";
import SupporterAppointments from "../components/SupporterAppointments";

export const supporterRoutes = [
  { path: "supporter/dashboard", element: <SupporterDashboard /> },
  { path: "supporter/appointments", element: <SupporterAppointments /> },
  { path: "supporter/customers", element: <h2>Quản lý Khách hàng</h2> },
  { path: "supporter/chat", element: <h2>Chat hỗ trợ</h2> },
];
