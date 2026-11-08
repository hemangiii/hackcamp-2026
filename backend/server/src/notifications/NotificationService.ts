import type { EmailService } from './EmailService.js';

export class NotificationService {
  constructor(private readonly email: EmailService) {}

  notify(to: string, subject: string, body: string) {
    return this.email.send(to, subject, body);
  }
}