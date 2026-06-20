import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
    <div style={{
      maxWidth: '620px',
      margin: '0 auto',
      padding: '72px 28px 110px'
    }}>
      <Header />
      
      <main style={{ marginTop: '40px' }}>
        <Link href="/blog" style={{
          color: '#8a8782',
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
              color: '#8a8782',
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
