import { motion } from "motion/react";

interface WaterWaveProps {
  percentage: number; // 0 to 1
}

export default function WaterWave({ percentage }: WaterWaveProps) {
  // Map percentage to height
  const heightPercent = Math.min(1, Math.max(0, percentage)) * 100;

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
      {/* Outer Glow/Ring */}
      <div className="absolute inset-0 rounded-full bg-white shadow-[0_0_50px_-12px_rgba(14,165,233,0.15)] border border-slate-100" />
      
      {/* Progress Circle SVG (Theme Match) */}
      <svg className="absolute w-[110%] h-[110%] -rotate-90 pointer-events-none">
        <circle 
          cx="50%" cy="50%" r="45%" 
          stroke="#f1f5f9" strokeWidth="2" fill="transparent" 
        />
        <motion.circle 
          cx="50%" cy="50%" r="45%" 
          stroke="#0ea5e9" strokeWidth="3" fill="transparent"
          strokeDasharray="100 100"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 100 - (heightPercent) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>

      {/* Wave Container (Clipping Circle) */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-slate-50 border border-slate-100/50">
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-sky-500/80"
          initial={{ height: "0%" }}
          animate={{ height: `${heightPercent}%` }}
          transition={{ type: "spring", damping: 25, stiffness: 40 }}
        >
          <div className="relative w-full h-full">
            <motion.svg
              viewBox="0 0 120 28"
              className="absolute -top-6 left-0 w-[200%] h-12 text-sky-400 fill-current"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <path d="M0 15 Q30 5 60 15 T120 15 V30 H0 Z" />
              <path d="M120 15 Q150 5 180 15 T240 15 V30 H120 Z" />
            </motion.svg>
          </div>
        </motion.div>

        {/* Text Coverage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <motion.div
            key={heightPercent}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-baseline gap-1"
          >
            <span className="text-7xl font-light text-slate-900 font-display">
              {Math.round(heightPercent)}
            </span>
            <span className="text-xl text-slate-400 font-medium">%</span>
          </motion.div>
          <div className="mt-4 px-4 py-1.5 bg-white/90 backdrop-blur shadow-sm rounded-full border border-slate-100">
             <p className="text-[10px] font-bold text-sky-600 uppercase tracking-[0.2em]">Intake Reach</p>
          </div>
        </div>
      </div>
    </div>
  );
}
