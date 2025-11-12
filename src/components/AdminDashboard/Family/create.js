import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClinic } from "../../../services/clinicService";

function ClinicCreate() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        openingHours: "",
        phone: "",
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                form.append(key, value);
            });
            if (image) form.append("image", image);

            const res = await createClinic(form);

            if (res.success) {
                alert("Tạo phòng khám thành công!");
                navigate("/admin/clinics");
            } else {
                alert(res.message || "Lỗi khi tạo phòng khám");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi khi tạo phòng khám");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Thêm phòng khám</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Tên phòng khám</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Mô tả</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Địa chỉ</label>
                    <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Giờ làm việc</label>
                    <input
                        type="text"
                        name="openingHours"
                        className="form-control"
                        value={formData.openingHours}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Số điện thoại</label>
                    <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Hình ảnh</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    {image && (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="preview"
                            width="100"
                            className="mt-2"
                        />
                    )}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Đang tạo..." : "Tạo phòng khám"}
                </button>
            </form>
        </div>
    );
}

export default ClinicCreate;
