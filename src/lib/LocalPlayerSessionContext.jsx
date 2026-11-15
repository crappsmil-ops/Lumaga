import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const LocalPlayerSessionContext = createContext(null);

const COLD_START_KEYS = [
  "trinkluma_party_mode_players_v1",
  "trinkluma_wkw_session_v1",
  "trinkluma_bluff_session_v1",
  "trinkluma_pantomime_session_v1",
  "trinkluma_never_session_v1",
];

function clearPreviousPlayerSession() {
  try {
    COLD_START_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch {
    // localStorage nicht verfügbar
  }
}

export function LocalPlayerSessionProvider({ children }) {
  const [players, setPlayers] = useState(() => {
    clearPreviousPlayerSession();
    return [];
  });

  const value = useMemo(
    () => ({
      players,
      setPlayers,
    }),
    [players]
  );

  return (
    <LocalPlayerSessionContext.Provider value={value}>
      {children}
    </LocalPlayerSessionContext.Provider>
  );
}

export function useLocalPlayerSession() {
  const context = useContext(LocalPlayerSessionContext);

  if (!context) {
    throw new Error(
      "useLocalPlayerSession must be used inside LocalPlayerSessionProvider"
    );
  }

  return context;
}
