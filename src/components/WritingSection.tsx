import Link from 'next/link';
import styles from './WritingSection.module.css';

type Post = { slug: string; title: string; date: string };

export default function WritingSection({ posts }: { posts: Post[] }) {
  return (
    <section className={styles.writing} aria-labelledby="writing-title">
      <div className={styles.heading}>
        <h2 id="writing-title">Writing</h2>
        <Link href="/blog">All writing</Link>
      </div>
      <ul className={styles.list}>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className={styles.linkItem}>
              <span>{post.title}</span><span className={styles.date}>{post.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
