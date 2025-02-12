"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Group, Hisab } from "@/types"

import { AddHisab } from "@/components/add-hisab"
import { Button } from "@/components/ui/button"
import { HisabList } from "@/components/hisab-list"
import Link from "next/link"
import { Plus } from "lucide-react"
import { useState } from "react"

interface GroupClientProps {
  group: Group
  hisabs: Hisab[]
}
export default function GroupClient({ group, hisabs = [] }: GroupClientProps) {
  console.log(hisabs)
  // const [group, setGroup] = useState<Group>(initialGroup)
  const [showAddHisab, setShowAddHisab] = useState(false)

  const refreshGroup = async () => {
    // const updatedGroup = await getGroupById(group.id)
    // setGroup(updatedGroup)
  }

  return (
    <main className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{group.name}</h1>
        <div className="flex gap-4">
          <Link href={`/groups/${group.id}/payments`}>
            <Button variant="outline">View Payments</Button>
          </Link>
          <Button onClick={() => setShowAddHisab(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Hisab
          </Button>
        </div>
      </div>

      <HisabList group={group} hisabs={hisabs} />

      <Dialog open={showAddHisab} onOpenChange={setShowAddHisab}>
        <DialogContent className="max-w-lg">
          <AddHisab
            group={group}
            onAdd={refreshGroup}
            onClose={() => setShowAddHisab(false)}
          />
        </DialogContent>
      </Dialog>
    </main>
  )
}
