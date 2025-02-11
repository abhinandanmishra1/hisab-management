import GroupManagement from "@/components/create-group";
import { getUsers } from "@/lib/api";

export default async function CreateGroupPage() {
  const users = await getUsers(); // ✅ Fetch users on server-side
  return <GroupManagement users={users} />;
}
