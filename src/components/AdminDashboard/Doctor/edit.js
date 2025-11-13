import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorById, updateDoctor } from "../../../services/doctorService";
import { getAllSpec } from "../../../services/specializationService";
import { getAllClinic } from "../../../services/clinicService";
import { Form, Input, Button, Select, InputNumber, Upload, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const EditDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);
    const [oldThumbnail, setOldThumbnail] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [clinics, setClinics] = useState([]);

    // Lấy dữ liệu bác sĩ + danh sách chuyên khoa, phòng khám
    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await getDoctorById(id);
                if (res.data) {
                    const doc = res.data;
                    setOldThumbnail(doc.thumbnail);
                    form.setFieldsValue({
                        email: doc.userId?.email || "",
                        password: "",
                        name: doc.name || "",
                        licenseNumber: doc.licenseNumber || "",
                        experience: doc.experience || 0,
                        consultationFee: doc.consultationFee || 0,
                        phoneNumber: doc.phoneNumber || "",
                        clinicId: doc.clinicId?._id || "",
                        specializationId: doc.specializationId?._id || "",
                    });
                }
            } catch (err) {
                console.error(err);
                notification.error({ message: "Lỗi hệ thống", description: "Không thể tải thông tin bác sĩ" });
            }
        };

        const fetchData = async () => {
            try {
                const specRes = await getAllSpec();
                const clinicRes = await getAllClinic();
                setSpecializations(specRes?.data || []);
                setClinics(clinicRes?.data || []);
            } catch (err) {
                console.error(err);
                notification.error({ message: "Lỗi hệ thống", description: "Không thể tải dữ liệu" });
            }
        };

        fetchDoctor();
        fetchData();
    }, [id, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => formData.append(key, value));
            if (thumbnail) formData.append("thumbnail", thumbnail);

            const res = await updateDoctor(id, formData);
            if (res.success) {
                navigate("/admin/doctors", {
                    state: {
                        alert: {
                            type: "success",
                            message: "Cập nhật bác sĩ thành công!"
                        }
                    }
                });
            } else {
                notification.error({ message: "Lỗi", description: res.message || "Không thể cập nhật bác sĩ!" });
            }
        } catch (err) {
            console.error(err);
            notification.error({ message: "Lỗi hệ thống", description: "Đã xảy ra lỗi. Vui lòng thử lại!" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Sửa bác sĩ</h2>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ maxWidth: 700 }}
            >
                <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email!" }]}>
                    <Input type="email" />
                </Form.Item>

                <Form.Item label="Mật khẩu" name="password">
                    <Input.Password placeholder="Để trống nếu không đổi" />
                </Form.Item>

                <Form.Item label="Tên bác sĩ" name="name" rules={[{ required: true, message: "Vui lòng nhập tên bác sĩ!" }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Giấy phép hành nghề" name="licenseNumber">
                    <Input />
                </Form.Item>

                <Form.Item label="Kinh nghiệm (năm)" name="experience">
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Phí tư vấn (VNĐ)" name="consultationFee">
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Số điện thoại" name="phoneNumber">
                    <Input />
                </Form.Item>

                <Form.Item label="Phòng khám" name="clinicId">
                    <Select placeholder="-- Chọn phòng khám --">
                        {clinics.map(c => <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>)}
                    </Select>
                </Form.Item>

                <Form.Item label="Chuyên khoa" name="specializationId">
                    <Select placeholder="-- Chọn chuyên khoa --">
                        {specializations.map(s => <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>)}
                    </Select>
                </Form.Item>

                <Form.Item label="Ảnh bác sĩ">
                    <Upload
                        beforeUpload={(file) => { setThumbnail(file); return false; }}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                    {thumbnail ? (
                        <img src={URL.createObjectURL(thumbnail)} alt="preview" width={100} style={{ marginTop: 10 }} />
                    ) : oldThumbnail ? (
                        <img src={oldThumbnail} alt="old doctor" width={100} style={{ marginTop: 10 }} />
                    ) : null}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                        Lưu thay đổi
                    </Button>
                    <Button onClick={() => navigate("/admin/doctors")}>Hủy</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditDoctor;
