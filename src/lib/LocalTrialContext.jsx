import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Capacitor } from "@capacitor/core";

const LOCAL_TRIAL_STORAGE_KEY = "trinkluma_local_trial_v1";
export const LOCAL_TRIAL_MINUTES = 30;
export const LOCAL_TRIAL_TOTAL_MS = LOCAL_TRIAL_MINUTES * 60 * 1000;

const LocalTrialContext = createContext({
  enabled: false,
  started: false,
  remainingMs: 0,
  trialAvailable: false,
  trialExpired: false,
  consumeTrialTime: () => {},
});

function normalizeStoredTrial(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      started: false,
      remainingMs: LOCAL_TRIAL_TOTAL_MS,
    };
  }

  const remaining = Number(value.remainingMs);
  const started = value.started === true;

  if (!Number.isFinite(remaining)) {
    return {
      started: false,
      remainingMs: LOCAL_TRIAL_TOTAL_MS,
    };
  }

  return {
    started,
    remainingMs: Math.max(
      0,
      Math.min(
        LOCAL_TRIAL_TOTAL_MS,
        Math.trunc(remaining)
      )
    ),
  };
}

function readStoredTrial() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(LOCAL_TRIAL_STORAGE_KEY) || "null"
    );

    return normalizeStoredTrial(parsed);
  } catch {
    return {
      started: false,
      remainingMs: LOCAL_TRIAL_TOTAL_MS,
    };
  }
}

function writeStoredTrial(state) {
  try {
    localStorage.setItem(
      LOCAL_TRIAL_STORAGE_KEY,
      JSON.stringify({
        started: state.started === true,
        remainingMs: Math.max(
          0,
          Math.trunc(Number(state.remainingMs) || 0)
        ),
      })
    );
  } catch {
    // Die Testzeit bleibt auch ohne beschreibbaren Gerätespeicher
    // für die aktuelle Sitzung funktionsfähig.
  }
}

export function formatLocalTrialTime(ms) {
  const totalSeconds = Math.max(
    0,
    Math.ceil((Number(ms) || 0) / 1000)
  );

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function LocalTrialProvider({ children }) {
  const platform = Capacitor.getPlatform();
  const enabled = platform === "android" || platform === "ios";

  const [trial, setTrial] = useState(() =>
    enabled
      ? readStoredTrial()
      : {
          started: false,
          remainingMs: 0,
        }
  );

  const consumeTrialTime = useCallback(
    (elapsedMs) => {
      if (!enabled) {
        return;
      }

      const amount = Math.max(
        0,
        Math.trunc(Number(elapsedMs) || 0)
      );

      if (amount <= 0) {
        return;
      }

      setTrial((previous) => {
        if (previous.remainingMs <= 0) {
          return previous;
        }

        const next = {
          started: true,
          remainingMs: Math.max(
            0,
            previous.remainingMs - amount
          ),
        };

        writeStoredTrial(next);
        return next;
      });
    },
    [enabled]
  );

  const value = useMemo(
    () => ({
      enabled,
      started: trial.started,
      remainingMs: trial.remainingMs,
      trialAvailable:
        enabled && trial.remainingMs > 0,
      trialExpired:
        enabled &&
        trial.started &&
        trial.remainingMs <= 0,
      consumeTrialTime,
    }),
    [
      enabled,
      trial.started,
      trial.remainingMs,
      consumeTrialTime,
    ]
  );

  return (
    <LocalTrialContext.Provider value={value}>
      {children}
    </LocalTrialContext.Provider>
  );
}

export function useLocalTrial() {
  return useContext(LocalTrialContext);
}

/*
 * Verbraucht Testzeit nur solange eine lokale Partie aktiv ist und die App
 * sichtbar im Vordergrund liegt. Menüs, Kaufdialoge und Hintergrundzeit
 * werden nicht gezählt.
 */
export function useLocalTrialUsage(active) {
  const {
    trialAvailable,
    consumeTrialTime,
  } = useLocalTrial();

  useEffect(() => {
    if (!active || !trialAvailable) {
      return undefined;
    }

    let lastTick = Date.now();

    const resetClock = () => {
      lastTick = Date.now();
    };

    const tick = () => {
      const now = Date.now();
      const elapsed = Math.max(
        0,
        now - lastTick
      );

      lastTick = now;

      if (
        typeof document === "undefined" ||
        document.visibilityState === "visible"
      ) {
        consumeTrialTime(elapsed);
      }
    };

    const interval = window.setInterval(
      tick,
      1000
    );

    if (typeof document !== "undefined") {
      document.addEventListener(
        "visibilitychange",
        resetClock
      );
    }

    return () => {
      window.clearInterval(interval);

      if (
        typeof document === "undefined" ||
        document.visibilityState === "visible"
      ) {
        const now = Date.now();
        consumeTrialTime(
          Math.max(0, now - lastTick)
        );
      }

      if (typeof document !== "undefined") {
        document.removeEventListener(
          "visibilitychange",
          resetClock
        );
      }
    };
  }, [
    active,
    trialAvailable,
    consumeTrialTime,
  ]);
}
