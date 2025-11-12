import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMedicineById, updateMedicine } from "../../../services/medicineService";

function MedicineEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    unit: "",
    usage: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [oldMedicine, setOldMedicine] = useState(null);
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await getMedicineById(id);
        console.log(res)
        if (res.success && res.data) {
          setOldMedicine(res.data);
          setForm({
            name: res.data.name || "",
            unit: res.data.unit || "",
            usage: res.data.usage || "",
            description: res.data.description || "",
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thuốc:", error);
      }
    };
    fetchMedicine();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateMedicine(id, form);
      if (res.success) {
        alert("Cập nhật thuốc thành công!");
        navigate("/admin/medicines");
      } else {
        alert(res.message || "Lỗi khi cập nhật thuốc");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật thuốc");
    } finally {
      setLoading(false);
    }
  };

  if (!oldMedicine) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

  return (
    <div className="container mt-4">
      <h3>Cập nhật thuốc</h3>
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
          <input
            type="text"
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
          {loading ? "Đang cập nhật..." : "Cập nhật thuốc"}
        </button>
      </form>
    </div>
  );
}

export default MedicineEdit;
