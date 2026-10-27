import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import Notice from "../components/Notice.jsx";
import { formatDateTime, formatMoney } from "../utils/formatters.js";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export default function AdminPage() {
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [hours, setHours] = useState([]);
  const [error, setError] = useState("");
  const load = useCallback(
    () =>
      Promise.all([
        api("/admin/appointments"),
        api("/admin/services"),
        api("/admin/hours"),
      ])
        .then(([nextBookings, nextServices, nextHours]) => {
          setBookings(nextBookings);
          setServices(nextServices);
          setHours(nextHours);
        })
        .catch((e) => setError(e.message)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);
  async function addService(event) {
    event.preventDefault();
    try {
      await api("/admin/services", {
        method: "POST",
        body: JSON.stringify(
          Object.fromEntries(new FormData(event.currentTarget)),
        ),
      });
      event.currentTarget.reset();
      load();
    } catch (e) {
      setError(e.message);
    }
  }
  async function toggleService(service) {
    try {
      await api(`/admin/services/${service._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !service.isActive }),
      });
      load();
    } catch (e) {
      setError(e.message);
    }
  }
  async function saveHours(event, item) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    data.isClosed = data.isClosed === "true";
    try {
      await api(`/admin/hours/${item.weekday}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      load();
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <section>
      <span className="kicker">ADMIN STUDIO</span>
      <h1>Manage SlotWise</h1>
      <div className="tabs">
        {["bookings", "services", "hours"].map((name) => (
          <button
            className={tab === name ? "active" : ""}
            onClick={() => setTab(name)}
            key={name}
          >
            {name}
          </button>
        ))}
      </div>
      {error && <Notice error>{error}</Notice>}
      {tab === "bookings" && (
        <div className="appointment-list">
          {bookings.map((item) => (
            <article key={item._id}>
              <div>
                <span className={`pill ${item.status}`}>{item.status}</span>
                <h3>{item.service?.name}</h3>
                <p>
                  {formatDateTime(item.startAt)} · {item.customer?.name} ·{" "}
                  {item.customer?.email}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
      {tab === "services" && (
        <>
          <form className="inline-form" onSubmit={addService}>
            <input name="name" placeholder="Service name" required />
            <input name="description" placeholder="Description" />
            <input
              name="price"
              type="number"
              min="0"
              placeholder="Price"
              required
            />
            <button>Add service</button>
          </form>
          <div className="appointment-list">
            {services.map((service) => (
              <article key={service._id}>
                <div>
                  <h3>{service.name}</h3>
                  <p>
                    {formatMoney(service.price)} ·{" "}
                    {service.isActive ? "Active" : "Disabled"}
                  </p>
                </div>
                <button
                  className="ghost"
                  onClick={() => toggleService(service)}
                >
                  {service.isActive ? "Disable" : "Enable"}
                </button>
              </article>
            ))}
          </div>
        </>
      )}
      {tab === "hours" && (
        <div className="hours">
          {hours.map((item) => (
            <form key={item._id} onSubmit={(event) => saveHours(event, item)}>
              <strong>{DAYS[item.weekday]}</strong>
              <input
                name="openTime"
                type="time"
                step="1800"
                defaultValue={item.openTime}
              />
              <input
                name="closeTime"
                type="time"
                step="1800"
                defaultValue={item.closeTime}
              />
              <label>
                <input
                  name="isClosed"
                  type="checkbox"
                  defaultChecked={item.isClosed}
                  value="true"
                />{" "}
                Closed
              </label>
              <button>Save</button>
            </form>
          ))}
        </div>
      )}
    </section>
  );
}
