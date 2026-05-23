import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({ title, children, open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4">
      <section className="w-full max-w-xl rounded-lg bg-white shadow-panel">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" icon={X} onClick={onClose} className="px-2" aria-label="Close" />
        </header>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}
