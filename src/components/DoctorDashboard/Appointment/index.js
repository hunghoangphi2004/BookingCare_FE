import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { getMyAppointmentsByDoctor } from "../../../services/appointmentService";
import { Modal, Button } from "react-bootstrap";

function DoctorCalendar() {
  const [events, setEvents] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getMyAppointmentsByDoctor();

      if (res.success) {
        setDoctor(res.doctor);

        const mappedEvents = res.scheduleWithPatients.map((item) => {
          const patientNames = item.patients
            .map((p) =>
              p.firstName || p.lastName
                ? `${p.firstName} ${p.lastName}`
                : p.email
            )
            .join(", ");

          const date = item.dateBooking; // "YYYY-MM-DD"
          const [startHour, endHour] = item.timeBooking.split("-").map(s => s.trim());

          return {
            title: `👤 ${patientNames}`,
            start: `${date}T${startHour}:00`,
            end: `${date}T${endHour}:00`,
            patients: item.patients,
            backgroundColor: "#4caf50",
            borderColor: "#388e3c",
          };
        });

        setEvents(mappedEvents);
      } else {
        alert(res.message || "Không thể tải dữ liệu lịch khám");
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
    setModalShow(true);
  };


  if (loading) return <p className="text-center py-5">Đang tải lịch khám...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-3 text-primary">
        📅 Lịch khám của bác sĩ {doctor?.name}
      </h2>

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

      {/* Modal chi tiết */}
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết lịch khám</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <p><strong>Thời gian:</strong> {selectedEvent.start.toLocaleString()} - {selectedEvent.end.toLocaleTimeString()}</p>
              <p><strong>Bệnh nhân:</strong></p>
              <ul>
                {selectedEvent.extendedProps.patients.map((p, i) => (
                  <li key={i}>
                    {p.firstName} {p.lastName} - {p.phoneNumber || p.email} ({p.patientId || "—"})
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DoctorCalendar;
