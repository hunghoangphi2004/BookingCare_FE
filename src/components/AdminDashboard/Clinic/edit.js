import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClinicById, updateClinic } from "../../../services/clinicService";
import { Form, Input, Button, Upload, Alert, Radio } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ClinicEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [oldClinic, setOldClinic] = useState(null);
    const [alert, setAlert] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getClinicById(id);
                if (res.data) {
                    setOldClinic(res.data);
                    form.setFieldsValue({
                        name: res.data.name || "",
                        description: res.data.description || "",
                        address: res.data.address || "",
                        openingHours: res.data.openingHours || "",
                        phone: res.data.phone || "",
                        isActive: res.data.isActive ?? true,
                    });
                }
            } catch (err) {
                console.error(err);
                setAlert({ type: 'error', message: "Lỗi khi tải dữ liệu phòng khám." });
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

            const res = await updateClinic(id, formData);
            if (res.success) {
                navigate("/admin/clinics", {
                    state: {
                        alert: {
                            type: "success",
                            message: "Phòng khám đã được cập nhật thành công!"
                        }
                    }
                });
            } else {
                setAlert({ type: 'error', message: res.message || "Không thể cập nhật phòng khám!" });
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

    if (!oldClinic) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Cập nhật phòng khám</h3>

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
                    <Input />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="address">
                    <Input />
                </Form.Item>

                <Form.Item label="Giờ làm việc" name="openingHours">
                    <Input />
                </Form.Item>

                <Form.Item label="Số điện thoại" name="phone">
                    <Input />
                </Form.Item>

                <Form.Item label="Trạng thái" name="isActive">
                    <Radio.Group>
                        <Radio value={true}>Hoạt động</Radio>
                        <Radio value={false}>Ngừng hoạt động</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="Ảnh phòng khám">
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
                        oldClinic?.image && (
                            <img
                                src={oldClinic.image}
                                alt="old clinic"
                                style={{ width: 100, borderRadius: 8, marginTop: 10 }}
                            />
                        )
                    )}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                        {loading ? "Đang cập nhật..." : "Cập nhật phòng khám"}
                    </Button>
                    <Button onClick={() => navigate("/admin/clinics")}>Hủy</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ClinicEdit;
