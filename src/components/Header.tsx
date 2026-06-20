import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      fontSize: '13px',
      letterSpacing: '.01em',
      color: '#8a8782',
      marginBottom: '116px'
    }}>
      <Link href="/" style={{ color: '#161513', fontWeight: 500 }}>
        Krishnanunni
      </Link>
      <span>Software Engineer</span>
    </header>
  );
}
