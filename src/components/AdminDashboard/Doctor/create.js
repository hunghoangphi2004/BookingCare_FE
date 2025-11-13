import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSpec } from "../../../services/specializationService";
import { getAllClinic } from "../../../services/clinicService";
import { createDoctor } from "../../../services/doctorService";
import {
    Form,
    Input,
    Button,
    Select,
    InputNumber,
    Upload,
    message,
    notification
} from "antd";

import { UploadOutlined } from "@ant-design/icons";

const DoctorCreate = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [clinics, setClinics] = useState([]);
    const navigate = useNavigate();

    // Lấy danh sách chuyên khoa + phòng khám
    useEffect(() => {
        (async () => {
            const specRes = await getAllSpec();
            const clinicRes = await getAllClinic();
            setSpecializations(specRes?.data || []);
            setClinics(clinicRes?.data || []);
        })();
    }, []);

    // Submit form
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });
            if (thumbnail) formData.append("thumbnail", thumbnail);

            const res = await createDoctor(formData);
            if (res.success) {
                navigate("/admin/doctors", {
                    state: {
                        alert: {
                            type: "success",
                            message: "Bác sĩ đã được tạo thành công!"
                        }
                    }
                });
            } else {
                notification.error({
                    message: "Lỗi",
                    description: res.message || "Không thể tạo bác sĩ!",
                    placement: "bottomRight",
                });
            }

        } catch (err) {
            console.error(err);
            notification.error({
                message: "Lỗi hệ thống",
                description: "Đã xảy ra lỗi khi tạo bác sĩ. Vui lòng thử lại sau.",
                placement: "bottomRight",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Thêm bác sĩ mới</h2>

            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                style={{ maxWidth: 700 }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                >
                    <Input type="email" placeholder="Nhập email..." />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu..." />
                </Form.Item>

                <Form.Item
                    label="Tên bác sĩ"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên bác sĩ!" }]}
                >
                    <Input placeholder="VD: Trần Minh Hòa" />
                </Form.Item>

                <Form.Item label="Giấy phép hành nghề" name="licenseNumber">
                    <Input placeholder="Nhập số giấy phép..." />
                </Form.Item>

                <Form.Item label="Kinh nghiệm (năm)" name="experience">
                    <InputNumber min={0} placeholder="Số năm kinh nghiệm" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Phí tư vấn (VNĐ)" name="consultationFee">
                    <InputNumber min={0} style={{ width: "100%" }} placeholder="VD: 300000" />
                </Form.Item>

                <Form.Item label="Số điện thoại" name="phoneNumber">
                    <Input placeholder="VD: 0987654321" />
                </Form.Item>

                <Form.Item label="Phòng khám" name="clinicId">
                    <Select placeholder="-- Chọn phòng khám --">
                        {clinics.map((c) => (
                            <Select.Option key={c._id} value={c._id}>
                                {c.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Chuyên khoa" name="specializationId">
                    <Select placeholder="-- Chọn chuyên khoa --">
                        {specializations.map((s) => (
                            <Select.Option key={s._id} value={s._id}>
                                {s.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Ảnh bác sĩ">
                    <Upload
                        beforeUpload={(file) => {
                            setThumbnail(file);
                            return false; // Không upload ngay
                        }}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                    {thumbnail && (
                        <img
                            src={URL.createObjectURL(thumbnail)}
                            alt="preview"
                            style={{ width: 100, borderRadius: 8, marginTop: 10 }}
                        />
                    )}
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ marginRight: 8 }}
                    >
                        {loading ? "Đang tạo..." : "Tạo bác sĩ"}
                    </Button>
                    <Button onClick={() => navigate("/admin/doctors")}>Hủy</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default DoctorCreate;
