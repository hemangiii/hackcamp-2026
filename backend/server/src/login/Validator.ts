export class Validator {
  static email(value: string) {
    const v = value.trim().toLowerCase();
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!pattern.test(v)) {
      throw new Error('Email format is invalid');
    }
    return v;
  }

  static schoolEmail(value: string, schoolDomain: string) {
    const v = Validator.email(value);
    const host = v.split('@')[1];
    const domain = schoolDomain.trim().toLowerCase();
    if (host !== domain) {
      throw new Error(`Please use your @${domain} email`);
    }
    return v;
  }
}