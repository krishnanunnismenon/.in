import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import site from '@/components/site/Site.module.css';
import styles from './Home.module.css';
export default function NotFound() {
  return <div className={site.shell}><Header /><main id="main-content" tabIndex={-1} className={styles.introduction}>
    <h1>That page isn’t here.</h1><p>The address may have changed. <Link href="/" style={{ textDecoration: 'underline' }}>Return home</Link> or <Link href="/blog" style={{ textDecoration: 'underline' }}>browse the writing</Link>.</p>
  </main><Footer /></div>;
}
