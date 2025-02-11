"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Users, X } from "lucide-react";
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { useRouter } from "next/navigation";

interface CreateGroupFormProps {
  users?: User[];
}

const GroupManagement = ({ users = [] }: CreateGroupFormProps) => {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");

  // Sample groups data - replace with actual data
  const [groups] = useState([
    { id: '1', name: 'Family Trip', members: 4 },
    { id: '2', name: 'Office Team', members: 6 },
    { id: '3', name: 'Weekend Party', members: 3 },
  ]);

  const availableUsers = users.filter(
    user => !selectedMembers.some(selected => selected.id === user.id)
  );

  const handleSelectUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && !selectedMembers.some(m => m.id === user.id)) {
      setSelectedMembers(prev => [...prev, user]);
    }
  };

  const removeMember = (id: string) => {
    setSelectedMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length < 2) return;

    const newGroup = {
      name: groupName.trim(),
      members: selectedMembers.map(m => m.id),
    };

    // Add your group creation logic here
    console.log('Creating group:', newGroup);
    router.push(`/groups/${newGroup.name}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Group Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Group
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Add Members</Label>
              <Select onValueChange={handleSelectUser}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {selectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                >
                  <span>{member.name}</span>
                  <button
                    onClick={() => removeMember(member.id)}
                    className="text-secondary-foreground/50 hover:text-secondary-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {selectedMembers.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedMembers.length} member{selectedMembers.length === 1 ? '' : 's'} selected
              </div>
            )}

            <Button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedMembers.length < 2}
              className="w-full mt-4"
            >
              Create Group
            </Button>
          </CardContent>
        </Card>

        {/* Groups List */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  className="pl-8"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className="mt-4 space-y-2">
                {groups
                  .filter(group => 
                    group.name.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/groups/${group.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{group.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {group.members} members
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupManagement;