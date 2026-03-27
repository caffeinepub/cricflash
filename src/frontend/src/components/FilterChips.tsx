interface FilterChipsProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}

export default function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterChipsProps<T>) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <span className="text-xs font-semibold text-muted-foreground shrink-0">
        {label}:
      </span>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            value === opt
              ? "bg-cric-red text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          data-ocid="filter.toggle"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
