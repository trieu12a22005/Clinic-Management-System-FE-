import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { PrescriptionPdfData } from '@/types/Prescription';
import { stylesPDF } from './styles';
import './pdfFont';
const styles = stylesPDF;
type Props = {
  data: PrescriptionPdfData;
};
const formatCurrentDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  return `Ngày ${day} tháng ${month} năm ${year}`;
};

const Field = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueLine}>
      <Text>{value || ''}</Text>
    </View>
  </View>
);

const BlockField = ({
  label,
  value,
  large = false,
}: {
  label: string;
  value: string;
  large?: boolean;
}) => (
  <View style={styles.section}>
    <Text style={styles.label}>{label}</Text>
    <View style={large ? styles.valueBlockLarge : styles.valueBlock}>
      <Text>{value || ''}</Text>
    </View>
  </View>
);

const PrescriptionPdfDocument: React.FC<Props> = ({ data }) => {
  console.log("data", data);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Phiếu khám bệnh {`- Mã đơn thuốc: ${data.examineDisplayID}`}</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={[styles.col, { marginRight: 24 }]}>
              <Field label="Họ và tên" value={data.name || ''} />
            </View>
            <View style={styles.col}>
              <Field label="Số điện thoại" value={data.phone || ''} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.col, { marginRight: 24 }]}>
              <Field label="Ngày khám" value={data.date || ''} />
            </View>
            <View style={styles.col}>
              <Field label="Giới tính" value={data.gender} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.col2, { marginRight: 24 }]}>
              <Field label="Địa chỉ" value={data.address || ''} />
            </View>
            <View style={[styles.col, { marginRight: 24 }]}>
              <Field label="Cân nặng" value={data.weight || ''} />
            </View>
            <View style={styles.col}>
              <Field label="Huyết áp" value={data.pressure || ''} />
            </View>
          </View>

          <BlockField
            label="Loại khám"
            value={data.type}
          />

          <BlockField
            label="Triệu chứng"
            value={data.symptom || ''}
            large
          />

          <BlockField
            label="Chẩn đoán"
            value={data.diagnose || ''}
            large
          />

          {data.note ? (
            <BlockField
              label="Ghi chú"
              value={data.note}
              large
            />
          ) : null}
        </View>

        <Text style={styles.medicineTitle}>Danh sách thuốc</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeaderCell, { flex: 4.5 }]}>
              Tên thuốc
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>
              Số lượng
            </Text>
            <Text style={[styles.tableHeaderCell, styles.lastCell, { flex: 4 }]}>
              Cách dùng
            </Text>
          </View>

          {data.medicines.length > 0 ? (
            data.medicines.map((item, index) => (
              <View style={styles.tableRow} key={`${item.medicineName}-${index}`}>
                <Text style={[styles.tableCell, { flex: 4.5 }]}>
                  {item.medicineName}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>
                  {String(item.quantity)}
                </Text>
                <Text style={[styles.tableCell, styles.lastCell, { flex: 4 }]}>
                  {item.usage}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.lastCell, { flex: 1 }]}>
                Chưa có thuốc nào
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.dateLine}>{formatCurrentDate()}</Text>

          <View style={styles.signatureBox}>
            <Text>Bác sĩ khám bệnh</Text>
            <Text style={styles.signatureNote}>(Ký và ghi rõ họ tên)</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default PrescriptionPdfDocument;