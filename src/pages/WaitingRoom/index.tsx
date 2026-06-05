import ListWaitingRoom from "./component/Waitingroom";
import { UseExamination } from "./UseExamination";
import { useTimetableByDay } from "../TimeTable/useTimetable";
import { useEffect, useMemo, useRef } from "react";
import { useProfile } from "@/hooks/useProfile";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";

const WaitingRoomPage = () => {
  const { data: user } = useProfile();
  const toastShown = useRef(false);

  // Calculate current day of week
  const currentDayOfWeek = useMemo(() => {
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return days[new Date().getDay()];
  }, []);

  const { timetables, isLoading: isTimetableLoading } = useTimetableByDay(user?.id || "", currentDayOfWeek);

  const hasNoTimetable = !isTimetableLoading && !!user?.id && timetables !== undefined && timetables.length === 0;

  // Hiển thị toast trước khi redirect (chỉ 1 lần)
  useEffect(() => {
    if (hasNoTimetable && !toastShown.current) {
      toastShown.current = true;
      toast("🗓️ Hôm nay bạn không có lịch làm việc.", {
        id: "no-timetable-today",
        duration: 5000,
        style: {
          background: "#fffbe6",
          color: "#7c5b00",
          border: "1px solid #ffe58f",
          fontWeight: 500,
        },
      });
    }
  }, [hasNoTimetable]);

  // Đang tải lịch → hiển thị loading
  if (isTimetableLoading || !user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang kiểm tra lịch làm việc..." />
      </div>
    );
  }

  // Không có lịch hôm nay → redirect về dashboard
  if (hasNoTimetable) {
    return <Navigate to="/dashboard" replace />;
  }

  const firstTimetable = timetables?.[0];
  const currentRoomID = firstTimetable?.roomID ?? "";

  return (
    <WaitingRoomContent roomID={currentRoomID} timetable={firstTimetable!} />
  );
};

// Tách phần render thực sự để tránh gọi hook có điều kiện
const WaitingRoomContent = ({
  roomID,
  timetable,
}: {
  roomID: string;
  timetable: { roomID: string; room?: { roomName?: string | null }; account?: { firstName?: string; lastName?: string } };
}) => {
  const { examinations } = UseExamination({
    roomID,
    status: "pending",
    page: 1,
    limit: 10,
  });

  return (
    <div>
      <ListWaitingRoom
        data={examinations || []}
        roomName={timetable?.room?.roomName || ""}
        doctorName={(timetable?.account?.firstName || "") + " " + (timetable?.account?.lastName || "")}
      />
    </div>
  );
};

export default WaitingRoomPage;
