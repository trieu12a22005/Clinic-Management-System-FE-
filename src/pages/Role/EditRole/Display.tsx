import { Input, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import useTriggerInput from "../hooks/useTriggerInput";
import { useEffect } from "react";

function RoleDisplay() {
  useEffect(() => {
    console.log("Mounted role dp");
  }, []);
  const triggerSavePromptHandler = useTriggerInput();
  const { control, setValue, clearErrors } = useFormContext();


  return (
    <div className="grid gap-4">
      <Controller
        control={control}
        name="roleName"
        render={({ field, fieldState }) => {
          const { value } = field;
          const { error } = fieldState;
          return (
            <div>
              <div className="flex gap-[18px] items-center mb-2">
                <p className="text-[18px] w-[100px] inline-block  shrink-0">
                  <span>Code * </span>
                  <Tooltip title="Mã của vai trò viết bằng tiếng Anh">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </p>
                <Input
                  value={value}
                  onChange={(x) => {
                    setValue("roleName", x.target.value);
                  }}
                  onInput={triggerSavePromptHandler}
                  style={{ fontSize: 18 }}
                />
              </div>
              {error && <p>{error.message}</p>}
            </div>
          );
        }}
      />
      <Controller
        control={control}
        name="roleDescription"
        render={({ field, fieldState }) => {
          const { error } = fieldState;
          const { value } = field;
          return (
            <div>
              <div className="flex gap-[18px] items-center mb-2">
                <span className="text-[18px] w-[100px] inline-block  shrink-0">Tên vai trò </span>
                <Input
                  value={value}
                  onChange={(x) => {
                    setValue("roleDescription", x.target.value);
                  }}
                  onInput={triggerSavePromptHandler}
                  style={{ fontSize: 18 }}
                />
              </div>
              {error && <p>{error.message}</p>}
            </div>
          );
        }}
      />
    </div>
  );
}
export default RoleDisplay;
