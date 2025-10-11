import { useEffect, useState } from "react";
import { getAllDoctor } from "../../../services/doctorService";
import { getAllSpec } from "../../../services/specializationService";
import { useNavigate } from "react-router-dom";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await getAllSpec();
        if (res.success) setSpecializations(res.data);
        else setError(res.message || "Không lấy được dữ liệu chuyên khoa");
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi lấy dữ liệu chuyên khoa");
      }
    };
    fetchSpecializations();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await getAllDoctor(filters);
        if (res.success) {
          setDoctors(res.data);
          setPagination(res.pagination);
        } else {
          setError(res.message || "Không lấy được dữ liệu bác sĩ");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi lấy dữ liệu bác sĩ");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [filters]);

  const handleFilterChange = (e) => {
    const specializationId = e.target.value;
    setFilters((prev) => ({
      ...prev,
      specializationId,
      page: 1
    }));
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Danh sách bác sĩ ({pagination.total || 0})</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/doctors/create")}
        >
          + Thêm mới
        </button>
      </div>


      <p>Chuyên khoa</p>
      <select
        onChange={handleFilterChange}
        value={filters.specializationId || ""}
        className="form-select"
        style={{ display: "block", width: "auto" }}
      >
        <option value="">Tất cả</option>
        {specializations.map((spec) => (
          <option key={spec._id} value={spec._id}>
            {spec.name}
          </option>
        ))}
      </select>



      <table className="table table-striped table-bordered mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Hình ảnh</th>
            <th>Bác sĩ</th>
            <th>Email</th>
            <th>Chuyên khoa</th>
            <th>Phòng khám</th>
            <th>SĐT</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((a, idx) => (
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
              <td>{a.specializationId?.name}</td>
              <td>{a.clinicId?.name}</td>
              <td>{a.phoneNumber}</td>
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

export default Doctors;
