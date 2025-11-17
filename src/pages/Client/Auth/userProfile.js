import React, { useEffect, useState } from "react";
import { getProfile } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../services/authService";
import { Modal, Form, Input, DatePicker, Select, Upload, Button, message } from "antd";
import { UploadOutlined, UserOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./UserProfile.css";
import Swal from "sweetalert2";

const { Option } = Select;

function UserProfile() {
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

  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        if (!data) return navigate("/login");
        setProfile(data);

        if (data.patient) {
          const p = data.patient;
          form.setFieldsValue({
            firstName: p.firstName || "",
            lastName: p.lastName || "",
            phoneNumber: p.phoneNumber || "",
            dateOfBirth: p.dateOfBirth ? dayjs(p.dateOfBirth) : null,
            gender: p.gender || "other",
            address: p.address || "",
            emergencyContactName: p.emergencyContact?.name || "",
            emergencyContactPhone: p.emergencyContact?.phone || "",
            emergencyContactRelationship: p.emergencyContact?.relationship || "",
          });
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
    loadProfile();
  }, [navigate, form]);

  if (!profile) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⏳</div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (profile.role !== "patient") {
    return (
      <div className="error-container">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
        <p>Tài khoản của bạn không phải bệnh nhân</p>
      </div>
    );
  }

  const p = profile.patient;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "dateOfBirth" && value) {
          formData.append(key, value.format("YYYY-MM-DD"));
        } else if (value) {
          formData.append(key, value);
        }
      });
      formData.append("emergencyContact[name]", values.emergencyContactName || "");
      formData.append("emergencyContact[phone]", values.emergencyContactPhone || "");
      formData.append("emergencyContact[relationship]", values.emergencyContactRelationship || "");
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await updateProfile(formData);

      if (res.success) {
        Toast.fire({
          icon: 'success',
          title: 'Cập nhật hồ sơ thành công!'
        });
        setShowModal(false);
        const refreshed = await getProfile();
        setProfile(refreshed);
        setThumbnail(null);
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Cập nhật hồ sơ thất bại',
          timer: 4000
        });
      }
    } catch (err) {
      console.error(err);
      Toast.fire({
        icon: 'error',
        title:  'Cập nhật hồ sơ thất bại',
        timer: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile-container">
      <div className="profile-card">
        <div className="profile-card-header">
          <h4>
            <UserOutlined style={{ marginRight: "0.5rem" }} />
            Hồ Sơ Bệnh Nhân
          </h4>
        </div>
        <div className="profile-card-body">
          <div className="row">
            {/* Avatar Section */}
            <div className="col-md-4 profile-avatar-section">
              <div className="avatar-wrapper">
                <img
                  src={p.thumbnail || profile.avatar || "/default-avatar.png"}
                  alt={p.firstName}
                  className="profile-avatar"
                />
                <div className="avatar-badge">
                  <UserOutlined />
                </div>
              </div>
              <h5 className="profile-name">{p.lastName} {p.firstName}</h5>
              <div className="profile-id">
                <span>Mã BN: {p.patientId}</span>
              </div>
              <p className="profile-dob">
                <CalendarOutlined style={{ marginRight: "0.3rem" }} />
                {p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
              </p>
            </div>

            {/* Info Section */}
            <div className="col-md-8 profile-info-section">
              <div className="info-card">
                <h6 className="info-card-title">Thông tin cá nhân</h6>
                <div className="profile-info-item">
                  <span className="profile-info-label">
                    <UserOutlined /> Giới tính
                  </span>
                  <span className="profile-info-value">
                    {p.gender === "male" ? "Nam" : p.gender === "female" ? "Nữ" : "Khác"}
                  </span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">
                    <PhoneOutlined /> Số điện thoại
                  </span>
                  <span className="profile-info-value">
                    {p.phoneNumber || <span className="profile-info-empty">Chưa cập nhật</span>}
                  </span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">
                    <HomeOutlined /> Địa chỉ
                  </span>
                  <span className="profile-info-value">
                    {p.address || <span className="profile-info-empty">Chưa cập nhật</span>}
                  </span>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="emergency-contact-section">
                <h6 className="emergency-contact-title">
                  Liên hệ khẩn cấp
                </h6>
                <div className="emergency-contact-grid">
                  <div className="emergency-contact-item">
                    <span className="emergency-label">Họ tên:</span>
                    <span className="emergency-value">
                      {p.emergencyContact?.name || <span className="profile-info-empty">Chưa cập nhật</span>}
                    </span>
                  </div>
                  <div className="emergency-contact-item">
                    <span className="emergency-label">Mối quan hệ:</span>
                    <span className="emergency-value">
                      {p.emergencyContact?.relationship || <span className="profile-info-empty">Chưa cập nhật</span>}
                    </span>
                  </div>
                  <div className="emergency-contact-item">
                    <span className="emergency-label">Số điện thoại:</span>
                    <span className="emergency-value">
                      {p.emergencyContact?.phone || <span className="profile-info-empty">Chưa cập nhật</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="profile-actions">
                <Button
                  type="primary"
                  className="btn-update-profile"
                  onClick={() => setShowModal(true)}
                  icon={<UserOutlined />}
                >
                  Cập nhật hồ sơ
                </Button>
                <Button
                  type="primary"
                  className="btn-family-profile"
                  onClick={() => navigate("/ho-so-gia-dinh")}
                  icon={<TeamOutlined />}
                >
                  Hồ sơ gia đình
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal cập nhật */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UserOutlined />
            <span>Cập nhật hồ sơ bệnh nhân</span>
          </div>
        }
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          setThumbnail(null);
        }}
        footer={null}
        centered
        width={600}
        className="profile-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                label="Họ"
                name="lastName"
                rules={[{ required: true, message: "Vui lòng nhập họ" }]}
              >
                <Input placeholder="Nhập họ" prefix={<UserOutlined />} />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Tên"
                name="firstName"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="Nhập tên" prefix={<UserOutlined />} />
              </Form.Item>
            </div>
          </div>

          <Form.Item label="Số điện thoại" name="phoneNumber">
            <Input placeholder="Nhập số điện thoại" prefix={<PhoneOutlined />} />
          </Form.Item>

          <div className="row">
            <div className="col-md-6">
              <Form.Item label="Ngày sinh" name="dateOfBirth">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item label="Giới tính" name="gender">
                <Select placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <Form.Item label="Địa chỉ" name="address">
            <Input.TextArea
              rows={2}
              placeholder="Nhập địa chỉ"
            />
          </Form.Item>

          <div className="emergency-form-section">
            <h6 style={{ marginBottom: "1rem", color: "#f59e0b", fontWeight: 600 }}>
              ⚠️ Thông tin liên hệ khẩn cấp
            </h6>
            <Form.Item label="Họ tên người liên hệ" name="emergencyContactName">
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="emergencyContactPhone">
              <Input placeholder="Nhập số điện thoại" prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item label="Mối quan hệ" name="emergencyContactRelationship">
              <Input placeholder="Ví dụ: Vợ/Chồng, Con, Anh/Chị..." />
            </Form.Item>
          </div>

          <Form.Item label="Ảnh đại diện">
            <Upload
              beforeUpload={(file) => {
                setThumbnail(file);
                return false;
              }}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {(thumbnail || p.thumbnail) && (
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <img
                  src={thumbnail ? URL.createObjectURL(thumbnail) : p.thumbnail}
                  alt="preview"
                  className="image-preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "50%"
                  }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="btn-submit"
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserProfile;