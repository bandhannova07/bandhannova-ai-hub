// Email Sending Utility
import { getResendClient, EMAIL_FROM } from './resend';

export interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

/**
 * Send email using Resend
 */
export async function sendEmail({ to, subject, html }: SendEmailParams) {
    try {
        const resend = getResendClient();

        const { data, error } = await resend.emails.send({
            from: EMAIL_FROM,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('❌ Email send error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        console.log(`✅ Email sent to ${to}: ${subject}`);
        return { success: true, data };

    } catch (error: any) {
        console.error('❌ Email error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(email: string, name: string) {
    const { getWelcomeEmailHTML } = await import('./templates/welcome');

    return sendEmail({
        to: email,
        subject: 'Welcome to BandhanNova AI Hub! 🚀',
        html: getWelcomeEmailHTML(name),
    });
}

/**
 * Send payment success email
 */
export async function sendPaymentSuccessEmail(
    email: string,
    name: string,
    planName: string,
    amount: number,
    expiresAt: string
) {
    const { getPaymentSuccessHTML } = await import('./templates/payment-success');

    return sendEmail({
        to: email,
        subject: `Payment Successful - ${planName} Plan Activated! 🎉`,
        html: getPaymentSuccessHTML(name, planName, amount, expiresAt),
    });
}

/**
 * Send forgot password email
 */
export async function sendForgotPasswordEmail(
    email: string,
    name: string,
    resetToken: string
) {
    const { getForgotPasswordHTML } = await import('./templates/forgot-password');

    return sendEmail({
        to: email,
        subject: 'Reset Your Password - BandhanNova',
        html: getForgotPasswordHTML(name, resetToken),
    });
}

/**
 * Send expiry reminder email
 */
export async function sendExpiryReminderEmail(
    email: string,
    name: string,
    planName: string,
    daysRemaining: number
) {
    const { getExpiryReminderHTML } = await import('./templates/expiry-reminder');

    return sendEmail({
        to: email,
        subject: `Your ${planName} Plan Expires in ${daysRemaining} Days`,
        html: getExpiryReminderHTML(name, planName, daysRemaining),
    });
}

/**
 * Send plan expired email
 */
export async function sendPlanExpiredEmail(
    email: string,
    name: string,
    planName: string
) {
    const { getPlanExpiredHTML } = await import('./templates/plan-expired');

    return sendEmail({
        to: email,
        subject: `Your ${planName} Plan Has Expired`,
        html: getPlanExpiredHTML(name, planName),
    });
}
