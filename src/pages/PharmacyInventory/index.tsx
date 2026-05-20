import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import medicineApi, {
  type MedicineItem,
  type CreateManyMedicineItemInput,
  type UpdateMedicineItemPayload,
  type ImexType,
} from '../../apis/medicine';
import { createImexLog, type ImexDetail } from '../../apis/medicineImex';
import MedicineTable from './components/MedicineTable';
import CreateMedicineModal from './components/CreateMedicineModal';
import EditMedicineModal from './components/EditMedicineModal';
import ImportExportModal from './components/ImportExportModal';
import ImexHistoryModal from './components/ImexHistoryModal';
import Pagination from './components/Pagination';
import { AddUnitModal } from './components/AddUnitModal';

const MIN_STOCK = 100;

const formatNumber = (value: number) => value.toLocaleString('vi-VN');

// Query keys
const medicinesQueryKey = ['medicines'];

const PharmacyInventory = () => {
  const queryClient = useQueryClient();

  // State
  const [searchInput, setSearchInput] = useState(''); // Input value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search query (only updated on Enter/button click)
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Selected medicine states
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineItem | null>(null);
  const [importExportMode, setImportExportMode] = useState<'import' | 'export' | 'both'>('both');

  // Fetch medicines using React Query with pagination
  const {
    data: medicinesData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [...medicinesQueryKey, currentPage, searchQuery.trim()],
    queryFn: async () => {
      const response = await medicineApi.getMedicineItems({
        page: currentPage,
        search: searchQuery.trim() || undefined,
      });
      return response.data;
    },
  });

  // Reset to first page when search query or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Extract medicines and pagination info from response
  const medicines = useMemo(() => {
    if (!medicinesData) return [];
    if (Array.isArray(medicinesData)) {
      return medicinesData as MedicineItem[];
    }
    return (medicinesData.medicines || medicinesData.items || []) as MedicineItem[];
  }, [medicinesData]);

  const paginationInfo = useMemo(() => {
    if (!medicinesData || Array.isArray(medicinesData)) {
      return { page: 1, totalPages: 1, totalItems: medicines.length };
    }
    return {
      page: medicinesData.page || 1,
      totalPages: medicinesData.totalPages || 1,
      totalItems: medicinesData.totalItems || medicines.length,
    };
  }, [medicinesData, medicines.length]);

  // Create medicines mutation
  const createMutation = useMutation({
    mutationFn: (medicineData: CreateManyMedicineItemInput[]) =>
      medicineApi.createManyMedicineItems(medicineData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: medicinesQueryKey });
      setCurrentPage(1); // Reset to first page after creating
      setIsCreateModalOpen(false);

      if (response.data.failedCount > 0) {
        toast.success(
          `Tạo thành công ${response.data.successCount}/${response.data.requestCount} thuốc`,
          { duration: 4000 }
        );
        response.data.failed.forEach((f) => {
          toast.error(`Thất bại: ${f.medicineName} - ${f.reason}`, { duration: 3000 });
        });
      } else {
        toast.success(`Tạo thành công ${response.data.successCount} thuốc!`);
      }
    },
    onError: (error) => {
      console.error('Error creating medicines:', error);
      toast.error('Có lỗi xảy ra khi tạo thuốc. Vui lòng thử lại.');
    },
  });

  // Update medicine mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMedicineItemPayload }) =>
      medicineApi.updateMedicineItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicinesQueryKey, refetchType: 'active' });
      setIsEditModalOpen(false);
      toast.success('Cập nhật thuốc thành công!');
    },
    onError: (error) => {
      console.error('Error updating medicine:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thuốc. Vui lòng thử lại.');
    },
  });

  // Delete medicine mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => medicineApi.deleteMedicineItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicinesQueryKey, refetchType: 'active' });
      setIsDeleteConfirmOpen(false);
      setDeleteError(null);
      toast.success('Xóa thuốc thành công!');
    },
    onError: (error) => {
      console.error('Error deleting medicine:', error);
      toast.error('Có lỗi xảy ra khi xóa thuốc. Vui lòng thử lại.');
    },
  });

  // Import/Export mutation
  const imexMutation = useMutation({
    mutationFn: ({
      type,
      items,
      totalValue,
      note,
    }: {
      type: ImexType;
      items: ImexDetail[];
      totalValue: number;
      note?: string;
    }) =>
      createImexLog({
        imexType: type,
        value: totalValue,
        note,
        items,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: medicinesQueryKey, refetchType: 'active' });
      setIsImportExportModalOpen(false);
      toast.success(
        `${variables.type === 'import' ? 'Nhập' : 'Xuất'} thuốc thành công!`,
        { duration: 3000 }
      );
    },
    onError: (error, variables) => {
      console.error('Error creating imex log:', error);
      toast.error(
        `Có lỗi xảy ra khi ${variables.type === 'import' ? 'nhập' : 'xuất'} thuốc. Vui lòng thử lại.`
      );
    },
  });

  // Filtered medicines (only status filter on client-side, search is handled by API)
  const filteredMedicines = useMemo(() => {
    if (statusFilter === 'all') return medicines;

    return medicines.filter((item) => {
      const status =
        item.quantity === 0
          ? 'out-of-stock'
          : item.quantity < MIN_STOCK
            ? 'low-stock'
            : 'in-stock';
      return status === statusFilter;
    });
  }, [medicines, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const totalTypes = medicines.length;
    const totalQuantity = medicines.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockCount = medicines.filter((item) => item.quantity > 0 && item.quantity < MIN_STOCK).length;
    const outOfStockCount = medicines.filter((item) => item.quantity === 0).length;

    return { totalTypes, totalQuantity, lowStockCount, outOfStockCount };
  }, [medicines]);

  // Handlers
  const handleCreateMedicines = (medicineData: CreateManyMedicineItemInput[]) => {
    createMutation.mutate(medicineData);
  };

  const handleEditMedicine = (id: number, data: UpdateMedicineItemPayload) => {
    updateMutation.mutate({ id, data });
  };

  const handleDeleteClick = (medicine: MedicineItem) => {
    setSelectedMedicine(medicine);
    setDeleteError(null);
    if (medicine.quantity > 0) {
      const unitName = typeof medicine.unit === 'object' && medicine.unit !== null ? (medicine.unit as any).unitName : medicine.unit;
      setDeleteError(`Không thể xóa thuốc "${medicine.medicineName}" vì còn ${medicine.quantity} ${unitName} trong kho.`);
    }
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedMedicine) return;

    if (selectedMedicine.quantity > 0) {
      const unitName = typeof selectedMedicine.unit === 'object' && selectedMedicine.unit !== null ? (selectedMedicine.unit as any).unitName : selectedMedicine.unit;
      setDeleteError(`Không thể xóa thuốc "${selectedMedicine.medicineName}" vì còn ${selectedMedicine.quantity} ${unitName} trong kho.`);
      return;
    }

    deleteMutation.mutate(selectedMedicine.medicineID);
  };

  const handleImportClick = (medicine: MedicineItem) => {
    setSelectedMedicine(medicine);
    setImportExportMode('import');
    setIsImportExportModalOpen(true);
  };

  const handleExportClick = (medicine: MedicineItem) => {
    setSelectedMedicine(medicine);
    setImportExportMode('export');
    setIsImportExportModalOpen(true);
  };

  const handleImportExport = (type: ImexType, items: ImexDetail[], note?: string) => {
    // Calculate total value
    const totalValue = items.reduce((sum, item) => {
      const medicine = medicines.find((m) => m.medicineID === item.medicineID);
      return sum + (medicine?.price || 0) * item.quantity;
    }, 0);

    imexMutation.mutate({ type, items, totalValue, note });
  };

  // Handle search trigger (Enter or button click)
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  // Handle Enter key in search input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
        <div className="flex flex-col items-center gap-4">
          <svg className="h-10 w-10 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-600">Đang tải danh sách thuốc...</p>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Có lỗi xảy ra</h3>
          <p className="mb-4 text-gray-600">Không thể tải danh sách thuốc. Vui lòng thử lại.</p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] py-8 font-sans text-gray-800">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý kho thuốc</h1>
            <p className="text-sm text-gray-500">Quản lý danh mục thuốc và tồn kho</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Xem lịch sử nhập/xuất
            </button>
            <button
              onClick={() => {
                setSelectedMedicine(null);
                setImportExportMode('both');
                setIsImportExportModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 17h16" />
              </svg>
              Nhập/Xuất thuốc
            </button>
            <button
              onClick={() => setIsAddUnitModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Thêm đơn vị
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Thêm thuốc mới
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{paginationInfo.totalItems}</p>
                <p className="text-sm text-gray-500">Loại thuốc</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">{formatNumber(stats.totalQuantity)}</p>
                <p className="text-sm text-emerald-600">Tổng tồn kho</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-amber-50 to-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{stats.lowStockCount}</p>
                <p className="text-sm text-amber-600">Sắp hết hàng</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 via-rose-50 to-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-700">{stats.outOfStockCount}</p>
                <p className="text-sm text-rose-600">Hết hàng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md flex gap-2">
              <div className="relative flex-1">
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Tìm kiếm thuốc..."
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                />
                <svg
                  viewBox="0 0 24 24"
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
              </div>
              <button
                onClick={handleSearch}
                className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                title="Tìm kiếm"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="in-stock">Còn hàng</option>
                <option value="low-stock">Sắp hết</option>
                <option value="out-of-stock">Hết hàng</option>
              </select>
              {statusFilter !== 'all' && (
                <span className="text-xs text-amber-600">Lọc trên trang hiện tại</span>
              )}
            </div>
          </div>
        </div>

        {/* Medicine Table */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-5">
            <MedicineTable
              medicines={filteredMedicines}
              onEdit={(med) => {
                setSelectedMedicine(med);
                setIsEditModalOpen(true);
              }}
              onDelete={handleDeleteClick}
              onImport={handleImportClick}
              onExport={handleExportClick}
              minStock={MIN_STOCK}
            />
          </div>
          <Pagination
            currentPage={paginationInfo.page}
            totalPages={paginationInfo.totalPages}
            totalItems={paginationInfo.totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateMedicineModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMedicines}
        isLoading={createMutation.isPending}
      />

      <EditMedicineModal
        medicine={selectedMedicine}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditMedicine}
        isLoading={updateMutation.isPending}
      />

      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        onSubmit={handleImportExport}
        medicines={medicines}
        preselectedMedicine={selectedMedicine}
        mode={importExportMode}
        isLoading={imexMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Xác nhận xóa thuốc</h3>
            {deleteError ? (
              <p className="mb-4 text-sm text-rose-600">{deleteError}</p>
            ) : (
              <p className="mb-4 text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa thuốc "{selectedMedicine?.medicineName}"? Hành động này không thể hoàn tác.
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setDeleteError(null);
                }}
                disabled={deleteMutation.isPending}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                {deleteError ? 'Đóng' : 'Hủy'}
              </button>
              {!deleteError && (
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang xóa...
                    </>
                  ) : (
                    'Xác nhận xóa'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Imex History Modal */}
      <ImexHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      <AddUnitModal
        isOpen={isAddUnitModalOpen}
        onClose={() => setIsAddUnitModalOpen(false)}
      />
    </div>
  );
};

export default PharmacyInventory;
