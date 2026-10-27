import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  return (
    <>
      <header>
        <Link className="brand" to="/">
          <i>SW</i> SlotWise
        </Link>
        <nav>
          <NavLink to="/">Services</NavLink>
          {user && <NavLink to="/appointments">My bookings</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="account">
          {user ? (
            <>
              <span>Hi, {user.name.split(" ")[0]}</span>
              <button className="ghost" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link className="button small" to="/register">
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <strong>SlotWise</strong>
        <span>One chair. One calendar. Zero scheduling chaos.</span>
      </footer>
    </>
  );
}
