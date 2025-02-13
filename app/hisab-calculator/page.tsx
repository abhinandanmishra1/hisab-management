"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PaymentSummary from "@/components/payment-summary";
import { Plus } from "lucide-react";

// Types
interface Friend {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  amount: number;
  paidBy: string;
  description: string;
  splitAmong: string[];
  splitAmount: number;
  date: string;
}

interface Balances {
  [key: string]: {
    [key: string]: number;
  };
}

interface HisabContextType {
  friends: Friend[];
  expenses: Expense[];
  newFriendName: string;
  amount: string;
  paidBy: string;
  description: string;
  splitAmong: string[];
  setNewFriendName: (name: string) => void;
  setAmount: (amount: string) => void;
  setPaidBy: (id: string) => void;
  setDescription: (desc: string) => void;
  setSplitAmong: (ids: string[]) => void;
  addFriend: () => void;
  addExpense: () => void;
  calculateBalances: () => Balances;
  clearAll: () => void;
}

// Create Context
const HisabContext = createContext<HisabContextType | null>(null);

// Custom Hook for Hisab Logic
const useHisab = (): HisabContextType => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriendName, setNewFriendName] = useState<string>("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [paidBy, setPaidBy] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  useEffect(() => {
    const savedFriends = localStorage.getItem("friends");
    const savedExpenses = localStorage.getItem("expenses");

    if (savedFriends) setFriends(JSON.parse(savedFriends));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  const addFriend = (): void => {
    if (!newFriendName.trim()) return;

    const newFriend: Friend = {
      id: Date.now().toString(),
      name: newFriendName.trim(),
    };

    const updatedFriends = [...friends, newFriend];
    setFriends(updatedFriends);
    localStorage.setItem("friends", JSON.stringify(updatedFriends));
    setNewFriendName("");
  };

  const addExpense = (): void => {
    if (!amount || !paidBy || !description || splitAmong.length === 0) return;

    const splitAmount = parseFloat(amount) / splitAmong.length;
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      paidBy,
      description,
      splitAmong,
      splitAmount,
      date: new Date().toISOString(),
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

    // Reset form
    setAmount("");
    setPaidBy("");
    setDescription("");
    setSplitAmong([]);
  };

  const calculateBalances2 = (): Balances => {
    const balances: Balances = {};
    friends.forEach((friend) => {
        balances[friend.id] = {};
        friends.forEach((otherFriend) => {
          if (friend.id !== otherFriend.id) {
            balances[friend.id][otherFriend.id] = 0;
          }
        });
      });

    expenses.forEach((expense) => {
      expense.splitAmong.forEach((debtorId) => {
        if (debtorId !== expense.paidBy) {
            if (!balances[debtorId]) {
                balances[debtorId] = {};
              }
              if (!balances[expense.paidBy]) {
                balances[expense.paidBy] = {};
              }
              
              // Initialize if undefined
              if (typeof balances[debtorId][expense.paidBy] === 'undefined') {
                balances[debtorId][expense.paidBy] = 0;
              }
              if (typeof balances[expense.paidBy][debtorId] === 'undefined') {
                balances[expense.paidBy][debtorId] = 0;
              }
      
              // Update balances
              balances[debtorId][expense.paidBy] += expense.splitAmount;
              balances[expense.paidBy][debtorId] -= expense.splitAmount;
        }
      });
    });

    return balances;
  };

  const calculateBalances = (): Balances => {
    const balances: Balances = {};
    
    // Initialize all possible combinations first
    friends.forEach((friend) => {
      balances[friend.id] = {};
      friends.forEach((otherFriend) => {
        if (friend.id !== otherFriend.id) {
          balances[friend.id][otherFriend.id] = 0;
        }
      });
    });
  
    // Calculate expenses with single direction balances
    expenses.forEach((expense) => {
      expense.splitAmong.forEach((debtorId) => {
        if (debtorId !== expense.paidBy) {
          const paidBy = expense.paidBy;
          if (!balances[debtorId]) {
            balances[debtorId] = {};
          }

          if (!balances[paidBy]) {
            balances[paidBy] = {};
          }

          // Initialize if undefined
          if (typeof balances[debtorId][paidBy] === 'undefined') {
            balances[debtorId][paidBy] = 0;
          }

          if (typeof balances[paidBy][debtorId] === 'undefined') {
            balances[paidBy][debtorId] = 0;
          }
          // Store all balances in a consistent direction (debtor to creditor)
          balances[debtorId][paidBy] += expense.splitAmount;
          // Remove the reverse direction to avoid double counting
          balances[paidBy][debtorId] = 0;
        }
      });
    });
  
    return balances;
  };

  const clearAll = (): void => {
    setFriends([]);
    setExpenses([]);
    localStorage.removeItem("friends");
    localStorage.removeItem("expenses");
  };

  return {
    friends,
    expenses,
    newFriendName,
    amount,
    paidBy,
    description,
    splitAmong,
    setNewFriendName,
    setAmount,
    setPaidBy,
    setDescription,
    setSplitAmong,
    addFriend,
    addExpense,
    calculateBalances,
    clearAll,
  };
};

// Main Component
const HisabCalculator: React.FC = () => {
  const hisab = useHisab();

  const getFinalStatus = (userId: string) => {
    const balances = hisab.calculateBalances();
    
    // Safe way to calculate totalDebts
    const totalDebts = Object.values(balances[userId] || {}).reduce(
      (total, amount) => total + (amount || 0),
      0
    );
  
    // Safe way to calculate totalCredits
    const totalCredits = Object.values(balances).reduce((total, userBalances) => {
      return total + (userBalances[userId] || 0);
    }, 0);
  
    // Only return status if there's a non-zero difference
    const difference = Math.abs(totalDebts - totalCredits);
    if (difference > 0.01) { // Use small threshold to handle floating point errors
      if (totalDebts > totalCredits) {
        return {
          status: "debtor",
          amount: totalDebts - totalCredits,
        };
      } else {
        return {
          status: "creditor",
          amount: totalCredits - totalDebts,
        };
      }
    }
    return {
      status: "settled",
      amount: 0,
    };
  };
  return (
    <HisabContext.Provider value={hisab}>
      <div className="container mx-auto p-4 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Friends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 w-1/3">
              <Input
                value={hisab.newFriendName}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    hisab.addFriend();
                  }
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  hisab.setNewFriendName(e.target.value)
                }
                placeholder="Enter friend's name"
              />
              <Button onClick={hisab.addFriend}>
                <Plus className="mr-2 h-4 w-4" /> Add Friend
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {hisab.friends.map((friend) => (
                <div key={friend.id} className="bg-secondary p-2 rounded">
                  {friend.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {hisab.friends.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Add Expense</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={hisab.amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      hisab.setAmount(e.target.value)
                    }
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={hisab.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      hisab.setDescription(e.target.value)
                    }
                    placeholder="What was this for?"
                  />
                </div>

                <div>
                  <Label>Paid By</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={hisab.paidBy}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      hisab.setPaidBy(e.target.value)
                    }
                  >
                    <option value="">Select who paid</option>
                    {hisab.friends.map((friend) => (
                      <option key={friend.id} value={friend.id}>
                        {friend.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Split Among</Label>
                  <div className="flex gap-2 flex-wrap">
                    {hisab.friends.map((friend) => (
                      <Button
                        key={friend.id}
                        variant={
                          hisab.splitAmong.includes(friend.id)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => {
                          if (hisab.splitAmong.includes(friend.id)) {
                            hisab.setSplitAmong(
                              hisab.splitAmong.filter((id) => id !== friend.id)
                            );
                          } else {
                            hisab.setSplitAmong([
                              ...hisab.splitAmong,
                              friend.id,
                            ]);
                          }
                        }}
                      >
                        {friend.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={hisab.addExpense} className="w-full">
                Add Expense
              </Button>
            </CardContent>
          </Card>
        )}

        {hisab.friends.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Friend</TableHead>
                    <TableHead>Status</TableHead>
                    {hisab.friends.map((friend) => (
                      <TableHead key={friend.id}>{friend.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hisab.friends.map((friend) => {
                    const finalStatus = getFinalStatus(friend.id);
                    console.log(friend.id, finalStatus);
                    return (
                      <TableRow key={friend.id}>
                        <TableCell className="font-medium">
                          {friend.name}
                        </TableCell>
                        <TableCell>
                          {finalStatus?.status === "debtor" && (
                            <span className="text-red-500">
                              Will send: {finalStatus?.amount.toFixed(2)}
                            </span>
                          )}
                          {finalStatus?.status === "creditor" && (
                            <span className="text-green-500">
                              Will receive: {finalStatus?.amount.toFixed(2)}
                            </span>
                          )}
                        </TableCell>
                        {hisab.friends.map((otherFriend) => (
                          <TableCell key={otherFriend.id}>
                            {friend.id === otherFriend.id ? (
                              "-"
                            ) : (
                              <span
                                className={
                                  hisab.calculateBalances()[friend.id][
                                    otherFriend.id
                                  ] > 0
                                    ? "text-red-500"
                                    : "text-green-500"
                                }
                              >
                                {Math.abs(
                                  hisab.calculateBalances()[friend.id][
                                    otherFriend.id
                                  ]
                                ).toFixed(2)}
                              </span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <PaymentSummary
          friends={hisab.friends}
          expenses={hisab.expenses}
          //   calculateBalances={hisab.calculateBalances}
        />

        {hisab.friends.length > 0 && (
          <Button
            variant="destructive"
            onClick={hisab.clearAll}
            className="w-full"
          >
            Clear All Data
          </Button>
        )}
      </div>
    </HisabContext.Provider>
  );
};

export default HisabCalculator;
