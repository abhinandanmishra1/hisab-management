"use client";

import { Badge, Check, Eye, Receipt } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Group, Hisab } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { saveGroup } from "@/app/lib/storage";

interface PaymentViewProps {
  group: Group;
  hisabs: Hisab[];
  onUpdate: () => void;
}

interface Payment {
  from: string;
  to: string;
  amount: number;
  hisabs: Hisab[];
  calculations: Array<{
    hisabId: string;
    description: string;
    amount: number;
  }>;
}

export function PaymentView({
  group,
  onUpdate,
  hisabs = [],
}: PaymentViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [showDistribution, setShowDistribution] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  console.log("hisabs", hisabs);
  const payments = useMemo(() => {
    const calculatePayments = (): Payment[] => {
      // First, calculate net balances between each pair of users
      const pairwiseBalances: Record<
        string,
        Record<
          string,
          {
            amount: number;
            calculations: Array<{
              hisabId: string;
              description: string;
              amount: number;
            }>;
          }
        >
      > = {};

      hisabs.forEach((hisab) => {
        const payerId = hisab.paidBy.id;
        const payerName = hisab.paidBy.name;

        hisab.distributions.forEach((dist) => {
          if (payerId === dist.userId.id) return; // Skip if paying to self

          // Create nested records if they don't exist
          if (!pairwiseBalances[payerId]) pairwiseBalances[payerId] = {};
          if (!pairwiseBalances[dist.userId.id])
            pairwiseBalances[dist.userId.id] = {};

          // Add to payer's record
          if (!pairwiseBalances[payerId][dist.userId.id]) {
            pairwiseBalances[payerId][dist.userId.id] = {
              amount: 0,
              calculations: [],
            };
          }
          pairwiseBalances[payerId][dist.userId.id].amount += dist.amount;
          pairwiseBalances[payerId][dist.userId.id].calculations.push({
            hisabId: hisab.id,
            description: `${payerName} paid ${hisab.name}`,
            amount: dist.amount,
          });

          // Subtract from recipient's record
          if (!pairwiseBalances[dist.userId.id][payerId]) {
            pairwiseBalances[dist.userId.id][payerId] = {
              amount: 0,
              calculations: [],
            };
          }
          pairwiseBalances[dist.userId.id][payerId].amount -= dist.amount;
        });
      });

      console.log({ pairwiseBalances });
      // Convert pairwise balances to final payments
      const finalPayments: Payment[] = [];
      const processed = new Set<string>();

      Object.keys(pairwiseBalances).forEach((person1) => {
        Object.keys(pairwiseBalances[person1]).forEach((person2) => {
          const pairKey = [person1, person2].sort().join('-')
          if (processed.has(pairKey)) return
          processed.add(pairKey)
          console.log({
            person1: pairwiseBalances[person1][person2],
            person2: pairwiseBalances[person2][person1],
          });
          const balance1 = pairwiseBalances[person1][person2]?.amount || 0;
          const balance2 = pairwiseBalances[person2][person1]?.amount || 0;
          const whoWillGetMoney = balance1 > balance2 ? "person1" : "person2";

          if (whoWillGetMoney === "person1") {
            // Add small threshold to handle floating point
            const calculations = [
              ...(pairwiseBalances[person1][person2]?.calculations || []),
              ...(pairwiseBalances[person2][person1]?.calculations || []),
            ];

            finalPayments.push({
              from: person2,
              to: person1,
              amount: Math.abs(balance1),
              hisabs: hisabs.filter((h) =>
                calculations.some((calc) => calc.hisabId === h.id)
              ),
              calculations,
            });
          } else {
            const calculations = [
              ...(pairwiseBalances[person2][person1]?.calculations || []),
              ...(pairwiseBalances[person1][person2]?.calculations || []),
            ];
            finalPayments.push({
              from: person1,
              to: person2,
              amount: Math.abs(balance2),
              hisabs: hisabs.filter((h) =>
                calculations.some((calc) => calc.hisabId === h.id)
              ),
              calculations,
            });
          }
        });
      });

      return finalPayments;
    };
    return calculatePayments();
  }, [group, hisabs]);

  console.log("payments", payments);

  const clearHisab = (payment: Payment) => {
    const updatedHisabs = hisabs.filter(
      (hisab) => !payment.hisabs.find((h) => h.id === hisab.id)
    );
    const updatedGroup = {
      ...group,
      hisabs: updatedHisabs,
    };
    saveGroup(updatedGroup);
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
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

      {payments.length === 0 ? (
        <div className="text-center py-8">
          <Receipt className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No payments to show</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedMonth || selectedWeek
              ? "No payments found for the selected period"
              : "Select a month or week to view payments"}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {group.members.find((m) => m.id === payment.from)?.name}
                  </TableCell>
                  <TableCell>
                    {group.members.find((m) => m.id === payment.to)?.name}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowDistribution(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => clearHisab(payment)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showDistribution} onOpenChange={setShowDistribution}>
        <DialogContent className="max-w-lg h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Distribution Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Payment Calculation</h4>
                  <div className="space-y-2">
                    {selectedPayment?.calculations.map((calc, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {calc.description}
                        </span>
                        <span>₹{calc.amount.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-4">
                      <div className="flex justify-between font-medium">
                        <span>Final Payment</span>
                        <span>₹{selectedPayment?.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {selectedPayment?.hisabs.map((hisab) => (
                <Card key={hisab.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{hisab.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(hisab.date), "PP")}
                          </p>
                        </div>
                        <Badge>₹{hisab.amount}</Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Paid by:{" "}
                          {
                            group.members.find((m) => m.id === hisab.paidBy.id)
                              ?.name
                          }
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Distribution</p>
                        <div className="space-y-2">
                          {hisab.distributions.map((dist) => (
                            <div
                              key={dist.userId.id}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {
                                  group.members.find(
                                    (m) => m.id === dist.userId.id
                                  )?.name
                                }
                              </span>
                              <span>₹{dist.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
