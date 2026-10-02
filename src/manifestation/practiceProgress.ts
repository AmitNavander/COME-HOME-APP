import { waterPrefix, nextWaterDay } from './waterCourse';
import { nextFoundationDay } from './foundationDays';
import type { JourneyData } from './journeyStore';

export const RESUME_KEY = 'practice-resume:v1';
export const waterSteps = [
  ['reading', 'Read the teaching'], ['practice', 'Try the ceremony'],
  ['journal', 'Reflect and write'], ['action', 'Choose your action'],
  ['reminder', 'Carry the reminder with you'], ['evening', 'Return this evening'],
  ['milestone', 'Review your milestone'], ['evidence', 'Review and finish'],
] as const;
export type ResumePoint = { kind: 'foundation' | 'water'; day: number };
export function readResume(data: JourneyData): ResumePoint | null {
  try {
    const point = JSON.parse(data.answers[RESUME_KEY] || 'null');
    if (!point || !['foundation', 'water'].includes(point.kind) || !Number.isInteger(point.day) || point.day < 0 || point.day >= (point.kind === 'water' ? 21 : 7)) return null;
    const complete = point.kind === 'water' ? data.answers[waterPrefix(point.day) + 'completed'] === '1' : data.completed.includes(point.day);
    if (!complete) return point;
    const day = point.kind === 'water' ? nextWaterDay(data.answers) : nextFoundationDay(data.completed);
    return day === null ? null : { kind: point.kind, day };
  } catch { return null; }
}
export function nextWaterStep(values: Record<string, string>): number {
  const index = waterSteps.findIndex(([key]) => values[`check:${key}`] !== '1');
  return index < 0 ? waterSteps.length - 1 : index;
}
