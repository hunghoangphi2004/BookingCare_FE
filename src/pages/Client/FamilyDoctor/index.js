import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllFamilyDoctors } from "../../../services/familyService";
import DoctorCard from "../../../components/DoctorCard";
import SearchFilter from "../../../components/SearchFilter";

function FamilyDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        specializationId: '',
        clinicId: '',
        keyword: ''
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalDoctors: 0,
        limit: 9
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchFamilyDoctors();
    }, [pagination.currentPage]);

    const fetchFamilyDoctors = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await getAllFamilyDoctors(
                filters,
                pagination.currentPage,
                pagination.limit
            );

            if (result.success) {
                setDoctors(result.data || []);
                setPagination(prev => ({
                    ...prev,
                    totalPages: result.totalPages || 1,
                    totalDoctors: result.total || 0
                }));
            } else {
                setError(result.message || 'Không thể tải danh sách bác sĩ');
            }
        } catch (error) {
            console.error("Error fetching family doctors:", error);
            setError('Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        setTimeout(() => fetchFamilyDoctors(), 0);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDoctorClick = (slug) => {
        navigate(`/doctor/${slug}`);
    };

    const handleRequestDoctor = (doctorId) => {
        navigate(`/family/request/${doctorId}`);
    };

    if (loading && pagination.currentPage === 1) {
        return (
            <div className="container py-5">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p className="text-muted">Đang tải danh sách bác sĩ gia đình...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center">
                    <i className="fas fa-exclamation-triangle fa-3x mb-3"></i>
                    <h4>Có lỗi xảy ra</h4>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={fetchFamilyDoctors}>
                        <i className="fas fa-sync-alt me-2"></i>Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="family-doctors-page">
            {/* Hero Section */}
            <section className="bg-primary text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-4 fw-bold mb-3">
                                <i className="fas fa-user-md me-3"></i>
                                Bác Sĩ Gia Đình
                            </h1>
                            <p className="lead mb-0">
                                Tìm kiếm và đăng ký bác sĩ gia đình phù hợp cho gia đình bạn
                            </p>
                        </div>
                        <div className="col-lg-4 text-lg-end">
                            <div className="bg-white text-primary rounded p-3 d-inline-block">
                                <h3 className="mb-0 fw-bold">{pagination.totalDoctors}</h3>
                                <small>Bác sĩ có sẵn</small>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Filter */}
            <SearchFilter filters={filters} onSearch={handleSearch} />

            {/* Doctors List */}
            <section className="py-5">
                <div className="container">
                    {doctors.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-user-md fa-5x text-muted mb-4"></i>
                            <h4 className="text-muted">Không tìm thấy bác sĩ gia đình</h4>
                            <p className="text-muted">Vui lòng thử lại với bộ lọc khác</p>
                        </div>
                    ) : (
                        <>
                            <div className="row g-4">
                                {doctors.map((doctor) => (
                                    <div key={doctor._id} className="col-lg-4 col-md-6">
                                        <DoctorCard
                                            doctor={doctor}
                                            onViewDetail={() => handleDoctorClick(doctor.slug)}
                                            onRequest={() => handleRequestDoctor(doctor._id)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <nav className="mt-5">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                disabled={pagination.currentPage === 1}
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                        </li>
                                        {[...Array(pagination.totalPages)].map((_, index) => (
                                            <li
                                                key={index + 1}
                                                className={`page-item ${pagination.currentPage === index + 1 ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                disabled={pagination.currentPage === pagination.totalPages}
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default FamilyDoctors;