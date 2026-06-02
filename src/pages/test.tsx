import HasPermission from "@/components/HasPermission";
import { Button } from "antd";

function TestPage() {
  return (
    <>
      <HasPermission requiredPermissions={["role.manage"]}>
        <Button>Hello world</Button>
      </HasPermission>
    </>
  );
}
export default TestPage;
