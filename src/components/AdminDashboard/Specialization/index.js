import { useEffect, useState } from "react";
import { getAllSpec } from "../../../services/specializationService";

function Specializations() {
    const [specializations, setSpecializations] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ page: 1, limit: 10 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSpecializations(filters);
    }, [filters]);

    const fetchSpecializations = async (params = {}) => {
        try {
            console.log(params)
            setLoading(true);
            const res = await getAllSpec(params);
            if (res.success) {
                setSpecializations(res.data);
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
            <h2 className="mb-5">Danh sách chuyên khoa ({pagination.total || 0})</h2>


            <table className="table table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Hình ảnh</th>
                        <th>Tên</th>
                        <th>Mô tả</th>
                    </tr>
                </thead>
                <tbody>
                    {specializations.map((a, idx) => (
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
                            <td>{a.description}</td>
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

export default Specializations;
