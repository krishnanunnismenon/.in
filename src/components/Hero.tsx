export default function Hero() {
  return (
    <section style={{ marginBottom: "60px" }}>
      <h1
        style={{
          fontSize: "clamp(31px, 5.6vw, 50px)",
          fontWeight: 500,
          lineHeight: 1.08,
          letterSpacing: "-0.022em",
          margin: "0 0 26px",
          textWrap: "balance",
        }}
      >
        Moving bytes, building systems
      </h1>
      <p
        style={{
          fontSize: "16px",
          lineHeight: 1.6,
          color: "#6f6c67",
          margin: 0,
          maxWidth: "46ch",
        }}
      >
Technical Lead specializing in distributed web infrastructure and real-time data flows. Obsessed with high performance and minimal design.
      </p>
    </section>
  );
}
