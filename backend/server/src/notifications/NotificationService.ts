import type { EmailService } from './EmailService.js';
import type { ActivityRecord } from '../repositories/ActivityRepository.js';
import type { JoinRequestRecord } from '../repositories/JoinRequestRepository.js';

type JoinRequestDecision = 'accepted' | 'rejected';

export class NotificationService {
  constructor(private readonly email: EmailService) {}

  async notify(to: string, subject: string, text: string): Promise<void> {
    await this.email.send({ to, subject, text });
  }

  async notifyActivityCreatorOfJoinRequest(
    creatorEmail: string,
    activity: ActivityRecord,
    request: JoinRequestRecord,
  ): Promise<void> {
    const subject = `New join request for ${activity.name}`;

    const body = [
      `A student has requested to join your activity: ${activity.name}.`,
      '',
      `Location:   ${activity.location}`,
      `Starts:     ${activity.startTime}`,
      `Ends:       ${activity.endTime}`,
      `Request ID: ${request.id}`,
      '',
      'Open OnCampus to review this request.',
    ].join('\n');

    await this.notify(creatorEmail, subject, body);
  }

  async notifyApplicantOfDecision(
    applicantEmail: string,
    activity: ActivityRecord,
    decision: JoinRequestDecision,
  ): Promise<void> {
    const isAccepted = decision === 'accepted';

    const subject = `Your request was ${decision}`;

    const nextStep = isAccepted
      ? 'You can now attend this activity.'
      : 'You can browse OnCampus for other activities.';

    const body = [
      `Your request to join "${activity.name}" was ${decision}.`,
      '',
      `Location: ${activity.location}`,
      `Starts:   ${activity.startTime}`,
      `Ends:     ${activity.endTime}`,
      '',
      nextStep,
    ].join('\n');

    await this.notify(applicantEmail, subject, body);
  }
}