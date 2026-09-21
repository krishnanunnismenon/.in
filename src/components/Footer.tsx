import { portfolio } from '@/data/portfolio';
import styles from './site/Site.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a className={styles.contact} href={`mailto:${portfolio.email}`}>{portfolio.email}</a>
      <nav className={styles.social} aria-label="Elsewhere">
        {portfolio.social.map(link => <a key={link.label} href={link.href}>{link.label}</a>)}
      </nav>
    </footer>
  );
}
