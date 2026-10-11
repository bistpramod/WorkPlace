"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import type { DashboardSummary as DashboardSummaryData } from "@/types/dashboard";

type LoadState =
  | { status: "loading" }
  | { status: "success"; data: DashboardSummaryData }
  | { status: "error"; message: string };

export function DashboardSummary() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadSummary() {
      try {
        const data = await apiGet<DashboardSummaryData>(
          "/api/stats/summary",
          controller.signal,
        );
        setState({ status: "success", data });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load summary",
        });
      }
    }

    void loadSummary();

    return () => controller.abort();
  }, []);

  if (state.status === "loading") {
    return <div className="panel muted">Loading dashboard summary...</div>;
  }

  if (state.status === "error") {
    return (
      <div className="panel error-panel">
        <strong>Dashboard API unavailable</strong>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <div className="summary-grid">
      <article className="metric-card">
        <span>Total customers</span>
        <strong>{state.data.totalCustomers}</strong>
      </article>
      <article className="metric-card">
        <span>Active customers</span>
        <strong>{state.data.activeCustomers}</strong>
      </article>
    </div>
  );
}
