'use client'
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export const ConvexClientProvider = (
    {children

    }:{
    children: ReactNode
    }
) => {

    return(
        <ClerkProvider
         publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
         >
            <ConvexProviderWithClerk client={client} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}