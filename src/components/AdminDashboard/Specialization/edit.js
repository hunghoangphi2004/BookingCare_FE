import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSpecializationById,updateSpecialization } from "../../../services/specializationService";

function SpecializationEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [oldSpecialization, setOldSpecialization] = useState(null);

    useEffect(() => {
        const fetchDataSpecialization = async () => {
            try {
                const specialization = await getSpecializationById(id);
                if (specialization.data) {
                    setOldSpecialization(specialization.data);
                    setFormData({
                        name: specialization.data.name || "",
                        description: specialization.data.description || "",
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };
        fetchDataSpecialization(id);
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    console.log(oldSpecialization)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        });
        if (image) form.append("image", image);

        const res = await updateSpecialization(id, form);
        setLoading(false);

        console.log(form)

        if (res.success) {
            alert("Cập nhật chuyên khoa thành công!");
            navigate("/admin/specializations");
        } else {
            alert(res.message || "Lỗi khi cập nhật chuyên khoa");
        }
    };

    if (!oldSpecialization) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

    return (
        <div className="container mt-4">
            <h3>Cập nhật phòng khám</h3>
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

                {/* Ảnh */}
                <div className="mb-3">
                    <label>Ảnh phòng khám</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    {image ? (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="preview"
                            width="100"
                            className="mt-2"
                        />
                    ) : (
                        oldSpecialization?.image && (
                            <img
                                src={oldSpecialization.image}
                                alt="old specialization"
                                width="100"
                                className="mt-2"
                            />
                        )
                    )}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Đang cập nhật..." : "Cập nhật phòng khám"}
                </button>
            </form>
        </div>
    );
}

export default SpecializationEdit;
