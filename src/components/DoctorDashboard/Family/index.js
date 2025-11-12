import { useEffect, useState } from "react";
import { getAllFamilyRequests } from "../../../services/familyService";
import { useNavigate } from "react-router-dom";

function ApprovedFamilyDashboard() {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchApprovedFamilies = async () => {
    try {
      setLoading(true);
      const res = await getAllFamilyRequests({}, filters.page, filters.limit);
      console.log("Fetched families:", res);

      if (res.success) {
        // Lọc các request có status = "approved"
        const approvedList = [];

        res.data.forEach((family) => {
          family.doctorRequests
            ?.filter((req) => req.status === "approved")
            .forEach((req) => {
              approvedList.push({
                familyId: family._id,
                familyName: family.familyName,
                owner: family.owner,
                doctor: req.doctorId,
                schedule: req.schedule,
                status: req.status,
                approvedAt: req.approvedAt,
              });
            });
        });

        setApprovedRequests(approvedList);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedFamilies();
  }, [filters]);

  if (loading) return <p className="text-center py-5">Đang tải...</p>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-primary">👨‍👩‍👧‍👦 Gia đình đã được duyệt</h2>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Tên gia đình</th>
            <th>Chủ hộ</th>
            <th>Bác sĩ phụ trách</th>
            <th>Ngày duyệt</th>
            <th>Tần suất khám</th>
            <th>Khung giờ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {approvedRequests.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">
                Không có yêu cầu nào đã duyệt.
              </td>
            </tr>
          ) : (
            approvedRequests.map((req, i) => (
              <tr key={`${req.familyId}-${i}`}>
                <td>{(filters.page - 1) * filters.limit + i + 1}</td>
                <td>{req.familyName}</td>
                <td>{req.owner?.email || "—"}</td>
                <td>{req.doctor?.name || "—"}</td>
                <td>{req.approvedAt ? req.approvedAt.slice(0, 10) : "—"}</td>
                <td>{req.schedule?.frequency || "—"}</td>
                <td>{req.schedule?.timeSlot || "—"}</td>
                <td>
                  <span className="badge bg-success text-uppercase">
                    {req.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      navigate(`/admin/doctor/get-family-by-id/${req.familyId}`)
                    }
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-3">
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              className={`btn ${
                pagination.page === i + 1 ? "btn-primary" : "btn-outline-primary"
              } btn-sm`}
              onClick={() => setFilters((prev) => ({ ...prev, page: i + 1 }))}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApprovedFamilyDashboard;
