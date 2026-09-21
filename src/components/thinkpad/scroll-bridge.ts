import type { ChapterId } from './simulation';
export type Narrative = { chapter: ChapterId; progress: number; reduced: boolean; mobile: boolean; visible: boolean };
export function createNarrative() {
  let value: Narrative = { chapter: 'opening', progress: 0, reduced: false, mobile: true, visible: true };
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    subscribe: (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; },
    set: (next: Narrative) => {
      if (Object.keys(next).every(k => next[k as keyof Narrative] === value[k as keyof Narrative])) return;
      value = next; listeners.forEach(fn => fn());
    },
  };
}
export type NarrativeStore = ReturnType<typeof createNarrative>;

/** Native flow only. Layout reads occur on resize/content changes, never in the render loop. */
export function attachScrollBridge(root: HTMLElement, stage: HTMLElement, store: NarrativeStore, select: (id: ChapterId) => void) {
  const elements = [...root.querySelectorAll<HTMLElement>('[data-chapter]')];
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  let measurements: { id: ChapterId; top: number; height: number; element: HTMLElement }[] = [];
  let frame = 0;
  let measuring = true;
  let disposed = false;
  let visible = true;
  let current: ChapterId | null = null;
  let stageHeight = 0;
  let headerHeight = 60;
  let stageUnpinned = false;
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const update = () => {
    frame = 0;
    if (disposed) return;
    if (measuring) {
      measurements = elements.map(element => ({ id: element.dataset.chapter as ChapterId, top: element.getBoundingClientRect().top + scrollY, height: element.offsetHeight, element }));
      stageHeight = stage.offsetHeight;
      headerHeight = header?.offsetHeight ?? 60;
      stageUnpinned = stageHeight + headerHeight > (innerWidth < 900 ? innerHeight * .6 : innerHeight - 60);
      root.dataset.stageUnpinned = String(stageUnpinned);
      const pinned = !stageUnpinned && innerHeight > 600 && innerWidth > 350;
      root.style.setProperty('--lab-clearance', `${headerHeight + (innerWidth < 900 && pinned ? stageHeight : 0) + 16}px`);
      measuring = false;
    }
    const mobile = innerWidth < 900;
    const sticky = !stageUnpinned && innerHeight > 600 && innerWidth > 350;
    const line = scrollY + (mobile && sticky ? stageHeight + headerHeight + 24 : Math.max(headerHeight + 24, innerHeight * .32));
    const chosen = measurements.findLast(m => m.top <= line) || measurements[0];
    if (!chosen) return;
    const progress = Math.max(0, Math.min(1, (line - chosen.top) / Math.max(chosen.height, 1)));
    chosen.element.style.setProperty('--sc-p', progress.toFixed(4));
    const changed = store.get().chapter !== chosen.id;
    store.set({ chapter: chosen.id, progress, reduced: mq.matches, mobile, visible: visible && !document.hidden });
    if (current !== chosen.id || changed) { current = chosen.id; select(chosen.id); }
  };
  const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(update); };
  const measure = () => { measuring = true; schedule(); };
  const resize = new ResizeObserver(measure);
  resize.observe(root); resize.observe(stage); if (header) resize.observe(header); elements.forEach(el => resize.observe(el));
  const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); });
  intersection.observe(stage);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('hashchange', measure);
  window.addEventListener('popstate', measure);
  document.addEventListener('visibilitychange', schedule);
  mq.addEventListener('change', schedule);
  document.fonts.ready.then(() => { if (!disposed) measure(); });
  const alreadyReady = document.documentElement.classList.contains('sc-ready');
  document.documentElement.classList.add('sc-ready');
  measure();
  return () => {
    disposed = true; cancelAnimationFrame(frame); resize.disconnect(); intersection.disconnect();
    window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure);
    window.removeEventListener('hashchange', measure); window.removeEventListener('popstate', measure);
    document.removeEventListener('visibilitychange', schedule); mq.removeEventListener('change', schedule);
    if (!alreadyReady) document.documentElement.classList.remove('sc-ready');
  };
}
