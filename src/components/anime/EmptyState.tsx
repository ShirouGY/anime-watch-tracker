
import { ReactNode } from "react";
import { AddAnimeDialog } from "@/components/AddAnimeDialog";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 border border-dashed rounded-md">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-muted-foreground mb-4">
        {description}
      </p>
      <AddAnimeDialog />
    </div>
  );
}
