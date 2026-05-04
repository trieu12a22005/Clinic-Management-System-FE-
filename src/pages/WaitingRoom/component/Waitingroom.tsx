import type { EnterTicketRow } from '@/types/EnterTicket';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
type Props = {
    data: EnterTicketRow[];
};
export default function ListWaitingRoom({ data = [] }: Props) {
    console.log("props: ", data);
    const [selectedPatientId, setSelectedPatientId] = useState<string>("");
    useEffect(() => {
        if (data.length > 0 && !selectedPatientId) {
            setSelectedPatientId(data[0].patientID);
        }
    }, [data, selectedPatientId]);
    const selectedPatient = data.find((p) => p.patientID === selectedPatientId);
    const navigate = useNavigate()
    const handleclick = () => {
        navigate(`/prescription/${selectedPatient?.ticketID}`);
    }
    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans">
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1867c0] uppercase">Phòng Khám Nội 1</h1>
                        <p className="text-gray-600">Bác sĩ phụ trách: Huỳnh Phạm Long Triều</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold shadow-sm">
                        Đang chờ: {data.length} bệnh nhân
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-140px)] overflow-hidden">

                        <div className="bg-[#1867c0] text-white p-4">
                            <h2 className="text-lg font-bold">Danh sách chờ khám</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                            {data.map((patient) => {
                                const isSelected = patient.patientID === selectedPatientId;
                                return (
                                    <div
                                        key={patient.patientID}
                                        onClick={() => setSelectedPatientId(patient.patientID)}
                                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all border ${isSelected
                                                ? 'bg-blue-50 border-[#1867c0] shadow-md transform scale-[1.02]'
                                                
                                                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                            }`}
                                    >
                                        
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg flex-shrink-0 ${isSelected ? 'bg-[#ff9800] text-white' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {patient.orderNum}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-bold truncate ${isSelected ? 'text-[#1867c0]' : 'text-gray-800'}`}>
                                                {patient.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                {20} tuổi - {"man"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {selectedPatient && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
                                <div className="bg-[#1867c0] text-white p-4">
                                    <h2 className="text-lg font-bold">Hồ sơ bệnh nhân</h2>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-6">
                                        <div className="w-20 h-20 bg-blue-100 text-[#1867c0] rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
                                            {selectedPatient.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">{selectedPatient.fullName}</h2>
                                            <div className="flex gap-4 text-gray-600 mt-1">
                                                <span><span className="font-semibold">Mã BN:</span> {selectedPatient.DisplayID}</span>
                                                <span>•</span>
                                                <span><span className="font-semibold">Tuổi:</span> {20}</span>
                                                <span>•</span>
                                                <span><span className="font-semibold">Giới tính:</span> {selectedPatient.genderDisplay}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                            <h3 className="text-sm font-bold text-red-800 uppercase mb-2">Lý do khám bệnh (Lâm sàng)</h3>
                                            <p className="text-gray-800 text-lg font-medium">{selectedPatient.note}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Thông tin liên hệ</h3>
                                                <p className="text-gray-800">{"0123456789"}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Địa chỉ</h3>
                                                <p className="text-gray-800">{selectedPatient.address}</p>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                            <h3 className="text-sm font-bold text-[#1867c0] uppercase mb-2">Tiền sử bệnh án</h3>
                                            <p className="text-gray-800">{selectedPatient.previousRecord}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end gap-4">
                            <button className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors shadow-sm">
                                Bỏ qua ca này
                            </button>
                            <button  onClick = {handleclick} className="px-8 py-3 bg-[#1867c0] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                TIẾN HÀNH KHÁM
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}