import React, { createContext, useContext, useState, useCallback } from "react";

const STORAGE_KEY = "trinkluma_game_results";

const GameResultsContext = createContext(null);

export function GameResultsProvider({ children }) {
  const [results, setResults] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const saveResults = useCallback((data) => {
    setResults(data);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <GameResultsContext.Provider value={{ results, saveResults, clearResults }}>
      {children}
    </GameResultsContext.Provider>
  );
}

export function useGameResults() {
  return useContext(GameResultsContext);
}