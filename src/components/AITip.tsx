import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AITipProps {
  tip: string;
  loading: boolean;
}

export default function AITip({ tip, loading }: AITipProps) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 mt-8">
      <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-300" />
          <span className="text-xs font-bold text-indigo-200 uppercase tracking-tighter">AI Hydration Guide</span>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 bg-indigo-300 rounded-full"
                  />
                ))}
              </div>
              <span className="text-white/60 text-sm italic">Thinking...</span>
            </motion.div>
          ) : (
            <motion.p
              key="tip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/90 text-sm md:text-base font-medium leading-relaxed italic"
            >
              "{tip}"
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
