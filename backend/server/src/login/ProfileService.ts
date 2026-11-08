import { AuthUser } from './AuthUser.js';
import { SchoolEmail } from './SchoolEmail.js';
import { User } from '../domain/User.js';
import { AppError } from '../domain/errors.js';
import type { UserRepository } from '../repositories/UserRepository.js';
import type { SchoolRepository } from '../repositories/SchoolRepository.js';
import type { Profile } from '../types.js';

export class ProfileService {
  constructor(private readonly users: UserRepository, private readonly schools: SchoolRepository) {}

  async get(auth: AuthUser): Promise<User | null> { return this.users.find(auth.id); }

  async save(auth: AuthUser, input: Profile): Promise<User> {
    let school;
    try { school = this.schools.mustFind(input.schoolId); } catch { throw new AppError('School not found', 400); }
    SchoolEmail.of(auth.email ?? '', school.emailDomain);
    const user = User.create(auth.id, input, auth.email!);
    await this.users.save(user);
    return user;
  }
}
