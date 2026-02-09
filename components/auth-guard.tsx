"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSupabase } from "@/lib/supabase"

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/signup",
    "/guest-chat",
    "/landing",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/refunds",
    "/shipping",
    "/faq",
    "/products",
    "/forgot-password",
    "/reset-password",
    "/install",
    "/search",
]

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const supabase = getSupabase()
                const { data: { session } } = await supabase.auth.getSession()

                // Check if current path is public
                const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))

                // 1. Not logged in
                if (!session) {
                    // Allow access to public pages
                    if (isPublicRoute || pathname.startsWith("/auth/")) {
                        setIsLoading(false)
                        return
                    }
                    // Redirect protected routes to login
                    router.push("/login")
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
                        router.push("/dashboard")
                        return
                    }
                    setIsLoading(false)
                    return
                }

                // Case B: User is on Dashboard or Chat - check onboarding
                if (pathname.startsWith("/dashboard") || pathname.startsWith("/chat")) {
                    if (!hasCompletedOnboarding) {
                        router.push("/form")
                        return
                    }
                }

                // Case C: Root page - allow both guest and logged-in users
                // Logged-in users can use it as chat interface or navigate to dashboard via sidebar

                setIsLoading(false)
            } catch (error) {
                console.error("Auth check failed:", error)
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [pathname, router])

    if (isLoading) {
        // Return a premium loading state
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="w-12 h-12 border-4 border-primary-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return <>{children}</>
}
