import type Database from 'better-sqlite3';
import type { JoinRequestRecord, JoinRequestRepository, JoinRequestStatus } from './JoinRequestRepository.js';
export class SqliteJoinRequestRepository implements JoinRequestRepository {
 constructor(private readonly db:Database.Database){}
 async create(r:JoinRequestRecord){this.db.prepare(`INSERT INTO join_requests(id,activity_id,user_id,status) VALUES(@id,@activityId,@userId,@status)`).run(r);return r;}
 async find(id:string){return (this.db.prepare(`SELECT id,activity_id AS activityId,user_id AS userId,status,created_at AS createdAt FROM join_requests WHERE id=?`).get(id) as JoinRequestRecord|undefined)??null;}
 async updateStatus(id:string,status:JoinRequestStatus){this.db.prepare('UPDATE join_requests SET status=? WHERE id=?').run(status,id);return this.find(id);}
 async listForActivity(activityId:string){return this.db.prepare(`SELECT id,activity_id AS activityId,user_id AS userId,status,created_at AS createdAt FROM join_requests WHERE activity_id=? ORDER BY created_at`).all(activityId) as JoinRequestRecord[];}
}
