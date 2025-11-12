import { useEffect, useState } from "react";
import { deleteSupporter, getAllSupporter } from "../../../services/supporterService"
import { useNavigate } from "react-router-dom";

function Supporters() {

  const [supporters, setSupporters] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ page: 1, limit: 5 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSupporters = async (params = filters) => {
    try {
      setLoading(true);
      const res = await getAllSupporter(params);
      console.log(res)
      if (res.success) {
        setSupporters(res.data);
        setPagination(res.pagination);
      } else {
        console.error(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupporters(filters);
  }, [filters]);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa hỗ trợ viên này không?")) {
      const res = await deleteSupporter(id);
      if (res.success) {
        alert("Xóa thành công!");

        const newTotal = (pagination.total || 0) - 1;
        const totalPages = Math.ceil(newTotal / (filters.limit || 5));
        if (filters.page > totalPages && totalPages > 0) {
          setFilters((prev) => ({ ...prev, page: totalPages }));
        } else {
          fetchSupporters(filters);
        }

      } else {
        alert("Lỗi khi xóa!");
      }
    }
  };


  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0">Danh sách hỗ trợ viên ({pagination.total || 0})</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/supporters/create")}
          >
            + Thêm mới
          </button>
        </div>


        <table className="table table-striped table-bordered mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Hình ảnh</th>
              <th>Hỗ trợ viên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {supporters.map((a, idx) => (
              <tr key={a._id}>
                <td>{(filters.page - 1) * (filters.limit || 10) + idx + 1}</td>
                <td>
                  <img
                    style={{ width: 80, borderRadius: 8 }}
                    src={a.thumbnail}
                    alt="thumb"
                  />
                </td>
                <td>{a.name}</td>
                <td>{a.userId?.email}</td>
                <td>{a.phoneNumber}</td>
                <td>
                  {a.userId.isActive ? (
                    <button className="btn btn-success">Đang hoạt động</button>
                  ) : (
                    <button className="btn btn-warning">Đã khóa</button>
                  )}
                </td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => navigate(`/admin/supporters/edit/${a._id}`)}>Sửa</button>
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

export default Supporters;
