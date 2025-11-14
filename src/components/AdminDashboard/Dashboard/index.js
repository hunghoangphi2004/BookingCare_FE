import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Spin, Alert } from "antd";
import { UserOutlined, TeamOutlined, MedicineBoxOutlined, HomeOutlined, AppstoreOutlined, FileTextOutlined, HeartOutlined } from '@ant-design/icons';
import { getStatistic } from "../../../services/dashboardService";

function Dashboard() {
  const [statistic, setStatistic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getStatistic();
        if (res.success) {
          setStatistic(res.statistic);
        } else {
          setError(res.message || "Không lấy được dữ liệu");
        }
      } catch (err) {
        console.error(err);
        setError("Lỗi hệ thống khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <Spin tip="Đang tải dữ liệu..." style={{ display: "block", marginTop: 50 }} />
    );
  if (error)
    return <Alert type="error" message={error} style={{ marginTop: 20 }} />;

  const statsList = [
    { title: "Bác sĩ", data: statistic.doctor, icon: <UserOutlined /> },
    { title: "Bệnh nhân", data: statistic.patient, icon: <TeamOutlined /> },
    { title: "Hỗ trợ viên", data: statistic.supporter, icon: <UserOutlined /> },
    { title: "Phòng khám", data: statistic.clinic, icon: <HomeOutlined /> },
    { title: "Chuyên khoa", data: statistic.specialization, icon: <AppstoreOutlined /> },
    { title: "Thuốc", data: statistic.medicine, icon: <MedicineBoxOutlined /> },
    { title: "Đơn thuốc", data: statistic.prescription, icon: <FileTextOutlined /> },
    { title: "Gia đình", data: { total: statistic.family.total }, icon: <HeartOutlined /> },
  ];

  const renderCard = (item) => (
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #e0f7fa, #80deea)',
        color: '#000',
      }}
    >
      <Statistic
        title={item.title}
        value={item.data.total}
        prefix={item.icon}
        valueStyle={{ fontWeight: 600 }}
      />
      {item.data.active !== undefined && (
        <div style={{ marginTop: 8, lineHeight: 1.5 }}>
          <div>Đang hoạt động: {item.data.active}</div>
          <div>Dừng hoạt động: {item.data.inactive}</div>
        </div>
      )}
    </Card>
  );

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Tổng quan</h2>
      <Row gutter={[16, 16]}>
        {statsList.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.title}>
            {renderCard(item)}
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Dashboard;
