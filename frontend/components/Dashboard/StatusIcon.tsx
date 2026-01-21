import { Clock, CheckCircle, XCircle } from "lucide-react";
import { AnalysisStatus } from "@/types";
import { STATUS_COLORS } from "@/constants";

interface StatusIconProps {
  status: AnalysisStatus;
  className?: string;
}

export default function StatusIcon({
  status,
  className = "w-5 h-5",
}: StatusIconProps) {
  const iconClass = `${className} ${STATUS_COLORS[status]}`;

  switch (status) {
    case "COMPLETED":
      return <CheckCircle className={iconClass} />;
    case "FAILED":
      return <XCircle className={iconClass} />;
    case "PROCESSING":
      return <Clock className={iconClass} />;
    default:
      return <Clock className={iconClass.replace("animate-spin", "")} />;
  }
}
