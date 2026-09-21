/** Illustrative configuration only. Never connected to the owner's server. */
export const chapterIds = ['opening', 'song', 'software', 'folder', 'away', 'repair', 'sandbox'] as const;
export type ChapterId = typeof chapterIds[number];
export type Configuration = Readonly<{
  host: boolean; service: boolean; display: boolean; mount: boolean; file: boolean;
  remote: boolean; connectivity: boolean; tailscale: boolean; permission: boolean;
  edition: number;
}>;
export type Failure = 'connection' | 'route' | 'permission' | 'host' | 'service' | 'mount' | 'file';
export type Result = Readonly<{ ok: boolean; at: Failure | 'response'; reached: number; explanation: string }>;
export type RequestRecord = Readonly<{ id: number; snapshot: Configuration; result: Result }>;
export type Scenario = Readonly<{ config: Configuration; record: RequestRecord | null; prediction: string | null }>;
export type LessonState = Readonly<{ nextId: number; scenarios: Record<ChapterId, Scenario> }>;
export type Action =
  | { type: 'toggle'; chapter: ChapterId; key: Exclude<keyof Configuration, 'edition'> }
  | { type: 'request' | 'reset' | 'replace'; chapter: ChapterId }
  | { type: 'predict'; chapter: ChapterId; value: string };

export function preset(chapter: ChapterId): Configuration {
  return Object.freeze({ host: true, service: true, display: true, mount: chapter !== 'repair', file: true,
    remote: chapter === 'away', connectivity: true, tailscale: false, permission: true, edition: 1 });
}
export function evaluate(c: Configuration): Result {
  const fail = (at: Failure, reached: number, explanation: string): Result => Object.freeze({ ok: false, at, reached, explanation });
  if (!c.connectivity) return fail('connection', 0, 'The phone has no working connection. It cannot reach the laptop, so this request tells us nothing about the software or files.');
  if (c.remote && !c.tailscale) return fail('route', 1, 'The phone is away from home with no route to this laptop. This example has no public forwarding or alternative remote route.');
  if (c.remote && !c.permission) return fail('permission', 1, 'The private connection is available, but this phone is not permitted to use it. The request stops before reaching the music service.');
  if (!c.host) return fail('host', 1, 'The laptop cannot be reached. The phone cannot tell whether the music software or its files are available.');
  if (!c.service) return fail('service', 2, 'The laptop is reachable, but the music service is unavailable. It cannot answer this new request.');
  if (!c.mount) return fail('mount', 2, 'The service answered, but its media folder is not connected. It cannot read the song through the missing mount.');
  if (!c.file) return fail('file', 3, 'The service can read its media folder, but Paper Boats is not there. It returns a song-not-found response.');
  return Object.freeze({ ok: true, at: 'response', reached: 4, explanation: 'The service read Paper Boats from its folder and returned a response to the phone. The original file stayed on the laptop.' });
}
export function makeRecord(id: number, config: Configuration): RequestRecord {
  const snapshot = Object.freeze({ ...config });
  return Object.freeze({ id, snapshot, result: evaluate(snapshot) });
}
export function initialState(): LessonState {
  return { nextId: 1, scenarios: Object.fromEntries(chapterIds.map(id => [id, { config: preset(id), record: null, prediction: null }])) as Record<ChapterId, Scenario> };
}
export function transition(state: LessonState, action: Action): LessonState {
  const old = state.scenarios[action.chapter];
  let next: Scenario;
  switch (action.type) {
    case 'reset': next = { config: preset(action.chapter), record: null, prediction: null }; break;
    case 'toggle': next = { ...old, config: Object.freeze({ ...old.config, [action.key]: !old.config[action.key] }) }; break;
    case 'replace': next = { ...old, config: Object.freeze({ ...old.config, service: true, mount: false, edition: old.config.edition + 1 }) }; break;
    case 'predict': next = { ...old, prediction: action.value }; break;
    case 'request': next = { ...old, record: makeRecord(state.nextId, old.config) }; break;
  }
  return { nextId: state.nextId + (action.type === 'request' ? 1 : 0), scenarios: { ...state.scenarios, [action.chapter]: next } };
}
export const exampleRecord = makeRecord(0, preset('song'));
export const pathLabels = ['Phone', 'Connection', 'Service', 'Media file', 'Response'] as const;
