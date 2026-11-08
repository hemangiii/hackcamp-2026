import type Database from 'better-sqlite3';
import type { JoinRequestRecord, JoinRequestRepository, JoinRequestStatus } from './JoinRequestRepository.js';

export class SqliteJoinRequestRepository implements JoinRequestRepository {
  constructor(private readonly db: Database.Database) {}

  async create(r: JoinRequestRecord) {
    this.db
      .prepare(
        `INSERT INTO join_requests(id,activity_id,user_id,status)
         VALUES(@id,@activityId,@userId,@status)`,
      )
      .run(r);

    return r;
  }

  async find(id: string) {
    const row = this.db
      .prepare(
        `SELECT id,activity_id AS activityId,user_id AS userId,status,created_at AS createdAt
         FROM join_requests
         WHERE id=?`,
      )
      .get(id) as JoinRequestRecord | undefined;

    return row ?? null;
  }

  async updateStatus(id: string, status: JoinRequestStatus) {
    this.db
      .prepare('UPDATE join_requests SET status=? WHERE id=?')
      .run(status, id);

    return this.find(id);
  }

  async delete(id: string, userId: string) {
    return this.db
      .prepare("DELETE FROM join_requests WHERE id = ? AND user_id = ? AND status = 'pending'")
      .run(id, userId).changes > 0;
  }

  async listForActivity(activityId: string) {
    return this.db
      .prepare(
        `SELECT id,activity_id AS activityId,user_id AS userId,status,created_at AS createdAt
         FROM join_requests
         WHERE activity_id=?
         ORDER BY created_at`,
      )
      .all(activityId) as JoinRequestRecord[];
  }

  async listForUser(userId: string) {
    return this.db
      .prepare(
        `SELECT id,activity_id AS activityId,user_id AS userId,status,created_at AS createdAt
         FROM join_requests WHERE user_id=? ORDER BY created_at DESC`,
      )
      .all(userId) as JoinRequestRecord[];
  }
}
