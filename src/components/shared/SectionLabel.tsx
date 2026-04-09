interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <span
      className={`text-xs uppercase tracking-widest text-muted font-body ${className}`}
    >
      {children}
    </span>
  );
}
