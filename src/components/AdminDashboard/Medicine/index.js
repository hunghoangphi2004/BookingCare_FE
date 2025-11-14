import { useEffect, useState } from "react";
import { getAllMedicine, deleteMedicine } from "../../../services/medicineService";
import { useNavigate, useLocation } from "react-router-dom";
import { Table, Button, Space, Typography, Alert, Modal } from "antd";

function Medicines() {
    const [medicines, setMedicines] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ page: 1, limit: 5 });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { Title } = Typography;

    // 🔥 Nhận alert từ trang Create (giống Clinic)
    useEffect(() => {
        if (location.state?.alert) {
            setAlert(location.state.alert);
            navigate(location.pathname, { replace: true });
            setTimeout(() => setAlert({ type: "", message: "" }), 5000);
        }
    }, [location, navigate]);

    useEffect(() => {
        fetchMedicines(filters);
    }, [filters]);

    const fetchMedicines = async (params = {}) => {
        try {
            setLoading(true);
            const res = await getAllMedicine(params);

            if (res.success) {
                setMedicines(res.data);
                setPagination(res.pagination);
            } else {
                setAlert({ type: "error", message: res.message || "Không lấy được dữ liệu" });
            }
        } catch (err) {
            console.error(err);
            setAlert({ type: "error", message: "Có lỗi xảy ra khi lấy dữ liệu" });
        } finally {
            setLoading(false);
        }
    };

    const showDeleteModal = (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            const res = await deleteMedicine(selectedId);
            if (res.success) {
                setAlert({ type: "success", message: "Xóa thuốc thành công!" });

                const newTotal = (pagination.total || 0) - 1;
                const totalPages = Math.ceil(newTotal / filters.limit);
                const newPage = filters.page > totalPages ? totalPages : filters.page;

                setFilters((prev) => ({ ...prev, page: newPage }));
                setTimeout(() => fetchMedicines({ ...filters, page: newPage }), 200);
            } else {
                setAlert({ type: "error", message: "Không thể xóa thuốc" });
            }
        } catch (err) {
            setAlert({ type: "error", message: "Lỗi hệ thống" });
        } finally {
            setIsModalOpen(false);
            setSelectedId(null);
            setTimeout(() => setAlert({ type: "", message: "" }), 4000);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedId(null);
    };

    const columns = [
        {
            title: "#",
            render: (_, __, idx) => (filters.page - 1) * filters.limit + idx + 1,
            width: 60,
        },
        { title: "Tên", dataIndex: "name" },
        { title: "Đơn vị", dataIndex: "unit" },
        { title: "Cách dùng", dataIndex: "usage" },
        { title: "Mô tả", dataIndex: "description" },
        {
            title: "Hành động",
            render: (r) => (
                <Space>
                    <Button type="primary" size="small" onClick={() => navigate(`/admin/medicines/edit/${r._id}`)}>
                        Sửa
                    </Button>
                    <Button danger size="small" onClick={() => showDeleteModal(r._id)}>
                        Xoá
                    </Button>
                </Space>
            ),
            width: 200,
        },
    ];

    return (
        <>
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

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <Title level={3} style={{ margin: 0 }}>
                    Danh sách thuốc: {pagination.total || 0}
                </Title>

                <Button type="primary" onClick={() => navigate("/admin/medicines/create")}>
                    + Thêm mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={medicines}
                rowKey={(r) => r._id}
                loading={loading}
                pagination={{
                    current: pagination.page,
                    pageSize: filters.limit,
                    total: pagination.total,
                    onChange: (page) => setFilters((prev) => ({ ...prev, page })),
                }}
                scroll={{ x: 1000 }}
            />

            <Modal
                title="Xác nhận xóa"
                open={isModalOpen}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="Xóa"
                okType="danger"
                cancelText="Hủy"
            >
                <p>Bạn có chắc muốn xóa thuốc này không?</p>
            </Modal>
        </>
    );
}

export default Medicines;
