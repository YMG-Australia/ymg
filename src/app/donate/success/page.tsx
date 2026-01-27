import { cormorant, inter } from "@/components/ui/fonts";
import Link from "next/link";

export default function DonateSuccessPage() {
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
            Thank You for Your Donation
          </h1>
          <p className={`${inter.className} text-xl text-[var(--foreground-muted)] mb-8`}>
            Your payment was successful. Your generosity helps us disciple young men, grow in brotherhood, and spread the gospel.
          </p>
        </div>

        <div className="card p-8 mb-8">
          <p className={`${inter.className} text-[var(--foreground-muted)]`}>
            God bless you for partnering with Young Men of God. If you have any questions, please contact us at{" "}
            <a href="mailto:ymgmovementaustralia@gmail.com" className="text-[var(--accent-primary)] hover:underline">
              ymgmovementaustralia@gmail.com
            </a>
            .
          </p>
        </div>

        <Link href="/" className="btn-primary inline-block">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
