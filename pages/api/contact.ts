import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const rateLimit = new Map<string, number>();
const RATE_WINDOW = 60 * 1000;
const MAX_REQ = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = rateLimit.get(ip);
  if (last && now - last < RATE_WINDOW) return true;
  rateLimit.set(ip, now);
  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientIp = req.headers["x-forwarded-for"]?.toString().split(",")[0] || "unknown";
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: "Too many requests. Please wait a minute." });
  }

  if (!resend) {
    return res.status(503).json({ error: "Email service not configured" });
  }

  try {
    const { name, email, whatsapp, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (message.length < 10 || message.length > 5000) {
      return res.status(400).json({ error: "Message must be between 10 and 5000 characters" });
    }

    const recipient = process.env.CONTACT_EMAIL || "andrewlumuli8@gmail.com";
    const bccList = process.env.BCC_EMAIL ? [process.env.BCC_EMAIL] : undefined;

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: [recipient],
      bcc: bccList,
      subject: `New Contact Form Message from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #c4935e;">New Message from Your Website</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          ${whatsapp ? `<p><strong>WhatsApp:</strong> ${whatsapp}</p>` : ""}
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0; line-height: 1.6;">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <p style="color: #888; font-size: 12px;">
            Sent from andrewlumuli.site contact form
          </p>
        </div>
      `,
      text: `From: ${name} (${email})\n${whatsapp ? `WhatsApp: ${whatsapp}\n` : ""}\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("Contact API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
