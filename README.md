# Trove

Trove is a modern portfolio tracking application built with React, TypeScript, and Vite. It allows users to view their net worth, portfolio allocation, account balances, and recent transactions.

## Features

- **Net Worth Tracking:** Real-time visualization of your total portfolio value.
- **Sector Allocation:** Understand how your investments are distributed across different sectors.
- **Holdings Overview:** Detailed list of your stocks, current prices, and gain/loss.
- **Transaction History:** Keep track of your recent buys and sells.
- **Responsive Design:** Works seamlessly across desktop and mobile devices.

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts

## Getting Started

npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.tsx       # Login screen with validation
│   ├── Dashboard.tsx   # Main dashboard container
│   ├── NetWorthCard.tsx
│   ├── AllocationBar.tsx
│   ├── AccountList.tsx
│   ├── HoldingsTabs.tsx
│   ├── StocksTab.tsx
│   └── OrdersTab.tsx
├── services/           # Data service layer
│   └── portfolioService.ts
├── theme/             # Design tokens
│   ├── colors.ts
│   └── index.css
└── App.tsx            # Root component
```

## Data Handling Decisions

The application includes a service layer (`portfolioService.ts`) that wraps the JSON data and simulates asynchronous API calls with a 500ms delay. Components consume data through this service layer with proper loading and error states.

### Handling Data Quirks

The provided JSON data contains intentional edge cases. Here's how they were handled:

1. **NVDA has a currentPrice of 0**
   - **Decision**: Holdings with `currentPrice === 0` are excluded from portfolio value calculations and allocation charts
   - **Display**: Shows "Data unavailable" badge in the Stocks tab, value displays as "—"
   - **Rationale**: A price of 0 indicates missing or invalid data, not a real market value

2. **DIS has 0 shares**
   - **Decision**: Holdings with `shares === 0` are excluded from portfolio calculations and account summaries
   - **Display**: Still appears in the Stocks tab (can be filtered), but shows "Data unavailable" badge
   - **Rationale**: Zero shares means the position was sold or never held; it's not an active holding

3. **Transaction status "PENDING"**
   - **Decision**: Displayed with blue accent color (#00B6DF) and light blue background (#E5F7FA)
   - **Rationale**: Visually distinct from completed transactions to indicate in-progress state

4. **Transaction status "FAILED"**
   - **Decision**: Displayed with red accent color (#BF221C) and light red background (#FFE5E5)
   - **Rationale**: Clear visual indication of error state using the negative color token

5. **Gain/loss for negative returns**
   - **Decision**: 
     - Negative amounts display with red color and no sign (e.g., "-$123.45")
     - Negative percentages display with red color and minus sign (e.g., "-5.67%")
     - Positive values show green color with plus sign (e.g., "+$123.45", "+5.67%")
   - **Rationale**: Standard financial convention with clear visual color coding

## Design System

The application uses the Trove v3 color palette:

| Token | Value | Usage |
|-------|-------|-------|
| Primary | #059A83 | Buttons, active states |
| Primary Light | #E0F5E1 | Badges, subtle backgrounds |
| Success | #10AE17 | Positive returns |
| Negative | #BF221C | Negative returns, errors |
| Background Canvas | #FBFBFB | Card backgrounds |
| Card Surface | #FFFFFF | Card surfaces |
| Page Background | #F5F1EE | Page background |
| Text Default | #13342F | Headings, primary text |
| Text Neutral | #687D7A | Labels, secondary text |
| Border | #DBDFDF | Card borders |

## Responsive Design

The application is fully responsive across three breakpoints:
- **Desktop**: > 768px - Full grid layouts
- **Tablet**: 481px - 768px - Adjusted grid columns and spacing
- **Mobile**: ≤ 480px - Single column layouts, reduced padding


