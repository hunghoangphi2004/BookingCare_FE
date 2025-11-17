import { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

// Cấu hình Toast nhẹ nhàng và chuyên nghiệp
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

function BookingModal({ show, onClose, doctor, timeSlot, date }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ description: "" });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Giới hạn tối đa 5 ảnh
        if (files.length + images.length > 5) {
            Toast.fire({
                icon: 'warning',
                title: 'Chỉ được tải lên tối đa 5 ảnh'
            });
            return;
        }

        // Kiểm tra định dạng file
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            Toast.fire({
                icon: 'error',
                title: 'Chỉ chấp nhận file JPG, PNG, GIF'
            });
            return;
        }

        // Kiểm tra kích thước file (tối đa 5MB mỗi file)
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

        // Tạo preview
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

    const handleSubmit = async (e) => {
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

        setLoading(true);

        try {
            // Tạo FormData để gửi cả text và file
            const formDataToSend = new FormData();
            formDataToSend.append('doctorId', doctor._id);
            formDataToSend.append('dateBooking', moment(date).format("YYYY-MM-DD"));
            formDataToSend.append('timeBooking', timeSlot.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/, "$1 - $2"));
            formDataToSend.append('description', formData.description);

            // Thêm các file ảnh
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
                    title: 'Đặt lịch thành công!'
                });
                handleClose();
            } else {
                Toast.fire({
                    icon: 'error',
                    title: data.message || 'Đặt lịch thất bại',
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
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ description: "" });
        setImages([]);
        setImagePreviews([]);
        onClose();
    };

    if (!show) return null;

    return (
        <>
            <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Đặt lịch khám</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={handleClose}
                                disabled={loading}
                            ></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <p><strong>Bác sĩ:</strong> {doctor?.name}</p>
                                <p><strong>Khung giờ:</strong> {timeSlot}</p>
                                <p><strong>Ngày:</strong> {moment(date).format("DD/MM/YYYY")}</p>
                                
                                <div className="mb-3">
                                    <label className="form-label">Mô tả / Triệu chứng</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ description: e.target.value })}
                                        placeholder="Ví dụ: Đau đầu, chóng mặt 2 ngày nay..."
                                        required
                                        disabled={loading}
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
                                        disabled={loading || images.length >= 5}
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
                                                        disabled={loading}
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
                                    onClick={handleClose}
                                    disabled={loading}
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
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
                onClick={!loading ? handleClose : undefined}
            ></div>
        </>
    );
}

export default BookingModal;