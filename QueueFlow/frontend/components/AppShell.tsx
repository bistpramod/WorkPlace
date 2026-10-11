import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  { href: "/", label: "Overview" },
  { href: "/customers", label: "Customers" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">QueueFlow</div>
        <div className="sidebar-label">Support Operations</div>
        <nav className="nav-list" aria-label="Main navigation">
          {links.map((link) => (
            <Link className="nav-link" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
