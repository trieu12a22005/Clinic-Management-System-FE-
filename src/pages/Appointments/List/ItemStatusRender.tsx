import { Tag } from "antd";
import { appointmentStatusMap } from "../enums";
import { appointmentStatusColor } from "../tags";

function getColorByStatus(text: string) {
  const tag = appointmentStatusMap[text] || "Không xác định";
  const color = appointmentStatusColor[text] || "default";
  return { color, tag };
}
function ItemStatusRender(text: string) {
  const { color, tag } = getColorByStatus(text);

  return (
    <Tag color={color} key={tag}>
      {tag.toUpperCase()}
    </Tag>
  );
}
export default ItemStatusRender;
