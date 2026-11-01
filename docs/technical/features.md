# What you can do in the admin panel

This is a section-by-section guide to the panel. Each section is opened from the sidebar, or with `/?section=<id>`. For how the panel works internally, see [architecture.md](architecture.md).

**Sidebar order:** Dashboard, Users, Payments, Trending, Teams & Tournaments, Matches, Player Dictionary, Events, Futures, Unresolved, Failed Settlements, Leaderboard, Notification, Contact Us, Bot Users, Shop, User Cards, Statoz Games, App Navigation, API Testing. **Signed-in Devices** sits in the sidebar footer next to Logout.

## The core idea

Players in the Statoz app use **coins** and earn **XP** by playing these:

| Game | What players do | Tied to |
| --- | --- | --- |
| **Quiz** | Answer questions about a match: MCQ, Yes/No, numeric or alphabetical | A cricket, football or basketball match, or a race |
| **Prediction** | Bet coins on Team A, Team B or a draw | A match |
| **Event** | Bet coins on Yes or No, with an optional Maybe | A match or a race |
| **Future** | Bet coins on one of several choices, for example "who wins the league" | A tournament |
| **Knowledge quiz** | Play general sports-trivia chapters | A sport |
| **Statoz games** | Play mini-games: Penalty Shootout, Pitch Duel, Football Chess, Final Over, Grand Prix Dash, Hoop Duel, Tennis Rally | A sport |

The admin's job runs through four stages:

1. **Set up.** Create sports, tournaments, teams, matches and players.
2. **Publish.** Create quizzes, predictions, events and futures, and choose what's trending on the home screen.
3. **Settle.** After the real-world result, enter the correct answer or winner, then distribute payouts or XP.
4. **Look after users and the shop.**

---

## Dashboard (`dashboard`)

The landing page. It shows how the app is doing today and over the last 7 days.

- **Overall totals.** All-time counts of users (active, deleted, with cards), quizzes, predictions, events, futures, tournaments and knowledge-quiz questions, plus players and matches for each Statoz game. A tile can jump to the section it counts.
- **Onboarding (day-0 activation).** Pick an onboarding day (IST) to see how many users signed up that day. It also shows how many were active or inactive, the activation rate, total actions and actions per active user.
- **Today's activity.** Quizzes and predictions scheduled today, and events closing today.
- **Submission activity.** Today's count and a 7-day chart for each of:
  - quiz, prediction, event, future and knowledge-quiz submissions
  - each Statoz game played
  - payments created, asset purchases and card acquisitions
- **Quick actions.** Shortcuts to Manage Users, Send Notification, Leaderboard and Matches.
- The **Today submissions** (`/today-submissions`) and **Weekly stats** (`/weekly-stats`) pages give a fuller drill-down.

## Users (`users`)

- A paginated list of every user, with username, email, sign-in provider, coins, status and created date.
- **Search** by name or email.
- Click a user to open their **detail page** (`/users/[id]`):
  - Their profile data and settings flags.
  - **Waitlist → User.** Promote a waitlisted account to a full user.
  - **Gift coins.** Credit coins to the account.
  - **Send a test notification.** Push a notification to this one user, with a title and body.
  - **Activity tabs:**
    - Played quizzes
    - Played predictions
    - Played events
    - Played futures
    - Motorsport quizzes
    - Games (Statoz games played)
    - Assets (profile pics, banners and cards owned)
    - Purchases
    - Coins: a balance-over-time chart (with an optional date range) and every coin change. Filter by credited or debited, and by source; for example, pick *Admin gift* to check past gifts.
    - XP: net XP per day (it can be negative on a day of only mini-game losses) and every XP change. Filter by type and source.
    - Both show exactly what the user sees in their own app history.

## Payments (`payments`)

This section is read-only.

- **Transactions tab.** Every in-app purchase: user, product, amount, coins credited, platform, status and date.
  - Filter by user ID, product ID or status.
  - Expand a row for details.
- **User assets tab.** Assets bought with coins across all users: asset, team, coins and date.

## Trending (`trending`)

Curates what the app's **home screen** highlights. Every tab follows the same pattern: add items, drag to reorder, remove, then **Save**. Saving replaces the whole list, and the panel shows errors next to the row that failed.

| Tab | What it controls |
| --- | --- |
| **Matches** | The mixed trending feed: matches, quizzes, predictions, events, futures, races and race quizzes. The "add" picker offers only items that are currently live or visible in the app. |
| **Games** | The order of Statoz games, sport by sport. |
| **Tournaments** | The curated list of trending tournaments. |
| **Teams** | The curated list of trending teams. |
| **Signup Tournaments** | The tournaments offered during sign-up, one list per sport. |

## Teams & Tournaments (`teamstournaments`)

Sets up the sports structure that everything else hangs off.

- **Games.** The supported sports (cricket, football, basketball, racing, and so on). Pick one to see its tournaments.
- **Tournaments.** Create or edit a tournament: name, short code, season or year, game type, the ICC flag, and its colours.
  - Changing a short code does **not** rename its matches or quizzes.
- **All tournaments.** Search every tournament, and **pin** the ones that appear in the tournament row on other screens.
- **Unassigned.** Tournaments that don't belong to any game yet.
- **Football order.** Drag to set the order of tournament sections in the app's football match feed.
- **Teams** (`section=teams`, opened from a tournament). Create or edit teams: name, display name, short name, description, colours, and the seasons each team plays in.

## Matches (`matches`)

The main working area. It has a team-sports view and a **Motorsport** tab.

### Team sports

- **Tournament row.**
  - **LIVE** shows matches that are live right now, sorted with live first, then upcoming, then other statuses, with finished results last.
  - The other entries are pinned tournaments.
- **Day view.** Pick a date to see every match that day, across all tournaments and sports. You can narrow it down by tournament.
- **Search** across league, teams, match id and tag. Every word must match, so "mumbai chennai" finds that one fixture.
- **Create matches.** Teams, start time, tournament, season and ESPN league name.
- **On each match card:**
  - **Status.** Change it to upcoming, live, result, canceled, abandoned, no result or postponed.
    - **Canceled, abandoned, no result and postponed require a reason.** The reason is shown on the match page.
    - Once a match has a **result**, its status can no longer be changed.
  - **Start time.** Edit it, in IST.
  - **Banner.** Set the match banner.
  - **Fetch status from source.** Look the match up on Cricbuzz, FotMob or Sofascore. The status dialog then opens with the site's status pre-selected.
  - **Match stats.** Load the saved stats, or fetch fresh ones from ESPN. Stats update live over the socket while the match is in play.
- **Match page** (`/match/[id]`). The match's details, entry window, banner, tag and reason, and raw JSON. It also lists every **quiz, prediction and event** on the match, with buttons to **Create quiz**, **Create prediction** and **Create event**.

### Motorsport tab

- A list of races, filterable by tournament, status and visibility. You can create, edit and delete races.
- **Race page** (`/motorsport/[id]`). Race details, weekend dates, and the race's quizzes and events, with buttons to create more.
- **F1 stats.** Fetch race stats from ESPN, by race name and year, and view the charts.
- **Race quiz settlement** (`/motorsport/[id]/quiz/[quizId]`):
  1. Once entries close, save the correct answers.
  2. **Settle.** This grades every entry, credits XP and notifies players.
  - Settling a large quiz can take minutes. It is safe to run again: a re-run only credits the entries that are left.

## Quizzes (opened from a match)

The **quiz page** (`/quiz/[id]`) has these tabs:

- **Settle quiz.**
  1. Enter or select the correct answer for each question.
  2. Save. The quiz moves to *answer updated*.
  3. Settle. The quiz moves to *settlement done* and pays out.
  - **Auto-answer.** Fetch answers from Cricbuzz, FotMob or Sofascore. They fill the form for you to check before saving.
- **Edit quiz.** Questions, options and question type. The tournament and match can't be changed, and editing is blocked once the match has started.
- **Status.** Set upcoming, live, finished, settlement done, abandoned, no result, not enough data, cancelled or postponed. Settlement done, abandoned and no result are final.
- **Graph.** How users answered.
- **User submissions** (`/quiz/[id]/userSubmissions`). Each user's responses.
- **JSON.** The raw quiz and submissions JSON.

## Predictions (opened from a match)

On the **prediction page** (`/prediction/[id]`) you can:

- see the odds, the coins on each side and on a draw, and the total
- see every participant: team chosen, coins bet, coins won, payout status
- **set the winning team**: Team A, Team B, a draw (football only), or no team
- **distribute payouts**
- change the status
- auto-fetch the result from a source, to pre-fill the winner

## Events (`events`)

- List and create events. An event is a Yes/No question, with an optional Maybe, linked to a match or a race. It has an entry window, images and option labels.
- On the **event page** you can:
  - edit the details
  - change the status
  - set the **winning option**
  - **distribute payouts**
  - view every user's bet

## Futures (`futures`)

- List and create futures. A future is a long-running bet on a tournament, such as "who wins the league". It has choices, an entry window, images and colours.
- On the **future page** you can:
  - edit the details
  - add or edit choices, including their odds and starting coins
  - change the status
  - set the **correct choice**
  - **distribute payouts**
  - view bets, with a graph

## Unresolved (`unresolved`)

The settlement worklist: everything that has finished but hasn't been settled yet. An empty list is the goal.

A switch at the top picks between two lists:

- **Pending settlement** (the default) is described below.
- **Marked unresolved** (`unresolvedList=marked`) shows the quizzes, predictions and events an admin marked UNRESOLVED. Those items are left out of Pending settlement, so this is where they are followed up. The rows and actions are the same, and there is no Matches tab. Declaring a result, or changing the status on the item's page, takes an item off this list.

| Tab | Shows | What you can do inline |
| --- | --- | --- |
| **Quizzes** | Quizzes waiting for settlement | Settle |
| **Predictions** | Predictions waiting for a winner or payout | Set the winning team, then distribute payouts |
| **Events** | Events waiting for a result or payout | Set the result, then distribute payouts |
| **Matches** | Matches that started but have no final status | Mark as result, canceled, abandoned or no result |

- Filter by game type, tournament and status. Each filter shows a count.
- Rows show how long ago the item started, the coins at stake (not counting seed coins) and how many submissions are affected.
- Settling cannot be undone. Settled rows disappear from the list.

## Failed Settlements (`failedsettlements`)

When a match ends, the backend asks the settlement service to settle each quiz, prediction and event. This screen lists the ones the service rejected or never answered.

- Filter by **Open** (not accepted yet), **Resolved** (a later request was accepted) or **All**, and by kind: quiz, prediction or event.
- Each row shows the item's readable id, its current status, the ESPN event, the number of attempts, the last error (the service's HTTP status, or timeout / network), when it first and last failed, and when it was resolved.
- Click a row to open the item's page and settle it there. A deleted item has no link.
- How to read the rows:
  - The backend retries on its own, waiting 1, 2, 4… up to 30 minutes between attempts. A row with a few attempts may sort itself out.
  - **Resolved** means the service accepted a request, not that payouts are finished.
  - Settling an item by hand does not close its row. It shows as **Settled manually** and is greyed out.
  - Many timeouts at once usually mean the settlement service is down. The screen warns when 3 or more on a page timed out.
  - A 4xx from the service usually points at the item or its ESPN game.

## Leaderboard (`leaderboard`)

- **Tournament view.** Choose a tournament to see players ranked by tournament XP and total XP.
- **Coins view.** The overall coins leaderboard.

## Player Dictionary (`playerdictionary`)

The master list of players. Quizzes and the app use it.

- Search and filter by tournament, team and season.
- Add, edit and delete players: name, abbreviation, code, description, images, and **teams by season**. A player can be on two teams in one season, for example after a mid-season transfer.

## Notification (`notification`)

**Broadcast** a push notification to **all users**. A broadcast includes:

- title and body
- optional image URL
- Android and iOS sounds
- optional data payload

To notify a single user, use their user page.

## Contact Us (`contactus`)

Messages users sent from the app, newest first, 20 per page. Filter by issue type: Bug, Feature request, Data mismatch or Shoutout. Messages from deleted accounts are marked.

## Bot Users (`botusers`)

AI opponents for card games.

- **Create bots**, with name, email, avatar, banner and coins.
- Open a bot to:
  - see its player and action cards
  - **assign a starter pack**
  - **create decks**
  - **set the active deck**

## Shop (`shop`)

What players can buy in the in-app shop.

- **Player cards.** Create and edit cards: player, team, rating, tier and category, sport, image and price. You can filter the list.
- **Action cards.** Create and edit cards: name, power, description template (for example "Deal {power} attack") and icon.
- **Profile pics** and **Banners.** Browse the whole catalogue or only the paid items, filter by team, and sort by coin value. You can create and edit items.

## User Cards (`usercards`)

A read-only view of each user's collection: player cards, action cards and the decks they've built.

## Statoz Games (`statoz_games`)

- **Games.** The catalogue of mini-games. You can:
  - create or edit a game: title, unique slug, sport and quick-play flag
  - set each sport's **display order**, by dragging or with the arrows
- **One tab per game:** Penalty Shootout, Pitch Duel, Football Chess, Final Over, Grand Prix Dash, Hoop Duel and Tennis Rally.
  - Each tab is a results table. Filter by user, opponent, difficulty and status.
  - Click a row to see the full game, such as rounds, turns, score and result.
- **Knowledge Quiz.** The trivia game:
  - **Sports.** The sport quizzes shown on the app's home screen.
  - **Questions** (`/knowledge-quiz/all`). The question bank. You can search, filter, create and edit questions.
  - **Chapters (sets).** Each chapter has a sport, difficulty, chapter number, entry coins, reward, star thresholds and attached questions. Chapter numbers are unique within each sport and difficulty.
  - **Submissions** (`/knowledge-quiz/submissions`). Every play: player, chapter, stars and each answer given.

## App Navigation (`appnavigation`)

Controls the app's navigation without shipping a new release.

- **Default config.** The lists of **Tabs**, **Navbar** items, **Shop tabs** and **Matches tabs**. Every app build uses it unless it has an override.
- **Version overrides.** Give one exact build (Android or iOS, plus a version) its own config.
  - An override **replaces** the default entirely. It is never merged with it.
  - To target a different build, delete the override and create a new one.
- **Preview.** Enter an OS and version to see which config that build would get.

## API Testing (`apitesting`)

A developer tool for calling the backend.

- **Paste a cURL command**, using a full URL or a backend path. It is sent through the panel with **your admin session** attached.
- The panel shows the status, headers and response, with JSON pretty-printed.
- **History.** Previous requests are saved in the browser and can be re-sent.
- **Copy cURL.** Copy a request as a cURL command. The session token is replaced by an `<ACCESS_TOKEN>` placeholder.
- **ESPN summary helper.** Fetch an ESPN match summary by league and event id. No session is needed.
- Absolute URLs are sent to whatever host they name, **with your session token**. Use this tool with care.

## Signed-in Devices (`devices`, in the sidebar footer)

- Every browser and phone signed in to your admin account: device, app version, when it signed in and when it was last used. Your current browser is marked "This browser".
- **Sign out** a single device, **sign out all other devices**, or **sign out everywhere**.
- The panel keeps up to 5 sessions per account, so signing in on a 6th device signs out the least recently used one.

---

## Common workflows

**A new tournament starts**

1. Teams & Tournaments: create the tournament under its game, then create or attach its teams. Pin the tournament if it should appear in the tournament row.
2. Player Dictionary: add the players, with their team for this season.
3. Matches: create the fixtures.
4. Trending: add the tournament or its teams to the curated lists, and to Signup Tournaments if it should be offered at sign-up.

**Before a match**

1. Open the match from Matches, then use **Create quiz**, **Create prediction** and **Create event**.
2. Optionally add the match, or its quiz or prediction, to Trending → Matches.

**After a match**

1. Matches: set the status to **result**, or to canceled, abandoned, no result or postponed with a reason. "Fetch status from source" can pre-fill it.
2. Unresolved: work through each tab, on both lists.
   - Quizzes: auto-answer, check the answers, then settle.
   - Predictions: set the winner, then pay out.
   - Events: set the result, then pay out.
3. Failed Settlements: check for open rows. A row that keeps failing needs settling by hand from the item's page.
4. Futures are settled from their own page once the tournament has a result.

**A user reports a problem**

1. Read it in Contact Us.
2. Find the user in Users.
3. Check their Activity tabs and Purchases.
4. Gift coins or send them a notification if needed.
