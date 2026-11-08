import { Activity } from '../domain/Activity.js';
import { TimeRange } from '../domain/TimeRange.js';
import type { ActivityInput } from '../types.js';

export function validateActivity(input: ActivityInput): ActivityInput {
  const range = TimeRange.of(input.startTime, input.endTime);

  if (!input.name.trim() || input.name.length > 100) {
    throw new Error('Name must be 1-100 characters');
  }
  if (!input.location.trim() || input.location.length > 200) {
    throw new Error('Location is required');
  }
  if (input.description.length > 500) {
    throw new Error('Description must be at most 500 characters');
  }

  if (input.link) {
    new Activity(
      input.name,
      range,
      input.description,
      undefined as never,
      input.location,
      input.link,
    );
  }

  return {
    ...input,
    name: input.name.trim(),
    location: input.location.trim(),
    startTime: range.start.toISOString(),
    endTime: range.end.toISOString(),
  };
}