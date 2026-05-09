import { PredictionRecord } from '../hooks/useWingoData';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface WingoHistoryProps {
  history: PredictionRecord[];
  clearHistory: () => void;
}

export default function WingoHistory({ history, clearHistory }: WingoHistoryProps) {
  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Prediction History</h2>
        <button 
          onClick={clearHistory}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-600 transition-colors"
        >
          Delete All
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
                  <span className="font-mono font-bold text-xs text-gray-800">#{p.period}</span>
                  <span className={`${isWin ? 'bg-green-100 text-green-600' : isLoss ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-600'} text-[9px] font-black px-2 py-0.5 rounded-md uppercase`}>WINGO 1 MIN</span>
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
                <div className={`flex justify-between items-center text-[9px] font-black uppercase tracking-widest border-t ${isWin ? 'border-green-100 text-green-600' : isLoss ? 'border-red-100 text-red-600' : 'border-sky-100 text-sky-600'} pt-3`}>
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
