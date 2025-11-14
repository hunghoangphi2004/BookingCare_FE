import { useEffect, useState } from "react";
import {
    deletePrescription,
    getAllPrescription,
    sendPrescriptionPDF
} from "../../../services/prescriptionService";

import { useNavigate, useLocation } from "react-router-dom";
import { Table, Button, Space, Typography, Alert, Modal, Tag } from "antd";

function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ page: 1, limit: 5 });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: "", message: "" });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const navigate = useNavigate();
    const { Title } = Typography;
    const location = useLocation();

    // 🔥 Nhận alert từ trang Create (giống Clinic)
    useEffect(() => {
        if (location.state?.alert) {
            setAlert(location.state.alert);
            navigate(location.pathname, { replace: true });
            setTimeout(() => setAlert({ type: "", message: "" }), 5000);
        }
    }, [location, navigate]);

    useEffect(() => {
        fetchPrescriptions(filters);
    }, [filters]);

    const fetchPrescriptions = async (params = filters) => {
        try {
            setLoading(true);
            const res = await getAllPrescription(params);

            if (res.success) {
                setPrescriptions(res.data);
                setPagination(res.pagination);
            } else {
                setAlert({ type: "error", message: res.message });
            }
        } catch (err) {
            setAlert({ type: "error", message: "Lỗi khi tải dữ liệu" });
        } finally {
            setLoading(false);
        }
    };

    // --- DELETE ---
    const showDeleteModal = (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            const res = await deletePrescription(selectedId);

            if (res.success) {
                setAlert({
                    type: "success",
                    message: "Xóa toa thuốc thành công!"
                });

                const newTotal = (pagination.total || 0) - 1;
                const totalPages = Math.ceil(newTotal / filters.limit);
                const newPage =
                    filters.page > totalPages ? totalPages : filters.page;

                setFilters((prev) => ({ ...prev, page: newPage }));

                setTimeout(() => {
                    fetchPrescriptions({ ...filters, page: newPage });
                }, 200);
            } else {
                setAlert({
                    type: "error",
                    message: res.message || "Không thể xóa"
                });
            }
        } catch (err) {
            setAlert({ type: "error", message: "Lỗi hệ thống" });
        } finally {
            setIsModalOpen(false);
            setSelectedId(null);
            setTimeout(() => setAlert({ type: "", message: "" }), 4000);
        }
    };

    // --- SEND EMAIL ---
    const handleSendEmail = async (id, email) => {
        if (!email) {
            setAlert({
                type: "error",
                message: "Không tìm thấy email bệnh nhân!"
            });
            return;
        }

        try {
            const res = await sendPrescriptionPDF(id, { email });
            if (res.success) {
                setAlert({
                    type: "success",
                    message: "Gửi PDF thành công!"
                });
            } else {
                setAlert({
                    type: "error",
                    message: res.message || "Gửi thất bại!"
                });
            }
        } catch (error) {
            setAlert({ type: "error", message: "Lỗi khi gửi email!" });
        } finally {
            setTimeout(() => setAlert({ type: "", message: "" }), 4000);
        }
    };

    // --- TABLE COLUMNS ---
    const columns = [
        {
            title: "#",
            render: (_, __, idx) =>
                (filters.page - 1) * filters.limit + idx + 1
        },
        {
            title: "Bác sĩ",
            render: (r) => r.doctorId?.name || "N/A"
        },
        {
            title: "Bệnh nhân",
            render: (r) =>
                r.patientId
                    ? `${r.patientId.firstName} ${r.patientId.lastName}`
                    : "N/A"
        },
        {
            title: "Chẩn đoán",
            dataIndex: "diagnosis"
        },
        {
            title: "Trạng thái",
            render: (r) =>
                r.status === "final" ? (
                    <Tag color="green">final</Tag>
                ) : (
                    <Tag color="gray">draft</Tag>
                )
        },
        {
            title: "Ngày tạo",
            render: (r) =>
                new Date(r.createdAt).toLocaleDateString("vi-VN")
        },
        {
            title: "Hành động",
            render: (r) => (
                <Space>
                    <Button
                        type="default"
                        size="small"
                        onClick={() =>
                            navigate(`/admin/prescriptions/detail/${r._id}`)
                        }
                    >
                        Xem
                    </Button>

                    <Button
                        type="primary"
                        size="small"
                        onClick={() =>
                            navigate(`/admin/prescriptions/edit/${r._id}`)
                        }
                    >
                        Sửa
                    </Button>

                    <Button
                        danger
                        size="small"
                        onClick={() => showDeleteModal(r._id)}
                    >
                        Xóa
                    </Button>

                    <Button
                        size="small"
                        onClick={() =>
                            handleSendEmail(
                                r._id,
                                r.patientId?.userId?.email
                            )
                        }
                    >
                        Gửi
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <>
            {/* ALERT */}
            {alert.message && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    showIcon
                    closable
                    onClose={() => setAlert({ type: "", message: "" })}
                    style={{ marginBottom: 16 }}
                />
            )}

            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 16
                }}
            >
                <Title level={3} style={{ margin: 0 }}>
                    Danh sách toa thuốc: {pagination.total || 0}
                </Title>

                <Button
                    type="primary"
                    onClick={() => navigate("/admin/prescriptions/create")}
                >
                    + Tạo toa thuốc mới
                </Button>
            </div>

            {/* TABLE */}
            <Table
                columns={columns}
                dataSource={prescriptions}
                rowKey={(r) => r._id}
                loading={loading}
                pagination={{
                    current: pagination.page,
                    pageSize: filters.limit,
                    total: pagination.total,
                    onChange: (page) =>
                        setFilters((prev) => ({ ...prev, page }))
                }}
                scroll={{ x: 1200 }}
            />

            {/* DELETE CONFIRM MODAL */}
            <Modal
                title="Xác nhận xóa toa thuốc"
                open={isModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                okText="Xóa"
                okType="danger"
                cancelText="Hủy"
            >
                <p>Bạn có chắc muốn xóa toa thuốc này?</p>
            </Modal>
        </>
    );
}

export default Prescriptions;
