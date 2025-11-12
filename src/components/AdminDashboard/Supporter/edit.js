import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {getSupporterById, updateSupporter } from "../../../services/supporterService";

function SupporterEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        phoneNumber: "",
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [oldSupporter, setOldSupporter] = useState(null);

    useEffect(() => {
        const fetchDataSupporter = async () => {
            try {
                const res = await getSupporterById(id);
                console.log(res)
                console.log(res.data.supporter)
                console.log(res.data.user)
                if (res.data) {
                    setOldSupporter(res.data);
                    setFormData({
                        email: res.data.user.email || "",
                        password: "",
                        name: res.data.supporter.name || "",
                        phoneNumber: res.data.supporter.phoneNumber || "",
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };
        fetchDataSupporter();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        });
        if (thumbnail) form.append("thumbnail", thumbnail);

        const res = await updateSupporter(id, form);
        if (res.success) {
            alert("Cập nhật hỗ trợ viên thành công!");
            navigate("/admin/supporters");
        } else {
            alert(res.message || "Lỗi khi cập nhật hỗ trợ viên");
        }
    };


    if (!oldSupporter) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

    return (
        <div className="container mt-4">
            <h3>Sửa thông tin hỗ viên</h3>
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
                    {thumbnail ? (
                        <img
                            src={URL.createObjectURL(thumbnail)}
                            alt="preview"
                            width="100"
                            className="mt-2"
                        />
                    ) : (
                        oldSupporter.supporter.thumbnail && (
                            <img
                                src={oldSupporter.supporter.thumbnail}
                                alt="old supporter"
                                width="100"
                                className="mt-2"
                            />
                        )
                    )}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </form>
        </div>
    );
}

export default SupporterEdit