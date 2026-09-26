# Account and practice verification — 26 September 2026

## Verified in code tests

- Independent device stores recover 650 journal entries, foundation answers, meditation programme progress and saved practices through the real account sync module with a simulated Supabase transport.
- Returning to device-only mode restores the guest journal captured before cloud loading.
- Failed vision image downloads preserve the previous complete cache. A new device without a cache reports a failure rather than an empty or incomplete board. Retrying after connectivity returns recovers the image.
- Existing tests cover daily affirmation rotation, foundation continuation, goal preparation/action progress, all 21 water-workshop readings, calendar reminder generation and wallpaper layout.

## Fixes from this pass

- Removed the 500-entry truncation when hydrating a journal from cloud or guest backup.
- Stopped caching incomplete vision-board downloads.
- Added a visible retry control when the complete board cannot load.

## Live verification boundary

The connected database tool rejected temporary test fixtures because it runs in a read-only transaction. No test accounts or fixture records were created. Prior read-only inspection confirmed RLS and ownership policies, but that is not an end-to-end access-control test.

The transport in the new automated tests is simulated. These tests do not prove live Supabase authentication, database isolation, image upload/download or delivery of recovery email.

## Remaining pilot gates

1. On two real devices, sign into the same approved test account; enable cloud saving; save a synthetic journal entry, foundation answer and image card on one, then load them on the other.
2. With a second approved test account, verify the first account's records and images cannot be read or changed.
3. Complete email confirmation and password recovery using a test inbox; verify both return to this deployment.
4. On iPhone and Android, complete a meditation and a written manifestation day, return the next day, and verify the expected continuation.
5. Verify audible playback, calendar notifications with the app closed and wallpaper export on each phone.
6. Publish the dedicated support email, then invite 5–10 pilot participants for seven days. No invitations have been sent.

Do not call the app fully production-verified until these gates pass. Do not use private customer writing as test data.
