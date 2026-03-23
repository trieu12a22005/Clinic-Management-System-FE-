import { Tag } from "antd";
import { appointmentTypeColor } from "../tags";
import { appointmentTypeMap } from "../enums";

function getColorByType(text: string) {
  const tag = appointmentTypeMap[text] || "Không xác định";
  const color = appointmentTypeColor[text] || "default";
  return { color, tag };
}
function ItemTypeRender(text: string) {
  const { color, tag } = getColorByType(text);

  return (
    <Tag color={color} key={tag}>
      {tag.toUpperCase()}
    </Tag>
  );
}
export default ItemTypeRender;
