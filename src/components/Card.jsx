export default function Card({ children, style, padding = '20px 24px', radius = 22 }) {
  return (
    <div style={{
      background: 'var(--surface-card)',
      borderRadius: radius,
      boxShadow: 'var(--shadow-card)',
      padding,
      ...style,
    }}>
      {children}
    </div>
  );
}
