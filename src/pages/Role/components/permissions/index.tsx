import type { Permission } from "@/types/role";
import { Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import usePermission from "../../hooks/usePermission";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import useTriggerInput from "../../hooks/useTriggerInput";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
type PermissionItem = Permission;

type PermissionRow = PermissionItem & {
  key: string; // Key is permissionID. If it's actually a row showing group, return false
  isGroup?: boolean;
  children?: PermissionRow[];
};

const groupPermissions = (permissions: PermissionItem[]): PermissionRow[] => {
  // Group by the prefix "code.authentication" ==> "code" group
  const groupMap = new Map<string, PermissionRow>();
  const rows: PermissionRow[] = [];

  permissions.forEach((permission) => {
    const [group] = permission.code.split(".");

    const groupKey = `group:${group}`;
    let groupRow = groupMap.get(groupKey);

    if (!groupRow) {
      groupRow = {
        key: groupKey,
        code: group,
        permissionID: "------------------------",
        permissionName: `Nhóm quyền ${group}`,
        description: "",
        isGroup: true,
        children: [],
      };
      groupMap.set(groupKey, groupRow);
      rows.push(groupRow);
    }

    groupRow.children?.push({
      key: permission.permissionID,
      ...permission,
    });
  });
  // console.log("Grouped:", groupMap);
  // console.log("Rows:", rows);
  return rows;
};

const styles = {
  nameCellGroup: "inline-flex items-center gap-3 pl-4",
  nameCellChild: "inline-flex items-center gap-3 pl-8",
  nameTextGroup: "text-sm font-bold uppercase text-white",
  nameTextChild: "text-sm font-medium text-slate-900",
  expandButtonGroup:
    "inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white shadow-sm transition hover:scale-105 hover:bg-white/20",
  expandButtonChild:
    "inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50",
  table: `w-full[&_.ant-table-container]:border-0
    [&_.ant-table-row>td]:transition-colors
    [&_.ant-table-row-expand-icon]:align-middle
    [&_.perm-group-row>td]:!bg-green-800/80 [&_.perm-group-row>td]:!cursor-pointer
    [&_.perm-group-row:hover>td]:!bg-yellow-800/90
    [&_.perm-group-row>td]:!text-white
    [&_.perm-child-row>td]:!bg-green-100
    [&_.perm-child-row:hover>td]:!bg-yellow-200/70`,
};

const columns: ColumnsType<PermissionRow> = [
  {
    title: "Tên quyền",
    dataIndex: "permissionName",
    key: "permissionName",
    render: (value: string, record) => (
      <div className={record.isGroup ? styles.nameCellGroup : styles.nameCellChild}>
        <span className={record.isGroup ? styles.nameTextGroup : styles.nameTextChild}>{value}</span>
      </div>
    ),
  },
  {
    title: "Mô tả quyền",
    dataIndex: "description",
    key: "description",
    render: (value: string | undefined, record) => (
      <span className={record.isGroup ? "text-blue-800" : "text-slate-600"}>{value || ""}</span>
    ),
  },
];
function PermissionList() {
  const { control } = useFormContext();
  const { data: permissions } = usePermission();

  const dataSource = useMemo(() => groupPermissions(permissions ?? []), [permissions]);

  const permissionMap = useMemo(
    // Create a map for permission list (all permissions available, not selected ones)
    () => new Map((permissions ?? []).map((permission: Permission) => [permission.permissionID, permission])),
    [permissions]
  );
  const triggerSavePromptHandler = useTriggerInput();

  return (
    <Controller
      control={control}
      name="permissions"
      render={({ field }) => {
        const selectedRowKeys = field.value ?? [];
        return (
          permissions && (
            <Table<PermissionRow>
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              rowKey="key"
              rowClassName={(record) => (record.isGroup ? "perm-group-row" : "perm-child-row")}
              expandable={{
                defaultExpandAllRows: true,
                expandRowByClick: true,
                expandIcon: ({ expanded, record }) => {
                  if (!record.children?.length) {
                    return <span className="inline-block w-7" />;
                  }
                  if (expanded) return <UpOutlined />;
                  return <DownOutlined />;
                },
              }}
              rowSelection={{
                columnTitle: " ",
                renderCell: (checked, _record, _index, originNode) => {
                  const triggerChange = (nextChecked: boolean) => {
                    const node = originNode as {
                      props?: {
                        onChange?: (event: {
                          target: { checked: boolean };
                          nativeEvent: { shiftKey: boolean };
                        }) => void;
                      };
                    };

                    node?.props?.onChange?.({
                      target: { checked: nextChecked },
                      nativeEvent: { shiftKey: false },
                    });
                  };

                  return (
                    <Switch
                      style={{ background: checked ? "green" : "#333" }}
                      checked={checked}
                      onChange={triggerChange}
                    />
                  );
                },
                checkStrictly: false,
                selectedRowKeys: selectedRowKeys,
                onChange: (nextSelectedKeys) => {
                  // console.log(nextSelectedKeys);
                  const nextValue = nextSelectedKeys
                    .map((key) => permissionMap.get(String(key)))
                    .filter(Boolean)
                    .map((p) => (p as Permission).permissionID);
                  field.onChange(nextValue);
                  triggerSavePromptHandler();
                },
              }}
              className={styles.table}
            />
          )
        );
      }}
    />
  );
}

export default PermissionList;
