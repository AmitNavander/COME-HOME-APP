# COME HOME 2.0 — development checkpoint

Source reference: recovered `come-home-2-portable-prototype.zip`, September 13, 2026.

The approved primary navigation is Today / Manifest / Meditate / Journal / You.
This checkpoint implements that structure using the existing React app and calm visual identity.
Support and Sleep remain accessible from Today. Existing programme access remains in You.

## Implemented in this checkpoint

- Today journey with working links to breathing, Manifest, meditation library and journal.
- Dedicated Manifest workspace, editable intention and motivation, explicitly device-local storage.
- Seven written reflection steps based on Vision / Why / Feel / See / Align / Act / Notice.
- Saved drafts and completion counts (no fabricated progress).
- Existing Supabase-backed foundation practice collection remains available separately.
- 21-day Water written journey adapted from Amit's supplied manuscript; earlier prototype workbook preserved separately.
- Existing Journal and Profile are reused; no existing user records are migrated or deleted.

## Still required — do not advertise as complete

- Editorial approval of the new seven-day development curriculum and guided media.
- Editorial approval of the condensed Water app adaptation and guided audio production.
- Owner-scoped cloud persistence for the device-local vision board.
- Server-verified subscriptions, entitlements, protected media and real checkout.
- Personalized onboarding connected to Today recommendations.
- End-to-end browser and authenticated-account tests; production deployment verification.

The original prototype's hardcoded progress, local premium toggle and simulated checkout were not ported.
This checkpoint is not the completed product or a production-ready release.

## Verification

- Vite production build and TypeScript check pass.
- Live browser verification reaches Vercel authentication; in-app verification remains blocked.
- No main-branch edits or production promotion requested or performed.

## Seven-day written journey update

Each foundation day now has a teaching, three-step practice, affirmation,
reflection, practical action and evening integration. New wording is explicitly
labelled development content for review, not previously approved course text.
Day drafts and completions preserve existing device-local reflections.
Today identifies the next unfinished day; completed weeks offer revisiting.
Content completeness, resume selection and storage-failure behaviour have automated tests.

## Water workbook checkpoint — September 17, 2026

Added 21 day-specific journal screens with exact shared workbook prompts and
Clarity / Self-Trust / Gratitude / Alignment scales from
Manifesting_Through_Water_Premium_Deck.pptx (June 20, 2026).
Records are device-local and use water-prefixed keys, preserving foundation records.
The counter measures journal days recorded, never course completion.

Content blocker: the read Premium Deck and 21 Day Course deck contain outlines,
not full daily teachings or ceremony scripts. Their day titles/order also differ
from the approved prototype. Existing prototype sequence is retained until the
final curriculum is supplied. No bonus modules were imported.
Full lessons and paid enrollment remain unavailable and explicitly labelled.

## Functional preview update — September 17, 2026

- Vision board supports intentions, optional JPG/PNG/WebP images (up to 5 MB),
  persistent IndexedDB storage, save errors, and confirmed card removal.
- You displays actual foundation completion and Water journal record counts.
- Entry screen explicitly offers Explore as guest.
- Personal preview data stays in the current browser; this is not account sync.

## Supplied Water curriculum integration — September 17, 2026

Supersedes the content blocker above: Amit supplied a complete 21-day manuscript
in chat. The app now uses its day titles and sequence across The Clear Lake,
The Flowing River and The Ocean. Each day includes all eight section types.
The app copy is explicitly a condensed, safety-edited adaptation for review,
not a verbatim edition or a claim of editorial approval.

Spiritual imagery is framed as symbolism, not established claims of molecular
memory, DNA reprogramming, trauma treatment or guaranteed wealth. Practices use
optional ordinary sipping, normal breathing, clean food-safe vessels and plain
water. Replaced forced drinking, rapid breathing, essential-oil immersion,
burning/flushing paper, forced forgiveness and impulsive spending/investment
challenges with gentle, bounded alternatives. No audio or clinical efficacy is claimed.

New responses use water-course:v2 keys. Earlier water keys remain unchanged and
are accessible under Earlier prototype journals with their original day names.
Draft saving, explicit completion, undoing completion, next unfinished day and
a Day 21 90-day planning field are implemented. Completion records participation.
The app's You screen shows actual Water completion separately from old records.

Validation: build and TypeScript pass; content coverage and preservation/resume
tests added. Live interaction testing remains blocked by browser access.

## Self-guided written workshop expansion

Supersedes the condensed presentation: all 21 days now include preparation,
three additional teaching paragraphs, four sequential practice instructions,
day-specific writing guidance, concrete action instructions and an evening
review. Each daily page can be followed independently without audio or a
facilitator. Timing is a flexible estimate, not a validated session duration.

Added explicit reading pauses, clean-water closing instructions, practice-note
fields, intermediate save buttons and a persisted optional five-part checklist.
Existing reflections, plans and completion records keep their keys. No records
are reset. An empty checklist does not block completion or accessible adaptation.
The new text is labelled an expanded adapted edition, not a verbatim reproduction
of the supplied manuscript. No unverified scientific or outcome claims restored.

Validation includes coverage for all 21 expanded guides plus preservation and
resume tests. Live interaction testing remains blocked by browser access.

## Meditation access and structured goal workflow — September 18, 2026

Repository comparison found no removed original audio assets or meditation data.
The redesigned Today screen had dropped direct meditation/programme entry points.
Restored these and added a searchable Meditate collection spanning the existing
session paths, released programmes, sleep items and feeling-support practices.
Coming-soon programmes are excluded from the available collection. Reused audio
is disclosed; these are not advertised as new or distinct narrated recordings.
Removed the existing misleading “music continues after voice” player label.
All 15 referenced local audio files exist; playback quality is not verified.

Manifest now starts with Define → Prepare → Visualize → Act → Review. Users set
a measure, baseline, target and review date; prepare an obstacle response; rehearse
both progress and the work required; schedule an action; and record its result,
evidence, learning and next step. Goal achievement is explicitly self-reported.
Visualization is optional and cannot mark an action or goal achieved.

Goal-specific, date-specific practice records and review snapshots preserve
earlier work. Changing a goal archives its old plan and starts a new daily record.
History surfaces saved actions and rehearsals as well as reviews. Saving a review
again updates that goal/day rather than inflating its count. Today shows the next
unfinished workflow step. No new notifications, cloud sync or backend writes.

Build, TypeScript and nine tests pass, including resume, legacy intention recovery,
date/goal isolation and review requirements. Full live browser/audio verification
remains blocked. This is a functional development update, not a production-readiness
or guaranteed-results claim. Audio commissioning, cloud persistence and complete
device/account testing remain outstanding.

## Clear entry and plan boundaries — September 18, 2026

Replaced the meditation-only intake with Meditate / Manifest / Explore both.
The choice persists per auth user ID (guest separate) in this browser. Initial
routing waits for auth loading and takes returning users to their saved path.
Existing users see this new choice once. You offers Change my starting path.
This preference does not sync across devices; no auth/profile schema changed.
Today is now two separate path cards, and Meditate no longer embeds the
Manifestation promotional card ahead of its practices.

Free: current meditation/sleep/tools collection, seven-day manifestation
foundation, personal journal, saved practices and foundation progress.
COME HOME+ at paid launch: 21-day Water workshop, structured goal workflow,
vision board. These currently remain open as explicitly labelled free development
previews. Shared plan comparison appears in onboarding, You and Manifest.
No amount, subscription cadence, checkout or entitlement enforcement is claimed.
Secure billing and server-side content authorization are required before a paid
launch; frontend labels are not access control. Existing data remains available.

Validation: TypeScript, build and account-choice persistence/routing tests, plus
existing journey tests. Live authenticated/browser testing remains outstanding.

## Carry your vision — wallpaper export

Vision board now offers opt-in wallpaper creation from 1–6 selected cards. The
user explicitly consents before generation, previews the actual PNG, then chooses
download or native file sharing when supported. No wallpaper setting, background
uploads or automatic sharing. All rendering uses local browser canvas and blobs.

Tall (1080×2400) and classic (1080×1920) layouts reserve space for a clock and small
COME HOME branding. Images use contain scaling; captions are optional on image
cards, wrap at words, and visibly truncate if necessary. Text-only cards retain
their text. Changing selections/options invalidates the previous export; closing
releases blob URLs. Share cancellation is handled without claiming a saved image.
Included iPhone/Android instructions and file-download fallback. This feature is
part of the COME HOME+ free development preview.

Validation: build, TypeScript, layout/bounds and caption tests; a six-card PNG was
rendered with a local canvas adapter for visual inspection. This does not verify
mobile share sheets, browser photo decoding or device wallpaper settings. Those
still require real-device testing.
API references: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
and https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
iPhone instructions: https://support.apple.com/en-us/102638
