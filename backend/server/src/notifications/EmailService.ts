export interface EmailMessage {
  to: string;

  subject: string;

  text: string;
}

export interface EmailService {
  /**
   * Send a single email.
   * @throws Implementations should throw if delivery fails.
   */
  send(message: EmailMessage): Promise<void>;
}

export class ConsoleEmailService implements EmailService {
  async send(message: EmailMessage): Promise<void> {
    const { to, subject, text } = message;

    console.log(
      [
        '[email] Simulated send',
        `  To:      ${to}`,
        `  Subject: ${subject}`,
        `  Body:    ${text}`,
      ].join('\n'),
    );
  }
}