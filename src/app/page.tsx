import { getAllPosts } from '@/lib/blog';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProfileCard from '@/components/ProfileCard';
import NowSection from '@/components/NowSection';
import SelectedWork from '@/components/SelectedWork';
import WritingSection from '@/components/WritingSection';
import ElsewhereSection from '@/components/ElsewhereSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  const posts = getAllPosts();
  
  // Format posts to the structure WritingSection expects
  const formattedPosts = posts.map(post => ({
    slug: post.slug,
    title: post.title,
    date: post.displayDate
  }));

  return (
    <div style={{
      maxWidth: '620px',
      margin: '0 auto',
      padding: '72px 28px 110px'
    }}>
      <Header />
      <Hero />
      <ProfileCard flipTrigger="click" flipAxis="horizontal" showFlipHint={true} />
      <NowSection />
      <SelectedWork />
      <WritingSection posts={formattedPosts} />
      <ElsewhereSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
