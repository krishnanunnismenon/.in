import test from 'node:test';
import assert from 'node:assert/strict';
import { pose } from '../../src/components/thinkpad/choreography.ts';
import { createNarrative } from '../../src/components/thinkpad/scroll-bridge.ts';
import { initialState, preset, makeRecord } from '../../src/components/thinkpad/simulation.ts';
const n = { chapter: 'song', progress: .2, reduced: false, mobile: true, visible: true };
test('fast/reverse progress is deterministic and never changes simulation or recorded result', () => {
  const s = initialState(); const before = JSON.stringify(s); const r = makeRecord(1, preset('song'));
  for (const progress of [0, 1, .9, 0, .5, .2]) pose({ ...n, progress }, s.scenarios.song.config, r, null);
  assert.equal(JSON.stringify(s), before);
  assert.deepEqual(pose(n, preset('song'), r, null), pose(n, preset('song'), r, null));
});
test('reduced motion camera and logical layers stable across progress; no mounted-folder claim on failure', () => {
  const c = preset('repair'); const r = makeRecord(1, c);
  const start = pose({ ...n, chapter: 'repair', reduced: true, progress: 0 }, c, r, null);
  const end = pose({ ...n, chapter: 'repair', reduced: true, progress: 1 }, c, r, null);
  assert.deepEqual(start, end);
  assert.deepEqual(end.marker, end.service);
});
test('old request uses its saved phone location after live edits', () => {
  const r = makeRecord(1, preset('song'));
  const p = pose({ ...n, progress: 1 }, { ...preset('song'), remote: true }, r, null);
  assert.notDeepEqual(p.marker, p.phone);
  assert.equal(p.marker[0], -2.5);
});
test('narrative subscriptions detach and identical snapshots do not notify', () => {
  const store = createNarrative(); let notifications = 0;
  const detach = store.subscribe(() => notifications++);
  store.set(store.get()); assert.equal(notifications, 0);
  store.set(n); assert.equal(notifications, 1);
  detach(); store.set({ ...n, progress: .9 }); assert.equal(notifications, 1);
});
