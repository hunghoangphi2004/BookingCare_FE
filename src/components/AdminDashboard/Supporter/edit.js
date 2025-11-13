import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSupporterById, updateSupporter } from "../../../services/supporterService";
import { Form, Input, Button, Upload, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const SupporterEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [oldSupporter, setOldSupporter] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSupporterById(id);
        if (res.data) {
          setOldSupporter(res.data);
          form.setFieldsValue({
            email: res.data.user?.email || "",
            password: "",
            name: res.data.supporter?.name || "",
            phoneNumber: res.data.supporter?.phoneNumber || "",
          });
        }
      } catch (err) {
        console.error(err);
        setAlert({ type: "error", message: "Lỗi khi tải dữ liệu hỗ trợ viên." });
      }
    };
    fetchData();
  }, [id, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, value));
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await updateSupporter(id, formData);
      if (res.success) {
        navigate("/admin/supporters", {
          state: {
            alert: { type: "success", message: "Hỗ trợ viên đã được cập nhật thành công!" },
          },
        });
      } else {
        setAlert({ type: "error", message: res.message || "Không thể cập nhật hỗ trợ viên!" });
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

  if (!oldSupporter) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Cập nhật hỗ trợ viên</h3>

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
        style={{ maxWidth: 700 }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item label="Mật khẩu" name="password">
          <Input.Password placeholder="Để trống nếu không muốn đổi mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Tên hỗ trợ viên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phoneNumber">
          <Input />
        </Form.Item>

        <Form.Item label="Ảnh hỗ trợ viên">
          <Upload
            beforeUpload={(file) => {
              setThumbnail(file);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {thumbnail ? (
            <img
              src={URL.createObjectURL(thumbnail)}
              alt="preview"
              style={{ width: 100, borderRadius: 8, marginTop: 10 }}
            />
          ) : (
            oldSupporter.supporter?.thumbnail && (
              <img
                src={oldSupporter.supporter.thumbnail}
                alt="old supporter"
                style={{ width: 100, borderRadius: 8, marginTop: 10 }}
              />
            )
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            {loading ? "Đang cập nhật..." : "Cập nhật hỗ trợ viên"}
          </Button>
          <Button onClick={() => navigate("/admin/supporters")}>Hủy</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SupporterEdit;
