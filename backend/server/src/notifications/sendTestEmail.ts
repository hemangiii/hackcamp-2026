import 'dotenv/config';
import { ResendEmailService } from './ResendEmailService.js';

const recipient = process.argv[2];

if (!recipient) {
  console.error('Usage: npm run email:test -- you@example.com');
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM;

if (!apiKey || !from) {
  console.error('Missing RESEND_API_KEY or EMAIL_FROM in backend/server/.env');
  process.exit(1);
}

try {
  const email = new ResendEmailService(from, apiKey);
  await email.send({
    to: recipient,
    subject: 'OnCampus test email',
    text: 'This is a test email from the OnCampus backend. Resend is configured correctly.',
  });
  console.log(`Test email sent to ${recipient}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
