import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
}

export const BackButton = ({ className }: BackButtonProps) => {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-soft hover:shadow-floating transition-all duration-300 transform hover:scale-[1.02] font-medium backdrop-blur-sm",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Homepage
    </Link>
  );
};