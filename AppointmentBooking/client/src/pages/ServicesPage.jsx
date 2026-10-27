import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import Notice from "../components/Notice.jsx";
import { formatMoney } from "../utils/formatters.js";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api("/services")
      .then(setServices)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <>
      <section className="hero">
        <div>
          <span className="kicker">BOOK BETTER · FEEL BETTER</span>
          <h1>
            Your time,
            <br />
            <em>beautifully</em> booked.
          </h1>
          <p>
            Choose a service, find your perfect time, and consider it handled.
          </p>
          <a href="#services" className="button">
            Explore services
          </a>
        </div>
        <div className="hero-art">
          <span>30</span>
          <small>
            MINUTES
            <br />
            JUST FOR YOU
          </small>
        </div>
      </section>
      <section id="services">
        <div className="section-head">
          <div>
            <span className="kicker">OUR SERVICES</span>
            <h2>Pick your moment</h2>
          </div>
          <p>Thoughtful, focused appointments designed to fit your day.</p>
        </div>
        {error && <Notice error>{error}</Notice>}
        <div className="cards">
          {services.map((service, index) => (
            <article className="service" key={service._id}>
              <span className="number">0{index + 1}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div>
                <strong>{formatMoney(service.price)}</strong>
                <Link to={`/book/${service._id}`}>Book now →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
