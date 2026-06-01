import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { DatePicker, Form, Input, Modal } from "antd";
import type { AuthRespone } from "@/types/Auth";
import { selfProfileSelector, useProfile, useUpdateProfile } from "./useProfile";
import useStore from "@/store/useStore";
import { useCallback, useEffect } from "react";
function UpdateModal() {
  // use modal from global store instead of local state!
  const open = useStore((state) => state.behaviour.modal.open);
  const blur = useStore((state) => state.behaviour.modal.blur);

  const { data: profile } = useProfile(selfProfileSelector);
  const updateProfile = useUpdateProfile();

  // This modal use antdesign's form, not react hook form.
  // Populate form whenever profile data loads
  const [editForm] = Form.useForm();
  useEffect(() => {
    if (profile && open && profile) {
      const currentProfile = profile;
      editForm.setFieldsValue({
        firstName: currentProfile.firstName,
        lastName: currentProfile.lastName,
        birthDate: currentProfile.birthDate ? dayjs(currentProfile.birthDate) : null,
      });
    }
  }, [profile, open, editForm]);

  const handleEditSubmit = useCallback(async () => {
    try {
      console.log("I got triggered");
      const values = await editForm.validateFields();
      const payload: Partial<AuthRespone> = {
        // ...profile,
        firstName: values.firstName,
        lastName: values.lastName,
        birthDate: values.birthDate ? dayjs(values.birthDate).format("YYYY-MM-DD") : profile.birthDate,
      };
      await updateProfile.mutateAsync(payload);
      blur();
    } catch {
      // validation failed — antd form already shows inline errors
    }
  }, [editForm, blur, profile, updateProfile]);

  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2">
            {/* <EditOutlined style={{ color: roleColor }} /> */}
            <span>Chỉnh sửa thông tin cá nhân</span>
          </div>
        }
        open={open}
        onOk={handleEditSubmit}
        onCancel={() => blur()}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={updateProfile.isPending}
        okButtonProps={{
          style: { background: "#1677ff", borderColor: "pink", borderRadius: 8 },
        }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        styles={{ header: { borderBottom: "1px solid #f0f0f0", paddingBottom: 16 } }}
        style={{ borderRadius: 16 }}
      >
        <Form form={editForm} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="firstName" label="Họ" rules={[{ required: true, message: "Vui lòng nhập họ" }]}>
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Nhập họ"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item name="lastName" label="Tên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Nhập tên"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item name="birthDate" label="Ngày sinh">
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
              size="large"
              style={{ width: "100%", borderRadius: 8 }}
              suffixIcon={<CalendarOutlined style={{ color: "#bfbfbf" }} />}
              disabledDate={(d) => d && d.isAfter(dayjs())}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
export default UpdateModal;
