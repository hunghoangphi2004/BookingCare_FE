import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPrescription } from "../../../services/prescriptionService";
import { getAllDoctor } from "../../../services/doctorService";
import { getAllPatient } from "../../../services/patientService";
import { getAllMedicine } from "../../../services/medicineService";
import Cookies from "js-cookie";


function PrescriptionCreate() {
  const profile = Cookies.get("profile") ? JSON.parse(Cookies.get("profile")) : null;
  console.log(profile)

  const isDoctor = profile?.role === "doctor";
  const [form, setForm] = useState({
    doctorId: isDoctor ? profile.doctor._id : "",
    patientId: "",
    diagnosis: "",
    notes: "",
  });
  const [medicines, setMedicines] = useState([]);
  const [medicineList, setMedicineList] = useState([{ medicineId: "", dosage: "", duration: "", instructions: "" }]);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [docRes, patRes, medRes] = await Promise.all([
        getAllDoctor({ limit: 0 }),
        getAllPatient({ limit: 0 }),
        getAllMedicine({ limit: 0 }),
      ]);
      if (docRes.success) setDoctors(docRes.data);
      if (patRes.success) setPatients(patRes.data);
      if (medRes.success) setAllMedicines(medRes.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải dữ liệu:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicineList];
    updated[index][field] = value;
    setMedicineList(updated);
  };

  const addMedicineField = () => {
    setMedicineList([...medicineList, { medicineId: "", dosage: "", duration: "", instructions: "" }]);
  };

  const removeMedicineField = (index) => {
    setMedicineList(medicineList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctorId || !form.patientId || !form.diagnosis) {
      alert("Vui lòng nhập đủ thông tin bắt buộc");
      return;
    }

    const body = {
      ...form,
      medicines: medicineList.filter((m) => m.medicineId), // chỉ lấy thuốc đã chọn
    };

    setLoading(true);
    try {
      const res = await createPrescription(body);
      if (res.success) {
        alert("Tạo toa thuốc thành công!");
        navigate("/admin/prescriptions");
      } else {
        alert(res.message || "Lỗi khi tạo toa thuốc");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi tạo toa thuốc");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Tạo toa thuốc</h3>
      <form onSubmit={handleSubmit}>
        {/* --- BÁC SĨ --- */}
        {!isDoctor && (
          <div className="mb-3">
            <label>Bác sĩ</label>
            <select
              name="doctorId"
              className="form-select"
              value={form.doctorId}
              onChange={handleChange}
              required={!isDoctor} 
            >
              <option value="">-- Chọn bác sĩ --</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.userId?.fullName || d.name}
                </option>
              ))}
            </select>
          </div>
        )}




        {/* --- BỆNH NHÂN --- */}
        <div className="mb-3">
          <label>Bệnh nhân</label>
          <select
            name="patientId"
            className="form-select"
            value={form.patientId}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn bệnh nhân --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.firstName} {p.lastName} - {p.phoneNumber}
              </option>
            ))}
          </select>
        </div>

        {/* --- CHẨN ĐOÁN + GHI CHÚ --- */}
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

        {/* --- DANH SÁCH THUỐC --- */}
        <div className="mb-3">
          <label>Thuốc</label>
          {medicineList.map((m, idx) => (
            <div key={idx} className="border rounded p-3 mb-2">
              <div className="row g-2">
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={m.medicineId}
                    onChange={(e) =>
                      handleMedicineChange(idx, "medicineId", e.target.value)
                    }
                    required
                  >
                    <option value="">-- Chọn thuốc --</option>
                    {allMedicines.map((med) => (
                      <option key={med._id} value={med._id}>
                        {med.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Liều dùng"
                    value={m.dosage}
                    onChange={(e) =>
                      handleMedicineChange(idx, "dosage", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Thời gian"
                    value={m.duration}
                    onChange={(e) =>
                      handleMedicineChange(idx, "duration", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Hướng dẫn"
                    value={m.instructions}
                    onChange={(e) =>
                      handleMedicineChange(idx, "instructions", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-2 text-end">
                  {idx > 0 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeMedicineField(idx)}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={addMedicineField}
          >
            + Thêm thuốc
          </button>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo toa thuốc"}
        </button>
      </form>
    </div>
  );
}

export default PrescriptionCreate;
