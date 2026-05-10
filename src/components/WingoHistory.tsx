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
      {/* Stats Dashboard - Decreased sizes */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/50 p-3 rounded-[20px] border-2 border-dashed border-emerald-200 flex justify-between items-center">
          <span className="text-emerald-500 font-black text-[12px]">Pass</span>
          <span className="text-emerald-500 font-black text-2xl">{wins}</span>
        </div>
        <div className="bg-white/50 p-3 rounded-[20px] border-2 border-dashed border-rose-200 flex justify-between items-center">
          <span className="text-rose-500 font-black text-[12px]">Fail</span>
          <span className="text-rose-500 font-black text-2xl">{losses}</span>
        </div>
        <div className="col-span-2 bg-white/50 p-4 rounded-[20px] border-2 border-dashed border-gray-200 flex justify-between items-center">
          <span className="text-gray-500 font-black text-[14px]">Accuracy</span>
          <span className="text-gray-400 font-black text-3xl">{accuracy}%</span>
        </div>
        <div className="col-span-2 bg-white/50 p-4 rounded-[20px] border-2 border-dashed border-purple-200 flex justify-between items-center">
          <span className="text-purple-500 font-black text-[14px]">Bets</span>
          <span className="text-purple-500 font-black text-3xl">{totalBets}</span>
        </div>
      </div>

      {/* Header - No box styling */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-[12px] font-black uppercase tracking-widest text-gray-400">PREDICTION HISTORY</h2>
        <button 
          onClick={clearHistory}
          className="text-rose-500 hover:text-rose-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {history.map((p, idx) => {
          const isWin = p.status === 'Win';
          const isLoss = p.status === 'Loss';
          const cardBorder = isWin ? 'border-green-500' : isLoss ? 'border-red-500' : 'border-sky-500';

          return (
            <motion.div
              key={`${p.period}-${idx}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02, y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 ${cardBorder} relative overflow-hidden`}
            >
              <div className={`py-1 text-center text-[8px] font-black uppercase tracking-widest text-white border-b border-white ${isWin ? 'bg-green-600' : isLoss ? 'bg-red-600' : 'bg-sky-500'}`}>
                {isWin && <CheckCircle className="w-3 h-3 inline mr-1" />}
                {isLoss && <XCircle className="w-3 h-3 inline mr-1" />}
                {!isWin && !isLoss && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="inline"><Loader2 className="w-3 h-3 inline mr-1" /></motion.div>}
                {p.status}
              </div>
               
              <div className="pl-5 pr-5 pt-3">
                {/* Top Row: Period and Time */}
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono font-black text-sm text-gray-800 uppercase tracking-tighter">#{p.period}</span>
                  <span className={`${isWin ? 'bg-green-100 text-green-600' : isLoss ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-600'} text-[10px] font-black px-2 py-0.5 rounded-md uppercase`}>WINGO 1 MIN</span>
                </div>

                {/* Prediction/Actual Box */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-xl p-3 border border-gray-100">
                    <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 tracking-wider">Predicted</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-sm uppercase tracking-tighter text-gray-900">{p.prediction}</span>
                    </div>
                  </div>
                  <div className={`bg-white rounded-xl p-3 border ${isWin ? 'border-green-100' : isLoss ? 'border-red-100' : 'border-sky-100'}`}>
                    <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 tracking-wider">ACTUAL</p>
                    <div className="flex items-baseline gap-2">
                       <span className={`font-black text-sm uppercase tracking-tighter ${isWin ? 'text-green-700' : isLoss ? 'text-red-700' : 'text-sky-700'}`}>
                         {p.actual || '---'}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className={`flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-t ${isWin ? 'border-green-100 text-green-600' : isLoss ? 'border-red-100 text-red-600' : 'border-sky-100 text-sky-600'} pt-3`}>
                  <div className="flex items-center gap-2">
                    <span>LAXI PREDICTOR</span>
                    <span>•</span>
                    <span>ENGINE V1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${isWin ? 'bg-green-500' : isLoss ? 'bg-red-500' : 'bg-sky-500'}`} />
                    {p.confidence}% CONF
                  </div>
                </div>
              </div>
              
              {/* Status Stamp */}
               <div className="absolute right-5 top-12 hidden">
                 <div className={`flex flex-col items-center gap-1 ${isWin ? 'text-green-500' : isLoss ? 'text-red-500' : 'text-gray-400'}`}>
                   <div className="w-8 h-8 rounded-full bg-current flex items-center justify-center text-white">{isWin ? '✓' : isLoss ? '✕' : '—'}</div>
                   <span className="text-[8px] font-black uppercase">{p.status}</span>
                 </div>
               </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
