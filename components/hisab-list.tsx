"use client"

import type { Group, Hisab } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { format } from "date-fns"

interface HisabListProps {
  group: Group;
  hisabs: Hisab[]
}

export function HisabList({ group, hisabs = [] }: HisabListProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i} value={(i + 1).toString()}>
                {format(new Date(2024, i, 1), "MMMM")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select week" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 52 }, (_, i) => (
              <SelectItem key={i} value={(i + 1).toString()}>
                Week {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Paid by" />
          </SelectTrigger>
          <SelectContent>
            {group.members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hisab Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Paid By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hisabs.map((hisab: Hisab) => (
            <TableRow key={hisab.id}>
              <TableCell>{hisab.name}</TableCell>
              <TableCell>{hisab.amount}</TableCell>
              <TableCell>{format(hisab.date, "PP")}</TableCell>
              <TableCell>{hisab.paidBy.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

