import Link from "next/link";
import { ChevronDown } from "lucide-react";

// Hero Section
export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 py-20 text-center text-white">
      <div className="container mx-auto max-w-5xl">
        {/* Logo/Brand */}
        <div className="mb-8 inline-block rounded-lg border-2 border-primary px-8 py-4">
          <h1 className="text-5xl font-bold">
            JobNest<span className="text-primary">AI</span>
          </h1>
        </div>

        {/* Yellow underline */}
        <div className="mx-auto mb-10 h-1 w-20 bg-primary"></div>

        {/* Main headline */}
        <h2 className="mb-8 text-4xl font-bold leading-tight md:text-5xl">
          AI-powered job matching that finds your perfect fit in seconds
        </h2>

        {/* Subheading */}
        <p className="mb-12 text-lg md:text-xl text-muted-foreground">
          Stop wasting time scrolling through irrelevant job listings. Our AI
          engine learns your skills and preferences to deliver personalized
          opportunities.
        </p>

        {/* CTA Buttons */}
        <div className="mb-16 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
          <Link
            href="#"
            className="w-64 rounded-md bg-primary px-8 py-4 font-semibold text-black shadow-md hover:shadow-primary duration-500 hover:scale-105 transition-all ease-in-out"
          >
            Find Your Job Now
          </Link>
          <Link
            href="#"
            className="w-64 rounded-md border border-primary px-8 py-4 font-semibold text-white shadow-md hover:shadow-primary transition-shadow duration-500 ease-in-out hover:bg-primary/10"
          >
            How It Works
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-neutral-900 p-8 backdrop-blur-sm">
            <div className="text-5xl font-bold text-primary">97%</div>
            <div className="mt-2 text-lg">Match Accuracy</div>
          </div>
          <div className="rounded-lg bg-neutral-900 p-8 backdrop-blur-sm">
            <div className="text-5xl font-bold text-primary">10,000+</div>
            <div className="mt-2 text-lg">Jobs Daily</div>
          </div>
          <div className="rounded-lg bg-neutral-900 p-8 backdrop-blur-sm">
            <div className="text-5xl font-bold text-primary">5x</div>
            <div className="mt-2 text-lg">Faster Matches</div>
          </div>
        </div>
      </div>

      {/* Down arrow */}
      <div className="absolute bottom-8 animate-bounce text-primary">
        <ChevronDown size={32} />
      </div>
    </section>
  );
}
