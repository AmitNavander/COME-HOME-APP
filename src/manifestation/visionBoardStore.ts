import { get, set, update } from 'idb-keyval';
import { supabase } from '../lib/supabase';
import { getAuthUser } from '../lib/auth';
import { isAccountCloudEnabled } from '../lib/accountCloud';
import type { Vision } from './wallpaper';

const GUEST_KEY = 'come-home:vision-board:v1';
const accountKey = (userId: string) => `${GUEST_KEY}:${userId}`;

function currentKey(): string {
  const user = getAuthUser();
  return !user.isGuest && isAccountCloudEnabled(user.id) ? accountKey(user.id) : GUEST_KEY;
}

async function fetchCloud(userId: string): Promise<Vision[]> {
  const { data, error } = await supabase.from('vision_board_items').select('id,caption,image_path,created_at').eq('user_id', userId).order('created_at');
  if (error) throw error;
  const items = await Promise.all((data ?? []).map(async row => {
    if (!row.image_path) return { id: row.id as string, caption: row.caption as string };
    const { data: image, error: imageError } = await supabase.storage.from('vision-board').download(row.image_path as string);
    // Keep the previous complete cache if even one image cannot be fetched.
    if (imageError) throw imageError;
    if (!image) throw new Error('A vision-board image could not be downloaded.');
    return { id: row.id as string, caption: row.caption as string, image };
  }));
  await set(accountKey(userId), items);
  return items;
}

function extension(image: Blob): string {
  if (image.type === 'image/png') return 'png';
  if (image.type === 'image/webp') return 'webp';
  return 'jpg';
}

async function uploadItem(userId: string, item: Vision): Promise<void> {
  let imagePath: string | null = null;
  if (item.image) {
    imagePath = `${userId}/${item.id}.${extension(item.image)}`;
    const { error } = await supabase.storage.from('vision-board').upload(imagePath, item.image, { contentType: item.image.type, upsert: true });
    if (error) throw error;
  }
  const { error } = await supabase.from('vision_board_items').upsert({ id: item.id, user_id: userId, caption: item.caption, image_path: imagePath }, { onConflict: 'id' });
  if (error) {
    if (imagePath) await supabase.storage.from('vision-board').remove([imagePath]);
    throw error;
  }
}

export async function listVisionBoard(): Promise<Vision[]> {
  const user = getAuthUser();
  if (!user.isGuest && isAccountCloudEnabled(user.id)) {
    try { return await fetchCloud(user.id); }
    catch (error) {
      const cached = await get<Vision[]>(accountKey(user.id));
      if (cached !== undefined) return cached;
      throw error;
    }
  }
  return (await get<Vision[]>(GUEST_KEY)) ?? [];
}

export async function addVisionBoardItem(item: Vision): Promise<Vision[]> {
  const user = getAuthUser();
  if (!user.isGuest && isAccountCloudEnabled(user.id)) await uploadItem(user.id, item);
  await update<Vision[]>(currentKey(), current => [...(current ?? []), item]);
  return listVisionBoard();
}

export async function removeVisionBoardItem(id: string): Promise<Vision[]> {
  const user = getAuthUser();
  if (!user.isGuest && isAccountCloudEnabled(user.id)) {
    const { data, error: readError } = await supabase.from('vision_board_items').select('image_path').eq('user_id', user.id).eq('id', id).maybeSingle();
    if (readError) throw readError;
    const { error } = await supabase.from('vision_board_items').delete().eq('user_id', user.id).eq('id', id);
    if (error) throw error;
    if (data?.image_path) {
      const { error: storageError } = await supabase.storage.from('vision-board').remove([data.image_path as string]);
      if (storageError) throw storageError;
    }
  }
  await update<Vision[]>(currentKey(), current => (current ?? []).filter(item => item.id !== id));
  return listVisionBoard();
}

export async function syncVisionBoard(mode: 'cloud' | 'device'): Promise<void> {
  const user = getAuthUser();
  if (user.isGuest) return;
  if (mode === 'device') {
    const local = (await get<Vision[]>(GUEST_KEY)) ?? [];
    for (const item of local) await uploadItem(user.id, item);
  }
  await fetchCloud(user.id);
}
