import { Button } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import RoleCompactList from "../components/list";
import useStore from "@/store/useStore";
import { useCallback } from "react";
import { notifyError } from "@/utils/notify";

function EditRoleLayout() {
  const hasInput = useStore((state) => state.behaviour?.form?.hasInput);

  const navigate = useNavigate();
  const goToRoleListPage = useCallback(() => {
    if (!hasInput) navigate("/role");
    else notifyError("Bạn phải hoàn thành mọi thay đổi trước khi rời đi");
  }, [hasInput, navigate]);
  const goToAddRolePage = useCallback(() => {
    if (!hasInput) navigate("/role/details/new");
    else notifyError("Bạn phải hoàn thành mọi thay đổi trước khi rời đi");
  }, [hasInput, navigate]);
  return (
    <div className="flex gap-[36px] max-w-[1000px] mx-auto relative">
      <aside className="role-list w-[200px] sticky top-[24px] h-full">
        <div className="flex items-center justify-between">
          <Button
            type="text"
            shape="circle"
            icon={<ArrowLeftOutlined />}
            aria-label="Quay lại trang chính"
            onClick={goToRoleListPage}
            className="text-slate-600 hover:text-slate-900"
          />
          <p className="font-bold text-md indent-2">TẤT CẢ VAI TRÒ</p>
          <Button
            type="text"
            shape="circle"
            icon={<PlusOutlined />}
            aria-label="Thêm mới vai trò"
            onClick={goToAddRolePage}
            className="text-slate-600 hover:text-slate-900"
          />
        </div>
        <div className="h-[calc(100vh-200px)] mt-4 overflow-auto ">
          <RoleCompactList />
        </div>
      </aside>
      <div className="flex-1 h-[80vh] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
export default EditRoleLayout;
