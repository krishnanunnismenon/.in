import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import site from '@/components/site/Site.module.css';
import styles from './BlogPost.module.css';
import { Metadata } from 'next';

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Krishnanunni Blog`,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className={site.shell}>
      <Header />
      
      <main id="main-content" tabIndex={-1} style={{ marginTop: '40px' }}>
        <Link href="/blog" style={{
          color: 'var(--color-muted)',
          fontSize: '13px',
          display: 'inline-block',
          marginBottom: '32px',
          textDecoration: 'underline'
        }}>
          ← All writing
        </Link>
        
        <article>
          <header style={{ marginBottom: '40px' }}>
            <div style={{
              fontSize: '13px',
              color: 'var(--color-muted)',
              letterSpacing: '0.02em',
              marginBottom: '12px'
            }}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#161513',
              marginBottom: '20px',
              textWrap: 'balance'
            }}>
              {post.title}
            </h1>
            <p style={{
              fontSize: '17px',
              lineHeight: 1.55,
              color: '#6f6c67',
              maxWidth: '54ch',
              fontStyle: 'italic'
            }}>
              {post.summary}
            </p>
          </header>
          
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
