function DoctorCard({ doctor, onViewDetail, onRequest }) {
    return (
        <div className="card h-100 shadow-sm hover-shadow">
            <div className="card-body">
                <div className="d-flex align-items-start mb-3">
                    <img
                        src={doctor.thumbnail || 'https://via.placeholder.com/100x100/6c757d/ffffff?text=Doctor'}
                        alt={doctor.name}
                        className="rounded-circle me-3"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={onViewDetail}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100x100/6c757d/ffffff?text=Doctor';
                        }}
                    />
                    <div className="flex-grow-1">
                        <h5 
                            className="mb-1 text-primary" 
                            style={{ cursor: 'pointer' }}
                            onClick={onViewDetail}
                        >
                            {doctor.name}
                        </h5>
                        <small className="text-muted d-block mb-2">
                            <i className="fas fa-certificate me-1"></i>
                            {doctor.licenseNumber}
                        </small>
                        <span className="badge bg-success">
                            {doctor.experience} năm kinh nghiệm
                        </span>
                    </div>
                </div>

                <div className="mb-3">
                    {doctor.specializationId && (
                        <div className="mb-2">
                            <i className="fas fa-stethoscope text-primary me-2"></i>
                            <small className="text-muted">Chuyên khoa:</small>
                            <span className="ms-1">{doctor.specializationId.name}</span>
                        </div>
                    )}
                    
                    {doctor.clinicId && (
                        <div className="mb-2">
                            <i className="fas fa-hospital text-success me-2"></i>
                            <small className="text-muted">Phòng khám:</small>
                            <span className="ms-1">{doctor.clinicId.name}</span>
                        </div>
                    )}

                    <div className="mb-2">
                        <i className="fas fa-phone text-info me-2"></i>
                        <small className="text-muted">SĐT:</small>
                        <a href={`tel:${doctor.phoneNumber}`} className="ms-1 text-decoration-none">
                            {doctor.phoneNumber}
                        </a>
                    </div>
                </div>

                <div className="border-top pt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted small">Phí tư vấn:</span>
                        <span className="fw-bold text-primary">
                            {doctor.consultationFee?.toLocaleString('vi-VN')} VNĐ
                        </span>
                    </div>

                    <div className="d-grid gap-2">
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={onRequest}
                        >
                            <i className="fas fa-user-plus me-2"></i>
                            Đăng ký bác sĩ gia đình
                        </button>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={onViewDetail}
                        >
                            <i className="fas fa-info-circle me-2"></i>
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorCard;