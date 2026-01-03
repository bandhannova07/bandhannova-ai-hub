// Payment Failed Email Template
import { APP_URL } from '../resend';

export function getPaymentFailedHTML(
    name: string,
    planName: string,
    amount: number,
    reason: string
): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center;">
                            <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                Payment Failed
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
                                We couldn't process your payment for the <strong style="color: #ef4444;">${planName} Plan</strong>.
                            </p>
                            
                            <!-- Payment Details -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; border-radius: 8px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <p style="margin: 0; color: #808080; font-size: 14px;">Plan</p>
                                                    <p style="margin: 4px 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">${planName} Plan</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 16px 0 8px;">
                                                    <p style="margin: 0; color: #808080; font-size: 14px;">Amount</p>
                                                    <p style="margin: 4px 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">₹${amount}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 16px 0 8px;">
                                                    <p style="margin: 0; color: #808080; font-size: 14px;">Reason</p>
                                                    <p style="margin: 4px 0 0; color: #ef4444; font-size: 16px; font-weight: 600;">${reason}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 20px; color: #b0b0b0; font-size: 16px; line-height: 1.6; text-align: center;">
                                Please check your payment method and try again.
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);">
                                            Retry Payment →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; color: #808080; font-size: 14px; line-height: 1.6; text-align: center;">
                                Need help? Contact our support team
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
                                This is an automated payment notification
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
