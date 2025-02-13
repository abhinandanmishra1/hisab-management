"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Changed from next/router

export default function GroupsPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push("/");
  }, [router]);

  // Return null or a loading state while redirecting
  return null;
}
