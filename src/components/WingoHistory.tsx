import { PredictionRecord, LotteryResult } from '../hooks/useWingoData';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { CheckCircle, XCircle, Loader2, User, X, Trash2 } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';

interface WingoHistoryProps {
  history: PredictionRecord[];
  allResults: LotteryResult[];
  clearHistory: () => void;
  deleteHistoryEntry: (period: string) => void;
  profileName: string;
  profileImage: string | null;
}

interface HistoryItemProps {
  p: PredictionRecord;
  idx: number;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ p, idx }) => {
  const isJackpot = p.status === 'Jackpot';
  const isWin = p.status === 'Win' || isJackpot;
  const isLoss = p.status === 'Loss';
  const isPending = p.status === 'Pending';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 40,
        delay: idx * 0.03
      }}
      className={`rounded-[26px] p-4 shadow-sm border relative group overflow-hidden transition-colors ${
        isJackpot ? 'bg-emerald-50 border-emerald-300' :
        isWin ? 'bg-white border-emerald-200' : 
        isLoss ? 'bg-white border-red-200' : 
        'bg-white border-gray-100'
      }`}
    >
      {/* Animated Backgrounds */}
      {(isWin || isJackpot) && (
        <motion.div 
          animate={{ 
            background: [
              'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 1) 100%)',
              'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(16, 185, 129, 0.1) 100%)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0 pointer-events-none"
        />
      )}
      
      {isLoss && (
        <motion.div 
          animate={{ 
            background: [
              'linear-gradient(135deg, rgba(239, 68, 68, 0.03) 0%, rgba(255, 255, 255, 1) 100%)',
              'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(239, 68, 68, 0.03) 100%)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0 pointer-events-none"
        />
      )}

      {/* Status Indicator Bar */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 z-10 ${
        isJackpot ? 'bg-emerald-600 text-white shadow-md' :
        isWin ? 'bg-emerald-500 text-white shadow-sm' : 
        isLoss ? 'bg-red-500 text-white shadow-sm' : 
        'bg-slate-50 text-slate-400 animate-pulse'
      }`}>
        {isJackpot && <CheckCircle className="w-3 h-3 animate-bounce" />}
        {(isWin && !isJackpot) && <CheckCircle className="w-3 h-3" />}
        {isLoss && <XCircle className="w-3 h-3" />}
        {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
        {p.status === 'Jackpot' ? 'JACKPOT WIN!' : p.status}
      </div>

      <div className="space-y-4 relative z-10 pointer-events-none select-none">
        {/* Period Info */}
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Period ID</span>
          <span className="text-sm font-black text-gray-900 tracking-tight">#{p.period}</span>
        </div>

        {/* Data Grid */}
        <div className="flex items-center gap-12">
           <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Prediction</span>
              <span className={`text-[17px] font-black uppercase tracking-tight ${
                p.prediction === 'Big' ? 'text-amber-500' : 'text-blue-500'
              }`}>
                {p.prediction}
              </span>
           </div>

           <div className="w-[1px] h-8 bg-gray-100" />

           <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Result</span>
              <span className={`text-[17px] font-black uppercase tracking-tight ${
                isPending ? 'text-gray-300 italic' : 
                p.actual === 'Big' ? 'text-amber-500' : 'text-blue-500'
              }`}>
                {p.actual || 'Working...'}
              </span>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WingoHistory({ history, allResults, clearHistory, deleteHistoryEntry, profileName, profileImage }: WingoHistoryProps) {
  const wins = history.filter(h => h.status === 'Win' || h.status === 'Jackpot').length;
  const losses = history.filter(h => h.status === 'Loss').length;
  const totalBets = wins + losses;
  const accuracy = totalBets > 0 ? Math.round((wins / totalBets) * 100) : 0;
  const [activeTab, setActiveTab] = React.useState<'chart' | 'history'>('history');
  
  const chartRef = useRef<HTMLDivElement>(null);
  const [linePath, setLinePath] = useState('');

  // Calculate SVG Path for trend line
  useEffect(() => {
    if (activeTab !== 'chart' || !allResults.length || !chartRef.current) return;

    const updatePath = () => {
      const container = chartRef.current;
      if (!container) return;

      const rows = container.querySelectorAll('.chart-row');
      const points: { x: number; y: number }[] = [];

      rows.forEach((row) => {
        const activeNum = row.querySelector('.active-num');
        if (activeNum) {
          const rect = activeNum.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          points.push({
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2
          });
        }
      });

      if (points.length < 2) {
        setLinePath('');
        return;
      }

      const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      setLinePath(path);
    };

    // Small delay to ensure DOM is rendered
    const timer = setTimeout(updatePath, 100);
    window.addEventListener('resize', updatePath);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePath);
    };
  }, [activeTab, allResults]);

  return (
    <div className="space-y-6 pb-20">
      {/* Stats Dashboard - Advanced Premium UI */}
      <div className="grid grid-cols-2 gap-3 px-1">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-emerald-50/50 p-4 rounded-[28px] border border-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.08)] relative overflow-hidden"
        >
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-[0.15em]">Wins</span>
            <span className="text-gray-900 font-black text-3xl">{wins}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-200 rounded-full blur-lg opacity-40" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-rose-50/50 p-4 rounded-[28px] border border-rose-100 shadow-[0_4px_20px_rgba(244,63,94,0.08)] relative overflow-hidden"
        >
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-rose-600 font-bold text-[10px] uppercase tracking-[0.15em]">Losses</span>
            <span className="text-gray-900 font-black text-3xl">{losses}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-rose-200 rounded-full blur-lg opacity-40" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50/50 p-4 rounded-[28px] border border-blue-100 shadow-[0_4px_20px_rgba(59,130,246,0.08)] relative overflow-hidden"
        >
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.15em]">Accuracy</span>
            <div className="flex items-baseline gap-1">
              <span className="text-gray-900 font-black text-3xl">{accuracy}%</span>
            </div>
            <span className="text-blue-500 text-[8px] font-bold uppercase">Target 90%+</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-200 rounded-full blur-lg opacity-40" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50/50 p-4 rounded-[28px] border border-orange-100 shadow-[0_4px_20px_rgba(249,115,22,0.08)] relative overflow-hidden"
        >
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-orange-600 font-bold text-[10px] uppercase tracking-[0.15em]">Total</span>
            <span className="text-gray-900 font-black text-3xl">{totalBets}</span>
            <span className="text-orange-500 text-[8px] font-bold uppercase">Predictions</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-200 rounded-full blur-lg opacity-40" />
        </motion.div>
      </div>

      {/* Modern Filter Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100/50 rounded-[20px] mx-1">
        <button 
          onClick={() => setActiveTab('chart')}
          className={`flex-1 py-3.5 rounded-[16px] text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${
            activeTab === 'chart' 
              ? 'bg-red-500 text-white shadow-[0_8px_20px_rgba(239,68,68,0.3)]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Chart
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3.5 rounded-[16px] text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${
            activeTab === 'history' 
              ? 'bg-red-500 text-white shadow-[0_8px_20px_rgba(239,68,68,0.3)]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          My history
        </button>
      </div>

      {activeTab === 'history' ? (
        <>
          {/* Advanced Prediction Log Header */}
          <div className="flex justify-between items-center px-2 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-red-500 rounded-full" />
              <h2 className="text-[13px] font-black uppercase tracking-tight text-gray-900">Advanced Log</h2>
            </div>
          </div>

          <div className="space-y-4 px-1 overflow-x-hidden">
            <AnimatePresence mode="popLayout">
              {history.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key="empty"
                  className="py-20 text-center space-y-3"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-black text-xs uppercase">No predictions yet</p>
                </motion.div>
              ) : (
                history.map((p, idx) => (
                  <HistoryItem 
                    key={`${p.period}-${idx}`} 
                    p={p} 
                    idx={idx} 
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm mx-1">
          <div className="relative overflow-hidden" ref={chartRef}>
            {/* SVG Line Overlay */}
            <svg className="absolute inset-0 pointer-events-none z-10" style={{ width: '100%', height: '100%' }}>
              <path 
                d={linePath} 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="opacity-60"
              />
            </svg>

            <table className="w-full text-[9px] font-bold border-collapse table-fixed">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase tracking-tighter">
                  <th className="py-4 pl-3 text-left w-[60px]">Period</th>
                  <th className="py-4 px-0">
                    <div className="flex justify-between max-w-[170px] mx-auto">
                      {[0,1,2,3,4,5,6,7,8,9].map(n => <span key={n} className="w-4 text-center">{n}</span>)}
                    </div>
                  </th>
                  <th className="py-4 pr-3 text-right w-[30px]">R</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allResults.slice(0, 50).map((res, idx) => {
                  const numValue = parseInt(res.number);
                  const isBig = numValue >= 5;
                  const num = numValue;
                  const shortPeriod = res.issueNumber.slice(-4);
                  
                  return (
                    <tr key={res.issueNumber} className="chart-row hover:bg-gray-50/30 transition-colors">
                      <td className="py-3 pl-3 text-gray-900 font-black tracking-tighter whitespace-nowrap">
                        ...{shortPeriod}
                      </td>
                      <td className="py-3 px-0">
                        <div className="flex justify-between max-w-[170px] mx-auto">
                          {[0,1,2,3,4,5,6,7,8,9].map(n => {
                            const isActive = n === num;
                            return (
                              <div key={n} className="w-4 h-4 flex items-center justify-center">
                                {isActive ? (
                                  <div className={`active-num w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] text-white shadow-sm z-20 font-black ${
                                    num === 0 ? 'bg-indigo-400' :
                                    num === 5 ? 'bg-pink-400' :
                                    num % 2 === 0 ? 'bg-red-400' : 'bg-emerald-400'
                                  }`}>
                                    {n}
                                  </div>
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-gray-100/50 flex items-center justify-center text-[6px] text-gray-200 font-medium">
                                    {n}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] text-white mx-auto shadow-sm font-black ${
                          isBig ? 'bg-amber-500' : 'bg-blue-400'
                        }`}>
                          {isBig ? 'B' : 'S'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {allResults.length === 0 && (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-gray-200 animate-spin mx-auto mb-3" />
              <p className="text-xs font-black text-gray-300 uppercase">Connecting to secure server...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

