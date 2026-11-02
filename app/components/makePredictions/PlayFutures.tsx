"use client";

import { useState } from "react";
import { isFutureOpen, type PlayFuture } from "@/app/interface/app-user.interface";
import { appUserRequest } from "@/app/utils/appUsers";
import { BetForm, formatIST, isPast, PlayCard, PlayList, usePlayList, YourBets } from "./playUi";

type Props = { userId: string; onCoinsChanged: () => void };

const entriesClosed = (future: PlayFuture) => isPast(future.entryCloseTime);

export default function PlayFutures({ userId, onCoinsChanged }: Props) {
  const list = usePlayList<PlayFuture>("/api/futures/active", isFutureOpen, entriesClosed);

  return (
    <PlayList
      list={list}
      noun="futures"
      awaitingRows={list.awaiting.map((future) => (
        <FutureCard key={future._id} userId={userId} future={future} closed />
      ))}
    >
      {list.items.map((future) => (
        <FutureCard
          key={future._id}
          userId={userId}
          future={future}
          onBet={() => {
            onCoinsChanged();
            list.reload();
          }}
        />
      ))}
    </PlayList>
  );
}

function FutureCard({
  userId,
  future,
  onBet,
  closed = false,
}: {
  userId: string;
  future: PlayFuture;
  onBet?: () => void;
  /** Entries closed: only the user's bets are shown. */
  closed?: boolean;
}) {
  const [version, setVersion] = useState(0);
  const choices = future.choices ?? [];
  const nameOf = (id: string) => choices.find((c) => c._id === id)?.choiceName ?? "that choice";

  return (
    <PlayCard
      title={future.eventName || future.futureId || "Future"}
      subtitle={[future.futureId, future.tournamentData?.tournamentName].filter(Boolean).join(" · ")}
      status={future.futureStatus}
      meta={[
        { label: closed ? "Entry closed" : "Entry closes", value: formatIST(future.entryCloseTime) },
        { label: "Choices", value: String(choices.length) },
        { label: "Placed", value: `${(future.totalCoinsPlaced ?? 0).toLocaleString()} coins` },
      ]}
      actionLabel={closed ? "Your bets" : "Place bet"}
    >
      {() => (
        <>
          {future.eventDescription ? (
            <p className="mb-3 text-sm text-zinc-400">{future.eventDescription}</p>
          ) : null}
          {closed ? null : (
            <BetForm
              // Hidden choices still hold coins, so they're shown, but they refuse bets.
              options={choices.map((c) => ({
                value: c._id,
                label: c.choiceName,
                odds: c.odds,
                disabled: c.isVisible === false,
              }))}
              onPlace={async (futureChoiceId, coinsBet) => {
                await appUserRequest(userId, "POST", `futures/submitBet/${future._id}`, {
                  futureChoiceId,
                  coinsBet,
                });
                setVersion((v) => v + 1);
                onBet?.();
                return `Bet ${coinsBet.toLocaleString()} coins on ${nameOf(futureChoiceId)}.`;
              }}
            />
          )}
          <YourBets
            userId={userId}
            path={`futures/${future._id}/userBet`}
            version={version}
            describe={(bet) =>
              typeof bet.futureChoiceId === "object"
                ? (bet.futureChoiceId?.choiceName ?? "—")
                : nameOf(bet.futureChoiceId ?? "")
            }
          />
        </>
      )}
    </PlayCard>
  );
}
