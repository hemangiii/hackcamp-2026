export class TimeRange {
  constructor(
    public start: Date,
    public end: Date,
  ) {
    if (isNaN(start.getTime())) throw new Error('Invalid start time');
    if (isNaN(end.getTime())) throw new Error('Invalid end time');
    if (end <= start) throw new Error('End time must be after start time');
  }

  static of(start: Date | string, end?: Date | string | null, defaultHours = 2): TimeRange { //the default period is two hours
    const s = new Date(start); //the start time given by the user
    const e = end ? new Date(end) : new Date(s.getTime() + defaultHours * 3600_000); //the default end time is two hours from the start time
    return new TimeRange(s, e);
  }

  overlaps(other: TimeRange): boolean {
    return this.start < other.end && other.start < this.end;
  }

  toJSON(): { start: string; end: string } {
    return {
      start: this.start.toISOString(),
      end: this.end.toISOString(),
    };
  }
}