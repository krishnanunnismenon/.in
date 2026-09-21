import Link from 'next/link';
import { portfolio } from '@/data/portfolio';
import Arrow from './site/Arrow';
import styles from './SelectedWork.module.css';

export default function SelectedWork() {
  return (
    <section className={styles.work} aria-labelledby="work-title">
      <h2 id="work-title" className={styles.sectionTitle}>Things I work on</h2>
      {portfolio.projects.map(project => (
        <article className={styles.project} key={project.id}>
          <h3 className={styles.title}>
            {project.href ? <Link href={project.href} prefetch={false}>{project.title}<Arrow /></Link> : project.title}
          </h3>
          <p className={styles.description}>{project.description}</p>
          {project.id === 'thinkpad' ? (
            <Link className={styles.explore} href="/lab/thinkpad" prefetch={false}>Look inside the homelab<Arrow /></Link>
          ) : (
            <details className={styles.reveal}>
              <summary>Show me how they connect</summary>
              <div className={styles.answer}>
                <ol className={styles.connection} aria-label="A simplified charging status journey">
                  <li><strong>Charger</strong><span>Sends its status</span></li>
                  <li><strong>Service</strong><span>Processes the update</span></li>
                  <li><strong>App</strong><span>Shows it to a driver</span></li>
                </ol>
                <p>Different systems need a shared way to talk. I work on the connections and test them with real chargers.</p>
                <p className={styles.note}>A simplified example of one status update.</p>
              </div>
            </details>
          )}
        </article>
      ))}
    </section>
  );
}
