// New Model Launch Email Template
import { APP_URL } from '../resend';

export function getNewModelLaunchHTML(
    name: string,
    modelName: string,
    modelDescription: string,
    features: string[],
    availableFor: string[]
): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New AI Model Launched</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <div style="font-size: 64px; margin-bottom: 16px;">🚀</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                                New AI Model Launched!
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #e0e0e0; font-size: 16px; line-height: 1.6; text-align: center;">
                                Hi <strong style="color: #ffffff;">${name}</strong>,
                            </p>
                            
                            <!-- Model Name -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="display: inline-block; padding: 20px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);">
                                            <p style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                                ${modelName}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0; color: #b0b0b0; font-size: 16px; line-height: 1.6; text-align: center;">
                                ${modelDescription}
                            </p>
                            
                            <!-- Features -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 16px; color: #ffffff; font-size: 18px; font-weight: 600; text-align: center;">
                                            ✨ Key Features
                                        </p>
                                        ${features.map(feature => `
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                                            <tr>
                                                <td style="padding: 12px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                                                    <p style="margin: 0; color: #e0e0e0; font-size: 15px;">
                                                        • ${feature}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                        `).join('')}
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Availability -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(74, 222, 128, 0.1); border-left: 4px solid #4ade80; border-radius: 8px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 12px; color: #4ade80; font-size: 16px; font-weight: 600;">
                                            Available For:
                                        </p>
                                        <p style="margin: 0; color: #b0b0b0; font-size: 14px;">
                                            ${availableFor.join(', ')} Plans
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${APP_URL}/chat/conversational" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                            Try ${modelName} Now →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; color: #808080; font-size: 14px; line-height: 1.6; text-align: center;">
                                Experience the next generation of AI technology!
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
                                Stay updated with the latest AI innovations
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
