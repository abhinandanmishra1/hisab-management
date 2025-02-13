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

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const { user, isLoaded } = useUser();
  const handleSignIn = () => {
    // Add sign in logic here
    setIsLoggedIn(true);
    // setUser({ name: "John Doe", email: "john@example.com" });
  };

  const handleSignUp = () => {
    // Add sign up logic here
    setIsLoggedIn(true);
    // setUser({ name: "John Doe", email: "john@example.com" });
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
  };

  console.log(user)
  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">GroupApp</div>

          <div>
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
