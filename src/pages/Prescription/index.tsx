import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, InputNumber, Radio, Row, Space, Table } from 'antd';
import { UsePostExamine, UsePrescription, UseTicketID } from './usePrescription';
import type { Medicine } from '@/types/medicine';
import { fullLayout, itemLayout } from './components/constant';
import type { PrescriptionMedicine, TableRow, UsageItem } from '@/types/Prescription';
import { getMedicineColumns } from './components/medicineColumns';
import MedicineSection from './components/MedicineSection';
import { buildPdfData, exportPrescriptionPdf } from './components/pdf';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import dayjs from "dayjs";
import type { PostExamineData } from '@/types/examine';
const Prescription: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [form] = Form.useForm();
  const { id } = useParams();
  const { ticket } = UseTicketID(id || '');
  useEffect(() => {
    if (ticket) {
      form.setFieldsValue({
        name: ticket.fullName,
        gender: ticket.genderDisplay,
        address: ticket.address,
      });
    }
  }, [ticket, form]);
  console.log('ticket data:', ticket);
  const [medicineList, setMedicineList] = useState<PrescriptionMedicine[]>([]);
  const { medicineOptions = [] } = UsePrescription(keyword);
  const naviagate = useNavigate();
  const medicineSelectOptions = medicineOptions.map((item: Medicine) => ({
    label: item.medicineName,
    value: item.medicineID,
  }));
  const handleAddMedicineToList = async () => {
    try {
      await form.validateFields(['medicineId', 'usages']);
      const medicineId = form.getFieldValue('medicineId');
      const usages: UsageItem[] = form.getFieldValue('usages') || [];
      if (!medicineId) {
        toast.error('Vui lòng chọn thuốc');
        return;
      }
      if (!usages.length) {
        toast.error('Vui lòng thêm ít nhất 1 cách dùng');
        return;
      }
      const hasEmptyUsage = usages.some(
        (item) => !item?.timeToTake || !item?.quantity || !item?.usage
      );
      if (hasEmptyUsage) {
        toast.error('Vui lòng nhập đầy đủ các cách dùng');
        return;
      }
      const selectedMedicine = medicineOptions.find(
        (item: Medicine) => item.medicineID === medicineId
      );
      if (!selectedMedicine) {
        toast.error('Không tìm thấy thuốc đã chọn');
        return;
      }
      setMedicineList((prev) => [
        ...prev,
        {
          medicineId: selectedMedicine.medicineID,
          medicineName: selectedMedicine.medicineName,
          usages,
        },
      ]);
      form.setFieldsValue({
        medicineId: undefined,
        usages: [{}],
      });
      setKeyword('');
      toast.success('Đã thêm thuốc vào danh sách');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi thêm thuốc');
    }
  };
  const handleRemoveMedicine = (medicineIndex: number) => {
    setMedicineList((prev) => prev.filter((_, index) => index !== medicineIndex));
  };
  const tableData: TableRow[] = medicineList.map((item, index) => ({
    key: index,
    medicineId: item.medicineId,
    medicineName: item.medicineName,
    totalQuantity: item.usages.reduce(
      (sum, usage) => sum + Number(usage.quantity || 0),
      0
    ),
    usagesText: item.usages
      .map((usage, usageIndex) => {
        const parts = [
          usage.timeToTake,
          usage.quantity ? `${usage.quantity} viên` : '',
          usage.usage,
        ].filter(Boolean);

        return parts.length ? `${usageIndex + 1}. ${parts.join(' - ')}` : '';
      })
      .filter(Boolean)
      .join('\n'),
  }));

  const columns = getMedicineColumns({
    onRemove: handleRemoveMedicine,
  });
  const handleExportPdf = async () => {
    const values = form.getFieldsValue();
    const pdfData = buildPdfData({
      values,
      medicineList,
    });
    await exportPrescriptionPdf(pdfData);
  };
  const { mutate } = UsePostExamine();

  const onFinish = (values: PostExamineData) => {
    const payload = {
      ...values,
      medicines: medicineList,
    };
    const examineData: PostExamineData = {
      appointmentID: ticket?.appointmentID || '',
      patientID: ticket?.patientID || '',
      symptoms: payload.symptoms,
      status: "done",
      treatmentPlan: payload.treatmentPlan,
      diagnose: payload.diagnose,
      note: payload.note,
    };
    console.log('payload before submit:', examineData);

    mutate(examineData, {
      onSuccess: (response) => {
        console.log('Lưu phiếu khám thành công:', response);
        toast.success('Lưu phiếu khám thành công');
        naviagate("/waiting-room");

      },
      onError: (error) => {
        console.error('Lỗi:', error);
        toast.error('Lưu phiếu khám thất bại');
      },
    });
  };
  const handleHistory = () => {
    naviagate(`/patient-history/${ticket?.patientID}`);
  }
  return (
    <div className="px-8 pb-8 mr-[6%]">
      <div>
        <div className="mt-6 text-center text-2xl font-bold uppercase text-gray-700">
          PHIẾU KHÁM BỆNH
        </div>
        <Button type="primary" onClick={handleHistory} >
          Lịch sử khám bệnh
        </Button>
      </div>
      <Form
        form={form}
        layout="horizontal"
        style={{ width: '100%', marginTop: '50px' }}
        onFinish={onFinish}
        initialValues={{ name: ticket?.fullName, date: dayjs(), gender: ticket?.genderDisplay, address: ticket?.address }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              {...itemLayout}
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...itemLayout}
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              {...itemLayout}
              label="Ngày khám"
              name="date"
              rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...itemLayout}
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Radio.Group>
                <Radio value="Nam">Nam</Radio>
                <Radio value="Nữ">Nữ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              {...itemLayout}
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              {...itemLayout}
              label="Cân nặng"
              name="weight"
              rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              {...itemLayout}
              label="Huyết áp"
              name="pressure"
              rules={[{ required: true, message: 'Vui lòng nhập huyết áp' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          {...fullLayout}
          label="Triệu chứng"
          name="symptoms"
          rules={[{ required: true, message: 'Vui lòng nhập triệu chứng' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          {...fullLayout}
          label="Chẩn đoán"
          name="diagnose"
          rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          {...fullLayout}
          label="Căn dặn"
          name="treatmentPlan"
          rules={[{ required: true, message: 'Vui lòng nhập căn dặn' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          {...fullLayout}
          label="Ghi chú"
          name="note"
          rules={[{ required: true, message: 'Vui lòng nhập ghi chú' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <MedicineSection
          medicineSelectOptions={medicineSelectOptions}
          setKeyword={setKeyword}
          onAddMedicine={handleAddMedicineToList}
        />
        <Form.Item
          label="Danh sách thuốc"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Table
            rowKey="key"
            bordered
            style={{ marginTop: 16, marginBottom: 24 }}
            columns={columns}
            dataSource={tableData}
            pagination={false}
            locale={{ emptyText: 'Chưa có thuốc nào' }}
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{ span: 24 }}
          style={{ textAlign: 'center', marginTop: 24 }}
        >
          <Space>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
                form.setFieldsValue({ usages: [{}] });
                setMedicineList([]);
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu phiếu khám
            </Button>
            <Button onClick={handleExportPdf}>In PDF</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Prescription;