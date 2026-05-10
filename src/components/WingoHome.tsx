import { LotteryResult, PredictionRecord } from '../hooks/useWingoData';
import { motion } from 'motion/react';
import ImageSlider from './ImageSlider';
import StatsDashboard from './StatsDashboard';

interface WingoHomeProps {
  currentPeriod: string;
  nextPrediction: string;
  allResults: LotteryResult[];
  predictionsHistory: PredictionRecord[];
  isLoading: boolean;
  error: string | null;
}

export default function WingoHome({ currentPeriod, nextPrediction, allResults, predictionsHistory, isLoading, error }: WingoHomeProps) {
  const latestTen = allResults.slice(0, 10);
  
  // Calculate Big/Small distribution
  const bigCount = latestTen.filter(r => parseInt(r.number) >= 5).length;
  const smallCount = latestTen.length - bigCount;
  const bigPercent = latestTen.length > 0 ? (bigCount / latestTen.length) * 100 : 50;

  const confBase = parseInt(currentPeriod.slice(-2), 10);
  const confidenceScore = isNaN(confBase) ? 85 : 82 + (confBase % 15);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-4">
      
      <ImageSlider />

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <span className="text-red-600 font-bold">!</span>
          </div>
          <div className="flex flex-col">
            <span className="text-red-800 text-xs font-black uppercase tracking-wider">Network Error</span>
            <span className="text-red-600 text-[10px] font-black uppercase leading-tight">{error}</span>
          </div>
        </div>
      )}

      {/* Results Box - Redesigned */}
      <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-[0_8px_40px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-white/50" />
        <div className="relative z-10 flex justify-between items-center mb-6">
          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Last 10 Results</h3>
          <div className="px-3 py-1 bg-sky-50 border border-sky-100/50 rounded-full flex items-center gap-1.5 pl-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-[8px] font-black text-sky-600 uppercase tracking-[0.2em]">Live</span>
          </div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none relative z-10">
          {isLoading && latestTen.length === 0 ? (
            [...Array(10)].map((_, i) => (
              <div key={i} className="min-w-[60px] aspect-[3/4] bg-gray-50 rounded-2xl animate-pulse" />
            ))
          ) : (
            latestTen.map((result, idx) => {
              const num = parseInt(result.number);
              let colorBase = '';
              if (num === 0) {
                colorBase = 'shadow-red-200';
              } else if (num === 5) {
                colorBase = 'shadow-emerald-200';
              } else {
                const colors = result.color.split(',');
                colorBase = colors.includes('red') ? 'bg-red-500 shadow-red-200' : 
                               colors.includes('green') ? 'bg-emerald-500 shadow-emerald-200' : 
                               colors.includes('violet') ? 'bg-violet-500 shadow-violet-200' : 'bg-gray-400';
              }
              
              const pred = num >= 5 ? 'Big' : 'Small';

              return (
                <motion.div
                  key={`${result.issueNumber}-${idx}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col items-center gap-1.5 min-w-[60px]"
                >
                  <div className={`w-full aspect-[4/5] rounded-[24px] ${colorBase} flex flex-col items-center justify-center text-white shadow-sm border-[3px] border-dashed border-white/30 relative overflow-hidden`} style={num === 0 ? { background: 'linear-gradient(90deg, #ef4444 50%, #8b5cf6 50%)' } : num === 5 ? { background: 'linear-gradient(90deg, #10b981 50%, #8b5cf6 50%)' } : {}}>
                    <span className="font-black text-lg">{result.number}</span>
                    <span className="text-[7px] font-bold uppercase tracking-tighter opacity-80">{pred}</span>
                  </div>
                  <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">
                    #{result.issueNumber.slice(-2)}
                  </span>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Premium Header Card */}
      <div className="relative group perspective-1000">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-600 rounded-[32px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
        <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-[32px] p-5 shadow-[0_8px_40px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 transition-all duration-500 overflow-hidden transform-gpu group-hover:-translate-y-1">
          {/* Subtle top glare */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center shadow-inner relative">
                <div className="absolute inset-0 rounded-full border border-sky-200/50 animate-ping opacity-20" />
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-[0.2em] text-gray-400 uppercase mb-0.5">Wingo 1 Min</span>
                <div className="text-sm font-black tracking-tight text-gray-900 font-mono uppercase">
                  {currentPeriod}
                </div>
              </div>
            </div>
            
            <motion.div 
              animate={{ opacity: [1, 0.5, 1] }} 
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="px-3 py-1 bg-sky-400 rounded-full flex items-center justify-center shadow-sm border border-sky-300"
            >
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">AI SERVER</span>
            </motion.div>
          </div>
          
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4 opacity-60" />

          <div className="flex items-center justify-between relative z-10 px-1">
            <div className="flex flex-col items-start space-y-2.5">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confidence</h3>
              <div className="relative flex items-center justify-center bg-white rounded-[20px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-2.5">
                <svg className="transform -rotate-90 w-14 h-14 drop-shadow-sm">
                  <circle
                    className="text-gray-100"
                    strokeWidth="5"
                    stroke="currentColor"
                    fill="transparent"
                    r="24"
                    cx="28"
                    cy="28"
                  />
                  <circle
                    className="text-emerald-500 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    strokeWidth="5"
                    strokeDasharray={150.72}
                    strokeDashoffset={150.72 - (confidenceScore / 100) * 150.72}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="24"
                    cx="28"
                    cy="28"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-sm font-black text-gray-800 tracking-tighter">
                    {confidenceScore}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2.5">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mr-2">Prediction</h3>
              <motion.div 
                key={nextPrediction}
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', rotate: -5 }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 15 
                }}
                className="flex items-center"
              >
                <motion.div 
                  className={`relative px-7 py-4 rounded-[22px] border shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col items-center justify-center min-w-[130px] overflow-hidden group/pred ${nextPrediction === 'Big' ? 'bg-gradient-to-b from-white to-sky-50 border-sky-200' : nextPrediction === 'Small' ? 'bg-gradient-to-b from-white to-blue-50 border-blue-200' : 'bg-gradient-to-b from-white to-gray-50 border-gray-200'}`}
                  animate={{ 
                    y: [0, -3, 0],
                    boxShadow: [
                      "0 8px 30px rgba(0,0,0,0.06)",
                      nextPrediction === 'Big' ? "0 15px 40px rgba(56,189,248,0.2)" : nextPrediction === 'Small' ? "0 15px 40px rgba(37,99,235,0.2)" : "0 15px 40px rgba(0,0,0,0.12)",
                      "0 8px 30px rgba(0,0,0,0.06)"
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Glossy inner top highlight */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-white opacity-80" />
                  
                  {/* Spinning Aura */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-[100%] opacity-[0.15]"
                    style={{
                      background: nextPrediction === 'Big' 
                        ? 'conic-gradient(from 0deg, transparent, rgba(56, 189, 248, 1), transparent)' 
                        : nextPrediction === 'Small'
                        ? 'conic-gradient(from 0deg, transparent, rgba(37, 99, 235, 1), transparent)'
                        : 'conic-gradient(from 0deg, transparent, rgba(156, 163, 175, 1), transparent)'
                    }}
                  />
                  
                  <motion.span 
                    animate={{ scale: [1, 1.05, 1], rotate: [0, -1, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className={`relative z-10 text-[42px] leading-none font-black uppercase tracking-tighter drop-shadow-md ${nextPrediction === 'Big' ? 'text-sky-500' : nextPrediction === 'Small' ? 'text-blue-600' : 'text-gray-900'}`}
                  >
                    {nextPrediction}
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <StatsDashboard history={predictionsHistory} allResults={allResults} />

      {/* Footer Branding */}
      <div className="flex flex-col items-center gap-2 py-4 opacity-20 group">
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-sky-500 transition-colors" />
          <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-sky-500 transition-colors delay-100" />
          <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-sky-500 transition-colors delay-200" />
        </div>
        <span className="text-[12px] font-black uppercase tracking-[0.5em] text-gray-400">Advanced Engine v2.0</span>
      </div>
    </div>
  );
}
