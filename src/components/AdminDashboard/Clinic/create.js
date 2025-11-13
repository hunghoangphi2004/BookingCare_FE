import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClinic } from "../../../services/clinicService";
import { Form, Input, Button, Upload, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ClinicCreate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append("image", image);

      const res = await createClinic(formData);
      if (res.success) {
        navigate("/admin/clinics", {
          state: {
            alert: {
              type: "success",
              message: "Phòng khám đã được tạo thành công!"
            }
          }
        });
      } else {
        setAlert({ type: 'error', message: res.message || "Không thể tạo phòng khám!" });
        setTimeout(() => setAlert({ type: '', message: '' }), 5000);
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại!" });
      setTimeout(() => setAlert({ type: '', message: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Thêm phòng khám</h3>

      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          showIcon
          closable
          style={{ marginBottom: 16 }}
          onClose={() => setAlert({ type: '', message: '' })}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 700 }}
      >
        <Form.Item
          label="Tên phòng khám"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng khám!" }]}
        >
          <Input placeholder="VD: Phòng khám ABC" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Mô tả phòng khám..." rows={4} />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Địa chỉ phòng khám" />
        </Form.Item>

        <Form.Item label="Giờ làm việc" name="openingHours">
          <Input placeholder="VD: 8:00 - 17:00" />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone">
          <Input placeholder="SĐT liên hệ" />
        </Form.Item>

        <Form.Item label="Hình ảnh">
          <Upload
            beforeUpload={(file) => { setImage(file); return false; }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              style={{ width: 100, borderRadius: 8, marginTop: 10 }}
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            {loading ? "Đang tạo..." : "Tạo phòng khám"}
          </Button>
          <Button onClick={() => navigate("/admin/clinics")}>Hủy</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ClinicCreate;
