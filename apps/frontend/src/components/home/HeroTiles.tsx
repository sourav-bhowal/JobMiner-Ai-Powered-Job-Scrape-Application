"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";

// Hero Tiles Component
export default function HeroTiles() {
  // State for the percentage
  const [percentage, setPercentage] = useState(0);

  // State for the jobs daily
  const [jobsDaily, setJobsDaily] = useState(0);

  // State for the faster matches
  const [fasterMatches, setFasterMatches] = useState(0);

  // Animation setup
  useEffect(() => {
    gsap.to(
      {},
      {
        duration: 2,
        onUpdate: function () {
          setPercentage(Math.round(this.progress() * 97)); // Set the percentage value to 97
          setJobsDaily(Math.round(this.progress() * 1000)); // Set the jobs daily value to 1000
        },
      }
    );
  }, []);

  // Animation setup
  useEffect(() => {
    gsap.to(
      {},
      {
        duration: 1.5,
        onUpdate: function () {
          setFasterMatches(Math.round(this.progress() * 5)); // Set the faster matches value to 10
        },
      }
    );
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="rounded-lg bg-neutral-900 p-8 backdrop-blur-sm">
        <div className="text-5xl font-bold text-primary">{percentage}%</div>
        <div className="mt-2 text-lg">Match Accuracy</div>
      </div>
      <div className="rounded-lg bg-neutral-900 p-8 backdrop-blur-sm">
        <div className="text-5xl font-bold text-primary">{jobsDaily}+</div>
        <div className="mt-2 text-lg">Jobs Daily</div>
      </div>
      <div className="rounded-lg bg-neutral-900 p-8 backdrop-blur-sm">
        <div className="text-5xl font-bold text-primary">{fasterMatches}x</div>
        <div className="mt-2 text-lg">Faster Matches</div>
      </div>
    </div>
  );
}
