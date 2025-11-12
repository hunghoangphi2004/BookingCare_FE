import { useEffect, useState } from "react";
import { getAllSpec } from "../../../services/specializationService";
import { useNavigate } from "react-router-dom";
import { deleteSpecialization } from "../../../services/specializationService";

function Specializations() {
    const [specializations, setSpecializations] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ page: 1, limit: 5 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchSpecializations(filters);
    }, [filters]);

    const fetchSpecializations = async (params = {}) => {
        try {
            setLoading(true);
            const res = await getAllSpec(params);
            console.log(res)
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

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage
        }));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa chuyên khoa này không?")) {
            const res = await deleteSpecialization(id);
            if (res.success) {
                alert("Xóa thành công!");

                const newTotal = (pagination.total || 0) - 1;
                const totalPages = Math.ceil(newTotal / (filters.limit || 5));
                if (filters.page > totalPages && totalPages > 0) {
                    setFilters((prev) => ({ ...prev, page: totalPages }));
                } else {
                    fetchSpecializations(filters);
                }

            } else {
                alert("Lỗi khi xóa!");
            }
        }
    };


    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="mb-5">Danh sách chuyên khoa ({pagination.total || 0})</h2>
            <button
                className="btn btn-primary"
                onClick={() => navigate("/admin/specializations/create")}
            >
                + Thêm mới
            </button>


            <table className="table table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Hình ảnh</th>
                        <th>Tên</th>
                        <th>Slug</th>
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
                            <td>{a.slug}</td>
                            <td>{a.description}</td>
                            <td>
                                <button className="btn btn-success btn-sm me-2" onClick={() => navigate(`/admin/specializations/edit/${a._id}`)}>Sửa</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a._id)}>Xoá</button>
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
