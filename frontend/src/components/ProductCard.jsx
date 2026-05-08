import React from "react";
import { motion } from "motion/react";

export default function ProductCard({ p, onAdd }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-[0_20px_60px_rgba(0,0,0,.35)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{p.name}</h3>
          <p className="mt-1 text-sm text-white/70 line-clamp-2">{p.description}</p>
          <div className="mt-3 inline-flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80">
              {p.category}
            </span>
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80">
              Stock: {p.stock}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold text-white">₹{p.price}</div>
          <div className="mt-1 text-xs text-white/60">Vendor: {p.vendor_id}</div>
        </div>
      </div>

      <button
        onClick={() => onAdd(p.id)}
        disabled={p.stock <= 0}
        className="mt-4 w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/10 disabled:text-white/40 px-4 py-2 font-semibold text-white transition"
      >
        Add to Cart
      </button>
    </motion.div>
  );
}