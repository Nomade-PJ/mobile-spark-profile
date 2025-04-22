
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ 
  title, 
  description, 
  className 
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h2 className="text-2xl font-bold text-gray-800 relative">
        {title}
        <span className="absolute -bottom-1 left-0 w-12 h-1 bg-nubank-base"></span>
      </h2>
      {description && (
        <p className="text-gray-600 mt-3">{description}</p>
      )}
    </div>
  );
}
