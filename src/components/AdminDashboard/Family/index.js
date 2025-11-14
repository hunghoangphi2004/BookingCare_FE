import { useEffect, useState } from "react";
import { getAllFamily} from "../../../services/familyService";
import { useNavigate, useLocation } from "react-router-dom";
import { Table, Button, Typography, Alert, Space } from "antd";

const { Title } = Typography;

function Families() {
  const [families, setFamilies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ page: 1, limit: 5 });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const navigate = useNavigate();
  const location = useLocation();

  // Hiển thị alert từ navigation state
  useEffect(() => {
    if (location.state?.alert) {
      setAlert(location.state.alert);
      navigate(location.pathname, { replace: true });
      setTimeout(() => setAlert({ type: "", message: "" }), 5000);
    }
  }, [location, navigate]);

  const fetchFamilies = async (params = filters) => {
    try {
      setLoading(true);
      const res = await getAllFamily(params);
      if (res.success) {
        setFamilies(res.data);
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

  useEffect(() => {
    fetchFamilies(filters);
  }, [filters]);

  const columns = [
    {
      title: "#",
      render: (_, __, idx) => (filters.page - 1) * filters.limit + idx + 1
    },
    {
      title: "Tên gia đình",
      dataIndex: "familyName"
    },
    {
      title: "Chủ hộ",
      render: r => r.owner?.email
    },
    {
      title: "Số thành viên",
      render: r => r.members?.length || 0
    },
    {
      title: "Hành động",
      render: r => (
        <Space>
          <Button type="primary" size="small" onClick={() => navigate(`/admin/families/detail/${r._id}`)}>
            Xem
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          Danh sách gia đình: {pagination.total || 0}
        </Title>
      </div>

      <Table
        columns={columns}
        dataSource={families}
        rowKey={r => r._id}
        loading={loading}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: pagination.total,
          onChange: page => setFilters(prev => ({ ...prev, page }))
        }}
        scroll={{ x: 800 }}
      />
    </div>
  );
}

export default Families;
