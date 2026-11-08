import type Database from 'better-sqlite3';
import type { SchoolRepository, SchoolRecord } from './SchoolRepository.js';

export class SqliteSchoolRepository implements SchoolRepository {
  constructor(private readonly database: Database.Database) {}
  mustFind(id: number): SchoolRecord {
    const row = this.database.prepare('SELECT id, name, email_domain AS emailDomain FROM schools WHERE id = ?').get(id) as SchoolRecord | undefined;
    if (!row) throw new Error('School not found');
    return row;
  }
}
