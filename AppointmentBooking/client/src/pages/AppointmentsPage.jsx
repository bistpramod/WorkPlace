import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../api.js";
import Notice from "../components/Notice.jsx";
import { formatDateTime } from "../utils/formatters.js";

export default function AppointmentsPage() {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const load = useCallback(
    () =>
      api("/appointments/mine")
        .then(setAppointments)
        .catch((e) => setError(e.message)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);
  async function cancel(item) {
    if (!window.confirm(`Cancel your ${item.service.name} appointment?`))
      return;
    try {
      await api(`/appointments/${item._id}/cancel`, { method: "PATCH" });
      load();
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <section>
      <span className="kicker">YOUR CALENDAR</span>
      <h1>My appointments</h1>
      {location.state?.success && <Notice>{location.state.success}</Notice>}
      {error && <Notice error>{error}</Notice>}
      <div className="appointment-list">
        {appointments.map((item) => (
          <article key={item._id}>
            <div>
              <span className={`pill ${item.status}`}>{item.status}</span>
              <h3>{item.service.name}</h3>
              <p>{formatDateTime(item.startAt)}</p>
            </div>
            {item.status === "confirmed" &&
              new Date(item.startAt) > new Date() && (
                <button className="ghost danger" onClick={() => cancel(item)}>
                  Cancel
                </button>
              )}
          </article>
        ))}
      </div>
      {!appointments.length && !error && (
        <div className="empty">
          <h2>No appointments yet</h2>
          <p>Your next little reset starts here.</p>
          <Link className="button" to="/">
            Browse services
          </Link>
        </div>
      )}
    </section>
  );
}
