import { useState, useEffect } from "react";
import { createSupporter } from "../../../services/supporterService";
import { useNavigate } from "react-router-dom";


function SupporterCreate() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        phoneNumber: "",
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

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
            if (thumbnail) form.append("thumbnail", thumbnail);

            const res = await createSupporter(form);

            if (res.success) {
                alert("Tạo hỗ trợ viên thành công!");
                navigate("/admin/supporters");
            } else {
                alert(res.message || "Lỗi khi tạo hỗ trợ viên");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi khi tạo hỗ trợ viên");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Thêm hỗ trợ viên mới</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Tên hỗ trợ viên</label>
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
                    <label>Số điện thoại</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        className="form-control"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Ảnh hỗ trợ viên</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setThumbnail(e.target.files[0])}
                    />
                    {thumbnail && (
                        <img
                            src={URL.createObjectURL(thumbnail)}
                            alt="preview"
                            width="100"
                            className="mt-2"
                        />
                    )}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Đang tạo..." : "Tạo hỗ trợ viên"}
                </button>
            </form>
        </div>
    );
}

export default SupporterCreate;
