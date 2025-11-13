import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorById } from "../../../services/doctorService";
import { requestFamilyDoctor } from "../../../services/familyService";

function RequestFamilyDoctor() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    requestNote: "",
    schedule: {
      startDate: "",
      frequency: "monthly",
      dayOfMonth: "",
      dayOfWeek: "",
      timeSlot: "",
    },
  });

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const res = await getDoctorById(doctorId);
      if (res.success) setDoctor(res.data);
    } catch (error) {
      console.error("Error fetching doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("schedule.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        schedule: { ...prev.schedule, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      doctorId, 
      ...formData   
    };

    const res = await requestFamilyDoctor(payload);
    if (res.success) {
      alert("Gửi yêu cầu bác sĩ gia đình thành công!");
      navigate("/family-doctors");
    } else {
      alert(res.message || "Không thể gửi yêu cầu");
    }
  } catch (error) {
    alert("Lỗi khi gửi yêu cầu!");
  }
};

  if (loading) return <p className="text-center py-5">Đang tải...</p>;
  if (!doctor) return <p className="text-center py-5">Không tìm thấy bác sĩ.</p>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-primary">
        <i className="fas fa-user-md me-2"></i>Đặt bác sĩ gia đình
      </h2>

      {/* Thông tin bác sĩ */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body d-flex align-items-center">
          {/* Ảnh */}
          <img
            src={doctor.thumbnail}
            alt={doctor.name}
            className="rounded-circle me-3"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />

          <div>
            <h4 className="card-title mb-1">{doctor.name}</h4>
            {doctor.specialization?.name && (
              <p className="mb-1 text-muted">{doctor.specialization.name}</p>
            )}
            {doctor.clinic?.name && (
              <p className="mb-1 text-muted">{doctor.clinic.name}</p>
            )}
            <p className="mb-0">
              <strong>Kinh nghiệm:</strong> {doctor.experience} năm
            </p>
            <p className="mb-0">
              <strong>Số điện thoại:</strong> {doctor.phoneNumber}
            </p>
            <p className="mb-0">
              <strong>Giấy phép:</strong> {doctor.licenseNumber}
            </p>
          </div>
        </div>
      </div>


      {/* Form đăng ký */}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label fw-bold">Ghi chú</label>
          <textarea
            name="requestNote"
            className="form-control"
            rows="3"
            value={formData.requestNote}
            onChange={handleChange}
          />
        </div>

        <h5 className="fw-bold mb-3">Lịch thăm khám định kỳ</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Ngày bắt đầu</label>
            <input
              type="date"
              name="schedule.startDate"
              className="form-control"
              value={formData.schedule.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Tần suất</label>
            <select
              name="schedule.frequency"
              className="form-select"
              value={formData.schedule.frequency}
              onChange={handleChange}
            >
              <option value="weekly">Hàng tuần</option>
              <option value="monthly">Hàng tháng</option>
            </select>
          </div>

          {formData.schedule.frequency === "monthly" ? (
            <div className="col-md-4">
              <label className="form-label">Ngày trong tháng</label>
              <input
                type="number"
                name="schedule.dayOfMonth"
                min="1"
                max="31"
                className="form-control"
                value={formData.schedule.dayOfMonth}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="col-md-4">
              <label className="form-label">Thứ trong tuần</label>
              <select
                name="schedule.dayOfWeek"
                className="form-select"
                value={formData.schedule.dayOfWeek}
                onChange={handleChange}
              >
                <option value="">Chọn thứ</option>
                <option value="0">Chủ nhật</option>
                <option value="1">Thứ 2</option>
                <option value="2">Thứ 3</option>
                <option value="3">Thứ 4</option>
                <option value="4">Thứ 5</option>
                <option value="5">Thứ 6</option>
                <option value="6">Thứ 7</option>
              </select>
            </div>
          )}

          <div className="col-md-4">
            <label className="form-label">Khung giờ</label>
            <input
              type="text"
              name="schedule.timeSlot"
              placeholder="Ví dụ: 09:00 - 10:00"
              className="form-control"
              value={formData.schedule.timeSlot}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4 text-end">
          <button type="submit" className="btn btn-primary px-4">
            Gửi yêu cầu
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestFamilyDoctor;
