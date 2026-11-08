import type { User } from '../domain/User.js';

export interface UserRepository {
  exists(id: string): Promise<boolean>;
  save(user: User): Promise<void>;
}