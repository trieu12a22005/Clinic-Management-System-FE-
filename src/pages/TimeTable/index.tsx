import { useProfile } from "@/hooks/useProfile";
import TimetableList from "./components/TimetableList";
// import { UseAuth } from "@/AuthContext";
const Timetable = () => {
  const { data: user } = useProfile();

  console.log(user);
  return (
    <div>
      <TimetableList accountID={user?.id || ""} />
    </div>
  );
};
export default Timetable;
