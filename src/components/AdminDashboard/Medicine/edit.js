import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getMedicineById, updateMedicine } from "../../../services/medicineService";
import { Form, Input, Button, Alert, Typography } from "antd";

const { Title } = Typography;

function MedicineEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [oldMedicine, setOldMedicine] = useState(null);
    const [alert, setAlert] = useState({ type: "", message: "" });

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const res = await getMedicineById(id);
                if (res.success && res.data) {
                    setOldMedicine(res.data);
                    form.setFieldsValue({
                        name: res.data.name,
                        unit: res.data.unit,
                        usage: res.data.usage,
                        description: res.data.description,
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu thuốc:", error);
                setAlert({ type: "error", message: "Lỗi khi tải dữ liệu!" });
            }
        };
        fetchMedicine();
    }, [id, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const res = await updateMedicine(id, values);

            if (res.success) {
                navigate("/admin/medicines", {
                    state: {
                        alert: {
                            type: "success",
                            message: "Cập nhật thuốc thành công!"
                        }
                    }
                });
            } else {
                setAlert({
                    type: "error",
                    message: res.message || "Không thể cập nhật thuốc!"
                });

                setTimeout(() => setAlert({ type: "", message: "" }), 4000);
            }
        } catch (error) {
            console.error("Lỗi update:", error);
            setAlert({
                type: "error",
                message: "Có lỗi xảy ra khi cập nhật thuốc!"
            });

            setTimeout(() => setAlert({ type: "", message: "" }), 4000);
        } finally {
            setLoading(false);
        }
    };

    if (!oldMedicine) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

    return (
        <div className="container mt-4" style={{ maxWidth: 700 }}>
            <Title level={3}>Cập nhật thuốc</Title>

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

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Tên thuốc"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên thuốc!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Đơn vị" name="unit">
                    <Input />
                </Form.Item>

                <Form.Item label="Cách dùng" name="usage">
                    <Input />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 10 }}>
                        {loading ? "Đang cập nhật..." : "Cập nhật thuốc"}
                    </Button>
                    <Button onClick={() => navigate("/admin/medicines")}>Hủy</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default MedicineEdit;
