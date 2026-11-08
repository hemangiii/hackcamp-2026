import { sampleApi } from './sampleData';

export const ACTIVITY_TYPES = ['study', 'food', 'sports', 'career', 'other'] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type Profile = {
  schoolId: number;
  name: string;
  schoolYear: 'first' | 'second' | 'third' | 'fourth' | 'fourth+' | 'graduate';
  major: string | null;
  hobbies: string[];
  interestedTypes: ActivityType[];
};

/** Mirrors ActivityRecord in backend/server/src/repositories/ActivityRepository.ts */
export type Activity = {
  id: string;
  creatorId: string;
  schoolId: number;
  name: string;
  description: string;
  type: ActivityType;
  location: string;
  startTime: string;
  endTime: string;
  link: string | null;
};

/** Mirrors JoinRequestRecord in backend/server/src/repositories/JoinRequestRepository.ts */
export type JoinRequest = {
  id: string;
  activityId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
};

/** Mirrors ActivityInput in backend/server/src/types.ts */
export type ActivityInput = Omit<Activity, 'id' | 'creatorId' | 'schoolId'>;

export type ActivityFilters = { type?: ActivityType; location?: string; startTime?: string; endTime?: string };

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(import.meta.env.VITE_AUTH_TOKEN ? { Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}` } : {}),
      ...init?.headers,
    },
  });
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? `Request failed (${response.status})`);
  return body.data as T;
}

const query = (filters: ActivityFilters) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value);
  const s = params.toString();
  return s ? `?${s}` : '';
};

const liveApi = {
  getProfile: () => request<Profile | null>('/api/profile'),
  saveProfile: (profile: Profile) => request<Profile>('/api/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  listActivities: (filters: ActivityFilters = {}) => request<Activity[]>(`/api/activities${query(filters)}`),
  getRecommendations: () => request<Activity[]>('/api/recommendations'),
  createActivity: (input: ActivityInput) =>
    request<Activity>('/api/activities', { method: 'POST', body: JSON.stringify(input) }),
  requestToJoin: (activityId: string) =>
    request<JoinRequest>(`/api/join-requests/${encodeURIComponent(activityId)}/join`, { method: 'POST' }),
};

export type Api = typeof liveApi;

/**
 * Set VITE_USE_SAMPLE_DATA=true to click through the UI without a running
 * backend or Auth0 token. Nothing is sent over the network in that mode.
 */
export const usingSampleData = import.meta.env.VITE_USE_SAMPLE_DATA === 'true';
export const api: Api = usingSampleData ? sampleApi : liveApi;
