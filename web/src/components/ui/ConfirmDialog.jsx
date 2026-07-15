import { AnimatePresence, motion } from 'framer-motion'
import { Trash2, X } from 'lucide-react'

/**
 * Reusable confirm modal for destructive lounge actions.
 */
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  busy = false,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            aria-label="Close dialog"
            onClick={onCancel}
            disabled={busy}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-desc"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_24px_64px_rgba(22,20,17,0.18)]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-[#5CA47B]/12 text-[#5CA47B]">
                  <Trash2 size={18} strokeWidth={2.2} />
                </span>
                <div>
                  <h2
                    id="confirm-dialog-title"
                    className="font-serif text-xl font-semibold text-ink"
                  >
                    {title}
                  </h2>
                  {description && (
                    <p
                      id="confirm-dialog-desc"
                      className="mt-1 text-sm leading-relaxed text-muted"
                    >
                      {description}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                disabled={busy}
                className="rounded-xl p-1.5 text-muted transition hover:bg-cream-deep hover:text-ink disabled:opacity-50"
                aria-label="Cancel"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-wrap justify-end gap-2 px-5 py-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={busy}
                className="rounded-full border border-border bg-cream-deep px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-[#5CA47B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#5CA47B]/25 transition hover:brightness-105 disabled:opacity-60"
              >
                <Trash2 size={15} strokeWidth={2.4} />
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
