import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MedicineTicket } from '@/apis/medicineTicket';

type QueueStatus = 'waiting' | 'dispensed';
import { getMedicineTickets, createMedicineTicket, updateMedicineTicketStatus } from '@/apis/medicineTicket';
import CurrentQueueCard from './components/CurrentQueueCard';
import QueueSummary from './components/QueueSummary';
import QueueTable from './components/QueueTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const mapTicketStatus = (status?: string): QueueStatus => {
  const normalized = status?.toLowerCase() ?? '';
  if (['dispensed', 'done', 'completed', 'complete', 'issued'].includes(normalized)) {
    return 'dispensed';
  }
  return 'waiting';
};

const PharmacyQueue = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | QueueStatus>('all');
  const [prescriptionInput, setPrescriptionInput] = useState('');
  const today = useMemo(() => formatDateInput(new Date()), []);

  const { data: ticketsData } = useQuery({
    queryKey: ['medicine-tickets', today],
    queryFn: () => getMedicineTickets(today),
  });

  const createTicketMutation = useMutation({
    mutationFn: (prescriptionDisplayID: string) => createMedicineTicket(prescriptionDisplayID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicine-tickets', today] });
      setPrescriptionInput('');
      alert('Tạo phiếu thuốc thành công!');
    },
    onError: (error: Error) => {
      alert('Lỗi khi tạo phiếu thuốc: ' + error.message);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ ticketID, status }: { ticketID: string; status: 'pending' | 'done' }) =>
      updateMedicineTicketStatus(ticketID, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicine-tickets', today] });
    },
  });

  const tickets = useMemo(() => {
    return ticketsData?.data ?? [];
  }, [ticketsData]);

  const waitingCount = tickets.filter((item: MedicineTicket) => item.status === 'pending').length;
  const dispensedCount = tickets.filter((item: MedicineTicket) => item.status === 'done').length;
  const totalCount = tickets.length;
  const currentItem = tickets.find((item: MedicineTicket) => item.status === 'pending') ?? tickets[0];

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return tickets.filter((item: MedicineTicket) => {
      const mappedStatus = mapTicketStatus(item.status);
      const matchesStatus = statusFilter === 'all' || mappedStatus === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.patientName.toLowerCase().includes(normalizedSearch) ||
        item.prescriptionDisplayID.toLowerCase().includes(normalizedSearch) ||
        String(item.orderNum).includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [tickets, search, statusFilter]);

  const handleViewPrescription = (prescriptionID: string, ticketID: string) => {
    navigate(`/pharmacy-queue/${prescriptionID}?ticketId=${ticketID}`);
  };

  const handleCreateTicket = () => {
    if (!prescriptionInput.trim()) {
      alert('Vui lòng nhập mã đơn thuốc');
      return;
    }
    createTicketMutation.mutate(prescriptionInput.trim());
  };

  const handleUpdateStatus = (prescriptionID: string, status: 'pending' | 'done') => {
    // Tìm ticket theo prescriptionID để lấy ticketID
    const ticket = tickets.find((t: MedicineTicket) => t.prescriptionID === prescriptionID);
    if (ticket) {
      // Note: API cần ticketID nhưng response của getMedicineTickets không trả về ticketID
      // Cần lưu ý backend để trả về ticketID trong response
      // Tạm thời dùng prescriptionID thay thế
      updateStatusMutation.mutate({ ticketID: prescriptionID, status });
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] py-8 font-sans text-gray-800">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Hàng đợi phát thuốc</h1>
          <p className="text-sm text-gray-500">Quản lý và gọi số bệnh nhân nhận thuốc</p>
        </div>

        {/* Tạo phiếu thuốc mới */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Tạo phiếu thuốc mới</h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                value={prescriptionInput}
                onChange={(e) => setPrescriptionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateTicket();
                  }
                }}
                placeholder="Nhập mã đơn thuốc (VD: RX-2026-001)"
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-4 pr-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCreateTicket}
              disabled={createTicketMutation.isPending}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {createTicketMutation.isPending ? 'Đang tạo...' : 'Tạo phiếu thuốc'}
            </button>
          </div>
        </div>

        <QueueSummary
          waitingCount={waitingCount}
          dispensedCount={dispensedCount}
          totalCount={totalCount}
        />

        {currentItem && (
          <CurrentQueueCard
            currentItem={currentItem}
            onViewPrescription={handleViewPrescription}
          />
        )}

        <QueueTable
          items={filteredItems}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onViewPrescription={handleViewPrescription}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
};

export default PharmacyQueue;
