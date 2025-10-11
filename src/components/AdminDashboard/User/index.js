import { useEffect, useState } from "react";
import { getAllUser } from "../../../services/authService";

function Users() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
        page: 1,
    });
    const [filters, setFilters] = useState({ page: 1, limit: 10 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers(filters);
    }, [filters]);

    const fetchUsers = async (params = {}) => {
        try {
            setLoading(true);
            const res = await getAllUser(params);

            if (res.success) {
                setUsers(res.data || []);
                setPagination(res.pagination || {
                    total: 0,
                    totalPages: 1,
                    page: params.page || 1,
                });
            } else {
                setError(res.message || "Không lấy được dữ liệu");
            }
        } catch (err) {
            setError("Có lỗi xảy ra khi lấy dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleRoleChange = (role) => {
        setFilters((prev) => ({
            ...prev,
            role: role || undefined,
            page: 1,
        }));
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="mb-3">Danh sách người dùng ({pagination?.total || 0})</h2>

            <div className="mb-3">
                <label>Lọc theo vai trò:</label>
                <select
                    className="form-select w-auto d-inline ms-2"
                    value={filters.role || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFilters((prev) => {
                            const newFilters = { ...prev, page: 1 };
                            if (value) {
                                newFilters.role = value; 
                            } else {
                                delete newFilters.role;
                            }
                            return newFilters;
                        });
                    }}
                >
                    <option value="">Tất cả</option>
                    <option value="doctor">Bác sĩ</option>
                    <option value="supporter">Hỗ trợ viên</option>
                    <option value="patient">Bệnh nhân</option>
                </select>
            </div>

            <table className="table table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Hình ảnh</th>
                        <th>email</th>
                        <th>Vai trò</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((a, idx) => (
                        <tr key={a._id}>
                            <td>{(pagination.page - 1) * (filters.limit || 10) + idx + 1}</td>
                            <td>
                                <img
                                    style={{ width: 80, borderRadius: 8 }}
                                    src={a.role === "doctor" || a.role === "supporter" ? a.roleData?.thumbnail || a.avatar : a.avatar}
                                    alt="thumb"
                                />
                            </td>
                            <td>{a.email}</td>
                            <td>{a.role}</td>
                            <td>
                                <button className="btn btn-success btn-sm me-2">Xoá</button>
                                <button className="btn btn-danger btn-sm">Sửa</button>
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
    );
}

export default Users;
