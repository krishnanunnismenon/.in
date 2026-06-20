import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div style={{
      maxWidth: '620px',
      margin: '0 auto',
      padding: '72px 28px 110px'
    }}>
      <Header />
      
      <main style={{ marginTop: '40px' }}>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 500,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '40px',
        }}>
          Writing
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {posts.map((post) => (
            <article key={post.slug} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                fontSize: '13px',
                color: '#8a8782',
                letterSpacing: '0.02em',
              }}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div>
                <Link href={`/blog/${post.slug}`} style={{ display: 'inline-block' }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    color: '#161513',
                    cursor: 'pointer',
                  }}>
                    {post.title}
                  </h2>
                </Link>
              </div>
              <p style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#6f6c67',
                marginTop: '4px',
                maxWidth: '54ch'
              }}>
                {post.summary}
              </p>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
