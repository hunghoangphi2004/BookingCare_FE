import { useState, useEffect } from "react";
import { createPatient} from "../../../services/patientService";
import { useNavigate } from "react-router-dom";


function PatientCreate() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "other",
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",

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

            form.append("email", formData.email);
            form.append("password", formData.password);
            form.append("firstName", formData.firstName);
            form.append("lastName", formData.lastName);
            form.append("phoneNumber", formData.phoneNumber);
            form.append("dateOfBirth", formData.dateOfBirth);
            form.append("gender", formData.gender);
            form.append("address", formData.address);
            form.append("emergencyContact[name]", formData.emergencyContactName);
            form.append("emergencyContact[phone]", formData.emergencyContactPhone);
            form.append("emergencyContact[relationship]", formData.emergencyContactRelationship);
            if (thumbnail) form.append("thumbnail", thumbnail);

            const res = await createPatient(form);

            if (res.success) {
                alert("Tạo bệnh nhân thành công!");
                navigate("/admin/patients");
            } else {
                alert(res.message || "Lỗi khi tạo bệnh nhân");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi khi tạo bệnh nhân");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="container mt-4">
      <h3>Thêm bệnh nhân mới</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Mật khẩu</label>
          <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Họ</label>
          <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Tên</label>
          <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Số điện thoại</label>
          <input type="text" name="phoneNumber" className="form-control" value={formData.phoneNumber} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Ngày sinh</label>
          <input type="date" name="dateOfBirth" className="form-control" value={formData.dateOfBirth} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Giới tính</label>
          <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Địa chỉ</label>
          <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Liên hệ khẩn cấp</label>
          <input type="text" name="emergencyContactName" placeholder="Tên" className="form-control mb-2" onChange={handleChange} />
          <input type="text" name="emergencyContactPhone" placeholder="Số điện thoại" className="form-control mb-2" onChange={handleChange} />
          <input type="text" name="emergencyContactRelationship" placeholder="Mối quan hệ" className="form-control" onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Ảnh đại diện</label>
          <input type="file" accept="image/*" className="form-control" onChange={(e) => setThumbnail(e.target.files[0])} />
          {thumbnail && <img src={URL.createObjectURL(thumbnail)} alt="preview" width="100" className="mt-2" />}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo bệnh nhân"}
        </button>
      </form>
    </div>
  );
}

export default PatientCreate
