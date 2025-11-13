import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSpecializationById, updateSpecialization } from "../../../services/specializationService";
import { Form, Input, Button, Upload, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const SpecializationEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [oldSpecialization, setOldSpecialization] = useState(null);
    const [alert, setAlert] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getSpecializationById(id);
                if (res.data) {
                    setOldSpecialization(res.data);
                    form.setFieldsValue({
                        name: res.data.name || "",
                        description: res.data.description || "",
                    });
                }
            } catch (err) {
                console.error(err);
                setAlert({ type: 'error', message: "Lỗi khi tải dữ liệu chuyên khoa." });
            }
        };
        fetchData();
    }, [id, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => formData.append(key, value));
            if (image) formData.append("image", image);

            const res = await updateSpecialization(id, formData);
            if (res.success) {
                navigate("/admin/specializations", {
                    state: {
                        alert: {
                            type: "success",
                            message: "Chuyên khoa đã được cập nhật thành công!"
                        }
                    }
                });
            } else {
                setAlert({ type: 'error', message: res.message || "Không thể cập nhật chuyên khoa!" });
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

    if (!oldSpecialization) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Cập nhật chuyên khoa</h3>

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
                    {image ? (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="preview"
                            style={{ width: 100, borderRadius: 8, marginTop: 10 }}
                        />
                    ) : (
                        oldSpecialization?.image && (
                            <img
                                src={oldSpecialization.image}
                                alt="old specialization"
                                style={{ width: 100, borderRadius: 8, marginTop: 10 }}
                            />
                        )
                    )}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                        {loading ? "Đang cập nhật..." : "Cập nhật chuyên khoa"}
                    </Button>
                    <Button onClick={() => navigate("/admin/specializations")}>Hủy</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SpecializationEdit;
