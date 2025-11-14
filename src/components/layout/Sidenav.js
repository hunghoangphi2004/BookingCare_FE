// Sidenav.js
import { useState, useEffect } from "react";
import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "../../assets/images/logo.png";
import { adminMenu, doctorMenu, supporterMenu } from "../../config/constants/menus";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const profile = Cookies.get("profile") ? JSON.parse(Cookies.get("profile")) : null;
    if (!profile) return;

    switch (profile.role) {
      case "admin":
        setMenuItems(adminMenu);
        break;
      case "doctor":
        setMenuItems(doctorMenu);
        break;
      case "supporter":
        setMenuItems(supporterMenu);
        break;
      default:
        setMenuItems([]);
    }
  }, []);

  return (
    <div className="sidenav">
      <div className="brand">
        <img src={logo} alt="logo" />
        <span>Muse Dashboard</span>
      </div>
      <hr />
      <Menu theme="light" mode="inline" selectedKeys={[pathname]}>
        {menuItems.map((item) => (
          <Menu.Item key={item.path} icon={item.icon}>
            <NavLink to={item.path} style={{ display: "inline-block" }}>
              {item.label}
            </NavLink>
          </Menu.Item>
        ))}
      </Menu>

      {/* <div className="aside-footer">
        <div className="footer-box" style={{ background: color }}>
          <h6>Need Help?</h6>
          <p>Please check our docs</p>
          <Button type="primary" className="ant-btn-sm ant-btn-block">
            DOCUMENTATION
          </Button>
        </div>
      </div> */}
    </div>
  );
}

export default Sidenav;
