# Next.js Daily Expense Tracker

A minimal, mobile-first daily expense tracker with a clean UI (inspired by Apple/Samsung Notes).

## Features

- Responsive Calendar navigation (month switching)
- Accordion/expandable daily expense cards
- Add, edit, and drag-and-drop reorder expenses (dnd-kit)
- Sticky bottom footer: Total, Target, Profit/Loss
- Smooth transitions and focus
- Backend simulated via static JSON + Next.js API

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- Axios
- dnd-kit

## Getting Started

```bash
npm install
npm run dev
```

## File Structure

- `/app` — Next.js pages and components (App Router)
- `/components` — UI Components
- `/lib` — API functions
- `/data` — Static expense JSON "DB"
- `/app/api/expenses/route.ts` — Next.js API route