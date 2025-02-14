import { getGroups, getUsers } from "@/app/lib/api/server";

import GroupManagement from "@/components/create-group";

export default async function CreateGroupPage() {
  const users = await getUsers(); // ✅ Fetch users on server-side
  const groups = await getGroups();
  return <GroupManagement users={users} groups={groups} />;
}
