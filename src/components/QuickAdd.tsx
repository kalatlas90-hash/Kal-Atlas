import { motion } from "motion/react";

interface QuickAddProps {
  onAdd: (amount: number) => void;
}

export default function QuickAdd({ onAdd }: QuickAddProps) {
  const options = [
    { label: "250ml", amount: 250, sub: "Standard Glass", delay: 0 },
    { label: "500ml", amount: 500, sub: "Large Bottle", delay: 0.1 },
    { label: "330ml", amount: 330, sub: "Can", delay: 0.2 },
    { label: "750ml", amount: 750, sub: "Hydration Pack", delay: 0.3 },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl px-4">
      {options.map((opt, i) => (
        <motion.button
          key={opt.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: opt.delay }}
          onClick={() => onAdd(opt.amount)}
          className={`flex flex-col items-center gap-2 p-6 rounded-[28px] transition-all active:scale-95 shadow-sm border ${
            i === 1 
              ? "bg-sky-500 text-white border-sky-400 shadow-sky-200/50" 
              : "bg-white text-slate-800 border-slate-100 hover:bg-sky-50"
          }`}
        >
          <span className="text-xl font-bold">+{opt.amount}</span>
          <span className={`text-[10px] uppercase tracking-widest font-bold ${i === 1 ? "text-sky-100" : "text-slate-400"}`}>
            {opt.sub}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
