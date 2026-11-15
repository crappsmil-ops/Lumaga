import { CATEGORY_CONFIG } from "@/lib/questions";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Pencil,
  Lock,
  Layers,
  Share2,
  Trash2,
  Check,
  Download,  Info,

  FolderPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePremium } from "@/lib/PremiumContext";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { purchaseProduct, restorePurchases, isIAPAvailable } from "@/lib/iap";

import {
  getDecks,
  createDeck,
  renameDeck,
  toggleDeck,
  deleteDeck,
  addCardToDeck,
  updateCardInDeck,
  removeCardFromDeck,
  exportDeck,
  importDeck,
} from "@/lib/customDeck";

import { checkContent } from "@/lib/contentFilter";
import PullToRefresh from "@/components/PullToRefresh";
import BackButton from "@/components/BackButton";

const CUSTOM_PACKAGE_ID = "mein_deck";

const CARD_MODES = [
  {
    id: "classic",
    emoji: "🃏",
    de: "Standard",
    en: "Standard",
  },
  {
    id: "wkw",
    emoji: "👥",
    de: "Wer kennt wen?",
    en: "Who knows whom?",
  },
  {
    id: "pantomime",
    emoji: "🎭",
    de: "Pantomime",
    en: "Charades",
  },
  {
    id: "never",
    emoji: "✋",
    de: "Ich habe noch nie",
    en: "Never have I ever",
  },
];

function getCardMode(card) {
  const mode =
    typeof card?.mode === "string"
      ? card.mode
      : "";

  return ["wkw", "pantomime", "never"].includes(mode)
    ? mode
    : "classic";
}

function createCustomCardId() {
  return `custom_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function getCardBadge(card, lang) {
  const mode = getCardMode(card);

  if (mode === "wkw") {
    return {
      emoji: "👥",
      label:
        lang === "de"
          ? "Wer kennt wen?"
          : "Who knows whom?",
      color: "from-sky-500 to-indigo-600",
    };
  }

  if (mode === "pantomime") {
    return {
      emoji: "🎭",
      label:
        lang === "de"
          ? "Pantomime"
          : "Charades",
      color: "from-fuchsia-500 to-purple-600",
    };
  }

  if (mode === "never") {
    return {
      emoji: "✋",
      label:
        lang === "de"
          ? "Ich habe noch nie"
          : "Never have I ever",
      color: "from-emerald-500 to-teal-600",
    };
  }

  const config =
    CATEGORY_CONFIG[
      card?.type === "action"
        ? "action"
        : 1
    ];

  return {
    emoji:
      config?.emoji ||
      (card?.type === "action"
        ? "🎯"
        : "💬"),
    label:
      card?.type === "action"
        ? lang === "de"
          ? "Aktion"
          : "Action"
        : lang === "de"
          ? "Frage"
          : "Question",
    color:
      config?.color ||
      "from-primary to-accent",
  };
}

function AutoGrowTextarea({
  value,
  className = "",
  ...props
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const element = textareaRef.current;

    if (!element) {
      return;
    }

    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      rows={1}
      className={`w-full resize-none overflow-hidden border border-border bg-background px-3 py-2 font-body text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-primary ${className}`}
      {...props}
    />
  );
}

export default function MyDeck() {
  const { lang } = useLanguage();
  const { isCustomPremium, setIsCustomPremium } = usePremium();

  const [decks, setDecks] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [newDeckName, setNewDeckName] = useState("");
const [showNewDeck, setShowNewDeck] = useState(false);

  const [buying, setBuying] = useState(false);
  const [msg, setMsg] = useState("");

  // Karten-Editor
  const [cardText, setCardText] = useState("");
  const [cardType, setCardType] = useState("question");
  const [cardMode, setCardMode] = useState("classic");
  const [wkwOptions, setWkwOptions] = useState(["", "", "", ""]);
  const [editing, setEditing] = useState({
    deckId: null,
    index: null,
  });

  // Teilen
  const [shareCode, setShareCode] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Import
  const [importCode, setImportCode] = useState("");
  const [importMsg, setImportMsg] = useState("");

  // Umbenennen
  const [renamingId, setRenamingId] = useState(null);
  const [renameText, setRenameText] = useState("");

  // Fehlermeldung für blockierte Karten
  const [cardError, setCardError] = useState("");

  const handleRefresh = async () => {
    setDecks(getDecks());
  };

  useEffect(() => {
    const d = getDecks();

    setDecks(d);

    if (d.length > 0) {
      setExpandedId((current) => current ?? d[0].id);
    }
  }, []);

  const handleCreateDeck = () => {
    const name =
      newDeckName.trim() || t(lang, "mydeck_new_deck");

    const updated =
      createDeck(name);

    setDecks(updated);
    setNewDeckName("");
setShowNewDeck(false);

    if (updated.length > 0) {
      setExpandedId(
        updated[updated.length - 1].id
      );
    }
  };

const handleRename = (id) => {
    const name = renameText.trim();

    if (!name) {
      setRenamingId(null);
      return;
    }

    setDecks(renameDeck(id, name));
    setRenamingId(null);
  };

  const startRename = (deck) => {
    setRenamingId(deck.id);
    setRenameText(deck.name);
  };

  const handleToggle = (id) => {
    setDecks(
      toggleDeck(id)
    );
  };

  /*
   * MYDECK_USAGE_UI_V1
   *
   * Eigene Decks werden im lokalen Spiel verwendet.
   */
  const showDeckUsageInfo = () => {
    window.alert(
      lang === "de"
        ? "Privat: Ist dieser Schalter aktiv, wird das Deck im lokalen Spiel verwendet."
        : "Private: When active, this deck is used in local games."
    );
  };

  const handleDelete = (id) => {
    if (
      confirm(
        t(
          lang,
          "mydeck_delete_deck_confirm"
        )
      )
    ) {
      setDecks(deleteDeck(id));
    }
  };

  const getCleanWkwOptions = () =>
  wkwOptions
    .map((option) => option.trim())
    .filter(Boolean)
    .slice(0, 4);

const hasRequiredWkwOptions = () =>
  wkwOptions[0]?.trim() && wkwOptions[1]?.trim();

  const resetCardEditor = () => {
    setEditing({
      deckId: null,
      index: null,
    });

    setCardText("");
    setCardType("question");
    setCardMode("classic");
    setWkwOptions(["", "", "", ""]);
    setCardError("");
  };

  const validateEditor = () => {
    const trimmed = cardText.trim();

    if (!trimmed) {
      return {
        ok: false,
        text: "",
        options: [],
      };
    }

    if (!checkContent(trimmed).ok) {
      setCardError(
        t(lang, "custom_blocked")
      );

      return {
        ok: false,
        text: "",
        options: [],
      };
    }

    const options =
      cardMode === "wkw"
        ? getCleanWkwOptions()
        : [];

    if (
  cardMode === "wkw" &&
  !hasRequiredWkwOptions()
) {
      setCardError(
        lang === "de"
          ? "Bitte mindestens zwei Antwortmöglichkeiten eintragen."
          : "Please enter at least two answer options."
      );

      return {
        ok: false,
        text: "",
        options: [],
      };
    }

    if (
      cardMode === "wkw" &&
      options.some(
        (option) =>
          !checkContent(option).ok
      )
    ) {
      setCardError(
        t(lang, "custom_blocked")
      );

      return {
        ok: false,
        text: "",
        options: [],
      };
    }

    return {
      ok: true,
      text: trimmed,
      options,
    };
  };

  const buildCardFromEditor = (
    existingCard = null
  ) => {
    const validation =
      validateEditor();

    if (!validation.ok) {
      return null;
    }

    const next = {
      ...(existingCard || {}),
      id:
        existingCard?.id ||
        createCustomCardId(),
      text: validation.text,
      isCustom: true,
      mode: cardMode,
    };

    if (cardMode === "classic") {
      next.type =
        cardType === "action"
          ? "action"
          : undefined;

      next.category =
        cardType === "action"
          ? "action"
          : 1;

      delete next.options;

      return next;
    }

    delete next.type;
    delete next.category;

    if (cardMode === "wkw") {
      next.options =
        validation.options;
    } else {
      delete next.options;
    }

    return next;
  };

  const addCard = (deckId) => {
    const newCard =
      buildCardFromEditor();

    if (!newCard) {
      return;
    }

    setDecks(
      addCardToDeck(
        deckId,
        newCard
      )
    );

    setCardText("");
    setWkwOptions(["", "", "", ""]);
    setCardError("");
  };

  const startEditCard = (
    deckId,
    index,
    card
  ) => {
    setEditing({
      deckId,
      index,
    });

    setCardText(card.text || "");

    setCardType(
      card.type === "action"
        ? "action"
        : "question"
    );

    const mode =
      getCardMode(card);

    setCardMode(mode);

    const options =
      Array.isArray(card.options)
        ? card.options
            .map((option) =>
              typeof option === "string"
                ? option
                : ""
            )
            .slice(0, 4)
        : [];

    setWkwOptions([
      options[0] || "",
      options[1] || "",
      options[2] || "",
      options[3] || "",
    ]);

    setCardError("");
  };

  const saveEditCard = () => {
    if (
      editing.deckId === null ||
      editing.index === null
    ) {
      return;
    }

    const currentDeck =
      decks.find(
        (deck) =>
          deck.id ===
          editing.deckId
      );

    const currentCard =
      currentDeck?.cards?.[
        editing.index
      ];

    const updatedCard =
      buildCardFromEditor(
        currentCard || null
      );

    if (!updatedCard) {
      return;
    }

    setDecks(
      updateCardInDeck(
        editing.deckId,
        editing.index,
        updatedCard
      )
    );

    setEditing({
      deckId: null,
      index: null,
    });

    setCardText("");
    setWkwOptions(["", "", "", ""]);
    setCardError("");
  };

  const removeCard = (
    deckId,
    index
  ) => {
    setDecks(
      removeCardFromDeck(
        deckId,
        index
      )
    );
  };

  const handleShare = async (deckId) => {
    const code = exportDeck(deckId);

    if (!code) {
      return;
    }

    const deck = decks.find(
      (item) => item.id === deckId
    );

    const title = deck?.name
      ? `Trinkluma – ${deck.name}`
      : "Trinkluma – Mein Deck";

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: code,
        });

        return;
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }
      }
    }

    setShareCode(code);
    setShareOpen(true);
    setCopied(false);
  };

  const copyShareCode = () => {
    navigator.clipboard
      ?.writeText(shareCode)
      .then(() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      });
  };

  const handleImport = () => {
    const result = importDeck(
      importCode.trim()
    );

    if (result === null) {
      setImportMsg(
        t(
          lang,
          "mydeck_import_error"
        )
      );
    } else {
      setDecks(result);

      setImportMsg(
        t(
          lang,
          "mydeck_import_success"
        )
      );

      setImportCode("");
    }

    setTimeout(() => {
      setImportMsg("");
    }, 3000);
  };

  const handleRestoreOnly =
    async () => {
      if (buying) {
        return;
      }

      setBuying(true);
      setMsg("");

      try {
        const restored =
          await restorePurchases();

        const active =
          restored?.customerInfo
            ?.entitlements
            ?.active || {};

        if (
          active.mein_deck
        ) {
          setIsCustomPremium(
            true
          );

          setMsg(
            lang === "de"
              ? "Kauf erfolgreich wiederhergestellt."
              : "Purchase restored successfully."
          );

          return;
        }

        setMsg(
          lang === "de"
            ? "Für Mein Deck wurde auf diesem Store-Konto kein früherer Kauf gefunden."
            : "No previous My Deck purchase was found for this store account."
        );
      } catch (error) {
        console.error(
          "Mein Deck Restore Fehler:",
          error
        );

        setMsg(
          lang === "de"
            ? "Kauf konnte nicht wiederhergestellt werden."
            : "Purchase could not be restored."
        );
      } finally {
        setBuying(false);
      }
    };

  const handleBuy = async () => {
    setBuying(true);
    setMsg("");

    try {
      const restored =
        await restorePurchases();

      const restoredActive =
        restored?.customerInfo
          ?.entitlements
          ?.active || {};

      if (restoredActive.mein_deck) {
        setIsCustomPremium(true);
        setMsg("Mein Deck ist bereits freigeschaltet.");
        return;
      }

      const res =
        await purchaseProduct(
          CUSTOM_PACKAGE_ID
        );

      const active =
        res?.customerInfo
          ?.entitlements
          ?.active || {};

      if (active.mein_deck) {
        setIsCustomPremium(true);
        setMsg(
          t(
            lang,
            "paywall_success"
          )
        );
      } else if (
        res.reason === "cancelled"
      ) {
        return;
      } else if (
        res.reason === "unavailable"
      ) {
        setMsg(
          t(
            lang,
            "setup_hot_paywall_soon"
          )
        );
      } else {
        setMsg(
          res.message ||
            "Kauf konnte nicht bestätigt werden."
        );
      }
    } finally {
      setBuying(false);
    }
  };
  const totalCards = decks.reduce(
    (sum, deck) =>
      sum + deck.cards.length,
    0
  );

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
    >
      <div className="min-h-screen bg-background flex flex-col p-6 pt-safe relative overflow-x-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

        <BackButton />

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="max-w-md w-full mx-auto relative z-10 pt-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-heading font-black">
                {t(
                  lang,
                  "mydeck_title"
                )}
              </h1>

              <p className="text-muted-foreground font-body text-sm">
                {t(
                  lang,
                  "mydeck_subtitle"
                )}
              </p>
            </div>
          </div>

          {!isCustomPremium ? (
            <div className="bg-card border border-border rounded-2xl p-8 mt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-white" />
              </div>

              <h2 className="font-heading font-bold text-lg mb-2">
                {t(
                  lang,
                  "mydeck_locked_title"
                )}
              </h2>

              <p className="font-body text-sm text-muted-foreground mb-6">
                {t(
                  lang,
                  "custom_locked_desc"
                )}
              </p>

              <Button
                onClick={handleBuy}
                disabled={
                  buying ||
                  !isIAPAvailable()
                }
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 gap-2"
              >
                {buying ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />

                    {t(
                      lang,
                      "custom_locked_button"
                    )}
                  </>
                )}
              </Button>

              <Button
                onClick={
                  handleRestoreOnly
                }
                disabled={
                  buying ||
                  !isIAPAvailable()
                }
                variant="outline"
                className="w-full mt-3 rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />

                {lang === "de"
                  ? "Kauf wiederherstellen"
                  : "Restore purchase"}
              </Button>

              {msg && (
                <p className="text-sm text-center font-body mt-3 text-foreground">
                  {msg}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between bg-card border border-border rounded-2xl p-4 mt-6 mb-3">
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-primary" />

                  <p className="font-body text-sm font-medium">
                    {t(
                      lang,
                      "mydeck_count",
                      totalCards
                    )}
                  </p>
                </div>
              </div>

              

              {!showNewDeck ? (
                <Button
                  onClick={() =>
                    setShowNewDeck(true)
                  }
                  variant="outline"
                  className="w-full h-12 rounded-2xl border-2 border-dashed border-primary/30 hover:bg-primary/5 gap-2 mb-4"
                >
                  <FolderPlus className="w-4 h-4" />

                  {t(
                    lang,
                    "mydeck_new_deck"
                  )}
                </Button>
              ) : (
                <div className="bg-card border border-border rounded-2xl p-4 mb-4">
                  <Input
                    value={
                      newDeckName
                    }
                    onChange={(e) =>
                      setNewDeckName(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) =>
                      e.key ===
                        "Enter" &&
                      handleCreateDeck()
                    }
                    placeholder={t(
                      lang,
                      "mydeck_deck_name"
                    )}
                    className="h-11 bg-card border-border font-body text-sm rounded-xl mb-3"
                    autoFocus
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={
                        handleCreateDeck
                      }
                      className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary/90 active:scale-95 gap-2"
                    >
                      <Check className="w-4 h-4" />

                      {t(
                        lang,
                        "mydeck_create_deck"
                      )}
                    </Button>

                    <Button
                      onClick={() =>
                        setShowNewDeck(
                          false
                        )
                      }
                      variant="ghost"
                      className="h-10 rounded-xl"
                    >
                      {t(
                        lang,
                        "mydeck_cancel"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Import */}
              <div className="bg-card border border-border rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="w-4 h-4 text-accent" />

                  <p className="font-heading text-sm font-bold">
                    {t(
                      lang,
                      "mydeck_import"
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={importCode}
                    onChange={(e) =>
                      setImportCode(
                        e.target.value
                      )
                    }
                    placeholder={t(
                      lang,
                      "mydeck_import_placeholder"
                    )}
                    className="h-10 bg-card border-border font-body text-xs rounded-xl"
                  />

                  <Button
                    onClick={
                      handleImport
                    }
                    disabled={
                      !importCode.trim()
                    }
                    className="h-10 rounded-xl bg-accent hover:bg-accent/90 text-xs"
                  >
                    {t(
                      lang,
                      "mydeck_import_btn"
                    )}
                  </Button>
                </div>

                {importMsg && (
                  <p className="text-xs font-body mt-2 text-center text-foreground">
                    {importMsg}
                  </p>
                )}
              </div>

              {/* Deck Liste */}
              {decks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground font-body">
                    {t(
                      lang,
                      "mydeck_no_decks"
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {decks.map(
                      (deck) => {
                        const isExpanded =
                          expandedId ===
                          deck.id;

                        const isRenaming =
                          renamingId ===
                          deck.id;

                        return (
                          <motion.div
                            key={
                              deck.id
                            }
                            initial={{
                              opacity: 0,
                              y: 10,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: -10,
                            }}
                            className={`bg-card border-2 rounded-2xl overflow-hidden transition-all ${
                              deck.active
                                ? "border-primary/30"
                                : "border-border opacity-60"
                            }`}
                          >
                            {/* Deck Header */}
                            <div className="p-4">
                              {/* Deckname direkt über dem jeweiligen Deck */}
                              <div className="mb-4">
                                {isRenaming ? (
                                  <Input
                                    value={renameText}
                                    onChange={(e) =>
                                      setRenameText(
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key ===
                                        "Enter"
                                      ) {
                                        handleRename(
                                          deck.id
                                        );
                                      }

                                      if (
                                        e.key ===
                                        "Escape"
                                      ) {
                                        setRenamingId(
                                          null
                                        );
                                      }
                                    }}
                                    onBlur={() =>
                                      handleRename(
                                        deck.id
                                      )
                                    }
                                    className="h-10 bg-background border-border font-heading text-base font-bold rounded-xl"
                                    autoFocus
                                  />
                                ) : (
                                  <button
                                    onClick={() =>
                                      setExpandedId(
                                        isExpanded
                                          ? null
                                          : deck.id
                                      )
                                    }
                                    className="w-full text-left"
                                  >
                                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-body mb-1">
                                      {lang === "de"
                                        ? "Deckname"
                                        : "Deck name"}
                                    </p>

                                    <h2 className="font-heading font-black text-xl break-words">
                                      {deck.name}
                                    </h2>
                                  </button>
                                )}
                              </div>

                              {/* MYDECK_PRIVATE_BOX_V3 */}
                              <div className="grid grid-cols-1 gap-3 w-full">
                                {/* PRIVAT */}
                                <div
                                  className={`rounded-2xl border-2 p-3 transition-all ${
                                    deck.active
                                      ? "border-primary bg-primary/10"
                                      : "border-border bg-background"
                                  }`}
                                >
                                  <div className="flex items-start gap-2 mb-3">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-heading font-bold text-sm">
                                        {t(
                                          lang,
                                          "mydeck_private"
                                        )}
                                      </p>

                                      <p className="text-[11px] leading-tight text-muted-foreground font-body mt-1">
                                        {t(
                                          lang,
                                          "mydeck_private_desc"
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() =>
                                      handleToggle(
                                        deck.id
                                      )
                                    }
                                    className={`w-full h-9 rounded-xl text-xs font-heading font-bold transition-all ${
                                      deck.active
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-muted-foreground"
                                    }`}
                                  >
                                    {deck.active
                                      ? lang ===
                                        "de"
                                        ? "Aktiv"
                                        : "Active"
                                      : lang ===
                                          "de"
                                        ? "Inaktiv"
                                        : "Inactive"}
                                  </button>

                                  <button
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      showDeckUsageInfo(
                                        "private"
                                      );
                                    }}
                                    className="w-full mt-2 min-h-[32px] flex items-center justify-center gap-1.5 text-[11px] font-body text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
                                    aria-label="Info Privat"
                                  >
                                    <Info className="w-3.5 h-3.5" />
                                    <span>Info</span>
                                  </button>
                                </div>
                              </div>

                              {/* Deck-Aktionen */}
                              <div className="flex items-center justify-end gap-2 mt-3">
                                <button
                                  onClick={() =>
                                    startRename(
                                      deck
                                    )
                                  }
                                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                                  title={t(
                                    lang,
                                    "mydeck_rename"
                                  )}
                                  aria-label={t(
                                    lang,
                                    "mydeck_rename"
                                  )}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleShare(
                                      deck.id
                                    )
                                  }
                                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                                  title={t(
                                    lang,
                                    "mydeck_share"
                                  )}
                                  aria-label={t(
                                    lang,
                                    "mydeck_share"
                                  )}
                                >
                                  <Share2 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDelete(
                                      deck.id
                                    )
                                  }
                                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                  title={t(
                                    lang,
                                    "mydeck_delete_deck"
                                  )}
                                  aria-label={t(
                                    lang,
                                    "mydeck_delete_deck"
                                  )}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Deck Inhalt */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{
                                    height: 0,
                                    opacity: 0,
                                  }}
                                  animate={{
                                    height:
                                      "auto",
                                    opacity: 1,
                                  }}
                                  exit={{
                                    height: 0,
                                    opacity: 0,
                                  }}
                                  className="border-t border-border"
                                >
                                  <div className="p-4 space-y-2">
                                    {deck
                                      .cards
                                      .length ===
                                      0 && (
                                      <p className="text-xs text-muted-foreground font-body text-center py-4">
                                        {t(
                                          lang,
                                          "mydeck_empty_deck"
                                        )}
                                      </p>
                                    )}

                                    {deck.cards.map(
                                      (
                                        card,
                                        i
                                      ) => {
                                        const isEditing =
                                          editing.deckId ===
                                            deck.id &&
                                          editing.index ===
                                            i;

                                        const badge =
                                          getCardBadge(
                                            card,
                                            lang
                                          );

                                        const mode =
                                          getCardMode(
                                            card
                                          );

                                        return (
                                          <div
                                            key={
                                              i
                                            }
                                            className="flex items-start justify-between bg-background border border-border rounded-xl px-3 py-2 gap-2"
                                          >
                                            {isEditing ? (
                                              <div className="flex-1 space-y-2">
                                                <AutoGrowTextarea
                                                  value={cardText}
                                                  onChange={(event) =>
                                                    setCardText(
                                                      event.target.value
                                                    )
                                                  }
                                                  onKeyDown={(event) => {
                                                    if (
                                                      event.key ===
                                                      "Enter" &&
                                                      cardMode !== "wkw"
                                                    ) {
                                                      saveEditCard();
                                                    }

                                                    if (
                                                      event.key ===
                                                      "Escape"
                                                    ) {
                                                      resetCardEditor();
                                                    }
                                                  }}
                                                  className="h-8 bg-card border-border font-body text-xs rounded-lg"
                                                  maxLength={160}
                                                  autoFocus
                                                />

                                                {cardMode === "wkw" && (
                                                  <div className="grid grid-cols-2 gap-2">
                                                    {wkwOptions.map(
                                                      (option, optionIndex) => (
                                                        <AutoGrowTextarea
                                                          key={optionIndex}
                                                          value={option}
                                                          onChange={(event) => {
                                                            const next = [
                                                              ...wkwOptions,
                                                            ];

                                                            next[optionIndex] =
                                                              event.target.value;

                                                            setWkwOptions(next);
                                                          }}
                                                          placeholder={
                                                            lang === "de"
                                                              ? `Antwort ${optionIndex + 1}${
                                                                  optionIndex < 2
                                                                    ? " *"
                                                                    : ""
                                                                }`
                                                              : `Answer ${optionIndex + 1}${
                                                                  optionIndex < 2
                                                                    ? " *"
                                                                    : ""
                                                                }`
                                                          }
                                                          className="h-8 bg-card border-border font-body text-xs rounded-lg"
                                                          maxLength={80}
                                                        />
                                                      )
                                                    )}
                                                  </div>
                                                )}

                                                <div className="flex gap-2">
                                                  <Button
                                                    onClick={saveEditCard}
                                                    className="h-8 px-3 rounded-lg bg-primary"
                                                  >
                                                    <Check className="w-3 h-3 mr-1" />
                                                    {lang === "de"
                                                      ? "Speichern"
                                                      : "Save"}
                                                  </Button>

                                                  <Button
                                                    onClick={resetCardEditor}
                                                    variant="ghost"
                                                    className="h-8 px-3 rounded-lg"
                                                  >
                                                    <X className="w-3 h-3 mr-1" />
                                                    {lang === "de"
                                                      ? "Abbrechen"
                                                      : "Cancel"}
                                                  </Button>
                                                </div>
                                              </div>
                                            ) : (
                                              <>
                                                <div className="min-w-0 flex-1">
                                                  <div className="flex items-start gap-2">
                                                    <span
                                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${badge.color} text-white text-[10px] font-heading font-bold shrink-0 shadow-sm`}
                                                    >
                                                      <span>
                                                        {badge.emoji}
                                                      </span>

                                                      <span>
                                                        {badge.label}
                                                      </span>
                                                    </span>

                                                    <p className="min-w-0 flex-1 text-xs font-body text-foreground whitespace-normal break-words [overflow-wrap:anywhere]">
  {card.text}
</p>
                                                  </div>

                                                  {mode === "wkw" &&
                                                    Array.isArray(card.options) &&
                                                    card.options.length > 0 && (
                                                      <p className="text-[11px] text-muted-foreground font-body mt-2 pl-1 break-words">
                                                        {card.options.join(" · ")}
                                                      </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                                                  <button
                                                    onClick={() =>
                                                      startEditCard(
                                                        deck.id,
                                                        i,
                                                        card
                                                      )
                                                    }
                                                    aria-label={
                                                      lang === "de"
                                                        ? "Karte bearbeiten"
                                                        : "Edit card"
                                                    }
                                                    className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary"
                                                  >
                                                    <Pencil className="w-3 h-3" />
                                                  </button>

                                                  <button
                                                    onClick={() =>
                                                      removeCard(
                                                        deck.id,
                                                        i
                                                      )
                                                    }
                                                    aria-label={
                                                      lang === "de"
                                                        ? "Karte entfernen"
                                                        : "Remove card"
                                                    }
                                                    className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                                  >
                                                    <X className="w-3 h-3" />
                                                  </button>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        );
                                      }
                                    )}

                                    {/* Karte hinzufügen */}
                                    <div className="pt-3 border-t border-border/60">
                                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-body mb-2">
                                        {lang === "de"
                                          ? "Inhalt für Modus"
                                          : "Content for mode"}
                                      </p>

                                      <div className="grid grid-cols-2 gap-2 mb-3">
                                        {CARD_MODES.map(
                                          (modeOption) => (
                                            <button
                                              key={modeOption.id}
                                              onClick={() => {
                                                setCardMode(
                                                  modeOption.id
                                                );

                                                setCardError("");
                                              }}
                                              className={`min-h-[42px] px-2 py-2 rounded-xl text-[11px] font-heading font-bold border transition-all ${
                                                cardMode === modeOption.id
                                                  ? "border-primary bg-primary/10 text-foreground"
                                                  : "border-border text-muted-foreground bg-background"
                                              }`}
                                            >
                                              <span className="mr-1">
                                                {modeOption.emoji}
                                              </span>

                                              {lang === "de"
                                                ? modeOption.de
                                                : modeOption.en}
                                            </button>
                                          )
                                        )}
                                      </div>

                                      {cardMode === "classic" && (
                                        <div className="flex gap-2 mb-2">
                                          <button
                                            onClick={() =>
                                              setCardType(
                                                "question"
                                              )
                                            }
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-heading font-bold border transition-all ${
                                              cardType ===
                                              "question"
                                                ? "border-transparent bg-gradient-to-r " +
                                                  (CATEGORY_CONFIG[1]?.color ||
                                                    "from-primary to-accent") +
                                                  " text-white shadow-sm"
                                                : "border-border text-muted-foreground"
                                            }`}
                                          >
                                            {t(
                                              lang,
                                              "mydeck_add_question"
                                            )}
                                          </button>

                                          <button
                                            onClick={() =>
                                              setCardType(
                                                "action"
                                              )
                                            }
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-heading font-bold border transition-all ${
                                              cardType ===
                                              "action"
                                                ? "border-transparent bg-gradient-to-r " +
                                                  (CATEGORY_CONFIG.action?.color ||
                                                    "from-amber-500 to-orange-600") +
                                                  " text-white shadow-sm"
                                                : "border-border text-muted-foreground"
                                            }`}
                                          >
                                            {t(
                                              lang,
                                              "mydeck_add_action"
                                            )}
                                          </button>
                                        </div>
                                      )}

                                      {cardMode === "wkw" && (
                                        <p className="text-[11px] text-muted-foreground font-body mb-2">
                                          {lang === "de"
                                            ? "Tipp: Mit {name} setzt du automatisch den Namen der Zielperson ein. Mindestens 2 Antworten sind nötig."
                                            : "Tip: Use {name} to insert the target player's name automatically. At least 2 answers are required."}
                                        </p>
                                      )}

                                      <div className="flex gap-2">
                                        <AutoGrowTextarea
                                          value={cardText}
                                          onChange={(event) =>
                                            setCardText(
                                              event.target.value
                                            )
                                          }
                                          onKeyDown={(event) => {
                                            if (
                                              event.key ===
                                                "Enter" &&
                                              cardMode !== "wkw"
                                            ) {
                                              if (
                                                editing.deckId !==
                                                null
                                              ) {
                                                saveEditCard();
                                              } else {
                                                addCard(
                                                  deck.id
                                                );
                                              }
                                            }
                                          }}
                                          placeholder={
                                            cardMode === "wkw"
                                              ? lang === "de"
                                                ? "z. B. Was würde Alex eher wählen?"
                                                : "e.g. What would Alex rather choose?"
                                              : cardMode === "pantomime"
                                                ? lang === "de"
                                                  ? "Pantomime-Begriff oder Szene"
                                                  : "Charades prompt or scene"
                                                : cardMode === "never"
                                                  ? lang === "de"
                                                    ? "Ich habe noch nie …"
                                                    : "Never have I ever …"
                                                  : cardType === "action"
                                                    ? t(
                                                        lang,
                                                        "custom_placeholder_action"
                                                      )
                                                    : t(
                                                        lang,
                                                        "custom_placeholder_question"
                                                      )
                                          }
                                          className="h-9 bg-background border-border font-body text-xs rounded-lg"
                                          maxLength={160}
                                        />

                                        <Button
                                          onClick={() =>
                                            editing.deckId !==
                                            null
                                              ? saveEditCard()
                                              : addCard(
                                                  deck.id
                                                )
                                          }
                                          disabled={
  !cardText.trim() ||
  (
    cardMode === "wkw" &&
    !hasRequiredWkwOptions()
  )
}
                                          className="h-9 w-9 p-0 shrink-0 bg-primary hover:bg-primary/90 rounded-lg"
                                        >
                                          {editing.deckId !==
                                          null ? (
                                            <Check className="w-4 h-4" />
                                          ) : (
                                            <Plus className="w-4 h-4" />
                                          )}
                                        </Button>
                                      </div>

                                      {cardMode === "wkw" && (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                          {wkwOptions.map(
                                            (
                                              option,
                                              optionIndex
                                            ) => (
                                              <AutoGrowTextarea
                                                key={optionIndex}
                                                value={option}
                                                onChange={(event) => {
                                                  const next = [
                                                    ...wkwOptions,
                                                  ];

                                                  next[optionIndex] =
                                                    event.target.value;

                                                  setWkwOptions(next);
                                                }}
                                                onKeyDown={(event) => {
                                                  if (
                                                    event.key ===
                                                      "Enter" &&
                                                    getCleanWkwOptions()
                                                      .length >= 2
                                                  ) {
                                                    if (
                                                      editing.deckId !==
                                                      null
                                                    ) {
                                                      saveEditCard();
                                                    } else {
                                                      addCard(
                                                        deck.id
                                                      );
                                                    }
                                                  }
                                                }}
                                                placeholder={
                                                  lang === "de"
                                                    ? `Antwort ${optionIndex + 1}${
                                                        optionIndex < 2
                                                          ? " *"
                                                          : ""
                                                      }`
                                                    : `Answer ${optionIndex + 1}${
                                                        optionIndex < 2
                                                          ? " *"
                                                          : ""
                                                      }`
                                                }
                                                className="h-9 bg-background border-border font-body text-xs rounded-lg"
                                                maxLength={80}
                                              />
                                            )
                                          )}
                                        </div>
                                      )}

                                      {cardError && (
                                        <p className="text-xs text-destructive font-body mt-2">
                                          {cardError}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      }
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Teilen Modal */}
        <AnimatePresence>
          {shareOpen && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
              onClick={() =>
                setShareOpen(false)
              }
            >
              <motion.div
                initial={{
                  scale: 0.9,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                }}
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="w-5 h-5 text-primary" />

                  <h3 className="font-heading font-bold text-lg">
                    {t(
                      lang,
                      "mydeck_share_title"
                    )}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground font-body mb-4">
                  {t(
                    lang,
                    "mydeck_share_desc"
                  )}
                </p>

                <Button
                  onClick={
                    copyShareCode
                  }
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 gap-2"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}

                  {copied
                    ? t(
                        lang,
                        "mydeck_share_copied"
                      )
                    : t(
                        lang,
                        "mydeck_share_copy"
                      )}
                </Button>

                <Button
                  onClick={() =>
                    setShareOpen(false)
                  }
                  variant="ghost"
                  className="w-full h-10 mt-2 rounded-xl"
                >
                  {t(
                    lang,
                    "mydeck_cancel"
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PullToRefresh>
  );
}
