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
