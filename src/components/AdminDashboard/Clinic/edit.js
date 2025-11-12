import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClinicById, updateClinic } from "../../../services/clinicService";

function ClinicEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    openingHours: "",
    phone: "",
    isActive: true,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [oldClinic, setOldClinic] = useState(null);

  useEffect(() => {
    const fetchDataClinic = async () => {
      try {
        const clinic = await getClinicById(id);
        if (clinic.data) {
          setOldClinic(clinic.data);
          setFormData({
            name: clinic.data.name || "",
            description: clinic.data.description || "",
            address: clinic.data.address || "",
            openingHours: clinic.data.openingHours || "",
            phone: clinic.data.phone || "",
            isActive: clinic.data.isActive ?? true,
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchDataClinic(id);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newValue =
      name === "isActive" ? value === "true" : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });
    if (image) form.append("image", image);

    const res = await updateClinic(id, form);
    setLoading(false);

    console.log(form)

    if (res.success) {
      alert("Cập nhật phòng khám thành công!");
      navigate("/admin/clinics");
    } else {
      alert(res.message || "Lỗi khi cập nhật phòng khám");
    }
  };

  if (!oldClinic) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

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

        {/* 👇 Trạng thái (radio) */}
        <div className="mb-3">
          <label className="d-block mb-2">Trạng thái</label>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="isActive"
              id="statusActive"
              value="true"
              checked={formData.isActive === true}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="statusActive">
              Hoạt động
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="isActive"
              id="statusInactive"
              value="false"
              checked={formData.isActive === false}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="statusInactive">
              Ngừng hoạt động
            </label>
          </div>
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
            oldClinic?.image && (
              <img
                src={oldClinic.image}
                alt="old clinic"
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

export default ClinicEdit;
