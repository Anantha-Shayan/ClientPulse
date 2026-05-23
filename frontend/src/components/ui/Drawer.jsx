import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

export default function Drawer({ open, title, description, children, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.button
            aria-label="Close drawer"
            className="absolute inset-0 bg-ink/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white shadow-lg"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <header className="sticky top-0 z-10 flex items-start justify-between border-b border-outline-variant bg-white px-6 py-5">
              <div>
                <h2 className="text-headline-2 text-on-surface">{title}</h2>
                {description ? <p className="mt-1 text-sm text-on-surface-variant">{description}</p> : null}
              </div>
              <Button variant="ghost" icon={X} onClick={onClose} className="px-2" aria-label="Close" />
            </header>
            <div className="p-6">{children}</div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
