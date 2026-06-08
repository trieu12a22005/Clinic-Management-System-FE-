import DateTimeNow from "./DateTimeNow";
import { url } from "@/utils/url";
import AccountDropdownComponent from "./AccountDropdown";
import { Link } from "react-router-dom";

type HeaderProps = {
  showAccountDropdown?: boolean;
};

function Header({ showAccountDropdown }: HeaderProps = { showAccountDropdown: true }) {
  return (
    <header className="text-white font-bold shadow-md print:hidden">
      <div className="w-full px-6 flex items-center justify-between h-16">
        {/* Logo bên trái */}
        <div className="left-side ">
          <Link to={url.dashboard} className="flex items-center gap-4 hover:opacity-35">
            <img src="/images/logo.png" alt="Clinic Logo" className="h-14 w-auto object-contain" />
            <p className=" grid  ">
              <b className="font-medium text-sm text-black">Phòng khám đa khoa quốc tế</b>
              <b className="font-bold uppercase text-xl text-[#712af6]">Phần mềm quản lý phòng mạch</b>
            </p>
          </Link>
        </div>
        <div className="right-side flex gap-6">
          <DateTimeNow />
          {showAccountDropdown && <AccountDropdownComponent />}
        </div>
        {/* User section bên phải */}
      </div>
    </header>
  );
}

export default Header;
