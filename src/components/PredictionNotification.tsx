import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Check, ArrowRight, Server, Clock, Flame, Shield } from 'lucide-react';
import { PredictionRecord } from '../hooks/useWingoData';

interface PredictionNotificationProps {
  result: PredictionRecord | null;
  history: PredictionRecord[];
  onClose: () => void;
}

export default function PredictionNotification({ result, history, onClose }: PredictionNotificationProps) {
  if (!result) return null;

  const isWin = result.status === 'Win';

  // Calculate streak from history
  const calculateStreak = () => {
    let streak = 0;
    for (const record of history) {
      if (record.status === 'Win') streak++;
      else if (record.status === 'Loss') break;
    }
    return streak;
  };

  const streak = calculateStreak();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="w-full max-w-[320px] bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20"
        >
          {/* Header Section - Micro */}
          <div className={`relative h-24 flex flex-col items-center justify-center overflow-hidden ${isWin ? 'bg-sky-500' : 'bg-gray-500'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all border border-white/10"
            >
              <X className="w-2.5 h-2.5 text-white" />
            </button>

            {/* Title Badge - Micro */}
            <div className="bg-white/95 backdrop-blur-md px-3 py-0.5 rounded-full mb-2 flex items-center gap-1 shadow-sm">
              <span className="text-yellow-500 text-[8px]">★</span>
              <span className={`text-[8px] font-black uppercase tracking-[0.1em] ${isWin ? 'text-sky-600' : 'text-gray-600'}`}>
                {isWin ? 'Victory' : 'Defeat'}
              </span>
              <span className="text-yellow-500 text-[8px]">★</span>
            </div>

            {/* Icon - Micro */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-30 scale-125 animate-pulse" />
              <div className="w-10 h-10 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-md relative border-2 border-white/40">
                {isWin ? (
                   <Trophy className="w-5 h-5 text-white drop-shadow-sm" />
                ) : (
                   <X className="w-5 h-5 text-white drop-shadow-sm" />
                )}
              </div>
            </div>
          </div>

          {/* Content Section - Micro */}
          <div className="px-5 pt-4 pb-5 text-center">
             <h2 className={`text-xl font-black mb-1 tracking-tighter ${isWin ? 'text-sky-600' : 'text-gray-600'}`}>
               {isWin ? 'YOU WIN!' : 'BETTER LUCK!'}
             </h2>

             {isWin && streak > 0 && (
               <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider mb-3 border border-emerald-100">
                 <Flame className="w-2 h-2 fill-current" />
                 <span>Streak {streak}</span>
               </div>
             )}

             <div className="grid grid-cols-2 gap-2 mb-4">
                <div className={`p-2 rounded-xl border ${isWin ? 'bg-sky-50 border-sky-100' : 'bg-gray-50 border-gray-100'}`}>
                  <span className={`text-[7px] font-black uppercase tracking-widest block mb-0.5 ${isWin ? 'text-sky-500' : 'text-gray-400'}`}>Pred</span>
                  <span className="text-sm font-black text-gray-900">{result.prediction}</span>
                </div>
                <div className={`p-2 rounded-xl border relative ${isWin ? 'bg-sky-500 border-sky-400' : 'bg-gray-400 border-gray-300'}`}>
                  <span className="text-[7px] font-black uppercase tracking-widest text-white/70 block mb-0.5">Actual</span>
                  <span className="text-sm font-black text-white">{result.actual}</span>
                  {isWin && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-sky-100">
                      <Check className="w-2 h-2 text-sky-500 font-bold" />
                    </div>
                  )}
                </div>
             </div>

             <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-2 border border-gray-100/80 mb-4">
               <div className="flex justify-between items-center text-[8px]">
                 <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-2 h-2" />
                    <span className="font-bold uppercase">Period</span>
                 </div>
                 <span className="font-black text-gray-900">{result.period}</span>
               </div>
               
               <div className="flex justify-between items-center text-[8px]">
                 <div className="flex items-center gap-1 text-gray-400">
                    <Server className="w-2 h-2" />
                    <span className="font-bold uppercase">Server</span>
                 </div>
                 <span className="font-black text-gray-900 uppercase">LAXI-NX1</span>
               </div>

               <div className="flex justify-between items-center text-[8px]">
                 <div className="flex items-center gap-1 text-gray-400">
                    <Shield className="w-2 h-2" />
                    <span className="font-bold uppercase">Engine</span>
                 </div>
                 <span className="font-black text-sky-600">Secure v4</span>
               </div>
             </div>

             <button 
               onClick={onClose}
               className={`w-full py-3 rounded-lg flex items-center justify-center gap-1.5 text-[10px] font-black tracking-widest uppercase transition-all shadow-sm active:scale-95 ${isWin ? 'bg-sky-500 text-white hover:bg-sky-600' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
             >
               CONTINUE
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
