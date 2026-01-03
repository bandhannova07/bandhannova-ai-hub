// Expiry Reminder Email Template
import { APP_URL } from '../resend';

export function getExpiryReminderHTML(
    name: string,
    planName: string,
    daysRemaining: number
): string {
    const urgencyColor = daysRemaining <= 1 ? '#ef4444' : daysRemaining <= 3 ? '#f59e0b' : '#667eea';
    const urgencyEmoji = daysRemaining <= 1 ? '🚨' : daysRemaining <= 3 ? '⚠️' : '📅';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plan Expiring Soon</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center;">
                            <div style="font-size: 64px; margin-bottom: 20px;">${urgencyEmoji}</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                Your ${planName} Plan Expires Soon
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px 40px 40px;">
                            <p style="margin: 0 0 20px; color: #e0e0e0; font-size: 16px; line-height: 1.6; text-align: center;">
                                Hi <strong style="color: #ffffff;">${name}</strong>,
                            </p>
                            
                            <!-- Days Remaining -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="display: inline-block; padding: 24px 48px; background: rgba(${urgencyColor === '#ef4444' ? '239, 68, 68' : urgencyColor === '#f59e0b' ? '245, 158, 11' : '102, 126, 234'}, 0.15); border: 2px solid ${urgencyColor}; border-radius: 12px;">
                                            <p style="margin: 0 0 8px; color: #808080; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Time Remaining</p>
                                            <p style="margin: 0; color: ${urgencyColor}; font-size: 48px; font-weight: 700; line-height: 1;">
                                                ${daysRemaining}
                                            </p>
                                            <p style="margin: 8px 0 0; color: #ffffff; font-size: 18px; font-weight: 600;">
                                                ${daysRemaining === 1 ? 'Day' : 'Days'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 20px; color: #b0b0b0; font-size: 16px; line-height: 1.6; text-align: center;">
                                Your <strong style="color: ${urgencyColor};">${planName} Plan</strong> will expire in <strong>${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}</strong>. Renew now to continue enjoying premium features!
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, ${urgencyColor} 0%, ${urgencyColor}dd 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px ${urgencyColor}40;">
                                            Renew ${planName} Plan →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; color: #808080; font-size: 14px; line-height: 1.6; text-align: center;">
                                After expiry, your account will be downgraded to the Free plan.
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
                                This is an automated reminder
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
