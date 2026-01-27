import { cormorant, inter } from "@/components/ui/fonts";
import Link from "next/link";

export default function DonateCancelledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className={`${cormorant.className} text-5xl font-bold text-[var(--foreground)] mb-4`}>
            Payment Cancelled
          </h1>
          <p className={`${inter.className} text-xl text-[var(--foreground-muted)] mb-8`}>
            Your donation was not completed. No payment has been processed.
          </p>
        </div>

        <div className="card p-8 mb-8">
          <h2 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mb-4`}>
            Want to try again?
          </h2>
          <p className={`${inter.className} text-[var(--foreground-muted)] mb-6`}>
            If you experienced any issues during the payment process, please try again.
            If problems persist, contact us at{" "}
            <a href="mailto:ymgmovementaustralia@gmail.com" className="text-[var(--accent-primary)] hover:underline">
              ymgmovementaustralia@gmail.com
            </a>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/donate" className="btn-primary">
            Try Again
          </Link>
          <Link href="/" className="btn-secondary">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
