import { Validator } from './Validator.js';

export class SchoolEmail {
  private constructor(
    readonly value: string,
    readonly domain: string,
  ) {}

  static of(raw: string, schoolDomain: string): SchoolEmail {
    const value = Validator.schoolEmail(raw, schoolDomain);
    return new SchoolEmail(value, schoolDomain.toLowerCase());
  }
}