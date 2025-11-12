import { useEffect, useState } from "react";
import { deleteDoctor, getAllDoctor } from "../../../services/doctorService";
import { getAllSpec } from "../../../services/specializationService";
import { getAllClinic } from "../../../services/clinicService";
import { useNavigate } from "react-router-dom";

function Doctors() {

  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ page: 1, limit: 5 });
  const [loading, setLoading] = useState(true);
  const [specializations, setSpecializations] = useState([]);
  const [clinics, setClinics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await getAllSpec();
        console.log(res)
        if (res.success) setSpecializations(res.data);
        else console.log(res.message);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchClinics = async () => {
      try {
        const res = await getAllClinic();
        console.log(res)
        if (res.success) setClinics(res.data);
        else console.log(res.message);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSpecializations();
    fetchClinics();
  }, []);

  const fetchDoctors = async (params = filters) => {
    try {
      setLoading(true);
      const res = await getAllDoctor(params);
      if (res.success) {
        setDoctors(res.data);
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
    fetchDoctors(filters);
  }, [filters]);

  const handleSpecChange = (e) => {
    const specializationId = e.target.value;
    setFilters((prev) => ({
      ...prev,
      specializationId,
      page: 1
    }));
  };

  const handleClinicChange = (e) => {
    const clinicId = e.target.value;
    setFilters((prev) => ({
      ...prev,
      clinicId,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bác sĩ này không?")) {
      const res = await deleteDoctor(id);
      if (res.success) {
        alert("Xóa thành công!");

        const newTotal = (pagination.total || 0) - 1;
        const totalPages = Math.ceil(newTotal / (filters.limit || 5));
        if (filters.page > totalPages && totalPages > 0) {
          setFilters((prev) => ({ ...prev, page: totalPages }));
        } else {
          fetchDoctors(filters);
        }

      } else {
        alert("Lỗi khi xóa!");
      }
    }
  };


  if (loading) return <p>Đang tải dữ liệu...</p>;

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


      <div className="d-flex align-items-center">
        <span>Chuyên khoa</span>
        <select
          onChange={handleSpecChange}
          value={filters.specializationId || ""}
          className="form-select"
          style={{ display: "block", width: "auto", marginRight: "50px" }}
        >
          <option value="">Tất cả</option>
          {specializations.map((spec) => (
            <option key={spec._id} value={spec._id}>
              {spec.name}
            </option>
          ))}
        </select>

        <span>Phòng khám</span>
        <select
          onChange={handleClinicChange}
          value={filters.clinicId || ""}
          className="form-select"
          style={{ display: "block", width: "auto" }}
        >
          <option value="">Tất cả</option>
          {clinics.map((clinic) => (
            <option key={clinic._id} value={clinic._id}>
              {clinic.name}
            </option>
          ))}
        </select>
      </div>



      <table className="table table-striped table-bordered mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Hình ảnh</th>
            <th>Bác sĩ</th>
            <th>Email</th>
            <th>Slug</th>
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
              <td>{a.slug}</td>
              <td>{a.specializationId?.name}</td>
              <td>{a.clinicId?.name}</td>
              <td>{a.phoneNumber}</td>
              <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => navigate(`/admin/doctors/edit/${a._id}`)}>Sửa</button>
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

export default Doctors;
