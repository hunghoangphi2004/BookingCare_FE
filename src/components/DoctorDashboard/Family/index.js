import { useEffect, useState } from "react";
import { getAllFamilyRequests } from "../../../services/familyService";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Tag,
  Button,
  Typography,
  Space,
  Spin,
  Pagination,
  Card,
} from "antd";
import { EyeOutlined, TeamOutlined } from "@ant-design/icons";

const { Title } = Typography;

function ApprovedFamilyDashboard() {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchApprovedFamilies = async () => {
    try {
      setLoading(true);
      const res = await getAllFamilyRequests({}, filters.page, filters.limit);
      console.log("Fetched families:", res);

      if (res.success) {
        // Lọc các request có status = "approved"
        const approvedList = [];

        res.data.forEach((family) => {
          family.doctorRequests
            ?.filter((req) => req.status === "approved")
            .forEach((req) => {
              approvedList.push({
                familyId: family._id,
                familyName: family.familyName,
                owner: family.owner,
                doctor: req.doctorId,
                schedule: req.schedule,
                status: req.status,
                approvedAt: req.approvedAt,
              });
            });
        });

        setApprovedRequests(approvedList);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedFamilies();
  }, [filters]);

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) =>
        (filters.page - 1) * filters.limit + index + 1,
    },
    {
      title: "Tên gia đình",
      dataIndex: "familyName",
      key: "familyName",
    },
    {
      title: "Chủ hộ",
      dataIndex: "owner",
      key: "owner",
      render: (owner) => owner?.email || "—",
    },
    {
      title: "Ngày duyệt",
      dataIndex: "approvedAt",
      key: "approvedAt",
      render: (date) => (date ? date.slice(0, 10) : "—"),
    },
    {
      title: "Tần suất khám",
      dataIndex: "schedule",
      key: "frequency",
      render: (schedule) => schedule?.frequency || "—",
    },
    {
      title: "Khung giờ",
      dataIndex: "schedule",
      key: "timeSlot",
      render: (schedule) => schedule?.timeSlot || "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color="success" style={{ textTransform: "uppercase" }}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() =>
            navigate(`/admin/doctor/get-family-by-id/${record.familyId}`)
          }
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const dataSource = approvedRequests.map((req, i) => ({
    key: `${req.familyId}-${i}`,
    ...req,
  }));

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={3} style={{ margin: 0 }}>
            <TeamOutlined /> Gia đình đã được duyệt
          </Title>

          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            locale={{
              emptyText: "Không có yêu cầu nào đã duyệt.",
            }}
          />

          {pagination.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={filters.limit}
                onChange={(page) =>
                  setFilters((prev) => ({ ...prev, page }))
                }
                showSizeChanger={false}
              />
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
}

export default ApprovedFamilyDashboard;