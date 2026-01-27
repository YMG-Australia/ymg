"use client";

import { useState } from "react";
import { cormorant, inter } from "@/components/ui/fonts";
import { BsHeart, BsEnvelope } from "react-icons/bs";

const PRESET_AMOUNTS = [10, 25, 50, 100];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | "other">(50);
  const [otherAmount, setOtherAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const amountValue =
    selectedAmount === "other"
      ? (() => {
          const n = parseFloat(otherAmount.replace(/[^0-9.]/g, ""));
          return Number.isFinite(n) ? n : 0;
        })()
      : selectedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (amountValue < 1) {
      setSubmitError("Please enter at least $1.");
      return;
    }
    if (amountValue > 50_000) {
      setSubmitError("Maximum amount is $50,000.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment could not be started.");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No payment URL returned.");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-radial)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className={`${inter.className} text-[var(--accent-primary)] text-sm font-semibold uppercase tracking-widest`}>
            Support Our Mission
          </span>
          <h1 className={`${cormorant.className} text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--foreground)] mt-4`}>
            Donate
          </h1>
          <p className={`${inter.className} text-xl text-[var(--foreground-muted)] mt-6 max-w-2xl mx-auto`}>
            Your generosity helps us disciple young men, grow in brotherhood, and spread the gospel.
          </p>
          <div className="section-divider mt-8" />
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card p-10 mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 mb-6">
              <BsHeart className="text-[var(--accent-primary)] text-3xl" />
            </div>
            <h2 className={`${cormorant.className} text-3xl font-bold text-[var(--foreground)] mb-4`}>
              Partner With Us
            </h2>
            <p className={`${inter.className} text-[var(--foreground-muted)] leading-relaxed mb-8`}>
              Young Men of God is a movement built on faith, fellowship, and formation. Your gift helps us run events,
              support brothers in need, and reach more young men with the life-changing message of Jesus Christ.
            </p>

            <form onSubmit={handleSubmit} className="text-left">
              <p className={`${inter.className} text-[var(--foreground)] font-medium mb-4`}>
                Choose or enter an amount (AUD)
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount);
                      setSubmitError("");
                    }}
                    className={`px-5 py-3 rounded-lg border font-medium transition-colors ${inter.className} ${
                      selectedAmount === amount
                        ? "bg-[var(--accent-primary)] text-[var(--background)] border-[var(--accent-primary)]"
                        : "bg-[var(--background)] border-[var(--border-subtle)] text-[var(--foreground)] hover:border-[var(--accent-primary)]"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAmount("other");
                    setSubmitError("");
                  }}
                  className={`px-5 py-3 rounded-lg border font-medium transition-colors ${inter.className} ${
                    selectedAmount === "other"
                      ? "bg-[var(--accent-primary)] text-[var(--background)] border-[var(--accent-primary)]"
                      : "bg-[var(--background)] border-[var(--border-subtle)] text-[var(--foreground)] hover:border-[var(--accent-primary)]"
                  }`}
                >
                  Other
                </button>
              </div>
              {selectedAmount === "other" && (
                <div className="mb-6">
                  <label htmlFor="other-amount" className={`${inter.className} block text-[var(--foreground)] font-medium mb-2`}>
                    Enter amount ($)
                  </label>
                  <input
                    id="other-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 75"
                    value={otherAmount}
                    onChange={(e) => {
                      setOtherAmount(e.target.value);
                      setSubmitError("");
                    }}
                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              )}

              {submitError && (
                <p className={`${inter.className} text-red-400 text-sm mb-4`}>{submitError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || amountValue < 1}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Redirecting to payment…" : `Donate $${amountValue.toFixed(amountValue % 1 ? 2 : 0)}`}
              </button>
            </form>
          </div>

          <p className={`${inter.className} text-[var(--foreground-muted)] text-center mb-4`}>
            Prefer to give by email or discuss ways to give?
          </p>
          <a
            href="mailto:ymgmovementaustralia@gmail.com"
            className="btn-secondary inline-flex items-center gap-2 mx-auto justify-center"
          >
            <BsEnvelope size={20} />
            Contact Us to Donate
          </a>
        </div>
      </section>
    </div>
  );
}
