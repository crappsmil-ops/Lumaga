export function isPurchaseSessionAuthorized(activeSession, sessionId) {
  if (activeSession === null || activeSession === undefined) {
    return true;
  }

  return activeSession === sessionId;
}
