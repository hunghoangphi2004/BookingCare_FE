import { useEffect, useState } from "react";
import { updateMedicine,deleteMedicine ,getAllMedicine} from "../../../services/medicineService";
import { useNavigate } from "react-router-dom";


function Medicines() {
    const [medicines, setMedicines] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ page: 1, limit: 5 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        fetchMedicines(filters);
    }, [filters]);

    const fetchMedicines = async (params = {}) => {
        try {
            setLoading(true);
            const res = await getAllMedicine(params);
            if (res.success) {
                setMedicines(res.data);
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

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa thuốc này không?")) {
            const res = await deleteMedicine(id);
            if (res.success) {
                alert("Xóa thành công!");
                setMedicines((prev) => prev.filter((d) => d._id !== id));
                setPagination((prev) => {
                    const newTotal = (prev.total || 0) - 1;
                    const totalPages = Math.ceil(newTotal / (filters.limit || 10));

                    if (filters.page > totalPages && totalPages > 0) {
                        setFilters((f) => ({ ...f, page: totalPages }));
                    }

                    return {
                        ...prev,
                        total: newTotal,
                        totalPages,
                    };
                });
            } else {
                alert("Lỗi khi xóa!");
            }
        }
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage
        }));
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <>
            <div>
                <h2 className="mb-5">Danh sách thuốc ({pagination.total || 0})</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/medicines/create")}
                >
                    + Thêm mới
                </button>


                <table className="table table-striped table-bordered mt-3">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên</th>
                            <th>Đơn vị</th>
                            <th>Cách dùng</th>
                            <th>Mô tả</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((a, idx) => (
                            <tr key={a._id}>
                                <td>{(filters.page - 1) * (filters.limit || 10) + idx + 1}</td>
                                <td>{a.name}</td>
                                <td>{a.unit}</td>
                                <td>{a.usage}</td>
                                <td>{a.description}</td>                      
                                <td>

                                    <button className="btn btn-success btn-sm" onClick={() => navigate(`/admin/medicines/edit/${a._id}`)}>Sửa</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a._id)}>Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

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
        </>
    );
}

export default Medicines;
