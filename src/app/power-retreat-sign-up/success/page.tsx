import { cormorant, inter } from "@/components/ui/fonts";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className={`${cormorant.className} text-5xl font-bold text-[var(--foreground)] mb-4`}>
            Registration Complete!
          </h1>
          <p className={`${inter.className} text-xl text-[var(--foreground-muted)] mb-8`}>
            Thank you for registering for the YMG Power Retreat 2026. Your registration has been received successfully. You will receive a payment link via email shortly.
          </p>
        </div>

        <div className="card p-8 mb-8">
          <h2 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mb-4`}>
            What&apos;s Next?
          </h2>
          <ul className={`${inter.className} text-[var(--foreground-muted)] text-left space-y-3`}>
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent-primary)]">✓</span>
              <span>You will receive a confirmation email shortly with your registration details.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent-primary)]">✓</span>
              <span>Closer to the event, we&apos;ll send you more information about the schedule and what to bring.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent-primary)]">✓</span>
              <span>Follow us on social media for updates and announcements.</span>
            </li>
          </ul>
        </div>

        <Link href="/" className="btn-primary inline-block">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
