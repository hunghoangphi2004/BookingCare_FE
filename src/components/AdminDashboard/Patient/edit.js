import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Form,
    Input,
    DatePicker,
    Select,
    Upload,
    Button,
    Card,
    Typography,
    Alert,
    message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getPatientById, updatePatient } from "../../../services/patientService";

const { Title } = Typography;
const { Option } = Select;

function PatientEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);
    const [oldPatient, setOldPatient] = useState(null);
    const [alert, setAlert] = useState({ type: "", message: "", visible: false });

    // 🟢 Lấy dữ liệu bệnh nhân khi vào trang
    useEffect(() => {
        const fetchDataPatient = async () => {
            try {
                const res = await getPatientById(id);
                const patient = res.data;

                if (patient) {
                    setOldPatient(patient);

                    form.setFieldsValue({
                        email: patient.user?.email || "",
                        password: "",
                        firstName: patient.patient?.firstName || "",
                        lastName: patient.patient?.lastName || "",
                        phoneNumber: patient.patient?.phoneNumber || "",
                        dateOfBirth: patient.patient?.dateOfBirth
                            ? dayjs(patient.patient.dateOfBirth)
                            : null, // ✅ convert string -> dayjs
                        gender: patient.patient?.gender || "other",
                        address: patient.patient?.address || "",
                        emergencyContactName:
                            patient.patient?.emergencyContact?.name || "",
                        emergencyContactPhone:
                            patient.patient?.emergencyContact?.phone || "",
                        emergencyContactRelationship:
                            patient.patient?.emergencyContact?.relationship || "",
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                message.error("Không thể tải thông tin bệnh nhân!");
            }
        };

        fetchDataPatient();
    }, [id, form]);

    // 🟢 Submit form
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
            formData.append(
                "emergencyContact[relationship]",
                values.emergencyContactRelationship || ""
            );

            if (thumbnail) formData.append("thumbnail", thumbnail);

            const res = await updatePatient(id, formData);

            if (res.success) {
                navigate("/admin/patients", {
                    state: {
                        alert: {
                            type: "success",
                            message: "Cập nhật bệnh nhân thành công!",
                        },
                    },
                });
            } else {
                setAlert({
                    type: "error",
                    message: res.message || "Không thể cập nhật bệnh nhân!",
                    visible: true,
                });
            }
        } catch (err) {
            console.error(err);
            setAlert({
                type: "error",
                message: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại!",
                visible: true,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!oldPatient)
        return <p style={{ textAlign: "center", marginTop: 50 }}>Đang tải dữ liệu...</p>;

    return (
        <>
            {/* 🟡 Thông báo Alert */}
            {alert.visible && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    showIcon
                    closable
                    onClose={() => setAlert({ type: "", message: "", visible: false })}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Card style={{ maxWidth: 700, margin: "0 auto" }}>
                <Title level={3}>Sửa thông tin bệnh nhân</Title>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ gender: "other" }}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Vui lòng nhập email" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mật khẩu (để trống nếu không đổi)" name="password">
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Họ"
                        name="lastName"
                        rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên"
                        name="firstName"
                        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Số điện thoại" name="phoneNumber">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Ngày sinh" name="dateOfBirth">
                        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Giới tính" name="gender">
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
                        <Form.Item
                            name="emergencyContactName"
                            noStyle
                            rules={[{ required: false }]}
                        >
                            <Input placeholder="Tên" className="mb-2" />
                        </Form.Item>

                        <Form.Item
                            name="emergencyContactPhone"
                            noStyle
                            rules={[{ required: false }]}
                        >
                            <Input placeholder="Số điện thoại" className="mb-2" />
                        </Form.Item>

                        <Form.Item
                            name="emergencyContactRelationship"
                            noStyle
                            rules={[{ required: false }]}
                        >
                            <Input placeholder="Mối quan hệ" />
                        </Form.Item>
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

                        {(thumbnail || oldPatient?.patient?.thumbnail) && (
                            <img
                                src={
                                    thumbnail
                                        ? URL.createObjectURL(thumbnail)
                                        : oldPatient.patient.thumbnail
                                }
                                alt="preview"
                                width="100"
                                className="mt-2"
                                style={{ borderRadius: 8 }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
}

export default PatientEdit;
