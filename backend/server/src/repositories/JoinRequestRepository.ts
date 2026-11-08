export type JoinRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface JoinRequestRecord {
  id: string;
  activityId: string;
  userId: string;
  status: JoinRequestStatus;
  createdAt: string;
}

export interface JoinRequestRepository {
  create(r: JoinRequestRecord): Promise<JoinRequestRecord>;
  find(id: string): Promise<JoinRequestRecord | null>;
  updateStatus(id: string, status: JoinRequestStatus): Promise<JoinRequestRecord | null>;
  listForActivity(activityId: string): Promise<JoinRequestRecord[]>;
  listForUser(userId: string): Promise<JoinRequestRecord[]>;
}
