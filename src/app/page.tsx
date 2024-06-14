'use client'
import Chattab from "@/components/Chattab";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";

export default function Home() {
  return (
    <div>
      <Chattab/>
      {/* <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
      </Authenticated> */}
    </div>
  );
}
