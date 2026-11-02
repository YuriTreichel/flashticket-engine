# Architectural Guidelines & Coding Standards

This document establishes the architecture patterns, design principles, and mandatory engineering standards for **FlashTicket Engine**. Every feature, refactoring, and bug fix must adhere strictly to these rules.

---

## 1. Core Engineering Principles

1. **Strict Type Safety Everywhere:**
   - PHP: Declare `declare(strict_types=1);` in all PHP files.
   - Every class property, method parameter, and return value must be strictly typed. Never use untyped signatures or `mixed` unless strictly unavoidable with explicit type narrowing.
   - Frontend: Strict TypeScript without `any`. Leverage generated Inertia page props and models.
2. **Mandatory Automated Testing (Red-Green-Refactor):**
   - **No implementation without tests.** Every new feature, service, or business action must include corresponding unit and/or feature tests.
   - Concurrency-sensitive code (e.g. holds, payments, ticket minting) **must** have concurrency/race-condition simulation tests.
3. **Thin Controllers, Rich Domain:**
   - Controllers must never contain direct database transactions, business calculations, or external API calls (e.g., Stripe).
   - Controllers simply validate incoming Form Requests, delegate execution to an **Action** or **Service**, and return an Inertia response or Redirect.

---

## 2. Directory Layout & Layer Responsibilities

```text
app/
├── Actions/                  # Single-responsibility executable classes (e.g. HoldTicketsAction)
├── Enums/                    # Strongly-typed PHP Enums (backed by string or int)
├── DataTransferObjects/      # Immutable typed data containers (DTOs)
├── Exceptions/               # Domain-specific custom exceptions
├── Http/
│   ├── Controllers/          # Orchestrates HTTP request/response (< 25 lines per method)
│   ├── Requests/             # Validates incoming payloads with strict validation rules
│   └── Resources/            # Serializes database entities for frontend/API consumption
├── Models/                   # Eloquent entities with typed casts and relationships
├── Services/                 # Multi-step business orchestrators (e.g. StripeGateway, TaxCalculator)
├── Jobs/                     # Asynchronous workers for queues (PDF generation, email dispatch)
└── Events/ & Listeners/      # Event-driven hooks (e.g. ReservationExpired, PaymentSucceeded)
```

### 2.1 Actions vs Services
- **Action:** Performs a single discrete operation. Uses the `execute()` or `__invoke()` method.
  - Example: `HoldTicketsAction::execute(ReservationData $data): Reservation`
- **Service:** Handles multi-step lifecycles or coordinates external integrations.
  - Example: `StripePaymentService::processPaymentIntent(...)`, `CanadianTaxService::calculate(string $postalCode, int $subtotal)`

### 2.2 Data Transfer Objects (DTOs)
- Never pass raw, unstructured arrays across layers.
- Always bundle validated request data into typed DTOs before invoking Actions or Services.

---

## 3. Concurrency, Inventory & Transaction Rules

1. **Atomic Inventory Reservation:**
   - Inventory reservation operations must be executed inside a managed database transaction (`DB::transaction(...)`) utilizing pessimistic locking (`lockForUpdate()`) or atomic Redis operations.
   - Calculate availability: $\text{Available} = \text{Total Quantity} - (\text{Confirmed Sales} + \text{Active Unexpired Holds})$.
2. **Idempotency Guarantee:**
   - All payment handling and checkout endpoints must demand and record an `idempotency_key` (UUID v4) to prevent double charges and duplicate ticket generation upon network retries.
3. **Reservation TTL:**
   - Unpaid reservations have a strict 10-minute expiry (`expires_at`).
   - Expired holds are released back into the pool automatically without requiring manual intervention.

---

## 4. Frontend & Component Standards

1. **Component Hierarchy:**
   - Page components reside under `resources/js/Pages/`.
   - Small atomic components (Buttons, Modals, Inputs) reside under `resources/js/components/ui/` (shadcn-compatible).
   - Domain-specific widgets (e.g. `CountdownTimer`, `TicketTierCard`, `QrCodeDisplay`) reside under `resources/js/components/domain/`.
2. **Accessibility & Responsive First:**
   - Must pass WCAG 2.1 Level AA standards (proper ARIA attributes, semantic HTML tags, keyboard navigation).
   - Mobile-first responsiveness using Tailwind CSS v4.

---

## 5. Testing Standards & Quality Gates

Every pull request and commit must pass our automated quality gates:

| Quality Gate | Tool / Command | Requirement |
| :--- | :--- | :--- |
| **Unit & Feature Tests** | `php artisan test` (Pest / PHPUnit) | 100% pass rate with assertions on boundary conditions |
| **Static Analysis** | `./vendor/bin/phpstan analyse` | Level 8 zero errors |
| **Code Style (Backend)**| `./vendor/bin/pint --test` | PSR-12 / Laravel standards |
| **Type Check (Frontend)**| `npm run types:check` (`tsc --noEmit`) | Zero TypeScript errors |
| **Linter (Frontend)** | `npm run lint:check` | Zero ESLint warnings/errors |
| **Formatting** | `npm run format:check` | Prettier compliance |

### Testing Checklist for Every New Feature:
- [ ] Positive path test (expected successful flow).
- [ ] Edge case test (e.g. quantity 0, maximum allowance exceeded, sold-out tier).
- [ ] Authentication / Authorization test (guests blocked from checkout, unauthorized users cannot inspect others' tickets).
- [ ] Concurrency/Race condition test if dealing with stock or payments.

