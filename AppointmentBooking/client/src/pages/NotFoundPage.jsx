import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <section className="empty">
      <h1>Page not found</h1>
      <Link className="button" to="/">
        Back home
      </Link>
    </section>
  );
}
