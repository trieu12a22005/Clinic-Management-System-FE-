import TimetableList from "./components/TimetableList";
import { UseAuth } from "@/AuthContext";
const Timetable = () => {
    const { user } = UseAuth();

    console.log(user);
    return (
        <div>
            <TimetableList accountID={user?.id || ""} />
        </div>
    )
}
export default Timetable;