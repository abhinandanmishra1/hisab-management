"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"

interface Transaction {
  from: string;
  to: string;
  amount: number;
  expenses: Array<{
    description: string;
    date: string;
    amount: number;
    paidBy: string;
  }>;
}

interface PaymentSummaryProps {
  friends: Array<{ id: string; name: string; }>;
  expenses: Array<{
    id: string;
    amount: number;
    paidBy: string;
    description: string;
    splitAmong: string[];
    splitAmount: number;
    date: string;
  }>;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ friends, expenses }) => {

  console.log(expenses)
  const calculateNetTransactions = (): Transaction[] => {
    // First, calculate raw balances
    const balances: { [key: string]: { [key: string]: number } } = {};
    friends.forEach(friend => {
      balances[friend.id] = {};
      friends.forEach(otherFriend => {
        if (friend.id !== otherFriend.id) {
          balances[friend.id][otherFriend.id] = 0;
        }
      });
    });

    // Calculate all expenses
    expenses.forEach(expense => {
      expense.splitAmong.forEach(debtorId => {
        if (debtorId !== expense.paidBy) {
          if(!balances[debtorId]) {
            balances[debtorId] = {};
            balances[debtorId][expense.paidBy] = 0;
          }

          if(!balances[expense.paidBy]) {
            balances[expense.paidBy] = {};
            balances[expense.paidBy][debtorId] = 0;
          }
          balances[debtorId][expense.paidBy] += expense.splitAmount;
          balances[expense.paidBy][debtorId] -= expense.splitAmount;
        }
      });
    });

    // Convert balances to net transactions
    const transactions: Transaction[] = [];
    const processed = new Set<string>();

    friends.forEach(friend => {
      friends.forEach(otherFriend => {
        const key = [friend.id, otherFriend.id].sort().join('-');
        if (friend.id !== otherFriend.id && !processed.has(key)) {
          console.log(
            getFriendName(friend.id),
            getFriendName(otherFriend.id),
            balances[friend.id][otherFriend.id]
          )  
          const balance = balances[friend.id][otherFriend.id];
          if (Math.abs(balance) > 0.01) { // Ignore tiny rounding differences
            const relatedExpenses = expenses.filter(expense => {
              const involvesBothFriends = 
                expense.splitAmong.includes(friend.id) && 
                expense.splitAmong.includes(otherFriend.id);
              const oneOfThemPaid = 
                expense.paidBy === friend.id || 
                expense.paidBy === otherFriend.id;
              return involvesBothFriends && oneOfThemPaid;
            }).map(expense => ({
              description: expense.description,
              date: new Date(expense.date).toLocaleDateString(),
              amount: expense.splitAmount,
              paidBy: expense.paidBy
            }));

            if (balance > 0) {
              transactions.push({
                from: friend.id,
                to: otherFriend.id,
                amount: balance,
                expenses: relatedExpenses
              });
            }else {
              transactions.push({
                from: otherFriend.id,
                to: friend.id,
                amount: -balance,
                expenses: relatedExpenses
              });
            }
          }
        }
        processed.add(key);
      });
    });

    console.log(transactions)
    return transactions;
  };

  const getFriendName = (id: string): string => {
    return friends.find(f => f.id === id)?.name || 'Unknown';
  };

  const netTransactions = calculateNetTransactions();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-4">Calculate Payments</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Payment Summary</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] w-full pr-4">
          <div className="space-y-4">
            {netTransactions.length > 0 ? (
              netTransactions.map((transaction, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {getFriendName(transaction.from)} owes {getFriendName(transaction.to)}:{' '}
                      <span className="text-primary">
                        ₹{transaction.amount.toFixed(2)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="expenses">
                        <AccordionTrigger>
                          View Transaction Details
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {transaction.expenses.map((expense, i) => (
                              <div
                                key={i}
                                className="flex justify-between items-center p-2 bg-secondary rounded"
                              >
                                <div>
                                  <div className="font-medium">
                                    {expense.description} - {getFriendName(expense.paidBy)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {expense.date}
                                  </div>
                                </div>
                                <div className="font-medium">
                                  ₹{expense.amount.toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-4">
                No payments to settle
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSummary;