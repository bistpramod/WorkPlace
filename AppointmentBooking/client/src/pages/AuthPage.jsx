import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import Notice from "../components/Notice.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage({ register = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api(`/auth/${register ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(
          Object.fromEntries(new FormData(event.currentTarget)),
        ),
      });
      await refresh();
      navigate(location.state?.from || "/");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="narrow">
      <span className="kicker">WELCOME TO SLOTWISE</span>
      <h1>{register ? "Create your account" : "Welcome back"}</h1>
      <p>
        {register
          ? "Book and manage your appointments in one calm place."
          : "Log in to manage your upcoming appointments."}
      </p>
      <form onSubmit={submit}>
        {register && (
          <label>
            Name
            <input name="name" required minLength="2" autoComplete="name" />
          </label>
        )}
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            minLength="8"
            required
            autoComplete={register ? "new-password" : "current-password"}
          />
        </label>
        {error && <Notice error>{error}</Notice>}
        <button disabled={busy}>
          {busy ? "Please wait…" : register ? "Create account" : "Log in"}
        </button>
      </form>
      <p>
        {register ? "Already registered?" : "New here?"}{" "}
        <Link to={register ? "/login" : "/register"}>
          {register ? "Log in" : "Create an account"}
        </Link>
      </p>
    </section>
  );
}
