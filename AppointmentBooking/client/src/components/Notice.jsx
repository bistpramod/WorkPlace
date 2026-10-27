export default function Notice({ children, error = false }) {
  return <div className={error ? "notice error" : "notice"}>{children}</div>;
}
