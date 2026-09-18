import { useEffect, useRef, useState } from 'react';
import { MAX_WALLPAPER_CARDS, renderWallpaper } from './wallpaper';
import type { Vision } from './wallpaper';

export default function VisionWallpaper({ items }: { items: Vision[] }) {
  const [open, setOpen] = useState(false);
  return <section className="water-pause">
    <div className="eyebrow">Carry your vision</div><h3 className="serif">Your intention, on your lock screen.</h3>
    <p>Create your vision board above, then turn your chosen cards into a phone wallpaper with subtle COME HOME branding.</p>
    <button type="button" className="journey-button" disabled={!items.length} onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Close wallpaper maker' : 'Create my phone wallpaper'}</button>
    {!items.length && <p>Add at least one vision card to begin.</p>}
    {open && <WallpaperMaker key={items.map(item => item.id).join(',')} items={items} />}
  </section>;
}

function WallpaperMaker({ items }: { items: Vision[] }) {
  const [selected, setSelected] = useState(() => items.slice(0, MAX_WALLPAPER_CARDS).map(item => item.id));
  const [height, setHeight] = useState(2400);
  const [captions, setCaptions] = useState(true);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState<{ url: string; file: File } | null>(null);
  const previewUrl = useRef<string | null>(null);
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; if (previewUrl.current) URL.revokeObjectURL(previewUrl.current); }; }, []);
  function clearPreview() {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = null; setPreview(null); setStatus('');
  }
  async function create() {
    if (!consent || !selected.length || busy) return;
    clearPreview(); setBusy(true);
    try {
      const blob = await renderWallpaper(items.filter(item => selected.includes(item.id)), height, captions);
      if (!active.current) return;
      const url = URL.createObjectURL(blob); previewUrl.current = url;
      setPreview({ url, file: new File([blob], 'come-home-my-vision.png', { type: 'image/png' }) });
      setStatus('Preview ready. Check your images and text before saving.');
    } catch { if (active.current) setStatus('Could not create the wallpaper. Try fewer cards or replace an image that cannot be opened.'); }
    finally { if (active.current) setBusy(false); }
  }
  async function share() {
    if (!preview || sharing) return;
    if (!navigator.canShare?.({ files: [preview.file] })) { setStatus('File sharing is unavailable here. Use Download PNG or open the image below.'); return; }
    setSharing(true);
    try { await navigator.share({ files: [preview.file], title: 'My COME HOME vision' }); setStatus('Share sheet closed. Choose your saved image in your phone’s wallpaper settings.'); }
    catch (error) { setStatus(error instanceof DOMException && error.name === 'AbortError' ? 'Sharing cancelled. Your preview is still here.' : 'Sharing could not finish. You can download the PNG instead.'); }
    finally { if (active.current) setSharing(false); }
  }
  return <div>
    <p>Choose 1–6 cards. The top area stays clear for your clock. Images keep their full proportions; long captions may shorten in the preview.</p>
    <fieldset disabled={busy || sharing}><legend>Cards to include · {selected.length} of 6</legend>{items.map(item => <label className="water-check" key={item.id}><input type="checkbox" checked={selected.includes(item.id)} disabled={!selected.includes(item.id) && selected.length >= MAX_WALLPAPER_CARDS} onChange={e => { clearPreview(); setSelected(old => e.target.checked ? [...old, item.id] : old.filter(id => id !== item.id)); }} />{item.caption}</label>)}
    <label className="journey-label">Phone shape<select value={height} onChange={e => { clearPreview(); setHeight(Number(e.target.value)); }}><option value={2400}>Tall phone · 1080 × 2400</option><option value={1920}>Classic phone · 1080 × 1920</option></select></label>
    <label className="water-check"><input type="checkbox" checked={captions} onChange={e => { clearPreview(); setCaptions(e.target.checked); }} />Include captions on image cards (text-only cards keep their text)</label>
    <label className="water-check"><input type="checkbox" checked={consent} onChange={e => { clearPreview(); setConsent(e.target.checked); }} />I want to create an image from these cards with small COME HOME branding. I understand that anyone viewing my lock screen may see it.</label>
    <p className="journey-muted">The preview is made in your browser. Nothing is uploaded or shared automatically. You choose whether to save or share it. This does not change your phone settings.</p>
    <button type="button" className="journey-button" disabled={!consent || !selected.length || busy} onClick={() => void create()}>{busy ? 'Creating your wallpaper…' : 'Create private preview'}</button>
    </fieldset>
    <p role="status">{status}</p>
    {preview && <div className="wallpaper-result"><img className="wallpaper-preview" src={preview.url} alt="Preview of your selected vision cards with COME HOME branding" />
      <a className="journey-button" href={preview.url} download="come-home-my-vision.png">Download PNG</a>
      {typeof navigator.share === 'function' && <button type="button" className="journey-button" disabled={sharing} onClick={() => void share()}>Save or share with my phone</button>}
      <a className="journey-button" href={preview.url} target="_blank" rel="noreferrer">Open full-size image</a>
      <h4>Set it as your wallpaper</h4><p>Save the image first. If Download puts it in Files, open that image and use your phone’s Share menu to save it to Photos. You can also open the full-size image and use your browser’s image-saving options.</p><p>On iPhone, open Settings → Wallpaper → Add New Wallpaper → Photos. On Android, open the saved image in Photos or Gallery and look for “Use as” or “Set as wallpaper”; wording varies by phone.</p><p>Choose Lock Screen, Home Screen or both. Adjust the crop in your phone’s preview before confirming. The app cannot set it automatically.</p>
    </div>}
  </div>;
}
