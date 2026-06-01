import { Outlet } from "react-router-dom";
import CustomHeader from "./header";
function OutsideLayout() {
  return (
    <div className="wall">
      <div className="bg-white">
        <CustomHeader showAccountDropdown={false} />
      </div>
      <Outlet />
    </div>
  );
}

export default OutsideLayout;
