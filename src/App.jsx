import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { HashRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { LanguageProvider } from '@/lib/LanguageContext';
import { PremiumProvider, usePremium } from '@/lib/PremiumContext';
import { LocalTrialProvider, useLocalTrial, useLocalTrialUsage } from '@/lib/LocalTrialContext';
import { LocalPlayerSessionProvider } from "@/lib/LocalPlayerSessionContext";
import { PARTY_MODE_PURCHASES } from '@/lib/products';
import { Capacitor } from '@capacitor/core';
import { TabHistoryProvider } from '@/lib/TabHistoryContext';
import { GameResultsProvider } from '@/lib/GameResultsContext';
import { lazy, Suspense, Component } from "react";
import TransitionLayout from '@/components/TransitionLayout';

const Home = lazy(() => import("@/pages/Home"));
const Setup = lazy(() => import("@/pages/Setup"));
const LocalPlayers = lazy(() => import("@/pages/LocalPlayers"));
const PantomimeGame = lazy(() => import("@/pages/PantomimeGame"));
const IchHabeNochNieGame = lazy(() => import("@/pages/IchHabeNochNieGame"));
const Game = lazy(() => import("@/pages/Game"));
const Results = lazy(() => import("@/pages/Results"));
const Settings = lazy(() => import("@/pages/Settings"));
const Support = lazy(() => import("@/pages/Support"));
const MyDeck = lazy(() => import("@/pages/MyDeck"));
const WerKenntWenGame = lazy(() => import("@/pages/WerKenntWenGame"));
const WerWuerdeGame = lazy(() => import("@/pages/WerWuerdeGame"));
const BluffWahrheitGame = lazy(() => import("@/pages/BluffWahrheitGame"));
const UeberDieApp = lazy(() => import("@/pages/UeberDieApp"));
const Datenschutz = lazy(() => import("@/pages/Datenschutz"));

const SuspenseFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

class LocalFlowErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Local flow render error:", error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 text-center space-y-4">
          <h1 className="font-heading font-bold text-xl">
            Lokaler Modus konnte nicht geladen werden
          </h1>

          <p className="font-body text-sm text-muted-foreground">
            Bitte erneut versuchen. Falls die Meldung wieder erscheint, kann der genaue Fehler aus Logcat ausgelesen werden.
          </p>

          <button
            type="button"
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-heading font-bold"
            onClick={() => window.location.reload()}
          >
            Erneut versuchen
          </button>

          <button
            type="button"
            className="w-full h-12 rounded-xl border border-border bg-card font-heading font-semibold"
            onClick={() => {
              window.location.hash = "#/";
              window.location.reload();
            }}
          >
            Zur Startseite
          </button>
        </div>
      </div>
    );
  }
}

// Android + iOS access checks for local games.
// A permanent purchase always wins. Otherwise the shared 30-minute local
// trial grants temporary access.
function PartyModeRoute({ mode, children }) {
  const {
    partyEntitlements,
    premiumStatusLoading,
  } = usePremium();

  const { trialAvailable } = useLocalTrial();

  const platform = Capacitor.getPlatform();
  const isNativeStore =
    platform === "android" || platform === "ios";

  const entitlementId =
    PARTY_MODE_PURCHASES[mode]?.entitlementId;

  const owned = entitlementId
    ? Boolean(partyEntitlements[entitlementId])
    : false;

  const usesTrial =
    isNativeStore &&
    Boolean(entitlementId) &&
    !premiumStatusLoading &&
    !owned &&
    trialAvailable;

  useLocalTrialUsage(usesTrial);

  if (!isNativeStore) return children;

  if (!entitlementId) {
    return <Navigate to="/setup" replace />;
  }

  if (owned || trialAvailable) {
    return children;
  }

  if (premiumStatusLoading) {
    return <SuspenseFallback />;
  }

  return <Navigate to="/setup" replace />;
}

function ClassicModeRoute({ children }) {
  const location = useLocation();

  const {
    isHotPremium,
    isHardcorePremium,
    isCustomPremium,
    premiumStatusLoading,
  } = usePremium();

  const { trialAvailable } = useLocalTrial();

  const platform = Capacitor.getPlatform();
  const isNativeStore =
    platform === "android" || platform === "ios";

  const wantsHardcore =
    location.state?.hardcoreMode === true;

  const wantsHot =
    location.state?.hotMode === true &&
    !wantsHardcore;

  const fullModePurchased =
    wantsHardcore
      ? isHardcorePremium
      : wantsHot
        ? isHotPremium
        : isHotPremium && isHardcorePremium;

  // "Mein Deck" remains usable after the trial even without the old
  // eight-card free mode. In that case Game.jsx uses only the user's
  // own deck cards; the normal Classic pool still requires the trial
  // or full local premium access.
  const routeUnlocked =
    fullModePurchased ||
    (
      !wantsHot &&
      !wantsHardcore &&
      isCustomPremium
    );

  const usesTrial =
    isNativeStore &&
    !premiumStatusLoading &&
    !fullModePurchased &&
    trialAvailable;

  useLocalTrialUsage(usesTrial);

  if (!isNativeStore) return children;

  if (routeUnlocked || trialAvailable) {
    return children;
  }

  if (premiumStatusLoading) {
    return <SuspenseFallback />;
  }

  return <Navigate to="/setup" replace />;
}

// Lumaga hat keine Anmeldung: Die Routen werden direkt angezeigt.
const AppRoutes = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route element={<TransitionLayout />}>
          <Route
  path="/wer-wuerde/spiel"
  element={<WerWuerdeGame />}
/>

          <Route
            path="/wer-kennt-wen/spiel"
            element={
              <PartyModeRoute mode="wer_kennt_wen">
                <WerKenntWenGame />
              </PartyModeRoute>
            }
          />

          <Route
            path="/bluff-wahrheit/spiel"
            element={
              <PartyModeRoute mode="bluff_wahrheit">
                <BluffWahrheitGame />
              </PartyModeRoute>
            }
          />

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/pantomime/spiel"
            element={
              <PartyModeRoute mode="pantomime">
                <PantomimeGame />
              </PartyModeRoute>
            }
          />

          <Route
            path="/ich-habe-noch-nie/spiel"
            element={
              <PartyModeRoute mode="ich_habe_noch_nie">
                <IchHabeNochNieGame />
              </PartyModeRoute>
            }
          />

          <Route
            path="/setup"
            element={
              <LocalFlowErrorBoundary>
                <Setup />
              </LocalFlowErrorBoundary>
            }
          />

          <Route
            path="/setup/players"
            element={
              <LocalFlowErrorBoundary>
                <LocalPlayers />
              </LocalFlowErrorBoundary>
            }
          />

          <Route
            path="/game"
            element={
              <ClassicModeRoute>
                <Game />
              </ClassicModeRoute>
            }
          />

          <Route
            path="/results"
            element={<Results />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="/support"
            element={<Support />}
          />
          <Route
            path="/mydeck"
            element={<MyDeck />}
          />

          <Route
            path="/ueber-die-app"
            element={<UeberDieApp />}
          />

          <Route
            path="/datenschutz"
            element={<Datenschutz />}
          />

          <Route
            path="/impressum"
            element={<Datenschutz scrollTo="impressum" />}
          />

          <Route
            path="*"
            element={<PageNotFound />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <LanguageProvider>
      <PremiumProvider>
        <LocalTrialProvider>
          <LocalPlayerSessionProvider>
            <QueryClientProvider client={queryClientInstance}>
              <Router>
                <TabHistoryProvider>
                  <GameResultsProvider>
                    <AppRoutes />
                  </GameResultsProvider>
                </TabHistoryProvider>
              </Router>

              <Toaster />
            </QueryClientProvider>
          </LocalPlayerSessionProvider>
        </LocalTrialProvider>
      </PremiumProvider>
    </LanguageProvider>
  )
}

export default App