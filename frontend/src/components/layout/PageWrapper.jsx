import { motion } from 'framer-motion';

export default function PageWrapper({ title, eyebrow, actions, children }) {
  return (
    <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-7xl p-4 lg:p-6 xl:p-8">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow ? <p className="text-label uppercase tracking-wide text-primary">{eyebrow}</p> : null}
          <h1 className="text-headline-1 text-on-surface">{title}</h1>
        </div>
        {actions}
      </div>
      {children}
    </motion.main>
  );
}
