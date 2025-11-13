import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSupporter } from "../../../services/supporterService";
import { Form, Input, Button, Upload, Alert, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

function SupporterCreate() {
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await createSupporter(formData);
      if (res.success) {
        navigate("/admin/supporters", {
          state: {
            alert: { type: "success", message: "Tạo hỗ trợ viên thành công!" },
          },
        });
      } else {
        setAlert({ type: "error", message: res.message || "Không thể tạo hỗ trợ viên!" });
        setTimeout(() => setAlert({ type: "", message: "" }), 5000);
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại!" });
      setTimeout(() => setAlert({ type: "", message: "" }), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", marginTop: 32 }}>
      <Title level={3}>Thêm hỗ trợ viên mới</Title>

      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          showIcon
          closable
          style={{ marginBottom: 16 }}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ email: "", password: "", name: "", phoneNumber: "" }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input placeholder="Email hỗ trợ viên" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Tên hỗ trợ viên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Tên hỗ trợ viên" />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phoneNumber">
          <Input placeholder="Số điện thoại" />
        </Form.Item>

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

          {thumbnail && (
            <img
              src={URL.createObjectURL(thumbnail)}
              alt="preview"
              style={{ width: 100, borderRadius: 8, marginTop: 8 }}
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            {loading ? "Đang tạo..." : "Tạo hỗ trợ viên"}
          </Button>
          <Button onClick={() => navigate("/admin/supporters")}>Hủy</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SupporterCreate;
