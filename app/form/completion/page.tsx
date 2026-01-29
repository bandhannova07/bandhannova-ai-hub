"use client"

import { useForm } from "../form-context"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Check, Loader2, Sparkles, PartyPopper, Brain } from "lucide-react"
import Link from "next/link"
import { getDB } from "@/lib/database/multi-db"

export default function CompletionPage() {
    const { data } = useForm()
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(true)

    // Use only first database (DB1)
    const supabase = getDB(0);

    useEffect(() => {
        const saveData = async () => {
            try {
                console.log('🔄 Starting onboarding data save...')
                console.log('📦 Form data:', data)

                const { data: { user }, error: userError } = await supabase.auth.getUser()

                if (userError) {
                    console.error("❌ Error getting user:", userError)
                    setIsSaving(false)
                    return
                }

                if (!user) {
                    console.error("❌ No user found - user needs to be logged in")
                    setIsSaving(false)
                    return
                }

                console.log('✅ User found:', user.id)

                const onboardingData = {
                    user_id: user.id,
                    profession: data.profession || '',
                    role: data.role || '',
                    goal: data.goal || '',
                    expertise: data.expertise || '',
                    interests: data.interests || [],
                    message_tone: data.message_tone || '',
                    language: data.language || 'English',
                    voice_gender: data.voice_gender || 'female',
                    updated_at: new Date().toISOString()
                }

                console.log('📝 Saving onboarding data:', onboardingData)

                const { data: result, error } = await supabase
                    .from('user_onboarding')
                    .upsert(onboardingData, { onConflict: 'user_id' })
                    .select()

                if (error) {
                    console.error("❌ Supabase error:", error)
                    throw error
                }

                console.log('✅ Onboarding data saved successfully:', result)
                localStorage.removeItem("onboarding-data")

                setIsSaving(false)
            } catch (error: any) {
                console.error("❌ Error saving onboarding data:", error)
                console.error("Error details:", {
                    message: error?.message,
                    details: error?.details,
                    hint: error?.hint,
                    code: error?.code
                })
                setIsSaving(false)
            }
        }

        saveData()
    }, [data, supabase])

    return (
        <div className="w-full flex justify-center items-center min-h-[70vh] px-4 sm:px-10 py-10 md:p-12">
            <div className="max-w-xl">
                {isSaving ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-12 text-center mt-12 md:mt-20"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 blur-3xl rounded-full" style={{ background: 'var(--gradient-hero)', opacity: 0.4 }} />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="relative z-10"
                            >
                                <Loader2 className="w-20 h-20" style={{ color: 'hsl(var(--primary))' }} />
                            </motion.div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                                Personalizing your{' '}
                                <span className="gradient-text">experience...</span>
                            </h2>
                            <p className="text-lg" style={{ color: 'var(--foreground-secondary)' }}>
                                We're setting up the AI just for you.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-12 text-center mt-12 md:mt-20"
                    >
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="relative"
                        >
                            <div
                                className="absolute inset-0 blur-3xl rounded-full"
                                style={{ background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', opacity: 0.5 }}
                            />
                            <div
                                className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl"
                                style={{ background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' }}
                            >
                                <Check className="w-16 h-16 text-white" strokeWidth={3} />
                            </div>
                        </motion.div>

                        {/* Success Message */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-center gap-4">
                                <p className="text-3xl md:text-6xl font-bold gradient-text pb-2">
                                    All Set!
                                </p>
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                >
                                    <PartyPopper className="w-10 h-10" style={{ color: 'hsl(var(--primary))' }} />
                                </motion.div>
                            </div>
                            <p className="text-xl" style={{ color: 'var(--foreground-secondary)' }}>
                                Your AI companion is now ready to help you as a{' '}
                                <span className="font-bold underline decoration-primary/30" style={{ color: 'var(--foreground)' }}>
                                    {data.profession || 'User'}
                                </span>.
                            </p>
                        </motion.div>

                        {/* Features Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-3 gap-4 md:gap-8 w-full mt-6 px-2 sm:px-6"
                        >
                            {[
                                { icon: Sparkles, label: "Personalized" },
                                { icon: Brain, label: "Smart" },
                                { icon: Check, label: "Ready" },
                            ].map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        className="flex flex-col items-center gap-2 md:gap-3 p-4 sm:p-6 md:p-10 rounded-[1.5rem] glass border shadow-lg"
                                        style={{ borderColor: 'var(--background-tertiary)', padding: '14px' }}
                                    >
                                        <Icon className="w-6 h-6 mb-1" style={{ color: 'hsl(var(--primary))' }} />
                                        <span className="text-sm font-bold" style={{ color: 'var(--foreground-secondary)' }}>
                                            {item.label}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="w-full pt-14" style={{ padding: '16px' }}
                        >
                            <Link href="/dashboard" className="block">
                                <Button
                                    size="lg"
                                    className="w-full md:w-auto min-w-[280px] h-14 rounded-full text-xl shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-primary/20"
                                    style={{ background: 'var(--gradient-hero)' }}
                                >
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
