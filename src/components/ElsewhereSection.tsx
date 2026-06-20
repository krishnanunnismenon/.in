import styles from './ElsewhereSection.module.css';

const links = [
  { name: 'GitHub ↗', url: 'https://github.com/krishnanunnismenon' },
  { name: 'LinkedIn ↗', url: 'https://www.linkedin.com/in/krishnanunnii/' }
];

export default function ElsewhereSection() {
  return (
    <section style={{
      borderTop: '1px solid #e6e4df',
      paddingTop: '24px',
      marginTop: '64px'
    }}>
      <div style={{
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '.14em',
        color: '#a3a09b',
        marginBottom: '22px'
      }}>
        Elsewhere
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px 28px',
        fontSize: '16px'
      }}>
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {link.name}
          </a>
        ))}
      </div>
    </section>
  );
}
