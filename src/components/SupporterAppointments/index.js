import { useEffect, useState } from "react";
import { getAllAppointments } from "../../services/appointmentService";
import { getDoctorById } from "../../services/doctorService";
import { getPatientById } from "../../services/patientService";
import { changeStatusAppointment } from "../../services/appointmentService";

function SupporterAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await getAllAppointments();
      console.log(res)
      if (res.success) {
        const appointmentsWithInfo = await Promise.all(
          res.data.map(async (a) => {
            const doctorRes = await getDoctorById(a.doctorId);
            const patientRes = await getPatientById(a.patientId);
            console.log(patientRes)
            return {
              ...a,
              doctorName: doctorRes.success ? doctorRes.data.name : a.doctorId,
              patientName: patientRes.success && patientRes.data?.patient
                ? `${patientRes.data.patient.firstName} ${patientRes.data.patient.lastName}`
                : a.patientId,
            };
          })
        );
        setAppointments(appointmentsWithInfo);
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
        alert("Cập nhật trạng thái thành công!");
        fetchAppointments()
      } else {
        alert(res.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái!");
    }
  }

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2>Quản lý lịch đặt</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Bác sĩ</th>
            <th>Bệnh nhân</th>
            <th>Ngày</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
            <th>Mô tả</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, idx) => (
            <tr key={a._id}>
              <td>{idx + 1}</td>
              <td>{a.doctorName}</td>
              <td>{a.patientName}</td>
              <td>{a.dateBooking}</td>
              <td>{a.timeBooking}</td>
              <td>{a.status}</td>
              <td>{a.description}</td>
              <td>
                {a.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleUpdateStatus(a._id, "confirmed")}
                    >
                      Chấp thuận
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUpdateStatus(a._id, "cancelled")}
                    >
                      Hủy
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupporterAppointments;
