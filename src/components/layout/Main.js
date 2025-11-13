// Main.js
import { Layout, Drawer, Affix } from "antd";
import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Sidenav from "./Sidenav";
import Header from "./Header";
import Footer from "./Footer";

const { Header: AntHeader, Content, Sider } = Layout;

function Main({ children }) {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(false);

  const openDrawer = () => setVisible(!visible);

  let { pathname } = useLocation();
  pathname = pathname ? pathname.replace("/", "") : "";

  useEffect(() => {
    if (pathname === "rtl") setPlacement("left");
    else setPlacement("right");
  }, [pathname]);

  return (
    <Layout
      className={`layout-dashboard ${pathname === "profile" ? "layout-profile" : ""} ${
        pathname === "rtl" ? "layout-dashboard-rtl" : ""
      }`}
    >
      <Drawer
        title={false}
        placement={placement === "right" ? "left" : "right"}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        width={250}
        className={`drawer-sidebar ${pathname === "rtl" ? "drawer-sidebar-rtl" : ""}`}
      >
        <Layout className={`layout-dashboard ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}>
          <Sider
            trigger={null}
            width={250}
            theme="light"
            className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""}`}
            style={{ background: sidenavType }}
          >
            <Sidenav color={sidenavColor} />
          </Sider>
        </Layout>
      </Drawer>

      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        trigger={null}
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""}`}
        style={{ background: sidenavType }}
      >
        <Sidenav color={sidenavColor} />
      </Sider>

      <Layout>
        {fixed ? (
          <Affix>
            <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
              <Header
                onPress={openDrawer}
                handleSidenavColor={setSidenavColor}
                handleSidenavType={setSidenavType}
                handleFixedNavbar={setFixed}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
            <Header
              onPress={openDrawer}
              handleSidenavColor={setSidenavColor}
              handleSidenavType={setSidenavType}
              handleFixedNavbar={setFixed}
            />
          </AntHeader>
        )}
        <Content className="content-ant"><Outlet /></Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default Main;
