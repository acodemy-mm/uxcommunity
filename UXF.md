# UXF — Student Enrollment Apply Flow

UX flow for UX Community’s **Reserve your seat** enrollment experience, modeled on the Productive Schedule Foundations apply pattern.

## Goal

Let a prospective student reserve a seat in a program cohort through a calm, multi-step application. Selections stay visible in a sticky summary. Payment is **bank transfer** (no card gateway). Admins review applications in `/admin/enrollments`.

## Entry

| Item | Value |
|------|--------|
| Route | `/enroll` |
| Nav | Sidebar **Enroll** |
| Shell | Light apply layout (no app sidebar/header) |
| Auth | Not required to apply |

## Flow overview

```
Cohort → You → Why → Consent → Payment → Success
         ↘ sticky YOUR APPLICATION sidebar ↙
                              ↓
                    Admin review (pending → approved | rejected)
```

## Screen map

### Shared chrome (all steps)

- Breadcrumb: `Apply / {Program title} · application`
- Headline: **Reserve your seat.**
- Horizontal stepper: **1 Cohort · 2 You · 3 Why · 4 Consent · 5 Payment**
- Main card (left): current step content
- Sticky summary (right): **YOUR APPLICATION** — Course, Cohort, Price, **Total to transfer**
- Footer: **Back** | **Next →** (step 5: **Submit application**)

### 01 — Cohort

- Eyebrow: `Your cohort and price · 01`
- Choose cohort (selectable cards; status Open/Closed)
- Optional: “I have completed a prior UX Community course”
- Choose price tier (Early bird / Regular / Group); sold-out disabled
- Validation: cohort + price tier required before Next
- Summary updates live

### 02 — You

- Eyebrow: `About you · 02`
- Fields: full name*, email*, phone, school/university, education level
- Validation: name + email required

### 03 — Why

- Eyebrow: `Why you’re joining · 03`
- Fields: course interest, motivation (textarea)
- Validation: motivation required (min ~20 chars)

### 04 — Consent

- Eyebrow: `Consent · 04`
- Required checkboxes:
  - Accept program terms
  - Agree to data use for enrollment review
- Validation: both must be checked

### 05 — Payment

- Eyebrow: `Payment · 05`
- Show bank transfer details (from env/config)
- Show amount from selected price tier (**Total to transfer**)
- Checkbox: “I will transfer this amount”
- Optional payment note / reference
- Validation: transfer confirm required
- Submit inserts application with `status: pending`

### Success

- Confirmation that application was received
- Message: admin will review; check email
- Link back to home

## Components

| Component | Role |
|-----------|------|
| `ApplyStepper` | Numbered progress across 5 steps |
| Selectable cards | Cohort + price tier choice |
| `ApplicationSummary` | Sticky right rail; total to transfer |
| Step panels | Cohort / You / Why / Consent / Payment |
| Back / Next | Linear navigation with per-step validation |

## Data model (summary)

- `enrollment_programs` — program title/slug
- `enrollment_cohorts` — intake dates + schedule
- `enrollment_price_tiers` — MMK amounts, sold_out, per_seat
- `student_enrollments` — applicant fields + cohort/tier FKs + consents + payment note/amount + status

## Admin handoff

1. Applicant submits → row `pending`
2. Admin opens `/admin/enrollments`
3. Sees name, email, cohort, price, amount, payment note
4. **Approve** / **Reject** / **Delete** (existing actions)

## Out of scope

- Stripe or other card gateways
- Auto-creating auth users on approve
- Auto-granting `user_course_access`
- Email notifications
