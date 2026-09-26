import { useEffect, useId, useRef, useState } from 'react';

type Page = 'privacy' | 'terms' | 'help';
const titles: Record<Page, string> = { privacy: 'Privacy Policy', terms: 'Terms of Use', help: 'Help & Support' };

/** Native modal preserves the underlying form and restores focus on close. */
export default function InformationLinks({ compact = false }: { compact?: boolean }) {
  const [page, setPage] = useState<Page | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  useEffect(() => {
    if (page) dialog.current?.showModal();
    else dialog.current?.close();
  }, [page]);
  return <>
    <nav aria-label="Help and information" className={compact ? 'information-links compact' : 'information-links'}>
      {(compact ? ['privacy', 'terms'] as const : ['help', 'privacy', 'terms'] as const).map(item => <button type="button" key={item} onClick={() => setPage(item)}>{titles[item]}</button>)}
    </nav>
    <dialog ref={dialog} className="information-dialog" aria-labelledby={headingId} onClose={() => setPage(null)} onCancel={() => setPage(null)}>
      <div className="information-toolbar"><span className="eyebrow">COME HOME</span><button type="button" autoFocus className="journey-button" onClick={() => setPage(null)} aria-label="Close information">Close ✕</button></div>
      <article className="information-body">
        <h1 id={headingId} className="serif">{page ? titles[page] : ''}</h1>
        <p className="journey-muted">Updated 26 September 2026 · Early access</p>
        {page === 'privacy' && <Privacy />}
        {page === 'terms' && <Terms />}
        {page === 'help' && <Help />}
      </article>
    </dialog>
  </>;
}

function Privacy() {
  return <>
    <p>COME HOME, a wellbeing project by Amit C. Navander, offers meditation, affirmations, journaling and manifestation practices. This notice explains data use in the current early-access app.</p>
    <h2>What you provide and why</h2>
    <ul>
      <li><strong>Account information:</strong> your name, email and account identifier support sign-in and your profile. Google sign-in may also provide a profile image. Authentication is handled by Supabase; we do not receive your Google password.</li>
      <li><strong>Practice information:</strong> journal entries, reflection answers, goals, workshop progress and saved practices help you resume your journey.</li>
      <li><strong>Vision-board content:</strong> images and captions you choose are used to create your board and downloadable wallpaper.</li>
      <li><strong>Preferences:</strong> your starting path, theme and reminder choices keep the experience consistent on your device.</li>
    </ul>
    <h2>On your device and in your account</h2>
    <p>Guest writing and practice data are stored in your browser. Clearing site data, using a different browser or losing the device can remove access to that copy. Someone using the same browser may be able to see locally saved entries.</p>
    <p>Signing in creates an account. Private account saving is a separate option under You → Privacy and account. When enabled, it stores your manifestation answers, journal, programme progress, saved practices and vision-board content with Supabase for use across devices. Check the sync status and last-saved time before relying on the account copy.</p>
    <p>Choosing “Use only this device” stops account syncing; it does not delete an existing cloud copy. Signing out or deleting your account does not automatically erase browser data or downloaded files.</p>
    <h2>Services involved</h2>
    <p>Vercel hosts the app. Supabase provides authentication, database and image storage. Google participates when you choose Google sign-in; fonts may also load from Google. These services receive the technical information needed to serve requests, such as IP addresses, browser information and request logs. Their own privacy terms also apply to their services.</p>
    <p>Cloud records are protected with account-based access controls and are not intended to be visible to other users. This is not end-to-end encrypted storage: authorised administrators and service providers may have technical access. Avoid entering passwords, identity documents or other information you do not need for your practice.</p>
    <h2>Your controls and retention</h2>
    <p>You can edit or delete journal entries and vision-board items using their controls. You → Privacy and account → Keep a copy of my journey exports data available on this device; save open drafts first and keep exports private.</p>
    <p>Local data remains until removed through the app or browser settings. Account data remains until removed using the available controls or account deletion. “Delete my account” requests permanent removal of your account and its app data; verify that the operation succeeds. Provider backups and operational logs follow provider retention schedules and may not disappear immediately.</p>
    <p>To remove the device copy, export anything you want to keep, then clear this app’s site data in your browser settings. This also removes local preferences and may sign you out.</p>
    <h2>Reminders and downloads</h2>
    <p>Reminders are optional. Calendar reminders include the practice text in the calendar you import them into, which may sync to your calendar provider or appear on a shared calendar. Wallpaper and data exports become files you control; sharing them may reveal your images, goals or writing.</p>
    <h2>Privacy questions</h2>
    <p>A dedicated privacy and support email is being prepared and is not yet available in the app. Account controls and the self-service guidance in Help are available now. This notice will be updated when the contact channel and any material data-handling changes are introduced.</p>
  </>;
}

function Terms() {
  return <>
    <p>These terms describe the current early-access COME HOME experience, a wellbeing project by Amit C. Navander.</p>
    <h2>Purpose of the practices</h2>
    <p>COME HOME supports reflection, relaxation, visualization and practical action. Spiritual language and water rituals are offered as personal practices, not established scientific mechanisms or promises of results. The app does not diagnose or treat illness and does not replace medical, psychological, financial or other professional advice.</p>
    <p>Results vary. No practice guarantees a particular health, relationship, income or manifestation outcome. You can pause, adapt or skip any exercise. Do not use practices requiring attention while driving or operating machinery.</p>
    <h2>Your account and content</h2>
    <p>Keep your account access private and use only accounts and images you are entitled to use. Do not upload unlawful content, infringe others’ rights, attempt to access another person’s information or disrupt the service.</p>
    <p>Your original writing and uploaded images remain yours. Storing them in COME HOME allows the app and its service providers to process them to provide the features you choose, including syncing and exporting. Downloaded files are your responsibility to store and share carefully.</p>
    <h2>Access and COME HOME+</h2>
    <p>Features marked COME HOME+ are premium journeys. During current early access they are open without charge. The app currently collects no subscription payment and starting a practice does not start a paid subscription.</p>
    <p>If paid plans are introduced, pricing, billing frequency, cancellation and refund terms will be shown before purchase. No payment obligation is created by simply using the current early-access app.</p>
    <h2>Availability and saved work</h2>
    <p>Early-access features may change and interruptions or errors can occur. Save your work, check cloud-sync status where enabled and keep an export of important entries. Browser-only data does not automatically follow you to a new device.</p>
    <h2>Leaving the service</h2>
    <p>You may stop using the app at any time. Account deletion and export are under You → Privacy and account. Deleting an account is separate from clearing browser data, removing calendar events and deleting downloaded files.</p>
    <h2>Updates and help</h2>
    <p>These terms will be updated as the service develops. Help & Support contains current troubleshooting guidance. A dedicated support contact will be published when available. Nothing here is intended to exclude rights that apply to you under applicable law.</p>
  </>;
}

const questions = [
  ['Where should I begin?', 'Choose Meditate for a session, breathing or rest. Choose Manifest for the foundation, goal plan or Water workshop. On Today, “Practise this affirmation” opens a short repetition practice. Change your starting path under You → Preferences.'],
  ['Google login opens an older app', 'Start a fresh login from the current COME HOME link you were given. If the address changes to an older deployment after login, that is a redirect configuration issue; clearing your journal or creating another account will not fix it. Save the destination address without any text after ? or # for reporting when support is available.'],
  ['I cannot log in or reset my password', 'Use the same sign-in method you used when creating your account. For email sign-in, choose Log in, enter your email and tap Forgot password. Check spam folders and use the newest reset email. Never share your password or the full reset link.'],
  ['Where is my saved work?', 'Guest work stays in the browser where you wrote it. For account saving, sign in and open You → Privacy and account. Check whether cloud saving is enabled and whether it reports a successful save. Save open drafts before changing screens.'],
  ['How do I continue on another device?', 'On the original device, sign in, enable cloud saving and wait for a successful save. On the other device, sign into the same account and turn on cloud saving to load the account copy. “Use this device’s current journey” replaces the account copy, so only choose it when that is what you intend.'],
  ['A save fails or the app looks out of date', 'Keep the page open and copy unsaved writing somewhere private. Check your connection, retry saving and export important work. Once saved, close and reopen the app or reload the page. Do not clear site data as a first troubleshooting step: that can erase device-only work.'],
  ['How do reminders work?', 'Open “Remind me” inside the practice, workshop, journal or vision board. Follow the instructions to add its reminder to your calendar. Calendar alerts depend on your calendar settings. The separate daily browser notification under You → Preferences needs permission and a running app/tab; it is not a guaranteed alert when the app is closed.'],
  ['Why can I not hear audio?', 'Tap Play to start audio, check media volume and the selected speaker or headphones, then check your connection. Some sessions use written on-screen guidance with music rather than a recorded voice; follow the label shown for the session.'],
  ['How do I use my vision board as wallpaper?', 'Open Manifest → My vision board, create your board and use its wallpaper export. Save the image, then choose it in your phone’s wallpaper settings. The web app does not automatically change your wallpaper.'],
  ['How do I export or delete my data?', 'Open You → Privacy and account. “Keep a copy of my journey” exports saved data from this browser. “Delete my account” removes the account and cloud data when successful. Browser copies, downloaded files and calendar events remain until you remove them separately.'],
  ['Do I have to pay for COME HOME+ now?', 'No. COME HOME+ is currently available during early access without charge. Opening a premium practice does not subscribe or charge you.'],
];

function Help() {
  return <>
    <p>Find a clear next step below. A dedicated support email is being prepared; direct-contact support is not available here yet.</p>
    {questions.map(([title, answer]) => <details className="journey-disclosure" key={title}><summary>{title}</summary><p>{answer}</p></details>)}
    <h2>If you need to report a problem</h2>
    <p>Keep a note of the screen, what you tapped, what happened, your device/browser and the approximate time. A screenshot can help; hide personal writing, email addresses and any login or reset codes. You can send these details once the dedicated support channel is available.</p>
    <p>COME HOME is not an emergency or crisis service. If you need urgent help, contact local emergency services or an appropriate healthcare professional.</p>
  </>;
}
