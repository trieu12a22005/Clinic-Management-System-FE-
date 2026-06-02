import ListWaitingRoom from "./component/Waitingroom";
import { UseExamination } from "./UseExamination";
// import { UseAuth } from "@/AuthContext";
import { useTimetableByDay } from "../TimeTable/useTimetable";
import { useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";

const WaitingRoomPage = () => {
  const { data: user } = useProfile();

  // Calculate current day of week
  const currentDayOfWeek = useMemo(() => {
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return days[new Date().getDay()];
  }, []);
  console.log("currentDayOfWeek", currentDayOfWeek);

  const { timetables } = useTimetableByDay(user?.id || "", currentDayOfWeek);
  console.log("timetables", timetables);
  // Assume the doctor has only one room per day, get the first one.
  const currentRoomID = timetables?.[0]?.roomID || "";
  console.log("currentRoomID", currentRoomID);

  const { examinations } = UseExamination({
    roomID: currentRoomID,
    status: "pending",
    page: 1,
    limit: 10,
  });
  console.log(timetables);
  return (
    <div>
      <ListWaitingRoom
        data={examinations || []}
        roomName={timetables?.[0]?.room?.roomName || ""}
        doctorName={timetables?.[0]?.account?.firstName + " " + timetables?.[0]?.account?.lastName || ""}
      />
    </div>
  );
};
export default WaitingRoomPage;
