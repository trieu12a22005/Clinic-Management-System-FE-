import React from "react";
import { Menu, ConfigProvider } from "antd";

import { main } from "../sidebar";
import { sideBarItems } from "./details";

type MenuAppProps = {
  collapsed: boolean;
};

const MenuApp: React.FC<MenuAppProps> = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            subMenuItemBg: main, // Ép menu con thành màu trắng
          },
        },
      }}
    >
      <Menu
        theme="dark"
        mode="inline"
        defaultOpenKeys={["sub1"]}
        items={sideBarItems}
        style={{
          borderRight: 0,
          background: main,
        }}
      />
    </ConfigProvider>
  );
};

export default MenuApp;
