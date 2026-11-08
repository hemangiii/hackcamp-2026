import type { Activity, Api, JoinRequest, Profile } from './api';

// Fake data for clicking through the UI without the backend. Times are built
// relative to "now" so the cards always read as today / tomorrow.
const at = (dayOffset: number, hour: number, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const activities: Activity[] = [
  { id: 'a1', creatorId: 'u2', schoolId: 1, name: 'MATH 100 study session', description: 'Reviewing derivatives before the midterm.', type: 'study', location: 'Forestry Building', startTime: at(0, 15, 30), endTime: at(0, 17), link: null },
  { id: 'a2', creatorId: 'u3', schoolId: 1, name: 'Spikeball at the beach', description: 'Bring sunscreen, we have two sets.', type: 'sports', location: 'Wreck Beach', startTime: at(0, 17), endTime: at(0, 18), link: null },
  { id: 'a3', creatorId: 'u4', schoolId: 1, name: 'Free Rec Week Yoga', description: 'Beginner friendly, mats provided.', type: 'sports', location: 'Rec North Centre', startTime: at(1, 14), endTime: at(1, 15), link: null },
  { id: 'a4', creatorId: 'u5', schoolId: 1, name: 'Coffee after class', description: 'Anyone want to grab coffee and meet new people?', type: 'food', location: 'The Nest', startTime: at(1, 14), endTime: at(1, 15), link: null },
  { id: 'a5', creatorId: 'u6', schoolId: 1, name: 'Startup networking night', description: 'Looking for someone to go with.', type: 'career', location: 'Sauder', startTime: at(2, 18), endTime: at(2, 20), link: null },
];

let profile: Profile | null = {
  schoolId: 1, name: 'Hannah Wells', schoolYear: 'first', major: 'Music',
  hobbies: ['outdoors'], interestedTypes: ['food', 'sports'],
};

const delay = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 250));

export const sampleApi: Api = {
  getProfile: () => delay(profile),
  saveProfile: (p) => delay((profile = p)),
  listActivities: (filters = {}) =>
    delay(activities.filter((a) => !filters.type || a.type === filters.type)),
  getRecommendations: () =>
    delay(
      [...activities]
        .sort((a, b) => Number(profile?.interestedTypes.includes(b.type)) - Number(profile?.interestedTypes.includes(a.type)))
        .slice(0, 3),
    ),
  createActivity: (input) => {
    const created: Activity = { ...input, id: crypto.randomUUID(), creatorId: 'me', schoolId: profile?.schoolId ?? 1 };
    activities.push(created);
    return delay(created);
  },
  requestToJoin: (activityId) =>
    delay<JoinRequest>({ id: crypto.randomUUID(), activityId, userId: 'me', status: 'pending', createdAt: new Date().toISOString() }),
};
