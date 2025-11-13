import { useEffect, useState } from "react";
import { getAllSpec, deleteSpecialization } from "../../../services/specializationService";
import { useNavigate, useLocation } from "react-router-dom";
import { Table, Button, Space, Modal, Typography, Alert } from "antd";

function Specializations() {
    const [specializations, setSpecializations] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ page: 1, limit: 5 });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpecId, setSelectedSpecId] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { Title } = Typography;

    useEffect(() => {
        if (location.state?.alert) {
            setAlert(location.state.alert);
            navigate(location.pathname, { replace: true });
            setTimeout(() => setAlert({ type: '', message: '' }), 5000);
        }
    }, [location, navigate]);

    useEffect(() => {
        fetchSpecializations(filters);
    }, [filters]);

    const fetchSpecializations = async (params = {}) => {
        try {
            setLoading(true);
            const res = await getAllSpec(params);
            if (res.success) {
                setSpecializations(res.data);
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

    const showDeleteModal = (id) => {
        setSelectedSpecId(id);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const res = await deleteSpecialization(selectedSpecId);
            if (res.success) {
                setAlert({ type: 'success', message: 'Xóa chuyên khoa thành công!' });
                const newTotal = (pagination.total || 0) - 1;
                const totalPages = Math.ceil(newTotal / (filters.limit || 5));
                const newPage = filters.page > totalPages ? totalPages : filters.page;
                setFilters(prev => ({ ...prev, page: newPage }));
                setTimeout(() => fetchSpecializations({ ...filters, page: newPage }), 200);
            } else {
                setAlert({ type: 'error', message: res.message || 'Không thể xóa chuyên khoa' });
            }
        } catch (err) {
            setAlert({ type: 'error', message: 'Đã xảy ra lỗi hệ thống' });
        } finally {
            setIsModalOpen(false);
            setSelectedSpecId(null);
            setTimeout(() => setAlert({ type: '', message: '' }), 5000);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedSpecId(null);
    };

    const columns = [
        {
            title: '#',
            render: (_, __, idx) => (filters.page - 1) * filters.limit + idx + 1,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            render: src => <img src={src} alt="thumb" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />
        },
        { title: 'Tên', dataIndex: 'name' },
        { title: 'Slug', dataIndex: 'slug' },
        { title: 'Mô tả', dataIndex: 'description' },
        {
            title: 'Hành động',
            render: record => (
                <Space>
                    <Button type="primary" size="small" onClick={() => navigate(`/admin/specializations/edit/${record._id}`)}>Sửa</Button>
                    <Button danger size="small" onClick={() => showDeleteModal(record._id)}>Xoá</Button>
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
                <Title level={3} style={{ margin: 0 }}>
                    Danh sách chuyên khoa: {pagination.total || 0}
                </Title>
                <Button
                    type="primary"
                    onClick={() => navigate("/admin/specializations/create")}
                >
                    Thêm mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={specializations}
                rowKey={r => r._id}
                loading={loading}
                pagination={{
                    current: pagination.page,
                    pageSize: filters.limit,
                    total: pagination.total,
                    onChange: page => setFilters(prev => ({ ...prev, page })),
                }}
                scroll={{ x: 800 }}
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
                <p>Bạn có chắc muốn xóa chuyên khoa này không?</p>
            </Modal>
        </>
    );
}

export default Specializations;
