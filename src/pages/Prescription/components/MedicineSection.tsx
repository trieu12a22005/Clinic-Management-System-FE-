import React from 'react';
import { Button, Col, Form, InputNumber, Row, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { timeToTakeOptions, usageOptions } from './constant';
type Props = {
  medicineSelectOptions: { label: string; value: number }[];
  setKeyword: (value: string) => void;
  onAddMedicine: () => void;
};

const MedicineSection: React.FC<Props> = ({
  medicineSelectOptions,
  setKeyword,
  onAddMedicine,
}) => {
  return (
    <>
      <Row gutter={16} className="mt-2">
        <Col span={10}>
          <Form.Item
            label="Tên thuốc"
            name="medicineId"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            
          >
            <Select
              showSearch
              placeholder="Nhập để tìm thuốc"
              options={medicineSelectOptions}
              filterOption={false}
              onSearch={setKeyword}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Các cách dùng"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.List name="usages">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={16} className="mt-2">
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      label="Thời gian dùng"
                      name={[name, 'timeToTake']}
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      
                    >
                      <Select
                        placeholder="Chọn thời gian dùng"
                        options={timeToTakeOptions}
                        allowClear
                      />
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item
                      {...restField}
                      label="Số lượng"
                      name={[name, 'quantity']}
                      labelCol={{ span: 10 }}
                      wrapperCol={{ span: 14 }}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      label="Cách dùng"
                      name={[name, 'usage']}
                      labelCol={{ span: 7 }}
                      wrapperCol={{ span: 17 }}
                      
                    >
                      <Select
                        placeholder="Chọn cách dùng"
                        options={usageOptions}
                        allowClear
                      />
                    </Form.Item>
                  </Col>

                  <Col span={2}>
                    <Button danger onClick={() => remove(name)}>
                      Xóa
                    </Button>
                  </Col>
                </Row>
              ))}

              <Button
                type="dashed"
                icon={<PlusCircleOutlined />}
                onClick={() =>
                  add({
                    timeToTake: undefined,
                    quantity: 1,
                    usage: undefined,
                  })
                }
                style={{ marginTop: 8 }}
              >
                Thêm cách dùng
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
        <Button type="primary" onClick={onAddMedicine}>
          Thêm vào danh sách thuốc
        </Button>
      </Form.Item>
    </>
  );
};

export default MedicineSection;