import React from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import CustomHeader from "./header";
import SidebarLayout from "./sidebar";
const { Header, Content } = Layout;

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen">
      {/* Sider */}
      <Header style={{ background: colorBgContainer, padding: 0 }} className="">
        <div className="flex items-center  h-full">
          <div className="flex-1">
            <CustomHeader showAccountDropdown />
          </div>
        </div>
      </Header>

      <Layout style={{ backgroundColor: "white" }}>
        <SidebarLayout />

        {/* Nội dung chính - ĐÃ XÓA m-6, p-6, rounded-lg để sát lề hoàn toàn */}
        <Content className=" min-h-[280px]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
