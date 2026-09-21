import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, transition, evaluate, preset, makeRecord } from '../../src/components/thinkpad/simulation.ts';
const act = (state, type, chapter = 'software', extra = {}) => transition(state, { type, chapter, ...extra });
test('stopping software preserves computer/file; a NEW request fails and restart/retry succeeds', () => {
  let s = act(initialState(), 'request');
  const old = s.scenarios.software.record;
  s = act(s, 'toggle', 'software', { key: 'service' });
  assert.equal(s.scenarios.software.config.host, true);
  assert.equal(s.scenarios.software.config.file, true);
  assert.equal(s.scenarios.software.record, old);
  assert.equal(old.result.ok, true);
  s = act(s, 'request');
  assert.equal(s.scenarios.software.record.result.at, 'service');
  s = act(s, 'toggle', 'software', { key: 'service' });
  s = act(s, 'request');
  assert.equal(s.scenarios.software.record.result.ok, true);
});
test('replacement keeps external folder/file, disconnects mount until explicit repair', () => {
  let s = act(initialState(), 'replace', 'folder');
  assert.equal(s.scenarios.folder.config.file, true);
  assert.equal(s.scenarios.folder.config.edition, 2);
  s = act(s, 'request', 'folder');
  assert.equal(s.scenarios.folder.record.result.at, 'mount');
  s = act(s, 'toggle', 'folder', { key: 'mount' });
  assert.equal(evaluate(s.scenarios.folder.config).ok, true);
});
test('earliest failure never claims inaccessible downstream observations', () => {
  const c = { ...preset('away'), connectivity: false, host: false, service: false, file: false };
  assert.equal(evaluate(c).at, 'connection');
  assert.equal(evaluate({ ...c, connectivity: true }).at, 'route');
  assert.equal(evaluate({ ...c, connectivity: true, tailscale: true, permission: false }).at, 'permission');
  assert.equal(evaluate({ ...c, connectivity: true, tailscale: true }).at, 'host');
  assert.equal(evaluate({ ...c, connectivity: true, tailscale: true, host: true }).at, 'service');
});
test('remote route requires connectivity and permission; local does not need Tailscale', () => {
  assert.equal(evaluate({ ...preset('away'), tailscale: true }).ok, true);
  assert.equal(evaluate({ ...preset('away'), tailscale: true, permission: false }).ok, false);
  assert.equal(evaluate({ ...preset('song'), permission: false }).ok, true);
});
test('snapshot/result immutable; chapter edits isolated and persist until targeted reset', () => {
  let s = act(initialState(), 'request');
  const r = s.scenarios.software.record;
  assert.throws(() => { r.snapshot.service = false; }, TypeError);
  assert.throws(() => { r.result.ok = false; }, TypeError);
  s = act(s, 'toggle', 'software', { key: 'service' });
  s = act(s, 'toggle', 'sandbox', { key: 'host' });
  s = act(s, 'reset', 'sandbox');
  assert.equal(s.scenarios.software.config.service, false);
  assert.equal(s.scenarios.software.record, r);
  assert.equal(s.scenarios.sandbox.config.host, true);
  const next = act(act(s, 'reset'), 'request');
  assert.equal(next.scenarios.software.record.id, 2);
});
test('display is not host power; all binary configurations evaluate deterministically', () => {
  assert.equal(evaluate({ ...preset('song'), display: false }).ok, true);
  const keys = ['host', 'service', 'mount', 'file', 'remote', 'connectivity', 'tailscale', 'permission'];
  for (let mask = 0; mask < 256; mask++) {
    const c = { ...preset('sandbox'), ...Object.fromEntries(keys.map((k, i) => [k, Boolean(mask & (1 << i))])) };
    assert.deepEqual(makeRecord(1, c).result, evaluate(c));
    if (evaluate(c).ok) assert.ok(c.host && c.service && c.mount && c.file && c.connectivity && (!c.remote || (c.tailscale && c.permission)));
  }
});
