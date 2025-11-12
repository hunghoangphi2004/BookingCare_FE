import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import Cookies from "js-cookie";
import "moment/locale/vi";

moment.locale("vi");

function DoctorDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctor, setDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");
    const [formData, setFormData] = useState({
        description: "",
    });

    const [error, setError] = useState("");
    const [selectedDay, setSelectedDay] = useState("Thứ 2");

    const daysOfWeek = [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ nhật",
    ];

    const getDateOfWeekday = (dayName) => {
        const today = moment();
        const map = {
            "Chủ nhật": 7,
            "Thứ 2": 1,
            "Thứ 3": 2,
            "Thứ 4": 3,
            "Thứ 5": 4,
            "Thứ 6": 5,
            "Thứ 7": 6,
        };

        const targetWeekday = map[dayName];
        const diff = targetWeekday - today.isoWeekday();
        return today.clone().add(diff >= 0 ? diff : diff + 7, "days");
    };

    const weekDaysWithDates = daysOfWeek.map((day) => {
        const date = getDateOfWeekday(day);
        return {
            day,
            date,
            label: `${day} (${moment(date).format("DD/MM")})`,
        };
    });

    useEffect(() => {
        if (!slug) return;
        const fetchDoctor = async () => {
            try {
                const res = await fetch(`http://localhost:3000/home/get-doctor-by-slug/${slug}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setDoctor(data.data);
                } else {
                    setError("Không tìm thấy thông tin bác sĩ.");
                }
            } catch (err) {
                console.error("Fetch doctor error:", err);
                setError("Lỗi khi tải thông tin bác sĩ.");
            }
        };
        fetchDoctor();
    }, [slug]);

    useEffect(() => {
        if (!slug) return;

        const fetchSchedule = async () => {
            try {
                setLoading(true);
                setError("");

                const date = getDateOfWeekday(selectedDay);
                const formattedDate = moment(date).format("DD-MM-YYYY");

                const res = await fetch(
                    `http://localhost:3000/schedules/${slug}/date/${formattedDate}`
                );

                const data = await res.json();
                console.log(data)
                if (data.success && Array.isArray(data.schedules)) {
                    setSchedule(data.schedules);
                } else {
                    setError("Không có lịch khám cho ngày này.");
                    setSchedule([]);
                }
            } catch (err) {
                setError("Lỗi khi tải lịch khám.");
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [slug, selectedDay]);


    const handleBookClick = (time) => {
        setSelectedTime(time);
        setShowModal(true);
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();

        const profileUser = Cookies.get("profileUser");
        if (!profileUser) {
            alert("Bạn cần đăng nhập để đặt lịch.");
            return navigate("/login");
        }

        const payload = {
            doctorId: doctor._id,
            dateBooking: moment(getDateOfWeekday(selectedDay)).format("YYYY-MM-DD"),
            timeBooking: selectedTime.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/, "$1 - $2"),
            description: formData.description,
        };

        try {
            const res = await fetch("http://localhost:3000/appointments/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", 
                body: JSON.stringify(payload),
            });


            const data = await res.json();

            if (data.success) {
                alert("✅ Đặt lịch thành công!");
                setShowModal(false);

            } else {
                alert("❌ " + (data.message || "Đặt lịch thất bại"));
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi khi đặt lịch, vui lòng thử lại.");
        }
    };


    return (
        <>
            <div className="container mt-4">
                <h2>Thông tin bác sĩ {slug}</h2>

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

                {loading ? (
                    <p>Đang tải lịch khám...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : schedule.length === 0 ? (
                    <p>Không có lịch khám cho ngày này.</p>
                ) : (
                    <div className="row g-2">
                        {schedule.map((s, i) => (
                            <div key={i} className="col-md-3 col-sm-4 col-6">
                                <div
                                    className="border rounded p-2 text-center shadow-sm bg-light"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleBookClick(s.time)}
                                >
                                    {s.time}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showModal && (
                <>
                    <div className="modal fade show" style={{ display: "block" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Đặt lịch khám</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>

                                <form onSubmit={handleSubmitBooking}>
                                    <div className="modal-body">
                                        <p>
                                            <strong>Khung giờ:</strong> {selectedTime}
                                        </p>
                                        <p>
                                            <strong>Ngày:</strong>{" "}
                                            {moment(getDateOfWeekday(selectedDay)).format("DD/MM/YYYY")}
                                        </p>

                                        <div className="mb-3">
                                            <label className="form-label">Mô tả / Triệu chứng</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, description: e.target.value })
                                                }
                                                placeholder="Ví dụ: Đau đầu, chóng mặt 2 ngày nay..."
                                                required
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Hủy
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Xác nhận đặt lịch
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div
                        className="modal-backdrop fade show"
                        style={{ zIndex: 1040 }}
                        onClick={() => setShowModal(false)}
                    ></div>
                </>
            )}

        </>

    );
}

export default DoctorDetail;
