import { useAccountCloud } from '../lib/accountCloud';

/** Device saves are synchronous; account sync must report its own real state. */
export default function SaveFeedback({ message }: { message: string }) {
  const cloud = useAccountCloud();
  if (!message) return null;
  return <div className="practice-feedback" role="status" aria-live="polite">
    <p>{message}</p>
    {cloud.enabled && !/could not|unable|before saving/i.test(message) && <small>{cloud.phase === 'saved' ? 'Account sync complete.' : cloud.phase === 'error' ? 'Account sync is unavailable. Your saved device copy is still here.' : 'Account sync is in progress.'}</small>}
  </div>;
}
