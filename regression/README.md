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
