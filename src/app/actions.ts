
"use server";

import { z } from "zod";
import { Resend } from "resend";
import { logger } from '@/lib/logger';

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres."),
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

const resend = new Resend(process.env.RESEND_API_KEY);

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
      message: "Error de validación.",
    };
  }

  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    return {
      success: false,
      message: "No se encontró CONTACT_EMAIL en .env. Por favor, configúralo.",
    };
  }

  try {
    // Sanity: log that we're about to send
    logger.info('Sending contact email to', to, 'using Resend API key present?', Boolean(process.env.RESEND_API_KEY));

    const resp: unknown = await resend.emails.send({
      from: "no-reply@resend.dev",
      to,
      subject: "Nuevo mensaje desde tu portafolio",
      text: `Nombre: ${validatedFields.data.name}\nEmail: ${validatedFields.data.email}\nMensaje: ${validatedFields.data.message}`,
    });

    logger.info('Resend response:', resp);

    // Safely extract an id/messageId from the response without using `any`
    let respId: string | null = null;
    if (resp && typeof resp === 'object') {
      const r = resp as Record<string, unknown>;
      if (typeof r.id === 'string') respId = r.id;
      else if (typeof r.messageId === 'string') respId = r.messageId;
    }

    return {
      success: true,
      message: respId ? `¡Mensaje enviado! id: ${respId}` : '¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.',
    };
  } catch (error) {
    // Log full error for debugging
    logger.error('Resend send error:', error instanceof Error ? error.message : error);
    return {
      success: false,
      message: `Algo salió mal al enviar el correo. ${(error instanceof Error) ? error.message : ''}`,
    };
  }
}
