import PracticeReminder from './PracticeReminder';
import { useEffect, useState } from 'react';
import VisionWallpaper from './VisionWallpaper';
import { addVisionBoardItem, listVisionBoard, removeVisionBoardItem } from './visionBoardStore';
import { useAccountCloud } from '../lib/accountCloud';
import type { Vision } from './wallpaper';

export default function VisionBoard() {
  const [items, setItems] = useState<Vision[]>([]);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const cloud = useAccountCloud();
  useEffect(() => {
    let active = true;
    listVisionBoard().then(value => { if (active) { setItems(value); setReady(true); } }).catch(() => { if (active) setStatus('Could not open your vision board. Try again.'); });
    return () => { active = false; };
  }, [cloud.enabled, cloud.updatedAt]);
  async function add() {
    if (!caption.trim() || busy || !ready) return;
    if (file && (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setStatus('Choose a JPG, PNG or WebP image smaller than 5 MB.'); return;
    }
    setBusy(true);
    try {
      const item: Vision = { id: crypto.randomUUID(), caption: caption.trim(), ...(file ? { image: file } : {}) };
      setItems(await addVisionBoardItem(item));
      setCaption(''); setFile(null); setInputKey(value => value + 1); setStatus(cloud.enabled ? 'Added to your private account.' : 'Added to your board on this device.');
    } catch { setStatus('Could not save. Your draft is still here; try a smaller image.'); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    setBusy(true);
    try {
      setItems(await removeVisionBoardItem(id)); setStatus('Card removed.');
    } catch { setStatus('Could not remove the card. Please try again.'); }
    finally { setBusy(false); }
  }
  return <section className="journey-card">
    <div className="eyebrow">My vision board</div><h2 className="serif">Make space for what matters.</h2>
    <p>Add an intention with an optional image. {cloud.enabled ? 'Your board is saved privately to your signed-in account.' : 'Until cloud saving is enabled, it stays in this browser and is visible to others using this browser profile.'}</p>
    <form onSubmit={e => { e.preventDefault(); void add(); }}>
      <label className="journey-label">Your vision or image caption<input required maxLength={300} value={caption} onChange={e => setCaption(e.target.value)} /></label>
      <label className="journey-label">Add an image (optional)<input key={inputKey} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0] || null)} /></label>
      <button className="journey-button" disabled={!ready || busy} type="submit">{busy ? 'Saving…' : 'Add to vision board'}</button>
    </form>
    <p role="status">{status}</p>
    {!items.length && ready && <p>Your first card can be a small intention for today.</p>}
    <div className="vision-grid">{items.map(item => <VisionCard key={item.id} item={item} busy={busy} onRemove={() => void remove(item.id)} />)}</div>
    <PracticeReminder title="Review my vision board" action="Look at my vision board, notice what still matters, update a card and choose one practical action. Refresh my wallpaper if useful." prompt="Revisit your vision board. What still matters, and what would you like to update?" location="Manifest → My vision board" label="Remind me to review my vision board" />
    <VisionWallpaper items={items} />
  </section>;
}

function VisionCard({ item, busy, onRemove }: { item: Vision; busy: boolean; onRemove: () => void }) {
  const [url, setUrl] = useState<string>();
  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    if (!item.image) return;
    const objectUrl = URL.createObjectURL(item.image); setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [item.image]);
  return <article className="vision-card">
    {url && <img src={url} alt={item.caption} loading="lazy" />}
    <p>{item.caption}</p>
    <button className="journey-button" disabled={busy} onClick={() => confirm ? onRemove() : setConfirm(true)}>{confirm ? 'Confirm removal' : 'Remove card'}</button>
    {confirm && <button className="journey-button" onClick={() => setConfirm(false)}>Keep card</button>}
  </article>;
}
