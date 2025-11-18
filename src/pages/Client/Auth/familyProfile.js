import React, { useEffect, useState } from "react";
import { getFamily, createFamily, updateFamily } from "../../../services/familyService";
import { Card, Button, Input, Select, DatePicker, Form, Space, Divider, Spin } from "antd";
import { TeamOutlined, DeleteOutlined, EditOutlined, SaveOutlined, PlusOutlined, UserOutlined, PhoneOutlined, CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import "./familyProfile.css";

const { Option } = Select;

function FamilyProfile() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  const [family, setFamily] = useState(null);
  const [familyName, setFamilyName] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadFamily = async () => {
      try {
        const data = await getFamily();
        const familyData = data?.family?.family || data?.family;

        if (familyData && familyData.familyName) {
          setFamily(familyData);
          setFamilyName(familyData.familyName);
          setMembers(familyData.members || []);
          setIsEditing(false);
        } else {
          setFamily(null);
          setMembers([
            { fullName: "", relationship: "", dateOfBirth: "", gender: "other", phoneNumber: "" },
          ]);
          setIsEditing(true);
        }
      } catch (err) {
        console.error(err);
        Toast.fire({
          icon: 'error',
          title: 'Lỗi khi tải dữ liệu gia đình'
        });
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
      Toast.fire({
        icon: 'warning',
        title: 'Vui lòng nhập tên gia đình'
      });
      return;
    }

    const validMembers = members.filter((m) => m.fullName.trim() !== "");
    if (validMembers.length === 0) {
      Toast.fire({
        icon: 'warning',
        title: 'Vui lòng thêm ít nhất 1 thành viên'
      });
      return;
    }

    setSaving(true);
    try {
      let result;
      if (family) {
        result = await updateFamily({
          familyName,
          members: validMembers,
        });
      } else {
        result = await createFamily({
          familyName,
          members: validMembers,
        });
      }

      if (result.success) {
        Toast.fire({
          icon: 'success',
          title: result.message
        });
        if (!family) setFamily(result.data);
        setIsEditing(false);
      } else {
        Toast.fire({
          icon: 'error',
          title: result.message
        });
      }
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.message || 'Lỗi không xác định'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '20px', color: '#666' }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="family-profile-container">
      <Card className="family-card">
        <div className="family-card-header">
          <h4>
            <TeamOutlined style={{ marginRight: "0.5rem" }} />
            {family && !isEditing ? "Hồ Sơ Gia Đình" : "Tạo Hồ Sơ Gia Đình"}
          </h4>
        </div>

        <div className="family-card-body">
          {/* Family Name Section */}
          <div className="family-name-section">
            <label className="family-label">
              <HomeOutlined style={{ marginRight: '0.5rem' }} />
              Tên gia đình
            </label>
            <Input
              size="large"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Nhập tên gia đình..."
              disabled={!isEditing}
              prefix={<HomeOutlined />}
            />
          </div>

          <Divider orientation="left">
            <TeamOutlined /> Danh sách thành viên
          </Divider>

          {/* Members List */}
          <div className="members-list">
            {members.map((member, index) => (
              <Card 
                key={index} 
                className="member-card"
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                      <UserOutlined style={{ marginRight: '0.5rem' }} />
                      Thành viên {index + 1}
                    </span>
                    {isEditing && index > 0 && (
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeMember(index)}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                }
              >
                <div className="member-form">
                  <div className="form-row">
                    <div className="form-item">
                      <label>Họ tên</label>
                      <Input
                        placeholder="Nhập họ tên"
                        value={member.fullName}
                        onChange={(e) => handleMemberChange(index, "fullName", e.target.value)}
                        disabled={!isEditing}
                        prefix={<UserOutlined />}
                      />
                    </div>
                    <div className="form-item">
                      <label>Quan hệ</label>
                      <Input
                        placeholder="VD: Vợ, Con..."
                        value={member.relationship}
                        onChange={(e) => handleMemberChange(index, "relationship", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-item">
                      <label>Ngày sinh</label>
                      <Input
                        type="date"
                        value={member.dateOfBirth}
                        onChange={(e) => handleMemberChange(index, "dateOfBirth", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-item">
                      <label>Giới tính</label>
                      <Select
                        style={{ width: '100%' }}
                        value={member.gender}
                        onChange={(value) => handleMemberChange(index, "gender", value)}
                        disabled={!isEditing}
                      >
                        <Option value="male">Nam</Option>
                        <Option value="female">Nữ</Option>
                        <Option value="other">Khác</Option>
                      </Select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-item full-width">
                      <label>Số điện thoại</label>
                      <Input
                        placeholder="Nhập số điện thoại (nếu có)"
                        value={member.phoneNumber}
                        onChange={(e) => handleMemberChange(index, "phoneNumber", e.target.value)}
                        disabled={!isEditing}
                        prefix={<PhoneOutlined />}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Add Member Button */}
          {isEditing && (
            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={addMember}
              style={{ marginTop: '1rem', marginBottom: '1.5rem' }}
            >
              Thêm thành viên
            </Button>
          )}

          {/* Action Buttons */}
          <div className="family-actions">
            {!isEditing ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
                size="large"
                className="btn-edit"
              >
                Chỉnh sửa hồ sơ
              </Button>
            ) : (
              <Space size="middle">
                {family && (
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      // Reset về dữ liệu cũ
                      setFamilyName(family.familyName);
                      setMembers(family.members || []);
                    }}
                    size="large"
                  >
                    Hủy
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={saving}
                  size="large"
                  className="btn-save"
                >
                  {family ? "Lưu thay đổi" : "Tạo hồ sơ gia đình"}
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FamilyProfile;