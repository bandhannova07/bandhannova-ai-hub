// Welcome Email Template
import { APP_URL } from '../resend';

export function getWelcomeEmailHTML(name: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to BandhanNova</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                                🚀 Welcome to BandhanNova!
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #e0e0e0; font-size: 18px; line-height: 1.6;">
                                Hi <strong style="color: #ffffff;">${name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 20px; color: #b0b0b0; font-size: 16px; line-height: 1.6;">
                                Welcome to <strong style="color: #667eea;">BandhanNova AI Hub</strong> - your intelligent AI companion! 🎉
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #b0b0b0; font-size: 16px; line-height: 1.6;">
                                You're now on the <strong style="color: #4ade80;">Free Plan</strong> with access to:
                            </p>
                            
                            <!-- Features -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 12px; background: rgba(102, 126, 234, 0.1); border-radius: 8px; margin-bottom: 8px;">
                                        <p style="margin: 0; color: #e0e0e0; font-size: 15px;">
                                            ✨ <strong>20 messages/day</strong> with Conversational AI
                                        </p>
                                    </td>
                                </tr>
                                <tr><td style="height: 8px;"></td></tr>
                                <tr>
                                    <td style="padding: 12px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                                        <p style="margin: 0; color: #e0e0e0; font-size: 15px;">
                                            🎨 <strong>5 image generations/day</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr><td style="height: 8px;"></td></tr>
                                <tr>
                                    <td style="padding: 12px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                                        <p style="margin: 0; color: #e0e0e0; font-size: 15px;">
                                            🔍 <strong>5 research chats/day</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr><td style="height: 8px;"></td></tr>
                                <tr>
                                    <td style="padding: 12px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                                        <p style="margin: 0; color: #e0e0e0; font-size: 15px;">
                                            🤖 <strong>7 specialized AI agents</strong>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                            Get Started →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; color: #808080; font-size: 14px; line-height: 1.6; text-align: center;">
                                Need more? Upgrade to <strong style="color: #667eea;">Pro</strong>, <strong style="color: #f59e0b;">Ultra</strong>, or <strong style="color: #ef4444;">Maxx</strong> for unlimited access!
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
                                Powered by Advanced AI Technology
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
