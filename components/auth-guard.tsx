"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSupabase, findUserInAllDBs } from "@/lib/supabase"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let supabase = getSupabase()
                let { data: { session } } = await supabase.auth.getSession()

                // If no session found on default client, try to recover (find user in other DBs)
                if (!session) {
                    const recovery = await findUserInAllDBs();
                    if (recovery) {
                        supabase = recovery.client; // Update client to the correct one
                        session = recovery.session;
                    }
                }

                // 1. Not logged in
                if (!session) {
                    // Allow access to public pages (add more if needed)
                    if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
                        setIsLoading(false)
                        return
                    }
                    // Redirect to login for protected pages
                    // router.push("/login") // Commented out to avoid aggressive redirects during dev
                    setIsLoading(false)
                    return
                }

                // 2. Logged in - Check Onboarding Status
                const { data: onboardingData } = await supabase
                    .from("user_onboarding")
                    .select("user_id")
                    .eq("user_id", session.user.id)
                    .single()

                const hasCompletedOnboarding = !!onboardingData

                // Case A: User is on Onboarding pages
                if (pathname.startsWith("/form")) {
                    if (hasCompletedOnboarding) {
                        // If done, kick them out to dashboard
                        router.push("/dashboard")
                    }
                    // If not done, let them stay
                }

                // Case B: User is on Dashboard or other protected pages
                else if (pathname.startsWith("/dashboard") || pathname === "/") {
                    if (!hasCompletedOnboarding) {
                        // If not done, force them to onboarding
                        router.push("/form")
                    }
                }

                setIsLoading(false)
            } catch (error) {
                console.error("Auth check failed:", error)
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [pathname, router])

    if (isLoading) {
        return null // Or a loading spinner
    }

    return <>{children}</>
}
