import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSpecialization } from "../../../services/specializationService";
import { Form, Input, Button, Upload, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const SpecializationCreate = () => {
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

            const res = await createSpecialization(formData);
            if (res.success) {
                navigate("/admin/specializations", {
                    state: {
                        alert: {
                            type: "success",
                            message: "Chuyên khoa đã được tạo thành công!"
                        }
                    }
                });
            } else {
                setAlert({ type: 'error', message: res.message || "Không thể tạo chuyên khoa!" });
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
            <h3 className="mb-4">Thêm chuyên khoa</h3>

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
                    label="Tên chuyên khoa"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên chuyên khoa!" }]}
                >
                    <Input placeholder="VD: Nội tổng quát" />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea placeholder="Mô tả chuyên khoa..." rows={4} />
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
                        {loading ? "Đang tạo..." : "Tạo chuyên khoa"}
                    </Button>
                    <Button onClick={() => navigate("/admin/specializations")}>Hủy</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SpecializationCreate;
