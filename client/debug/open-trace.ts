/**
 * DIAG ONLY (branch diag/detail-open-perf, never merged): timestamps from a
 * card tap to the details being on screen, shipped to the daemon machine
 * (/tmp/bc-perf) 2.5 s after each tap.
 */
const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

let marks: Array<[string, number]> = [];
let armed = false;
let frames: number[] = [];

export function openMark(name: string): void {
  if (armed) marks.push([name, now()]);
}

export function openTap(send: (data: Record<string, unknown>) => void): void {
  marks = [];
  frames = [];
  armed = true;
  const t0 = now();
  marks.push(["tap", t0]);
  const loop = () => {
    const t = now();
    frames.push(t);
    if (t - t0 < 1500) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  setTimeout(() => {
    armed = false;
    const rel = (t: number) => Math.round((t - t0) * 10) / 10;
    send({ t0, marks: marks.map(([name, t]) => [name, rel(t)]), frames: frames.map(rel) });
  }, 2500);
}
