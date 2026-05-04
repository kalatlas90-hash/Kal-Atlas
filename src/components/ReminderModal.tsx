import { Bell, BellOff, X, Clock, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ReminderSettings } from "../types";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReminderSettings;
  onSave: (settings: ReminderSettings) => void;
}

export default function ReminderModal({ isOpen, onClose, settings, onSave }: ReminderModalProps) {
  const handleChange = (key: keyof ReminderSettings, value: any) => {
    onSave({ ...settings, [key]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[32px] shadow-2xl z-[70] p-8 border border-slate-100"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-sky-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Smart Reminders</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  {settings.enabled ? <Bell className="text-sky-500" /> : <BellOff className="text-slate-400" />}
                  <div>
                    <p className="font-bold text-slate-900">Notifications</p>
                    <p className="text-xs text-slate-500">Enable hydration alerts</p>
                  </div>
                </div>
                <button
                  onClick={() => handleChange("enabled", !settings.enabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.enabled ? "bg-sky-500" : "bg-slate-200"}`}
                >
                  <motion.div
                    animate={{ x: settings.enabled ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              {settings.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-6 pt-2"
                >
                  {/* Interval */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Interval
                      </label>
                      <span className="text-xs font-bold text-sky-600">Every {settings.interval} min</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="180"
                      step="15"
                      value={settings.interval}
                      onChange={(e) => handleChange("interval", parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-sky-500"
                    />
                  </div>

                  {/* Do Not Disturb / Active Hours */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Sun className="w-3 h-3" /> Start Hour
                      </label>
                      <select
                        value={settings.startHour}
                        onChange={(e) => handleChange("startHour", parseInt(e.target.value))}
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:border-sky-300"
                      >
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={i}>{i}:00</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Moon className="w-3 h-3" /> End Hour
                      </label>
                      <select
                        value={settings.endHour}
                        onChange={(e) => handleChange("endHour", parseInt(e.target.value))}
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:border-sky-300"
                      >
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={i}>{i}:00</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
