import styles from './ContactSection.module.css';

export default function ContactSection() {
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
        marginBottom: '20px'
      }}>
        Contact
      </div>
      <div>
        <a
          href="mailto:hello@krishnanunni.in"
          className={styles.emailLink}
          style={{
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: 500,
            letterSpacing: '-0.012em',
            display: 'inline-block'
          }}
        >
          hello@krishnanunni.in
        </a>
      </div>
    </section>
  );
}
