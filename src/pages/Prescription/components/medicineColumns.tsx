import { Button } from 'antd';
import type { ColumnsType, TableRow } from '@/types/Prescription';

type Props = {
  onRemove: (index: number) => void;
};

export const getMedicineColumns = ({
  onRemove,
}: Props): ColumnsType<TableRow> => [
    {
      title: 'Tên thuốc',
      dataIndex: 'medicineName',
      key: 'medicineName',
      width: 220,
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      width: 140,
    },
    {
      title: 'Các cách dùng',
      dataIndex: 'usagesText',
      key: 'usagesText',
      render: (text: string) => (
        <div style={{ whiteSpace: 'pre-line' }}>{text}</div>
      ),
    },
    {
      title: 'Số ngày dùng',
      dataIndex: 'totalTreatmentDays',
      key: 'totalTreatmentDays',

    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: unknown, __: unknown, index: number) => (
        <Button danger onClick={() => onRemove(index)}>
          Xóa
        </Button>
      ),
    },
  ];