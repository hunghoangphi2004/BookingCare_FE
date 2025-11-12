import { useEffect, useState } from "react";
import { getAllFamily } from "../../../services/familyService";
import { useNavigate } from "react-router-dom";


function Families() {
    const [families, setFamilies] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ page: 1, limit: 5 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        fetchFamiles(filters);
    }, [filters]);

    const fetchFamiles = async (params = {}) => {
        try {
            console.log(params)
            setLoading(true);
            const res = await getAllFamily(params);
            console.log(res)
            if (res.success) {
                setFamilies(res.data);
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

    console.log(families)

    //   const handleFilterChange = (e) => {
    //     const specializationId = e.target.value;
    //     setFilters((prev) => ({
    //       ...prev,
    //       specializationId,
    //       page: 1 
    //     }));
    //   };

    const handleDelete = async (id) => {
        // if (window.confirm("Bạn có chắc muốn xóa phòng khám này không?")) {
        //     const res = await deleteClinic(id);
        //     if (res.success) {
        //         alert("Xóa thành công!");
        //         setClinics((prev) => prev.filter((d) => d._id !== id));
        //         setPagination((prev) => {
        //             const newTotal = (prev.total || 0) - 1;
        //             const totalPages = Math.ceil(newTotal / (filters.limit || 10));

        //             if (filters.page > totalPages && totalPages > 0) {
        //                 setFilters((f) => ({ ...f, page: totalPages }));
        //             }

        //             return {
        //                 ...prev,
        //                 total: newTotal,
        //                 totalPages,
        //             };
        //         });
        //     } else {
        //         alert("Lỗi khi xóa!");
        //     }
        // }
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
                <h2 className="mb-5">Danh sách gia đình ({pagination.total || 0})</h2>
                {/* <button
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/families/create")}
                >
                    + Thêm mới
                </button> */}


                <table className="table table-striped table-bordered mt-3">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên gia đình</th>
                            <th>Chủ hộ</th>
                            <th>Số thành viên</th>
                        </tr>
                    </thead>
                    <tbody>
                        {families.map((a, idx) => (
                            <tr key={a._id}>
                                <td>{(filters.page - 1) * (filters.limit || 10) + idx + 1}</td>
                                <td>{a.familyName}</td>
                                <td>{a.owner.email}</td>
                                <td>{a.members.length}</td>
                                <td>
                                    <button className="btn btn-info btn-sm" onClick={() => navigate(`/admin/families/detail/${a._id}`)}>Xem</button>
                                    {/* <button className="btn btn-success btn-sm" onClick={() => navigate(`/admin/clinics/edit/${a._id}`)}>Sửa</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a._id)}>Xoá</button> */}
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

export default Families;
