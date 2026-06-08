import { Button } from "antd";
import Sider from "antd/es/layout/Sider";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import MenuApp from "../menu/Menu";
import { useState } from "react";
export const main = "#151a37";
const btnStyle = {
  width: 40,
  height: 40,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: main,
  borderColor: main,
  margin: "20px 0 0 20px",
};
function SidebarLayout() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={300}
        style={{
          background: main,
          minHeight: "100vh",
          paddingTop: 20,
        }}
      >
        <MenuApp collapsed={false} />
      </Sider>
      <Button
        type="default"
        onClick={() => setCollapsed(!collapsed)}
        icon={!collapsed ? <LeftOutlined /> : <RightOutlined />}
        style={btnStyle}
      />
    </>
  );
}
export default SidebarLayout;
