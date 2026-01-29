"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { WandSparkles, ArrowRight, Zap, Brain, Target } from "lucide-react"
export default function FormWelcomePage() {
    return (
        <div className="w-full flex justify-center px-4 sm:px-10 py-10 md:p-12">
            <div className="max-w-4xl w-full">
                <div className="space-y-12 mt-12 md:mt-20 flex flex-col items-center justify-center" style={{ padding: '10px' }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="relative w-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full" />
                        <div className="relative glass border rounded-[2.5rem] p-8 sm:p-12 md:p-16 shadow-2xl backdrop-blur-xl flex flex-col items-start text-left" style={{ borderColor: 'var(--background-tertiary)', padding: '32px' }}>
                            <div className="flex flex-col md:flex-row items-start justify-start gap-6 md:gap-10 mb-12 w-full">
                                <div
                                    className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-2xl flex items-center justify-center p-3 sm:p-4 shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #C683D7 0%, #223CCF 50%, #00D9FF 100%)' }}
                                >
                                    <WandSparkles className="w-10 h-10 text-white" strokeWidth={2} />
                                </div>
                                <div className="max-w-3xl">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                                        Let's Personalize{' '}
                                        <span className="gradient-text">Your AI Experience</span>
                                    </h2>
                                    <p className="text-lg md:text-2xl leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                                        Help us understand who you are, so our AI can give you exactly what you need.
                                    </p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full text-left px-2 sm:px-6"
                                style={{ padding: '20px' }}
                            >
                                {[
                                    { icon: Target, title: "Better Answers", desc: "Tailored to your role", gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" },
                                    { icon: Zap, title: "Faster Results", desc: "Skip the basics", gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)" },
                                    { icon: Brain, title: "Deep Context", desc: "No repetitive explanations", gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" },
                                ].map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + idx * 0.1 }}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            className="p-8 md:p-12 rounded-[2rem] border glass transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center md:items-start text-center md:text-left"
                                            style={{ borderColor: 'var(--background-tertiary)', padding: '20px' }}
                                        >
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                                                style={{ background: item.gradient }}
                                            >
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h6 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2" style={{ color: 'var(--foreground)' }}>{item.title}</h6>
                                            <p className="text-sm sm:text-base" style={{ color: 'var(--foreground-secondary)' }}>{item.desc}</p>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="w-full pt-12 flex justify-center"
                        style={{ padding: '16px' }}
                    >
                        <Link href="/form/profession" className="w-full flex justify-center">
                            <Button
                                size="lg"
                                className="w-full md:w-auto min-w-[280px] text-xl h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                style={{ background: 'var(--gradient-hero)' }}
                            >
                                Start Setup <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
