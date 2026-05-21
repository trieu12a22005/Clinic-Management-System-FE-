import type { EnterTicket, EnterTicketRow } from "@/types/EnterTicket";
export const mapEnterTicketRow = (item: EnterTicket): EnterTicketRow => ({
  ticketID: item.ticketID,
  appointmentID: item.appointmentID,
  orderNum: item.orderNum,
  fullName: item.patient?.account?.fullName || '',
  roomName: item.room?.roomName || 'N/A',
  DisplayID: item.patient?.account?.DisplayID || '',
  checkIn: item.checkIn,
  status: item.status,
  note: item.note,
  length: item.length || 0,
  patientID: item.patientID,
  genderDisplay: item.patient?.account?.genderDisplay || '',
  address: item.patient?.account?.address || '',
  phoneNumber: item.patient?.account?.phoneNumber || '',
  birthDate: item.patient?.account?.birthDate || '',
  previousRecord: item.patient?.previousRecord || '',
  symptoms: undefined,
});

export const mapEnterTicketRows = (items: EnterTicket[]): EnterTicketRow[] =>
  items.map(mapEnterTicketRow);