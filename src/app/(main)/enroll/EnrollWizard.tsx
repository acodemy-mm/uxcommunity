"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { EnrollmentCatalog } from "@/types/database";
import type { BankDetails } from "@/lib/enroll/config";
import { formatMmk } from "@/lib/enroll/config";
import { submitEnrollment } from "./actions";
import { ApplyStepper, type WizardStepId } from "./ApplyStepper";
import { ApplicationSummary } from "./ApplicationSummary";

const STEPS: WizardStepId[] = ["cohort", "you", "why", "consent", "payment"];

const inputClass =
  "w-full rounded-xl border border-slate-600 bg-[#111113] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40";

const cardBase =
  "rounded-2xl border px-4 py-4 text-left transition ios-spring";
const cardIdle = "border-slate-700 bg-[#1C1C1E] hover:border-slate-500";
const cardSelected =
  "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30";

type FormState = {
  cohortId: string;
  priceTierId: string;
  fullName: string;
  email: string;
  phone: string;
  school: string;
  educationLevel: string;
  courseInterest: string;
  motivation: string;
  consentTerms: boolean;
  consentData: boolean;
  paymentConfirmed: boolean;
  paymentNote: string;
};

function formatCohortDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EnrollWizard({
  catalog,
  bank,
}: {
  catalog: EnrollmentCatalog;
  bank: BankDetails;
}) {
  const openCohorts = catalog.cohorts.filter((c) => c.status === "open");
  const defaultCohort = openCohorts[0] ?? catalog.cohorts[0];
  const defaultTier =
    defaultCohort?.price_tiers.find((t) => !t.sold_out) ??
    defaultCohort?.price_tiers[0];

  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<FormState>({
    cohortId: defaultCohort?.id ?? "",
    priceTierId: defaultTier?.id ?? "",
    fullName: "",
    email: "",
    phone: "",
    school: "",
    educationLevel: "",
    courseInterest: "",
    motivation: "",
    consentTerms: false,
    consentData: false,
    paymentConfirmed: false,
    paymentNote: "",
  });

  const selectedCohort = useMemo(
    () => catalog.cohorts.find((c) => c.id === form.cohortId),
    [catalog.cohorts, form.cohortId]
  );

  const selectedTier = useMemo(
    () => selectedCohort?.price_tiers.find((t) => t.id === form.priceTierId),
    [selectedCohort, form.priceTierId]
  );

  const step = STEPS[stepIndex];

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function validateStep(index: number): string | null {
    if (index === 0) {
      if (!form.cohortId) return "Please choose a cohort.";
      if (!form.priceTierId) return "Please choose a price.";
      if (selectedTier?.sold_out) return "That price tier is sold out.";
      return null;
    }
    if (index === 1) {
      if (!form.fullName.trim()) return "Full name is required.";
      if (!form.email.trim()) return "Email is required.";
      return null;
    }
    if (index === 2) {
      if (form.motivation.trim().length < 20) {
        return "Please share a bit more about why you want to join (20+ characters).";
      }
      return null;
    }
    if (index === 3) {
      if (!form.consentTerms || !form.consentData) {
        return "Please accept both consent checkboxes.";
      }
      return null;
    }
    if (index === 4) {
      if (!form.paymentConfirmed) {
        return "Please confirm you will transfer the enrollment fee.";
      }
      return null;
    }
    return null;
  }

  function goNext() {
    const err = validateStep(stepIndex);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function handleSubmit() {
    const err = validateStep(4);
    if (err) {
      setError(err);
      return;
    }
    if (!selectedTier) {
      setError("Please choose a price.");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await submitEnrollment({
      program_id: catalog.id,
      cohort_id: form.cohortId,
      price_tier_id: form.priceTierId,
      amount_mmk: selectedTier.amount_mmk,
      completed_prior_course: false,
      full_name: form.fullName,
      email: form.email,
      phone: form.phone,
      school: form.school,
      education_level: form.educationLevel,
      course_interest: form.courseInterest,
      motivation: form.motivation,
      consent_terms: form.consentTerms,
      consent_data: form.consentData,
      payment_confirmed: form.paymentConfirmed,
      payment_note: form.paymentNote,
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-[#1C1C1E] p-10 text-center">
        <h2 className="text-2xl font-bold text-white">Application received</h2>
        <p className="mt-3 text-slate-400">
          Thanks for applying to {catalog.title}. An admin will review your
          enrollment and email you next steps.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#1C1C1E]">
      <div className="border-b border-slate-700 px-6 py-5 sm:px-8">
        <ApplyStepper steps={STEPS} currentIndex={stepIndex} />
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
        <div className="px-6 py-8 sm:px-8">
          {step === "cohort" && (
            <section>
              <StepEyebrow label="Your cohort and price" n="01" />
              <p className="mt-2 max-w-xl text-sm text-slate-400">
                Pick the intake whose dates and class time fit you, then your
                price. Both ride along on the right, and you can change the
                cohort at any step.
              </p>

              <h3 className="mt-8 text-sm font-semibold text-slate-100">
                Choose your cohort
              </h3>
              {catalog.cohorts.length === 0 ? (
                <p className="mt-3 rounded-2xl border border-slate-700 bg-[#161618] px-4 py-4 text-sm text-slate-400">
                  No active cohorts are open for enrollment right now. Please
                  check back later.
                </p>
              ) : (
                <div className="mt-3 max-w-xl">
                  <select
                    className={inputClass}
                    value={form.cohortId}
                    onChange={(e) => {
                      const cohortId = e.target.value;
                      const cohort = catalog.cohorts.find(
                        (c) => c.id === cohortId
                      );
                      const firstOpen =
                        cohort?.price_tiers.find((t) => !t.sold_out)?.id ??
                        cohort?.price_tiers[0]?.id ??
                        "";
                      setForm((prev) => ({
                        ...prev,
                        cohortId,
                        priceTierId: firstOpen,
                      }));
                      setError(null);
                    }}
                  >
                    <option value="">Select a cohort</option>
                    {catalog.cohorts.map((cohort) => (
                      <option
                        key={cohort.id}
                        value={cohort.id}
                        disabled={cohort.status === "closed"}
                      >
                        {cohort.name} — starts{" "}
                        {formatCohortDate(cohort.starts_at)} ·{" "}
                        {cohort.schedule_label}
                        {cohort.status === "closed" ? " (Closed)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <h3 className="mt-8 text-sm font-semibold text-slate-100">
                Choose your price
              </h3>
              <div className="mt-3 grid max-w-sm gap-3">
                {(selectedCohort?.price_tiers ?? []).map((tier) => {
                  const selected = form.priceTierId === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      disabled={tier.sold_out}
                      onClick={() => update("priceTierId", tier.id)}
                      className={`${cardBase} relative ${
                        selected ? cardSelected : cardIdle
                      } ${tier.sold_out ? "opacity-45 cursor-not-allowed" : ""}`}
                    >
                      {tier.sold_out && (
                        <span className="absolute left-3 top-3 rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-300">
                          sold out
                        </span>
                      )}
                      <p
                        className={`text-sm font-semibold text-slate-100 ${tier.sold_out ? "mt-4" : ""}`}
                      >
                        {tier.label}
                      </p>
                      <p className="mt-2 text-lg font-bold text-white">
                        {formatMmk(tier.amount_mmk)}
                        {tier.per_seat && (
                          <span className="ml-1 text-xs font-medium text-slate-500">
                            per seat
                          </span>
                        )}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === "you" && (
            <section className="space-y-5">
              <StepEyebrow label="About you" n="02" />
              <p className="text-sm text-slate-400">
                Tell us who you are so we can reach you about your seat.
              </p>
              <Field label="Full name" required>
                <input
                  className={inputClass}
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+95 9 123 456 789"
                />
              </Field>
              <Field label="School / University">
                <input
                  className={inputClass}
                  value={form.school}
                  onChange={(e) => update("school", e.target.value)}
                  placeholder="Your school or university"
                />
              </Field>
              <Field label="Education level">
                <select
                  className={inputClass}
                  value={form.educationLevel}
                  onChange={(e) => update("educationLevel", e.target.value)}
                >
                  <option value="">Select level</option>
                  <option value="high_school">High school</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="bootcamp">Bootcamp / self-taught</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </section>
          )}

          {step === "why" && (
            <section className="space-y-5">
              <StepEyebrow label="Why you’re joining" n="03" />
              <p className="text-sm text-slate-400">
                A short note helps us understand your goals for this cohort.
              </p>
              <Field label="Course interest">
                <input
                  className={inputClass}
                  value={form.courseInterest}
                  onChange={(e) => update("courseInterest", e.target.value)}
                  placeholder="e.g. UX Foundations, UI Design"
                />
              </Field>
              <Field label="Why do you want to join?" required>
                <textarea
                  rows={5}
                  className={inputClass}
                  value={form.motivation}
                  onChange={(e) => update("motivation", e.target.value)}
                  placeholder="Tell us briefly about your goals..."
                />
              </Field>
            </section>
          )}

          {step === "consent" && (
            <section className="space-y-5">
              <StepEyebrow label="Consent" n="04" />
              <p className="text-sm text-slate-400">
                Please confirm the following before we hold your seat.
              </p>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-700 bg-[#161618] p-4 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.consentTerms}
                  onChange={(e) => update("consentTerms", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-[#111113]"
                />
                I accept the program terms and understand attendance
                expectations for this cohort.
              </label>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-700 bg-[#161618] p-4 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.consentData}
                  onChange={(e) => update("consentData", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-[#111113]"
                />
                I agree that UX Community may use my details to review this
                enrollment application and contact me about next steps.
              </label>
            </section>
          )}

          {step === "payment" && (
            <section className="space-y-5">
              <StepEyebrow label="Payment" n="05" />
              <p className="text-sm text-slate-400">
                Transfer the total below to reserve your seat. An admin will
                confirm once payment is verified.
              </p>
              <div className="rounded-2xl border border-slate-700 bg-[#161618] p-5 text-sm text-slate-300">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Bank transfer
                </p>
                <dl className="mt-3 space-y-2">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Bank</dt>
                    <dd className="font-medium text-slate-100">{bank.bankName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Account name</dt>
                    <dd className="font-medium text-slate-100">
                      {bank.accountName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Account number</dt>
                    <dd className="font-medium text-slate-100">
                      {bank.accountNumber}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Amount</dt>
                    <dd className="font-bold text-white">
                      {selectedTier
                        ? formatMmk(selectedTier.amount_mmk)
                        : "—"}
                    </dd>
                  </div>
                </dl>
                {bank.notes && (
                  <p className="mt-4 text-xs text-slate-500">{bank.notes}</p>
                )}
              </div>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-700 bg-[#161618] p-4 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.paymentConfirmed}
                  onChange={(e) => update("paymentConfirmed", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-[#111113]"
                />
                I will transfer this amount to reserve my seat
              </label>
              <Field label="Payment note / reference (optional)">
                <input
                  className={inputClass}
                  value={form.paymentNote}
                  onChange={(e) => update("paymentNote", e.target.value)}
                  placeholder="Transfer reference or group member names"
                />
              </Field>
            </section>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mt-10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0 || loading}
              className="rounded-xl border border-slate-600 bg-[#161618] px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-[#2C2C2E] disabled:opacity-40"
            >
              Back
            </button>
            {stepIndex < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {loading ? "Submitting…" : "Submit application"}
              </button>
            )}
          </div>
        </div>

        <ApplicationSummary
          courseTitle={catalog.title}
          cohort={selectedCohort}
          tier={selectedTier}
        />
      </div>
    </div>
  );
}

function StepEyebrow({ label, n }: { label: string; n: string }) {
  return (
    <p
      className="flex items-center gap-2 text-sm font-semibold"
      style={{ color: "var(--ios-purple)" }}
    >
      <span aria-hidden>◆</span>
      {label} · {n}
    </p>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      {children}
    </label>
  );
}
