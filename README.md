# Ledger — Personal Expense Tracker

A personal expense tracker with a ledger-inspired UI. Log expenses, filter by category and amount, and see spending summaries — all persisted locally in the browser with **native IndexedDB** (no backend).

Built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

## About the project

Ledger is a client-side expense management app. Users can:

- **Add** expenses (amount, description, category, date, optional note)
- **Edit** and **delete** existing expenses
- **Filter** the list by category pill or exact amount search
- View a **summary** with totals, category breakdown, and a donut chart
- Browse spending by **category** on a dedicated page
- Toggle **light / dark** theme (persisted in `localStorage`)

Data lives entirely in the browser. Refreshing the page keeps your expenses. There is no server, API, or cloud sync.

### Design

- Warm paper-toned light mode and muted dark mode
- Fraunces (headings), JetBrains Mono (amounts), Inter (UI)
- Dashed dividers, staggered list animations, slide-in drawer

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Other scripts:

| Command | Description |
|---|---|
| `npm run build` | Typecheck and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Project architecture

### Folder structure

```
src/
├── App.tsx                 # Shell: sidebar, top bar, expense container
├── main.tsx
├── types.ts                # Expense, CategoryId, NavPage
├── index.css               # Design tokens, animations
│
├── components/
│   ├── sidebar.tsx
│   ├── top-bar.tsx
│   ├── theme-toggle.tsx
│   ├── settings-view.tsx
│   └── expense/
│       ├── expense-container.tsx   # Pages + drawer + useExpenses
│       ├── expense-drawer.tsx      # Add / edit form
│       ├── expense-list.tsx        # List with edit & delete
│       ├── filter-row.tsx
│       ├── summary-card.tsx
│       ├── categories-view.tsx
│       └── donut-chart.tsx
│
├── ui/                     # Small reusable UI pieces
│   ├── filter-pill.tsx
│   ├── category-dot.tsx
│   ├── icon-button.tsx
│   ├── empty-state.tsx
│   └── ...
│
├── hooks/
│   ├── use-expenses.ts     # React ↔ IndexedDB bridge
│   └── use-theme.ts        # Theme toggle (localStorage)
│
├── db/
│   ├── constants.ts        # DB name, version, store name
│   └── expense-indexed-db.ts   # Native IndexedDB layer
│
├── data/
│   └── categories.ts       # Category labels & colors
│
└── lib/
    └── format.ts           # Currency, dates, totals helpers
```

### Layer responsibilities

| Layer | Role |
|---|---|
| **UI components** | Render only; receive data and callbacks as props |
| **`use-expenses`** | Owns React state, calls DB functions, refreshes after mutations |
| **`expense-indexed-db`** | Opens DB, runs transactions, no React |
| **IndexedDB** | Source of truth for expense records |

### Data flow

```
User action (add / edit / delete / filter)
        ↓
expense-container.tsx  →  useExpenses()
        ↓
expense-indexed-db.ts  →  IndexedDB (ledger / expenses)
        ↓
refresh()  →  setState  →  UI re-renders
```

- **Summary & categories pages** use the full `expenses` list (`getAllExpenses`).
- **Overview list** uses `filtered` from `queryExpenses` (category + amount filters).
- **Theme** is separate: stored in `localStorage`, not IndexedDB.

---

## IndexedDB setup and working process

### Database schema

Defined in `src/db/constants.ts` and created in `src/db/expense-indexed-db.ts`:

| Setting | Value |
|---|---|
| Database name | `ledger` |
| Version | `1` |
| Object store | `expenses` |
| Key path | `id` (string, UUID) |

**Indexes** (for querying):

| Index | Field | Use |
|---|---|---|
| `category` | `category` | Filter by Food, Transport, etc. |
| `amount` | `amount` | Exact amount search |
| `date` | `date` | Sorted results (`YYYY-MM-DD`) |

**Record shape** (`Expense`):

```ts
{
  id: string
  description: string
  amount: number
  category: 'food' | 'transport' | 'shopping' | 'bills' | 'fun'
  date: string        // YYYY-MM-DD
  note?: string
}
```

### Opening the database

`getDb()` runs once and caches the connection:

1. `indexedDB.open('ledger', 1)`
2. On first visit, `onupgradeneeded` creates the `expenses` store and indexes
3. Returns a shared `Promise<IDBDatabase>` for all later calls

Inspect in DevTools: **Application → IndexedDB → ledger → expenses**.

### CRUD operations

All live in `src/db/expense-indexed-db.ts`:

| Function | IndexedDB API | Description |
|---|---|---|
| `getAllExpenses()` | `store.getAll()` | Every expense, sorted by date desc |
| `getExpensesByCategory(cat)` | `index('category').getAll(cat)` | One category |
| `getExpensesByAmount(amount)` | `index('amount').getAll(amount)` | Exact amount match |
| `queryExpenses({ category, amount })` | Combines above | Used by filters |
| `addExpense(expense)` | `store.add()` | Insert new row |
| `updateExpense(expense)` | `store.put()` | Update existing row by `id` |
| `deleteExpense(id)` | `store.delete(id)` | Remove row |

Native `IDBRequest` callbacks are wrapped in Promises via `customRequest()`.

### Query logic (`queryExpenses`)

| Category filter | Amount search | What runs |
|---|---|---|
| All | empty | `getAllExpenses()` |
| Specific | empty | `getExpensesByCategory()` |
| All | value | `getExpensesByAmount()` |
| Specific | value | Category index, then amount match |

Amount search is **exact match** (e.g. `8.5` matches stored `8.5`).

### React integration (`use-expenses.ts`)

**On mount / filter change:**

1. `getAllExpenses()` → `expenses` (summary, categories)
2. `queryExpenses({ category, amount })` → `filtered` (list)

**On add:**

1. Generate `id` with `crypto.randomUUID()`
2. `addExpense()` → IndexedDB
3. `refresh()` both lists

**On update / delete:**

1. `updateExpense()` or `deleteExpense()` → IndexedDB
2. `refresh()` both lists

UI components never call IndexedDB directly — only through `useExpenses`.

### End-to-end example

**Add an expense:**

```
TopBar "Add expense"
  → ExpenseDrawer (add mode)
  → useExpenses.addExpense()
  → expense-indexed-db.addExpense()
  → IndexedDB store.add
  → refresh → list + summary update
```

**Filter by category:**

```
FilterRow pill click
  → setCategory('food')
  → useEffect in useExpenses
  → queryExpenses({ category: 'food' })
  → index('category').getAll('food')
  → filtered list updates
```

**Edit / delete:**

```
ExpenseList row → pencil or trash
  → ExpenseDrawer (edit) or confirm + deleteExpense(id)
  → updateExpense / deleteExpense in DB
  → refresh
```

---

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) icons
- Native [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
