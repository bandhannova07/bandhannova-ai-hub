// Discount Offer Email Template
import { APP_URL } from '../resend';

export function getDiscountOfferHTML(
    name: string,
    discountPercent: number,
    planName: string,
    originalPrice: number,
    discountedPrice: number,
    validUntil: string,
    couponCode: string
): string {
    const savings = originalPrice - discountedPrice;
    const formattedDate = new Date(validUntil).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Special Discount Offer</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Discount Badge -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <div style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50px; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);">
                                <p style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                                    ${discountPercent}% OFF
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 20px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                                🎉 Limited Time Offer!
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px 40px 40px;">
                            <p style="margin: 0 0 20px; color: #e0e0e0; font-size: 16px; line-height: 1.6; text-align: center;">
                                Hi <strong style="color: #ffffff;">${name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #b0b0b0; font-size: 16px; line-height: 1.6; text-align: center;">
                                Get <strong style="color: #f59e0b;">${discountPercent}% OFF</strong> on the <strong style="color: #667eea;">${planName} Plan</strong>! Limited time only.
                            </p>
                            
                            <!-- Pricing -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="display: inline-block; padding: 32px 48px; background: rgba(245, 158, 11, 0.1); border: 2px solid #f59e0b; border-radius: 12px;">
                                            <p style="margin: 0 0 8px; color: #808080; font-size: 14px; text-decoration: line-through;">₹${originalPrice}</p>
                                            <p style="margin: 0; color: #f59e0b; font-size: 48px; font-weight: 700; line-height: 1;">
                                                ₹${discountedPrice}
                                            </p>
                                            <p style="margin: 8px 0 0; color: #4ade80; font-size: 16px; font-weight: 600;">
                                                Save ₹${savings}!
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Coupon Code -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(102, 126, 234, 0.1); border-radius: 12px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 24px; text-align: center;">
                                        <p style="margin: 0 0 12px; color: #808080; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                            Use Coupon Code
                                        </p>
                                        <div style="display: inline-block; padding: 16px 32px; background: rgba(102, 126, 234, 0.2); border: 2px dashed #667eea; border-radius: 8px;">
                                            <p style="margin: 0; color: #667eea; font-size: 24px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">
                                                ${couponCode}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 18px 48px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">
                                            Claim Offer Now →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Urgency -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; border-radius: 8px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <p style="margin: 0; color: #ef4444; font-size: 14px; font-weight: 600;">
                                            ⏰ Offer expires on ${formattedDate}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background: rgba(0, 0, 0, 0.3); text-align: center;">
                            <p style="margin: 0 0 10px; color: #808080; font-size: 14px;">
                                BandhanNova AI Hub
                            </p>
                            <p style="margin: 0; color: #606060; font-size: 12px;">
                                Limited time promotional offer
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}
