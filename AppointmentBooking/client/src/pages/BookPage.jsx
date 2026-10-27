import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import Notice from "../components/Notice.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatMoney, formatTime } from "../utils/formatters.js";

export default function BookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api("/services").then((items) =>
      setService(items.find((item) => item._id === id)),
    );
  }, [id]);
  useEffect(() => {
    if (!date) return;
    setBusy(true);
    setSelected("");
    setError("");
    api(`/slots?date=${date}`)
      .then(setSlots)
      .catch((e) => setError(e.message))
      .finally(() => setBusy(false));
  }, [date]);
  async function book() {
    if (!user) return navigate("/login", { state: { from: `/book/${id}` } });
    setBusy(true);
    setError("");
    try {
      await api("/appointments", {
        method: "POST",
        body: JSON.stringify({ serviceId: id, startAt: selected }),
      });
      navigate("/appointments", {
        state: { success: "Your appointment is confirmed." },
      });
    } catch (e) {
      setError(e.message);
      if (e.status === 409) setSlots(await api(`/slots?date=${date}`));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="booking">
      <Link to="/">← All services</Link>
      <div className="booking-grid">
        <div>
          <span className="kicker">BOOK AN APPOINTMENT</span>
          <h1>{service?.name || "Choose your time"}</h1>
          <p>{service?.description}</p>
          {service && <strong>{formatMoney(service.price)} · 30 min</strong>}
        </div>
        <div className="booking-card">
          <label>
            Select a date
            <input
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          {date && (
            <>
              <h3>Available times</h3>
              {busy && !slots.length ? (
                <p>Checking the calendar…</p>
              ) : (
                <div className="slots">
                  {slots.map((slot) => (
                    <button
                      type="button"
                      className={selected === slot ? "selected" : ""}
                      onClick={() => setSelected(slot)}
                      key={slot}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              )}
              {!busy && !slots.length && (
                <p>No times available for this day.</p>
              )}
            </>
          )}
          {error && <Notice error>{error}</Notice>}
          <button
            className="confirm"
            disabled={!selected || busy}
            onClick={book}
          >
            {busy ? "Working…" : "Confirm appointment"}
          </button>
        </div>
      </div>
    </section>
  );
}
