import Link from 'next/link';
import styles from './WritingSection.module.css';

interface Post {
  slug: string;
  title: string;
  date: string;
}

interface WritingSectionProps {
  posts: Post[];
}

export default function WritingSection({ posts }: WritingSectionProps) {
  return (
    <section style={{
      borderTop: '1px solid #e6e4df',
      paddingTop: '24px',
      marginTop: '64px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '10px'
      }}>
        <div style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '.14em',
          color: '#a3a09b'
        }}>
          Writing
        </div>
        <Link href="/blog" style={{
          fontSize: '12px',
          color: '#8a8782',
          textDecoration: 'underline'
        }}>
          All writing
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {posts.map((post, idx) => (
          <Link
            key={idx}
            href={`/blog/${post.slug}`}
            className={styles.linkItem}
          >
            <span style={{ fontSize: '16px', lineHeight: 1.4 }}>{post.title}</span>
            <span style={{
              fontSize: '13px',
              color: '#a3a09b',
              whiteSpace: 'nowrap',
              flex: 'none'
            }}>
              {post.date}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
