// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
vi.mock("@/lib/espace", async (orig) => ({ ...(await orig<typeof import("@/lib/espace")>()), fetchEspaceEvents: vi.fn(async () => []) }));

/** The month grid shows every scheduled Studio event of its month: the 13th too (objection 5: no 12-event limit reaches the calendar). */
afterEach(() => { vi.useRealTimers(); document.body.innerHTML = ""; });

describe("LiveCalendar with Studio events", () => {
  it("the 13th Studio event of the month is in the grid", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-12-10T12:00:00.000Z"));
    const studio = Array.from({ length: 13 }, (_, i) => ({ id: `evt_${i + 1}`, title: `Gathering ${String(i + 1).padStart(2, "0")}`, start: `2026-12-${String(i + 2).padStart(2, "0")}T20:00:00.000Z`, allDay: false }));
    const { default: LiveCalendar } = await import("@/components/events/LiveCalendar");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => { root.render(<LiveCalendar studio={studio} />); });
    await act(async () => { await Promise.resolve(); });
    const text = host.textContent || "";
    for (let i = 1; i <= 13; i++) expect(text, `Gathering ${i}`).toContain(`Gathering ${String(i).padStart(2, "0")}`);
    await act(async () => root.unmount());
  });
});
