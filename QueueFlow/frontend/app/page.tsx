import { DashboardSummary } from "@/components/DashboardSummary";

export default function HomePage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Internal application</span>
          <h1>Support Operations</h1>
          <p>
            This dashboard existed before your first ticket. Use it to verify that
            the frontend can reach the Express API and MongoDB.
          </p>
        </div>
      </div>

      <DashboardSummary />

      <div className="panel">
        <h2>Engineering handover</h2>
        <p>
          Product has approved CUS-101. The Customers navigation item exists, but
          the actual customer directory has not been implemented yet.
        </p>
      </div>
    </section>
  );
}
