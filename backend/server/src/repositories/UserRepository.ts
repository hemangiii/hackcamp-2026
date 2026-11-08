import type { User } from '../domain/User.js';

export interface UserRepository {
  exists(id: string): Promise<boolean>;
  find(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
