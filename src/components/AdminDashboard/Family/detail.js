import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFamilyById } from "../../../services/familyService";
import { getAllDoctor } from "../../../services/doctorService";
import { Card, Table, Typography, Alert, Button, Badge, Space } from "antd";

const { Title } = Typography;

const genderMap = {
  male: "Nam",
  female: "Nữ"
};

const statusMap = {
  approved: "Đã duyệt",
  pending: "Đang chờ",
  rejected: "Bị từ chối"
};

function FamilyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [family, setFamily] = useState(null);
  const [doctorsMap, setDoctorsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy dữ liệu gia đình
        const res = await getFamilyById(id);
        if (res?.success && res?.family?.family) {
          setFamily(res.family.family);
        } else {
          setAlert({ type: "error", message: res?.message || "Không tải được dữ liệu gia đình" });
          return;
        }

        // Lấy danh sách bác sĩ để mapping tên
        const doctorRes = await getAllDoctor({ limit: 0 });
        if (doctorRes?.success && Array.isArray(doctorRes.data)) {
          const map = {};
          doctorRes.data.forEach((doc) => {
            map[doc._id] = doc.name || doc.userId?.email || "Không rõ";
          });
          setDoctorsMap(map);
        }
      } catch (err) {
        console.error(err);
        setAlert({ type: "error", message: "Lỗi khi tải thông tin gia đình" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;
  if (alert.message) return <Alert type={alert.type} message={alert.message} style={{ marginBottom: 16 }} showIcon closable />;
  if (!family) return <p className="text-center mt-5">Không tìm thấy gia đình</p>;

  const memberColumns = [
    { title: "#", render: (_, __, idx) => idx + 1 },
    { title: "Họ tên", dataIndex: "fullName" },
    { title: "Quan hệ", dataIndex: "relationship", render: r => r || "-" },
    { title: "Giới tính", dataIndex: "gender", render: g => genderMap[g] || "-" },
    { title: "Ngày sinh", dataIndex: "dateOfBirth", render: d => d ? new Date(d).toLocaleDateString() : "-" },
    { title: "SĐT", dataIndex: "phoneNumber", render: p => p || "-" }
  ];

  const doctorColumns = [
    { title: "#", render: (_, __, idx) => idx + 1 },
    { title: "Bác sĩ", dataIndex: "doctorId", render: id => doctorsMap[id] || id },
    { title: "Ghi chú", dataIndex: "requestNote", render: r => r || "-" },
    { title: "Ngày yêu cầu", dataIndex: "requestedAt", render: d => new Date(d).toLocaleString() },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status, record) => (
        <Space direction="vertical">
          <Badge
            color={
              status === "approved" ? "green" :
              status === "pending" ? "gold" :
              status === "rejected" ? "red" : "gray"
            }
            text={statusMap[status] || "-"}
          />
          {record.rejectionReason && <span style={{ fontSize: 12, color: "#888" }}>Lý do: {record.rejectionReason}</span>}
        </Space>
      )
    },
    {
      title: "Lịch hẹn",
      render: (_, record) =>
        record.schedule?.startDate
          ? `${new Date(record.schedule.startDate).toLocaleDateString()} | ${record.schedule.frequency === "weekly"
              ? `Thứ ${record.schedule.dayOfWeek + 1}`
              : `Ngày ${record.schedule.dayOfMonth}`
            } | ${record.schedule.timeSlot}`
          : "-"
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Chi tiết gia đình</Title>
        <Button onClick={() => navigate("/admin/families")}>Quay lại</Button>
      </div>

      <Card title="Thông tin chung" style={{ marginBottom: 16 }}>
        <p><strong>Tên gia đình:</strong> {family.familyName}</p>
        <p><strong>Chủ hộ:</strong> {family.ownerId?.email || "Không có"}</p>
        <p><strong>Ngày tạo:</strong> {new Date(family.createdAt).toLocaleString()}</p>
      </Card>

      <Card title="Thành viên" style={{ marginBottom: 16 }}>
        {family.members?.length > 0 ? (
          <Table
            dataSource={family.members}
            columns={memberColumns}
            rowKey={(r, i) => i}
            pagination={false}
            size="small"
          />
        ) : (
          <p>Không có thành viên nào.</p>
        )}
      </Card>

      <Card title="Bác sĩ gia đình">
        {family.familyDoctors?.length > 0 ? (
          <Table
            dataSource={family.familyDoctors}
            columns={doctorColumns}
            rowKey={(r, i) => i}
            pagination={false}
            size="small"
          />
        ) : (
          <p>Chưa có bác sĩ gia đình nào.</p>
        )}
      </Card>
    </div>
  );
}

export default FamilyDetail;
