import { getGroups, getUsers } from "@/lib/api";

import GroupManagement from "@/components/create-group";

export default async function CreateGroupPage() {
  const users = await getUsers(); // ✅ Fetch users on server-side
  const groups = await getGroups();
  return <GroupManagement users={users} groups={groups} />;
}
