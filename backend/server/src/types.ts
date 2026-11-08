export const SCHOOL_YEARS = ['first', 'second', 'third', 'fourth', 'fourth+', 'graduate'] as const;
export type SchoolYear = (typeof SCHOOL_YEARS)[number];

export const ACTIVITY_TYPES = ['study', 'food', 'sports', 'career', 'other'] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface Profile {
  name: string; 
  schoolYear: SchoolYear;
  major?: string | null;
  hobbies: string[];
  interestedTypes: ActivityType[]; //activity types
}