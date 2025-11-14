import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";

import { getMyAppointmentsByDoctor } from "../../../services/appointmentService";
import { Modal, Typography, Tag, Card, Avatar, Space, Divider } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function DoctorCalendar() {
  const [events, setEvents] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getMyAppointmentsByDoctor();

      if (res.success) {
        setDoctor(res.doctor);

        const mappedEvents = res.scheduleWithPatients.map((item) => {
          const date = item.dateBooking;
          const [startHour, endHour] = item.timeBooking.split("-").map((s) => s.trim());

          const isBooked = item.patients.length > 0;

          return {
            title: isBooked ? "🔵 Có bệnh nhân" : "🟢 Trống",
            start: `${date}T${startHour}:00`,
            end: `${date}T${endHour}:00`,
            backgroundColor: isBooked ? "#81c784" : "#64b5f6",
            borderColor: isBooked ? "#4caf50" : "#42a5f5",
            patients: item.patients,
            original: item,
          };
        });

        setEvents(mappedEvents);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Text type="secondary">Đang tải lịch khám...</Text>
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* Header đẹp */}
      <Card style={{ borderRadius: 12, padding: 15, marginBottom: 25 }}>
        <Space align="center" size={16}>
          <Avatar
            size={64}
            src={doctor?.thumbnail}
            icon={<UserOutlined />}
          />
          <div>
            <Title level={3} style={{ marginBottom: 0 }}>
              📅 Lịch khám của {doctor?.name}
            </Title>
            <Text type="secondary">
              <CalendarOutlined /> Lịch làm việc trong tuần
            </Text>
          </div>
        </Space>
      </Card>

      {/* Calendar trong Card đẹp */}
      <Card style={{ borderRadius: 14, boxShadow: "0 4px 18px rgba(0,0,0,0.06)" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locale={viLocale}
          events={events}
          eventClick={handleEventClick}
          nowIndicator={true}
          allDaySlot={false}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          height="auto"
        />
      </Card>

      {/* Modal đẹp */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => setModalOpen(false)}
        okText="Đóng"
        title="📌 Chi tiết lịch khám"
        style={{ top: 90 }}
      >
        {selectedEvent && (
          <>
            <Text strong>🕒 Thời gian:</Text>
            <p>
              {selectedEvent.start.toLocaleString("vi-VN")} –{" "}
              {selectedEvent.end.toLocaleTimeString("vi-VN")}
            </p>

            <Divider />

            <Text strong>📍 Trạng thái:</Text>
            <p>
              {selectedEvent.extendedProps.patients.length ? (
                <Tag color="green">Đã có bệnh nhân</Tag>
              ) : (
                <Tag color="blue">Chưa có bệnh nhân</Tag>
              )}
            </p>

            <Divider />

            <Text strong>👥 Bệnh nhân:</Text>
            {selectedEvent.extendedProps.patients.length ? (
              <ul style={{ marginTop: 8 }}>
                {selectedEvent.extendedProps.patients.map((p, i) => (
                  <li key={i}>
                    <strong>{p.firstName} {p.lastName}</strong>  
                    <br />
                    <Text type="secondary">{p.phoneNumber || p.email}</Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Text type="secondary">Không có ai đặt lịch.</Text>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}

export default DoctorCalendar;
