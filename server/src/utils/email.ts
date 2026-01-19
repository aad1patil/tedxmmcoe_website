import { google } from 'googleapis';

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const SENDER_EMAIL = 'tedxmmcoe@mmcoe.edu.in';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

interface EmailOptions {
    to: string;
    name: string;
    ticketCategory?: string;
}

export const sendConfirmationEmail = async ({ to, name, ticketCategory }: EmailOptions): Promise<void> => {
    try {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        const subject = '🎉 Your TEDx MMCOE Registration is Confirmed!';
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #000000; padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">
                <span style="color: #e62b1e;">TEDx</span>MMCOE
            </h1>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #333333; margin-top: 0;">Hello ${name}! 👋</h2>
            
            <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                Great news! Your registration for <strong>TEDxMMCOE</strong> has been <span style="color: #22c55e; font-weight: bold;">confirmed</span>!
            </p>
            
            <div style="background-color: #f8f8f8; border-left: 4px solid #e62b1e; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px 0; color: #333333;">📅 Event Details</h3>
                <p style="margin: 5px 0; color: #555555;"><strong>Date:</strong> January 31, 2025</p>
                <p style="margin: 5px 0; color: #555555;"><strong>Venue:</strong> IMERT Hall, MMCOE, Pune</p>
                <p style="margin: 5px 0; color: #555555;"><strong>Time:</strong> 10:00 AM onwards</p>
                ${ticketCategory ? `<p style="margin: 5px 0; color: #555555;"><strong>Ticket Type:</strong> ${ticketCategory}</p>` : ''}
            </div>
            
            <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                Please carry a valid ID proof (preferably your college ID card) for entry verification.
            </p>
            
            <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                We're excited to have you join us for an inspiring day of ideas worth spreading!
            </p>
            
            <p style="color: #555555; font-size: 16px; margin-top: 30px;">
                See you there! 🚀<br>
                <strong>Team TEDxMMCOE</strong>
            </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #333333; padding: 20px; text-align: center;">
            <p style="margin: 0; color: #999999; font-size: 12px;">
                This is an automated email. Please do not reply directly to this email.
            </p>
            <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                © 2025 TEDxMMCOE. This independent TEDx event is operated under license from TED.
            </p>
        </div>
    </div>
</body>
</html>
        `;

        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `From: "TEDx MMCOE" <${SENDER_EMAIL}>`,
            `To: ${to}`,
            `Content-Type: text/html; charset=utf-8`,
            `Mime-Version: 1.0`,
            `Subject: ${utf8Subject}`,
            '',
            htmlContent,
        ];
        const message = messageParts.join('\n');

        // The body needs to be base64url encoded.
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log(`Email successfully sent to ${to} via Gmail API`);
    } catch (error: any) {
        console.error('Gmail API Send Error:', error.response?.data || error.message);
        throw error;
    }
};
