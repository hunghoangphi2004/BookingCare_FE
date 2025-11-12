import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { createSchedule } from "../../../services/scheduleService";
import { getProfileAdmin } from "../../../services/authService";

function ScheduleDoctor() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileAdmin();
        console.log(data)
        if (data) {
          if (data.role === "doctor") {
            setDoctorId(data.doctorProfile._id);
            setDoctorName(data.doctorProfile.name);
          } else {
            setMessage("❌ Tài khoản này không phải bác sĩ!");
          }
        } else {
          setMessage("❌ Không tìm thấy thông tin đăng nhập, vui lòng đăng nhập lại!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy profile:", error);
        setMessage("⚠️ Lỗi khi lấy thông tin tài khoản!");
      }
    };

    fetchProfile();
  }, []);

  const handleClickTime = (item) => {
    setSelectedTime((prev) => {
      const isSelected = prev.includes(item);
      return isSelected
        ? prev.filter((t) => t !== item)
        : [...prev, item];
    });
  };

  const handleChangeDate = (e) => {
    const [year, month, day] = e.target.value.split("-");
    setSelectedDate(`${day}/${month}/${year}`);
  };

  const handleCreateSchedule = async () => {
    if (!doctorId || !selectedDate || selectedTime.length === 0) {
      setMessage("Vui lòng chọn ngày và giờ trước khi tạo lịch!");
      return;
    }

    const payload = {
      doctorId,
      date: selectedDate,
      schedules: selectedTime.map((time) => ({ time })),
    };

    try {
      setLoading(true);
      const result = await createSchedule(payload);
      if (result.success) {
        setMessage("✅ Tạo lịch thành công!");
        setSelectedTime([]);
      } else {
        setMessage(result.message || "Tạo lịch thất bại!");
      }
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi tạo lịch!");
    } finally {
      setLoading(false);
    }
  };

  const timeArr = [
    "08:00-08:30", "08:30-09:00", "09:00-09:30", "09:30-10:00",
    "10:00-10:30", "10:30-11:00", "11:00-11:30", "11:30-12:00",
    "13:00-13:30", "13:30-14:00", "14:00-14:30", "14:30-15:00",
    "15:00-15:30", "15:30-16:00", "16:00-16:30", "16:30-17:00",
  ];

  return (
    <div className="container mt-3">
      <p>Vui lòng chọn ngày và khung giờ để tạo lịch khám</p>

      <div className="mb-3">
        <label htmlFor="date" className="form-label fw-bold">Chọn ngày:</label>
        <input
          type="date"
          id="date"
          className="form-control"
          style={{ width: "auto" }}
          onChange={handleChangeDate}
        />
      </div>

      <h6 className="fw-bold">Chọn khung giờ:</h6>
      {timeArr.map((item, index) => (
        <button
          key={index}
          value={item}
          className={`btn m-1 ${selectedTime.includes(item) ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => handleClickTime(item)}
        >
          {item}
        </button>
      ))}

      <div>
        <button
          className="btn btn-success mt-3"
          onClick={handleCreateSchedule}
          disabled={loading || !selectedDate || selectedTime.length === 0}
        >
          {loading ? "Đang tạo..." : "Tạo lịch"}
        </button>
      </div>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default ScheduleDoctor;
