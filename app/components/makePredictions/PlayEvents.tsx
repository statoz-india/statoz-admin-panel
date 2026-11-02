"use client";

import { useState } from "react";
import type { PlayEvent } from "@/app/interface/app-user.interface";
import { appUserRequest } from "@/app/utils/appUsers";
import { BetForm, formatIST, PlayCard, PlayList, usePlayList, YourBets, type BetOption } from "./playUi";

type Props = { userId: string; onCoinsChanged: () => void };

// Every event the backend sends is shown; the backend decides whether a bet is accepted.
const showAll = () => true;

function outcomes(event: PlayEvent): BetOption[] {
  const options: BetOption[] = [
    { value: "Y", label: event.yesPlaceholder || "Yes", odds: event.oddsYes },
    { value: "N", label: event.noPlaceholder || "No", odds: event.oddsNo },
  ];
  if (event.haveThreeOptions) {
    options.push({ value: "M", label: event.maybePlaceholder || "Maybe", odds: event.oddsMaybe });
  }
  return options;
}

export default function PlayEvents({ userId, onCoinsChanged }: Props) {
  const list = usePlayList<PlayEvent>("/api/events/active", showAll);

  return (
    <PlayList list={list} noun="events">
      {list.items.map((event) => (
        <EventCard
          key={event._id}
          userId={userId}
          event={event}
          onBet={() => {
            onCoinsChanged();
            list.reload();
          }}
        />
      ))}
    </PlayList>
  );
}

function EventCard({
  userId,
  event,
  onBet,
}: {
  userId: string;
  event: PlayEvent;
  onBet: () => void;
}) {
  const [version, setVersion] = useState(0);
  const options = outcomes(event);
  const labelOf = (value?: string) => options.find((o) => o.value === value)?.label ?? value ?? "—";

  return (
    <PlayCard
      title={event.eventName}
      subtitle={[event.eventId, event.tournamentData?.tournamentName].filter(Boolean).join(" · ")}
      status={event.eventStatus}
      meta={[
        { label: "Entry closes", value: formatIST(event.entryCloseTime) },
        { label: "Pot", value: `${(event.totalCoins ?? 0).toLocaleString()} coins` },
      ]}
      actionLabel="Place bet"
    >
      {() => (
        <>
          {event.eventDescription ? (
            <p className="mb-3 text-sm text-zinc-400">{event.eventDescription}</p>
          ) : null}
          <BetForm
            options={options}
            allowRandom
            onPlace={async (chosenOption, coinsBet) => {
              await appUserRequest(userId, "POST", `events/submitEventBet/${event._id}`, {
                chosenOption,
                coinsBet,
              });
              setVersion((v) => v + 1);
              onBet();
              return `Bet ${coinsBet.toLocaleString()} coins on ${labelOf(chosenOption)}.`;
            }}
          />
          <YourBets
            userId={userId}
            path={`events/${event._id}/userEventBet`}
            version={version}
            describe={(bet) => labelOf(bet.chosenOption)}
          />
        </>
      )}
    </PlayCard>
  );
}
