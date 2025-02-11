"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Distribution, Group, Hisab } from "@/types"
import { saveGroup } from "@/lib/storage"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AddHisabProps {
  group: Group
  onAdd: () => void
  onClose: () => void
}

export function AddHisab({ group, onAdd, onClose }: AddHisabProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [paidBy, setPaidBy] = useState(group.members[0].id)
  const [distributionType, setDistributionType] = useState<"equal" | "unequal">("equal")
  const [distributions, setDistributions] = useState<Distribution[]>(
    group.members.map((m) => ({ userId: m.id, amount: 0 })),
  )

  const updateDistribution = (userId: string, amount: number) => {
    setDistributions(distributions.map((d) => (d.userId === userId ? { ...d, amount: Number(amount) } : d)))
  }

  const calculateEqualDistribution = (totalAmount: number) => {
    const perPerson = Number(totalAmount) / group.members.length
    setDistributions(
      group.members.map((m) => ({
        userId: m.id,
        amount: Math.round((perPerson + Number.EPSILON) * 100) / 100,
      })),
    )
  }

  const addHisab = () => {
    if (!name.trim() || !amount) return

    const totalDistributed = distributions.reduce((sum, d) => sum + d.amount, 0)
    if (Math.abs(totalDistributed - Number(amount)) > 0.01) {
      alert("Total distribution must equal the hisab amount")
      return
    }

    const hisab: Hisab = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: Number(amount),
      date: new Date(date),
      paidBy,
      distributionType,
      distributions,
    }

    const updatedGroup = {
      ...group,
      hisabs: [...group.hisabs, hisab],
    }

    saveGroup(updatedGroup)
    onAdd()
    onClose()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Hisab</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Hisab Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter hisab name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              if (distributionType === "equal" && e.target.value) {
                calculateEqualDistribution(Number(e.target.value))
              }
            }}
            placeholder="Enter amount"
          />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Paid By</Label>
          <Select value={paidBy} onValueChange={setPaidBy}>
            <SelectTrigger>
              <SelectValue placeholder="Select member" />
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

        <div className="space-y-2">
          <Label>Distribution Type</Label>
          <Select
            value={distributionType}
            onValueChange={(value: "equal" | "unequal") => {
              setDistributionType(value)
              if (value === "equal" && amount) {
                calculateEqualDistribution(Number(amount))
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equal">Equal</SelectItem>
              <SelectItem value="unequal">Unequal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Distribution</Label>
          <div className="space-y-2">
            {group.members.map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <span className="w-32">{member.name}</span>
                <Input
                  type="number"
                  value={distributions.find((d) => d.userId === member.id)?.amount || 0}
                  onChange={(e) => updateDistribution(member.id, Number(e.target.value))}
                  disabled={distributionType === "equal"}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
          <Button onClick={addHisab} className="w-full">
            Add Hisab
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

