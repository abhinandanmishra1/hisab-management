"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Group, User } from "@/types";
import { Plus, Search, Users, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useMemo, useState } from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "./ui/multiselect";
import { createGroup } from "@/app/lib/api/client";
import { useRouter } from "next/navigation";

interface CreateGroupFormProps {
  users?: User[];
  groups?: Group[];
}

const GroupManagement = ({ users = [], groups = [] }: CreateGroupFormProps) => {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const userIdToUserMap = useMemo(() => {
    return users.reduce((map, user) => {
      map[user.id] = user;
      return map;
    }, {} as Record<string, User>);
  }, [users]);

  const options = useMemo(() => {
    return users?.map(user => ({ label: user.name, value: user.id }))
  }, [users]);

  const handleSelectUser = (users: string[]) => {
    setSelectedMembers(users);
  };

  const removeMember = (id: string) => {
    setSelectedMembers(prev => prev.filter(m => m !== id));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length < 2) return;

    try {
      const data = await createGroup({
        name: groupName.trim(),
        members: selectedMembers,
      });
      setIsPopoverOpen(false);
      setGroupName("");
      setSelectedMembers([]);
    } catch(err) {
      console.error('Error creating group:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Groups
          </CardTitle>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium leading-none">Create New Group</h4>
                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Add Members</Label>
                  <MultiSelect 
                    onValueChange={handleSelectUser}
                    options={options}
                    value={selectedMembers}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((memberId) => (
                    <div
                      key={memberId}
                      className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      <span>{userIdToUserMap[memberId]?.name}</span>
                      <button
                        onClick={() => removeMember(memberId)}
                        className="text-secondary-foreground/50 hover:text-secondary-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim() || selectedMembers.length < 2}
                  className="w-full"
                >
                  Create Group
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                className="pl-8"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
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
                      {group.members?.length} members
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupManagement;