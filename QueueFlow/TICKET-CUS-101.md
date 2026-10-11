# CUS-101 - Customer Directory

**Type:** Feature  
**Priority:** Medium  
**Sprint:** Sprint 01  
**Owner:** Junior Full-Stack Developer

## Business problem

Support agents cannot efficiently find customer accounts. Customer records already exist in MongoDB, but the application has no usable customer directory.

## User story

> As a support agent, I want to browse and search customers so that I can quickly find the correct customer account while handling a support request.

## Functional requirements

Create a usable `/customers` page.

Each result must show:

- customer name
- email
- company
- status
- created date

Users must be able to search by:

- name
- email
- company

Results must support server-side pagination.

## Backend requirement

Create an API endpoint conceptually equivalent to:

```http
GET /api/customers
```

It must support query parameters equivalent to:

```http
GET /api/customers?page=2&limit=20
GET /api/customers?search=jane&page=1&limit=20
```

You decide the final response shape and code structure.

## Acceptance criteria

- **AC-01** `/customers` displays customers returned by the backend.
- **AC-02** Search works across name, email and company.
- **AC-03** Search happens on the server/database side, not by downloading all customers into React.
- **AC-04** Pagination happens on the server/database side.
- **AC-05** A requested page size cannot exceed 100 records.
- **AC-06** Invalid pagination input must not crash the API.
- **AC-07** The frontend handles loading, success, empty and error states.
- **AC-08** The customer directory remains usable on a mobile-width viewport.
- **AC-09** TypeScript is used in frontend and backend code.
- **AC-10** Avoid `any` unless you can justify it during review.
- **AC-11** Internal database/server stack traces are not returned to the browser.
- **AC-12** Default ordering is newest customer first.

## Scope constraints

Do not add authentication for this ticket.

Do not introduce Redux, Redis, GraphQL, Docker, WebSockets or microservices just to solve CUS-101.

Use the existing stack and patterns where they are appropriate.

## QA notes

QA is likely to check normal use plus edge cases such as:

- no search term
- partial name search
- email search
- company search
- search with zero matches
- page 1 / page 2
- page far beyond the available results
- negative page
- non-numeric page/limit
- extremely large limit
- API unavailable
- database unavailable
- narrow/mobile viewport

## Suggested branch name

```text
feat/CUS-101-customer-directory
```

## Deliverables

Your completed local branch should contain the implementation and any tests you decide are appropriate.

When reporting completion, be ready to explain:

1. API response design
2. search implementation
3. pagination implementation
4. input validation behavior
5. frontend fetching/state approach
6. TypeScript types
7. error handling
8. tests/manual QA performed
9. known limitations

## Optional stretch goal

Preserve `search`, `page`, and `limit` in the browser URL so that a filtered customer view can survive refresh and be shared internally.
