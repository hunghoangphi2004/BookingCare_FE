import { useState } from "react";
import { Alert, Button, Card, Form, Input, DatePicker, Select, Upload, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { createPatient } from "../../../services/patientService";

const { Title } = Typography;
const { Option } = Select;

function PatientCreate() {
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "dateOfBirth" && value) {
          formData.append(key, value.format("YYYY-MM-DD"));
        } else {
          formData.append(key, value);
        }
      });
      formData.append("emergencyContact[name]", values.emergencyContactName || "");
      formData.append("emergencyContact[phone]", values.emergencyContactPhone || "");
      formData.append("emergencyContact[relationship]", values.emergencyContactRelationship || "");
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await createPatient(formData);

      if (res.success) {
        navigate("/admin/patients", {
          state: {
            alert: {
              type: "success",
              message: "Bệnh nhân đã được tạo thành công!",
            },
          },
        });
      } else {
        setAlert({ type: "error", message: res.message || "Không thể tạo bệnh nhân!", visible: true });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại!", visible: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {alert.visible && (
        <Alert
          type={alert.type}
          message={alert.message}
          showIcon
          closable
          onClose={() => setAlert((prev) => ({ ...prev, visible: false }))}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card className="mt-4" style={{ maxWidth: 700, margin: "0 auto" }}>
        <Title level={3}>Thêm bệnh nhân mới</Title>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
            <Input type="email" />
          </Form.Item>

          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item label="Họ" name="lastName" rules={[{ required: true, message: "Vui lòng nhập họ" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Tên" name="firstName" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phoneNumber">
            <Input />
          </Form.Item>

          <Form.Item label="Ngày sinh" name="dateOfBirth">
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender" initialValue="other">
            <Select>
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          <Form.Item label="Liên hệ khẩn cấp">
            <Input
              placeholder="Tên"
              onChange={(e) => form.setFieldValue("emergencyContactName", e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Số điện thoại"
              onChange={(e) => form.setFieldValue("emergencyContactPhone", e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Mối quan hệ"
              onChange={(e) => form.setFieldValue("emergencyContactRelationship", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Ảnh đại diện">
            <Upload
              beforeUpload={(file) => {
                setThumbnail(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {thumbnail && (
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="preview"
                width="100"
                className="mt-2"
                style={{ borderRadius: 8 }}
              />
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {loading ? "Đang tạo..." : "Tạo bệnh nhân"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default PatientCreate;
