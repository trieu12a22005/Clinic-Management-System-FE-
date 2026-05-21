export interface TimetableResponse {
    timeID: string;
    accountID: string;
    roomID: string;
    dayOfWeek: string;
    note: string;
    createdAt: string;
    createdAtLocal: string;
    account: {
        firstName: string;
        lastName: string;
        email: string;
    };
    room: {
        roomName: string;
        faculty: {
            facultyID?: string;
            facultyName: string;
        } | null;
    };
};
