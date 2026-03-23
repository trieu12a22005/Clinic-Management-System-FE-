import { Route, Routes } from "react-router-dom";
import Login from "pages/login/Login";
import MainLayout from "components/layouts/MainLayout";
import Portfolio from "pages/portfolio";
import RoleHome from "./pages/RoleHome/RoleHome";
import Examination from "./pages/Examination/ExaminationForm";
import Timetable from "./pages/TimeTable";
import GlobalLoading from "./components/GlobalLoading";
import Prescription from "./pages/Prescription/index";
import AppointmentPage from "./pages/Appointments";
import ProtectedRoute from "./router/ProtectedRoute";
// import './App.css';
function App() {
  return (
    <>
      <GlobalLoading />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route index element={<Portfolio />}></Route>
          <Route path="/role_home" element={<RoleHome />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/examination" element={<Examination />} />
          <Route path="/prescription" element={<Prescription />} />
          {/* --- Staff routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/appointments" element={<AppointmentPage />} />
          </Route>
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
