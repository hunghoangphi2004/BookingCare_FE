// menus.js
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MessageOutlined,
  HddOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

export const adminMenu = [
  { path: "/admin/dashboard", label: "Tổng quan", icon: <HomeOutlined /> },
  { path: "/admin/schedules", label: "Tạo lịch khám", icon: <CalendarOutlined /> },
  { path: "/admin/doctors", label: "Bác sĩ", icon: <UserOutlined /> },
  { path: "/admin/specializations", label: "Chuyên khoa", icon: <ProfileOutlined /> },
  { path: "/admin/clinics", label: "Phòng khám", icon: <HddOutlined /> },
  { path: "/admin/patients", label: "Bệnh nhân", icon: <TeamOutlined /> },
  { path: "/admin/supporters", label: "Hỗ trợ viên", icon: <UserOutlined /> },
  { path: "/admin/medicines", label: "Thuốc", icon: <MedicineBoxOutlined /> },
  { path: "/admin/prescriptions", label: "Toa thuốc", icon: <FileTextOutlined /> },
  { path: "/admin/families", label: "Gia đình", icon: <TeamOutlined /> },
];

export const doctorMenu = [
  { path: "/admin/doctor/dashboard", label: "Tổng quan", icon: <HomeOutlined /> },
  { path: "/admin/doctor/schedules", label: "Quản lý kế hoạch khám bệnh", icon: <CalendarOutlined /> },
  { path: "/admin/doctor/request-family-doctor", label: "Quản lý Yêu cầu Bác sĩ gia đình", icon: <FileTextOutlined /> },
  { path: "/admin/doctor/family", label: "Quản lý gia đình", icon: <TeamOutlined /> },
  { path: "/admin/doctor/appointments", label: "Lịch hẹn", icon: <CalendarOutlined /> },
  { path: "/admin/doctor/my-prescriptions", label: "Quản lý toa thuốc", icon: <FileTextOutlined /> },
];

export const supporterMenu = [
  { path: "/admin/supporter/dashboard", label: "Tổng quan", icon: <HomeOutlined /> },
  { path: "/admin/supporter/appointments", label: "Quản lý lịch đặt", icon: <CalendarOutlined /> },
  { path: "/admin/supporter/customers", label: "Quản lý Khách hàng", icon: <TeamOutlined /> },
  { path: "/admin/supporter/chat", label: "Chat hỗ trợ", icon: <MessageOutlined /> },
];
