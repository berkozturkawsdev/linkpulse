export default function InfoBox({ title, text }) {
  return (
    <div
      className="p-6 rounded-xl shadow hover:shadow-lg transition"
      style={{ backgroundColor: "var(--color-secondary)" }}
    >
      <h4
        className="text-xl font-semibold mb-2"
        style={{ color: "var(--color-white)" }}
      >
        {title}
      </h4>
      <p className="text-text-white text-sm" style={{ color: "var(--color-white)" }}>
        {text}
      </p>
    </div>
  );
}
