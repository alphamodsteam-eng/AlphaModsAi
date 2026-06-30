import { LotteryResult, PredictionRecord } from '../hooks/useWingoData';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { HelpCircle, ChevronRight, History, CheckCircle } from 'lucide-react';
import { ScanningRadar } from './LottieAnimation';

const NUMBER_IMAGES: Record<number, string> = {
  0: 'https://i.postimg.cc/vZsq9nGm/num0-4-10.png',
  1: 'https://i.postimg.cc/mDt8RNyD/num0-4-6.png',
  2: 'https://i.postimg.cc/ryRQPjmw/num0-4-9.png',
  3: 'https://i.postimg.cc/HLP9S81T/num0-4-1.png',
  4: 'https://i.postimg.cc/K80Pz3zL/num0-4-2.png',
  5: 'https://i.postimg.cc/jj9y6Vyd/num0-4-11.png',
  6: 'https://i.postimg.cc/gjyRPnQV/num0-4-12.png',
  7: 'https://i.postimg.cc/NfYmkk2T/num0-4-4.png',
  8: 'https://i.postimg.cc/vHz9qxWb/num0-4-5.png',
  9: 'https://i.postimg.cc/wBtmjWnY/num0-4-3.png',
};

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
    // Keep internal click handling but don't show UI alerts as requested
    console.debug(`Action ${label} triggered internally`);
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
            <div className="flex gap-1 items-center overflow-x-auto scrollbar-none h-[22px] min-[375px]:h-[24px]">
              {latestFive.map((res, i) => (
                <img 
                  key={i} 
                  src={NUMBER_IMAGES[parseInt(res.number)]} 
                  alt={res.number}
                  className="w-5.5 h-5.5 min-[375px]:w-6 min-[375px]:h-6 object-contain select-none pointer-events-none drop-shadow-sm active:scale-95 transition-transform"
                  referrerPolicy="no-referrer"
                />
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

      {/* Dynamic AI Adaptive Prediction Track Widget - 20000% Photo Matching */}
      <ScanningRadar 
        currentPeriod={currentPeriod}
        nextPrediction={nextPrediction}
        predictionsHistory={predictionsHistory}
      />

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
                      scale: [1, 1.06, 1],
                      filter: [
                        'drop-shadow(0 0 2px rgba(16,185,129,0.2))', 
                        'drop-shadow(0 0 8px rgba(16,185,129,0.7))', 
                        'drop-shadow(0 0 2px rgba(16,185,129,0.2))'
                      ]
                    } : {}}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    onClick={() => handleAction(`Number ${n}`)}
                    className="relative cursor-pointer select-none flex items-center justify-center"
                  >
                    {/* High-quality 3D transparent number button image */}
                    <img 
                      src={NUMBER_IMAGES[n]} 
                      alt={`Number ${n}`} 
                      className="w-[46px] h-[46px] min-[375px]:w-[52px] min-[375px]:h-[52px] sm:w-[58px] sm:h-[58px] object-contain select-none pointer-events-none drop-shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Glowing outer aura for predicted jackpot numbers */}
                    {isJackpotPick && (
                      <div className="absolute inset-[-2.5px] rounded-full border-2 border-emerald-400 animate-pulse pointer-events-none opacity-80" />
                    )}
                    
                    {isJackpotPick && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-white shadow-md z-20">
                        <CheckCircle className="w-3 h-3 text-white" />
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


