"use server"

import { getGroupById, getHisabsByGroupId } from "@/lib/api"

import GroupClient from "@/app/group-component"

export default async function GroupPage({ params }: { params: { id: string } }) {
  const group = await getGroupById(params.id);
  const hisabs = await getHisabsByGroupId(params.id);
  
  if (!group) {
    return <p className="text-center text-gray-500">Group not found</p>
  }

  return <GroupClient group={group} hisabs={hisabs.data} />
}
