import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorSchedule from "../Schedule";
import { getDoctorBySlug } from "../../../../services/homeService";
import "./DoctorDetail.css";

function DoctorDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [familyDoctor, setFamilyDoctor] = useState(false);

    useEffect(() => {
        if (!slug) {
            setError("Không có thông tin bác sĩ");
            setLoading(false);
            return;
        }

        const fetchDoctor = async () => {
            try {
                const response = await getDoctorBySlug(slug);
                if (response.success) {
                    setData(response.data);
                    setFamilyDoctor(response.data.isFamilyDoctor || false);
                } else {
                    setError("Không thể tải thông tin bác sĩ");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Không thể kết nối đến server");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [slug]);

    const handleBookAppointment = () => {
        navigate(`/appointment/book/${data._id}`);
    };

    const handleBookFamilyDoctor = () => {
        navigate(`/gia-dinh/yeu-cau/${data._id}`);
    }

    if (loading) {
        return (
            <div className="container doctor-detail-container">
                <div className="loading-state">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="text-muted">Đang tải thông tin bác sĩ...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container doctor-detail-container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="error-card">
                            <i className="fas fa-exclamation-triangle fa-3x"></i>
                            <h4>Có lỗi xảy ra</h4>
                            <p className="text-muted">{error}</p>
                            <div className="error-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => window.location.reload()}
                                >
                                    <i className="fas fa-sync-alt me-2"></i>
                                    Thử lại
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/')}
                                >
                                    <i className="fas fa-home me-2"></i>
                                    Về trang chủ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container doctor-detail-container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="error-card">
                            <i className="fas fa-user-times fa-3x"></i>
                            <h4>Không tìm thấy thông tin bác sĩ</h4>
                            <p className="text-muted">Bác sĩ bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                            <button
                                className="btn btn-primary mt-3"
                                onClick={() => navigate('/')}
                            >
                                <i className="fas fa-home me-2"></i>
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container doctor-detail-container">

            {/* Header */}
            <div className="row">
                <div className="col-12">
                    <div className="doctor-header">
                        <h1>
                            <i className="fas fa-user-md"></i>
                            Thông tin bác sĩ
                        </h1>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Main Content */}
                <div className="col-lg-8">
                    {/* Doctor Basic Info */}
                    <div className="doctor-card">
                        <div className="doctor-card-body">
                            <div className="row">
                                <div className="col-md-4 doctor-avatar-wrapper">
                                    <img
                                        src={data.thumbnail || '/default-doctor.png'}
                                        alt={data.name}
                                        className="doctor-avatar"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/180x180/6c757d/ffffff?text=BS';
                                        }}
                                    />
                                    <div className="experience-badge">
                                        {data.experience} năm kinh nghiệm
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <h2 className="doctor-name">{data.name}</h2>

                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="info-box">
                                                <small>Số giấy phép</small>
                                                <div className="info-value">{data.licenseNumber}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="info-box success">
                                                <small>Chuyên khoa</small>
                                                <div className="info-value">{data.specializationId?.name}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="info-box info">
                                                <small>Số điện thoại</small>
                                                <div className="info-value">{data.phoneNumber}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="info-box warning">
                                                <small>Email</small>
                                                <div className="info-value">{data.userId?.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Schedule */}
                    <DoctorSchedule />
                </div>

                {/* Sidebar */}
                <div className="col-lg-4">
                    {/* Clinic Info */}
                    {data.clinicId && (
                        <div className="clinic-card">
                            <div className="clinic-card-header">
                                <h5>
                                    <i className="fas fa-hospital me-2"></i>
                                    Phòng khám
                                </h5>
                            </div>
                            <div className="doctor-card-body">
                                <h6 className="clinic-name">{data.clinicId?.name}</h6>
                                
                                <div className="clinic-info-item">
                                    <small>Địa chỉ:</small>
                                    <p>
                                        <i className="fas fa-map-marker-alt text-danger"></i>
                                        {data.clinicId?.address}
                                    </p>
                                </div>

                                <div className="clinic-info-item">
                                    <small>Số điện thoại:</small>
                                    <p>
                                        <i className="fas fa-phone"></i>
                                        <a href={`tel:${data.clinicId?.phone}`}>
                                            {data.clinicId?.phone}
                                        </a>
                                    </p>
                                </div>

                                {data.clinicId?.description && (
                                    <div className="clinic-info-item">
                                        <small>Mô tả:</small>
                                        <p className="small">
                                            {data.clinicId.description.length > 150
                                                ? `${data.clinicId.description.substring(0, 150)}...`
                                                : data.clinicId.description
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Booking Card */}
                    <div className="booking-card">
                        <i className="fas fa-calendar-check"></i>
                        <h5>Đặt lịch khám</h5>
                        <div className="consultation-fee">
                            Phí tư vấn: {data.consultationFee?.toLocaleString('vi-VN')} VNĐ
                        </div>
                        <p>
                            Đặt lịch ngay để được bác sĩ tư vấn và khám chữa bệnh
                        </p>
                        <button
                            className="btn-book-now"
                            onClick={handleBookAppointment}
                        >
                            <i className="fas fa-calendar-plus me-2"></i>
                            Đặt lịch ngay
                        </button>
                    </div>

                    {/* Contact Card */}
                    <div className="contact-card">
                        <div className="contact-card-header">
                            <h6>
                                <i className="fas fa-phone-alt me-2"></i>
                                Liên hệ trực tiếp
                            </h6>
                        </div>
                        <div className="doctor-card-body">
                            <div className="contact-buttons">
                                <a
                                    href={`tel:${data.phoneNumber}`}
                                    className="btn-contact primary"
                                >
                                    <i className="fas fa-phone"></i>
                                    Gọi: {data.phoneNumber}
                                </a>
                                <a
                                    href={`mailto:${data.userId?.email}`}
                                    className="btn-contact secondary"
                                >
                                    <i className="fas fa-envelope"></i>
                                    Email: {data.userId?.email}
                                </a>

                                {familyDoctor && (
                                    <button
                                        className="btn-contact success"
                                        onClick={handleBookFamilyDoctor}
                                    >
                                        <i className="fas fa-hand-holding-medical"></i>
                                        Bác sĩ gia đình
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorDetail;