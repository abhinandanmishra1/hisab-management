"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Group, Hisab } from "@/types"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PaymentView } from "@/components/payment-view"

interface PaymentsClientProps {
  group: Group;
  hisabs: Hisab[]
}

export default function PaymentsClient({ group, hisabs = [] }: PaymentsClientProps) {
  const handleUpdate = async () => {
    // try {
    //   await updateGroup(group.id);
    // } catch (error) {
    //   console.error('Error updating group:', error);
    // }
  };

  return (
    <div className="container py-8 space-y-8 mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Payments</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{group.name}</p>
            </div>
            <Link href={`/groups/${group.id}`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hisabs
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PaymentView group={group} hisabs={hisabs} onUpdate={handleUpdate} />
        </CardContent>
      </Card>
    </div>
  )
}