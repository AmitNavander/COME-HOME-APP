export const PLAN_KEY = 'manifest-plan:v1';
export type GoalPlan = { id: string; goal: string; why: string; measure: string; baseline: string; target: string; reviewDate: string; obstacle: string; response: string; support: string };
export const newPlan = (goal = '', why = ''): GoalPlan => ({ id: '', goal, why, measure: '', baseline: '', target: '', reviewDate: '', obstacle: '', response: '', support: '' });
export function readPlan(answers: Record<string, string>, goal = '', why = ''): GoalPlan {
  try {
    const raw = JSON.parse(answers[PLAN_KEY] || 'null');
    if (raw && Object.keys(newPlan()).every(key => typeof raw[key] === 'string')) return raw;
  } catch { /* Retain the original intention if no structured plan exists. */ }
  return newPlan(goal, why);
}
export function planReady(plan: GoalPlan) {
  return ['goal', 'why', 'measure', 'baseline', 'target', 'reviewDate'].every(key => plan[key as keyof GoalPlan].trim());
}
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export const dailyKey = (id: string, date: string) => `manifest-daily:v1:${id}:${date}`;
export type DailyPractice = { scene: string; visualized: boolean; action: string; when: string; status: string; evidence: string; actual: string; learning: string; next: string; outcome: string };
export const blankDay = (): DailyPractice => ({ scene: '', visualized: false, action: '', when: '', status: 'planned', evidence: '', actual: '', learning: '', next: '', outcome: 'ongoing' });
export function readDay(value?: string): DailyPractice {
  try {
    const raw = JSON.parse(value || 'null');
    if (raw && Object.entries(blankDay()).every(([key, v]) => typeof raw[key] === typeof v)) return raw;
  } catch { /* Invalid or absent entries start with an empty draft. */ }
  return blankDay();
}
export function nextStage(plan: GoalPlan, day: DailyPractice): number {
  if (!planReady(plan)) return 0;
  if (!plan.obstacle.trim() || !plan.response.trim()) return 1;
  if (!day.visualized) return 2;
  if (!day.action.trim() || !day.when || day.status === 'planned') return 3;
  return 4;
}
export function reviewReady(day: DailyPractice) {
  return !!(day.action.trim() && day.when && day.status !== 'planned' && day.actual.trim() && day.evidence.trim() && day.learning.trim() && day.next.trim());
}
export type GoalReview = { id: string; at: string; plan: GoalPlan; day: DailyPractice };
export function readReviews(answers: Record<string, string>): GoalReview[] {
  return Object.entries(answers).filter(([key]) => key.startsWith('manifest-review:v1:')).flatMap(([, value]) => {
    try { const raw = JSON.parse(value); return typeof raw.id === 'string' && typeof raw.at === 'string' && typeof raw.plan?.goal === 'string' && typeof raw.day?.actual === 'string' ? [raw as GoalReview] : []; } catch { return []; }
  }).sort((a, b) => b.at.localeCompare(a.at));
}
