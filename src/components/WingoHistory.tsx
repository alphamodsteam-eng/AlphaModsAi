import { PredictionRecord, LotteryResult } from '../hooks/useWingoData';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { CheckCircle, XCircle, Loader2, User, X, Trash2, Calendar, ChevronDown, Search, Filter, TrendingUp, Copy, Trophy, Clock, MoreVertical, Target, ChevronRight, BarChart2, History } from 'lucide-react';
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
  
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(p.period);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format dynamic consistent date/time based on period
  const formatPeriodDateTime = (period: string) => {
    if (period && period.length >= 8) {
      const year = period.substring(0, 4);
      const monthStr = period.substring(4, 6);
      const day = period.substring(6, 8);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(monthStr, 10) - 1;
      const month = (monthIdx >= 0 && monthIdx < 12) ? months[monthIdx] : 'Jun';
      
      const lastDigits = parseInt(period.slice(-4), 10) || 100;
      const hourNum = (8 + Math.floor(lastDigits / 60)) % 12 || 12;
      const minuteNum = lastDigits % 60;
      const secondNum = (lastDigits * 7) % 60;
      const ampm = (8 + Math.floor(lastDigits / 60)) >= 12 ? 'PM' : 'AM';
      
      const pad = (n: number) => String(n).padStart(2, '0');
      
      return `${day} ${month} ${year} • ${pad(hourNum)}:${pad(minuteNum)}:${pad(secondNum)} ${ampm}`;
    }
    return '27 Jun 2026 • 08:35:21 AM';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01, translateY: -1, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ 
        type: "spring",
        stiffness: 450,
        damping: 30,
        delay: Math.min(idx * 0.02, 0.2)
      }}
      className={`bg-white rounded-[16px] shadow-sm border border-gray-100 flex flex-col overflow-hidden transition-all relative ${
        isPending ? 'border-l-[4px] border-l-red-500' :
        isWin ? 'border-l-[4px] border-l-emerald-500' :
        isLoss ? 'border-l-[4px] border-l-red-500' :
        'border-l-[4px] border-l-gray-400'
      }`}
    >
      {/* Top Header Row of the Card */}
      <div className="flex justify-between items-center px-3 pt-2.5 pb-1">
        <div className="flex flex-col">
          <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-wider">PERIOD ID</span>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-extrabold text-gray-900 tracking-tight">#{p.period}</span>
            <button 
              onClick={handleCopy}
              className="p-0.5 hover:bg-gray-100 rounded transition-colors active:scale-95 flex items-center justify-center"
              title="Copy Period ID"
            >
              {copied ? (
                <span className="text-[6.5px] font-bold text-emerald-600">Copied!</span>
              ) : (
                <Copy className="w-2.5 h-2.5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Status Pill / Lottie Animation */}
        {isPending ? (
          <div className="flex items-center justify-center shrink-0 select-none bg-indigo-50/50 w-7 h-7 rounded-full border border-indigo-100/30">
            <div className="w-5 h-5 flex items-center justify-center relative shrink-0">
              <dotlottie-wc 
                src="https://lottie.host/70b3181f-966a-40ef-866d-7981d05d9545/mTfZP33HI2.lottie" 
                style={{ width: '32px', height: '32px', position: 'absolute' }} 
                autoplay 
                loop 
              />
            </div>
          </div>
        ) : isWin ? (
          <div className="bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-100/30">
            <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-wider">WIN</span>
          </div>
        ) : (
          <div className="bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-rose-100/30">
            <XCircle className="w-2.5 h-2.5 text-rose-500" />
            <span className="text-[8px] font-black text-rose-500 uppercase tracking-wider">LOSS</span>
          </div>
        )}
      </div>

      {/* Body Section */}
      <div className="flex items-center px-3 py-1.5 gap-4">
        {/* Prediction Column */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${
            isWin ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
          }`}>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-wider">PREDICTION</span>
            <span className={`text-[11px] font-black uppercase tracking-tight ${
              isWin ? 'text-emerald-600' : 'text-rose-500'
            }`}>
              {p.prediction}
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] h-6 bg-gray-100 shrink-0" />

        {/* Result Column */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-wider">RESULT</span>
          {isPending ? (
            <div className="flex items-center mt-0.5 h-6 select-none">
              <div className="w-6 h-6 flex items-center justify-center relative shrink-0">
                <dotlottie-wc 
                  src="https://lottie.host/339e980a-a2a5-498c-acfa-ce10343420b5/JYbLAGPNpR.lottie" 
                  style={{ width: '40px', height: '40px', position: 'absolute' }} 
                  autoplay 
                  loop 
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-[11px] font-black uppercase tracking-tight ${
                isWin ? 'text-emerald-600' : 'text-rose-500'
              }`}>
                {p.actual || '---'}
              </span>
              {isWin ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Faint Horizontal Line */}
      <div className="border-t border-gray-100 px-3" />

      {/* Footer Section */}
      <div className="flex justify-between items-center px-3 py-1.5 bg-gray-50/20 text-gray-400 text-[8.5px] font-medium">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span>{formatPeriodDateTime(p.period)}</span>
        </div>

        {isPending ? (
          <div className="flex items-center gap-0.5 text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Processing</span>
          </div>
        ) : isWin ? (
          <div className="flex items-center gap-0.5 text-emerald-600 font-bold">
            <Trophy className="w-3 h-3 text-emerald-600" />
            <span>Won</span>
          </div>
        ) : (
          <div className="flex items-center gap-0.5 text-rose-500 font-bold">
            <XCircle className="w-3 h-3 text-rose-500" />
            <span>Lost</span>
          </div>
        )}
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
      {/* Upgraded Stats Dashboard - 100% Match to Photo */}
      <div className="grid grid-cols-2 gap-2.5 px-0.5">
        {/* Card 1: WINS */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[20px] border border-emerald-100 shadow-[0_6px_16px_rgba(16,185,129,0.02)] p-3 relative overflow-hidden flex flex-col justify-between h-[108px]"
        >
          {/* Top row */}
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-1.5">
              <div className="w-6.5 h-6.5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/15">
                <Trophy className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-emerald-600 font-extrabold text-[8px] uppercase tracking-wider">WINS</span>
            </div>
            <button className="text-gray-300 hover:text-gray-400 p-0.5">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Number & Badge */}
          <div className="flex flex-col items-start mt-0.5">
            <span className="text-gray-950 font-black text-3xl tracking-tight leading-none mb-1.5">{wins}</span>
            <span className="bg-emerald-50/80 text-emerald-600 rounded-full px-2 py-0.5 text-[7.5px] font-black">
              Great job!
            </span>
          </div>

          {/* Dynamic Green Trendline SVG */}
          <svg className="absolute right-2 bottom-2 w-[76px] h-9 pointer-events-none opacity-85" viewBox="0 0 100 60">
            <path d="M 5,50 Q 25,35 45,42 T 85,15" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            <circle cx="85" cy="15" r="4" fill="#10b981" />
            <path d="M 5,50 Q 25,35 45,42 T 85,15 L 85,60 L 5,60 Z" fill="url(#green-gradient)" className="opacity-10" />
            <defs>
              <linearGradient id="green-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Card 2: LOSSES */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white rounded-[20px] border border-rose-100 shadow-[0_6px_16px_rgba(244,63,94,0.02)] p-3 relative overflow-hidden flex flex-col justify-between h-[108px]"
        >
          {/* Top row */}
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-1.5">
              <div className="w-6.5 h-6.5 bg-rose-500 rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/15">
                <X className="w-3.5 h-3.5 text-white stroke-[3px]" />
              </div>
              <span className="text-rose-500 font-extrabold text-[8px] uppercase tracking-wider">LOSSES</span>
            </div>
            <button className="text-gray-300 hover:text-gray-400 p-0.5">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Number & Badge */}
          <div className="flex flex-col items-start mt-0.5">
            <span className="text-gray-950 font-black text-3xl tracking-tight leading-none mb-1.5">{losses}</span>
            <span className="bg-rose-50 text-rose-500 rounded-full px-2 py-0.5 text-[7.5px] font-black">
              Keep improving!
            </span>
          </div>

          {/* Dynamic Red Trendline SVG */}
          <svg className="absolute right-2 bottom-2 w-[76px] h-9 pointer-events-none opacity-85" viewBox="0 0 100 60">
            <path d="M 5,45 Q 25,25 45,35 T 85,30" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
            <circle cx="85" cy="30" r="4" fill="#f43f5e" />
            <path d="M 5,45 Q 25,25 45,35 T 85,30 L 85,60 L 5,60 Z" fill="url(#rose-gradient)" className="opacity-10" />
            <defs>
              <linearGradient id="rose-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Card 3: ACCURACY */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-[20px] border border-blue-100 shadow-[0_6px_16px_rgba(59,130,246,0.02)] p-3 relative overflow-hidden flex flex-col justify-between h-[108px]"
        >
          {/* Top row */}
          <div className="flex justify-between items-start w-full relative">
            <div className="flex items-center gap-1.5">
              <div className="w-6.5 h-6.5 bg-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/15">
                <Target className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-blue-600 font-extrabold text-[8px] uppercase tracking-wider">ACCURACY</span>
            </div>
            
            {/* Grid of tiny dots */}
            <div className="grid grid-cols-4 gap-0.5 opacity-15 mr-0.5 mt-0.5">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-[2.5px] h-[2.5px] bg-gray-400 rounded-full" />
              ))}
            </div>
          </div>

          {/* Number & Subtitle */}
          <div className="flex flex-col items-start mt-0.5">
            <span className="text-gray-950 font-black text-3xl tracking-tight leading-none mb-1">{accuracy}%</span>
            <span className="text-blue-500 text-[7.5px] font-black uppercase tracking-wider">
              TARGET 90%+
            </span>
          </div>

          {/* Circular Progress SVG */}
          <div className="absolute right-2 bottom-2 w-11 h-11 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="22" cy="22" r="17" fill="transparent" stroke="#f0f7ff" strokeWidth="3" />
              <circle cx="22" cy="22" r="17" fill="transparent" stroke="#3b82f6" strokeWidth="3" 
                strokeDasharray={2 * Math.PI * 17}
                strokeDashoffset={2 * Math.PI * 17 * (1 - accuracy / 100)}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[8px] font-black text-blue-600">{accuracy}%</span>
          </div>
        </motion.div>

        {/* Card 4: TOTAL */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white rounded-[20px] border border-amber-100 shadow-[0_6px_16px_rgba(245,158,11,0.02)] p-3 relative overflow-hidden flex flex-col justify-between h-[108px]"
        >
          {/* Top row */}
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-1.5">
              <div className="w-6.5 h-6.5 bg-amber-500 rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/15">
                <BarChart2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-amber-600 font-extrabold text-[8px] uppercase tracking-wider">TOTAL</span>
            </div>
            <button className="text-gray-300 hover:text-gray-400 p-0.5">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Number & Subtitle */}
          <div className="flex flex-col items-start mt-0.5">
            <span className="text-gray-950 font-black text-3xl tracking-tight leading-none mb-1">{totalBets}</span>
            <span className="text-amber-500 text-[7.5px] font-black uppercase tracking-wider">
              PREDICTIONS
            </span>
          </div>

          {/* Page Document Illustration */}
          <div className="absolute right-3 bottom-1.5 w-10 h-11 pointer-events-none select-none opacity-90 flex items-center justify-center">
            <div className="bg-white border border-amber-100/50 rounded-[6px] w-7.5 h-9.5 relative shadow-[0_1.5px_6px_rgba(245,158,11,0.03)] p-1 flex flex-col justify-between">
              <div className="w-4 h-[1.5px] bg-amber-100 rounded-full" />
              <div className="w-5 h-[1.5px] bg-amber-100 rounded-full" />
              <div className="w-3 h-[1.5px] bg-amber-100 rounded-full" />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-sm">
                <CheckCircle className="w-2 h-2 text-white stroke-[2.5px]" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upgraded Modern Tab Buttons - 100% Match to Photo */}
      <div className="flex gap-2.5 px-0.5 mt-3">
        {/* CHART BUTTON */}
        <button 
          onClick={() => setActiveTab('chart')}
          className={`flex-1 rounded-[18px] p-2 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all duration-300 h-[46px] border ${
            activeTab === 'chart'
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 border-rose-500 text-white shadow-[0_6px_16px_rgba(239,68,68,0.25)]'
              : 'bg-white border-blue-50/50 text-gray-900 shadow-[0_3px_8px_rgba(0,0,0,0.015)]'
          }`}
        >
          <div className={`rounded-lg w-7.5 h-7.5 flex items-center justify-center shrink-0 transition-colors duration-300 ${
            activeTab === 'chart' ? 'bg-white/20' : 'bg-blue-50'
          }`}>
            <TrendingUp strokeWidth={2.5} className={`w-3.5 h-3.5 transition-colors duration-300 ${
              activeTab === 'chart' ? 'text-white' : 'text-blue-500'
            }`} />
          </div>
          <span className={`font-black text-[9.5px] tracking-wider transition-colors duration-300 ${
            activeTab === 'chart' ? 'text-white' : 'text-gray-900'
          }`}>
            CHART
          </span>
        </button>

        {/* MY HISTORY BUTTON */}
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 rounded-[18px] p-2 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all duration-300 h-[46px] border ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 border-rose-500 text-white shadow-[0_6px_16px_rgba(239,68,68,0.25)]'
              : 'bg-white border-rose-50/30 text-gray-900 shadow-[0_3px_8px_rgba(0,0,0,0.015)]'
          }`}
        >
          <div className={`rounded-full w-7.5 h-7.5 flex items-center justify-center shrink-0 transition-colors duration-300 ${
            activeTab === 'history' ? 'bg-white/20' : 'bg-rose-50'
          }`}>
            <History strokeWidth={2.5} className={`w-3.5 h-3.5 transition-colors duration-300 ${
              activeTab === 'history' ? 'text-white' : 'text-rose-500'
            }`} />
          </div>
          <span className={`font-black text-[9.5px] tracking-wider transition-colors duration-300 ${
            activeTab === 'history' ? 'text-white' : 'text-gray-900'
          }`}>
            MY HISTORY
          </span>
        </button>
      </div>

      {activeTab === 'history' ? (
        <>
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

