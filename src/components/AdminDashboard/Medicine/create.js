import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMedicine } from "../../../services/medicineService";
import { Form, Input, Button, Alert } from "antd";

const MedicineCreate = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });

    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const res = await createMedicine(values);

            if (res.success) {
                navigate("/admin/medicines", {
                    state: {
                        alert: {
                            type: "success",
                            message: "Thêm thuốc thành công!"
                        }
                    }
                });
            } else {
                setAlert({ type: "error", message: res.message || "Không thể thêm thuốc!" });
                setTimeout(() => setAlert({ type: "", message: "" }), 5000);
            }
        } catch (err) {
            console.error(err);
            setAlert({ type: "error", message: "Đã xảy ra lỗi hệ thống!" });
            setTimeout(() => setAlert({ type: "", message: "" }), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Thêm thuốc</h3>

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
                style={{ maxWidth: 600 }}
                initialValues={{ unit: "viên" }}
            >
                <Form.Item
                    label="Tên thuốc"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên thuốc!" }]}
                >
                    <Input placeholder="VD: Paracetamol" />
                </Form.Item>

                <Form.Item
                    label="Đơn vị"
                    name="unit"
                    rules={[{ required: true, message: "Vui lòng nhập đơn vị!" }]}
                >
                    <Input placeholder="VD: viên, lọ, gói..." />
                </Form.Item>

                <Form.Item
                    label="Cách dùng"
                    name="usage"
                >
                    <Input.TextArea placeholder="Cách sử dụng thuốc..." rows={3} />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input.TextArea placeholder="Mô tả chi tiết..." rows={3} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                        {loading ? "Đang thêm..." : "Thêm thuốc"}
                    </Button>

                    <Button onClick={() => navigate("/admin/medicines")}>Hủy</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default MedicineCreate;
