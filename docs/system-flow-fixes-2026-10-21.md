# System and flow fixes — 21 October 2026

Resolved findings from the 20 October system audit:

- F01: account-scoped goal drafts restore after leaving and reloading; successful saves clear drafts.
- F02: Manifest goal, water, vision and foundation destinations participate in browser history.
- F03: You opens its overview; explicit Back to You targets its parent.
- F04: validated destination URLs restore durable screens. Reloading transient audio returns to Meditate without autoplay.
- F05: session completion awaits persistence, exposes retry errors and deduplicates retries. Programme progress updates only after its storage write succeeds. The two stores are not one atomic transaction; partial failure remains visible and retryable.
- F06: open-app reminder limits are explicit; calendar reminders are available in Preferences for closed-app delivery.
- F07: mini-player actions are separate native buttons with 44px targets.
- F08: rejected playback reports an error; failed media loads expose Retry Audio.
- F09: journal return label uses Home.

Validation: TypeScript passed; 53 tests passed; Vite/PWA production build passed. Local browser checks: goal Back/Forward/reload retains draft, goal Back reaches Manifest, Preferences reload restores its page, cross-tab You opens overview, stress starts its correct audio, keyboard Pause stays minimized, completion saves and returns to Meditate.

Existing bundle-size warning remains. Native device notifications, live account sync, every workshop step and all device/accessibility combinations remain outside this focused regression pass. This release does not certify the entire app.
