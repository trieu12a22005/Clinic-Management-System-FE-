import React from "react";
import { Menu, ConfigProvider } from "antd";
import type { MenuProps } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

type MenuAppProps = {
  collapsed: boolean;
};

const MenuApp: React.FC<MenuAppProps> = () => {
  const { pathname } = useLocation();

  const items: MenuItem[] = [
    {
      key: "/home",
      icon: <PieChartOutlined />,
      label: <Link to="/home">Home</Link>,
    },
    {
      key: "/development",
      icon: <DesktopOutlined />,
      label: <Link to="/development">av</Link>,
    },
    {
      key: "/components",
      icon: <ContainerOutlined />,
      label: <Link to="/components">Components</Link>,
    },
    {
      key: "sub1",
      label: "Navigation One",
      icon: <MailOutlined />,
      children: [
        {
          key: "/blog",
          label: <Link to="/blog">Blog</Link>,
        },
        {
          key: "/resources",
          label: <Link to="/resources">Resources</Link>,
        },
      ],
    },
    {
      key: "sub2",
      label: "Navigation Two",
      icon: <AppstoreOutlined />,
      children: [
        {
          key: "/role_home",
          label: <Link to="/role_home">Role Home</Link>,
        },
      ],
    },
  ];

  const routes = [
    "/design",
    "/development",
    "/components",
    "/blog",
    "/resources",
    "/role_home",
  ];
  const selectedKey = routes.find((route) => pathname.startsWith(route)) || "";

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            subMenuItemBg: "#ffffff", // Ép menu con thành màu trắng
          },
        },
      }}
    >
      <Menu
        theme="light" // Bắt buộc là light
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        defaultOpenKeys={["sub1"]}
        items={items}
        style={{
          borderRight: 0,
          background: "#ffffff", // Ép nền menu thành màu trắng
        }}
      />
    </ConfigProvider>
  );
};

export default MenuApp;