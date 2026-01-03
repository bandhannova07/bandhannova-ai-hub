'use client';

import { useState } from 'react';
import Script from 'next/script';
import { motion } from 'framer-motion';

interface RazorpayCheckoutProps {
    planType: 'pro' | 'enterprise';
    planName: string;
    billingPeriod: 'monthly' | 'yearly';
    amount: number;
    onSuccess?: () => void;
    onFailure?: (error: any) => void;
}

export function RazorpayCheckout({
    planType,
    planName,
    billingPeriod,
    amount,
    onSuccess,
    onFailure,
}: RazorpayCheckoutProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            // Create order
            const orderRes = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planType, billingPeriod }),
            });

            if (!orderRes.ok) {
                const errorData = await orderRes.json();
                throw new Error(errorData.error || 'Failed to create order');
            }

            const { orderId, amount: orderAmount, currency, keyId } = await orderRes.json();

            // Razorpay checkout options
            const options = {
                key: keyId,
                amount: orderAmount * 100,
                currency,
                name: 'BandhanNova AI Hub',
                description: `${planName} Plan - ${billingPeriod === 'monthly' ? 'Monthly' : 'Yearly'}`,
                order_id: orderId,
                handler: async function (response: any) {
                    try {
                        // Verify payment
                        const verifyRes = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(response),
                        });

                        if (verifyRes.ok) {
                            onSuccess?.();
                        } else {
                            const errorData = await verifyRes.json();
                            throw new Error(errorData.error || 'Payment verification failed');
                        }
                    } catch (err: any) {
                        setError(err.message);
                        onFailure?.(err);
                    } finally {
                        setLoading(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    },
                },
                prefill: {
                    name: '',
                    email: '',
                },
                theme: {
                    color: '#8b5cf6',
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.on('payment.failed', function (response: any) {
                setError(response.error.description || 'Payment failed');
                onFailure?.(response.error);
                setLoading(false);
            });

            razorpay.open();
        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'Payment initiation failed');
            onFailure?.(err);
            setLoading(false);
        }
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="w-full">
                <motion.button
                    onClick={handlePayment}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        background: loading
                            ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                            : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                        boxShadow: loading
                            ? 'none'
                            : '0 4px 20px rgba(139, 92, 246, 0.4)',
                    }}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        `Pay ₹${amount.toLocaleString('en-IN')}`
                    )}
                </motion.button>

                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-sm text-red-400 text-center"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        </>
    );
}
