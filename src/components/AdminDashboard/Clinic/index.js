import { useEffect, useState } from "react";
import { getAllClinic, deleteClinic } from "../../../services/clinicService";
import { useNavigate, useLocation } from "react-router-dom";
import { Table, Button, Space, Typography, Alert, Modal } from "antd";

function Clinics() {
    const [clinics, setClinics] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ page: 1, limit: 5 });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClinicId, setSelectedClinicId] = useState(null);

    const navigate = useNavigate();
    const { Title } = Typography;

    const location = useLocation();

    useEffect(() => {
        if (location.state?.alert) {
            setAlert(location.state.alert);
            navigate(location.pathname, { replace: true });
            setTimeout(() => setAlert({ type: '', message: '' }), 5000);
        }
    }, [location, navigate]);
    const fetchClinics = async (params = filters) => {
        try {
            setLoading(true);
            const res = await getAllClinic(params);
            if (res.success) {
                setClinics(res.data);
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
        fetchClinics(filters);
    }, [filters]);

    // Delete clinic
    const showDeleteModal = (id) => {
        setSelectedClinicId(id);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const res = await deleteClinic(selectedClinicId);
            if (res.success) {
                setAlert({ type: 'success', message: 'Xóa phòng khám thành công!' });
                const newTotal = (pagination.total || 0) - 1;
                const totalPages = Math.ceil(newTotal / (filters.limit || 5));
                const newPage = filters.page > totalPages ? totalPages : filters.page;
                setFilters(prev => ({ ...prev, page: newPage }));
                setTimeout(() => fetchClinics({ ...filters, page: newPage }), 200);
            } else {
                setAlert({ type: 'error', message: res.message || 'Không thể xóa phòng khám' });
            }
        } catch (err) {
            setAlert({ type: 'error', message: 'Đã xảy ra lỗi hệ thống' });
        } finally {
            setIsModalOpen(false);
            setSelectedClinicId(null);
            setTimeout(() => setAlert({ type: '', message: '' }), 5000);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedClinicId(null);
    };

    const columns = [
        { title: '#', render: (_, __, idx) => (filters.page - 1) * filters.limit + idx + 1 },
        { title: 'Hình ảnh', dataIndex: 'image', render: src => <img src={src} alt="thumb" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} /> },
        { title: 'Tên', dataIndex: 'name' },
        { title: 'Slug', dataIndex: 'slug' },
        { title: 'SĐT', dataIndex: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address' },
        { title: 'Tình trạng', render: r => r.isActive ? <Button type="primary" size="small">Đang hoạt động</Button> : <Button danger size="small">Đã khóa</Button> },
        {
            title: 'Hành động',
            render: r => (
                <Space>
                    <Button type="primary" size="small" onClick={() => navigate(`/admin/clinics/edit/${r._id}`)}>Sửa</Button>
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
                    onClose={() => setAlert({ type: '', message: '' })}
                    style={{ marginBottom: 16 }}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Danh sách phòng khám: {pagination.total || 0}</Title>
                <Button type="primary" onClick={() => navigate("/admin/clinics/create")}>Thêm mới</Button>
            </div>

            <Table
                columns={columns}
                dataSource={clinics}
                rowKey={r => r._id}
                loading={loading}
                pagination={{
                    current: pagination.page,
                    pageSize: filters.limit,
                    total: pagination.total,
                    onChange: page => setFilters(prev => ({ ...prev, page })),
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
                <p>Bạn có chắc muốn xóa phòng khám này không?</p>
            </Modal>
        </>
    );
}

export default Clinics;
