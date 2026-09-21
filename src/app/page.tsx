import { getAllPosts } from '@/lib/blog';
import { portfolio } from '@/data/portfolio';
import Header from '@/components/Header';
import SelectedWork from '@/components/SelectedWork';
import WritingSection from '@/components/WritingSection';
import Footer from '@/components/Footer';
import site from '@/components/site/Site.module.css';
import styles from './Home.module.css';

export default function Home() {
  const posts = getAllPosts().map(post => ({ slug: post.slug, title: post.title, date: post.displayDate }));

  return (
    <div className={site.shell}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={styles.introduction} aria-labelledby="introduction-title">
          <h1 id="introduction-title">I’m {portfolio.name}.</h1>
          <p>{portfolio.introduction}</p>
        </section>
        <SelectedWork />
        <WritingSection posts={posts} />
        <section id="about" className={`${styles.section} ${styles.about}`} aria-labelledby="about-title">
          <h2 id="about-title" className={styles.sectionTitle}>A little background</h2>
          <p>{portfolio.background}</p>
          <p>{portfolio.interests}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
