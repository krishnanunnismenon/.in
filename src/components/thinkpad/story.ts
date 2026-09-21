import type { ChapterId } from './simulation';
export const chapters: { id: ChapterId; label: string; title: string; intro: string }[] = [
  { id: 'song', label: 'Follow a song', title: 'Where does a song come from?', intro: 'Ask for Paper Boats, a fictional song. Follow the request; the file stays at home.' },
  { id: 'software', label: 'Stop the software', title: 'What stops when the music service stops?', intro: 'Make a prediction. Then stop just the software and ask for the song again.' },
  { id: 'folder', label: 'Keep the files', title: 'Can new software use the same files?', intro: 'Replace this example service. Its folder stays on the laptop, but the new service needs a connection to it.' },
  { id: 'away', label: 'Leave home', title: 'What changes away from home?', intro: 'The phone is elsewhere. The laptop and its music are still at home.' },
  { id: 'repair', label: 'Find the fault', title: 'Where did this request stop?', intro: 'Something is disconnected in this example. Ask for the song, then follow the evidence.' },
  { id: 'sandbox', label: 'Explore freely', title: 'Your turn. Change one thing.', intro: 'A fresh, separate example. Try a change, make a request, and see what it can tell you.' },
];
export const sceneNotes: Record<ChapterId, string> = {
  opening: 'A familiar computer. A different job.',
  song: 'A request travels. The stored file stays.',
  software: 'Computer, service, files. Three different things.',
  folder: 'A mount connects software to a folder on its host.',
  away: 'Remote access reaches the same laptop at home.',
  repair: 'Follow the evidence as far as the request gets.',
  sandbox: 'The same world, now yours to explore.',
};
