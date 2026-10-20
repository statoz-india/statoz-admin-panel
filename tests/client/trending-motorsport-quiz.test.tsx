// @vitest-environment jsdom

/**
 * Motorsport quizzes in the trending list: shown by race, flagged when hidden
 * (players still see them), added by picking a race and then its quiz, and
 * saved as `motorsportQuiz` with the whole list.
 */

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TrendingMatchesTab from "@/app/components/trending/TrendingMatchesTab";
import { fetchCall, jsonResponse, mockFetch } from "../helpers/http";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

const US_GP = {
  _id: "race-us",
  matchId: "F1-R19",
  name: "United States Grand Prix",
  tournament: "F1",
  matchStatus: "Upcoming",
  raceStartTime: "2026-10-25T19:00:00.000Z",
};

const SAVED_QUIZ = {
  _id: "6716a0",
  type: "motorsportQuiz",
  order: 3,
  data: {
    _id: "quiz-saved",
    quizId: "F1-R19-Q1",
    quizStatus: "UPCOMING",
    isVisible: false,
    entryStartTime: "2026-10-24T10:00:00.000Z",
    questionCount: 5,
    gameType: "racing",
    raceStartTime: "2026-10-25T19:00:00.000Z",
    matchId: "race-us",
    tournament: "tournament-id",
    match: US_GP,
    createdBy: "65aa",
  },
};

const MEXICO_GP = {
  _id: "race-mx",
  matchId: "F1-R20",
  name: "Mexico City Grand Prix",
  tournament: "F1",
  matchStatus: "Upcoming",
  isVisible: true,
  raceStartTime: "2026-11-01T20:00:00.000Z",
};

/** A panel with one saved race quiz, the Mexico race, and its one quiz. */
function panel({ mexicoQuizzes = [{ _id: "quiz-mx", quizId: "F1-R20-Q1", quizStatus: "UPCOMING", questionCount: 1 }] } = {}) {
  return mockFetch((url, init) => {
    const method = (init.method ?? "GET").toUpperCase();
    if (url === "/api/trending" && method === "GET") return jsonResponse({ success: true, data: { items: [SAVED_QUIZ] } });
    if (url === "/api/trending" && method === "PUT") return jsonResponse({ success: true, data: { items: [] } });
    if (url.startsWith("/api/match/motorsport?") && url.includes("matchStatus=Upcoming")) {
      return jsonResponse({ success: true, data: { items: [US_GP, MEXICO_GP] } });
    }
    if (url === "/api/quiz/motorsport/race/race-mx") return jsonResponse({ success: true, data: mexicoQuizzes });
    if (url === "/api/quiz/motorsport/race/race-us") {
      return jsonResponse({ success: true, data: [{ ...SAVED_QUIZ.data, isVisible: true }] });
    }
    return jsonResponse({ success: true, data: [] });
  });
}

async function openRaceQuizPicker(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole("button", { name: "Add item" }));
  await user.selectOptions(screen.getByRole("combobox"), "motorsportQuiz");
}

describe("trending matches", () => {
  it("shows when a match starts, in IST", async () => {
    mockFetch((url) =>
      url === "/api/trending"
        ? jsonResponse({
            success: true,
            data: {
              items: [
                {
                  _id: "t1",
                  type: "match",
                  order: 1,
                  data: {
                    _id: "m1",
                    teamA: { name: "CSK" },
                    teamB: { name: "MI" },
                    tournament: "IPL",
                    matchStatus: "Upcoming",
                    matchStartTime: "2026-10-25T14:00:00.000Z",
                  },
                },
                {
                  _id: "t2",
                  type: "event",
                  order: 2,
                  data: {
                    _id: "e1",
                    eventName: "Top run scorer",
                    tournament: "IPL",
                    eventStatus: "LIVE",
                    entryCloseTime: "2026-10-26T12:30:00.000Z",
                  },
                },
              ],
            },
          })
        : jsonResponse({ success: true, data: [] }),
    );
    render(<TrendingMatchesTab />);

    const row = (await screen.findByText("CSK vs MI")).closest("li")!;
    expect(within(row).getByText("IPL · Upcoming · 25 Oct 2026, 07:30 pm")).toBeInTheDocument();

    const event = screen.getByText("Top run scorer").closest("li")!;
    expect(within(event).getByText("IPL · LIVE · Closes 26 Oct 2026, 06:00 pm")).toBeInTheDocument();
  });
});

describe("trending motorsport quizzes", () => {
  it("shows a saved race quiz by its race, and flags it hidden but still shown", async () => {
    panel();
    render(<TrendingMatchesTab />);

    const row = (await screen.findByText("United States Grand Prix")).closest("li")!;
    expect(within(row).getByText("Race quiz")).toBeInTheDocument();
    expect(within(row).getByText(/F1-R19-Q1 · F1 · UPCOMING · 5 questions · /)).toBeInTheDocument();
    expect(within(row).getByText("Hidden quiz — still shown to players while it's in this list")).toBeInTheDocument();
  });

  it("adds a quiz by picking its race, and saves the whole list as motorsportQuiz", async () => {
    const user = userEvent.setup();
    const fetchMock = panel();
    render(<TrendingMatchesTab />);

    await openRaceQuizPicker(user);
    await user.click(await screen.findByRole("button", { name: /^Mexico City Grand Prix/ }));
    await user.click(await screen.findByRole("button", { name: /F1-R20-Q1/ }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    // The new row is titled by its race, taken from the race picked.
    expect(screen.getByText("Mexico City Grand Prix")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save list" }));

    await waitFor(() => expect(screen.getByText("Trending list saved.")).toBeInTheDocument());
    const put = fetchMock.mock.calls.findIndex(([, init]) => init?.method === "PUT");
    expect(fetchCall(fetchMock, put).body).toEqual({
      trendingMatches: [
        { type: "motorsportQuiz", data: "quiz-saved" },
        { type: "motorsportQuiz", data: "quiz-mx" },
      ],
    });
    // Refetched after the save.
    expect(fetchMock.mock.calls.filter(([url, init]) => url === "/api/trending" && init?.method === "GET")).toHaveLength(2);
  });

  it("blocks adding a quiz that's already in the list", async () => {
    const user = userEvent.setup();
    panel();
    render(<TrendingMatchesTab />);

    await openRaceQuizPicker(user);
    await user.click(await screen.findByRole("button", { name: /^United States Grand Prix/ }));

    const quiz = await screen.findByRole("button", { name: /F1-R19-Q1/ });
    expect(quiz).toBeDisabled();
    expect(within(quiz).getByText("Added")).toBeInTheDocument();
  });

  it("says when a race has no quizzes, and goes back to the races", async () => {
    const user = userEvent.setup();
    panel({ mexicoQuizzes: [] });
    render(<TrendingMatchesTab />);

    await openRaceQuizPicker(user);
    await user.click(await screen.findByRole("button", { name: /^Mexico City Grand Prix/ }));

    expect(await screen.findByText("No quizzes for this race.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "All races" }));
    expect(await screen.findByRole("button", { name: /^Mexico City Grand Prix/ })).toBeInTheDocument();
  });

  it("finds race quizzes in the list by race name or quiz id", async () => {
    const user = userEvent.setup();
    panel();
    render(<TrendingMatchesTab />);

    const search = await screen.findByLabelText("Search trending items by team, race or tournament");
    await user.type(search, "f1-r19-q1");
    expect(screen.getByText("United States Grand Prix")).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "monaco");
    expect(screen.getByText("No trending items match that search.")).toBeInTheDocument();
  });
});
