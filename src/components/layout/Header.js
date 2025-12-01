import { Row, Col, Button, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../services/authService";
import Cookies from "js-cookie";

const togglerIcon = (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>
);


function Header({ onPress }) {
  const profile = Cookies.get("profile");
  const profileObj = profile ? JSON.parse(profile) : null;
  const navigate = useNavigate();
  console.log(profileObj)

  const accountMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/admin/profile">Hồ sơ</Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={async () => {
          await logoutAdmin();
          Object.keys(Cookies.get()).forEach((cookieName) => Cookies.remove(cookieName, { path: "/" }));
          navigate("/admin/login");
        }}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Row justify="space-between" align="middle" style={{ height: 64 }}>
      <Col>
        <Button type="text" className="sidebar-toggler" onClick={onPress}>
          {togglerIcon}
        </Button>
      </Col>
      <Col>
        <Dropdown overlay={accountMenu} placement="bottomRight" trigger={["click"]}>
          <Button type="text" style={{ display: "flex", alignItems: "center" }}>
            <Avatar style={{ marginRight: 10 }} icon={<UserOutlined />} />
            Tài khoản
          </Button>
        </Dropdown>
      </Col>
    </Row>
  );
}

export default Header;
