import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMedicine } from "../../../services/medicineService";

function MedicineCreate() {
    const [form, setForm] = useState({
        name: "",
        unit: "viên",
        usage: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await createMedicine(form);

            if (res.success) {
                alert("Thêm thuốc thành công!");
                navigate("/admin/medicines");
            } else {
                alert(res.message || "Lỗi khi thêm thuốc");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi khi thêm thuốc");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Thêm thuốc</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Tên thuốc</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Đơn vị</label>
                    <input
                        type="text"
                        name="unit"
                        className="form-control"
                        value={form.unit}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Cách dùng</label>
                    <textarea
                        name="usage"
                        className="form-control"
                        value={form.usage}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Mô tả</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Đang thêm..." : "Thêm thuốc"}
                </button>
            </form>
        </div>
    );
}

export default MedicineCreate;
