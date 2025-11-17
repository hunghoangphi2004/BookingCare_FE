import { Link } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import moment from "moment";
import "moment/locale/vi";
import { getAllFeaturedDoctor } from "../../../../services/homeService";
import BookingModal from "../../../../components/ScheduleBooking/index";

moment.locale("vi");
const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

const DAYS_OF_WEEK = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const WEEKDAY_MAP = { 
    "Chủ nhật": 7, "Thứ 2": 1, "Thứ 3": 2, 
    "Thứ 4": 3, "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6 
};

function FeaturedDoctor() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState({});
    const [selectedDay, setSelectedDay] = useState("Thứ 2");
    
    const [showModal, setShowModal] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const weekDaysWithDates = useMemo(() => {
        const getDateOfWeekday = (dayName) => {
            const today = moment();
            const targetWeekday = WEEKDAY_MAP[dayName];
            const diff = targetWeekday - today.isoWeekday();
            return today.clone().add(diff >= 0 ? diff : diff + 7, "days");
        };

        return DAYS_OF_WEEK.map((day) => {
            const date = getDateOfWeekday(day);
            return { 
                day, 
                date, 
                label: `${day} (${moment(date).format("DD/MM")})` 
            };
        });
    }, []);

    const selectedDate = useMemo(() => {
        return weekDaysWithDates.find(item => item.day === selectedDay)?.date;
    }, [selectedDay, weekDaysWithDates]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getAllFeaturedDoctor();
                console.log(result);
                setDoctors(result.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchSchedule = useCallback(async (doctorSlug, date) => {
        const formattedDate = moment(date).format("DD-MM-YYYY");
        try {
            const res = await fetch(`${API_DOMAIN}/schedules/${doctorSlug}/date/${formattedDate}`);
            const data = await res.json();
            
            setSchedules((prev) => ({ 
                ...prev, 
                [doctorSlug]: data.success && Array.isArray(data.schedules) ? data.schedules : [] 
            }));
        } catch (err) {
            console.error(err);
            setSchedules((prev) => ({ ...prev, [doctorSlug]: [] }));
        }
    }, []);

    useEffect(() => {
        if (doctors.length > 0 && selectedDate) {
            doctors.forEach((doc) => fetchSchedule(doc.slug, selectedDate));
        }
    }, [doctors, selectedDate, fetchSchedule]);

    const handleBookClick = useCallback((doctor, time) => {
        setSelectedTime(time);
        setSelectedDoctor(doctor);
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedTime("");
        setSelectedDoctor(null);
    }, []);

    return (
        <div className="container mt-4">
            <div className="clinic-detail mb-4 d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-4 my-3">Bác sĩ nổi bật:</span>
                <div className="mb-3">
                    <label className="fw-bold">Chọn ngày:</label>
                    <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="form-select mt-2"
                        style={{ width: "250px" }}
                    >
                        {weekDaysWithDates.map((item) => (
                            <option key={item.day} value={item.day}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <p>Đang tải danh sách bác sĩ...</p>
            ) : doctors.length === 0 ? (
                <p className="text-center text-muted">Không có bác sĩ nào.</p>
            ) : (
                doctors.map((doc) => (
                    <DoctorCard
                        key={doc._id}
                        doctor={doc}
                        schedules={schedules[doc.slug] || []}
                        onBookClick={handleBookClick}
                    />
                ))
            )}

            <BookingModal
                show={showModal}
                onClose={handleCloseModal}
                doctor={selectedDoctor}
                timeSlot={selectedTime}
                date={selectedDate}
            />
        </div>
    );
}

function DoctorCard({ doctor, schedules, onBookClick }) {
    return (
        <div className="doctor-box p-3 mb-4 rounded">
            <div className="row align-items-start" style={{ marginLeft: 0, marginRight: 0 }}>
                <div className="col-md-6 d-flex justify-content-start p-0">
                    <div className="me-3 doctor-info-left text-start">
                        <img
                            src={doctor.thumbnail}
                            alt={doctor.name}
                            className="img-fluid rounded mb-2"
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        />
                        <div className="text-center">
                            <Link to={`/bac-si/${doctor.slug}`}>Xem thêm</Link>
                        </div>
                    </div>
                    <div className="doctor-info-right">
                        <p className="fw-bold mb-1">Bác sĩ {doctor.name}</p>
                        <p className="mb-1">{doctor.clinicId.name}</p>
                        <p className="mb-0">
                            <span className="fw-semibold">Địa chỉ:</span> {doctor.clinicId.address}
                        </p>
                    </div>
                </div>

                <div className="col-md-6">
                    <p>
                        <i className="bi bi-calendar-event me-2"></i> Lịch khám
                    </p>
                    {schedules.length > 0 ? (
                        <div className="container">
                            <div className="row g-2">
                                {schedules.map((s, i) => (
                                    <div key={i} className="col-md-3 col-sm-4 col-6">
                                        <div
                                            className="border rounded p-2 text-center shadow-sm bg-light"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => onBookClick(doctor, s.time)}
                                        >
                                            {s.time}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Không có lịch khám cho ngày này.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FeaturedDoctor;