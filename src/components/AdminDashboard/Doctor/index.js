import { useEffect, useState } from "react";
import { deleteDoctor, getAllDoctor } from "../../../services/doctorService";
import { getAllSpec } from "../../../services/specializationService";
import { getAllClinic } from "../../../services/clinicService";
import { useNavigate } from "react-router-dom";
import { Menu, Dropdown, Button, Table, Space, Typography, Alert, Modal, Input, Row, Col } from "antd";
import { DownOutlined } from '@ant-design/icons';
import React from "react";
import {
  SearchOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ page: 1, limit: 5 });
  const [loading, setLoading] = useState(true);
  const [specializations, setSpecializations] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const { Title } = Typography;

  useEffect(() => {
    if (location.state?.alert) {
      setAlert({ ...location.state.alert, visible: true });
      setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 5000);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await getAllSpec();
        if (res.success) setSpecializations(res.data);
      } catch (err) { console.log(err); }
    };
    const fetchClinics = async () => {
      try {
        const res = await getAllClinic();
        if (res.success) setClinics(res.data);
      } catch (err) { console.log(err); }
    };
    fetchSpecializations();
    fetchClinics();
  }, []);

  const fetchDoctors = async (params = filters) => {
    try {
      setLoading(true);
      const res = await getAllDoctor(params);
      console.log(res)
      if (res.success) {
        setDoctors(res.data);
        setPagination(res.pagination);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDoctors(filters); }, [filters]);


  const showDeleteModal = (id) => {
    setSelectedDoctorId(id);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const res = await deleteDoctor(selectedDoctorId);
      if (res.success) {
        setAlert({ type: 'success', message: 'Xoá bác sĩ thành công!' });

        const newTotal = (pagination.total || 0) - 1;
        const totalPages = Math.ceil(newTotal / (filters.limit || 5));
        const newPage = filters.page > totalPages ? totalPages : filters.page;

        setFilters(prev => ({ ...prev, page: newPage }));

        setTimeout(() => fetchDoctors({ ...filters, page: newPage }), 200);
      } else {
        setAlert({ type: 'error', message: res.message || 'Không thể xóa bác sĩ' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Đã xảy ra lỗi hệ thống' });
    } finally {
      setIsModalOpen(false);
      setSelectedDoctorId(null);
      setTimeout(() => setAlert({ type: '', message: '' }), 5000);
    }
  };


  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedDoctorId(null);
  };

  console.log(filters)

  const menuSpecializations = (
    <Menu
      onClick={(info) => setFilters(prev => ({ ...prev, specializationId: info.key === 'all' ? '' : info.key, page: 1 }))}
    >
      <Menu.Item key="all">Tất cả</Menu.Item>
      {specializations.map(s => <Menu.Item key={s._id}>{s.name}</Menu.Item>)}
    </Menu>
  );

  const menuClinics = (
    <Menu
      onClick={(info) => setFilters(prev => ({ ...prev, clinicId: info.key === 'all' ? '' : info.key, page: 1 }))}
    >
      <Menu.Item key="all">Tất cả</Menu.Item>
      {clinics.map(c => <Menu.Item key={c._id}>{c.name}</Menu.Item>)}
    </Menu>
  );

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
          Danh sách bác sĩ: {pagination.total || 0}
        </Title>
        <Button
          type="primary"
          onClick={() => navigate("/admin/doctors/create")}
        >
          Thêm mới
        </Button>
      </div>


      <div>
        <div className="my-4">
          <Row gutter={[16, 16]} align="middle">
            {/* Search input + button */}
            <Col xs={24} md={8}>
              <div style={{ display: 'flex', width: '100%' }}>
                <Input
                  placeholder="Tìm kiếm theo tên"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onPressEnter={() => setFilters(prev => ({ ...prev, keyword: searchValue, page: 1 }))}
                  style={{ flex: 1, height: 40 }}
                  allowClear
                />
                <Button
                  type="primary"
                  onClick={() => setFilters(prev => ({ ...prev, keyword: searchValue, page: 1 }))}
                  style={{ height: 40, marginLeft: 8 }}
                >
                  Tìm kiếm
                </Button>
              </div>
            </Col>

            {/* Chuyên khoa */}
            <Col xs={24} md={8}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="me-2">Chuyên khoa</span>
                <Dropdown overlay={menuSpecializations}>
                  <Button>
                    {filters.specializationId
                      ? specializations.find(s => s._id === filters.specializationId)?.name
                      : 'Tất cả'} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            </Col>

            {/* Phòng khám */}
            <Col xs={24} md={8}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="me-2">Phòng khám</span>
                <Dropdown overlay={menuClinics}>
                  <Button>
                    {filters.clinicId
                      ? clinics.find(c => c._id === filters.clinicId)?.name
                      : 'Tất cả'} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </div>

        <Table
          columns={[
            { title: '#', render: (_, __, idx) => (filters.page - 1) * filters.limit + idx + 1 },
            { title: 'Hình ảnh', dataIndex: 'thumbnail', render: src => <img src={src} alt="thumb" style={{ width: 80, borderRadius: 8 }} /> },
            { title: 'Bác sĩ', dataIndex: 'name' },
            { title: 'Email', render: r => r.userId?.email || '—' },
            { title: 'Slug', dataIndex: 'slug' },
            { title: 'Chuyên khoa', render: r => r.specializationId?.name || '—' },
            { title: 'Phòng khám', render: r => r.clinicId?.name || '—' },
            { title: 'SĐT', dataIndex: 'phoneNumber' },
            {
              title: 'Hành động',
              render: record => (
                <Space>
                  <Button type="primary" size="small" onClick={() => navigate(`/admin/doctors/edit/${record._id}`)}>Sửa</Button>
                  <Button danger size="small" onClick={() => showDeleteModal(record._id)}>Xoá</Button>
                </Space>
              )
            }
          ]}
          dataSource={doctors}
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

      </div>

      <Modal
        title="Xác nhận xóa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xóa"
        okType="danger"
        cancelText="Hủy"
      >
        <p>Bạn có chắc muốn xóa bác sĩ này không?</p>
      </Modal>
    </>
  );
}

export default Doctors;
