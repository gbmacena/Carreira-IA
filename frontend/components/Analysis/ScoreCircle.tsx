import { useState, useEffect } from "react";
import { getScoreColor } from "@/utils/scoreUtils";

interface ScoreCircleProps {
  score: number;
  label: string;
}

export const ScoreCircle = ({ score, label }: ScoreCircleProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  const validScore = typeof score === "number" && !isNaN(score) ? score : 0;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset =
    circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = validScore / 50;
      const interval = setInterval(() => {
        current += increment;
        if (current >= validScore) {
          setAnimatedScore(validScore);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, 20);
    }, 300);

    return () => clearTimeout(timer);
  }, [validScore]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke={getScoreColor(validScore)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-3xl font-bold"
            style={{ color: getScoreColor(validScore) }}
          >
            {animatedScore}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-700 text-center">
        {label}
      </p>
    </div>
  );
};
