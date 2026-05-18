import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Check, Clock, Server, Shield, Flame } from 'lucide-react';
import { PredictionRecord } from '../hooks/useWingoData';

interface PredictionNotificationProps {
  result: PredictionRecord | null;
  history: PredictionRecord[];
  onClose: () => void;
}

export default function PredictionNotification({ result, history, onClose }: PredictionNotificationProps) {
  const isJackpot = result?.status === 'Jackpot';
  const isWin = result?.status === 'Win' || isJackpot;

  // Calculate streak from history
  const calculateStreak = () => {
    if (!history) return 0;
    let streak = 0;
    for (const record of history) {
      if (record.status === 'Win' || record.status === 'Jackpot') streak++;
      else if (record.status === 'Loss') break;
    }
    return streak;
  };

  const streak = calculateStreak();

  return (
    <AnimatePresence>
      {result && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-[320px] bg-white rounded-[32px] overflow-hidden shadow-2xl relative z-10 border border-gray-100"
          >
            {/* Header Section */}
            <div className={`h-24 flex flex-col items-center justify-center ${isWin ? 'bg-red-500' : 'bg-gray-600'}`}>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>

              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 mb-1">
                {isWin ? (
                   <Trophy className="w-5 h-5 text-white" />
                ) : (
                   <X className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">
                {isJackpot ? 'Ultimate Victory' : (isWin ? 'Victory' : 'Defeat')}
              </span>
            </div>

            {/* Content Section */}
            <div className="px-6 pt-5 pb-6 text-center">
               <h2 className={`text-xl font-black mb-1 ${isWin ? 'text-red-600' : 'text-gray-700'}`}>
                 {isJackpot ? 'JACKPOT!' : (isWin ? 'YOU WIN!' : 'LOSS!')}
               </h2>

               {isWin && streak > 1 && (
                 <div className="inline-flex items-center gap-1 text-emerald-600 text-[9px] font-bold uppercase mb-3">
                   <Flame className="w-2 h-2 fill-current" />
                   <span>{streak} Wins Streak</span>
                 </div>
               )}

               <div className="grid grid-cols-2 gap-3 mb-5 mt-2">
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Prediction</span>
                    <span className={`text-base font-black ${isWin ? 'text-red-600' : 'text-gray-900'}`}>{result.prediction}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Result</span>
                    <span className="text-base font-black text-gray-900">{result.actual}</span>
                  </div>
               </div>

               <div className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100 mb-6">
                 <div className="flex justify-between items-center text-[9px]">
                   <span className="text-gray-400 font-bold uppercase">Period</span>
                   <span className="font-black text-gray-900">{result.period}</span>
                 </div>
                 
                 <div className="flex justify-between items-center text-[9px]">
                   <span className="text-gray-400 font-bold uppercase">Status</span>
                   <span className={`font-black uppercase ${isWin ? 'text-emerald-500' : 'text-red-500'}`}>
                     {result.status}
                   </span>
                 </div>
               </div>

               <button 
                 onClick={onClose}
                 className={`w-full py-3.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all shadow-md active:scale-95 ${isWin ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'}`}
               >
                 CONTINUE
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
