'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide splash after 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
                    }}
                >
                    {/* Animated Background Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    width: Math.random() * 4 + 2,
                                    height: Math.random() * 4 + 2,
                                    background: 'rgba(102, 126, 234, 0.3)',
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -30, 0],
                                    opacity: [0.3, 0.8, 0.3],
                                }}
                                transition={{
                                    duration: Math.random() * 3 + 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </div>

                    {/* Gradient Glow Effect */}
                    <motion.div
                        className="absolute"
                        style={{
                            width: '400px',
                            height: '400px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%)',
                            filter: 'blur(60px)',
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Logo Container with Animation */}
                    <motion.div
                        className="relative z-10"
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 1,
                            ease: [0.34, 1.56, 0.64, 1], // Bounce effect
                        }}
                    >
                        {/* Outer Glow Ring */}
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: 'conic-gradient(from 0deg, #667eea, #764ba2, #667eea)',
                                filter: 'blur(20px)',
                                opacity: 0.6,
                            }}
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />

                        {/* Logo */}
                        <motion.div
                            className="relative"
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Image
                                src="/favicon.ico"
                                alt="BandhanNova"
                                width={150}
                                height={150}
                                className="relative z-10"
                                style={{
                                    filter: 'drop-shadow(0 0 30px rgba(102, 126, 234, 0.8))',
                                }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Loading Text */}
                    <motion.div
                        className="absolute bottom-32"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <motion.h2
                            className="text-2xl font-bold gradient-text text-center mb-4"
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            BandhanNova AI Hub
                        </motion.h2>

                        {/* Loading Dots */}
                        <div className="flex justify-center gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-3 h-3 rounded-full"
                                    style={{ background: 'var(--gradient-hero)' }}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
