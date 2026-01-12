'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RefundsPage() {
    const router = useRouter();
    return (
        <main className="relative min-h-screen overflow-hidden" style={{ padding: '48px 0' }}>
            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Content */}
            <div className="relative z-10 w-full" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ marginBottom: '48px' }}
                >
                    <h1 className="display text-center" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                        Cancellations & Refunds
                    </h1>
                    <p className="body text-center" style={{ color: 'var(--foreground-secondary)' }}>
                        Last updated: January 12, 2026
                    </p>
                </motion.div>

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass rounded-3xl"
                    style={{ padding: '48px 40px', marginBottom: '32px' }}
                >
                    <div style={{ color: 'var(--foreground-secondary)', lineHeight: '1.8' }}>
                        {/* Introduction */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                1. Overview
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                At BandhanNova AI Hub, we want you to be completely satisfied with our services. This policy outlines our cancellation and refund procedures for all subscription plans.
                            </p>
                            <p>
                                We offer a <strong>7-day money-back guarantee</strong> for first-time subscribers to ensure you can try our platform risk-free.
                            </p>
                        </section>

                        {/* Cancellation Policy */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                2. Cancellation Policy
                            </h2>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                2.1 How to Cancel
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                You can cancel your subscription at any time through:
                            </p>
                            <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
                                <li><strong>Dashboard:</strong> Go to Settings → Subscription → Cancel Plan</li>
                                <li><strong>Email:</strong> Send cancellation request to support@bandhannova.in</li>
                                <li><strong>Support Chat:</strong> Contact our support team directly</li>
                            </ul>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                2.2 Cancellation Timeline
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Immediate Effect:</strong> Your subscription will be canceled immediately, but you'll retain access until the end of your current billing period.
                            </p>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>No Auto-Renewal:</strong> Once canceled, your subscription will not renew automatically. You can continue using premium features until the paid period expires.
                            </p>
                            <p>
                                <strong>Reactivation:</strong> You can reactivate your subscription anytime before the billing period ends without losing your data.
                            </p>
                        </section>

                        {/* Refund Policy */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                3. Refund Policy
                            </h2>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                3.1 7-Day Money-Back Guarantee
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Eligibility:</strong> First-time subscribers to any paid plan
                            </p>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Timeframe:</strong> Request refund within 7 days of initial purchase
                            </p>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Full Refund:</strong> 100% of the subscription amount will be refunded
                            </p>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Processing Time:</strong> 5-10 business days to your original payment method
                            </p>
                            <p>
                                <strong>How to Request:</strong> Email refund@bandhannova.in with your transaction ID and reason for refund
                            </p>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                3.2 Pro-Rated Refunds
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                After the 7-day guarantee period, refunds are considered on a case-by-case basis:
                            </p>
                            <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
                                <li><strong>Service Outage:</strong> If our platform is unavailable for more than 48 consecutive hours</li>
                                <li><strong>Billing Errors:</strong> If you were charged incorrectly or multiple times</li>
                                <li><strong>Feature Removal:</strong> If a core feature you subscribed for is removed</li>
                                <li><strong>Technical Issues:</strong> If persistent technical problems prevent service usage</li>
                            </ul>
                            <p>
                                Pro-rated refunds are calculated based on unused days in your billing cycle.
                            </p>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                3.3 Non-Refundable Situations
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                Refunds will NOT be provided in the following cases:
                            </p>
                            <ul style={{ marginLeft: '24px' }}>
                                <li>After the 7-day guarantee period (except special circumstances)</li>
                                <li>If you violate our Terms of Service</li>
                                <li>If your account is suspended or terminated for policy violations</li>
                                <li>For partial months of annual subscriptions (after 7 days)</li>
                                <li>If you simply change your mind after using the service extensively</li>
                            </ul>
                        </section>

                        {/* Subscription Changes */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                4. Subscription Upgrades & Downgrades
                            </h2>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                4.1 Upgrading Your Plan
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Immediate Access:</strong> Upgraded features are available immediately
                            </p>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Pro-Rated Billing:</strong> You'll be charged the difference for the remaining billing period
                            </p>
                            <p>
                                <strong>Next Billing Cycle:</strong> Full price of new plan applies from next renewal
                            </p>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                4.2 Downgrading Your Plan
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>End of Billing Period:</strong> Downgrade takes effect at the end of current billing cycle
                            </p>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>Feature Access:</strong> You retain premium features until the paid period expires
                            </p>
                            <p>
                                <strong>No Partial Refunds:</strong> Downgrading does not trigger a refund for the current period
                            </p>
                        </section>

                        {/* Refund Process */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                5. Refund Request Process
                            </h2>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                5.1 How to Request a Refund
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                To request a refund:
                            </p>
                            <ol style={{ marginLeft: '24px', marginBottom: '12px' }}>
                                <li>Email <span style={{ color: 'var(--accent-cyan)' }}>refund@bandhannova.in</span></li>
                                <li>Include your account email and transaction ID</li>
                                <li>Provide a brief reason for the refund request</li>
                                <li>Our team will review within 24-48 hours</li>
                            </ol>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                5.2 Refund Processing Time
                            </h3>
                            <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
                                <li><strong>Approval:</strong> 24-48 hours for review</li>
                                <li><strong>Processing:</strong> 3-5 business days after approval</li>
                                <li><strong>Bank Credit:</strong> 5-10 business days depending on your bank</li>
                                <li><strong>International Payments:</strong> May take up to 15 business days</li>
                            </ul>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                5.3 Refund Methods
                            </h3>
                            <p>
                                Refunds are processed to your original payment method:
                            </p>
                            <ul style={{ marginLeft: '24px' }}>
                                <li>Credit/Debit Cards: Credited to the same card</li>
                                <li>UPI: Refunded to the same UPI ID</li>
                                <li>Net Banking: Credited to the source bank account</li>
                                <li>Wallets: Refunded to the same wallet</li>
                            </ul>
                        </section>

                        {/* Free Tier */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                6. Free Tier Accounts
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                <strong>No Charges:</strong> Free tier accounts have no subscription fees and therefore no refunds apply.
                            </p>
                            <p>
                                <strong>Account Deletion:</strong> You can delete your free account anytime from Settings. All data will be permanently deleted after 30 days.
                            </p>
                        </section>

                        {/* Special Circumstances */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                7. Special Circumstances
                            </h2>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                7.1 Duplicate Charges
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                If you were charged multiple times for the same subscription, we will immediately refund the duplicate charges.
                            </p>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                7.2 Unauthorized Charges
                            </h3>
                            <p style={{ marginBottom: '12px' }}>
                                If you notice unauthorized charges on your account, contact us immediately at <span style={{ color: 'var(--accent-cyan)' }}>security@bandhannova.in</span>. We will investigate and process refunds for verified unauthorized transactions.
                            </p>

                            <h3 className="h3" style={{ color: 'var(--foreground)', marginBottom: '12px', marginTop: '24px' }}>
                                7.3 Service Discontinuation
                            </h3>
                            <p>
                                If BandhanNova discontinues services, all active subscribers will receive a full pro-rated refund for unused time.
                            </p>
                        </section>

                        {/* Contact */}
                        <section>
                            <h2 className="h2" style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
                                8. Contact Us
                            </h2>
                            <p style={{ marginBottom: '12px' }}>
                                For cancellation or refund requests:
                            </p>
                            <p>
                                Refunds: <span style={{ color: 'var(--accent-cyan)' }}>refund@bandhannova.in</span><br />
                                Support: <span style={{ color: 'var(--accent-cyan)' }}>support@bandhannova.in</span><br />
                                Billing: <span style={{ color: 'var(--accent-cyan)' }}>billing@bandhannova.in</span><br />
                                Response Time: Within 24 hours
                            </p>
                        </section>
                    </div>
                </motion.div>

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-center"
                >
                    <button
                        onClick={() => router.back()}
                        className="text-sm font-medium transition-all duration-300 hover:text-white hover:scale-105 cursor-pointer"
                        style={{
                            color: 'var(--foreground-tertiary)',
                            display: 'inline-block',
                            background: 'transparent',
                            border: 'none',
                            padding: '8px 16px'
                        }}
                    >
                        ← Back
                    </button>
                </motion.div>
            </div>
        </main>
    );
}
