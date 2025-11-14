import { useEffect, useState } from "react";
import {
  DatePicker,
  Button,
  Tag,
  Card,
  Alert,
  Spin,
  Typography,
  Space,
  message as AntMessage,
} from "antd";
import { createSchedule } from "../../../services/scheduleService";
import { getProfileAdmin } from "../../../services/authService";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function ScheduleDoctor() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successAlert, setSuccessAlert] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileAdmin();
        if (data) {
          if (data.role === "doctor") {
            setDoctorId(data.doctorProfile._id);
            setDoctorName(data.doctorProfile.name);
          } else {
            setErrorMessage("❌ Tài khoản này không phải bác sĩ!");
          }
        } else {
          setErrorMessage("❌ Không tìm thấy thông tin đăng nhập, vui lòng đăng nhập lại!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy profile:", error);
        setErrorMessage("⚠️ Lỗi khi lấy thông tin tài khoản!");
      }
    };

    fetchProfile();
  }, []);

  const handleClickTime = (item) => {
    setSelectedTime((prev) => {
      const isSelected = prev.includes(item);
      return isSelected ? prev.filter((t) => t !== item) : [...prev, item];
    });
  };

  const handleChangeDate = (date) => {
    if (!date) {
      setSelectedDate("");
      return;
    }
    setSelectedDate(dayjs(date).format("DD/MM/YYYY"));
  };

  const handleCreateSchedule = async () => {
    if (!doctorId || !selectedDate || selectedTime.length === 0) {
      AntMessage.error("Vui lòng chọn ngày và giờ trước khi tạo lịch!");
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
        AntMessage.success("Tạo lịch thành công!");
        setSuccessAlert("Tạo lịch thành công!");
        setSelectedTime([]);

        // Auto hide alert sau 3 giây
        setTimeout(() => {
          setSuccessAlert("");
        }, 3000);
      } else {
        AntMessage.error(result.message || "Tạo lịch thất bại!");
        setSuccessAlert("");
      }
    } catch (error) {
      console.error(error);
      AntMessage.error("Có lỗi xảy ra khi tạo lịch!");
      setSuccessAlert("");
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

  if (!doctorId && !errorMessage) return <Spin style={{ marginTop: 40 }} />;

  return (
    <Card
      style={{
        maxWidth: 700,
        margin: "20px auto",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <Title level={4}>Tạo lịch khám</Title>

      {doctorName && (
        <Alert
          message={`Bác sĩ: ${doctorName}`}
          type="info"
          style={{ marginBottom: 16 }}
        />
      )}

      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Chọn ngày */}
      <div style={{ marginBottom: 20 }}>
        <Text strong>Chọn ngày:</Text>
        <br />
        <DatePicker
          format="DD/MM/YYYY"
          onChange={handleChangeDate}
          style={{ marginTop: 6 }}
        />
      </div>

      {/* Chọn giờ */}
      <Text strong>Chọn khung giờ:</Text>

      <div style={{ marginTop: 10, marginBottom: 20 }}>
        {timeArr.map((item, index) => {
          const isSelected = selectedTime.includes(item);
          return (
            <Tag.CheckableTag
              key={index}
              checked={isSelected}
              onChange={() => handleClickTime(item)}
              style={{
                padding: "8px 14px",
                fontSize: 14,
                borderRadius: 6,
                margin: 6,
              }}
            >
              {item}
            </Tag.CheckableTag>
          );
        })}
      </div>

      <Space>
        <Button
          type="primary"
          loading={loading}
          disabled={!selectedDate || selectedTime.length === 0}
          onClick={handleCreateSchedule}
        >
          Tạo lịch
        </Button>
      </Space>

      {/* Alert thành công */}
      {successAlert && (
        <Alert
          type="success"
          message={successAlert}
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </Card>
  );
}

export default ScheduleDoctor;
