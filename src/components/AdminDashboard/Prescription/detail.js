import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPrescriptionById, deletePrescription } from "../../../services/prescriptionService";

function PrescriptionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await getPrescriptionById(id);
                console.log(res)
                if (res.success) {
                    setPrescription(res.data);
                } else {
                    setError(res.message || "Không tải được toa thuốc");
                }
            } catch (err) {
                console.error(err);
                setError("Lỗi khi tải toa thuốc");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Bạn có chắc muốn xóa toa thuốc này không?")) return;
        try {
            const res = await deletePrescription(id);
            if (res.success) {
                alert("Xóa thành công");
                navigate("/admin/prescriptions");
            } else {
                alert(res.message || "Lỗi khi xóa");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi khi xóa");
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!prescription) return <p>Không tìm thấy toa thuốc</p>;

    // ✅ Lấy tên bác sĩ và bệnh nhân sau khi populate
    const doctorName = prescription.doctorId?.name || "Chưa rõ";
    const patientName = prescription.patientId
        ? `${prescription.patientId.firstName || ""} ${prescription.patientId.lastName || ""}`.trim()
        : "Chưa rõ";

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Chi tiết toa thuốc</h3>
                <div>
                    <button className="btn btn-secondary me-2" onClick={() => navigate("/admin/prescriptions")}>
                        Quay lại
                    </button>
                    <button className="btn btn-warning me-2" onClick={() => navigate(`/admin/prescriptions/${id}/edit`)}>
                        Sửa
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        Xóa
                    </button>
                </div>
            </div>

            <div className="mb-3">
                <strong>Bác sĩ:</strong> {doctorName}
            </div>
            <div className="mb-3">
                <strong>Bệnh nhân:</strong> {patientName}
            </div>
            <div className="mb-3">
                <strong>Chẩn đoán:</strong> {prescription.diagnosis || "-"}
            </div>
            <div className="mb-3">
                <strong>Trạng thái:</strong>{" "}
                <span
                    className={`badge ${
                        prescription.status === "final" ? "bg-success" : "bg-secondary"
                    }`}
                >
                    {prescription.status}
                </span>
            </div>
            <div className="mb-4">
                <strong>Ghi chú:</strong>
                <div className="border rounded p-2 mt-1">{prescription.notes || "-"}</div>
            </div>

            <h5>Danh sách thuốc</h5>
            {Array.isArray(prescription.medicines) && prescription.medicines.length > 0 ? (
                <table className="table table-sm table-bordered mt-2">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên thuốc</th>
                            <th>Liều</th>
                            <th>Thời gian</th>
                            <th>Hướng dẫn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescription.medicines.map((m, i) => (
                            <tr key={m._id || i}>
                                <td>{i + 1}</td>
                                <td>{m.name || m.medicineId?.name || "N/A"}</td>
                                <td>{m.dosage || "-"}</td>
                                <td>{m.duration || "-"}</td>
                                <td>{m.instructions || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Chưa có thuốc trong toa này.</p>
            )}
        </div>
    );
}

export default PrescriptionDetail;
