// Lightweight pub-sub for the disclaimer modal visibility.
// TransitionLayout subscribes to hide the tab bar while the disclaimer is open.
let visible = false;
const listeners = new Set();

export function setDisclaimerVisible(v) {
  visible = v;
  listeners.forEach((fn) => fn(visible));
}

export function subscribeDisclaimer(fn) {
  listeners.add(fn);
  fn(visible);
  return () => listeners.delete(fn);
}