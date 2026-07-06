export default function NowSection() {
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
        Now
      </div>
      <p style={{
        fontSize: '17px',
        lineHeight: 1.55,
        margin: 0,
        maxWidth: '48ch'
      }}>
        Currently designing and shipping <strong style={{ fontWeight: 500 }}>EV charging infra</strong> at <strong style={{ fontWeight: 500 }}>chargeMOD</strong> — owning the full stack, from  schemas to the last pixel.
      </p>
    </section>
  );
}
