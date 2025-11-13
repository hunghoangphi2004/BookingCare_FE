import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllPatient, deletePatient } from "../../../services/patientService";
import { Table, Button, Space, Typography, Alert, Modal } from "antd";

function Patients() {
    const [patients, setPatients] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ page: 1, limit: 5 });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { Title } = Typography;

    useEffect(() => {
        // Nếu có alert từ create/edit
        if (location.state?.alert) {
            setAlert(location.state.alert);
            navigate(location.pathname, { replace: true });
            setTimeout(() => setAlert({ type: '', message: '' }), 5000);
        }
    }, [location, navigate]);

    const fetchPatients = async (params = filters) => {
        try {
            setLoading(true);
            const res = await getAllPatient(params);
            if (res.success) {
                setPatients(res.data);
                setPagination(res.pagination);
            } else {
                setAlert({ type: 'error', message: res.message || 'Không lấy được dữ liệu' });
            }
        } catch (err) {
            console.error(err);
            setAlert({ type: 'error', message: 'Có lỗi xảy ra khi lấy dữ liệu' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients(filters);
    }, [filters]);

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    // Xóa bệnh nhân
    const showDeleteModal = (id) => {
        setSelectedPatientId(id);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const res = await deletePatient(selectedPatientId);
            if (res.success) {
                setAlert({ type: 'success', message: 'Xóa bệnh nhân thành công!' });
                const newTotal = (pagination.total || 0) - 1;
                const totalPages = Math.ceil(newTotal / (filters.limit || 5));
                const newPage = filters.page > totalPages ? totalPages : filters.page;
                setFilters(prev => ({ ...prev, page: newPage }));
                setTimeout(() => fetchPatients({ ...filters, page: newPage }), 200);
            } else {
                setAlert({ type: 'error', message: res.message || 'Không thể xóa bệnh nhân' });
            }
        } catch (err) {
            setAlert({ type: 'error', message: 'Đã xảy ra lỗi hệ thống' });
        } finally {
            setIsModalOpen(false);
            setSelectedPatientId(null);
            setTimeout(() => setAlert({ type: '', message: '' }), 5000);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedPatientId(null);
    };

    const columns = [
        { title: '#', render: (_, __, idx) => (filters.page - 1) * filters.limit + idx + 1 },
        {
            title: 'Hình ảnh',
            dataIndex: 'thumbnail',
            render: src => <img src={src} alt="thumb" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />
        },
        { title: 'Họ tên', render: r => `${r.firstName} ${r.lastName}` },
        { title: 'Mã bệnh nhân', dataIndex: 'patientId' },
        { title: 'Email', render: r => r.userId?.email },
        { title: 'SĐT', dataIndex: 'phoneNumber' },
        {
            title: 'Trạng thái',
            render: r => r.userId?.isActive
                ? <Button type="primary" size="small">Đang hoạt động</Button>
                : <Button danger size="small">Đã khóa</Button>
        },
        {
            title: 'Hành động',
            render: r => (
                <Space>
                    <Button type="primary" size="small" onClick={() => navigate(`/admin/patients/edit/${r._id}`)}>Sửa</Button>
                    <Button danger size="small" onClick={() => showDeleteModal(r._id)}>Xoá</Button>
                </Space>
            )
        }
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
                    onClose={() => setAlert({ type: '', message: '' })}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Danh sách bệnh nhân: {pagination.total || 0}</Title>
                <Button type="primary" onClick={() => navigate("/admin/patients/create")}>Thêm mới</Button>
            </div>

            <Table
                columns={columns}
                dataSource={patients}
                rowKey={r => r._id}
                loading={loading}
                pagination={{
                    current: pagination.page,
                    pageSize: filters.limit,
                    total: pagination.total,
                    onChange: handlePageChange
                }}
                scroll={{ x: 1200 }}
            />

            <Modal
                title="Xác nhận xóa"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Xóa"
                okType="danger"
                cancelText="Hủy"
            >
                <p>Bạn có chắc muốn xóa bệnh nhân này không?</p>
            </Modal>
        </>
    );
}

export default Patients;
