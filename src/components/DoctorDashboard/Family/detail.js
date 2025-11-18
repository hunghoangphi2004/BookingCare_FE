import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFamilyById } from "../../../services/familyService";
import { getAllDoctor } from "../../../services/doctorService";
import {
  Card,
  Table,
  Tag,
  Button,
  Typography,
  Space,
  Spin,
  Alert,
  Descriptions,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function FamilyDetailInDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [family, setFamily] = useState(null);
  const [doctorsMap, setDoctorsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getFamilyById(id);
        console.log(res);
        if (res?.success && res?.family?.family) {
          setFamily(res.family.family);
        } else {
          setError(res?.message || "Không tải được dữ liệu gia đình");
          return;
        }

        const doctorRes = await getAllDoctor({ limit: 0 });
        console.log(doctorRes);
        if (doctorRes?.success && Array.isArray(doctorRes.data)) {
          const map = {};
          doctorRes.data.forEach((doc) => {
            console.log(doc);
            map[doc._id] = doc.name || doc.userId?.email || "Không rõ";
          });
          setDoctorsMap(map);
        }
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải thông tin gia đình");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Columns cho bảng thành viên
  const memberColumns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Quan hệ",
      dataIndex: "relationship",
      key: "relationship",
      render: (text) => text || "—",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "—",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => text || "—",
    },
  ];

  // Columns cho bảng bác sĩ gia đình
  const doctorColumns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctorId) => doctorsMap[doctorId] || doctorId,
    },
    {
      title: "Ghi chú",
      dataIndex: "requestNote",
      key: "requestNote",
      render: (text) => text || "—",
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "requestedAt",
      key: "requestedAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space direction="vertical" size="small">
          <Tag
            color={
              status === "approved"
                ? "success"
                : status === "pending"
                ? "warning"
                : status === "rejected"
                ? "error"
                : "default"
            }
          >
            {status}
          </Tag>
          {record.rejectionReason && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Lý do: {record.rejectionReason}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Lịch hẹn",
      dataIndex: "schedule",
      key: "schedule",
      render: (schedule) => {
        if (!schedule?.startDate) return "—";
        const startDate = new Date(schedule.startDate).toLocaleDateString();
        const frequency =
          schedule.frequency === "weekly"
            ? `Thứ ${schedule.dayOfWeek + 1}`
            : `Ngày ${schedule.dayOfMonth}`;
        return `${startDate} | ${frequency} | ${schedule.timeSlot}`;
      },
    },
  ];

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

  if (error) {
    return (
      <div className="container mt-4">
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!family) {
    return (
      <div className="container mt-4">
        <Alert
          message="Không tìm thấy"
          description="Không tìm thấy gia đình"
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", marginBottom: "24px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Chi tiết hồ sơ gia đình
          </Title>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/families")}
          >
            Quay lại
          </Button>
        </div>

        {/* Thông tin chung */}
        <Card title={<><UserOutlined /> Thông tin chung</>}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên gia đình">
              {family.familyName}
            </Descriptions.Item>
            <Descriptions.Item label="Chủ hộ">
              {family.ownerId?.email || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(family.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Thành viên */}
        <Card title={<><TeamOutlined /> Thành viên</>}>
          {family.members?.length > 0 ? (
            <Table
              bordered
              columns={memberColumns}
              dataSource={family.members.map((m, i) => ({
                key: i,
                ...m,
              }))}
              pagination={false}
              size="small"
            />
          ) : (
            <Text type="secondary">Không có thành viên nào.</Text>
          )}
        </Card>

        {/* Bác sĩ gia đình */}
        <Card title={<><MedicineBoxOutlined /> Bác sĩ gia đình</>}>
          {family.familyDoctors?.length > 0 ? (
            <Table
              bordered
              columns={doctorColumns}
              dataSource={family.familyDoctors.map((d, i) => ({
                key: i,
                ...d,
              }))}
              pagination={false}
              size="small"
            />
          ) : (
            <Text type="secondary">Chưa có bác sĩ gia đình nào.</Text>
          )}
        </Card>
      </Space>
    </div>
  );
}

export default FamilyDetailInDoctor;