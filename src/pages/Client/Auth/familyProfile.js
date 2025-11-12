import React, { useEffect, useState } from "react";
import { getFamily, createFamily,updateFamily } from "../../../services/familyService";

function FamilyProfile() {
  const [family, setFamily] = useState(null);
  const [familyName, setFamilyName] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
  const loadFamily = async () => {
    try {
      const data = await getFamily();
      console.log(data)
      const familyData = data?.family?.family || data?.family;

      if (familyData && familyData.familyName) {
        setFamily(familyData);
        setFamilyName(familyData.familyName);
        setMembers(familyData.members || []);
      } else {
        setFamily(null);
        setMembers([
          { fullName: "", relationship: "", dateOfBirth: "", gender: "other", phoneNumber: "" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Lỗi khi tải dữ liệu gia đình");
    } finally {
      setLoading(false);
    }
  };
  loadFamily();
}, []);


  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const addMember = () => {
    setMembers([
      ...members,
      { fullName: "", relationship: "", dateOfBirth: "", gender: "other", phoneNumber: "" },
    ]);
  };

  const removeMember = (index) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  const handleSave = async () => {
    if (!familyName.trim()) {
      setMessage("⚠️ Vui lòng nhập tên gia đình");
      return;
    }

    const validMembers = members.filter((m) => m.fullName.trim() !== "");
    if (validMembers.length === 0) {
      setMessage("⚠️ Vui lòng thêm ít nhất 1 thành viên");
      return;
    }

    setSaving(true);
    try {
      let result;
      if (family) {
        // Đã có -> cập nhật
        result = await updateFamily({
          familyName,
          members: validMembers,
        });
      } else {
        // Chưa có -> tạo mới
        result = await createFamily({
          familyName,
          members: validMembers,
        });
      }

      if (result.success) {
        setMessage("✅ " + result.message);
        if (!family) setFamily(result.data);
      } else {
        setMessage("❌ " + result.message);
      }
    } catch (err) {
      setMessage("❌ " + (err.message || "Lỗi không xác định"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            {family ? "Hồ sơ gia đình" : "Tạo hồ sơ gia đình"}
          </h4>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Tên gia đình</label>
            <input
              type="text"
              className="form-control"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Nhập tên gia đình..."
              disabled={!!family && !family.editing}
            />
          </div>

          <h6 className="mt-3">Thành viên</h6>
          {members.map((member, index) => (
            <div key={index} className="border rounded p-3 mb-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Thành viên {index + 1}</strong>
                {!family || family.editing ? (
                  index > 0 && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeMember(index)}
                    >
                      Xóa
                    </button>
                  )
                ) : null}
              </div>
              <input
                className="form-control mb-2"
                placeholder="Họ tên"
                value={member.fullName}
                onChange={(e) => handleMemberChange(index, "fullName", e.target.value)}
                disabled={!!family && !family.editing}
              />
              <input
                className="form-control mb-2"
                placeholder="Quan hệ (VD: Vợ, Con...)"
                value={member.relationship}
                onChange={(e) => handleMemberChange(index, "relationship", e.target.value)}
                disabled={!!family && !family.editing}
              />
              <input
                className="form-control mb-2"
                type="date"
                value={member.dateOfBirth}
                onChange={(e) => handleMemberChange(index, "dateOfBirth", e.target.value)}
                disabled={!!family && !family.editing}
              />
              <select
                className="form-control mb-2"
                value={member.gender}
                onChange={(e) => handleMemberChange(index, "gender", e.target.value)}
                disabled={!!family && !family.editing}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              <input
                className="form-control"
                placeholder="Số điện thoại (nếu có)"
                value={member.phoneNumber}
                onChange={(e) => handleMemberChange(index, "phoneNumber", e.target.value)}
                disabled={!!family && !family.editing}
              />
            </div>
          ))}

          {!family || family.editing ? (
            <button
              className="btn btn-outline-primary mb-3"
              onClick={addMember}
              disabled={!!family && !family.editing}
            >
              + Thêm thành viên
            </button>
          ) : null}

          <div className="text-center mt-3">
            {family && !family.editing ? (
              <button
                className="btn btn-warning px-4"
                onClick={() => setFamily({ ...family, editing: true })}
              >
                ✏️ Chỉnh sửa hồ sơ
              </button>
            ) : (
              <button
                className="btn btn-success px-4"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : family ? "Lưu thay đổi" : "Tạo hồ sơ gia đình"}
              </button>
            )}
          </div>

          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default FamilyProfile;
