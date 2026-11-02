"use client";

import { useState } from "react";
import {
  isPredictionOpen,
  teamName,
  type PlayPrediction,
} from "@/app/interface/app-user.interface";
import { appUserRequest } from "@/app/utils/appUsers";
import {
  BetForm,
  formatIST,
  HiddenBadge,
  isPast,
  PlayCard,
  PlayList,
  usePlayList,
  YourBets,
  type BetOption,
} from "./playUi";

type Props = { userId: string; onCoinsChanged: () => void };

function outcomes(prediction: PlayPrediction): BetOption[] {
  const options: BetOption[] = [
    { value: "A", label: teamName(prediction.teamA, "Team A"), odds: prediction.oddsTeamA },
    { value: "B", label: teamName(prediction.teamB, "Team B"), odds: prediction.oddsTeamB },
  ];
  // `oddsDraw` is null outside football, where a draw isn't an outcome.
  if (typeof prediction.oddsDraw === "number") {
    options.push({ value: "D", label: "Draw", odds: prediction.oddsDraw });
  }
  return options;
}

export default function PlayPredictions({ userId, onCoinsChanged }: Props) {
  const list = usePlayList<PlayPrediction>("/api/predictions/active", isPredictionOpen);

  return (
    <PlayList list={list} noun="predictions">
      {list.items.map((prediction) => (
        <PredictionCard
          key={prediction._id}
          userId={userId}
          prediction={prediction}
          onBet={() => {
            onCoinsChanged();
            list.reload();
          }}
        />
      ))}
    </PlayList>
  );
}

function PredictionCard({
  userId,
  prediction,
  onBet,
}: {
  userId: string;
  prediction: PlayPrediction;
  onBet: () => void;
}) {
  const [version, setVersion] = useState(0);
  const options = outcomes(prediction);
  const labelOf = (value?: string) => options.find((o) => o.value === value)?.label ?? value ?? "—";

  return (
    <PlayCard
      title={`${teamName(prediction.teamA, "Team A")} vs ${teamName(prediction.teamB, "Team B")}`}
      subtitle={[prediction.predictionId, prediction.tournament].filter(Boolean).join(" · ")}
      status={prediction.predictionStatus}
      badge={<HiddenBadge hidden={prediction.isVisible === false} />}
      warning={isPast(prediction.matchStartTime) ? "Match time passed but still ACTIVE" : undefined}
      meta={[
        { label: "Match start", value: formatIST(prediction.matchStartTime) },
        { label: "Pot", value: `${(prediction.totalCoins ?? 0).toLocaleString()} coins` },
      ]}
      actionLabel="Place bet"
    >
      {() => (
        <>
          <BetForm
            options={options}
            allowRandom
            onPlace={async (teamChosen, coinsBet) => {
              await appUserRequest(userId, "POST", `prediction/submitPrediction/${prediction._id}`, {
                teamChosen,
                coinsBet,
              });
              setVersion((v) => v + 1);
              onBet();
              return `Bet ${coinsBet.toLocaleString()} coins on ${labelOf(teamChosen)}.`;
            }}
          />
          <YourBets
            userId={userId}
            path={`prediction/userSubmittedBets/${prediction._id}`}
            version={version}
            describe={(bet) => labelOf(bet.teamChosen)}
          />
        </>
      )}
    </PlayCard>
  );
}
