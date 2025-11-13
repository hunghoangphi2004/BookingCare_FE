import { useEffect, useState } from "react";
import { getAllSupporter, deleteSupporter } from "../../../services/supporterService";
import { useNavigate, useLocation } from "react-router-dom";
import { Table, Button, Space, Typography, Alert, Modal } from "antd";

function Supporters() {
  const [supporters, setSupporters] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ page: 1, limit: 5 });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupporterId, setSelectedSupporterId] = useState(null);

  const navigate = useNavigate();
  const { Title } = Typography;
  const location = useLocation();

  // 🟢 Hiển thị alert được truyền từ trang khác (sau khi tạo/sửa)
  useEffect(() => {
    if (location.state?.alert) {
      setAlert(location.state.alert);
      navigate(location.pathname, { replace: true });
      setTimeout(() => setAlert({ type: "", message: "" }), 5000);
    }
  }, [location, navigate]);

  // 🟢 Fetch danh sách supporter
  const fetchSupporters = async (params = filters) => {
    try {
      setLoading(true);
      const res = await getAllSupporter(params);
      console.log(res)
      if (res.success) {
        setSupporters(res.data);
        setPagination(res.pagination);
      } else {
        setAlert({ type: "error", message: res.message || "Không lấy được danh sách hỗ trợ viên!" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Lỗi hệ thống khi tải dữ liệu!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupporters(filters);
  }, [filters]);

  // 🟢 Modal xác nhận xóa
  const showDeleteModal = (id) => {
    setSelectedSupporterId(id);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const res = await deleteSupporter(selectedSupporterId);
      if (res.success) {
        setAlert({ type: "success", message: "Xóa hỗ trợ viên thành công!" });
        const newTotal = (pagination.total || 0) - 1;
        const totalPages = Math.ceil(newTotal / (filters.limit || 5));
        const newPage = filters.page > totalPages ? totalPages : filters.page;
        setFilters((prev) => ({ ...prev, page: newPage }));
        setTimeout(() => fetchSupporters({ ...filters, page: newPage }), 200);
      } else {
        setAlert({ type: "error", message: res.message || "Không thể xóa hỗ trợ viên!" });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Đã xảy ra lỗi khi xóa!" });
    } finally {
      setIsModalOpen(false);
      setSelectedSupporterId(null);
      setTimeout(() => setAlert({ type: "", message: "" }), 5000);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedSupporterId(null);
  };

  // 🟢 Cấu hình bảng
  const columns = [
    {
      title: "#",
      render: (_, __, idx) => (filters.page - 1) * filters.limit + idx + 1,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "thumbnail",
      render: (src) =>
        src ? (
          <img
            src={src}
            alt="thumb"
            style={{
              width: 80,
              height: 80,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
        ) : (
          "—"
        ),
    },
    { title: "Tên hỗ trợ viên", dataIndex: "name" },
    { title: "Email", render: (r) => r.userId?.email || "—" },
    { title: "SĐT", dataIndex: "phoneNumber" },
    {
      title: "Hành động",
      render: (r) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/admin/supporters/edit/${r._id}`)}
          >
            Sửa
          </Button>
          <Button danger size="small" onClick={() => showDeleteModal(r._id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* 🟡 Alert hiển thị thông báo */}
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

      {/* 🟢 Tiêu đề + Nút thêm */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Danh sách hỗ trợ viên: {pagination.total || 0}
        </Title>
        <Button
          type="primary"
          onClick={() => navigate("/admin/supporters/create")}
        >
          Thêm mới
        </Button>
      </div>

      {/* 🟢 Bảng danh sách */}
      <Table
        columns={columns}
        dataSource={supporters}
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

      {/* 🟢 Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xóa"
        okType="danger"
        cancelText="Hủy"
      >
        <p>Bạn có chắc muốn xóa hỗ trợ viên này không?</p>
      </Modal>
    </>
  );
}

export default Supporters;
