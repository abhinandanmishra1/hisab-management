"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getGroups } from "@/lib/storage"
import type { Group } from "@/types"
import Link from "next/link"
import { format } from "date-fns"

export function GroupList() {
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    setGroups(getGroups())
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <Link key={group.id} href={`/group/${group.id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>{group.members.length} Members</p>
                <p>{group.hisabs.length} Hisabs</p>
                {group.hisabs.length > 0 && (
                  <p>Last updated: {format(new Date(group.hisabs[group.hisabs.length - 1].date), "PP")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

