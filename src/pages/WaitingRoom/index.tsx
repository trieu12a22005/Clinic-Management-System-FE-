import ListWaitingRoom from "./component/Waitingroom";
import { UseExamination } from "./UseExamination";
import { UseAuth } from "@/AuthContext";
import { useTimetableByDay } from "../TimeTable/useTimetable";
import { useMemo } from "react";

const WaitingRoomPage = () => {
    const { user } = UseAuth();

    // Calculate current day of week
    const currentDayOfWeek = useMemo(() => {
        const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return days[new Date().getDay()];
    }, []);

    const { timetables } = useTimetableByDay(user?.id || "", currentDayOfWeek);

    // Assume the doctor has only one room per day, get the first one.
    const currentRoomID = timetables?.[0]?.roomID || "";

    const { examinations } = UseExamination({
        roomID: currentRoomID,
        status: "pending",
        page: 1,
        limit: 10,
    });

    return (
        <div>
            <ListWaitingRoom data={examinations || []} />
        </div>
    );
}
export default WaitingRoomPage;