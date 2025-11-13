import { useEffect, useState } from "react";
import { getAllDoctor } from "../../../services/doctorService";
import { createSchedule } from "../../../services/scheduleService";
import { Select, DatePicker, Button, Alert, Modal, Row, Col, Spin } from "antd";
import moment from "moment";

const { Option } = Select;

function Schedule() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const timeArr = [
    "08:00-08:30","08:30-09:00","09:00-09:30","09:30-10:00",
    "10:00-10:30","10:30-11:00","11:00-11:30","11:30-12:00",
    "13:00-13:30","13:30-14:00","14:00-14:30","14:30-15:00",
    "15:00-15:30","15:30-16:00","16:00-16:30","16:30-17:00",
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const result = await getAllDoctor();
        console.log(result)
        setDoctors(result.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctors();
  }, []);

  const handleClickTime = (time) => {
    setSelectedTime((prev) => {
      if (prev.includes(time)) return prev.filter((t) => t !== time);
      return [...prev, time];
    });
  };

  const handleCreateSchedule = () => {
    if (!selectedDoctor || !selectedDate || selectedTime.length === 0) {
      setAlert({
        type: "warning",
        message: "Vui lòng chọn bác sĩ, ngày và giờ trước khi tạo lịch",
        visible: true,
      });
      return;
    }
    setConfirmModalVisible(true);
  };

  const confirmCreateSchedule = async () => {
    setConfirmModalVisible(false);
    setLoading(true);
    setAlert({ visible: false });

    const payload = {
      doctorId: selectedDoctor,
      date: selectedDate.format("DD/MM/YYYY"),
      schedules: selectedTime.map((time) => ({ time })),
    };

    try {
      const result = await createSchedule(payload);
      if (result.success) {
        setAlert({ type: "success", message: "Tạo lịch thành công!", visible: true });
        setSelectedTime([]);
        setSelectedDoctor(null);
        setSelectedDate(null);
      } else {
        setAlert({ type: "error", message: result.message || "Tạo lịch thất bại", visible: true });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Đã xảy ra lỗi khi tạo lịch", visible: true });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 5000);
    }
  };

  return (
    <div>
      {alert.visible && (
        <Alert
          message={alert.message}
          type={alert.type}
          closable
          onClose={() => setAlert((prev) => ({ ...prev, visible: false }))}
          style={{ marginBottom: 16 }}
        />
      )}

      <h4>Bác sĩ</h4>
      <Select
        style={{ width: 250, marginBottom: 20 }}
        placeholder="Chọn bác sĩ"
        value={selectedDoctor}
        onChange={setSelectedDoctor}
      >
        {doctors.map((d) => (
          <Option key={d._id} value={d._id}>{d.name}</Option>
        ))}
      </Select>

      <h4>Chọn ngày</h4>
      <DatePicker
        style={{ marginBottom: 20 }}
        value={selectedDate}
        onChange={setSelectedDate}
      />

      <h4>Chọn khung giờ</h4>
      <Row gutter={[8, 8]}>
        {timeArr.map((time) => (
          <Col key={time} xs={12} sm={8} md={6} lg={4}>
            <Button
              type={selectedTime.includes(time) ? "primary" : "default"}
              block
              onClick={() => handleClickTime(time)}
            >
              {time}
            </Button>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 20 }}>
        <Button
          type="primary"
          onClick={handleCreateSchedule}
          loading={loading}
        >
          {loading ? <Spin /> : "Tạo lịch"}
        </Button>
      </div>

      <Modal
        title="Xác nhận tạo lịch"
        open={confirmModalVisible}
        onOk={confirmCreateSchedule}
        onCancel={() => setConfirmModalVisible(false)}
        okText="Tạo"
        cancelText="Hủy"
      >
        <p>Bạn có chắc muốn tạo lịch này không?</p>
      </Modal>
    </div>
  );
}

export default Schedule;
