import styles from './SelectedWork.module.css';

const projects = [
  {
    title: 'eleven-hack',
    description: 'Custom hackathon project and integrations. TypeScript, React, APIs.',
    year: '2026',
    link: 'https://github.com/krishnanunnismenon/eleven-hack'
  },
  {
    title: 'ArunJuke',
    description: 'Collaborative jukebox player and media client. Flutter, WebSockets, Audio APIs.',
    year: '2025',
    link: 'https://github.com/krishnanunnismenon/ArunJuke'
  }
];

export default function SelectedWork() {
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
        marginBottom: '10px'
      }}>
        Selected work
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {projects.map((project, idx) => (
          <a
            key={idx}
            href={project.link}
            className={styles.linkItem}
          >
            <span style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              minWidth: 0
            }}>
              <span style={{ fontSize: '17px', fontWeight: 500 }}>{project.title}</span>
              <span style={{
                fontSize: '14px',
                color: '#8a8782',
                lineHeight: 1.45
              }}>
                {project.description}
              </span>
            </span>
            <span style={{
              fontSize: '13px',
              color: '#a3a09b',
              whiteSpace: 'nowrap',
              flex: 'none'
            }}>
              {project.year}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
