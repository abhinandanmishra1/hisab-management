"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Plus, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Group, Hisab } from "@/types"

import { AddHisab } from "@/components/add-hisab"
import { Button } from "@/components/ui/button"
import { HisabList } from "@/components/hisab-list"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

interface GroupClientProps {
  group: Group
  hisabs: Hisab[]
}

export default function GroupClient({ group, hisabs = [] }: GroupClientProps) {
  const [showAddHisab, setShowAddHisab] = useState(false)

  const refreshGroup = async () => {
    // Add your refresh logic here
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Users className="h-6 w-6 text-muted-foreground" />
              <div>
                <CardTitle className="text-2xl">{group.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {group.members?.length} members
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/groups/${group.id}/payments`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  View Payments
                </Button>
              </Link>
              <Button onClick={() => setShowAddHisab(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Hisab
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Hisab List Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Hisab History</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track all expenses and settlements
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {hisabs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hisabs found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowAddHisab(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create your first hisab
              </Button>
            </div>
          ) : (
            <HisabList group={group} hisabs={hisabs} />
          )}
        </CardContent>
      </Card>

      {/* Add Hisab Dialog */}
      <Dialog open={showAddHisab} onOpenChange={setShowAddHisab}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Hisab</DialogTitle>
          </DialogHeader>
          <AddHisab
            group={group}
            onAdd={refreshGroup}
            onClose={() => setShowAddHisab(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}