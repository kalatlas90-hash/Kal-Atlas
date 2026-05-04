/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, History, Settings, Trash2, ChartBar, Waves, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WaterLog, ReminderSettings } from "./types";
import WaterWave from "./components/WaterWave";
import QuickAdd from "./components/QuickAdd";
import AITip from "./components/AITip";
import ReminderModal from "./components/ReminderModal";
import { getHydrationTip } from "./services/gemini";

export default function App() {
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [goal, setGoal] = useState<number>(2000);
  const [showHistory, setShowHistory] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [tip, setTip] = useState<string>("Sip slowly to stay consistently hydrated throughout the day.");
  const [tipLoading, setTipLoading] = useState(false);

  const [reminders, setReminders] = useState<ReminderSettings>({
    enabled: false,
    interval: 60,
    startHour: 8,
    endHour: 22,
  });

  // Load data
  useEffect(() => {
    const savedLogs = localStorage.getItem("hydroflow_logs");
    const savedGoal = localStorage.getItem("hydroflow_goal");
    const savedReminders = localStorage.getItem("hydroflow_reminders");

    if (savedLogs) {
      const parsed = JSON.parse(savedLogs);
      const today = new Date().setHours(0, 0, 0, 0);
      setLogs(parsed.filter((l: WaterLog) => l.timestamp >= today));
    }
    if (savedGoal) setGoal(Number(savedGoal));
    if (savedReminders) setReminders(JSON.parse(savedReminders));

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("hydroflow_logs", JSON.stringify(logs));
    localStorage.setItem("hydroflow_goal", goal.toString());
    localStorage.setItem("hydroflow_reminders", JSON.stringify(reminders));
  }, [logs, goal, reminders]);

  const totalToday = useMemo(() => logs.reduce((acc, l) => acc + l.amount, 0), [logs]);
  const progress = totalToday / goal;

  const handleAdd = (amount: number) => {
    const newLog = {
      id: crypto.randomUUID(),
      amount,
      timestamp: Date.now(),
    };
    setLogs((prev) => [newLog, ...prev]);
    refreshTip(totalToday + amount);
  };

  const deleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const refreshTip = async (currentIntake?: number) => {
    setTipLoading(true);
    const newTip = await getHydrationTip(currentIntake ?? totalToday, goal);
    setTip(newTip);
    setTipLoading(false);
  };

  // Reminder Logic
  useEffect(() => {
    if (!reminders.enabled) return;

    const checkReminder = () => {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour < reminders.startHour || currentHour >= reminders.endHour) return;

      const lastLogTime = logs[0]?.timestamp || new Date().setHours(reminders.startHour, 0, 0, 0);
      const diffMinutes = (Date.now() - lastLogTime) / (1000 * 60);

      if (diffMinutes >= reminders.interval) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("AQUA Reminder", {
            body: "It's time to drink some water and stay hydrated!",
            icon: "/favicon.ico"
          });
        }
      }
    };

    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, [reminders, logs]);

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 font-sans selection:bg-sky-200 overflow-x-hidden">
      <main className="relative z-10 max-w-5xl mx-auto px-8 py-10 flex flex-col items-center min-h-screen">
        {/* Header */}
        <header className="w-full flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200">
               <Waves className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">AQUA</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Daily Goal</p>
              <div className="flex items-center justify-end gap-1 text-slate-700">
                <input 
                  type="number" 
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="w-12 bg-transparent text-lg font-semibold text-right focus:outline-none focus:text-sky-600 transition-colors"
                />
                <span className="text-sm font-medium">ml</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowReminders(true)}
                className={`w-12 h-12 rounded-2xl shadow-sm border flex items-center justify-center transition-colors ${reminders.enabled ? 'bg-sky-500 border-sky-400 text-white' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
              >
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors relative"
              >
                <History className="w-5 h-5 text-slate-400" />
                {logs.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-sky-500 rounded-full border-2 border-white" />}
              </button>
            </div>
          </div>
        </header>

        {/* Visualizer Block */}
        <section className="w-full flex flex-col lg:flex-row items-center justify-center gap-16 mb-20 px-4">
          <div className="flex-1 flex flex-col items-center">
            <WaterWave percentage={progress} />
          </div>

          <div className="flex flex-col gap-8 w-full max-w-sm">
             <div className="bg-white rounded-[32px] p-10 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <h2 className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold mb-6">Hydration Progress</h2>
                <div className="flex items-baseline gap-2 mb-2">
                   <span className="text-6xl font-light text-slate-900 font-display transition-all">{totalToday}</span>
                   <span className="text-xl text-slate-400 font-medium">ml</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">Out of {goal}ml target</p>
                
                <div className="w-full mt-10 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={false}
                    animate={{ width: `${Math.min(100, progress * 100)}%` }}
                    className="h-full bg-sky-500"
                  />
                </div>
             </div>
             
             <QuickAdd onAdd={handleAdd} />
          </div>
        </section>

        <AITip tip={tip} loading={tipLoading} />

        {/* Footer / Status */}
        <footer className="mt-auto w-full pt-12 flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-200/50">
          <div className="flex gap-8">
            <span className="text-sky-600 border-b-2 border-sky-500 pb-1 cursor-pointer">Dashboard</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Insights</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors" onClick={() => setShowReminders(true)}>Settings</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${reminders.enabled ? 'bg-green-400' : 'bg-slate-300'}`}></span>
            <span className="text-slate-300">Reminders: {reminders.enabled ? 'On' : 'Off'}</span>
          </div>
        </footer>

        {/* Modals & History Drawer */}
        <ReminderModal 
          isOpen={showReminders} 
          onClose={() => setShowReminders(false)} 
          settings={reminders}
          onSave={setReminders}
        />

        {/* History Drawer (Theme Match) */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[0_0_100px_-20px_rgba(0,0,0,0.1)] z-50 p-12 border-l border-slate-100 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Log History</h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-5 h-5 rotate-45 text-slate-400" />
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-200">
                  <Waves className="w-16 h-16 mb-4" />
                  <p className="text-xs uppercase tracking-widest font-bold">No intake recorded today</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {logs.map((log) => (
                    <motion.div
                      layout
                      key={log.id}
                      className="group flex items-center justify-between p-2"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] font-bold text-slate-300 w-12 tracking-tighter">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="flex flex-col">
                           <span className="text-lg font-semibold text-slate-800">{log.amount} ml</span>
                           <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">Water Intake</span>
                        </div>
                      </div>
                      <motion.button 
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => deleteLog(log.id)}
                         className="w-8 h-8 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                         <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goal Indicator */}
        <AnimatePresence>
          {totalToday >= goal && totalToday - (logs[0]?.amount || 0) < goal && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-24 bg-sky-500 text-white px-8 py-4 rounded-3xl shadow-2xl shadow-sky-200 font-bold z-50 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                <Waves className="w-4 h-4" />
              </div>
              Daily goal achieved! Refreshing work.
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
