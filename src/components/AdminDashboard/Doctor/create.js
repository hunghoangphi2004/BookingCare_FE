import { useState, useEffect } from "react";
import { getAllSpec } from "../../../services/specializationService";
import { getAllClinic } from "../../../services/clinicService";
import { createDoctor } from "../../../services/doctorService";
import { useNavigate } from "react-router-dom";


function DoctorCreate() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        licenceNumber: "",
        experience: "",
        name: "",
        consultationFee: "",
        phoneNumber: "",
        clinicId: "",
        specializationId: "",
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [specializations, setSpecializations] = useState([]);
    const [clinics, setClinics] = useState([]);
    const navigate = useNavigate()

    // Lấy danh sách chuyên khoa + phòng khám
    useEffect(() => {
        (async () => {
            const specRes = await getAllSpec();
            const clinicRes = await getAllClinic();
            setSpecializations(specRes?.data || []);
            setClinics(clinicRes?.data || []);
        })();
    }, []);

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

            const res = await createDoctor(form);

            if (res.success) {
                alert("Tạo bác sĩ thành công!");
                navigate("/admin/doctors");
            } else {
                alert(res.message || "Lỗi khi tạo bác sĩ");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi khi tạo bác sĩ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Thêm bác sĩ mới</h3>
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
                    <label>Tên bác sĩ</label>
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
                    <label>Giấy phép hành nghề</label>
                    <input
                        type="text"
                        name="licenceNumber"
                        className="form-control"
                        value={formData.licenceNumber}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Kinh nghiệm (năm)</label>
                    <input
                        type="number"
                        name="experience"
                        className="form-control"
                        value={formData.experience}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Phí tư vấn</label>
                    <input
                        type="number"
                        name="consultationFee"
                        className="form-control"
                        value={formData.consultationFee}
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
                    <label>Phòng khám</label>
                    <select
                        name="clinicId"
                        className="form-select"
                        value={formData.clinicId}
                        onChange={handleChange}
                    >
                        <option value="">-- Chọn phòng khám --</option>
                        {clinics.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Chuyên khoa</label>
                    <select
                        name="specializationId"
                        className="form-select"
                        value={formData.specializationId}
                        onChange={handleChange}
                    >
                        <option value="">-- Chọn chuyên khoa --</option>
                        {specializations.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Ảnh bác sĩ</label>
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
                    {loading ? "Đang tạo..." : "Tạo bác sĩ"}
                </button>
            </form>
        </div>
    );
}

export default DoctorCreate;
