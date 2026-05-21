export interface EnterTicketParams {
  status?: string;
  roomID?: string;
  page?: number;
  limit?: number;
}
export interface EnterTicket {
  ticketID: string;
  orderNum: number;
  appointmentID: string;
  patientID: string;
  roomID: string;
  checkIn: string;
  status: string;
  note: string;
  length?: number;
  patient: {
    patientID: string;
    previousRecord: string;
    account: {
      fullName: string;
      DisplayID: string;
      address: string;
      phoneNumber: string;
      birthDate: string;
      genderDisplay: string;
    };
  };
  room: {
    roomID: string;
    roomName: string;
  };
}
export interface EnterTicketRow {
  appointmentID: string;
  ticketID: string;
  orderNum: number;
  fullName: string;
  roomName: string;
  phoneNumber: string;
  birthDate: string;
  checkIn: string;
  status: string;
  note: string;
  length: number;
  patientID: string;
  DisplayID: string;
  address: string;
  genderDisplay: string;
  symptoms?: string;
  previousRecord: string;
}
