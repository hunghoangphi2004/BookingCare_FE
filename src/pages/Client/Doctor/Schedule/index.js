import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "moment/locale/vi";

moment.locale("vi");

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

function DoctorSchedule() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctor, setDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");
    const [formData, setFormData] = useState({ description: "" });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [selectedDay, setSelectedDay] = useState("Thứ 2");

    const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

    const getDateOfWeekday = (dayName) => {
        const today = moment();
        const map = { "Chủ nhật": 7, "Thứ 2": 1, "Thứ 3": 2, "Thứ 4": 3, "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6 };
        const targetWeekday = map[dayName];
        const diff = targetWeekday - today.isoWeekday();
        return today.clone().add(diff >= 0 ? diff : diff + 7, "days");
    };

    const weekDaysWithDates = daysOfWeek.map((day) => {
        const date = getDateOfWeekday(day);
        return { day, date, label: `${day} (${moment(date).format("DD/MM")})` };
    });

    useEffect(() => {
        if (!slug) return;
        const fetchDoctor = async () => {
            try {
                const res = await fetch(`${API_DOMAIN}/home/get-doctor-by-slug/${slug}`);
                const data = await res.json();
                if (data.success && data.data) setDoctor(data.data);
                else setError("Không tìm thấy thông tin bác sĩ.");
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
                const res = await fetch(`${API_DOMAIN}/schedules/${slug}/date/${formattedDate}`);
                const data = await res.json();
                if (data.success && Array.isArray(data.schedules)) setSchedule(data.schedules);
                else {
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length + images.length > 5) {
            Toast.fire({
                icon: 'warning',
                title: 'Chỉ được tải lên tối đa 5 ảnh'
            });
            return;
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            Toast.fire({
                icon: 'error',
                title: 'Chỉ chấp nhận file JPG, PNG, GIF'
            });
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        const oversizedFiles = files.filter(file => file.size > maxSize);
        
        if (oversizedFiles.length > 0) {
            Toast.fire({
                icon: 'error',
                title: 'Mỗi ảnh không được vượt quá 5MB'
            });
            return;
        }

        setImages(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleBookClick = (time) => {
        setSelectedTime(time);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ description: "" });
        setImages([]);
        setImagePreviews([]);
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();

        const profileUser = Cookies.get("profileUser");
        if (!profileUser) {
            const result = await Swal.fire({
                title: 'Yêu cầu đăng nhập',
                text: 'Bạn cần đăng nhập để đặt lịch khám',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Đăng nhập',
                cancelButtonText: 'Hủy'
            });
            
            if (result.isConfirmed) {
                navigate("/dang-nhap");
            }
            return;
        }

        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('doctorId', doctor._id);
            formDataToSend.append('dateBooking', moment(getDateOfWeekday(selectedDay)).format("YYYY-MM-DD"));
            formDataToSend.append('timeBooking', selectedTime.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/, "$1 - $2"));
            formDataToSend.append('description', formData.description);

            images.forEach((image) => {
                formDataToSend.append('images', image);
            });

            const res = await fetch(`${API_DOMAIN}/appointments/create`, {
                method: "POST",
                credentials: "include",
                body: formDataToSend,
            });
            
            const data = await res.json();
            
            if (data.success) {
                Toast.fire({
                    icon: 'success',
                    title: 'Yêu cầu đặt lịch thành công, vui lòng kiểm tra email để xác nhận!'
                });
                handleCloseModal();
            } else {
                Toast.fire({
                    icon: 'error',
                    title: data.message || 'Yêu cầu đặt lịch thất bại',
                    timer: 4000
                });
            }
        } catch (err) {
            console.error(err);
            Toast.fire({
                icon: 'error',
                title: 'Lỗi kết nối, vui lòng thử lại',
                timer: 4000
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="container mt-4 my-5">
                <h2>Lịch khám:</h2>
                <div className="mb-3">
                    <label className="fw-bold">Chọn ngày:</label>
                    <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="form-select mt-2"
                        style={{ width: "250px" }}
                    >
                        {weekDaysWithDates.map((item) => (
                            <option key={item.day} value={item.day}>{item.label}</option>
                        ))}
                    </select>
                </div>

                {loading ? (<p>Đang tải lịch khám...</p>) :
                    error ? (<p className="text-danger">{error}</p>) :
                        schedule.length === 0 ? (<p>Không có lịch khám cho ngày này.</p>) :
                            (<div className="row g-2">
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
                            </div>)
                }
            </div>

            {showModal && (
                <>
                    <div className="modal fade show" style={{ display: "block" }}>
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Đặt lịch khám</h5>
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={handleCloseModal}
                                        disabled={submitting}
                                    ></button>
                                </div>

                                <form onSubmit={handleSubmitBooking}>
                                    <div className="modal-body">
                                        <p><strong>Bác sĩ:</strong> {doctor?.name}</p>
                                        <p><strong>Khung giờ:</strong> {selectedTime}</p>
                                        <p><strong>Ngày:</strong> {moment(getDateOfWeekday(selectedDay)).format("DD/MM/YYYY")}</p>
                                        
                                        <div className="mb-3">
                                            <label className="form-label">Mô tả / Triệu chứng</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ description: e.target.value })}
                                                placeholder="Ví dụ: Đau đầu, chóng mặt 2 ngày nay..."
                                                required
                                                disabled={submitting}
                                            ></textarea>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Ảnh đính kèm (tối đa 5 ảnh)
                                                <span className="text-muted ms-2" style={{ fontSize: '0.875rem' }}>
                                                    - Tùy chọn
                                                </span>
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                disabled={submitting || images.length >= 5}
                                            />
                                            <small className="text-muted">
                                                Định dạng: JPG, PNG, GIF. Tối đa 5MB/ảnh
                                            </small>
                                        </div>

                                        {imagePreviews.length > 0 && (
                                            <div className="mb-3">
                                                <label className="form-label">Ảnh đã chọn ({images.length}/5):</label>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div 
                                                            key={index} 
                                                            className="position-relative"
                                                            style={{ width: '100px', height: '100px' }}
                                                        >
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="img-thumbnail"
                                                                style={{ 
                                                                    width: '100%', 
                                                                    height: '100%', 
                                                                    objectFit: 'cover' 
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                                style={{ 
                                                                    padding: '2px 6px', 
                                                                    fontSize: '0.75rem',
                                                                    borderRadius: '50%'
                                                                }}
                                                                onClick={() => removeImage(index)}
                                                                disabled={submitting}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="modal-footer">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            onClick={handleCloseModal}
                                            disabled={submitting}
                                        >
                                            Hủy
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                "Xác nhận đặt lịch"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div 
                        className="modal-backdrop fade show" 
                        style={{ zIndex: 1040 }} 
                        onClick={!submitting ? handleCloseModal : undefined}
                    ></div>
                </>
            )}
        </>
    );
}

export default DoctorSchedule;