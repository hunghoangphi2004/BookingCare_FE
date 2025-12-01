import { useEffect, useState } from "react";
import { Alert, Table, Tag, Button } from "antd";
import { getAllAppointments } from "../../services/appointmentService";
import { getDoctorById } from "../../services/doctorService";
import { getPatientById } from "../../services/patientService";
import { changeStatusAppointment } from "../../services/appointmentService";

function SupporterAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // 🌟 State để hiển thị alert thành công

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await getAllAppointments();
      if (res.success) {
        const result = await Promise.all(
          res.data.map(async (a, index) => {
            const doctorRes = await getDoctorById(a.doctorId);
            const patientRes = await getPatientById(a.patientId);

            return {
              key: a._id,
              index: index + 1,
              ...a,
              doctorName: doctorRes.success ? doctorRes.data.name : a.doctorId,
              patientName:
                patientRes.success && patientRes.data?.patient
                  ? `${patientRes.data.patient.firstName} ${patientRes.data.patient.lastName}`
                  : a.patientId,
            };
          })
        );

        setAppointments(result);
        setSuccessMessage("Tải danh sách lịch hẹn thành công!"); // 🌟 Thông báo thành công
      } else {
        setError(res.message || "Không lấy được dữ liệu");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Bạn có chắc muốn đổi trạng thái thành "${status}"?`)) return;

    try {
      const res = await changeStatusAppointment(id, status);
      if (res.success) {
        setSuccessMessage("Cập nhật trạng thái thành công!");
        fetchAppointments();
      } else {
        setError(res.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      setError("Lỗi khi cập nhật trạng thái!");
    }
  };

  const columns = [
    { title: "#", dataIndex: "index", width: 60 },
    { title: "Bác sĩ", dataIndex: "doctorName" },
    { title: "Bệnh nhân", dataIndex: "patientName" },
    { title: "Ngày", dataIndex: "dateBooking" },
    { title: "Thời gian", dataIndex: "timeBooking" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        switch (status) {
          case "pending":
            return <Tag color="gold">Đang chờ duyệt</Tag>;
          case "confirmed":
            return <Tag color="blue">Đã xác nhận</Tag>;
          case "cancelled":
            return <Tag color="red">Đã hủy</Tag>;
          default:
            return <Tag>Không rõ</Tag>;
        }
      },
    },
    { title: "Mô tả", dataIndex: "description" },
    {
      title: "Hành động",
      render: (row) =>
        row.status === "pending" && (
          <>
            <Button
              type="primary"
              size="small"
              className="me-2"
              onClick={() => handleUpdateStatus(row._id, "confirmed")}
            >
              Chấp thuận
            </Button>
            <Button danger size="small" onClick={() => handleUpdateStatus(row._id, "cancelled")}>
              Hủy
            </Button>
          </>
        ),
    },
  ];

  return (
    <div>
      <h2>Quản lý lịch đặt</h2>

      {/* 🌟 Hiển thị thông báo thành công */}
      {successMessage && (
        <Alert
          message="Thành công"
          description={successMessage}
          type="success"
          showIcon
          closable
          onClose={() => setSuccessMessage("")}
          className="mb-3"
        />
      )}

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError("")}
          className="mb-3"
        />
      )}

      <Table columns={columns} dataSource={appointments} loading={loading} bordered pagination={{ pageSize: 8 }} />
    </div>
  );
}

export default SupporterAppointments;
