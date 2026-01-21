import { useState, useEffect } from "react";
import { getProgressBarColor } from "@/utils/scoreUtils";

interface ProgressBarProps {
  score: number;
  label: string;
}

export const ProgressBar = ({ score, label }: ProgressBarProps) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  const validScore = typeof score === "number" && !isNaN(score) ? score : 0;

  const colorClasses = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };

  const getBarColorClass = (score: number): string => {
    if (score >= 85) return colorClasses.green;
    if (score >= 70) return colorClasses.blue;
    if (score >= 50) return colorClasses.amber;
    return colorClasses.red;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(validScore);
    }, 300);
    return () => clearTimeout(timer);
  }, [validScore]);

  const barColorClass = getBarColorClass(validScore);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{Math.round(validScore)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-1000 ease-out ${barColorClass}`}
          style={{ width: `${animatedWidth}%` }}
        ></div>
      </div>
    </div>
  );
};
