// Email automation disabled by user request.
// This utility now does nothing when called.

interface EmailOptions {
    to: string;
    name: string;
    ticketCategory?: string;
}

export const sendConfirmationEmail = async ({ to, name, ticketCategory }: EmailOptions): Promise<void> => {
    console.log(`Email transmission skipped for ${to} (Feature Disabled)`);
    return Promise.resolve();
};
