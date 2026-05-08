import React from "react";
import { AnimatePresence, motion } from "motion/react";

export default function CartDrawer({ open, onClose, cart, onQty }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed right-0 top-0 h-full w-[420px] max-w-[92vw] z-50 border-l border-white/10 bg-[#0b1020]/90 backdrop-blur-xl p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Your Cart</h2>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-white/80 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3 overflow-auto h-[78%] pr-2">
              <AnimatePresence>
                {(cart?.items || []).map((i) => (
                  <motion.div
                    key={i.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white">{i.name}</div>
                        <div className="text-xs text-white/60">Vendor: {i.vendor_id}</div>
                      </div>
                      <div className="text-right text-white font-semibold">₹{i.price}</div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => onQty(i.id, Math.max(1, i.quantity - 1))}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-white hover:bg-white/10"
                      >
                        -
                      </button>
                      <div className="min-w-[40px] text-center text-white">{i.quantity}</div>
                      <button
                        onClick={() => onQty(i.id, i.quantity + 1)}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-white hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex justify-between text-white">
                <span className="text-white/70">Subtotal</span>
                <span className="font-bold">₹{cart?.subtotal || 0}</span>
              </div>
              <p className="mt-2 text-xs text-white/60">
                Tip: Checkout will split orders vendor-wise (multi-vendor cart).
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
