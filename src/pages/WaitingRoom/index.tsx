import ListWaitingRoom from "./component/Waitingroom";
import { UseExamination } from "./UseExamination";
const WaitingRoomPage = () => {
    const { examinations } = UseExamination({
        roomID: "dd7a68c5-c2ca-47b0-95d1-c8584022028f",
        status: "pending",
        page: 1,
        limit: 10,
    });
    console.log("examinations:", examinations);
    
    return (
        <div>
             <ListWaitingRoom data = {examinations || []} />
        </div>
    );
}
export default WaitingRoomPage;