import { LotteryResult, PredictionRecord } from '../hooks/useWingoData';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { HelpCircle, ChevronRight, History, CheckCircle } from 'lucide-react';

interface WingoHomeProps {
  currentPeriod: string;
  nextPrediction: string;
  nextConfidence: number;
  allResults: LotteryResult[];
  predictionsHistory: PredictionRecord[];
  isLoading: boolean;
  error: string | null;
  onShowToast: (msg: string) => void;
}

export default function WingoHome({ currentPeriod, nextPrediction, nextConfidence, allResults, predictionsHistory, isLoading, error, onShowToast }: WingoHomeProps) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const seconds = now.getSeconds();
      setTimeLeft(60 - seconds);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const latestFive = allResults.slice(0, 5);
  const latestTenPredictions = predictionsHistory.slice(0, 10);

  const getBallColor = (num: number) => {
    if (num === 0) return 'linear-gradient(135deg, #9c56f6 50%, #fb4e4e 50%)';
    if (num === 5) return 'linear-gradient(135deg, #9c56f6 50%, #2bb361 50%)';
    if ([1, 3, 7, 9].includes(num)) return '#2bb361';
    if ([2, 4, 6, 8].includes(num)) return '#fb4e4e';
    return '#ccc';
  };

  const balls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const multipliers = ['X1', 'X5', 'X10', 'X20', 'X50', 'X100'];

  const handleAction = (label: string) => {
    onShowToast(`${label.toUpperCase()} SELECTED - PLEASE WAIT FOR RESULT`);
  };

  return (
    <div className="space-y-3 pb-24 pt-1 px-3 select-none min-h-screen max-w-xl mx-auto overflow-x-hidden">
      
      {/* Top Ticket Card - Pure Red & Perfectly Balanced */}
      <div className="relative bg-[#ff2a2a] h-[110px] rounded-[15px] shadow-lg flex overflow-hidden">
        {/* Half-notches perfectly aligned with the dashed line at 50% */}
        <div className="absolute -top-3 left-[50%] -translate-x-1/2 w-6 h-6 bg-[#f2f2f2] rounded-full z-20" />
        <div className="absolute -bottom-3 left-[50%] -translate-x-1/2 w-6 h-6 bg-[#f2f2f2] rounded-full z-20" />

        {/* Left Side - 50% Width */}
        <div className="w-1/2 p-2 pl-4 flex flex-col justify-between text-white border-r-[1.5px] border-dashed border-white/40 relative">
          <div className="border border-white/50 rounded-full px-3 py-0.5 flex items-center justify-center gap-1.5 w-fit">
             <div className="bg-white rounded-sm p-0.5">
                <HelpCircle className="w-2.5 h-2.5 text-[#ff2a2a] fill-current" />
             </div>
             <span className="text-[11px] font-bold leading-none">How to play</span>
          </div>
          
          <div className="flex flex-col gap-1 mb-0.5">
            <span className="text-[13px] font-bold tracking-tight">Wingo 1 Minute</span>
            <div className="flex gap-1 overflow-x-auto scrollbar-none">
              {latestFive.map((res, i) => (
                <div 
                  key={i} 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black shadow-lg relative overflow-hidden shrink-0"
                  style={{ background: getBallColor(parseInt(res.number)) }}
                >
                  <div className="absolute top-0.5 left-1 w-1 h-1 bg-white/40 rounded-full blur-[0.5px]" />
                  <span className="relative z-10">{res.number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - 50% Width */}
        <div className="w-1/2 pt-2.5 pb-2.5 pr-4 flex flex-col items-end justify-between overflow-hidden">
          <div className="flex flex-col items-end gap-1 w-full">
            <span className="text-[12px] font-bold text-white tracking-wide whitespace-nowrap">Time remaining</span>
            <div className="flex gap-[2.5px] items-center">
              {/* Slanted First Digit Box */}
              <div className="bg-white text-gray-800 w-[18px] h-[32px] flex items-center justify-center font-black text-lg shadow-sm" style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)', borderRadius: '1.5px 3px 3px 1.5px' }}>0</div>
              <div className="bg-white text-gray-800 w-[18px] h-[32px] flex items-center justify-center font-black text-lg shadow-sm rounded-[1.5px]">0</div>
              <div className="text-white font-black text-lg px-0.5">:</div>
              <div className="bg-white text-gray-800 w-[18px] h-[32px] flex items-center justify-center font-black text-lg shadow-sm rounded-[1.5px]">
                {Math.floor(timeLeft / 10)}
              </div>
              {/* Slanted Last Digit Box */}
              <div className="bg-white text-gray-800 w-[18px] h-[32px] flex items-center justify-center font-black text-lg shadow-sm" style={{ clipPath: 'polygon(0% 0%, 85% 0%, 100% 100%, 0% 100%)', borderRadius: '3px 1.5px 1.5px 3px' }}>
                {timeLeft % 10}
              </div>
            </div>
          </div>
          
          <div className="w-full text-right">
            <span className="text-[14px] font-bold text-white tracking-tighter block leading-none truncate whitespace-nowrap">
              {currentPeriod}
            </span>
          </div>
        </div>
      </div>

      {/* Control Panel - Compact Card */}
      <div className="bg-white rounded-[15px] p-3 shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-gray-50 space-y-4">
        
        {/* Color Buttons Row */}
        <div className="flex gap-2.5">
          <button onClick={() => handleAction('Green')} className="flex-1 bg-[#2bb361] text-white h-10 rounded-t-[10px] rounded-b-[4px] font-black text-[14px] shadow-sm active:scale-95 transition-transform uppercase">Green</button>
          <button onClick={() => handleAction('Violet')} className="flex-1 bg-[#9c56f6] text-white h-10 rounded-[6px] font-black text-[14px] shadow-sm active:scale-95 transition-transform uppercase">Violet</button>
          <button onClick={() => handleAction('Red')} className="flex-1 bg-[#fb4e4e] text-white h-10 rounded-t-[10px] rounded-b-[4px] font-black text-[14px] shadow-sm active:scale-95 transition-transform uppercase">Red</button>
        </div>

        {/* Number Grid Card - Gray Background */}
        <div className="bg-[#f3f3f3] p-3 rounded-[12px]">
          <div className="grid grid-cols-5 gap-y-4 gap-x-2">
            {balls.map((n) => {
              const isJackpotPick = predictionsHistory.length > 0 && 
                                   predictionsHistory[0].status === 'Pending' && 
                                   predictionsHistory[0].predictedNumbers?.includes(n);
              
              return (
                <div key={n} className="flex justify-center">
                  <motion.div 
                    animate={isJackpotPick ? { 
                      scale: [1, 1.05, 1],
                      boxShadow: ['0 0 0px rgba(16,185,129,0)', '0 0 15px rgba(16,185,129,0.5)', '0 0 0px rgba(16,185,129,0)'] 
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    onClick={() => handleAction(`Number ${n}`)}
                    className={`w-12 h-12 rounded-full relative flex items-center justify-center text-white text-[24px] font-black shadow-[0_3px_10px_rgba(0,0,0,0.12)] border-[2.5px] cursor-pointer active:scale-90 transition-transform ${isJackpotPick ? 'border-emerald-400' : 'border-white/20'}`}
                    style={{ background: getBallColor(n) }}
                  >
                    <span className="relative z-10">{n}</span>
                    <div className="absolute top-1 left-2 w-3 h-3 bg-white/20 rounded-full blur-[0.5px]" />
                    <div className="absolute bottom-1 right-2 w-2 h-2 bg-white/10 rounded-full" />
                    {isJackpotPick && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-white shadow-sm z-20">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multipliers Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button onClick={() => handleAction('Random')} className="px-4 h-8 min-w-fit rounded-[4px] border border-[#fb4e4e]/40 text-[#fb4e4e] font-bold text-[12px] bg-white active:scale-95 transition-transform">Random</button>
          {multipliers.map((m) => (
            <button 
              key={m} 
              onClick={() => handleAction(m)}
              className={`h-8 min-w-[48px] rounded-[4px] font-bold text-[12px] border flex items-center justify-center active:scale-95 transition-transform ${m === 'X1' ? 'bg-[#2bb361] text-white border-[#2bb361]' : 'bg-[#f7f7f7] text-[#999] border-gray-100'}`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Big/Small Toggle Pair */}
        <div className="flex rounded-[25px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <button 
            onClick={() => handleAction('Big')}
            className={`flex-1 h-12 flex items-center justify-center font-black text-white text-lg uppercase transition-all duration-300 ${nextPrediction === 'Big' ? 'bg-[#fca321]' : 'bg-[#fca321] grayscale-[0.5] opacity-90'}`}
          >
            Big
          </button>
          <button 
            onClick={() => handleAction('Small')}
            className={`flex-1 h-12 flex items-center justify-center font-black text-white text-lg uppercase transition-all duration-300 ${nextPrediction === 'Small' ? 'bg-[#4c8af7]' : 'bg-[#4c8af7] grayscale-[0.5] opacity-90'}`}
          >
            Small
          </button>
        </div>
      </div>

      {/* Results History Table - 999% Match to Photo */}
      <div className="bg-white rounded-[12px] overflow-hidden shadow-sm border border-gray-100 mt-4 mx-1">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#ff2a2a] text-white text-[11px] font-bold">
              <th className="py-2.5 font-medium">Period</th>
              <th className="py-2.5 font-medium">Number</th>
              <th className="py-2.5 font-medium">Big Small</th>
              <th className="py-2.5 font-medium">Color</th>
            </tr>
          </thead>
          <tbody>
            {allResults.slice(0, 10).map((res, i) => {
              const num = parseInt(res.number);
              const isBig = num >= 5;
              const colors = res.color.split(',');
              
              // Determine number text color
              let numColor = '#2bb361'; // green
              if (num === 0) numColor = '#9c56f6'; // violet/red mix, use violet for text
              else if (num === 5) numColor = '#9c56f6'; // violet/green mix, use violet for text
              else if ([2, 4, 6, 8].includes(num)) numColor = '#fb4e4e'; // red
              
              return (
                <tr key={i} className="border-b border-gray-50 text-[10.5px] h-10">
                  <td className="text-gray-500 font-bold py-1 px-1">{res.issueNumber}</td>
                  <td className="text-[16px] font-black py-1" style={{ color: numColor }}>
                    {res.number}
                  </td>
                  <td className="text-gray-500 font-bold py-1">
                    {isBig ? 'Big' : 'Small'}
                  </td>
                  <td className="py-1">
                    <div className="flex items-center justify-center gap-1">
                      {colors.map((c, ci) => (
                        <div 
                          key={ci} 
                          className="w-2.5 h-2.5 rounded-full shadow-sm"
                          style={{ 
                            backgroundColor: c === 'green' ? '#2bb361' : c === 'red' ? '#fb4e4e' : '#9c56f6' 
                          }}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


