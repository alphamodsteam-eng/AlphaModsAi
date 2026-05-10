import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, Sparkles, Target, Zap, Send, Clipboard } from 'lucide-react';
import { PredictionRecord } from '../hooks/useWingoData';

interface RightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: PredictionRecord[];
}

export default function RightDrawer({ isOpen, onClose, history }: RightDrawerProps) {
  const completedHistory = history.filter(h => h.status !== 'Pending');
  const totalBets = completedHistory.length;
  const wins = completedHistory.filter(h => h.status === 'Win').length;
  const losses = completedHistory.filter(h => h.status === 'Loss').length;
  const accuracy = totalBets > 0 ? Math.round((wins / totalBets) * 100) : 0;

  const stats = [
    { label: 'WINS', value: wins, icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'LOSSES', value: losses, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'ACCURACY', value: `${accuracy}%`, icon: Target, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'TOTAL', value: totalBets, icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-50' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[999]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[75%] max-w-[220px] bg-white shadow-2xl z-[1000] p-4 flex flex-col"
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
              <h2 className="text-md font-black text-gray-900 tracking-tight">DASHBOARD</h2>
              <button 
                onClick={onClose} 
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map((stat, i) => (
                <div key={i} className={`${stat.bg} p-3 rounded-2xl flex flex-col items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
                  <span className="text-sm font-bold text-gray-900">{stat.value}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-3">
              <div className="text-center p-3 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-500 mb-1 font-black uppercase">Developer</p>
                <p className="text-sm font-black text-gray-900 uppercase">@AlphaModsAi</p>
              </div>

              <a 
                href="https://t.me/+zDMG6OFhIyExYzI9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full p-3 bg-sky-500 text-white rounded-2xl text-sm font-black hover:bg-sky-600 transition-all uppercase"
              >
                <Send className="w-4 h-4" />
                JOIN TELEGRAM
              </a>

              <button 
                onClick={() => {
                  const latest = history[0];
                  const text = `LAXI PREDICTOR\nPeriod: ${latest?.period || 'N/A'}\nPrediction: ${latest?.prediction || 'N/A'}\nConfidence: ${latest?.confidence || 0}%\nJoin: https://t.me/+zDMG6OFhIyExYzI9`;
                  navigator.clipboard.writeText(text);
                  alert('Prediction copied to clipboard!');
                }}
                className="flex items-center justify-center gap-2 w-full p-3 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition-all uppercase"
              >
                <Clipboard className="w-4 h-4" />
                COPY PREDICTION
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
