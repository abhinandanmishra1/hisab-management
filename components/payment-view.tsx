"use client"

import { Check, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Group, Hisab } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { saveGroup } from "@/lib/storage"

interface PaymentViewProps {
  group: Group
  onUpdate: () => void
}

interface Payment {
  from: string
  to: string
  amount: number
  hisabs: Hisab[]
}

export function PaymentView({ group, onUpdate }: PaymentViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedWeek, setSelectedWeek] = useState<string>("")
  const [showDistribution, setShowDistribution] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const payments = useMemo(() => {
    const calculatePayments = (): Payment[] => {
      // Filter hisabs based on selected month/week
      const filteredHisabs = group.hisabs.filter((hisab) => {
        const hisabDate = new Date(hisab.date)
        if (selectedMonth && hisabDate.getMonth() + 1 !== Number(selectedMonth)) return false
        // Add week filtering if needed
        return true
      })

      const balances: Record<string, { amount: number; hisabs: Hisab[] }> = {}

      // Calculate initial balances
      filteredHisabs.forEach((hisab) => {
        // Add amount to payer's balance
        if (!balances[hisab.paidBy]) {
          balances[hisab.paidBy] = { amount: 0, hisabs: [] }
        }
        balances[hisab.paidBy].amount += hisab.amount
        balances[hisab.paidBy].hisabs.push(hisab)

        // Subtract distributed amounts from each person's balance
        hisab.distributions.forEach((dist) => {
          if (!balances[dist.userId]) {
            balances[dist.userId] = { amount: 0, hisabs: [] }
          }
          balances[dist.userId].amount -= dist.amount
          balances[dist.userId].hisabs.push(hisab)
        })
      })

      const payments: Payment[] = []
      const debtors = Object.entries(balances)
        .filter(([_, { amount }]) => amount < 0)
        .sort((a, b) => a[1].amount - b[1].amount)
      const creditors = Object.entries(balances)
        .filter(([_, { amount }]) => amount > 0)
        .sort((a, b) => b[1].amount - a[1].amount)

      while (debtors.length > 0 && creditors.length > 0) {
        const [debtorId, { amount: debtorAmount, hisabs: debtorHisabs }] = debtors[0]
        const [creditorId, { amount: creditorAmount, hisabs: creditorHisabs }] = creditors[0]

        const amount = Math.min(Math.abs(debtorAmount), creditorAmount)

        if (amount > 0) {
          payments.push({
            from: debtorId,
            to: creditorId,
            amount,
            hisabs: [...new Set([...debtorHisabs, ...creditorHisabs])],
          })
        }

        if (Math.abs(debtorAmount) === creditorAmount) {
          debtors.shift()
          creditors.shift()
        } else if (Math.abs(debtorAmount) < creditorAmount) {
          debtors.shift()
          creditors[0][1].amount -= Math.abs(debtorAmount)
        } else {
          creditors.shift()
          debtors[0][1].amount += creditorAmount
        }
      }

      return payments
    }
    return calculatePayments()
  }, [group, selectedMonth]) // Removed unnecessary dependency: selectedWeek

  const clearHisab = (payment: Payment) => {
    const updatedHisabs = group.hisabs.filter((hisab) => !payment.hisabs.find((h) => h.id === hisab.id))

    const updatedGroup = {
      ...group,
      hisabs: updatedHisabs,
    }

    saveGroup(updatedGroup)
    onUpdate()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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

        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
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
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sender</TableHead>
            <TableHead>Receiver</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment, index) => (
            <TableRow key={index}>
              <TableCell>{group.members.find((m) => m.id === payment.from)?.name}</TableCell>
              <TableCell>{group.members.find((m) => m.id === payment.to)?.name}</TableCell>
              <TableCell>{payment.amount.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedPayment(payment)
                      setShowDistribution(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => clearHisab(payment)}>
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showDistribution} onOpenChange={setShowDistribution}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Distribution Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPayment?.hisabs.map((hisab) => (
              <div key={hisab.id} className="space-y-2 p-4 rounded-lg border">
                <div className="flex justify-between">
                  <h4 className="font-medium">{hisab.name}</h4>
                  <span>{format(new Date(hisab.date), "PP")}</span>
                </div>
                <p>Amount: ₹{hisab.amount}</p>
                <p>Paid by: {group.members.find((m) => m.id === hisab.paidBy)?.name}</p>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Distribution:</p>
                  {hisab.distributions.map((dist) => (
                    <div key={dist.userId} className="flex justify-between text-sm">
                      <span>{group.members.find((m) => m.id === dist.userId)?.name}</span>
                      <span>₹{dist.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

