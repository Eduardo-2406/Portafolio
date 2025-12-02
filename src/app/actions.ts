/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CONTACT FORM SERVER ACTION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This file handles the contact form submission using Resend email service.
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Get a Resend API Key:
 *    - Go to https://resend.com and sign up (free tier available)
 *    - Create an API key in your dashboard
 *    - Copy the API key (starts with 're_')
 *
 * 2. Configure Environment Variables:
 *    - Create a .env.local file in the root directory
 *    - Add the following variables:
 *      RESEND_API_KEY=re_your_api_key_here
 *      CONTACT_EMAIL=your-email@example.com
 *
 * 3. For Production (Vercel):
 *    - Go to your Vercel project settings
 *    - Navigate to "Environment Variables"
 *    - Add both RESEND_API_KEY and CONTACT_EMAIL
 *    - Redeploy your project
 *
 * IMPORTANT:
 * - Replace CONTACT_EMAIL with YOUR email address where you want to receive messages
 * - The free tier of Resend allows 100 emails/day, 3,000/month
 * - Test the form after deployment to ensure it works
 */

"use server";

import { z } from "zod";
import { Resend } from "resend";
import { logger } from "@/lib/logger";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type ContactFormState = {
  success?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  message?: string;
};

// Initialize Resend with your API key from environment variables
// If API key is missing, resend will be null and we'll show a friendly error message
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function submitContactForm(
  prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation error.",
    };
  }

  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    return {
      success: false,
      message: "CONTACT_EMAIL not found in .env. Please configure it.",
    };
  }

  // Check if Resend is configured
  if (!resend) {
    return {
      success: false,
      message:
        "RESEND_API_KEY not found in .env. Please configure it to enable the contact form.",
    };
  }

  try {
    // Sanity: log that we're about to send
    logger.info(
      "Sending contact email to",
      to,
      "using Resend API key present?",
      Boolean(process.env.RESEND_API_KEY)
    );

    const resp: unknown = await resend.emails.send({
      from: "no-reply@resend.dev",
      to,
      subject: "New message from your portfolio",
      text: `Name: ${validatedFields.data.name}\nEmail: ${validatedFields.data.email}\nMessage: ${validatedFields.data.message}`,
    });

    logger.info("Resend response:", resp);

    // Safely extract an id/messageId from the response without using `any`
    let respId: string | null = null;
    if (resp && typeof resp === "object") {
      const r = resp as Record<string, unknown>;
      if (typeof r.id === "string") respId = r.id;
      else if (typeof r.messageId === "string") respId = r.messageId;
    }

    return {
      success: true,
      message: respId
        ? `Message sent! id: ${respId}`
        : "Thanks for your message! I will get back to you soon.",
    };
  } catch (error) {
    // Log full error for debugging
    logger.error(
      "Resend send error:",
      error instanceof Error ? error.message : error
    );
    return {
      success: false,
      message: `Something went wrong sending the email. ${
        error instanceof Error ? error.message : ""
      }`,
    };
  }
}
