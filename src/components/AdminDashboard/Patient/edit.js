import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientById, updatePatient } from "../../../services/patientService";

function PatientEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [oldPatient, setOldPatient] = useState(null);

    // Lấy dữ liệu bệnh nhân
    useEffect(() => {
        const fetchDataPatient = async () => {
            try {
                const res = await getPatientById(id);
                const patient = res.data;

                if (patient) {
                    setOldPatient(patient);
                    setFormData({
                        email: patient.user?.email || "",
                        password: "",
                        firstName: patient.patient.firstName || "",
                        lastName: patient.patient.lastName || "",
                        phoneNumber: patient.patient.phoneNumber || "",
                        dateOfBirth: patient.patient.dateOfBirth
                            ? patient.patient.dateOfBirth.split("T")[0]
                            : "",
                        gender: patient.patient.gender || "",
                        address: patient.patient.address || "",
                        emergencyContactName: patient.patient.emergencyContact.name || "",
                        emergencyContactPhone: patient.patient.emergencyContact.phone || "",
                        emergencyContactRelationship: patient.patient.emergencyContact.relationship || "",
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };
        fetchDataPatient();
    }, [id]);

    console.log(oldPatient)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();

            const normalFields = [
                "email",
                "password",
                "firstName",
                "lastName",
                "phoneNumber",
                "dateOfBirth",
                "gender",
                "address",
            ];

            normalFields.forEach((key) => {
                form.append(key, formData[key]);
            });

            form.append("emergencyContact[name]", formData.emergencyContactName);
            form.append("emergencyContact[phone]", formData.emergencyContactPhone);
            form.append("emergencyContact[relationship]", formData.emergencyContactRelationship);

            // Ảnh
            if (thumbnail) form.append("thumbnail", thumbnail);

            const res = await updatePatient(id, form);
            if (res.success) {
                alert("Cập nhật bệnh nhân thành công!");
                navigate("/admin/patients");
            } else {
                alert(res.message || "Lỗi khi cập nhật bệnh nhân");
            }
        } catch (error) {
            console.error("Lỗi khi gửi form:", error);
            alert("Đã xảy ra lỗi khi lưu thông tin!");
        } finally {
            setLoading(false);
        }
    };


    if (!oldPatient) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

    return (
        <div className="container mt-4">
            <h3>Sửa thông tin bệnh nhân</h3>
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
                    <label>Mật khẩu (để trống nếu không đổi)</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Họ</label>
                    <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Tên</label>
                    <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={formData.firstName}
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
                    <label>Ngày sinh</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        className="form-control"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Giới tính</label>
                    <select
                        name="gender"
                        className="form-select"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>
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
                    <label>Người liên hệ khẩn cấp</label>
                    <input
                        type="text"
                        name="emergencyContactName"
                        className="form-control"
                        value={formData.emergencyContactName}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Số điện thoại liên hệ khẩn cấp</label>
                    <input
                        type="text"
                        name="emergencyContactPhone"
                        className="form-control"
                        value={formData.emergencyContactPhone}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Mối quan hệ</label>
                    <input
                        type="text"
                        name="emergencyContactRelationship"
                        className="form-control"
                        value={formData.emergencyContactRelationship}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Ảnh bệnh nhân</label>
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
                        oldPatient?.patient.thumbnail && (
                            <img
                                src={oldPatient.patient.thumbnail}
                                alt="old thumbnail"
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

export default PatientEdit;
