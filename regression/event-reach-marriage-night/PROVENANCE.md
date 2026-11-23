# event-reach-marriage-night (the website half of the golden scenario)

Replayed by `tests/event-reach-golden.test.ts` in a UTC process and an Asia/Tokyo process.

## Inputs
- `events.json`: what Studio's public `/api/content/events` sends for one published event, Marriage Night, Wed 2 Dec 2026
  6:30 PM Central (`start_date` 2026-12-03T00:30:00.000Z). The shape is the design's payload for one event; the day and time
  are the church's own words. CHARACTERIZATION for every other field.
- `espace-sample.json`: the church's public eSpace calendar feed, titles and times only (description, creators and ids dropped),
  window 2026-11-30 to 2026-12-08, captured 2026-11-22 from the endpoint the site already reads
  (`https://app.espace.cool/Public/GetFullCalendarEvents`, ministry 16599, calendar 1774, window 2026-11-29 to 2026-12-31).
  sha256 of the full response as captured: `512530203ec44a88a5d24b3a9a2ff4087e9fe6b0ce2ec1d91232db8f718fede2`.
  It already lists Marriage Night, Wed 2 Dec 2026 18:30, Hays: the real twin.

## Oracle
- The day and time: the church's newsletter text "MARRIAGE NIGHTS ARE BACK ON THE FIRST WEDNESDAY OF EVERY MONTH ... AT 6:30PM"
  (the church's C3 News newsletter, sha256 b8ff0eedea0e29a730816fa689c2f36420c1040d8b8ce12ef90d53e7ab7acb43): the first Wednesday of December 2026 is Wed 2 Dec, 6:30 PM Central.
- Everything else expected (one card, the Studio one kept) is a CHARACTERIZATION of the merge rule in the design.
