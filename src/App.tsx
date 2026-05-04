import { Route, Routes } from "react-router-dom";
import Login from "pages/login/Login";
import MainLayout from "components/layouts/MainLayout";
import Portfolio from "pages/portfolio";
import RoleHome from "./pages/RoleHome/RoleHome";
import Timetable from "./pages/TimeTable";
import GlobalLoading from "./components/GlobalLoading";
import Prescription from "./pages/Prescription/index";
import AppointmentPage from "./pages/Appointments";
import ProtectedRoute from "./router/ProtectedRoute";

import PharmacyQueue from "./pages/PharmacyQueue";
import PrescriptionDetail from "./pages/PharmacyQueue/PrescriptionDetail";
import PharmacyInventory from "./pages/PharmacyInventory";
import WaitingRoomPage from "./pages/WaitingRoom";
import PatientHistory from "./pages/PatientHistory/index";
import Profile from "./pages/Profile/Profile";

// import './App.css';
function App() {
  return (
    <>
      <GlobalLoading />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route index element={<Portfolio />}></Route>
          <Route path="/role_home" element={<RoleHome />} />

          {/* --- Staff routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/appointments" element={<AppointmentPage />} />
          </Route>

          <Route path="/timetable" element={<Timetable />} />
          <Route path="/waiting-room" element={<WaitingRoomPage />} />
          <Route path="/prescription/:id" element={<Prescription />} />
          <Route path="/patient-history/:id" element={<PatientHistory />} />
          {/* <Route path='/examination' element = {<Examination/>} /> */}
          <Route path="/pharmacy-queue" element={<PharmacyQueue />} />
          <Route path="/pharmacy-queue/:prescriptionId" element={<PrescriptionDetail />} />
          <Route path="/pharmacy-inventory" element={<PharmacyInventory />} />
          <Route path="/prescription" element={<Prescription />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
