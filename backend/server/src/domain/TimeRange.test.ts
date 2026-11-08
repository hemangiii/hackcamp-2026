import { describe, expect, it } from 'vitest';
import { TimeRange } from './TimeRange.js';

const at = (iso: string) => new Date(iso);

describe('TimeRange', () => {
  describe('constructor', () => {
    it('accepts an end time after the start time', () => {
      const range = new TimeRange(at('2026-11-10T15:00:00Z'), at('2026-11-10T17:00:00Z'));
      expect(range.start.toISOString()).toBe('2026-11-10T15:00:00.000Z');
      expect(range.end.toISOString()).toBe('2026-11-10T17:00:00.000Z');
    });

    it('rejects an end time equal to the start time', () => {
      const t = at('2026-11-10T15:00:00Z');
      expect(() => new TimeRange(t, t)).toThrow('End time must be after start time');
    });

    it('rejects an end time before the start time', () => {
      expect(
        () => new TimeRange(at('2026-11-10T17:00:00Z'), at('2026-11-10T15:00:00Z')),
      ).toThrow('End time must be after start time');
    });

    it('rejects an invalid start date', () => {
      expect(() => new TimeRange(at('not a date'), at('2026-11-10T17:00:00Z'))).toThrow(
        'Invalid start time',
      );
    });

    it('rejects an invalid end date', () => {
      expect(() => new TimeRange(at('2026-11-10T15:00:00Z'), at('not a date'))).toThrow(
        'Invalid end time',
      );
    });
  });

  describe('of', () => {
    it('defaults to a two-hour activity when no end time is given', () => {
      const range = TimeRange.of('2026-11-10T15:00:00Z');
      expect(range.end.toISOString()).toBe('2026-11-10T17:00:00.000Z');
    });

    it('treats a null end time the same as a missing one', () => {
      const range = TimeRange.of('2026-11-10T15:00:00Z', null);
      expect(range.end.toISOString()).toBe('2026-11-10T17:00:00.000Z');
    });

    it('uses a custom default duration', () => {
      const range = TimeRange.of('2026-11-10T15:00:00Z', undefined, 1);
      expect(range.end.toISOString()).toBe('2026-11-10T16:00:00.000Z');
    });

    it('uses the given end time when provided', () => {
      const range = TimeRange.of('2026-11-10T15:00:00Z', '2026-11-10T15:30:00Z');
      expect(range.end.toISOString()).toBe('2026-11-10T15:30:00.000Z');
    });
  });

  describe('overlaps', () => {
    const base = TimeRange.of('2026-11-10T15:00:00Z', '2026-11-10T17:00:00Z');

    it('detects a partial overlap', () => {
      expect(base.overlaps(TimeRange.of('2026-11-10T16:00:00Z', '2026-11-10T18:00:00Z'))).toBe(true);
    });

    it('detects a range fully inside another', () => {
      expect(base.overlaps(TimeRange.of('2026-11-10T15:30:00Z', '2026-11-10T16:00:00Z'))).toBe(true);
    });

    it('does not count back-to-back ranges as overlapping', () => {
      expect(base.overlaps(TimeRange.of('2026-11-10T17:00:00Z', '2026-11-10T18:00:00Z'))).toBe(false);
    });

    it('returns false for separate ranges', () => {
      expect(base.overlaps(TimeRange.of('2026-11-11T15:00:00Z', '2026-11-11T17:00:00Z'))).toBe(false);
    });
  });

  it('serializes to ISO strings in UTC', () => {
    expect(TimeRange.of('2026-11-10T15:00:00Z').toJSON()).toEqual({
      start: '2026-11-10T15:00:00.000Z',
      end: '2026-11-10T17:00:00.000Z',
    });
  });
});
