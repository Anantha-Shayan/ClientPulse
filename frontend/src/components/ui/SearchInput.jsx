import { Search, X } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-outline-variant bg-white pl-10 pr-9 text-sm outline-none transition focus:border-primary-container focus:ring-2 focus:ring-primary-fixed"
        placeholder={placeholder}
      />
      {value ? (
        <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-outline hover:bg-surface-container" onClick={() => onChange('')} aria-label="Clear search">
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
