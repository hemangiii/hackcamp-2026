import { AuthUser } from './AuthUser.js';
import { SchoolEmail } from './SchoolEmail.js';
import { User } from '../domain/User.js';
import { ConflictError } from '../domain/errors.js';
import type { UserRepository } from '../repositories/UserRepository.js';
import type { SchoolRepository } from '../repositories/SchoolRepository.js';
import type { NewProfileInput } from '../types.js';