export type Vision = { id: string; caption: string; image?: Blob };
export const WALLPAPER_WIDTH = 1080;
export const MAX_WALLPAPER_CARDS = 6;

export function wallpaperLayout(count: number, height: number) {
  if (count < 1 || count > MAX_WALLPAPER_CARDS || ![1920, 2400].includes(height)) throw new Error('Choose 1–6 cards and a supported phone size.');
  const columns = count <= 2 ? 1 : 2;
  const rows = Math.ceil(count / columns);
  const margin = 72, gap = 28, top = Math.round(height * .25), bottom = height - 240;
  const width = (WALLPAPER_WIDTH - margin * 2 - gap * (columns - 1)) / columns;
  const tileHeight = (bottom - top - gap * (rows - 1)) / rows;
  return Array.from({ length: count }, (_, i) => ({ x: margin + (i % columns) * (width + gap), y: top + Math.floor(i / columns) * (tileHeight + gap), width, height: tileHeight }));
}

/** Break long words too; append an ellipsis only when the card cannot fit all text. */
export function captionLines(text: string, maxWidth: number, maxLines: number, measure: (value: string) => number): string[] {
  let remaining = text.trim().replace(/\s+/g, ' ');
  const lines: string[] = [];
  while (remaining && lines.length < maxLines) {
    const chars = Array.from(remaining);
    let length = 0;
    while (length < chars.length && measure(chars.slice(0, length + 1).join('')) <= maxWidth) length++;
    length = Math.max(1, length);
    let line = chars.slice(0, length).join('');
    if (length < chars.length) {
      const space = line.lastIndexOf(' ');
      if (space > 0) { line = line.slice(0, space); length = Array.from(line).length; }
    }
    remaining = chars.slice(length).join('').trimStart();
    if (remaining && lines.length === maxLines - 1) {
      while (line && measure(line.trimEnd() + '…') > maxWidth) line = Array.from(line).slice(0, -1).join('');
      lines.push(line.trimEnd() + '…');
      break;
    }
    lines.push(line.trim());
  }
  return lines;
}

async function loadImage(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally { URL.revokeObjectURL(url); }
}

export async function renderWallpaper(cards: Vision[], height: number, showCaptions: boolean): Promise<Blob> {
  const layout = wallpaperLayout(cards.length, height);
  const canvas = document.createElement('canvas');
  canvas.width = WALLPAPER_WIDTH; canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not create the image.');
  const bg = ctx.createLinearGradient(0, 0, WALLPAPER_WIDTH, height);
  bg.addColorStop(0, '#0b1c29'); bg.addColorStop(.55, '#173d46'); bg.addColorStop(1, '#10252f');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, WALLPAPER_WIDTH, height);
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillStyle = '#ead2a3'; ctx.font = '48px Georgia, serif';
  ctx.fillText('The life I am creating', WALLPAPER_WIDTH / 2, height * .19);
  for (let i = 0; i < cards.length; i++) {
    const box = layout[i], card = cards[i];
    ctx.save();
    ctx.beginPath(); ctx.roundRect(box.x, box.y, box.width, box.height, 24); ctx.clip();
    ctx.fillStyle = '#203e48'; ctx.fillRect(box.x, box.y, box.width, box.height);
    const hasCaption = showCaptions || !card.image;
    const captionHeight = hasCaption && card.image ? Math.min(150, box.height * .36) : 0;
    if (card.image) {
      const img = await loadImage(card.image);
      // Contain, never crop away a face or the subject of a personal image.
      const availableHeight = box.height - captionHeight - 24;
      const scale = Math.min((box.width - 24) / img.naturalWidth, availableHeight / img.naturalHeight);
      const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
      ctx.drawImage(img, box.x + (box.width - w) / 2, box.y + 12 + (availableHeight - h) / 2, w, h);
    }
    if (hasCaption) {
      ctx.font = `${card.image ? 30 : 38}px sans-serif`; ctx.fillStyle = '#fff4dd';
      const lineHeight = card.image ? 39 : 50;
      const maxLines = card.image ? Math.max(1, Math.floor((captionHeight - 20) / lineHeight)) : Math.floor((box.height - 64) / lineHeight);
      const lines = captionLines(card.caption, box.width - 48, maxLines, text => ctx.measureText(text).width);
      const start = card.image ? box.y + box.height - captionHeight + 10 : box.y + (box.height - lines.length * lineHeight) / 2;
      lines.forEach((text, j) => ctx.fillText(text, box.x + box.width / 2, start + j * lineHeight));
    }
    ctx.restore();
  }
  ctx.fillStyle = '#ead2a3'; ctx.font = '24px sans-serif';
  ctx.fillText('COME HOME', WALLPAPER_WIDTH / 2, height - 172);
  ctx.fillStyle = '#bac8c6'; ctx.font = '20px sans-serif';
  ctx.fillText('Return to what matters.', WALLPAPER_WIDTH / 2, height - 132);
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not export the image.')), 'image/png'));
}
