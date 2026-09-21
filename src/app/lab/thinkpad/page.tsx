import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThinkPadExperience from '@/components/thinkpad/ThinkPadExperience';
import { portfolio } from '@/data/portfolio';
import styles from './ThinkPad.module.css';

export const metadata: Metadata = {
  title: 'A laptop. A server. The same machine. | Krishnanunni',
  description: 'Follow a song through an illustrative ThinkPad homelab. Try experiments with serving software, stored files and private remote access.',
  alternates: { canonical: 'https://krishnanunni.in/lab/thinkpad' },
  openGraph: {
    type: 'website',
    url: 'https://krishnanunni.in/lab/thinkpad',
    title: 'A laptop. A server. The same machine.',
    description: 'Try a song request, stop the software, and discover what stays on the laptop.',
    images: [{ url: 'https://krishnanunni.in/images/thinkpad-lab.png', alt: 'The real lesson’s simplified 3D ThinkPad, phone, software and files.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A laptop. A server. The same machine.',
    description: 'An interactive explanation of a ThinkPad homelab.',
    images: ['https://krishnanunni.in/images/thinkpad-lab.png'],
  },
};
export default function ThinkPadPage() {
  return <div className={styles.lab}>
    <Header className={styles.header} />
    <main id="main-content" tabIndex={-1}>
      <ThinkPadExperience />
      <aside className={styles.context} aria-label="About my actual homelab">
        <h2>The real setup, briefly.</h2>
        <p>I run open-source services and self-hosted music on a ThinkPad, with Tailscale access. This lesson’s software, song, folder layout and connections are examples.</p>
        <p>{portfolio.musicClient.contribution} <a href={portfolio.musicClient.href}>See {portfolio.musicClient.name} on GitHub</a>.</p>
      </aside>
    </main>
    <div className={styles.footer}><Footer /></div>
  </div>;
}
