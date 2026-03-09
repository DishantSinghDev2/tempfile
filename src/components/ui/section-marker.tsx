// src/components/ui/section-marker.tsx
interface SectionMarkerProps {
  index: number;
  total: number;
  label: string;
}

export function SectionMarker({ index, total, label }: SectionMarkerProps) {
  const padded = String(index).padStart(2, "0");
  const totalPadded = String(total).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 mb-10">
      <div className="w-0.5 h-4 bg-border" />
      <span className="font-mono text-xs font-semibold text-foreground">
        [ {padded} / {totalPadded} ]
      </span>
      <span className="text-muted-foreground/50 text-xs">·</span>
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
