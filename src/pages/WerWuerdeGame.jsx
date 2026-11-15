
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { useLocalPlayerSession } from "@/lib/LocalPlayerSessionContext";
import { Button } from "@/components/ui/button";

const questions = {
  de: [
    "Wer würde am ehesten eine Nachricht an die falsche Person schicken?",
    "Wer würde am ehesten bei einer Talentshow gewinnen?",
    "Wer würde am ehesten sein Handy im Kühlschrank vergessen?",
    "Wer würde am ehesten einen Weltrekord aufstellen?",
    "Wer würde am ehesten auf einer einsamen Insel überleben?",
    "Wer würde am ehesten eine Überraschungsparty planen?",
    "Wer würde am ehesten einen berühmten Filmstar treffen?",
    "Wer würde am ehesten in einer fremden Stadt verloren gehen?",
    "Wer würde am ehesten einen Tag ohne Handy verbringen?",
    "Wer würde am ehesten einen eigenen Freizeitpark eröffnen?",
    "Wer würde am ehesten bei einem Quiz gewinnen?",
    "Wer würde am ehesten aus Versehen zwei verschiedene Schuhe anziehen?",
    "Wer würde am ehesten einen Superhelden spielen?",
    "Wer würde am ehesten eine eigene Band gründen?",
    "Wer würde am ehesten einen lustigen Tanz erfinden?",
    "Wer würde am ehesten mitten in der Nacht Pizza bestellen?",
    "Wer würde am ehesten ein Konzert heimlich filmen, um es zu posten?",
    "Wer würde am ehesten seinen Ex oder seine Ex zufällig treffen und total peinlich reagieren?",
    "Wer würde am ehesten bei einem ersten Date zu spät kommen?",
    "Wer würde am ehesten heimlich ein Tier mit nach Hause nehmen wollen?",
    "Wer würde am ehesten einen Flashmob starten?",
    "Wer würde am ehesten vergessen, wo das Auto geparkt ist?",
    "Wer würde am ehesten auf einer Party als Erstes tanzen?",
    "Wer würde am ehesten einen Spitznamen bekommen, der für immer bleibt?",
    "Wer würde am ehesten versuchen, ohne Ticket durchzukommen?",
    "Wer würde am ehesten einen Streich spielen, der komplett nach hinten losgeht?",
    "Wer würde am ehesten für eine Wette etwas richtig Peinliches tun?",
    "Wer würde am ehesten versehentlich die falsche Chatgruppe vollspammen?",
    "Wer würde am ehesten bei Karaoke das Mikro nicht mehr abgeben?",
    "Wer würde am ehesten einen Fremden auf der Straße ansprechen?",
    "Wer würde am ehesten eine Nacht durchfeiern und trotzdem pünktlich zur Arbeit erscheinen?",
    "Wer würde am ehesten bei einem Horrorfilm am lautesten schreien?",
    "Wer würde am ehesten das letzte Stück Pizza klauen?",
    "Wer würde am ehesten eine spontane Reise ohne Plan buchen?",
    "Wer würde am ehesten vergessen, den Herd auszuschalten?",
    "Wer würde am ehesten beim Umzug alles bis zur letzten Minute aufschieben?",
    "Wer würde am ehesten noch ein richtig peinliches Jugendfoto auf dem Handy haben?",
    "Wer würde am ehesten beim Lügen sofort rot werden?",
    "Wer würde am ehesten eine ganze Serie an einem Wochenende durchschauen?",
    "Wer würde am ehesten bei einem Streit als Erstes nachgeben?",
    "Wer würde am ehesten einen Rückruf vergessen und es nie zugeben?",
    "Wer würde am ehesten auf einem Festival den Anschluss an die Gruppe verlieren?",
    "Wer würde am ehesten ein Geheimnis nicht für sich behalten können?",
    "Wer würde am ehesten spontan ein Tattoo stechen lassen?",
    "Wer würde am ehesten bei einer Umfrage am ehrlichsten antworten?",
    "Wer würde am ehesten auf einem Rummel bei jeder Fahrt mitfahren wollen?",
    "Wer würde am ehesten ein ganzes Buffet leer essen?",
    "Wer würde am ehesten versehentlich im Schlafanzug zur Arbeit gehen?",
    "Wer würde am ehesten bei Regen tanzen gehen?",
    "Wer würde am ehesten einen Marathon ohne Training mitlaufen?",
    "Wer würde am ehesten eine falsche Telefonnummer weitergeben, ohne es zu merken?",
    "Wer würde am ehesten bei einem Quiz absichtlich falsch antworten, um witzig zu wirken?",
    "Wer würde am ehesten mitten im Gespräch einschlafen?",
    "Wer würde am ehesten ein Selfie mit einem Promi versauen?",
    "Wer würde am ehesten eine Grillparty komplett allein organisieren?",
    "Wer würde am ehesten bei einer Achterbahnfahrt am lautesten jubeln?",
    "Wer würde am ehesten vergessen, Geburtstage zu gratulieren?",
    "Wer würde am ehesten ein ganzes Wochenende im Pyjama verbringen?",
    "Wer würde am ehesten bei einem Spieleabend am wettbewerbsfähigsten sein?",
    "Wer würde am ehesten eine Reise nur wegen des Essens planen?",
    "Wer würde am ehesten einen Road Trip spontan verlängern?",
    "Wer würde am ehesten zu viele Fotos von einem einzigen Moment machen?",
    "Wer würde am ehesten eine falsche Abkürzung nehmen und sich komplett verfahren?",
    "Wer würde am ehesten bei einem Lagerfeuer die beste Geschichte erzählen?",
    "Wer würde am ehesten versuchen, ein Lied rückwärts zu singen?",
    "Wer würde am ehesten eine Mutprobe sofort annehmen?",
    "Wer würde am ehesten bei einem Umzug die schwersten Kisten tragen wollen?",
    "Wer würde am ehesten ein ganzes Jahr ohne Social Media überleben?",
    "Wer würde am ehesten eine spontane Kissenschlacht starten?",
    "Wer würde am ehesten bei einer Verkleidungsparty das beste Kostüm haben?",
    "Wer würde am ehesten versuchen, ein Rezept ohne Anleitung nachzukochen – und scheitern?",
    "Wer würde am ehesten eine Nachtwanderung vorschlagen?",
    "Wer würde am ehesten vergessen, dass heute sein eigener Geburtstag ist?",
    "Wer würde am ehesten bei einem Fotoshooting die meisten Posen ausprobieren?",
    "Wer würde am ehesten ein Haustier wie ein eigenes Kind behandeln?",
    "Wer würde am ehesten eine Dose Energy-Drink vor einer wichtigen Prüfung trinken?",
    "Wer würde am ehesten versuchen, mit Fremden Freundschaft zu schließen?",
    "Wer würde am ehesten eine ganze Nacht Sterne gucken gehen?",
    "Wer würde am ehesten bei einer Schneeballschlacht als Erstes aufgeben?",
    "Wer würde am ehesten versuchen, eine Band auf der Straße zu beeindrucken?",
  ],
  en: [
    "Who would most likely message the wrong person?",
    "Who would most likely win a talent show?",
    "Who would most likely leave their phone in the fridge?",
    "Who would most likely set a world record?",
    "Who would most likely survive on a deserted island?",
    "Who would most likely plan a surprise party?",
    "Who would most likely meet a famous movie star?",
    "Who would most likely get lost in a new city?",
    "Who would most likely spend a day without their phone?",
    "Who would most likely open their own theme park?",
    "Who would most likely win a quiz?",
    "Who would most likely accidentally wear mismatched shoes?",
    "Who would most likely play a superhero?",
    "Who would most likely start their own band?",
    "Who would most likely invent a funny dance?",
    "Who would most likely order pizza in the middle of the night?",
    "Who would most likely film a concert just to post it?",
    "Who would most likely run into an ex and act totally awkward about it?",
    "Who would most likely be late to a first date?",
    "Who would most likely secretly want to bring a pet home?",
    "Who would most likely start a flash mob?",
    "Who would most likely forget where they parked the car?",
    "Who would most likely be the first one to dance at a party?",
    "Who would most likely get a nickname that sticks forever?",
    "Who would most likely try to sneak in without a ticket?",
    "Who would most likely pull a prank that totally backfires?",
    "Who would most likely do something really embarrassing for a bet?",
    "Who would most likely accidentally spam the wrong group chat?",
    "Who would most likely never give up the mic at karaoke?",
    "Who would most likely strike up a conversation with a random stranger?",
    "Who would most likely party all night and still show up to work on time?",
    "Who would most likely scream the loudest during a horror movie?",
    "Who would most likely steal the last slice of pizza?",
    "Who would most likely book a spontaneous trip with no plan at all?",
    "Who would most likely forget to turn off the stove?",
    "Who would most likely leave packing for a move until the very last minute?",
    "Who would most likely still have a really embarrassing childhood photo on their phone?",
    "Who would most likely blush instantly while telling a lie?",
    "Who would most likely binge an entire series in one weekend?",
    "Who would most likely be the first to back down in an argument?",
    "Who would most likely forget to return a call and never admit it?",
    "Who would most likely get separated from the group at a festival?",
    "Who would most likely be unable to keep a secret?",
    "Who would most likely get a spontaneous tattoo?",
    "Who would most likely answer a survey the most honestly?",
    "Who would most likely want to ride every single attraction at a fun fair?",
    "Who would most likely eat an entire buffet empty?",
    "Who would most likely accidentally go to work in their pajamas?",
    "Who would most likely dance in the rain?",
    "Who would most likely run a marathon with zero training?",
    "Who would most likely give out the wrong phone number without noticing?",
    "Who would most likely answer a quiz question wrong on purpose just to be funny?",
    "Who would most likely fall asleep mid-conversation?",
    "Who would most likely ruin a selfie with a celebrity?",
    "Who would most likely organize an entire barbecue all by themselves?",
    "Who would most likely cheer the loudest on a roller coaster?",
    "Who would most likely forget to say happy birthday?",
    "Who would most likely spend a whole weekend in pajamas?",
    "Who would most likely be the most competitive at game night?",
    "Who would most likely plan a trip purely for the food?",
    "Who would most likely spontaneously extend a road trip?",
    "Who would most likely take way too many photos of one single moment?",
    "Who would most likely take a wrong shortcut and get completely lost?",
    "Who would most likely tell the best story around a campfire?",
    "Who would most likely try to sing a song backwards?",
    "Who would most likely accept a dare instantly?",
    "Who would most likely insist on carrying the heaviest boxes during a move?",
    "Who would most likely survive a whole year without social media?",
    "Who would most likely start a spontaneous pillow fight?",
    "Who would most likely have the best costume at a dress-up party?",
    "Who would most likely try to cook a recipe with no instructions — and fail?",
    "Who would most likely suggest a night hike?",
    "Who would most likely forget it's their own birthday?",
    "Who would most likely try the most poses at a photoshoot?",
    "Who would most likely treat a pet like their own child?",
    "Who would most likely drink an energy drink right before an important exam?",
    "Who would most likely try to make friends with total strangers?",
    "Who would most likely spend a whole night stargazing?",
    "Who would most likely give up first in a snowball fight?",
    "Who would most likely try to impress a street band?",
  ],
};

export default function WerWuerdeGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const { players: sessionPlayers } = useLocalPlayerSession();

  const players =
    location.state?.players?.length > 0
      ? location.state.players
      : sessionPlayers || [];

  const isEnglish = lang === "en";
  const cards = questions[isEnglish ? "en" : "de"];

  const [round, setRound] = useState(0);
  const [voterIndex, setVoterIndex] = useState(0);
  const [votes, setVotes] = useState(
    () => Array(players.length).fill(0)
  );
  const [scores, setScores] = useState(
    () => Array(players.length).fill(0)
  );
  const [finished, setFinished] = useState(false);

  const roundComplete = voterIndex >= players.length;
  const gameComplete = round >= cards.length;

  const voteFor = (targetIndex) => {
    if (roundComplete || gameComplete) return;

    setVotes((previous) =>
      previous.map((count, index) =>
        index === targetIndex ? count + 1 : count
      )
    );

    setVoterIndex((previous) => previous + 1);
  };

  const nextRound = () => {
    const highest = Math.max(...votes);

    setScores((previous) =>
      previous.map((score, index) =>
        highest > 0 && votes[index] === highest
          ? score + 1
          : score
      )
    );

    setVotes(Array(players.length).fill(0));
    setVoterIndex(0);

    if (round + 1 >= cards.length) {
      setFinished(true);
    } else {
      setRound((previous) => previous + 1);
    }
  };

  const restart = () => {
    setRound(0);
    setVoterIndex(0);
    setVotes(Array(players.length).fill(0));
    setScores(Array(players.length).fill(0));
    setFinished(false);
  };

  if (players.length < 2) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center gap-4">
        <p>
          {isEnglish
            ? "Please add at least two players."
            : "Bitte füge mindestens zwei Spieler hinzu."}
        </p>
        <Button onClick={() => navigate("/setup")}>
          {isEnglish ? "Back" : "Zurück"}
        </Button>
      </div>
    );
  }

  const highestVotes = Math.max(...votes);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate("/setup")}
          className="text-sm text-muted-foreground"
        >
          ← {isEnglish ? "Game modes" : "Spielmodi"}
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-heading font-black">
            {isEnglish ? "Who Would…?" : "Wer würde…?"} 🎭
          </h1>

          {!finished && (
            <p className="text-sm text-muted-foreground">
              {isEnglish ? "Round" : "Runde"}{" "}
              {round + 1} / {cards.length}
            </p>
          )}
        </div>

        {finished ? (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h2 className="text-xl font-bold text-center">
              🏆 {isEnglish ? "Final scores" : "Endergebnis"}
            </h2>

            {players
              .map((player, index) => ({
                ...player,
                score: scores[index],
              }))
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={index}
                  className="flex justify-between rounded-xl bg-secondary p-3"
                >
                  <span>
                    {player.avatar} {player.name}
                  </span>
                  <span className="font-bold">
                    {player.score}{" "}
                    {isEnglish ? "points" : "Punkte"}
                  </span>
                </div>
              ))}

            <Button onClick={restart} className="w-full">
              {isEnglish ? "Play again" : "Erneut spielen"}
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-card border border-primary/30 rounded-2xl p-6 text-center">
              <p className="text-xl font-heading font-bold">
                {cards[round]}
              </p>
            </div>

            {!roundComplete ? (
              <div className="space-y-4">
                <p className="text-center font-semibold">
                  {players[voterIndex]?.avatar}{" "}
                  {players[voterIndex]?.name}
                  {isEnglish
                    ? ", who do you choose?"
                    : ", wen wählst du?"}
                </p>

                <p className="text-xs text-center text-muted-foreground">
                  {isEnglish
                    ? "Pass the phone to the current voter."
                    : "Gib das Handy an die Person, die gerade abstimmt."}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {players.map((player, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="min-h-16 h-auto whitespace-normal"
                      onClick={() => voteFor(index)}
                    >
                      {player.avatar} {player.name}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-bold text-center text-lg">
                  {isEnglish
                    ? "Voting results"
                    : "Abstimmungsergebnis"} 🎉
                </h2>

                {players.map((player, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-card border border-border rounded-xl p-3"
                  >
                    <span>
                      {player.avatar} {player.name}
                    </span>

                    <span className="font-bold">
                      {votes[index]}{" "}
                      {isEnglish ? "votes" : "Stimmen"}
                      {votes[index] === highestVotes &&
                        highestVotes > 0 &&
                        " 🏆"}
                    </span>
                  </div>
                ))}

                <p className="text-xs text-center text-muted-foreground">
                  {isEnglish
                    ? "The player(s) with the most votes earn one point."
                    : "Alle mit den meisten Stimmen erhalten einen Punkt."}
                </p>

                <Button
                  className="w-full h-12"
                  onClick={nextRound}
                >
                  {round + 1 >= cards.length
                    ? isEnglish
                      ? "Show final scores"
                      : "Endergebnis anzeigen"
                    : isEnglish
                      ? "Next question"
                      : "Nächste Frage"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}