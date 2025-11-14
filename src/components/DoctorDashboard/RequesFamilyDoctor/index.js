import { useEffect, useState } from "react";
import {
  getAllFamilyRequests,
  approveFamilyDoctor,
  rejectFamilyDoctor,
  cancelFamilyDoctor,
} from "../../../services/familyService";

import {
  Table,
  Tag,
  Button,
  Modal,
  Input,
  Pagination,
  Typography,
  Space,
  message,
} from "antd";

const { Title } = Typography;

function RequestFamilyDoctorDashboard() {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getAllFamilyRequests(filters, filters.page, filters.limit);

      if (res.success) {
        setRequests(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (familyId, doctorRequestId) => {
    try {
      await approveFamilyDoctor(familyId, doctorRequestId);
      message.success("Đã duyệt yêu cầu thành công!");
      fetchRequests();
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi duyệt yêu cầu");
    }
  };

  const handleReject = async (familyId, doctorRequestId) => {
    Modal.confirm({
      title: "Nhập lý do từ chối",
      content: <Input id="rejectReason" placeholder="Lý do..." />,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        const reason = document.getElementById("rejectReason").value;
        if (!reason) return message.warning("Vui lòng nhập lý do!");

        try {
          await rejectFamilyDoctor(familyId, doctorRequestId, reason);
          message.success("Đã từ chối yêu cầu");
          fetchRequests();
        } catch (err) {
          console.error(err);
          message.error("Lỗi khi từ chối yêu cầu");
        }
      },
    });
  };

  const handleCancel = async (familyId, doctorRequestId) => {
    Modal.confirm({
      title: "Bạn có chắc muốn hủy yêu cầu này không?",
      okText: "Hủy yêu cầu",
      okType: "danger",
      onOk: async () => {
        try {
          await cancelFamilyDoctor(familyId, doctorRequestId);
          message.info("Đã hủy yêu cầu");
          fetchRequests();
        } catch (err) {
          console.error(err);
          message.error("Lỗi khi hủy yêu cầu");
        }
      },
    });
  };

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const flatData = requests.flatMap((family) =>
    family.doctorRequests.map((req) => ({
      key: `${family._id}-${req._id}`,
      familyId: family._id,
      doctorRequestId: req._id,
      familyName: family.familyName,
      owner: family.owner?.email,
      doctor: req.doctorId?.name,
      note: req.requestNote,
      startDate: req.schedule?.startDate?.slice(0, 10),
      frequency: req.schedule?.frequency,
      status: req.status,
      rejectionReason: req.rejectionReason,
    }))
  );

  const statusTag = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="gold">Chờ duyệt</Tag>;
      case "approved":
        return <Tag color="green">Đã duyệt</Tag>;
      case "rejected":
        return <Tag color="red">Đã từ chối</Tag>;
      case "cancelled":
        return <Tag color="default">Đã hủy</Tag>;
      default:
        return "-";
    }
  };

  const columns = [
    {
      title: "#",
      render: (_, __, index) =>
        (filters.page - 1) * filters.limit + index + 1,
      width: 60,
    },
    {
      title: "Tên gia đình",
      dataIndex: "familyName",
    },
    {
      title: "Chủ hộ",
      dataIndex: "owner",
      render: (v) => v || "—",
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctor",
      render: (v) => v || "—",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      render: (v) => v || "—",
      width: 120,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
    },
    {
      title: "Tần suất",
      dataIndex: "frequency",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => statusTag(status),
    },
    {
      title: "Thao tác",
      render: (_, row) => {
        if (row.status === "pending") {
          return (
            <Space>
              <Button type="primary" size="small"
                onClick={() => handleApprove(row.familyId, row.doctorRequestId)}
              >
                Duyệt
              </Button>

              <Button danger size="small"
                onClick={() => handleReject(row.familyId, row.doctorRequestId)}
              >
                Từ chối
              </Button>

              <Button warning size="small"
                onClick={() => handleCancel(row.familyId, row.doctorRequestId)}
              >
                Hủy
              </Button>
            </Space>
          );
        }

        if (row.status === "rejected") {
          return (
            <Button size="small"
              onClick={() => Modal.info({ title: "Lý do từ chối", content: row.rejectionReason })}
            >
              Lý do
            </Button>
          );
        }

        if (row.status === "approved") {
          return <Button size="small" type="default">Xem chi tiết</Button>;
        }

        return null;
      },
    },
  ];

  return (
    <div className="container py-4">
      <Title level={3} style={{ marginBottom: 20 }}>Danh sách yêu cầu bác sĩ gia đình</Title>

      <Table
        bordered
        loading={loading}
        columns={columns}
        dataSource={flatData}
        pagination={false}
        rowClassName="align-middle"
      />

      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={filters.limit}
            onChange={(page) => setFilters({ ...filters, page })}
          />
        </div>
      )}
    </div>
  );
}

export default RequestFamilyDoctorDashboard;
