import type { TimeRange } from './TimeRange.ts';
import type { User } from './User.ts';

export type ActivityStatus = 'upcoming' | 'ongoing' | 'ended' | 'deleted';

export class Activity {
  private deleted: boolean = false;

  constructor(
    public name: string,
    public time: TimeRange,
    public description: string,
    public user: User,
    public location: string, // Google Maps address, or the name of the location
    public link: string | null = null //Instagram post, website, etc
  ) {}

  statusAt(now: Date): ActivityStatus {
    if (this.deleted) { //the activity has been deleted
      return 'deleted';
    }
    if (now >= this.time.end) { //the end time has passed
      return 'ended';
    }
    if (now >= this.time.start) { //the start time has passed
      return 'ongoing';
    }
    return 'upcoming'; //the activity hasn't started
  }

  get status(): ActivityStatus {
    return this.statusAt(new Date());
  }

  get isDeleted(): boolean {
    return this.deleted;
  }

  modifyName(newName: string): void {
    const n = newName.trim();
    if (!n || n.length > 100) {
      throw new Error('Name must be 1-100 characters');
    }
    this.name = n;
  }

  modifyLink(newLink: string | null): void {
  if (newLink === null) {
    this.link = null;
    return;
  }

  try {
    const url = new URL(newLink.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') { //whether a valid link
      throw new Error();
    } 
    this.link = url.toString();
  } catch {
    throw new Error('Not a valid link');
  }
}

   modifyDescription(newDescription: string): void {
    if (newDescription.length > 500) {
      throw new Error('Description must be at most 500 characters');
    }
    this.description = newDescription;
  }

  modifyLocation(newLocation: string): void {
    const l = newLocation.trim();
    if (!l || l.length > 100) {
      throw new Error('Location must be 1-100 characters');
    }
    this.location = l;
  }

  modifyTime(newTime: TimeRange, now: Date): void {
    if (this.statusAt(now) !== 'upcoming') {
      throw new Error('Only upcoming activities can change time');
    }
    this.time = newTime;
  }

  delete(now: Date): void {
    if (this.isDeleted) {
      throw new Error('Already deleted');
    }
    this.deleted = true;
  }
}