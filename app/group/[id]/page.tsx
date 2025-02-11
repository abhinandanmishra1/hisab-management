"use server"

import GroupClient from "@/app/group-component"
import { getGroupById } from "@/lib/api"

export default async function GroupPage({ params }: { params: { id: string } }) {
  const group = await getGroupById(params.id)

  if (!group) {
    return <p className="text-center text-gray-500">Group not found</p>
  }

  return <GroupClient group={group} />
}
