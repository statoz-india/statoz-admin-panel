"use client";

import { useMemo, useState } from "react";
import type { MatchStatsDocument } from "@/app/interface/match-stats.interface";
import {
  ComparisonStatsTable,
  CappedList,
  EmptyNote,
  Field,
  JsonDump,
  SectionCard,
  TabBar,
  asArray,
  asRecord,
  dash,
  formatFetchedAt,
  formatLocation,
  teamLabel,
  useCappedRows,
} from "./match-stats-ui";

function StatsHeader({
  details,
  fetchedAt,
  espnId,
  gameType,
}: {
  details: Record<string, unknown> | null;
  fetchedAt?: string | null;
  espnId?: string | null;
  gameType?: string | null;
}) {
  const score = asRecord(details?.score);
  const home = teamLabel(score?.home, "Home");
  const away = teamLabel(score?.away, "Away");
  const homeScore = asRecord(score?.home)?.score;
  const awayScore = asRecord(score?.away)?.score;
  const winner = score?.winner;
  const location = asRecord(details?.location);

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {[details?.league, details?.leagueAbbreviation, details?.season]
              .filter((v) => v != null && String(v).trim() !== "")
              .map(String)
              .join(" · ") || dash(details?.formatName ?? details?.gameNote)}
          </p>
          <h3 className="mt-1 text-xl font-bold text-white">
            {dash(score?.display)}
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            <span className="text-white">
              {home.name}
              {home.abbr ? ` (${home.abbr})` : ""}
              {homeScore != null ? ` ${dash(homeScore)}` : ""}
            </span>
            <span className="mx-2 text-zinc-600">vs</span>
            <span className="text-white">
              {away.name}
              {away.abbr ? ` (${away.abbr})` : ""}
              {awayScore != null ? ` ${dash(awayScore)}` : ""}
            </span>
            {winner != null && String(winner) !== "" ? (
              <span className="ml-2 text-emerald-300">
                · Winner: {String(winner)}
              </span>
            ) : null}
          </p>
        </div>
        <div className="text-right text-sm">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <p className="font-medium text-white">{dash(details?.status)}</p>
            {details?.completed === true && (
              <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Completed
              </span>
            )}
            {location?.neutralSite === true && (
              <span className="rounded-full bg-amber-900/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                Neutral
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Last fetch {formatFetchedAt(fetchedAt ?? undefined)}
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Venue" value={formatLocation(details?.location)} />
        <Field label="Attendance" value={dash(details?.attendance)} />
        <Field label="ESPN id" value={dash(espnId)} />
        <Field label="Game type" value={dash(gameType)} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Football                                                            */
/* ------------------------------------------------------------------ */

function FootballStats({ summary }: { summary: Record<string, unknown> }) {
  const details = asRecord(summary.matchDetails);
  const score = asRecord(details?.score);
  const home = teamLabel(score?.home, "Home");
  const away = teamLabel(score?.away, "Away");
  const topStats = asArray(summary.topStats);
  const timeline = asArray(summary.timeline);
  const teams = asArray(summary.teams);
  const commentary = asArray(summary.commentary);
  const momenta = asRecord(summary.momentum);
  const series = asArray(momenta?.series);

  const tabs = [
    { id: "info", label: "Info" },
    { id: "stats", label: "Stats", hidden: topStats.length === 0 },
    { id: "timeline", label: "Timeline", hidden: timeline.length === 0 },
    { id: "lineups", label: "Lineups", hidden: teams.length === 0 },
    { id: "momentum", label: "Momentum", hidden: series.length === 0 },
    { id: "commentary", label: "Commentary", hidden: commentary.length === 0 },
  ];
  const [tab, setTab] = useState("info");
  const active = tabs.find((t) => t.id === tab && !t.hidden)?.id ?? "info";

  const timelineRows = useCappedRows(timeline, 50);
  const sortedCommentary = useMemo(() => {
    return [...commentary].sort((a, b) => {
      const sa = Number(asRecord(a)?.sequence ?? 0);
      const sb = Number(asRecord(b)?.sequence ?? 0);
      return sa - sb;
    });
  }, [commentary]);
  const commentaryRows = useCappedRows(sortedCommentary, 40);

  return (
    <div className="space-y-4">
      <TabBar tabs={tabs} active={active} onChange={setTab} />

      {active === "info" && (
        <div className="space-y-4">
          <SectionCard title="Match info">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="League" value={dash(details?.league)} />
              <Field label="Season" value={dash(details?.season)} />
              <Field label="Kick-off" value={dash(details?.kickoff ?? details?.date)} />
              <Field label="Time (UTC)" value={dash(details?.time)} />
              <Field label="Status" value={dash(details?.status)} />
              <Field label="Completed" value={dash(details?.completed)} />
              <Field label="Venue" value={formatLocation(details?.location)} />
              <Field
                label="Neutral site"
                value={dash(asRecord(details?.location)?.neutralSite)}
              />
              <Field label="Attendance" value={dash(details?.attendance)} />
              <Field
                label="Home"
                value={`${home.name}${home.abbr ? ` (${home.abbr})` : ""} · ${dash(asRecord(score?.home)?.score)}`}
              />
              <Field
                label="Away"
                value={`${away.name}${away.abbr ? ` (${away.abbr})` : ""} · ${dash(asRecord(score?.away)?.score)}`}
              />
              <Field label="Score" value={dash(score?.display)} />
              <Field label="Winner" value={dash(score?.winner)} />
            </div>
          </SectionCard>

          {asArray(details?.scorers).length > 0 && (
            <SectionCard title="Scorers">
              <div className="overflow-x-auto rounded border border-zinc-700">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900 text-zinc-400">
                    <tr>
                      <th className="px-3 py-2">Min</th>
                      <th className="px-3 py-2">Player</th>
                      <th className="px-3 py-2">Team</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Assist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asArray(details?.scorers).map((row, i) => {
                      const s = asRecord(row);
                      return (
                        <tr key={i} className="border-t border-zinc-800 text-zinc-300">
                          <td className="px-3 py-2">{dash(s?.minute)}</td>
                          <td className="px-3 py-2 text-white">
                            {dash(s?.name)}
                            {s?.shootout ? (
                              <span className="ml-1 text-amber-400">(SO)</span>
                            ) : null}
                          </td>
                          <td className="px-3 py-2">{dash(s?.team)}</td>
                          <td className="px-3 py-2">{dash(s?.type)}</td>
                          <td className="px-3 py-2">{dash(s?.assist)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {active === "stats" && (
        <ComparisonStatsTable
          rows={topStats}
          homeName={home.abbr || home.name}
          awayName={away.abbr || away.name}
          mode="share"
        />
      )}

      {active === "timeline" && (
        <div>
          <div className="space-y-2">
            {timelineRows.visible.map((row, i) => {
              const event = asRecord(row);
              const marker = event?.marker === true;
              if (marker) {
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-400"
                  >
                    <span className="h-px flex-1 bg-cyan-800" />
                    <span>
                      {dash(event?.label ?? event?.kind)}
                      {event?.minute ? ` · ${dash(event.minute)}` : ""}
                    </span>
                    <span className="h-px flex-1 bg-cyan-800" />
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span className="font-mono text-zinc-300">
                      {dash(event?.minute)}
                    </span>
                    <span className="uppercase">{dash(event?.kind)}</span>
                    <span>{dash(event?.team ?? event?.side)}</span>
                    {event?.card != null && (
                      <span className="text-amber-400">{dash(event.card)}</span>
                    )}
                    {asRecord(event?.score)?.display != null && (
                      <span className="text-zinc-400">
                        {dash(asRecord(event?.score)?.display)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-white">
                    {dash(event?.label ?? event?.text)}
                  </p>
                  {(Boolean(event?.player) ||
                    Boolean(event?.assist) ||
                    Boolean(event?.playerIn)) && (
                    <p className="mt-1 text-xs text-zinc-400">
                      {[
                        event?.player,
                        event?.assist ? `A: ${String(event.assist)}` : null,
                        event?.playerIn ? `In: ${String(event.playerIn)}` : null,
                        event?.playerOut
                          ? `Out: ${String(event.playerOut)}`
                          : null,
                      ]
                        .filter(Boolean)
                        .map(String)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <CappedList
            total={timeline.length}
            shown={timelineRows.visible.length}
            expanded={timelineRows.expanded}
            cap={timelineRows.cap}
            onToggle={timelineRows.toggle}
          />
        </div>
      )}

      {active === "lineups" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {teams.map((teamRow, i) => {
            const team = asRecord(teamRow);
            const players = asArray(team?.players);
            const source = team?.source;
            return (
              <SectionCard
                key={i}
                title={`${dash(team?.name)} (${dash(team?.homeAway)})`}
              >
                <div className="mb-3 flex flex-wrap gap-3 text-xs text-zinc-400">
                  <span>Formation: {dash(team?.formation)}</span>
                  <span>
                    Confirmed: {dash(team?.lineupsConfirmed)}
                  </span>
                  {source != null && (
                    <span>
                      Source: {dash(source)}
                      {source !== "roster" ? " (leaders)" : ""}
                    </span>
                  )}
                </div>
                {players.length === 0 ? (
                  <EmptyNote />
                ) : (
                  <ul className="space-y-1 text-sm">
                    {players.map((playerRow, pi) => {
                      const p = asRecord(playerRow);
                      return (
                        <li
                          key={pi}
                          className={`flex gap-2 ${
                            p?.starter ? "text-white" : "text-zinc-400"
                          }`}
                        >
                          <span className="w-8 font-mono text-xs text-zinc-500">
                            {dash(p?.jersey)}
                          </span>
                          <span className="flex-1">
                            {dash(p?.shortName ?? p?.name)}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {dash(p?.positionName ?? p?.position)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </SectionCard>
            );
          })}
        </div>
      )}

      {active === "momentum" && (
        <SectionCard title="Momentum">
          <div className="mb-3 grid gap-3 sm:grid-cols-3">
            <Field label="Total minutes" value={dash(momenta?.totalMinutes)} />
            <Field label="Halftime" value={dash(momenta?.halftimeMinute)} />
            <Field
              label="Teams"
              value={`${dash(asRecord(momenta?.home)?.team)} / ${dash(asRecord(momenta?.away)?.team)}`}
            />
          </div>
          <div className="overflow-x-auto rounded border border-zinc-700">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-3 py-2">Min</th>
                  <th className="px-3 py-2">Home</th>
                  <th className="px-3 py-2">Away</th>
                  <th className="px-3 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {series.slice(0, 60).map((row, i) => {
                  const point = asRecord(row);
                  return (
                    <tr key={i} className="border-t border-zinc-800 text-zinc-300">
                      <td className="px-3 py-2">{dash(point?.minute)}</td>
                      <td className="px-3 py-2">{dash(point?.home)}</td>
                      <td className="px-3 py-2">{dash(point?.away)}</td>
                      <td className="px-3 py-2">{dash(point?.value)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {asArray(momenta?.goals).length > 0 && (
            <div className="mt-3 text-xs text-zinc-400">
              Goals:{" "}
              {asArray(momenta?.goals)
                .map((g) => {
                  const goal = asRecord(g);
                  return `${dash(goal?.clock ?? goal?.minute)} ${dash(goal?.player)} (${dash(goal?.side)})`;
                })
                .join(" · ")}
            </div>
          )}
        </SectionCard>
      )}

      {active === "commentary" && (
        <div>
          <div className="space-y-2">
            {commentaryRows.visible.map((row, i) => {
              const c = asRecord(row);
              return (
                <div
                  key={i}
                  className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-sm"
                >
                  <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span className="font-mono">{dash(c?.minute)}</span>
                    <span className="uppercase">{dash(c?.kind)}</span>
                    <span>{dash(c?.team ?? c?.side)}</span>
                  </div>
                  <p className="mt-1 text-zinc-200">{dash(c?.text)}</p>
                </div>
              );
            })}
          </div>
          <CappedList
            total={sortedCommentary.length}
            shown={commentaryRows.visible.length}
            expanded={commentaryRows.expanded}
            cap={commentaryRows.cap}
            onToggle={commentaryRows.toggle}
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cricket                                                             */
/* ------------------------------------------------------------------ */

function CricketStats({ summary }: { summary: Record<string, unknown> }) {
  const details = asRecord(summary.matchDetails);
  const score = asRecord(details?.score);
  const home = teamLabel(score?.home, "Home");
  const away = teamLabel(score?.away, "Away");
  const innings = asArray(summary.innings);
  const teamStats = asArray(summary.teamStats);
  const scorecard = asArray(summary.scorecard);
  const teams = asArray(summary.teams);
  const notes = asArray(summary.notes);
  const commentary = asArray(summary.commentary);

  const tabs = [
    { id: "info", label: "Info" },
    { id: "innings", label: "Innings", hidden: innings.length === 0 },
    { id: "scorecard", label: "Scorecard", hidden: scorecard.length === 0 },
    { id: "squads", label: "Squads", hidden: teams.length === 0 },
    {
      id: "commentary",
      label: "Commentary",
      hidden: commentary.length === 0 && notes.length === 0,
    },
  ];
  const [tab, setTab] = useState("info");
  const active = tabs.find((t) => t.id === tab && !t.hidden)?.id ?? "info";

  const sortedBalls = useMemo(() => {
    return [...commentary].sort((a, b) => {
      const sa = Number(asRecord(a)?.sequence ?? 0);
      const sb = Number(asRecord(b)?.sequence ?? 0);
      return sa - sb;
    });
  }, [commentary]);
  const ballRows = useCappedRows(sortedBalls, 40);

  const toss = asRecord(details?.toss);

  return (
    <div className="space-y-4">
      <TabBar tabs={tabs} active={active} onChange={setTab} />

      {active === "info" && (
        <div className="space-y-4">
          <SectionCard title="Match info">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Title" value={dash(details?.title)} />
              <Field label="Stage" value={dash(details?.stage)} />
              <Field
                label="Format"
                value={`${dash(details?.formatName ?? details?.format)}`}
              />
              <Field label="League" value={dash(details?.league ?? details?.leagueAbbreviation)} />
              <Field label="Season" value={dash(details?.season)} />
              <Field label="Start" value={dash(details?.start ?? details?.date)} />
              <Field label="End" value={dash(details?.end)} />
              <Field label="Status" value={dash(details?.status)} />
              <Field label="State" value={dash(details?.state)} />
              <Field label="Result" value={dash(details?.result)} />
              <Field label="Series note" value={dash(details?.seriesNote)} />
              <Field
                label="Toss"
                value={
                  toss
                    ? `${dash(toss.team)} elected to ${dash(toss.decision)}`
                    : "—"
                }
              />
              <Field label="Venue" value={formatLocation(details?.location)} />
              <Field label="Score" value={dash(score?.display)} />
              <Field label="Winner" value={dash(score?.winner)} />
            </div>
            {(asRecord(details?.playerOfTheMatch) ||
              asRecord(details?.playerOfTheSeries)) && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field
                  label="Player of the match"
                  value={dash(asRecord(details?.playerOfTheMatch)?.name)}
                />
                <Field
                  label="Player of the series"
                  value={dash(asRecord(details?.playerOfTheSeries)?.name)}
                />
              </div>
            )}
            {asArray(details?.officials).length > 0 && (
              <p className="mt-4 text-xs text-zinc-400">
                Officials:{" "}
                {asArray(details?.officials)
                  .map((row) => {
                    const o = asRecord(row);
                    return `${dash(o?.name)} (${dash(o?.role)})`;
                  })
                  .join(" · ")}
              </p>
            )}
          </SectionCard>

          {teamStats.length > 0 && (
            <SectionCard title="Team stats">
              <ComparisonStatsTable
                rows={teamStats}
                homeName={home.abbr || home.name}
                awayName={away.abbr || away.name}
                mode="plain"
              />
            </SectionCard>
          )}
        </div>
      )}

      {active === "innings" && (
        <div className="space-y-2">
          {innings.map((row, i) => {
            const inn = asRecord(row);
            return (
              <div
                key={i}
                className={`rounded border px-3 py-2 text-sm ${
                  inn?.current
                    ? "border-cyan-700 bg-cyan-950/30"
                    : "border-zinc-800 bg-zinc-900/40"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-white">
                    Innings {dash(inn?.innings)} · {dash(inn?.team)} (
                    {dash(inn?.abbreviation)})
                  </p>
                  <p className="font-mono text-cyan-300">
                    {dash(
                      inn?.score ??
                        `${dash(inn?.runs)}/${dash(inn?.wickets)} (${dash(inn?.overs)})`,
                    )}
                  </p>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {[
                    inn?.target != null && `Target ${inn.target}`,
                    `4s ${dash(inn?.fours)}`,
                    `6s ${dash(inn?.sixes)}`,
                    inn?.description,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {active === "scorecard" && (
        <div className="space-y-4">
          {scorecard.map((block, i) => {
            const card = asRecord(block);
            const batting = asArray(card?.batting);
            const bowling = asArray(card?.bowling);
            const fow = asArray(card?.fallOfWickets);
            const partnerships = asArray(card?.partnerships);
            const dnb = asArray(card?.didNotBat);
            const extras = asRecord(card?.extras);
            return (
              <SectionCard
                key={i}
                title={`${dash(card?.battingTeam)} vs ${dash(card?.bowlingTeam)}`}
              >
                <p className="mb-3 text-sm text-zinc-300">
                  {dash(card?.score)} · RR {dash(card?.runRate)}
                  {card?.target != null ? ` · Target ${dash(card.target)}` : ""}
                  {extras
                    ? ` · Extras ${dash(extras.total)} (b ${dash(extras.byes)}, lb ${dash(extras.legByes)}, wd ${dash(extras.wides)}, nb ${dash(extras.noballs)})`
                    : ""}
                </p>

                {batting.length > 0 && (
                  <div className="mb-4 overflow-x-auto rounded border border-zinc-700">
                    <table className="w-full min-w-max text-left text-xs">
                      <thead className="bg-zinc-900 text-zinc-400">
                        <tr>
                          <th className="px-2 py-2">#</th>
                          <th className="px-2 py-2">Batter</th>
                          <th className="px-2 py-2">Score</th>
                          <th className="px-2 py-2">R</th>
                          <th className="px-2 py-2">B</th>
                          <th className="px-2 py-2">4s</th>
                          <th className="px-2 py-2">6s</th>
                          <th className="px-2 py-2">SR</th>
                          <th className="px-2 py-2">Dismissal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batting.map((row, bi) => {
                          const b = asRecord(row);
                          return (
                            <tr
                              key={bi}
                              className="border-t border-zinc-800 text-zinc-300"
                            >
                              <td className="px-2 py-1.5">{dash(b?.position)}</td>
                              <td className="px-2 py-1.5 text-white">
                                {dash(b?.name)}
                                {b?.notOut ? "*" : ""}
                                {b?.milestone ? (
                                  <span className="ml-1 text-amber-400">
                                    ({dash(b.milestone)})
                                  </span>
                                ) : null}
                              </td>
                              <td className="px-2 py-1.5">{dash(b?.score)}</td>
                              <td className="px-2 py-1.5">{dash(b?.runs)}</td>
                              <td className="px-2 py-1.5">{dash(b?.balls)}</td>
                              <td className="px-2 py-1.5">{dash(b?.fours)}</td>
                              <td className="px-2 py-1.5">{dash(b?.sixes)}</td>
                              <td className="px-2 py-1.5">
                                {dash(b?.strikeRate)}
                              </td>
                              <td className="px-2 py-1.5">{dash(b?.dismissal)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {bowling.length > 0 && (
                  <div className="mb-4 overflow-x-auto rounded border border-zinc-700">
                    <table className="w-full min-w-max text-left text-xs">
                      <thead className="bg-zinc-900 text-zinc-400">
                        <tr>
                          <th className="px-2 py-2">Bowler</th>
                          <th className="px-2 py-2">Figures</th>
                          <th className="px-2 py-2">O</th>
                          <th className="px-2 py-2">M</th>
                          <th className="px-2 py-2">R</th>
                          <th className="px-2 py-2">W</th>
                          <th className="px-2 py-2">Econ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bowling.map((row, bi) => {
                          const b = asRecord(row);
                          return (
                            <tr
                              key={bi}
                              className="border-t border-zinc-800 text-zinc-300"
                            >
                              <td className="px-2 py-1.5 text-white">
                                {dash(b?.name)}
                              </td>
                              <td className="px-2 py-1.5">{dash(b?.figures)}</td>
                              <td className="px-2 py-1.5">{dash(b?.overs)}</td>
                              <td className="px-2 py-1.5">{dash(b?.maidens)}</td>
                              <td className="px-2 py-1.5">{dash(b?.runs)}</td>
                              <td className="px-2 py-1.5">{dash(b?.wickets)}</td>
                              <td className="px-2 py-1.5">{dash(b?.economy)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {fow.length > 0 && (
                  <p className="mb-2 text-xs text-zinc-400">
                    Fall of wickets:{" "}
                    {fow
                      .map((row) => {
                        const f = asRecord(row);
                        return `${dash(f?.wicket)}-${dash(f?.batter)} ${dash(f?.score)} (${dash(f?.overs)})`;
                      })
                      .join(" · ")}
                  </p>
                )}

                {partnerships.length > 0 && (
                  <p className="mb-2 text-xs text-zinc-400">
                    Partnerships:{" "}
                    {partnerships
                      .map((row) => {
                        const p = asRecord(row);
                        return `${dash(p?.wicket)} ${dash(p?.runs)} (${dash(p?.overs)})`;
                      })
                      .join(" · ")}
                  </p>
                )}

                {dnb.length > 0 && (
                  <p className="text-xs text-zinc-500">
                    Did not bat: {dnb.map(String).join(", ")}
                  </p>
                )}
              </SectionCard>
            );
          })}
        </div>
      )}

      {active === "squads" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {teams.map((teamRow, i) => {
            const team = asRecord(teamRow);
            const players = asArray(team?.players);
            return (
              <SectionCard
                key={i}
                title={`${dash(team?.name)} (${dash(team?.homeAway)})`}
              >
                <p className="mb-3 text-xs text-zinc-400">
                  Captain: {dash(team?.captain)} · Keeper: {dash(team?.keeper)}
                </p>
                <ul className="space-y-1 text-sm">
                  {players.map((playerRow, pi) => {
                    const p = asRecord(playerRow);
                    return (
                      <li key={pi} className="flex gap-2 text-zinc-300">
                        <span className="flex-1 text-white">
                          {dash(p?.battingName ?? p?.name)}
                          {p?.captain ? " (c)" : ""}
                          {p?.keeper ? " (wk)" : ""}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {dash(p?.role)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </SectionCard>
            );
          })}
        </div>
      )}

      {active === "commentary" && (
        <div className="space-y-4">
          {notes.length > 0 && (
            <SectionCard title="Notes">
              <ul className="space-y-2">
                {notes.map((row, i) => {
                  const n = asRecord(row);
                  return (
                    <li
                      key={i}
                      className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-sm text-zinc-300"
                    >
                      <span className="mr-2 text-xs uppercase text-zinc-500">
                        {dash(n?.kind)}
                      </span>
                      {dash(n?.text)}
                    </li>
                  );
                })}
              </ul>
            </SectionCard>
          )}
          {sortedBalls.length > 0 ? (
            <div>
              <div className="space-y-2">
                {ballRows.visible.map((row, i) => {
                  const ball = asRecord(row);
                  const required = asRecord(ball?.required);
                  return (
                    <div
                      key={i}
                      className={`rounded border px-3 py-2 text-sm ${
                        ball?.wicket
                          ? "border-rose-800 bg-rose-950/20"
                          : ball?.boundary
                            ? "border-amber-800 bg-amber-950/20"
                            : "border-zinc-800 bg-zinc-900/40"
                      }`}
                    >
                      <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                        <span className="font-mono text-zinc-300">
                          {dash(ball?.over)}
                        </span>
                        <span>Inn {dash(ball?.innings)}</span>
                        <span>
                          {dash(ball?.batter)} · {dash(ball?.bowler)}
                        </span>
                        <span>Runs {dash(ball?.runs)}</span>
                        <span>{dash(ball?.score)}</span>
                        <span>RR {dash(ball?.runRate)}</span>
                      </div>
                      <p className="mt-1 text-zinc-200">
                        {dash(ball?.shortText ?? ball?.text)}
                      </p>
                      {required &&
                        (required.runs != null || required.balls != null) && (
                        <p className="mt-1 text-xs text-zinc-500">
                          Need {dash(required.runs)} off {dash(required.balls)} ·
                          req RR {dash(required.runRate)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <CappedList
                total={sortedBalls.length}
                shown={ballRows.visible.length}
                expanded={ballRows.expanded}
                cap={ballRows.cap}
                onToggle={ballRows.toggle}
              />
            </div>
          ) : (
            notes.length === 0 && <EmptyNote text="No ball-by-ball yet." />
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Basketball                                                          */
/* ------------------------------------------------------------------ */

function shotLine(value: unknown): string {
  const shot = asRecord(value);
  if (!shot) return "—";
  if (shot.made == null && shot.attempted == null) return "—";
  // `pct` is 0–100 in the basketball extractor payload.
  const pct =
    typeof shot.pct === "number"
      ? ` (${Math.round(shot.pct)}%)`
      : "";
  return `${dash(shot.made)}/${dash(shot.attempted)}${pct}`;
}

function BasketballStats({ summary }: { summary: Record<string, unknown> }) {
  const details = asRecord(summary.matchDetails);
  const score = asRecord(details?.score);
  const home = teamLabel(score?.home, "Home");
  const away = teamLabel(score?.away, "Away");
  const lineScore = asRecord(summary.lineScore);
  const topStats = asArray(summary.topStats);
  const teams = asArray(summary.teams);
  const turningPoints = asArray(summary.turningPoints);
  const playByPlay = asArray(summary.playByPlay);
  const injuries = asArray(summary.injuries).filter((row) => {
    const team = asRecord(row);
    return asArray(team?.injuries).length > 0;
  });
  const leaders = asArray(details?.leaders);

  const tabs = [
    { id: "info", label: "Info" },
    {
      id: "lineScore",
      label: "Line score",
      hidden: asArray(lineScore?.periods).length === 0,
    },
    { id: "stats", label: "Stats", hidden: topStats.length === 0 },
    { id: "box", label: "Box score", hidden: teams.length === 0 },
    {
      id: "plays",
      label: "Plays",
      hidden: playByPlay.length === 0 && turningPoints.length === 0,
    },
    { id: "injuries", label: "Injuries", hidden: injuries.length === 0 },
  ];
  const [tab, setTab] = useState("info");
  const active = tabs.find((t) => t.id === tab && !t.hidden)?.id ?? "info";
  const [scoringOnly, setScoringOnly] = useState(true);

  const filteredPlays = useMemo(() => {
    if (!scoringOnly) return playByPlay;
    return playByPlay.filter((row) => asRecord(row)?.scoringPlay === true);
  }, [playByPlay, scoringOnly]);
  const playRows = useCappedRows(filteredPlays, 50);

  return (
    <div className="space-y-4">
      <TabBar tabs={tabs} active={active} onChange={setTab} />

      {active === "info" && (
        <div className="space-y-4">
          <SectionCard title="Match info">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Note" value={dash(details?.gameNote)} />
              <Field label="League" value={dash(details?.league ?? details?.leagueAbbreviation)} />
              <Field label="Season" value={dash(details?.season)} />
              <Field label="Tip-off" value={dash(details?.tipoff ?? details?.date)} />
              <Field label="Status" value={dash(details?.status)} />
              <Field
                label="Live clock"
                value={
                  details?.period != null || details?.clock != null
                    ? `P${dash(details?.period)} ${dash(details?.clock)}`
                    : "—"
                }
              />
              <Field label="Overtime" value={dash(details?.overtime)} />
              <Field label="Venue" value={formatLocation(details?.location)} />
              <Field label="Broadcast" value={dash(details?.broadcast)} />
              <Field
                label="Home"
                value={`${home.name}${home.abbr ? ` (${home.abbr})` : ""} · ${dash(asRecord(score?.home)?.score)}${asRecord(score?.home)?.record ? ` · ${dash(asRecord(score?.home)?.record)}` : ""}`}
              />
              <Field
                label="Away"
                value={`${away.name}${away.abbr ? ` (${away.abbr})` : ""} · ${dash(asRecord(score?.away)?.score)}${asRecord(score?.away)?.record ? ` · ${dash(asRecord(score?.away)?.record)}` : ""}`}
              />
              <Field label="Score" value={dash(score?.display)} />
              <Field label="Margin" value={dash(score?.margin)} />
              <Field label="Winner" value={dash(score?.winner)} />
            </div>
            {asArray(details?.series).length > 0 && (
              <p className="mt-4 text-xs text-zinc-400">
                Series:{" "}
                {asArray(details?.series)
                  .map((row) => {
                    const s = asRecord(row);
                    return dash(s?.summary ?? s?.title);
                  })
                  .join(" · ")}
              </p>
            )}
            {asArray(details?.officials).length > 0 && (
              <p className="mt-2 text-xs text-zinc-400">
                Officials:{" "}
                {asArray(details?.officials)
                  .map((row) => {
                    const o = asRecord(row);
                    return `${dash(o?.name)} (${dash(o?.role)})`;
                  })
                  .join(" · ")}
              </p>
            )}
          </SectionCard>

          {leaders.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {leaders.map((teamRow, i) => {
                const team = asRecord(teamRow);
                return (
                  <SectionCard key={i} title={`Leaders · ${dash(team?.team)}`}>
                    <ul className="space-y-2 text-sm">
                      {asArray(team?.leaders).map((leaderRow, li) => {
                        const leader = asRecord(leaderRow);
                        return (
                          <li
                            key={li}
                            className="flex justify-between gap-3 text-zinc-300"
                          >
                            <span>
                              <span className="text-zinc-500">
                                {dash(leader?.label)} ·{" "}
                              </span>
                              {dash(leader?.name)}
                            </span>
                            <span className="font-semibold text-white">
                              {dash(leader?.value)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </SectionCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {active === "lineScore" && (
        <SectionCard title="Line score">
          <div className="overflow-x-auto rounded border border-zinc-700">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-3 py-2">Team</th>
                  {asArray(lineScore?.periods).map((period, i) => (
                    <th key={i} className="px-3 py-2">
                      {dash(asRecord(period)?.label)}
                    </th>
                  ))}
                  <th className="px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {(["home", "away"] as const).map((side) => {
                  const total = asRecord(lineScore?.[side]);
                  return (
                    <tr key={side} className="border-t border-zinc-800 text-zinc-300">
                      <td className="px-3 py-2 text-white">
                        {dash(total?.abbreviation ?? (side === "home" ? home.abbr : away.abbr))}
                      </td>
                      {asArray(lineScore?.periods).map((period, i) => (
                        <td key={i} className="px-3 py-2">
                          {dash(asRecord(period)?.[side])}
                        </td>
                      ))}
                      <td className="px-3 py-2 font-semibold text-white">
                        {dash(total?.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {active === "stats" && (
        <ComparisonStatsTable
          rows={topStats}
          homeName={home.abbr || home.name}
          awayName={away.abbr || away.name}
          mode="plain"
        />
      )}

      {active === "box" && (
        <div className="space-y-4">
          {teams.map((teamRow, i) => {
            const team = asRecord(teamRow);
            const available = team?.boxscoreAvailable !== false;
            const players = asArray(team?.players);
            const starters = asArray(team?.starters);
            return (
              <SectionCard
                key={i}
                title={`${dash(team?.name)} · ${dash(team?.playedCount)}/${dash(team?.playerCount)} played`}
              >
                {!available ? (
                  <div>
                    <p className="mb-2 text-xs text-amber-400">
                      Full box score not available — starters only.
                    </p>
                    <p className="text-sm text-zinc-300">
                      {starters.map(String).join(", ") || "—"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded border border-zinc-700">
                    <table className="w-full min-w-max text-left text-xs">
                      <thead className="bg-zinc-900 text-zinc-400">
                        <tr>
                          <th className="px-2 py-2">Player</th>
                          <th className="px-2 py-2">MIN</th>
                          <th className="px-2 py-2">PTS</th>
                          <th className="px-2 py-2">REB</th>
                          <th className="px-2 py-2">AST</th>
                          <th className="px-2 py-2">STL</th>
                          <th className="px-2 py-2">BLK</th>
                          <th className="px-2 py-2">TO</th>
                          <th className="px-2 py-2">PF</th>
                          <th className="px-2 py-2">+/-</th>
                          <th className="px-2 py-2">FG</th>
                          <th className="px-2 py-2">3PT</th>
                          <th className="px-2 py-2">FT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {players.map((playerRow, pi) => {
                          const p = asRecord(playerRow);
                          const dnp = p?.didNotPlay === true || p?.minutes == null;
                          return (
                            <tr
                              key={pi}
                              className={`border-t border-zinc-800 ${
                                dnp ? "text-zinc-500" : "text-zinc-300"
                              }`}
                            >
                              <td className="px-2 py-1.5 text-white">
                                <span className="mr-1 font-mono text-zinc-500">
                                  {dash(p?.jersey)}
                                </span>
                                {dash(p?.shortName ?? p?.name)}
                                {p?.starter ? (
                                  <span className="ml-1 text-cyan-400">*</span>
                                ) : null}
                                {p?.ejected ? (
                                  <span className="ml-1 text-rose-400">E</span>
                                ) : null}
                              </td>
                              <td className="px-2 py-1.5">{dash(p?.minutes)}</td>
                              <td className="px-2 py-1.5">{dash(p?.points)}</td>
                              <td className="px-2 py-1.5">{dash(p?.rebounds)}</td>
                              <td className="px-2 py-1.5">{dash(p?.assists)}</td>
                              <td className="px-2 py-1.5">{dash(p?.steals)}</td>
                              <td className="px-2 py-1.5">{dash(p?.blocks)}</td>
                              <td className="px-2 py-1.5">{dash(p?.turnovers)}</td>
                              <td className="px-2 py-1.5">{dash(p?.fouls)}</td>
                              <td className="px-2 py-1.5">{dash(p?.plusMinus)}</td>
                              <td className="px-2 py-1.5">
                                {shotLine(p?.fieldGoals)}
                              </td>
                              <td className="px-2 py-1.5">
                                {shotLine(p?.threePointFieldGoals)}
                              </td>
                              <td className="px-2 py-1.5">
                                {shotLine(p?.freeThrows)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </SectionCard>
            );
          })}
        </div>
      )}

      {active === "plays" && (
        <div className="space-y-4">
          {turningPoints.length > 0 && (
            <SectionCard title="Turning points">
              <div className="space-y-2">
                {turningPoints.map((row, i) => {
                  const tp = asRecord(row);
                  const homeWin =
                    typeof tp?.homeWinPercentage === "number"
                      ? `${Math.round(tp.homeWinPercentage * 100)}%`
                      : "—";
                  const awayWin =
                    typeof tp?.awayWinPercentage === "number"
                      ? `${Math.round(tp.awayWinPercentage * 100)}%`
                      : "—";
                  return (
                    <div
                      key={i}
                      className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-sm"
                    >
                      <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                        <span>
                          P{dash(tp?.period)} {dash(tp?.clock)}
                        </span>
                        <span>
                          {dash(tp?.homeScore)}–{dash(tp?.awayScore)}
                        </span>
                        <span>Swing {dash(tp?.swing)}</span>
                        <span>
                          Win% {homeWin} / {awayWin}
                        </span>
                      </div>
                      <p className="mt-1 text-zinc-200">{dash(tp?.text)}</p>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {playByPlay.length > 0 && (
            <div>
              <label className="mb-3 inline-flex items-center gap-2 text-xs text-zinc-400">
                <input
                  type="checkbox"
                  checked={scoringOnly}
                  onChange={(e) => setScoringOnly(e.target.checked)}
                  className="accent-cyan-500"
                />
                Scoring plays only
              </label>
              <div className="space-y-2">
                {playRows.visible.map((row, i) => {
                  const play = asRecord(row);
                  return (
                    <div
                      key={i}
                      className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-sm"
                    >
                      <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                        <span>
                          P{dash(play?.period)} {dash(play?.clock)}
                        </span>
                        <span className="uppercase">{dash(play?.kind)}</span>
                        <span>
                          {dash(play?.homeScore)}–{dash(play?.awayScore)}
                        </span>
                        {play?.points != null && (
                          <span>+{dash(play.points)}</span>
                        )}
                        {asArray(play?.players).length > 0 && (
                          <span>
                            {asArray(play?.players).map(String).join(" · ")}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-zinc-200">
                        {dash(play?.label ?? play?.text)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <CappedList
                total={filteredPlays.length}
                shown={playRows.visible.length}
                expanded={playRows.expanded}
                cap={playRows.cap}
                onToggle={playRows.toggle}
              />
            </div>
          )}
        </div>
      )}

      {active === "injuries" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {injuries.map((teamRow, i) => {
            const team = asRecord(teamRow);
            return (
              <SectionCard key={i} title={dash(team?.team)}>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {asArray(team?.injuries).map((injuryRow, ii) => {
                    const injury = asRecord(injuryRow);
                    return (
                      <li key={ii}>
                        <span className="text-white">{dash(injury?.name)}</span>
                        <span className="text-zinc-500">
                          {" "}
                          · {dash(injury?.position)} · {dash(injury?.status)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </SectionCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Public result view                                                  */
/* ------------------------------------------------------------------ */

/** Structured summary UI branched only on `gameType` (per docs/summary.md). */
export function MatchSummaryByGameType({
  gameType,
  summary,
  fetchedAt,
  espnId,
  showRawJson = true,
}: {
  gameType: string;
  summary: Record<string, unknown>;
  fetchedAt?: string | null;
  espnId?: string | null;
  showRawJson?: boolean;
}) {
  const details = asRecord(summary.matchDetails);
  const normalized = String(gameType ?? "").toLowerCase();

  return (
    <div className="space-y-4">
      <StatsHeader
        details={details}
        fetchedAt={fetchedAt}
        espnId={espnId}
        gameType={normalized}
      />
      {normalized === "football" && <FootballStats summary={summary} />}
      {normalized === "cricket" && <CricketStats summary={summary} />}
      {normalized === "basketball" && <BasketballStats summary={summary} />}
      {normalized !== "football" &&
        normalized !== "cricket" &&
        normalized !== "basketball" && (
          <p className="text-sm text-amber-300">
            Unsupported gameType for structured stats: {dash(gameType)}
          </p>
        )}
      {showRawJson && <JsonDump value={{ gameType: normalized, ...summary }} />}
    </div>
  );
}

export default function MatchStatsResultView({
  doc,
}: {
  doc: MatchStatsDocument;
}) {
  const summary = asRecord(doc.matchSummary) ?? {};

  return (
    <MatchSummaryByGameType
      gameType={String(doc.gameType ?? "")}
      summary={summary}
      fetchedAt={doc.fetchedAt}
      espnId={doc.espnId}
      showRawJson
    />
  );
}
