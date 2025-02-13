"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import React from "react";
import { User } from "@/types";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();

  const navigateToHisabCalculator = () => {
    router.push("/hisab-calculator");
  }
  
  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">Hisab Management</div>

          <div className="flex items-center gap-8">
            <Button onClick={navigateToHisabCalculator}>
              Hisab Calculator
            </Button>
            <SignedOut>
              <div className="flex gap-2 items-center">
              <SignInButton>
                <Button> Sign In </Button>
              </SignInButton>
              <SignUpButton>
                <Button> Sign Up </Button>
              </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};
