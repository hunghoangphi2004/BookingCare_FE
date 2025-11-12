import { useEffect, useState } from "react";
import {
  getAllFamilyRequests,
  approveFamilyDoctor,
  rejectFamilyDoctor,
  cancelFamilyDoctor,
} from "../../../services/familyService";

function RequestFamilyDoctorDashboard() {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getAllFamilyRequests(filters, filters.page, filters.limit);
      if (res.success) {
        setRequests(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (familyId, doctorRequestId) => {
    try {
      await approveFamilyDoctor(familyId, doctorRequestId);
      alert("✅ Đã duyệt yêu cầu thành công!");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi duyệt yêu cầu");
    }
  };

  const handleReject = async (familyId, doctorRequestId) => {
    const reason = prompt("Nhập lý do từ chối:");
    if (!reason) return;
    try {
      await rejectFamilyDoctor(familyId, doctorRequestId, reason);
      alert("🚫 Đã từ chối yêu cầu");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi từ chối yêu cầu");
    }
  };

  const handleCancel = async (familyId, doctorRequestId) => {
    if (!window.confirm("Bạn có chắc muốn hủy yêu cầu này không?")) return;
    try {
      await cancelFamilyDoctor(familyId, doctorRequestId);
      alert("🟡 Đã hủy yêu cầu");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi hủy yêu cầu");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  if (loading) return <p className="text-center py-5">Đang tải...</p>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-primary">📋 Danh sách yêu cầu bác sĩ gia đình</h2>

      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Tên gia đình</th>
            <th>Chủ hộ</th>
            <th>Bác sĩ</th>
            <th>Ghi chú</th>
            <th>Ngày bắt đầu</th>
            <th>Tần suất</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">
                Không có yêu cầu nào.
              </td>
            </tr>
          ) : (
            requests.map((family, i) =>
              family.doctorRequests.map((req, j) => (
                <tr key={`${family._id}-${req._id}`}>
                  <td>{(filters.page - 1) * filters.limit + i + 1}.{j + 1}</td>
                  <td>{family.familyName}</td>
                  <td>{family.owner?.email || "—"}</td>
                  <td>{req.doctorId?.name || "—"}</td>
                  <td>{req.requestNote || "—"}</td>
                  <td>{req.schedule?.startDate?.slice(0, 10) || "—"}</td>
                  <td>{req.schedule?.frequency || "—"}</td>
                  <td>
                    {req.status === "pending" && <span className="text-warning">Chờ duyệt</span>}
                    {req.status === "approved" && <span className="text-success">Đã duyệt</span>}
                    {req.status === "rejected" && <span className="text-danger">Đã từ chối</span>}
                    {req.status === "cancelled" && <span className="text-muted">Đã hủy</span>}
                  </td>
                  <td>
                    {req.status === "pending" && (
                      <>
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() => handleApprove(family._id, req._id)}
                        >
                          Duyệt
                        </button>
                        <button
                          className="btn btn-sm btn-danger me-1"
                          onClick={() => handleReject(family._id, req._id)}
                        >
                          Từ chối
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleCancel(family._id, req._id)}
                        >
                          Hủy
                        </button>
                      </>
                    )}
                    {req.status === "rejected" && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => alert(req.rejectionReason || "Không có lý do")}
                      >
                        Lý do
                      </button>
                    )}
                    {req.status === "approved" && (
                      <button className="btn btn-sm btn-outline-primary">Xem chi tiết</button>
                    )}
                  </td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>

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

export default RequestFamilyDoctorDashboard;
