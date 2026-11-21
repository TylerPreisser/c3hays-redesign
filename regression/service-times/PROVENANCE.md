# service-times: the church's own published times

Input captured: https://www.celebratejesus.org/ (the church's own site), fetched 2026-11-21 20:30 UTC with curl;
sha256 of the 263,274-byte HTML body is recorded below. The visible text of its two campus blocks read:

    Hays Campus   Saturday - 5pm   Sunday - 8am (C3Gym), 9:00am (with C3Kids) & 10:45am (with C3Kids)
    Colby Campus  Sunday - 10:00am

sha256 (full HTML): b6664e1f51c43f0dcd6c3868d9a95243e285edecd11c99bdd8dbdf918ff9565c

Oracle: the church's own site, a settled real-world publication of its own times (workplan C3-P0W, 2026-11-20 capture;
re-fetched 2026-11-21, same times). `expected.json` is that text restated in the site's `time` format ("5:00 PM").
Not Claude's judgement. 9:30 and 11:00 are the old hard-coded times and must appear nowhere.
Checked by `scripts/check-service-times.mjs <base-url>` and by `tests/service-times.test.ts`.
