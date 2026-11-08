export class AuthUser {
  constructor(
    readonly id: string,     
    readonly email: string | null,
    readonly emailVerified: boolean,
  ) {}

  canUseApp(): boolean {
    return this.email !== null && this.emailVerified;
  }
}