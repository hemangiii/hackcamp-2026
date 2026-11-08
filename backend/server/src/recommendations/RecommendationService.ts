import type { ActivityRepository } from '../repositories/ActivityRepository.js';
import type { UserRepository } from '../repositories/UserRepository.js';
import type { AuthUser } from '../login/AuthUser.js';

export class RecommendationService {
  constructor(
    private readonly activities: ActivityRepository,
    private readonly users: UserRepository,
  ) {}

  async forUser(auth: AuthUser) {
    const user = await this.users.find(auth.id);
    if (!user) {
      return [];
    }

    const all = await this.activities.list({ schoolId: user.schoolId });

    return all
      .sort(
        (a, b) =>
          Number(user.interestedTypes.includes(b.type)) -
          Number(user.interestedTypes.includes(a.type)),
      )
      .slice(0, 3);
  }
}