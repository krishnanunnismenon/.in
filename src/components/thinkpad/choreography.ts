import type { Narrative } from './scroll-bridge';
import type { Configuration, RequestRecord } from './simulation';
export type Point = [number, number, number];
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export function pose(n: Narrative, c: Configuration, record: RequestRecord | null, playback: number | null) {
  // Stable reduced-motion composition; the request marker advances in discrete steps only.
  const p = n.reduced || n.chapter === 'sandbox' ? .65 : Math.min(1, n.progress / .72);
  const exploded = ['software', 'folder', 'repair', 'sandbox'].includes(n.chapter);
  const lift = exploded ? mix(.85, 1.55, p) : n.chapter === 'song' ? mix(.08, 1.05, p) : .08;
  const phone: Point = [c.remote ? -3.6 : -2.5, .17, n.mobile ? 1.35 : .9];
  const service: Point = [.18, .23 + lift, .1];
  const folder: Point = [1.35, .18 + lift * .38, .7];
  const camera: Point = n.mobile ? [0.5 + (n.chapter === 'opening' ? 0 : p * .3), 6.9 - (exploded ? p * .5 : 0), 8.8] : [5.2 - p * .7, 5.5 + (exploded ? p * .8 : 0), 8.2];
  const trace = playback ?? (n.chapter === 'song' ? n.progress : 1);
  const recordedPhone: Point = [record?.snapshot.remote ? -3.6 : -2.5, .17, n.mobile ? 1.35 : .9];
  const steps: Point[] = [recordedPhone, [-1.65, .22, .8], service, folder, recordedPhone];
  const end = record?.result.reached ?? 4;
  const at = Math.min(end, Math.max(0, trace * 4));
  const index = Math.min(3, Math.floor(at));
  const t = n.reduced ? 0 : at - index;
  const marker: Point = at >= 4 ? recordedPhone : steps[index].map((v, axis) => mix(v, steps[index + 1][axis], t)) as Point;
  return { camera, phone, service, folder, marker, lift, exploded, boundary: n.chapter === 'away' || n.chapter === 'sandbox', hold: n.reduced || (n.mobile && n.chapter === 'opening') || n.chapter === 'sandbox' || (n.progress >= .72 && n.chapter !== 'song'), trace: at };
}
