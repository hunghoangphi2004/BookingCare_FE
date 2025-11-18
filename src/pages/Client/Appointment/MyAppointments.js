import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import Cookies from "js-cookie";
import "./MyAppointments.css";
import { getMyAppointmentsByUser } from "../../../services/appointmentService";
import Swal from "sweetalert2";

moment.locale("vi");

function MyAppointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = Cookies.get("profileUser");
                if (!token) {
                    await Swal.fire({
                        title: 'Yêu cầu đăng nhập',
                        text: 'Bạn cần đăng nhập để xem lịch hẹn',
                        icon: 'info',
                        confirmButtonText: 'Đăng nhập',
                        confirmButtonColor: '#0d6efd'
                    });
                    navigate("/dang-nhap");
                    return;
                }

                const data = await getMyAppointmentsByUser();
                if (data.success) {
                    setAppointments(data.data);
                } else {
                    setError("Không thể tải danh sách lịch hẹn");
                }
            } catch (err) {
                console.error(err);
                setError("Có lỗi xảy ra khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [navigate]);

    const getStatusText = (status) => {
        const statusMap = {
            pending: "Chờ xác nhận",
            confirmed: "Đã xác nhận",
            completed: "Hoàn thành",
            cancelled: "Đã hủy"
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            pending: "status-pending",
            confirmed: "status-confirmed",
            completed: "status-completed",
            cancelled: "status-cancelled"
        };
        return classMap[status] || "";
    };

    const handleViewImages = (images) => {
        setSelectedImages(images);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImages([]);
    };

    if (loading) {
        return (
            <div className="appointments-container">
                <div className="loading-wrapper">
                    <div className="spinner"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="appointments-container">
            <div className="appointments-header">
                <h2>Lịch hẹn của tôi</h2>
            </div>

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            {appointments.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <p>Bạn chưa có lịch hẹn nào</p>
                    <button className="btn-primary" onClick={() => navigate("/")}>
                        Đặt lịch khám
                    </button>
                </div>
            ) : (
                <div className="appointments-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Bác sĩ</th>
                                <th>Ngày khám</th>
                                <th>Giờ khám</th>
                                <th>Trạng thái</th>
                                <th>Ảnh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>
                                        <div className="doctor-cell">
                                            <span>{appointment.doctorId?.name}</span>
                                        </div>
                                    </td>
                                    <td>{moment(appointment.dateBooking).format("DD/MM/YYYY")}</td>
                                    <td>{appointment.timeBooking}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                                            {getStatusText(appointment.status)}
                                        </span>
                                    </td>
                                    <td>
                                        {appointment.images && appointment.images.length > 0 ? (
                                            <button
                                                className="btn-view-images"
                                                onClick={() => handleViewImages(appointment.images)}
                                            >
                                                Xem ảnh ({appointment.images.length})
                                            </button>
                                        ) : (
                                            <span className="no-images">Không có</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Image Modal */}
            {showImageModal && (
                <>
                    <div className="modal-overlay" onClick={closeImageModal}>
                        <div className="image-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="close-modal" onClick={closeImageModal}>×</button>
                            <h3>Ảnh đính kèm</h3>
                            <div className="images-grid">
                                {selectedImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Ảnh ${idx + 1}`}
                                        onClick={() => window.open(img, '_blank')}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default MyAppointments;