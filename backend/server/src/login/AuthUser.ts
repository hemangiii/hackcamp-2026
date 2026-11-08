export class AuthUser {
  constructor(
    readonly id: string,     
    readonly email: string | null,
    readonly emailVerified: boolean,
  ) {}

  canUseApp(): boolean {
    return this.email !== null && this.emailVerified && AuthUser.isAllowedSchoolEmail(this.email);
  }

  static isAllowedSchoolEmail(email: string): boolean {
    const domain = email.trim().toLowerCase().split('@').pop();
    return domain === 'student.ubc.ca' || domain === 'sfu.ca' || domain === 'uvic.ca';
  }
}
