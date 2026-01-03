// Payment Success Email Template
import { APP_URL } from '../resend';

export function getPaymentSuccessHTML(
    name: string,
    planName: string,
    amount: number,
    expiresAt: string
): string {
    const planColors: Record<string, string> = {
        'pro': '#667eea',
        'ultra': '#f59e0b',
        'maxx': '#ef4444'
    };

    const planColor = planColors[planName.toLowerCase()] || '#667eea';
    const formattedDate = new Date(expiresAt).toLocaleDateString('en-IN', {
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
    <title>Payment Successful</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Success Icon -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${planColor} 0%, ${planColor}dd 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px ${planColor}40;">
                                <span style="font-size: 48px;">✓</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 0 40px 20px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                                Payment Successful! 🎉
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px 40px 40px;">
                            <p style="margin: 0 0 20px; color: #e0e0e0; font-size: 18px; line-height: 1.6; text-align: center;">
                                Hi <strong style="color: #ffffff;">${name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #b0b0b0; font-size: 16px; line-height: 1.6; text-align: center;">
                                Your payment has been processed successfully! Your <strong style="color: ${planColor};">${planName} Plan</strong> is now active.
                            </p>
                            
                            <!-- Payment Details -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <p style="margin: 0; color: #808080; font-size: 14px;">Plan</p>
                                                    <p style="margin: 4px 0 0; color: ${planColor}; font-size: 18px; font-weight: 600;">${planName} Plan</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 16px 0 8px;">
                                                    <p style="margin: 0; color: #808080; font-size: 14px;">Amount Paid</p>
                                                    <p style="margin: 4px 0 0; color: #ffffff; font-size: 18px; font-weight: 600;">₹${amount}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 16px 0 8px;">
                                                    <p style="margin: 0; color: #808080; font-size: 14px;">Valid Until</p>
                                                    <p style="margin: 4px 0 0; color: #ffffff; font-size: 18px; font-weight: 600;">${formattedDate}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, ${planColor} 0%, ${planColor}dd 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px ${planColor}40;">
                                            Start Using ${planName} Features →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; color: #808080; font-size: 14px; line-height: 1.6; text-align: center;">
                                Thank you for choosing BandhanNova AI Hub!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background: rgba(0, 0, 0, 0.3); text-align: center;">
                            <p style="margin: 0 0 10px; color: #808080; font-size: 14px;">
                                BandhanNova AI Hub
                            </p>
                            <p style="margin: 0; color: #606060; font-size: 12px;">
                                Questions? Reply to this email or visit our support center
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
