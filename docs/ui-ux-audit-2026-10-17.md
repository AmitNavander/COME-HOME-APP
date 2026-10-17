# Come Home — guest UI/UX audit and Task 1 fixes

Reviewed 16–17 October 2026. Source: develop/manifestation-foundation at b4e3e92, which matches the live guest UI; main was an older version. Main is an ancestor, so retaining the current features permits a normal fast-forward release.

## Implemented

| Finding | Change |
|---|---|
| Home named Today in navigation and return links | Home throughout the entry and affirmation navigation |
| Home cards spaced 22px apart with inconsistent emphasis | 12px gaps, equal backgrounds, borders, 18px padding, 16px corners |
| Affirmation outline button versus gold meditation/Manifest buttons | All three use the same gold button style |
| Oversized and inconsistent button padding | Home buttons are 44px high, 14px text, 10px vertical / 16px horizontal padding |
| Meditation arrow differs from adjacent actions | Removed from Home Meditate button |
| Practise this affirmation label | Practice Affirmation, including after completion; completion remains a separate status |
| Fraunces headings and Inter controls conflict | One Inter font family with deliberate size and weight hierarchy |
| Affirmation subpage loses navigation selection | Home stays selected |
| Lazy tabs briefly show an empty screen | Visible loading status and shorter 200ms transition |
| Bottom navigation scrim obscures a large area | Reduced fade area and solid navigation background |
| Small profile switches and theme controls | At least 44px touch targets |
| Missing page headings on goal, Water, vision workspace | Added descriptive h1 headings |
| Feeling prompt repeated after declining the meditation check-in | Removed second prompt from completion screen |
| Inconsistent focus rings | Shared keyboard-visible focus styling |
| Disabled actions show a busy cursor even when unavailable | Not-allowed cursor |
| Windows build cannot disambiguate component/data filenames | Renamed components to WaterWorkshop.tsx and GoalPlan.tsx |

## Guest coverage

Walked signup entry and guest onboarding; Home; affirmation practice and theme selector; meditation library and check-in, audio practice, reflection and completion; Manifest overview, foundation day 1, goal plan, Water overview and day 1, vision board empty state; Journal overview and blank editor; You, preferences, plans, privacy/account entry; Help modal including Escape/focus restoration; Sanctuary empty state; Quiet Timer setup/start/pause/exit. Reviewed shared component source and reduced-motion rules.

## Remaining findings / boundaries

- Manifest exercise state is internal rather than represented in browser history. Browser Back may leave the whole tab rather than just the exercise. Needs a dedicated navigation/draft-preservation change and regression tests.
- Sanctuary has explanatory empty-state copy but no direct browse action.
- Journal writer has no main heading. Several older immersive screens use h2 as their top heading.
- Quiet Timer switches still have small visual/touch bounds; profile switches were fixed in this pass.
- A large BodyMesh bundle triggers the existing build size warning. Rendering performance on physical low-end devices remains unmeasured.
- Not an exhaustive audit of every lesson/content variant. All 7 foundation and 21 Water day texts, full breathing flow, sleep/support variants, populated vision export, offline/install behavior, screen readers and physical-device keyboard behavior remain to be tested. Authenticated/cloud/payment flows were outside this guest pass.

## Verification

Existing suite: 47 tests passed. TypeScript passed after filename correction. Home inspected at 390px width: no horizontal overflow, all three cards have the same computed background and padding, all three buttons measure 44px and use the same font/padding. Production build verified separately before release. Vercel connector denied access to the supplied team scope, so a GitHub commit alone is not proof that the custom domain updated.
