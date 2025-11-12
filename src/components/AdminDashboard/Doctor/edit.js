import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorById, updateDoctor } from "../../../services/doctorService";
import { getAllClinic } from "../../../services/clinicService";
import { getAllSpec } from "../../../services/specializationService";

export default function EditDoctor() {
    const { id } = useParams();
    const navigate = useNavigate();

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

    const [clinics, setClinics] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [oldDoctor, setOldDoctor] = useState(null);

    // Lấy dữ liệu bác sĩ
    useEffect(() => {
        const fetchDataDoctor = async () => {
            try {
                const doctor = await getDoctorById(id);
                console.log(doctor)
                if (doctor.data) {
                    setOldDoctor(doctor.data);
                    setFormData({
                        email: doctor.data.userId?.email || "",
                        password: "",
                        licenceNumber: doctor.data.licenseNumber || "",
                        experience: doctor.data.experience || "",
                        name: doctor.data.name || "",
                        consultationFee: doctor.data.consultationFee || "",
                        phoneNumber: doctor.data.phoneNumber || "",
                        clinicId: doctor.data.clinicId?._id || "",
                        specializationId: doctor.data.specializationId?._id || "",
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };
        fetchDataDoctor();
    }, [id]);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await getAllClinic();
                setClinics(response.data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách phòng khám:", error);
            }
        };
        fetchClinics();
    }, []);

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const response = await getAllSpec();
                setSpecializations(response.data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách chuyên khoa:", error);
            }
        };
        fetchSpecializations();
    }, []);

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

        const res = await updateDoctor(id, form);
        if (res.success) {
            alert("Cập nhật bác sĩ thành công!");
            navigate("/admin/doctors");
        } else {
            alert(res.message || "Lỗi khi cập nhật bác sĩ");
        }
    };


    if (!oldDoctor) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

    return (
        <div className="container mt-4">
            <h3>Sửa thông tin bác sĩ</h3>
            <form onSubmit={handleSubmit}>
                {/* Email */}
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

                {/* Mật khẩu */}
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

                {/* Tên bác sĩ */}
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

                {/* Giấy phép */}
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

                {/* Kinh nghiệm */}
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

                {/* Phí tư vấn */}
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

                {/* Số điện thoại */}
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

                {/* Dropdown phòng khám */}
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

                {/* Dropdown chuyên khoa */}
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

                {/* Ảnh */}
                <div className="mb-3">
                    <label>Ảnh bác sĩ</label>
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
                        oldDoctor?.thumbnail && (
                            <img
                                src={oldDoctor.thumbnail}
                                alt="old doctor"
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
