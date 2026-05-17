import { PredictionRecord } from '../hooks/useWingoData';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Loader2, User, X } from 'lucide-react';

interface WingoHistoryProps {
  history: PredictionRecord[];
  clearHistory: () => void;
  profileName: string;
  profileImage: string | null;
}

export default function WingoHistory({ history, clearHistory, profileName, profileImage }: WingoHistoryProps) {
  const wins = history.filter(h => h.status === 'Win').length;
  const losses = history.filter(h => h.status === 'Loss').length;
  const totalBets = wins + losses;
  const accuracy = totalBets > 0 ? Math.round((wins / totalBets) * 100) : 0;

  return (
    <div className="space-y-6 pb-20">
      {/* Stats Dashboard - Advanced Premium UI */}
      <div className="grid grid-cols-2 gap-3 px-1">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-md p-4 rounded-[24px] border border-emerald-100 shadow-[0_8px_20px_rgba(16,185,129,0.05)] relative overflow-hidden"
        >
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-50 rounded-full blur-xl" />
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.2em]">Wins</span>
            <span className="text-gray-900 font-black text-3xl">{wins}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-md p-4 rounded-[24px] border border-rose-100 shadow-[0_8px_20px_rgba(244,63,94,0.05)] relative overflow-hidden"
        >
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-rose-50 rounded-full blur-xl" />
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-rose-500 font-bold text-[10px] uppercase tracking-[0.2em]">Losses</span>
            <span className="text-gray-900 font-black text-3xl">{losses}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-[28px] shadow-xl relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          
          <div className="flex justify-between items-center relative z-10">
            <div className="space-y-0.5">
              <span className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.25em]">Win Accuracy</span>
              <div className="flex items-baseline gap-2">
                <span className="text-white font-black text-4xl">{accuracy}%</span>
                <span className="text-emerald-400 text-[10px] font-bold uppercase">Target: 90%+</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
               <div className="flex flex-col items-center">
                 <span className="text-white font-black text-xl">{totalBets}</span>
                 <span className="text-white/40 text-[8px] font-bold uppercase">Total</span>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Header - Modern Label */}
      <div className="flex justify-between items-center px-2 mt-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 bg-red-500 rounded-full" />
          <h2 className="text-[13px] font-black uppercase tracking-tight text-gray-900">Advanced Log</h2>
        </div>
        <button 
          onClick={clearHistory}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 px-1">
        <AnimatePresence mode="popLayout">
          {history.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center space-y-3"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-black text-xs uppercase">No predictions yet</p>
            </motion.div>
          ) : (
            history.map((p, idx) => {
              const isWin = p.status === 'Win';
              const isLoss = p.status === 'Loss';
              const isPending = p.status === 'Pending';

              return (
                <motion.div
                  key={`${p.period}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[26px] p-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 relative group"
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                    isWin ? 'bg-emerald-50 text-emerald-600' : 
                    isLoss ? 'bg-rose-50 text-rose-600' : 
                    'bg-slate-50 text-slate-400 animate-pulse'
                  }`}>
                    {isWin && <CheckCircle className="w-3 h-3" />}
                    {isLoss && <XCircle className="w-3 h-3" />}
                    {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                    {p.status}
                  </div>

                  <div className="space-y-4">
                    {/* Period Info */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Period ID</span>
                      <span className="text-sm font-black text-gray-900 tracking-tight">#{p.period}</span>
                    </div>

                    {/* Data Grid */}
                    <div className="flex items-center gap-8">
                       <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Alpha Prediction</span>
                          <span className={`text-[17px] font-black uppercase tracking-tight ${
                            p.prediction === 'Big' ? 'text-amber-500' : 'text-blue-500'
                          }`}>
                            {p.prediction}
                          </span>
                       </div>

                       <div className="w-[1px] h-8 bg-gray-100" />

                       <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Live Result</span>
                          <span className={`text-[17px] font-black uppercase tracking-tight ${
                            isPending ? 'text-gray-300 italic' : 
                            p.actual === 'Big' ? 'text-amber-500' : 'text-blue-500'
                          }`}>
                            {p.actual || 'Processing...'}
                          </span>
                       </div>
                    </div>

                    {/* Meta Footer */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                          <User className="w-4 h-4 text-gray-400" />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-900 leading-none">ANALYZER V.4</span>
                          <span className="text-[8px] font-bold text-gray-300 uppercase">Engine Core Alpha</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                         <div className="flex items-center gap-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                           <span className="text-[10px] font-black text-gray-900">{p.confidence}%</span>
                         </div>
                         <span className="text-[8px] font-bold text-gray-300 uppercase">Certainty Rate</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
