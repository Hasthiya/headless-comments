# Known Issues & Future Improvements

Tracked issues from v2.0 audits. These are non-blocking and can be addressed in future patch releases.

---

## MINOR

### 1. Composable hooks return unstable object references

**Files:** `headless/useEditComment.ts`, `headless/useReplyTo.ts`, `headless/useCommentReaction.ts`

`useEditComment`, `useReplyTo`, and `useCommentReaction` return plain object literals (no `useMemo`). This means `useComment`'s `useMemo` wrapper invalidates every render since its deps include these sub-hook returns.

**Fix:** Wrap each sub-hook's return value in `useMemo`.

---

### 2. Concurrent mutations share a single snapshot

**File:** `headless/useCommentTree.ts`

Only one `snapshotRef` exists. If two mutations fire concurrently and the first fails, rollback restores the state after the second mutation's snapshot (not the original state).

**Fix:** Use a snapshot stack or keyed snapshots per mutation ID.

---

### 3. `peerDependenciesMeta` for `@supabase/supabase-js` has no `peerDependencies` entry

**File:** `package.json`

The `peerDependenciesMeta` block marks `@supabase/supabase-js` as optional, but there is no corresponding entry in `peerDependencies`. npm won't emit peer dependency warnings.

**Fix:** Either add `"@supabase/supabase-js": ">=2.0.0"` to `peerDependencies`, or remove the `peerDependenciesMeta` block.

---

### 4. `lint` script targets non-existent `src/` directory

**File:** `package.json`

The lint script runs `eslint src --ext .ts,.tsx`, but source code lives in `core/`, `headless/`, `presets/`.

**Fix:** Change to `"lint": "eslint . --ext .ts,.tsx --ignore-pattern dist"`.

---

### 5. `getCommentPermalink` missing from `core/index.ts` exports

**File:** `core/index.ts`

Exported from the root `index.ts` but not from `core/index.ts`, making it inaccessible via the `@hasthiya_/headless-comments-react/core` entry point.

**Fix:** Add the export to `core/index.ts`.

---

### 6. No delete confirmation in Styled preset

**File:** `presets/styled/StyledCommentItem.tsx`

`handleDelete` calls `context.deleteComment` immediately without a confirmation dialog, despite `texts.deleteConfirm` being defined in defaults.

**Fix:** Add `if (!window.confirm(texts.deleteConfirm)) return;` or implement a custom confirmation UI.

---

### 7. `StyledReplyForm` hardcodes `isSubmitting = false`

**File:** `presets/styled/StyledReplyForm.tsx`

The submit loading state is always `false`. Async `onSubmit` handlers won't show a loading indicator and won't prevent double-submission.

**Fix:** Track async state like `HeadlessReplyForm` does, or accept `isSubmitting` as a prop.

---

### 8. `useKeyboardShortcut` modifiers object in deps causes effect churn

**File:** `headless/hooks.ts`

The `modifiers` parameter (default `= {}`) creates a new object reference every call. Passing it to the `useEffect` dependency array re-registers the global keydown listener on every render.

**Fix:** Destructure modifiers into primitive deps: `[key, callback, modifiers.ctrl, modifiers.shift, modifiers.alt]`.

---

## INFO

### 9. `formatRelativeTime` hardcodes English for week/month/year

**File:** `core/utils.ts`

The `_locale` parameter is unused. Strings like "week", "month", "year" and pluralization are hardcoded in English. The `texts` parameter only covers short-term units.

---

### 10. Adapter stability requirement undocumented

`useCommentTree` captures the adapter in a ref and runs effects with `[]` deps. If consumers create a new adapter instance on every render, only the first is used. This is correct but should be documented.

---

### 11. Supabase adapter `realtime` option declared but never read

**File:** `core/adapters/supabase.ts`

`SupabaseAdapterOptions.realtime?: boolean` exists in the type but is never referenced. The realtime channel is set up based on `client.channel` existence, not this flag.

---

### 12. Context value generic cast loses type safety

**File:** `headless/CommentProvider.tsx`

`value as CommentSectionContextValue` (without `<T>`) loses the generic through context. This is a known React limitation — `createContext` doesn't support generics at the consumer level.

---

### 13. `HeadlessReplyForm` naming: `isSubmittingFromContext`

**File:** `headless/ReplyForm.tsx`

`const isSubmittingFromContext = isSubmittingProp;` — the value comes from the prop, not context. Misleading but harmless.

---

### 14. `renderComment` path in DefaultCommentSection lacks key wrappers

**File:** `presets/default/DefaultCommentSection.tsx`

When consumers provide `renderComment`, results aren't wrapped with a keyed `Fragment`. If the consumer's JSX doesn't include a `key`, React will warn.
