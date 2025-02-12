"use client"

import { useEffect, useState } from "react"
import { PaymentView } from "@/components/payment-view"
import { getGroup } from "@/lib/storage"
import type { Group } from "@/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PaymentsPage({ params }: { params: { id: string } }) {
  const [group, setGroup] = useState<Group>()

  useEffect(() => {
    const loadGroup = () => {
      const loadedGroup = getGroup(params.id)
      setGroup(loadedGroup)
    }
    loadGroup()
  }, [params.id])

  if (!group) return null

  return (
    <main className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Payments - {group.name}</h1>
        <Link href={`/group/${group.id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hisabs
          </Button>
        </Link>
      </div>

      <PaymentView
        group={group}
        onUpdate={() => {
          const updatedGroup = getGroup(params.id)
          setGroup(updatedGroup)
        }}
      />
    </main>
  )
}

