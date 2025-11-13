import { useEffect, useState } from "react";
import { Card, Row, Col, Avatar, Typography, Tag, message } from "antd";
import { UserOutlined, MedicineBoxOutlined, TeamOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const profileCookie = Cookies.get("profile");
    if (!profileCookie) {
      message.warning("Bạn chưa đăng nhập!");
      navigate("/admin/login");
      return;
    }

    const profileObj = JSON.parse(profileCookie);

    if (!["admin", "doctor", "supporter"].includes(profileObj.role)) {
      message.error("Bạn không có quyền truy cập trang này!");
      navigate("/");
      return;
    }

    setProfile(profileObj);
  }, [navigate]);

  if (!profile) return null;

  const renderRoleInfo = () => {
    switch (profile.role) {
      case "admin":
        return (
          <>
            {/* <Text>Email: {profile.email}</Text>
            <br />
            <Text>Token: {profile.token}</Text> */}
          </>
        );
      case "doctor":
        return (
          <>
            <Text>Email: {profile.email}</Text>
            <br />
            <Text>Specialty: {profile.specialty || "Chưa cập nhật"}</Text>
            <br />
            <Text>License: {profile.license || "Chưa cập nhật"}</Text>
          </>
        );
      case "supporter":
        return (
          <>
            <Text>Email: {profile.email}</Text>
            <br />
            <Text>Department: {profile.department || "Chưa cập nhật"}</Text>
            <br />
            <Text>Phone: {profile.phone || "Chưa cập nhật"}</Text>
          </>
        );
      default:
        return null;
    }
  };

  const roleIcon = () => {
    switch (profile.role) {
      case "admin":
        return <UserOutlined />;
      case "doctor":
        return <MedicineBoxOutlined />;
      case "supporter":
        return <TeamOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  return (
    <Row justify="center" style={{ padding: "50px 16px" }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card title={`${profile.role.toUpperCase()} Profile`}>
          <Row gutter={[16, 16]} align="middle">
            <Col>
              <Avatar size={100} icon={roleIcon()} />
            </Col>
            <Col flex="auto">
              <Title level={3}>{profile.email}</Title>
              <Text strong>Role: </Text>
              <Tag color="blue">{profile.role.toUpperCase()}</Tag>
            </Col>
          </Row>

          <Row style={{ marginTop: 24 }} gutter={[8, 8]}>
            <Col span={24}>{renderRoleInfo()}</Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
