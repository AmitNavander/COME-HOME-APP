/** Auth refreshes are not account switches. Only a settled identity change
 * should load a cloud copy over the device's current work. */
export function createAccountIdentityTracker() {
  let previous: string | null | undefined;
  return (state: { loading: boolean; user: { id: string; isGuest: boolean } }): boolean => {
    if (state.loading) return false;
    const identity = state.user.isGuest ? null : state.user.id;
    if (identity === previous) return false;
    previous = identity;
    return true;
  };
}
