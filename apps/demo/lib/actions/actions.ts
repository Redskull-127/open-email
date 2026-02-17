"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email: string, subject: string, body: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: "Open Email <onboarding@resend.dev>",
            to: email,
            subject: subject,
            html: body,
        });

        return { data, error };
    } catch (error) {
        console.error(error);
        return { error: "Failed to send email", data: null };
    }
}