# Git Workflow & Commit Standards

This document establishes the official Git branching strategy, commit conventions, and release/merge workflows for the **FlashTicket Engine** project. Adhering to these standards ensures clean repository history, clear pull requests, and meets the expectations of international engineering teams (Canada / US).

---

## 1. Branching Strategy: Git Flow / Trunk-Based with Feature Branches

We follow a structured **Feature-Branch Workflow** based on `main` as the stable production branch.

### 1.1 Branch Types and Naming Conventions

All branch names must be in lowercase, using hyphens (`-`) to separate words. Always prefix with the scope category:

| Prefix | Description | Example |
| :--- | :--- | :--- |
| `feat/` | A new feature or business capability | `feat/inventory-redis-lock` |
| `fix/` | A bug fix or patch | `fix/reservation-expiry-race` |
| `refactor/` | Code refactoring without behavioral changes | `refactor/reservation-actions` |
| `test/` | Adding or updating tests | `test/concurrency-pest-suite` |
| `perf/` | Performance optimizations | `perf/tier-inventory-caching` |
| `docs/` | Documentation, specs, and architectural diagrams | `docs/portfolio-specification` |
| `chore/` | Tooling, dependencies, CI/CD, linting setup | `chore/setup-pest-phpstan-ci` |

### 1.2 Protected Branches
* **`main`**: Always clean, releasable, passing all tests and PHPStan level 8+.
* Direct commits to `main` are reserved exclusively for critical documentation fixes or project setup initializations. All feature work must happen in dedicated branches.

---

## 2. Commit Message Convention: Conventional Commits

We strictly follow the **[Conventional Commits 1.0.0](https://www.conventionalcommits.org/)** specification.

### 2.1 Commit Message Structure

```text
<type>(<optional scope>): <imperative description in lowercase>

[optional body providing technical context, rationale, and tradeoffs]

[optional footer(s), e.g., Closes #12, BREAKING CHANGE: ...]
```

### 2.2 Allowed Commit Types

* **`feat`**: Introduces a new feature or domain logic.
* **`fix`**: Patches a bug or addresses a defect.
* **`test`**: Adds missing tests or refactors existing test suites.
* **`refactor`**: Rewriting code without fixing a bug or adding a feature.
* **`perf`**: Code change that improves performance / execution speed / memory usage.
* **`docs`**: Documentation updates (`README.md`, specs, PHPDoc, inline architecture notes).
* **`style`**: Formatting, white-space, missing semi-colons (no code logic change).
* **`chore`**: Maintenance, package updates, Docker config, Vite/Tailwind configuration.
* **`ci`**: GitHub Actions workflows and CI scripts.

### 2.3 Scopes (Domain Boundaries)

Scopes should reference the domain module affected:
- `(inventory)`: Stock holds, reservations, locking mechanisms.
- `(checkout)`: Stripe integration, payment processing, tax calculation.
- `(tickets)`: PDF generation, QR Code validation, scanner.
- `(events)`: Event and tier management, catalogs.
- `(auth)`: 2FA, Passkeys, session handling.
- `(ui)`: Reusable frontend components, layout, styling.
- `(deps)`: Composer / npm packages.

### 2.4 Examples of Good Commit Messages

```text
feat(inventory): implement redis atomic reservation with lua script

Add atomic decrement using Redis Lua script to absorb high-concurrency spikes
before hitting the database lockForUpdate transaction.
```

```text
fix(checkout): prevent duplicate charge on network retry

Add idempotency-key header to Stripe payment intent creation and verify
existing pending payment records.
```

```text
test(inventory): add pest concurrency simulation test for zero overselling
```

```text
refactor(reservation): extract checkout logic into ProcessReservationAction
```

---

## 3. Workflow Protocol: From Task to Merge

### Step 1: Create a Dedicated Branch
Always branch off the latest `main`:
```bash
git checkout main
git pull origin main
git checkout -b feat/inventory-redis-lock
```

### Step 2: Atomic, Focused Commits
- Commit early and often for logical units of work.
- Never mix unrelated changes in the same commit (e.g., refactoring styles while fixing a concurrency bug).
```bash
git add app/Actions/Inventory/
git commit -m "feat(inventory): implement AcquireTicketLockAction with redis redlock"
```

### Step 3: Pre-Merge Quality Verification Checklist
Before merging any branch back into `main`, verify the following checks locally:
1. **Tests pass:** `php artisan test` (or `pest`)
2. **Static analysis passes:** `./vendor/bin/phpstan analyse`
3. **Frontend types & build pass:** `npm run build` or `npx tsc --noEmit`
4. **Code style complies:** `./vendor/bin/pint` and `npx prettier --check .`

### Step 4: Merging into `main`
Depending on repository preferences, we use:
* **Squash and Merge / Rebase Merge**: Keeps `main` commit history clean, linear, and readable.
```bash
git checkout main
git pull origin main
git merge --no-ff feat/inventory-redis-lock -m "feat(inventory): implement inventory redis locking mechanism (#1)"
git push origin main
```
* Delete the feature branch locally and remotely once merged:
```bash
git branch -d feat/inventory-redis-lock
```

---

## 4. Git Rules for Antigravity AI Assistant

When working as the pair programmer:
1. **Ask/Confirm before branching:** State clearly which branch will be created for the feature/fix.
2. **Follow commit formatting:** Ensure all commits strictly match `type(scope): description`.
3. **Write in English:** All commit messages, PR descriptions, and code comments must be in professional English.
4. **Keep Commits Clean:** Never commit temporary debug scripts, `.env` files with real keys, or unintended file changes.

