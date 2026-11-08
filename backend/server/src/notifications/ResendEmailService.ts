import { Resend } from 'resend';
import type { EmailMessage, EmailService } from './EmailService.js';

/** Sends transactional email through Resend. */
export class ResendEmailService implements EmailService {
  private readonly client: Resend;

  constructor(private readonly from: string, apiKey = process.env.RESEND_API_KEY) {
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is required when Resend email is enabled');
    }

    this.client = new Resend(apiKey);
  }

  async send(message: EmailMessage): Promise<void> {
    const { error } = await this.client.emails.send({
      from: this.from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
    });

    if (error) {
      throw new Error(`Resend email failed: ${error.message}`);
    }
  }
}
