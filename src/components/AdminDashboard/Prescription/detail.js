import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getPrescriptionById,
    deletePrescription
} from "../../../services/prescriptionService";

import {
    Card,
    Typography,
    Table,
    Tag,
    Space,
    Button,
    Alert,
    Modal,
    Descriptions
} from "antd";

function PrescriptionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: "", message: "" });

    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const { Title } = Typography;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getPrescriptionById(id);
                if (res.success) {
                    setPrescription(res.data);
                } else {
                    setAlert({ type: "error", message: res.message });
                }
            } catch (e) {
                setAlert({ type: "error", message: "Lỗi khi tải dữ liệu" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        try {
            const res = await deletePrescription(id);
            if (res.success) {
                setAlert({ type: "success", message: "Xóa thành công!" });
                setTimeout(() => navigate("/admin/prescriptions"), 1200);
            } else {
                setAlert({ type: "error", message: res.message });
            }
        } catch (err) {
            setAlert({ type: "error", message: "Lỗi khi xóa" });
        } finally {
            setIsDeleteModal(false);
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (alert.message && !prescription)
        return <Alert message={alert.message} type="error" showIcon />;

    if (!prescription) return <p>Không tìm thấy toa thuốc.</p>;

    const doctorName = prescription.doctorId?.name || "Không rõ";
    const patientName =
        prescription.patientId
            ? `${prescription.patientId.firstName} ${prescription.patientId.lastName}`
            : "Không rõ";

    const medicineColumns = [
        { title: "#", render: (_, __, idx) => idx + 1, width: 50 },
        {
            title: "Tên thuốc",
            render: (r) => r.name || r.medicineId?.name || "N/A"
        },
        { title: "Liều", dataIndex: "dosage", width: 120 },
        { title: "Thời gian", dataIndex: "duration", width: 120 },
        { title: "Hướng dẫn", dataIndex: "instructions" }
    ];

    return (
        <>
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

            {/* HEADER */}
            <Space
                style={{
                    marginBottom: 16,
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Title level={3} style={{ margin: 0 }}>
                    Chi tiết toa thuốc
                </Title>

                <Space>
                    <Button onClick={() => navigate("/admin/prescriptions")}>
                        Quay lại
                    </Button>
                    <Button
                        type="primary"
                        onClick={() =>
                            navigate(`/admin/prescriptions/${id}/edit`)
                        }
                    >
                        Sửa
                    </Button>
                    <Button danger onClick={() => setIsDeleteModal(true)}>
                        Xóa
                    </Button>
                </Space>
            </Space>

            {/* MAIN INFO */}
            <Card title="Thông tin chung" bordered style={{ marginBottom: 24 }}>
                <Descriptions column={1}>
                    <Descriptions.Item label="Bác sĩ">
                        {doctorName}
                    </Descriptions.Item>

                    <Descriptions.Item label="Bệnh nhân">
                        {patientName}
                    </Descriptions.Item>

                    <Descriptions.Item label="Chẩn đoán">
                        {prescription.diagnosis || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        {prescription.status === "final" ? (
                            <Tag color="green">final</Tag>
                        ) : (
                            <Tag>draft</Tag>
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ghi chú">
                        {prescription.notes || "-"}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* MEDICINES */}
            <Card title="Danh sách thuốc">
                {prescription.medicines?.length > 0 ? (
                    <Table
                        dataSource={prescription.medicines}
                        columns={medicineColumns}
                        rowKey={(r) => r._id || Math.random()}
                        pagination={false}
                        bordered
                    />
                ) : (
                    <p>Không có thuốc trong toa này.</p>
                )}
            </Card>

            {/* DELETE MODAL */}
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModal}
                okText="Xóa"
                okType="danger"
                cancelText="Hủy"
                onOk={handleDelete}
                onCancel={() => setIsDeleteModal(false)}
            >
                Bạn có chắc muốn xóa toa thuốc này không?
            </Modal>
        </>
    );
}

export default PrescriptionDetail;
