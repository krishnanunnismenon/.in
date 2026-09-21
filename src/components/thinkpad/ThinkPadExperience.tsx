'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Component, useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { attachScrollBridge, createNarrative } from './scroll-bridge';
import { chapters, sceneNotes } from './story';
import { exampleRecord, initialState, pathLabels, transition, type ChapterId, type Configuration, type RequestRecord, type Scenario } from './simulation';
import styles from './ThinkPadExperience.module.css';

const Scene = dynamic(() => import('./ThinkPadScene'), { ssr: false, loading: () => <p className={styles.loading}>Preparing the 3D diagram. The experiments below are ready.</p> });
class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}
function Evidence({ record, config }: { record: RequestRecord | null; config: Configuration }) {
  const stale = record && JSON.stringify(record.snapshot) !== JSON.stringify(config);
  return <div className={styles.evidence} aria-live="polite" aria-atomic="true" data-outcome={record?.result.at ?? 'untested'}>
    {record ? <><p className={styles.resultTitle}>{record.result.ok ? 'Song received.' : 'No song this time.'} <span>Request {record.id}</span></p>
      <p>{record.result.explanation}</p>
      {stale && <p className={styles.small}>You changed the example. This saved result has not changed. Make a new request to test it.</p>}
      <details><summary>What this request tested</summary><p className={styles.small}>Phone {record.snapshot.remote ? 'away' : 'at home'} · connection {record.snapshot.connectivity ? 'working' : 'off'} · laptop {record.snapshot.host ? 'on' : 'off'} · service {!record.snapshot.host ? 'unavailable (host off)' : record.snapshot.service ? 'running' : 'stopped'} · folder {record.snapshot.mount ? 'connected' : 'disconnected'} · song {record.snapshot.file ? 'present' : 'absent'}. These are saved simulation settings, not observations made by the phone.</p></details>
    </> : <p className={styles.small}>No request made in this example yet.</p>}
  </div>;
}
function Lightweight({ config, record }: { config: Configuration; record: RequestRecord | null }) {
  return <div className={styles.lightweight}>
    <div className={styles.diagramPhone}>Phone<span>{config.remote ? 'Away' : 'At home'}</span></div>
    <div className={styles.diagramRoute} aria-hidden="true">{config.connectivity && (!config.remote || (config.tailscale && config.permission)) ? '→' : '×'}</div>
    <div className={styles.diagramHost}><strong>Laptop {config.host ? 'on' : 'off'}</strong>
      <span className={!config.service ? styles.unavailable : ''}>Service {!config.host ? 'unavailable' : config.service ? 'running' : 'stopped'}</span>
      <span>Folder {config.mount ? 'connected' : 'disconnected'}</span><span>Song {config.file ? 'stored here' : 'absent'}</span>
    </div>
    <p>{record ? record.result.ok ? 'Response returned. Original file stays.' : `Recorded request stopped: ${record.result.at}.` : 'Illustrative configuration. Make a request to test it.'}</p>
  </div>;
}
export default function ThinkPadExperience() {
  const [state, dispatch] = useReducer(transition, undefined, initialState);
  const [active, setActive] = useState<ChapterId>('opening');
  const [mode, setMode] = useState<'3d' | 'lightweight'>('3d');
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [discovery, setDiscovery] = useState(false);
  const [playback, setPlayback] = useState<{ chapter: ChapterId; request: number; progress: number } | null>(null);
  const [narrative] = useState(createNarrative);
  const reduced = useSyncExternalStore(narrative.subscribe, () => narrative.get().reduced, () => false);
  const root = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null);
  const cancel = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const stopPlayback = useCallback(() => { generation.current++; if (cancel.current) clearTimeout(cancel.current); cancel.current = null; setPlayback(null); }, []);
  useEffect(() => {
    if (!root.current || !stage.current) return;
    const detach = attachScrollBridge(root.current, stage.current, narrative, id => { setActive(id); stopPlayback(); });
    // Hydration is the point at which the otherwise-readable controls become operable.
    const timer = setTimeout(() => setReady(true), 0);
    const epoch = generation;
    return () => { detach(); clearTimeout(timer); epoch.current++; if (cancel.current) clearTimeout(cancel.current); };
  }, [narrative, stopPlayback]);
  const onFailure = useCallback(() => { setFailed(true); setMode('lightweight'); stopPlayback(); }, [stopPlayback]);
  useEffect(() => {
    if (mode !== '3d') return;
    // Probe before loading the heavy renderer; context allocation is released immediately.
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    if (!context) { const timer = setTimeout(onFailure, 0); return () => clearTimeout(timer); }
    context.getExtension('WEBGL_lose_context')?.loseContext();
  }, [mode, onFailure]);
  const scenario = state.scenarios[active];
  const visibleRecord = scenario.record || (active === 'song' ? exampleRecord : null);
  useEffect(() => {
    if (mode !== 'lightweight' || !stage.current) return;
    stage.current.setAttribute('data-sc-verify-state', JSON.stringify({ mode, config: scenario.config, result: visibleRecord?.result.at ?? null }));
    stage.current.setAttribute('data-sc-verify-hold', 'true');
  }, [mode, scenario.config, visibleRecord]);
  const replay = (chapter: ChapterId, record: RequestRecord) => {
    activate(chapter);
    stopPlayback();
    if (reduced || mode === 'lightweight') {
      const details = root.current?.querySelector<HTMLDetailsElement>(`#${chapter} [data-outcome] details`);
      if (details) { details.open = true; details.querySelector('summary')?.focus(); }
      return;
    }
    const token = generation.current;
    let step = 0;
    const advance = () => {
      if (generation.current !== token || document.hidden) { setPlayback(null); return; }
      setPlayback({ chapter, request: record.id, progress: step / 16 });
      if (step++ < 16) cancel.current = setTimeout(advance, 65);
      else cancel.current = setTimeout(() => setPlayback(null), 550);
    };
    advance();
  };
  const activate = (chapter: ChapterId) => { setActive(chapter); if (narrative.get().chapter !== chapter) narrative.set({ ...narrative.get(), chapter, progress: .5 }); };
  const request = (chapter: ChapterId) => { activate(chapter); stopPlayback(); dispatch({ type: 'request', chapter }); };
  const toggle = (chapter: ChapterId, key: Exclude<keyof Configuration, 'edition'>) => { activate(chapter); stopPlayback(); dispatch({ type: 'toggle', chapter, key }); };
  const reset = (chapter: ChapterId) => { activate(chapter); stopPlayback(); dispatch({ type: 'reset', chapter }); };
  const swapMode = () => { stopPlayback(); setMode(mode === '3d' ? 'lightweight' : '3d'); };
  const toggleButton = (id: ChapterId, key: Exclude<keyof Configuration, 'edition'>, on: string, off: string) => <button type="button" disabled={!ready} onClick={() => toggle(id, key)}>{state.scenarios[id].config[key] ? on : off}</button>;
  const configuration = (s: Scenario) => <p className={styles.config}>Laptop {s.config.host ? 'on' : 'off'} · service {s.config.service ? 'running' : 'stopped'} · song {s.config.file ? 'intact' : 'absent'}</p>;
  return <div className={styles.experience} ref={root} onFocusCapture={event => {
    const target = event.target;
    const scene = stage.current;
    if (!target.matches(':focus-visible')) return;
    if (!scene || !target.closest('[data-chapter]') || getComputedStyle(scene.parentElement!).position !== 'sticky' || innerWidth >= 900) return;
    const top = target.getBoundingClientRect().top;
    const bottom = scene.getBoundingClientRect().bottom;
    // Native reverse-Tab may park focus underneath a sticky sibling. Keep it visible.
    if (top < bottom + 12) window.scrollBy({ top: top - bottom - 16, behavior: 'instant' });
  }}>
    <div className={styles.stageColumn}>
      <div ref={stage} className={styles.stage} data-sc-stage data-sc-verify-state="loading" data-renderer={mode === 'lightweight' ? 'lightweight' : 'loading'} data-active-chapter={active}>
        <div className={styles.stageTop}><span>ThinkPad field notes</span><span>Simulation</span></div>
        <div className={styles.canvas} aria-hidden="true" data-scene-box>
          {mode === '3d' && ready ? <SceneBoundary onFailure={onFailure}><Scene narrative={narrative} config={scenario.config} record={visibleRecord} playback={playback?.chapter === active ? playback.progress : null} stage={stage} onFailure={onFailure} /></SceneBoundary> : <Lightweight config={scenario.config} record={visibleRecord} />}
          {mode === '3d' && <div className={styles.annotations}><span data-object-label="service">Software</span><span data-object-label="folder">Files</span><span data-object-label="home">Home network</span></div>}
        </div>
        <div className={styles.sceneLabels} aria-label="Current illustrative configuration"><span>Computer <b>{scenario.config.host ? 'on' : 'off'}</b></span><span>Service <b>{!scenario.config.host ? 'unavailable' : scenario.config.service ? 'running' : 'stopped'}</b></span><span>Song <b>{scenario.config.file ? 'stored' : 'absent'}</b></span></div>
        <p className={styles.sceneNote}>{sceneNotes[active]}</p>
        <div className={styles.stageTools}><button type="button" onClick={swapMode} disabled={!ready || failed}>{mode === '3d' ? 'Lightweight view' : failed ? '3D unavailable · lightweight view' : 'Use 3D view'}</button><button type="button" onClick={() => setDiscovery(!discovery)} aria-expanded={discovery} disabled={!ready}>Why the red dot?</button></div>
        {discovery && <p className={styles.discovery}>The pointing stick is a real ThinkPad feature. This artistic model simplifies its shape. The floating service and folder are ideas, not physical parts inside my laptop.</p>}
      </div>
    </div>
    <div className={styles.reading}>
      <section id="opening" data-chapter="opening" data-sc-act="flow" className={styles.opening}>
        <h1 data-sc-cue="0 1 0 0">A laptop. A server.<br />The same machine.</h1>
        <p data-sc-cue="0 1 0 0">I host music on a ThinkPad. Try this small, imaginary version of how it works.</p>
        <div className={styles.entryLinks}><Link href="#song" prefetch={false}>Follow a song <span aria-hidden="true">↓</span></Link><Link href="#sandbox" prefetch={false}>Explore freely <span aria-hidden="true">↗</span></Link></div>
        <p className={styles.small}>Each question keeps its own example. No real server, audio, or live traffic.</p>
        <nav aria-label="Lesson chapters" className={styles.chapterNav}>{chapters.map(c => <Link key={c.id} href={`#${c.id}`} prefetch={false} aria-current={active === c.id ? 'location' : undefined}>{c.label}</Link>)}</nav>
        <noscript><p>The explanations below work without JavaScript. Enable it to try the experiments.</p></noscript>
      </section>
      {chapters.map(chapter => {
        const id = chapter.id, s = state.scenarios[id];
        return <section key={id} id={id} data-chapter={id} data-sc-act="flow" className={`${styles.chapter} ${id === 'software' ? styles.peak : ''}`} aria-labelledby={`${id}-title`}>
          <h2 id={`${id}-title`} data-sc-cue="0 1 0 0">{chapter.title}</h2>
          <p data-sc-cue="0 1 0 0">{chapter.intro}</p>
          {id === 'song' && <div className={styles.path} aria-label="Request path">{pathLabels.map((label, i) => <span key={label}>{i > 0 && <i aria-hidden="true">→</i>}{label}</span>)}<p>{s.record ? `Scroll traces saved request ${s.record.id}.` : 'Example walkthrough. You have not made this request.'} The response is a conceptual trace, not captured packets.</p></div>}
          {id === 'software' && <>
            <fieldset className={styles.predict}><legend>What will happen to the stored song?</legend>{['It stays on the laptop', 'It disappears'].map(value => <label key={value}><input type="radio" name="prediction" checked={s.prediction === value} disabled={!ready} onChange={() => dispatch({ type: 'predict', chapter: id, value })} />{value}</label>)}</fieldset>
            <div className={styles.actions}>{toggleButton(id, 'service', 'Stop music service', 'Restart music service')}</div>
            {configuration(s)}
            {!s.config.service && <p className={styles.observation}>The service has stopped. The laptop is still on, and the stored song is intact. Test a new request.</p>}
            {s.record && s.prediction && <p className={styles.small}>Your prediction: {s.prediction.toLowerCase()}. Stopping this service does not delete the host’s file.</p>}
          </>}
          {id === 'folder' && <><div className={styles.actions}><button disabled={!ready} type="button" onClick={() => { activate(id); stopPlayback(); dispatch({ type: 'replace', chapter: id }); }}>Replace service</button>{toggleButton(id, 'mount', 'Disconnect folder', 'Reconnect folder')}</div><p className={styles.config}>Service version {s.config.edition} · folder {s.config.mount ? 'connected' : 'disconnected'} · song intact</p><details><summary>Why does the file survive?</summary><p>We deliberately store it in a folder on the host, outside the example service. A mount lets the service read that folder. Data kept only inside a removed container may be lost. A mount is not a backup.</p></details></>}
          {id === 'away' && <><div className={styles.actions}>{toggleButton(id, 'remote', 'Bring phone home', 'Take phone away')}{toggleButton(id, 'tailscale', 'Disable private connection', 'Enable Tailscale example')}</div><p className={styles.config}>Phone {s.config.remote ? 'away from home' : 'at home'} · private connection {s.config.tailscale ? 'available' : 'off'}</p><details><summary>What does Tailscale change?</summary><p>It can provide a private route between permitted devices with working connectivity. Actual paths may be direct or relayed. It does not move the music into cloud storage. This example has no public forwarding or other remote route.</p></details></>}
          {id === 'repair' && <details className={styles.fault}><summary>Inspect this example</summary><p>The laptop is on. Its service is running. The host folder still contains Paper Boats, but the service’s mount is disconnected. These are local configuration clues, not extra knowledge the phone gained.</p><div className={styles.actions}>{toggleButton(id, 'mount', 'Disconnect folder', 'Reconnect folder')}</div></details>}
          {id === 'sandbox' && <fieldset className={styles.sandbox}><legend>Example settings</legend>{([
            ['host', 'Laptop power'], ['service', 'Music service'], ['mount', 'Folder connected'], ['file', 'Song present'],
            ['remote', 'Phone away from home'], ['connectivity', 'Working connectivity'], ['tailscale', 'Tailscale connection available'], ['permission', 'Private access permitted'],
          ] as const).map(([key, label]) => <label key={key}><input type="checkbox" checked={s.config[key]} disabled={!ready} onChange={() => toggle(id, key)} />{label}<span>{s.config[key] ? 'On' : 'Off'}</span></label>)}</fieldset>}
          <div className={styles.actions}><button type="button" className={styles.primary} disabled={!ready} onClick={() => request(id)}>{s.record ? 'Make a new request' : 'Request Paper Boats'}</button><button type="button" className={styles.reset} disabled={!ready} onClick={() => reset(id)}>Reset example</button></div>
          <Evidence record={s.record} config={s.config} />
          {s.record && <button className={styles.replay} type="button" disabled={!ready} onClick={() => replay(id, s.record!)}>{mode === '3d' && !reduced ? 'Replay saved request' : 'Review saved request'}</button>}
          {id === 'song' && <details><summary>What makes it a server?</summary><p>Its job: software listens for a request and responds. The phone is the client asking for the song. “Server” can mean the software or the computer doing that job.</p></details>}
          {id === 'sandbox' && <><div className={styles.actions}>{toggleButton(id, 'display', 'Turn display off', 'Turn display on')}</div><p className={styles.small}>Display {s.config.display ? 'on' : 'off'}. Switching the display off leaves the simulated laptop running. A real laptop’s sleep and lid settings can behave differently.</p><p className={styles.ending}>That is the whole idea. A computer, some software, a file, and a way to reach them.</p><div className={styles.entryLinks}><Link href="#song" prefetch={false}>Revisit the song</Link><Link href="/">Return home</Link></div></>}
        </section>;
      })}
    </div>
  </div>;
}
