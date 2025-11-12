import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFamilyById, updateFamily } from "../../../services/familyService";

function FamilyEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [family, setFamily] = useState({
        familyName: "",
        ownerId: "",
        members: [],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFamily = async () => {
            try {
                setLoading(true);
                const res = await getFamilyById(id);
                if (res?.success && res?.family?.family) {
                    setFamily(res.family.family);
                } else {
                    setError(res?.message || "Không tải được dữ liệu gia đình");
                }
            } catch (err) {
                setError("Lỗi khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetchFamily();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFamily((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await updateFamily(id, {
                familyName: family.familyName,
                ownerId: family.ownerId?._id || family.ownerId,
            });
            if (res?.success) {
                alert("Cập nhật thành công!");
                navigate(`/admin/families/${id}`);
            } else {
                alert(res?.message || "Cập nhật thất bại");
            }
        } catch (err) {
            alert("Lỗi khi lưu thông tin");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h3>Chỉnh sửa thông tin gia đình</h3>
            <div className="card mt-3 shadow-sm">
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Tên gia đình</label>
                        <input
                            type="text"
                            name="familyName"
                            className="form-control"
                            value={family.familyName || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Chủ hộ (Email)</label>
                        <input
                            type="text"
                            name="ownerId"
                            className="form-control"
                            value={family.ownerId?.email || ""}
                            readOnly
                        />
                    </div>

                    <button
                        className="btn btn-primary me-2"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/admin/families/${id}`)}
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FamilyEdit;
