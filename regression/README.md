# regression/ -- real inputs that broke, and who says what the right output is

Every case records (a) where its input was captured: source, time, sha256 of the bytes; and (b) its ORACLE:
the owner's own dated words, a settled real-world outcome, or behaviour the real system showed live. Claude's
judgement is never an oracle. A case without one is labelled characterization: when it changes, run.sh prints
"CHANGED -- review: <case>" and does not fail.

Run: `bash regression/run.sh` (the gate runs it on every push, affected or full; keep it under ~5 min).
A bug fix starts here: capture the real input that broke, write its PROVENANCE.md, see it fail on the old
code, then fix. Never invent or "clean up" an input or an expected output; scrubbing data the repo must not
hold is the one allowed edit, recorded with sha256 before and after.

## Cases
| Case | Input (captured) | Oracle | What must hold |
|---|---|---|---|
| service-times | celebratejesus.org, fetched 2026-11-21 (sha256 in `service-times/PROVENANCE.md`) | the church's own published times | no clock-time literal outside the snapshot; Studio records and the snapshot both render the church's line |
| event-twin-key | the rule in the event-reach design (sections 4.3 and 4.6); the SAME file is held in Studio's repo | the rule's own text (CHARACTERIZATION); the one real input is the church's own Marriage Night day and time | the church wall clock of an instant, the twin key and which pairs are one occasion, byte-identical in both repos (pinned by sha256) |
| event-reach-marriage-night | the church's public eSpace feed, titles and times only, captured 2026-11-22 (`PROVENANCE.md`) | the church's own newsletter words for the day and time | Studio's published event and its eSpace twin are one card, Wed 2 Dec 6:30 PM, in a UTC and an Asia/Tokyo process |
| events-espace-mode | the markup of /events as a visitor got it before the events-reach work | what the page was (CHARACTERIZATION) | in mode `espace` the page is byte-identical, whatever Studio sends |
