import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorSchedule from "../Schedule";
import Goback from "../../../../components/GoBack/index"

function DoctorDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Sửa lỗi: không cần khai báo lại slug
        if (!slug) {
            setError("Không có thông tin bác sĩ");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:3000/doctors/${slug}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(response => {
                console.log("API Response:", response);
                if (response.success) {
                    setData(response.data);
                } else {
                    setError("Không thể tải thông tin bác sĩ");
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                setError("Không thể kết nối đến server");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [slug]);

    const handleBookAppointment = () => {
        navigate(`/appointment/book/${data._id}`);
    };

    if (loading) {
        return (
            <div className="container py-5">
                <Goback />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p className="text-muted">Đang tải thông tin bác sĩ...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <Goback />
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="alert alert-danger text-center">
                            <i className="fas fa-exclamation-triangle fa-3x mb-3"></i>
                            <h4>Có lỗi xảy ra</h4>
                            <p>{error}</p>
                            <div className="d-flex gap-2 justify-content-center">
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
            <div className="container py-5">
                <Goback />
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="alert alert-warning text-center">
                            <i className="fas fa-user-times fa-3x mb-3"></i>
                            <h4>Không tìm thấy thông tin bác sĩ</h4>
                            <p>Bác sĩ bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                            <button
                                className="btn btn-primary"
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
        <div className="container py-5">
            <Goback />

            {/* Header Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="bg-primary text-white p-4 rounded-top">
                        <h1 className="mb-0">
                            <i className="fas fa-user-md me-3"></i>
                            Thông tin bác sĩ
                        </h1>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Main Content */}
                <div className="col-lg-8">
                    {/* Doctor Basic Info Card */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4 text-center">
                                    <img
                                        src={data.thumbnail || '/default-doctor.png'}
                                        alt={data.name}
                                        className="img-fluid rounded-circle shadow"
                                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/200x200/6c757d/ffffff?text=Doctor';
                                        }}
                                    />
                                    <div className="mt-3">
                                        <span className="badge bg-primary fs-6">
                                            {data.experience} năm kinh nghiệm
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <h2 className="text-primary mb-3">{data.name}</h2>

                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <div className="border-start border-primary border-3 ps-3">
                                                <small className="text-muted">Số giấy phép</small>
                                                <div className="fw-bold">{data.licenseNumber}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="border-start border-success border-3 ps-3">
                                                <small className="text-muted">Chuyên khoa</small>
                                                <div className="fw-bold">{data.specializationId?.name}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="border-start border-info border-3 ps-3">
                                                <small className="text-muted">Số điện thoại</small>
                                                <div className="fw-bold">{data.phoneNumber}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="border-start border-warning border-3 ps-3">
                                                <small className="text-muted">Email</small>
                                                <div className="fw-bold">{data.userId?.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specialization Details */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">
                                <i className="fas fa-stethoscope me-2 text-primary"></i>
                                Chuyên khoa: {data.specializationId?.name}
                            </h5>
                        </div>
                        <div className="card-body">
                            <p className="text-muted mb-0">
                                {data.specializationId?.description || 'Không có mô tả chi tiết.'}
                            </p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">
                                <i className="fas fa-info-circle me-2 text-info"></i>
                                Thông tin bổ sung
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <ul className="list-unstyled">
                                        <li className="mb-2">
                                            <i className="fas fa-calendar-alt text-muted me-2"></i>
                                            <strong>Ngày tạo:</strong> {new Date(data.createdAt).toLocaleDateString('vi-VN')}
                                        </li>
                                        <li className="mb-2">
                                            <i className="fas fa-edit text-muted me-2"></i>
                                            <strong>Cập nhật:</strong> {new Date(data.updatedAt).toLocaleDateString('vi-VN')}
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="list-unstyled">
                                        <li className="mb-2">
                                            <i className="fas fa-link text-muted me-2"></i>
                                            <strong>Slug:</strong> <code>{data.slug}</code>
                                        </li>
                                        <li className="mb-2">
                                            <i className="fas fa-id-badge text-muted me-2"></i>
                                            <strong>ID:</strong> <small className="text-muted">{data._id}</small>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <DoctorSchedule />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-lg-4">
                    {/* Clinic Info Card */}
                    {data.clinicId && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">
                                    <i className="fas fa-hospital me-2"></i>
                                    Phòng khám
                                </h5>
                            </div>
                            <div className="card-body">
                                <h6 className="text-success">{data.clinicId?.name}</h6>
                                <div className="mb-3">
                                    <small className="text-muted">Địa chỉ:</small>
                                    <p className="mb-1">
                                        <i className="fas fa-map-marker-alt text-danger me-2"></i>
                                        {data.clinicId?.address}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted">Số điện thoại:</small>
                                    <p className="mb-1">
                                        <i className="fas fa-phone text-primary me-2"></i>
                                        <a href={`tel:${data.clinicId?.phone}`} className="text-decoration-none">
                                            {data.clinicId?.phone}
                                        </a>
                                    </p>
                                </div>
                                {data.clinicId?.description && (
                                    <div>
                                        <small className="text-muted">Mô tả:</small>
                                        <p className="small text-justify">
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
                    <div className="card shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <div className="card-body text-white text-center">
                            <i className="fas fa-calendar-check fa-3x mb-3"></i>
                            <h5 className="card-title">Đặt lịch khám</h5>
                            <div className="mb-3">
                                <span className="badge bg-light text-dark fs-6 px-3 py-2">
                                    Phí tư vấn: {data.consultationFee?.toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>
                            <p className="small opacity-75 mb-4">
                                Đặt lịch ngay để được bác sĩ tư vấn và khám chữa bệnh
                            </p>
                            <button
                                className="btn btn-light btn-lg w-100 text-primary fw-bold"
                                onClick={handleBookAppointment}
                            >
                                <i className="fas fa-calendar-plus me-2"></i>
                                Đặt lịch ngay
                            </button>
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="card shadow-sm mt-4">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0">
                                <i className="fas fa-phone-alt me-2"></i>
                                Liên hệ trực tiếp
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <a
                                    href={`tel:${data.phoneNumber}`}
                                    className="btn btn-outline-primary btn-sm"
                                >
                                    <i className="fas fa-phone me-2"></i>
                                    Gọi điện: {data.phoneNumber}
                                </a>
                                <a
                                    href={`mailto:${data.userId?.email}`}
                                    className="btn btn-outline-secondary btn-sm"
                                >
                                    <i className="fas fa-envelope me-2"></i>
                                    Email: {data.userId?.email}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorDetail;