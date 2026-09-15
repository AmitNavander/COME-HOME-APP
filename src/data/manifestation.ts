import { supabase } from '../lib/supabase';

export type ManifestationProgram = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  duration_days: number | null;
  is_premium: boolean;
  sort: number;
};

export type ManifestationPractice = {
  id: string;
  program_id: string | null;
  day_number: number | null;
  title: string;
  practice_type: string;
  description: string | null;
  instructions: string | null;
  duration_sec: number | null;
  is_premium: boolean;
  sort: number;
};

export type ManifestationProgramWithPractices = ManifestationProgram & {
  practices: ManifestationPractice[];
};

const PROGRAM_COLUMNS =
  'id, slug, title, subtitle, description, duration_days, is_premium, sort';
const PRACTICE_COLUMNS =
  'id, program_id, day_number, title, practice_type, description, instructions, duration_sec, is_premium, sort';

/** Published catalogue content is intentionally readable by guests. Personal
 * manifestation records remain protected behind authenticated, owner-only RLS. */
export async function listManifestationPrograms(): Promise<ManifestationProgramWithPractices[]> {
  const { data: programs, error: programError } = await supabase
    .from('manifestation_programs')
    .select(PROGRAM_COLUMNS)
    .eq('is_published', true)
    .order('sort', { ascending: true });
  if (programError) throw programError;

  const ids = (programs ?? []).map((program) => program.id);
  if (ids.length === 0) return [];

  const { data: practices, error: practiceError } = await supabase
    .from('manifestation_practices')
    .select(PRACTICE_COLUMNS)
    .in('program_id', ids)
    .eq('is_published', true)
    .order('sort', { ascending: true });
  if (practiceError) throw practiceError;

  return (programs ?? []).map((program) => ({
    ...program,
    practices: (practices ?? []).filter((practice) => practice.program_id === program.id),
  }));
}
