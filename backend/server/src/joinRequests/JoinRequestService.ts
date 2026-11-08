import { randomUUID } from 'node:crypto';
import type { AuthUser } from '../login/AuthUser.js';
import type { ActivityRepository } from '../repositories/ActivityRepository.js';
import type { JoinRequestRepository, JoinRequestStatus } from '../repositories/JoinRequestRepository.js';
import type { UserRepository } from '../repositories/UserRepository.js';
import { AppError } from '../domain/errors.js';

export class JoinRequestService {
  constructor(
    private readonly requests: JoinRequestRepository,
    private readonly activities: ActivityRepository,
    private readonly users: UserRepository,
  ) {}

  async create(auth: AuthUser, activityId: string) {
    const activity = await this.activities.findById(activityId);
    if (!activity) {
      throw new AppError('Activity not found', 404);
    }
    if (activity.creatorId === auth.id) {
      throw new AppError('You cannot join your own activity', 400);
    }
    if (!(await this.users.find(auth.id))) {
      throw new AppError('Complete your profile first', 400);
    }

    try {
      return await this.requests.create({
        id: randomUUID(),
        activityId,
        userId: auth.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    } catch {
      throw new AppError('You already requested to join this activity', 409);
    }
  }

  async updateStatus(auth: AuthUser, id: string, status: JoinRequestStatus) {
    const request = await this.requests.find(id);
    if (!request) {
      throw new AppError('Join request not found', 404);
    }

    const activity = await this.activities.findById(request.activityId);
    if (!activity || activity.creatorId !== auth.id) {
      throw new AppError('Only the creator can review requests', 403);
    }

    return this.requests.updateStatus(id, status);
  }

  async list(auth: AuthUser, activityId: string) {
    const activity = await this.activities.findById(activityId);
      if (!activity || activity.creatorId !== auth.id) {
          throw new AppError('Only the creator can view requests', 403);
      }
      return await this.requests.listForActivity(activityId);
  }
}