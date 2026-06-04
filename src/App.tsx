import { Route, Routes } from "react-router-dom";
import Login from "pages/login/Login";
import MainLayout from "components/layouts/MainLayout";
import ProtectedRoute from "components/ProtectedRoute";
import PermissionRoute from "components/PermissionRoute";
// import Portfolio from "pages/portfolio";
import RoleHome from "./pages/RoleHome/RoleHome";
import Timetable from "./pages/TimeTable";
import PharmacyQueue from "./pages/PharmacyQueue";
import PrescriptionDetail from "./pages/PharmacyQueue/PrescriptionDetail";
import PharmacyInventory from "./pages/PharmacyInventory";
import GlobalLoading from "./components/GlobalLoading";
import Prescription from "./pages/Prescription/index";
import WaitingRoomPage from "./pages/WaitingRoom";
import PatientHistory from "./pages/PatientHistory/index";
import PatientLookup from "./pages/PatientHistory/PatientLookup";
import Profile from "./pages/Profile/Profile";
import Notification from "./pages/Notification/Notification";
import ManageAccount from "./pages/ManageAccount/ManageAccount";
import Report from "./pages/Report/Report";
import SchedulePage from "./pages/Schedule/SchedulePage";

import RoleDashboardPage from "./pages/Role/RoleDashboard";
import RoleLayout from "./pages/Role/layout";
import EditRolePage from "./pages/Role/EditRole";
import EditRoleLayout from "./pages/Role/EditRole/Layout";
import AppointmentPage from "./pages/Appointment";
import SystemConfig from "./pages/SystemConfig/SystemConfig";
import OutsideLayout from "./components/layouts/OutsideLayout";
import NotFoundError from "./pages/fallback/NotFoundError";
// import TestPage from "./pages/test";
// import './App.css';
function App() {
  return (
    <>
      <GlobalLoading />
      <Routes>
        <Route element={<OutsideLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            {/* Dashboard for internal use only. */}
            <Route path="/dashboard" index element={<RoleHome />}></Route>

            {/* Routes không cần permission đặc biệt */}
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/waiting-room" element={<WaitingRoomPage />} />
            <Route path="/prescription/:id" element={<Prescription />} />
            <Route path="/patient-history" element={<PatientLookup />} />
            <Route path="/patient-history/:id" element={<PatientHistory />} />
            <Route path="/pharmacy-queue" element={<PharmacyQueue />} />
            <Route path="/pharmacy-queue/:prescriptionId" element={<PrescriptionDetail />} />
            <Route path="/prescription" element={<Prescription />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/appointment" element={<AppointmentPage />} />

            {/* Routes được bảo vệ bởi permission */}
            <Route
              element={<PermissionRoute requiredPermissions={["menu.pharmacy_inventory"]} featureName="Kho thuốc" />}
            >
              <Route path="/pharmacy-inventory" element={<PharmacyInventory />} />
            </Route>

            <Route
              element={
                <PermissionRoute
                  requiredPermissions={["account.view", "account.create"]}
                  featureName="Quản lý tài khoản"
                />
              }
            >
              <Route path="/account" element={<ManageAccount />} />
            </Route>

            <Route element={<PermissionRoute requiredPermissions={["report.view"]} featureName="Báo cáo thống kê" />}>
              <Route path="/report" element={<Report />} />
            </Route>

            {/* role management */}
            <Route element={<PermissionRoute requiredPermissions={["role.manage"]} featureName="Quản lý phân quyền" />}>
              <Route path="/role" element={<RoleLayout />}>
                <Route index element={<RoleDashboardPage />} />
                <Route path="details" element={<EditRoleLayout />}>
                  <Route index element={<b>Bấm vào vai trò bất kỳ ở danh sách bên trái</b>} />
                  <Route path="new" element={<EditRolePage mode="new" />} />
                  <Route path=":id" element={<EditRolePage />} />
                </Route>
              </Route>
            </Route>

            <Route path="/system-config" element={<SystemConfig />} />
            <Route
              element={
                <PermissionRoute
                  requiredPermissions={["timetable.add_new", "timetable.update", "timetable.delete"]}
                  featureName="Xếp lịch làm việc"
                />
              }
            >
              <Route path="/schedule" element={<SchedulePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundError />} />
      </Routes>
    </>
  );
}

export default App;
