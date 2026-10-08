import { NativeSelect } from "@chakra-ui/react";
import { userName, type UserOption } from "../../api/users";

// dropdown om een gebruiker te kiezen voor een taak
interface AssigneeSelectProps {
  users: UserOption[];
  value: number | null;
  onChange: (value: number | null) => void;
  size?: "sm" | "md";
}

// https://chakra-ui.com/docs/components/native-select
export default function AssigneeSelect({ users, value, onChange, size = "md" }: AssigneeSelectProps) {
  return (
    <NativeSelect.Root size={size}>
      <NativeSelect.Field
        aria-label="Assign to"
        borderRadius="10px"
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        value={value ?? ""}
      >
        <option value="">Unassigned</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {userName(user)}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
