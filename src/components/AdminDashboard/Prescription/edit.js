import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPrescriptionById, updatePrescription } from "../../../services/prescriptionService";
import { getAllMedicine } from "../../../services/medicineService";

function PrescriptionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    diagnosis: "",
    notes: "",
    medicines: [],
  });

  const [allMedicines, setAllMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy toa thuốc
        const res = await getPrescriptionById(id);
        if (res.success) {
          const data = res.data;
          setForm({
            diagnosis: data.diagnosis || "",
            notes: data.notes || "",
            medicines: data.medicines.map(m => ({
              medicineId: m.medicineId?._id || "",
              name: m.medicineId?.name || m.name || "",
              unit: m.medicineId?.unit || "",
              description: m.medicineId?.description || "",
              usage: m.medicineId?.usage || "",
              dosage: m.dosage || "",
              duration: m.duration || "",
              instructions: m.instructions || "",
              _id: m._id,
            })) || [],
          });
        }

        // Lấy danh sách thuốc từ DB
        const meds = await getAllMedicine({ page: 1, limit: 100 });
        if (meds.success) setAllMedicines(meds.data);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...form.medicines];
    updated[index][field] = value;

    // Nếu chọn thuốc từ dropdown thì tự động cập nhật name, unit, description, usage
    if (field === "medicineId") {
      const selected = allMedicines.find(m => m._id === value);
      if (selected) {
        updated[index].name = selected.name;
        updated[index].unit = selected.unit;
        updated[index].description = selected.description;
        updated[index].usage = selected.usage;
      }
    }

    setForm(prev => ({ ...prev, medicines: updated }));
  };

  const addMedicine = () => {
    setForm(prev => ({
      ...prev,
      medicines: [...prev.medicines, { medicineId: "", name: "", unit: "", description: "", usage: "", dosage: "", duration: "", instructions: "" }]
    }));
  };

  const removeMedicine = (index) => {
    const updated = [...form.medicines];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, medicines: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updatePrescription(id, form);
      if (res.success) {
        alert("Cập nhật toa thuốc thành công!");
        navigate(`/admin/prescriptions`);
      } else {
        alert(res.message || "Lỗi khi cập nhật");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container mt-4">
      <h3>Sửa toa thuốc</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Trạng thái</label>
          <select
            className="form-control"
            value={form.status || "draft"}
            onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="draft">Draft</option>
            <option value="final">Final</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Chẩn đoán</label>
          <input
            type="text"
            name="diagnosis"
            className="form-control"
            value={form.diagnosis}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Ghi chú</label>
          <textarea
            name="notes"
            className="form-control"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        <h5>Danh sách thuốc</h5>
        {form.medicines.map((med, i) => (
          <div key={i} className="border p-2 mb-2">
            <div className="d-flex justify-content-between">
              <strong>Thuốc {i + 1}</strong>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeMedicine(i)}>Xóa</button>
            </div>

            <div className="mb-2">
              <label>Chọn thuốc</label>
              <select
                className="form-control"
                value={med.medicineId || ""}
                onChange={(e) => handleMedicineChange(i, "medicineId", e.target.value)}
              >
                <option value="">-- Chọn thuốc --</option>
                {allMedicines.map(m => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label>Liều lượng</label>
              <input
                type="text"
                className="form-control"
                value={med.dosage}
                onChange={(e) => handleMedicineChange(i, "dosage", e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label>Thời gian</label>
              <input
                type="text"
                className="form-control"
                value={med.duration}
                onChange={(e) => handleMedicineChange(i, "duration", e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label>Hướng dẫn</label>
              <input
                type="text"
                className="form-control"
                value={med.instructions}
                onChange={(e) => handleMedicineChange(i, "instructions", e.target.value)}
              />
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-secondary mb-3" onClick={addMedicine}>+ Thêm thuốc</button>
        <br />
        <button type="submit" className="btn btn-primary">{loading ? "Đang cập nhật..." : "Cập nhật"}</button>
      </form>
    </div>
  );
}

export default PrescriptionEdit;
