"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import { apiGet } from "../../lib/api";
import type { CustomersResponse } from "../../types/customer";

const PAGE_SIZE = 20;

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}

export default function CustomersPage() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<CustomersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const loadCustomers = useCallback((signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (search) params.set("search", search);

    apiGet<CustomersResponse>(`/api/customers?${params}`, signal)
      .then(setResult)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError("We couldn’t load customers. Check the API connection and try again.");
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });
  }, [page, search]);

  useEffect(() => {
    const controller = new AbortController();
    loadCustomers(controller.signal);
    return () => controller.abort();
  }, [loadCustomers, requestVersion]);

  function submitSearch(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setPage(1);
    setSearch(input.trim());
  }

  const pagination = result?.pagination;

  return (
    <section>
      <div className="page-heading"><div><span className="eyebrow">Customer directory</span><h1>Customers</h1><p>Find customer accounts by name, email address, or company.</p></div></div>
      <div className="panel directory-panel">
        <form className="search-form" onSubmit={submitSearch} role="search">
          <label htmlFor="customer-search">Search customers</label>
          <div className="search-controls">
            <input id="customer-search" type="search" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Name, email, or company" />
            <button type="submit">Search</button>
          </div>
        </form>

        {loading && !result ? <div className="state-message" role="status">Loading customers…</div> : null}
        {error ? <div className="state-message error-state" role="alert"><strong>Customer directory unavailable</strong><span>{error}</span><button type="button" onClick={() => setRequestVersion((value) => value + 1)}>Try again</button></div> : null}
        {!error && result && result.data.length === 0 ? <div className="state-message"><strong>No customers found</strong><span>{search ? `No results match “${search}”.` : "There are no customer records yet."}</span></div> : null}

        {!error && result && result.data.length > 0 ? <>
          <div className="results-summary" aria-live="polite">{loading ? "Updating…" : `${pagination?.total ?? 0} customer${pagination?.total === 1 ? "" : "s"}`}</div>
          <div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>{result.data.map((customer) => <tr key={customer._id}>
              <td data-label="Name"><strong>{customer.name}</strong></td>
              <td data-label="Email"><a href={`mailto:${customer.email}`}>{customer.email}</a></td>
              <td data-label="Company">{customer.company}</td>
              <td data-label="Status"><span className={`status status-${customer.status}`}>{customer.status}</span></td>
              <td data-label="Created">{formatDate(customer.createdAt)}</td>
            </tr>)}</tbody>
          </table></div>
          <nav className="pagination" aria-label="Customer pages">
            <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)}>Previous</button>
            <span>Page {pagination?.page ?? page} of {Math.max(pagination?.totalPages ?? 1, 1)}</span>
            <button type="button" disabled={loading || !pagination || page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)}>Next</button>
          </nav>
        </> : null}
      </div>
    </section>
  );
}
