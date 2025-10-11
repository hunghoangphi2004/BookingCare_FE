import { useEffect, useState } from "react";
import { getAllClinic } from "../../../services/clinicService";

function Clinics() {
    const [Clinics, setClinics] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ page: 1, limit: 10 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchClinics(filters);
    }, [filters]);

    const fetchClinics = async (params = {}) => {
        try {
            console.log(params)
            setLoading(true);
            const res = await getAllClinic(params);
            if (res.success) {
                setClinics(res.data);
                setPagination(res.pagination);
            } else {
                setError(res.message || "Không lấy được dữ liệu");
            }
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra khi lấy dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    //   const handleFilterChange = (e) => {
    //     const specializationId = e.target.value;
    //     setFilters((prev) => ({
    //       ...prev,
    //       specializationId,
    //       page: 1 
    //     }));
    //   };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage
        }));
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="mb-5">Danh sách phòng khám ({pagination.total || 0})</h2>


            <table className="table table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Hình ảnh</th>
                        <th>Tên</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Tình trạng</th>
                    </tr>
                </thead>
                <tbody>
                    {Clinics.map((a, idx) => (
                        <tr key={a._id}>
                            <td>{(filters.page - 1) * (filters.limit || 10) + idx + 1}</td>
                            <td>
                                <img
                                    style={{ width: 80, borderRadius: 8 }}
                                    src={a.image}
                                    alt="thumb"
                                />
                            </td>
                            <td>{a.name}</td>
                            <td>{a.phone}</td>
                            <td>{a.address}</td>
                            <td>
                                <button
                                    className={` ${a.isActive ? "btn btn-success" : "btn btn-warning"
                                        }`}
                                >
                                    {a.isActive ? "Đang hoạt động" : "Đã khóa"}
                                </button>
                            </td>
                            <td>
                                <button className="btn btn-success btn-sm me-2">Xoá</button>
                                <button className="btn btn-danger btn-sm">Sửa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Phân trang */}
            {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-3">
                    {Array.from({ length: pagination.totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`btn ${pagination.page === i + 1
                                ? "btn-primary"
                                : "btn-outline-primary"
                                } btn-sm`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Clinics;
