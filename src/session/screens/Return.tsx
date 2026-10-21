import Button from '../../ui/Button';
import Reveal from '../../ui/Reveal';

/** §6.7 Return — the soft landing. */
export default function Return({ onExit, saving, error }: { onExit: () => void; saving: boolean; error: string }) {
  return (
    <div className="screen items-center justify-center text-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <Reveal delay={0.1}>
          <h1 className="serif" style={{ fontSize: 'var(--t-2xl)' }}>
            You came home to yourself.
          </h1>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="serif" style={{ color: 'var(--gold)', marginTop: 10, fontSize: 'var(--t-lg)' }}>
            That matters.
          </p>
        </Reveal>
        <Reveal delay={0.55}>
          <p style={{ color: 'var(--ink-muted)', marginTop: 12, fontSize: 'var(--t-md)' }}>
            Take what you need into the rest of your day.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-8">
          <Button onClick={onExit} disabled={saving}>{saving ? 'Saving…' : error ? 'Retry Save' : 'Finish Meditation'}</Button>
          {error && <p role="alert">{error}</p>}
        </Reveal>
      </div>
    </div>
  );
}
