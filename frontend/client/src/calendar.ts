import type { Activity } from './api';

// Builds a standard .ics calendar file so students can add an activity to
// Google, Apple or Outlook calendar. Runs entirely in the browser.

const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Escape text per RFC 5545 (backslash, semicolon, comma, newline). */
const icsText = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

export function activityToIcs(activity: Activity, now = new Date()): string {
  const description = [activity.description, activity.link].filter(Boolean).join('\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//on campus//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${activity.id}@oncampus.app`,
    `DTSTAMP:${icsDate(now.toISOString())}`,
    `DTSTART:${icsDate(activity.startTime)}`,
    `DTEND:${icsDate(activity.endTime)}`,
    `SUMMARY:${icsText(activity.name)}`,
    `LOCATION:${icsText(activity.location)}`,
    ...(description ? [`DESCRIPTION:${icsText(description)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function downloadIcs(activity: Activity): void {
  const blob = new Blob([activityToIcs(activity)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${activity.name.replace(/[^\w-]+/g, '-').toLowerCase() || 'activity'}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
