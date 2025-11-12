import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFamilyById } from "../../../services/familyService";
import { getAllDoctor } from "../../../services/doctorService";

function FamilyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [family, setFamily] = useState(null);
    const [doctorsMap, setDoctorsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await getFamilyById(id);
                console.log(res)
                if (res?.success && res?.family?.family) {
                    setFamily(res.family.family);
                } else {
                    setError(res?.message || "Không tải được dữ liệu gia đình");
                    return;
                }

                const doctorRes = await getAllDoctor({ limit: 0 });
                 console.log(doctorRes)
                if (doctorRes?.success && Array.isArray(doctorRes.data)) {
                    const map = {};
                    doctorRes.data.forEach((doc) => {
                        console.log(doc)
                        map[doc._id] = doc.name || doc.userId?.email || "Không rõ";
                    });
                    setDoctorsMap(map);
                }
            } catch (err) {
                console.error(err);
                setError("Lỗi khi tải thông tin gia đình");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!family) return <p>Không tìm thấy gia đình</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Chi tiết hồ sơ gia đình</h3>
                <button className="btn btn-secondary" onClick={() => navigate("/admin/families")}>
                    Quay lại
                </button>
            </div>

            {/* Thông tin chung */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title mb-3">Thông tin chung</h5>
                    <p><strong>Tên gia đình:</strong> {family.familyName}</p>
                    <p><strong>Chủ hộ:</strong> {family.ownerId?.email || "Không có"}</p>
                    <p><strong>Ngày tạo:</strong> {new Date(family.createdAt).toLocaleString()}</p>
                </div>
            </div>

            {/* Thành viên */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">Thành viên</h5>
                    {family.members?.length > 0 ? (
                        <table className="table table-bordered table-sm mt-2">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Họ tên</th>
                                    <th>Quan hệ</th>
                                    <th>Giới tính</th>
                                    <th>Ngày sinh</th>
                                    <th>Số điện thoại</th>
                                </tr>
                            </thead>
                            <tbody>
                                {family.members.map((m, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{m.fullName}</td>
                                        <td>{m.relationship || "-"}</td>
                                        <td>{m.gender}</td>
                                        <td>{m.dateOfBirth ? new Date(m.dateOfBirth).toLocaleDateString() : "-"}</td>
                                        <td>{m.phoneNumber || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Không có thành viên nào.</p>
                    )}
                </div>
            </div>

            {/* Bác sĩ gia đình */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">Bác sĩ gia đình</h5>
                    {family.familyDoctors?.length > 0 ? (
                        <table className="table table-bordered table-sm mt-2">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Bác sĩ</th>
                                    <th>Ghi chú</th>
                                    <th>Ngày yêu cầu</th>
                                    <th>Trạng thái</th>
                                    <th>Lịch hẹn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {family.familyDoctors.map((d, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{doctorsMap[d.doctorId] || d.doctorId}</td>
                                        <td>{d.requestNote || "-"}</td>
                                        <td>{new Date(d.requestedAt).toLocaleString()}</td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    d.status === "approved"
                                                        ? "bg-success"
                                                        : d.status === "pending"
                                                        ? "bg-warning text-dark"
                                                        : d.status === "rejected"
                                                        ? "bg-danger"
                                                        : "bg-secondary"
                                                }`}
                                            >
                                                {d.status}
                                            </span>
                                            {d.rejectionReason && (
                                                <div className="text-muted small mt-1">
                                                    Lý do: {d.rejectionReason}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {d.schedule?.startDate
                                                ? `${new Date(d.schedule.startDate).toLocaleDateString()} | ${
                                                      d.schedule.frequency === "weekly"
                                                          ? `Thứ ${d.schedule.dayOfWeek + 1}`
                                                          : `Ngày ${d.schedule.dayOfMonth}`
                                                  } | ${d.schedule.timeSlot}`
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Chưa có bác sĩ gia đình nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FamilyDetail;
