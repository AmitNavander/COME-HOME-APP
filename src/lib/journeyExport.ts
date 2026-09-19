import { getMany } from 'idb-keyval';

// Explicit allowlist excludes authentication tokens and unrelated browser data.
const localKeys = ['come-home:manifest-journey:v1', 'come-home:programmes', 'come-home:favorites'];
const indexedKeys = ['come-home:journal', 'come-home:history', 'come-home:reflections', 'come-home:presence', 'come-home:vision-board:v1'];
async function serialise(value: unknown): Promise<unknown> {
  if (value instanceof Blob) {
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('An image could not be read.'));
      reader.readAsDataURL(value);
    });
    return { type: 'embedded-image', mime: value.type, data };
  }
  if (Array.isArray(value)) return Promise.all(value.map(serialise));
  if (value && typeof value === 'object') return Object.fromEntries(await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await serialise(item)])));
  return value;
}
export async function exportJourney(): Promise<string> {
  const local = Object.fromEntries(localKeys.map(key => [key, JSON.parse(localStorage.getItem(key) || 'null')]));
  const values = await getMany(indexedKeys);
  const indexed = Object.fromEntries(await Promise.all(indexedKeys.map(async (key, i) => [key, await serialise(values[i] ?? null)])));
  return JSON.stringify({ format: 'come-home-personal-export', version: 1, createdAt: new Date().toISOString(), local, indexed }, null, 2);
}
