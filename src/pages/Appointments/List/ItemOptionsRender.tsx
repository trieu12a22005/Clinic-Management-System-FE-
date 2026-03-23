import { Button, Dropdown } from "antd";

const OptionList = [
  {
    key: "1",
    label: "Xem chi tiết",
  },
  {
    key: "2",
    label: "Sửa lịch hẹn",
  },
  {
    key: "3",
    label: "Xóa lịch hẹn",
  },
];

function ItemOptionsRender() {
  return (
    <div className="flex items-center space-x-2">
      <Button type="primary">Duyệt</Button>
      <Button type="default" danger>
        Hủy
      </Button>
      <Dropdown menu={{ items: OptionList }}>
        <Button type="default">...</Button>
      </Dropdown>
    </div>
  );
}
export default ItemOptionsRender;
