"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FormProvider, useForm } from "./form-context"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

function StepProgress({ isDesktop }: { isDesktop: boolean }) {
    const pathname = usePathname()
    const { step, totalSteps } = useForm()
    const progress = (step / (totalSteps - 1)) * 100

    // Don't show on completion page
    if (pathname === "/form" || pathname === "/form/completion") return null

    return (
        <div className={`w-full px-6 md:px-10 lg:px-12 ${isDesktop ? 'mb-12' : 'mb-6'}`} style={(!isDesktop && pathname.includes('/preferences')) ? { marginTop: '100px' } : {}}>
            <div className="flex justify-between items-center text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--foreground-tertiary)', padding: '14px' }}>
                <span>Setup Profile</span>
                <span>{step > 0 ? `${step}/${totalSteps - 1}` : ""}</span>
            </div>
            <Progress value={step === 0 ? 5 : progress} className="h-2.5" />
        </div>
    )
}

function BackButton({ isDesktop }: { isDesktop: boolean }) {
    const pathname = usePathname()
    // Don't show on welcome or completion page
    if (pathname === "/form" || pathname === "/form/completion") return null

    return (
        <button
            onClick={() => window.history.back()}
            className="fixed z-50 rounded-full glass transition-all hover:scale-110 shadow-lg flex items-center justify-center"
            style={{
                top: isDesktop ? '32px' : '20px',
                left: isDesktop ? '32px' : '20px',
                width: isDesktop ? '54px' : '44px',
                height: isDesktop ? '54px' : '44px',
                border: '1px solid var(--background-tertiary)',
                color: 'var(--foreground-secondary)',
            }}
        >
            <ChevronLeft size={isDesktop ? 32 : 40} strokeWidth={2.5} />
        </button>
    )
}

function FormContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { setStep } = useForm()
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (pathname === "/form") setStep(0)
        else if (pathname.includes("/profession")) setStep(1)
        else if (pathname.includes("/goals")) setStep(2)
        else if (pathname.includes("/expertise")) setStep(3)
        else if (pathname.includes("/preferences")) setStep(4)
        else if (pathname.includes("/completion")) setStep(5)
    }, [pathname, setStep])

    return (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden" style={{ background: 'var(--background)' }}>
            {/* Gradient Mesh Background - Same as Dashboard */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            <BackButton isDesktop={isDesktop} />

            <main className={`flex-1 flex flex-col items-center justify-center relative z-10 w-full ${isDesktop ? 'p-20' : 'p-6 sm:p-12'}`}>
                <div className="w-full max-w-5xl mx-auto">
                    <StepProgress isDesktop={isDesktop} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}

export default function FormLayout({ children }: { children: React.ReactNode }) {
    return (
        <FormProvider>
            <FormContent>{children}</FormContent>
        </FormProvider>
    )
}
