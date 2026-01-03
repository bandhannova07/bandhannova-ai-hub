// Razorpay Client Configuration
// Handles Razorpay instance and plan pricing

import Razorpay from 'razorpay';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Plan pricing in INR
export const PLAN_PRICES = {
    pro: {
        monthly: 499, // ₹499/month
        yearly: 4999, // ₹4999/year (save ₹989)
    },
    enterprise: {
        monthly: 1499, // ₹1499/month
        yearly: 14999, // ₹14999/year (save ₹2989)
    },
};

// Plan features for reference
export const PLAN_FEATURES = {
    free: {
        name: 'Free',
        features: ['Basic AI access', '10 messages/day', 'Community support'],
    },
    pro: {
        name: 'Pro',
        features: ['Unlimited messages', 'All AI agents', 'Priority support', 'Advanced features'],
    },
    enterprise: {
        name: 'Enterprise',
        features: ['Everything in Pro', 'Custom AI training', 'Dedicated support', 'API access', 'White-label option'],
    },
};
