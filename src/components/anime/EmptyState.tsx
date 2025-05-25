
import { AddAnimeDialog } from "@/components/AddAnimeDialog";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-12 sm:py-16 border border-dashed rounded-md mx-2 sm:mx-0">
      <Icon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-medium mb-1">{title}</h3>
      <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
        {description}
      </p>
      <div className="px-4">
        <AddAnimeDialog />
      </div>
    </div>
  );
}
