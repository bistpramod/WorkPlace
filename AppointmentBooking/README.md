# SlotWise

SlotWise is a single-provider MERN appointment booking application built from the included roadmap. Customers can register, browse services, find timezone-safe 30-minute slots, book, view, and cancel appointments. Admins can manage services, weekly opening hours, and bookings.

## Local setup

Requirements: Node.js 24+, npm, and MongoDB.

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run seed
npm run dev
```

Open `http://localhost:5173`. The default seeded admin is `admin@slotwise.local` / `ChangeMe123!`; replace these values outside local development.

## Safety and scheduling

- JWT sessions are stored in an HttpOnly cookie.
- Registration always creates a customer regardless of submitted role data.
- Admin APIs enforce the role server-side.
- Appointment times are stored as UTC `Date` values and generated in `BUSINESS_TZ`.
- A partial unique MongoDB index on active appointment start times prevents concurrent double booking.
- Cancelling sets `blocksSlot` to false, making the slot available again.

## Scripts

- `npm run dev` — start client and API
- `npm run seed` — seed services, hours, and the admin
- `npm run build` — production frontend build
- `npm test` — backend tests

Version 1 intentionally supports one provider, fixed 30-minute services, and one business timezone. Payments, email, multiple providers, and public admin registration are out of scope.
