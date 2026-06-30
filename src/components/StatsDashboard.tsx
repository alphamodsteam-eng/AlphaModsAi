import { PredictionRecord, LotteryResult } from '../hooks/useWingoData';
import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import { 
  Layers, 
  Target, 
  Zap, 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  X, 
  ShieldCheck,
  Award,
  Crown,
  Medal,
  Sparkles,
  Flame,
  Activity,
  History,
  TrendingDown,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface StatsDashboardProps {
  history: PredictionRecord[];
  allResults: LotteryResult[];
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const spring = useSpring(0, { duration: 1.2 });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const display = useTransform(spring, (current) => {
    const val = Math.round(current);
    return `${val}${suffix}`;
  });

  return <motion.span>{display}</motion.span>;
}

const CORNER_SNAKE_PATH_1 = [
  "M 0 58 C 45 55, 60 40, 75 45 C 95 50, 110 30, 130 20 C 145 10, 152 0, 160 0 L 160 58 Z",
  "M 0 58 C 35 52, 50 42, 68 46 C 88 52, 102 34, 124 16 C 139 6, 148 0, 160 0 L 160 58 Z",
  "M 0 58 C 45 55, 60 40, 75 45 C 95 50, 110 30, 130 20 C 145 10, 152 0, 160 0 L 160 58 Z"
];

const CORNER_SNAKE_PATH_2 = [
  "M 0 58 C 30 50, 50 48, 65 38 C 85 24, 100 42, 125 12 C 140 2, 150 0, 160 0 L 160 58 Z",
  "M 0 58 C 40 54, 55 42, 70 34 C 90 26, 105 38, 128 16 C 142 4, 148 0, 160 0 L 160 58 Z",
  "M 0 58 C 30 50, 50 48, 65 38 C 85 24, 100 42, 125 12 C 140 2, 150 0, 160 0 L 160 58 Z"
];

export default function StatsDashboard({ history, allResults = [] }: StatsDashboardProps) {
  // Extract dynamic stats from prediction history if available
  const settledRounds = history.filter(h => h.status === 'Win' || h.status === 'Loss').length;
  const wins = history.filter(h => h.status === 'Win').length;
  const losses = history.filter(h => h.status === 'Loss').length;
  const accuracy = settledRounds > 0 ? Math.round((wins / settledRounds) * 100) : 0;

  // Exact fallback values matching the user's photo design
  const displaySettled = settledRounds > 0 ? settledRounds : 7;
  const displayWins = settledRounds > 0 ? wins : 4;
  const displayLosses = settledRounds > 0 ? losses : 2;
  const displayAccuracy = settledRounds > 0 ? accuracy : 67;

  // Find resolved history entries for our interactive chart
  const resolvedHistory = history.filter(h => h.status === 'Win' || h.status === 'Loss' || h.status === 'Jackpot');
  const isDemo = resolvedHistory.length === 0;

  const chartPoints = isDemo 
    ? [
        { period: '2801', fullPeriod: '20260629002801', accuracy: 50, confidence: 80, status: 'Win', prediction: 'Big', actual: 'Big', actualNumber: 8, isWin: true },
        { period: '2802', fullPeriod: '20260629002802', accuracy: 50, confidence: 85, status: 'Loss', prediction: 'Small', actual: 'Big', actualNumber: 5, isWin: false },
        { period: '2803', fullPeriod: '20260629002803', accuracy: 67, confidence: 92, status: 'Win', prediction: 'Big', actual: 'Big', actualNumber: 9, isWin: true },
        { period: '2804', fullPeriod: '20260629002804', accuracy: 75, confidence: 88, status: 'Win', prediction: 'Small', actual: 'Small', actualNumber: 1, isWin: true },
        { period: '2805', fullPeriod: '20260629002805', accuracy: 60, confidence: 78, status: 'Loss', prediction: 'Big', actual: 'Small', actualNumber: 2, isWin: false },
        { period: '2806', fullPeriod: '20260629002806', accuracy: 67, confidence: 86, status: 'Win', prediction: 'Small', actual: 'Small', actualNumber: 0, isWin: true },
        { period: '2807', fullPeriod: '20260629002807', accuracy: 71, confidence: 95, status: 'Win', prediction: 'Big', actual: 'Big', actualNumber: 7, isWin: true },
        { period: '2808', fullPeriod: '20260629002808', accuracy: 75, confidence: 91, status: 'Win', prediction: 'Big', actual: 'Big', actualNumber: 6, isWin: true },
        { period: '2809', fullPeriod: '20260629002809', accuracy: 80, confidence: 89, status: 'Win', prediction: 'Small', actual: 'Small', actualNumber: 3, isWin: true },
        { period: '2810', fullPeriod: '20260629002810', accuracy: 80, confidence: 94, status: 'Win', prediction: 'Big', actual: 'Big', actualNumber: 8, isWin: true },
      ]
    : [...resolvedHistory]
        .slice(0, 10)
        .reverse()
        .map((p, index, arr) => {
          const subArray = arr.slice(0, index + 1);
          const winsCount = subArray.filter(item => item.status === 'Win' || item.status === 'Jackpot').length;
          const cumulativeAcc = Math.round((winsCount / subArray.length) * 100);
          
          return {
            period: p.period ? p.period.slice(-4) : `#${index + 1}`,
            fullPeriod: p.period,
            accuracy: cumulativeAcc,
            confidence: p.confidence || 85,
            status: p.status,
            prediction: p.prediction,
            actual: p.actual || '--',
            actualNumber: p.actualNumber !== undefined ? p.actualNumber : 0,
            isWin: p.status === 'Win' || p.status === 'Jackpot'
          };
        });

  const cardsData = [
    {
      id: 'total-prediction',
      title: 'TOTAL PREDICTION',
      value: displaySettled,
      subtitle: 'Settled rounds',
      themeColor: '#00a884', // Mint green/teal exactly matching the photo
      dotColor: 'rgba(0, 168, 132, 0.45)',
      icon: Layers,
      cornerIcon: TrendingUp,
      suffix: '',
      snakeGradStart: '#0d9488',
      snakeGradEnd: '#2dd4bf',
      snakeDuration1: 3,
      snakeDuration2: 4,
      illustration: (
        <svg viewBox="0 0 200 150" className="w-full h-full select-none pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="tealSlabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="tealSlabTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          
          {/* Base Guidelines */}
          <path d="M 40,110 L 160,50" stroke="#e2e8f0" strokeWidth="1" opacity="0.6" />
          <path d="M 60,120 L 180,60" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.4" />
          
          {/* Vertical dashed indicators with glows */}
          <line x1="145" y1="35" x2="145" y2="95" stroke="#00a884" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
          <motion.circle 
            cx="145" cy="35" r="2.5" fill="#00a884"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <circle cx="145" cy="95" r="1.5" fill="#00a884" opacity="0.6" />
 
          <line x1="55" y1="65" x2="55" y2="125" stroke="#00a884" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
          <motion.circle 
            cx="55" cy="65" r="2" fill="#00a884"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: 0.3 }}
          />
 
          {/* Layer 3 (Bottom) */}
          <motion.g 
            transform="translate(0, 30)"
            animate={{ y: [30, 27, 30] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <polygon points="100,100 150,75 100,50 50,75" fill="rgba(0,168,132,0.12)" filter="blur(3px)" />
            <polygon points="100,95 145,72.5 100,50 55,72.5" fill="url(#tealSlabGrad)" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.5" />
          </motion.g>
 
          {/* Layer 2 (Middle) */}
          <motion.g 
            transform="translate(0, 15)"
            animate={{ y: [15, 11, 15] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.25 }}
          >
            <polygon points="100,100 150,75 100,50 50,75" fill="rgba(0,168,132,0.08)" filter="blur(2px)" />
            <polygon points="100,95 145,72.5 100,50 55,72.5" fill="url(#tealSlabGrad)" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.7" />
          </motion.g>
 
          {/* Layer 1 (Top) */}
          <motion.g 
            transform="translate(0, 0)"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
          >
            <polygon points="100,100 150,75 100,50 50,75" fill="rgba(0,168,132,0.15)" filter="blur(4px)" />
            <polygon points="100,95 145,72.5 100,50 55,72.5" fill="url(#tealSlabTop)" stroke="#2dd4bf" strokeWidth="1.5" />
            <polygon points="100,87 132,71 100,55 68,71" fill="#2dd4bf" opacity="0.6" />
          </motion.g>
        </svg>
      )
    },
    {
      id: 'prediction-wins',
      title: 'PREDICTION WINS',
      value: displayWins,
      subtitle: 'Matched rounds',
      themeColor: '#43c622', // Grass green exactly matching the photo
      dotColor: 'rgba(67, 198, 34, 0.45)',
      icon: Trophy,
      cornerIcon: Crown,
      suffix: '',
      snakeGradStart: '#15803d',
      snakeGradEnd: '#4ade80',
      snakeDuration1: 2.5,
      snakeDuration2: 3.5,
      illustration: (
        <svg viewBox="0 0 200 150" className="w-full h-full select-none pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="greenTargetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="whiteTargetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0fdf4" />
            </linearGradient>
          </defs>
 
          {/* Orbiting particles */}
          <motion.circle 
            cx="155" cy="40" r="2.5" fill="#43c622"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />
          <motion.circle 
            cx="65" cy="50" r="1.5" fill="#4ade80"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.circle 
            cx="55" cy="85" r="3" fill="#43c622"
            animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.9, 1.2, 0.9] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.8 }}
          />
 
          {/* Ground ripples & Target shadow */}
          <ellipse cx="115" cy="105" rx="50" ry="25" fill="rgba(67,198,34,0.08)" filter="blur(5px)" />
          <motion.ellipse 
            cx="115" cy="100" rx="70" ry="35" fill="none" stroke="#e8f5e9" strokeWidth="1" strokeDasharray="3,3"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          />
 
          {/* Tilted Target board */}
          <motion.g 
            transform="translate(15, 8)"
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          >
            <ellipse cx="100" cy="80" rx="44" ry="28" fill="url(#greenTargetGrad)" stroke="#86efac" strokeWidth="1" />
            <ellipse cx="100" cy="80" rx="34" ry="21" fill="url(#whiteTargetGrad)" />
            <ellipse cx="100" cy="80" rx="24" ry="15" fill="url(#greenTargetGrad)" />
            <ellipse cx="100" cy="80" rx="14" ry="9" fill="url(#whiteTargetGrad)" />
            <ellipse cx="100" cy="80" rx="6" ry="4" fill="#a3e635" />
          </motion.g>
 
          {/* Dart Arrow with dynamic high-precision floating */}
          <motion.g
            animate={{ x: [0, -1, 0.5, 0], y: [0, 1, -0.5, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.25 }}
          >
            <line x1="160" y1="40" x2="118" y2="82" stroke="rgba(22,163,74,0.18)" strokeWidth="3" filter="blur(1.5px)" />
            <line x1="170" y1="30" x2="118" y2="80" stroke="#15803d" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="170" y1="30" x2="118" y2="80" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
            <polygon points="170,30 180,18 184,21 174,34" fill="#86efac" />
            <polygon points="170,30 160,18 163,15 174,26" fill="#22c55e" opacity="0.8" />
            <polygon points="118,80 112,85 120,87" fill="#14532d" />
          </motion.g>
        </svg>
      )
    },
    {
      id: 'prediction-loss',
      title: 'PREDICTION LOSS',
      value: displayLosses,
      subtitle: 'Missed rounds',
      themeColor: '#ef4444', // Warm Coral Red exactly matching the photo
      dotColor: 'rgba(239, 68, 68, 0.45)',
      icon: Zap,
      cornerIcon: X,
      suffix: '',
      snakeGradStart: '#b91c1c',
      snakeGradEnd: '#fca5a5',
      snakeDuration1: 3.5,
      snakeDuration2: 4.5,
      illustration: (
        <svg viewBox="0 0 200 150" className="w-full h-full select-none pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="redTrendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="lossBarGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#fee2e2" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.3" />
            </linearGradient>
          </defs>
 
          {/* Floor grid */}
          <ellipse cx="110" cy="115" rx="65" ry="22" fill="none" stroke="#fff5f5" strokeWidth="1.2" />
 
          {/* Translucent bar columns in background - rise and fall smoothly */}
          <g transform="translate(15, 12)">
            <motion.rect 
              x="30" y="45" width="8" height="50" rx="2" fill="url(#lossBarGrad)"
              animate={{ height: [50, 56, 44, 50], y: [0, -6, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <motion.rect 
              x="52" y="30" width="8" height="65" rx="2" fill="url(#lossBarGrad)"
              animate={{ height: [65, 52, 70, 65], y: [0, 13, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.rect 
              x="74" y="50" width="8" height="45" rx="2" fill="url(#lossBarGrad)" opacity="0.8"
              animate={{ height: [45, 52, 38, 45], y: [0, -7, 7, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.6 }}
            />
            <motion.rect 
              x="96" y="60" width="8" height="35" rx="2" fill="url(#lossBarGrad)" opacity="0.6"
              animate={{ height: [35, 42, 28, 35], y: [0, -7, 7, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.9 }}
            />
            <motion.rect 
              x="118" y="40" width="8" height="55" rx="2" fill="url(#lossBarGrad)" opacity="0.4"
              animate={{ height: [55, 46, 62, 55], y: [0, 9, -7, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1.2 }}
            />
          </g>
 
          {/* Downward trend line arrow */}
          <g>
            {/* Shadow */}
            <path 
              d="M 45,55 L 75,75 L 100,65 L 130,100 L 148,113" 
              fill="none" 
              stroke="rgba(239,68,68,0.12)" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              filter="blur(4px)" 
            />
            {/* Main red trend-line path with dynamic pulse/glowing drawing effect */}
            <motion.path 
              d="M 45,50 L 75,70 L 100,60 L 130,95 L 145,107" 
              fill="none" 
              stroke="url(#redTrendGrad)" 
              strokeWidth="4.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              animate={{ strokeWidth: [4.5, 5.2, 4.5] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            />
            <motion.polygon 
              points="145,107 135,111 151,115 148,97" fill="#ef4444"
              animate={{ scale: [1, 1.12, 1], rotate: [0, -4, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            />
          </g>
        </svg>
      )
    },
    {
      id: 'win-accuracy',
      title: 'WIN ACCURACY',
      value: displayAccuracy,
      subtitle: 'Live accuracy',
      themeColor: '#ff9f1c', // Golden amber yellow exactly matching the photo
      dotColor: 'rgba(255, 159, 28, 0.45)',
      icon: BarChart3,
      cornerIcon: ShieldCheck,
      suffix: '%',
      snakeGradStart: '#d97706',
      snakeGradEnd: '#fde047',
      snakeDuration1: 4,
      snakeDuration2: 5,
      illustration: (
        <svg viewBox="0 0 200 150" className="w-full h-full select-none pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="amberGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="amberWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Radiant waves moving left and right gently */}
          <motion.path 
            d="M 10,95 Q 55,70 100,95 T 190,95" fill="none" stroke="url(#amberWaveGrad)" strokeWidth="1.5"
            animate={{ x: [-12, 12, -12] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
          />
          <motion.path 
            d="M 10,105 Q 60,87 110,105 T 190,105" fill="none" stroke="url(#amberWaveGrad)" strokeWidth="1"
            animate={{ x: [8, -8, 8] }}
            transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Radial circular gauge Display */}
          <g transform="translate(115, 75)">
            <circle cx="0" cy="0" r="35" fill="none" stroke="#fef3c7" strokeWidth="6.5" opacity="0.6" />
            <motion.circle 
              cx="0" 
              cy="0" 
              r="35" 
              fill="none" 
              stroke="url(#amberGaugeGrad)" 
              strokeWidth="7.5" 
              strokeDasharray="147 220" 
              strokeLinecap="round" 
              transform="rotate(-90)" 
              initial={{ strokeDashoffset: 147 }}
              animate={{ strokeDashoffset: [220, 147] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <text 
              x="0" 
              y="5.5" 
              textAnchor="middle" 
              className="font-sans font-extrabold text-[15px] fill-slate-800"
            >
              67%
            </text>
            <motion.circle 
              cx="-30" cy="18" r="3" fill="#f59e0b" filter="drop-shadow(0 0 3px #f59e0b)"
              animate={{ scale: [1, 1.35, 1], opacity: [0.65, 1, 0.65] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            />
            <motion.circle 
              cx="30" cy="-18" r="1.5" fill="#fbbf24"
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut", delay: 0.3 }}
            />
          </g>
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-3 pt-3 pb-24 px-4 max-w-[760px] mx-auto w-full">
      {cardsData.map((card, index) => {
        const IconComponent = card.icon;
        const CornerIcon = card.cornerIcon;
        
        return (
          <motion.div
            key={card.id}
            id={card.id}
            initial="initial"
            whileHover="hover"
            animate="animate"
            variants={{
              initial: { opacity: 0, y: 15, scale: 0.98 },
              animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] } },
              hover: { 
                y: -5, 
                scale: 1.015,
                borderColor: `${card.themeColor}55`,
                boxShadow: `0 20px 30px -10px rgba(15, 23, 42, 0.08), 0 0 15px -3px ${card.themeColor}1a`
              }
            }}
            className="bg-white rounded-[20px] border border-slate-100 p-3 flex items-center justify-between gap-3 relative overflow-hidden transition-colors duration-300 w-full min-h-[100px] h-[100px]"
            style={{ 
              boxShadow: '0 10px 30px -15px rgba(15, 23, 42, 0.05), 0 4px 12px -5px rgba(15, 23, 42, 0.02)'
            }}
          >
            {/* Glowing Backdrop Aura on Hover */}
            <motion.div 
              className="absolute inset-0 opacity-0 rounded-[20px] pointer-events-none select-none transition-opacity duration-500 -z-10"
              style={{
                background: `radial-gradient(circle at 80% 50%, ${card.themeColor}0c, transparent 60%)`,
              }}
              variants={{
                initial: { opacity: 0 },
                hover: { opacity: 1 }
              }}
            />

            {/* Subtle Grid Dots in Top-Left Corner - EXACTLY 12 dots (4x3 grid) */}
            <div className="absolute top-2.5 left-3 flex gap-[3.5px] select-none pointer-events-none">
              {[...Array(4)].map((_, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[3.5px]">
                  {[...Array(3)].map((_, rowIdx) => (
                    <motion.div 
                      key={rowIdx} 
                      className="w-[2.5px] h-[2.5px] rounded-full" 
                      style={{ backgroundColor: card.dotColor }} 
                      variants={{
                        initial: { opacity: 0.6 },
                        hover: { 
                          opacity: [0.6, 1, 0.6], 
                          scale: [1, 1.3, 1],
                          transition: { repeat: Infinity, duration: 1.5, delay: (colIdx + rowIdx) * 0.1 }
                        }
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Concentric Circle Icon Container on Left - Perfectly Round & Aligned */}
            <div className="relative w-12 h-12 shrink-0 flex items-center justify-center select-none ml-2 sm:ml-3">
              {/* Outer Ring */}
              <motion.div 
                className="absolute inset-0 rounded-full border"
                style={{ 
                  borderColor: `${card.themeColor}22`,
                  backgroundColor: `${card.themeColor}03`
                }}
                variants={{
                  initial: { scale: 1, rotate: 0 },
                  animate: { rotate: 360, transition: { duration: 15, repeat: Infinity, ease: 'linear' } },
                  hover: { scale: 1.08, borderColor: `${card.themeColor}44` }
                }}
              />
              {/* Middle Ring */}
              <motion.div 
                className="absolute inset-1.5 rounded-full border"
                style={{ 
                  borderColor: `${card.themeColor}33`,
                  backgroundColor: `${card.themeColor}06`
                }}
                variants={{
                  initial: { scale: 1, rotate: 0 },
                  animate: { 
                    scale: [1, 1.04, 0.96, 1],
                    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
                  },
                  hover: { scale: 1.15, rotate: -45, borderColor: `${card.themeColor}55` }
                }}
              />
              {/* White Elevated Center with Icon */}
              <motion.div 
                className="absolute inset-2 rounded-full flex items-center justify-center bg-white shadow-[0_3px_8px_rgba(0,0,0,0.06)] border border-slate-50"
                variants={{
                  initial: { scale: 1 },
                  hover: { scale: 1.05, rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }
                }}
              >
                <IconComponent 
                  className="w-4 h-4 stroke-[2.2]" 
                  style={{ color: card.themeColor }} 
                />
              </motion.div>
            </div>

            {/* Text Stack Aligned Beautifully in Middle */}
            <div className="flex flex-col select-none z-10 flex-1 pl-2 min-w-max">
              <span 
                className="text-[10.5px] sm:text-[11px] font-extrabold tracking-wide uppercase font-sans leading-none whitespace-nowrap"
                style={{ color: card.themeColor }}
              >
                {card.title}
              </span>
              
              <h2 className="text-[28px] sm:text-[32px] font-black text-slate-800 leading-none mt-1 mb-1 tracking-tight font-sans">
                <AnimatedNumber value={card.value} suffix={card.suffix} />
              </h2>
              
              <span className="text-[11px] font-medium text-slate-400 leading-none whitespace-nowrap">
                {card.subtitle}
              </span>
            </div>

            {/* Premium 3D Isometric Illustration - Placed to the Right, Scaled Perfectly & Visible on all screens */}
            <motion.div 
              className="w-[85px] h-[70px] sm:w-[100px] sm:h-[80px] shrink-0 relative flex items-center justify-center select-none pointer-events-none mr-2"
              variants={{
                initial: { y: 0, scale: 1 },
                hover: { y: -2, scale: 1.05, transition: { duration: 0.3, ease: "easeOut" } }
              }}
            >
              {card.illustration}
            </motion.div>

            {/* Curved Bottom-Right Corner Wave Shape - Sweeps beautifully up with custom colors & morphing snake animations */}
            <div 
              className="absolute bottom-0 right-0 w-[130px] h-[48px] sm:w-[160px] sm:h-[58px] pointer-events-none overflow-hidden rounded-br-[20px]"
            >
              <svg viewBox="0 0 160 58" className="w-full h-full absolute bottom-0 right-0" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`snakeGrad-${card.id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={card.snakeGradStart} />
                    <stop offset="100%" stopColor={card.snakeGradEnd} />
                  </linearGradient>
                </defs>

                {/* Secondary translucent snake overlay drifting slowly */}
                <motion.path 
                  d={CORNER_SNAKE_PATH_2[0]} 
                  fill={`url(#snakeGrad-${card.id})`}
                  opacity={0.35}
                  animate={{
                    d: CORNER_SNAKE_PATH_2
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: card.snakeDuration2,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Primary curved snake/liquid-wave with active hover wave scale */}
                <motion.path 
                  d={CORNER_SNAKE_PATH_1[0]} 
                  fill={`url(#snakeGrad-${card.id})`}
                  animate={{
                    d: CORNER_SNAKE_PATH_1
                  }}
                  variants={{
                    initial: { scale: 1 },
                    hover: { scale: 1.03, transition: { duration: 0.3 } }
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: card.snakeDuration1,
                    ease: "easeInOut"
                  }}
                />
              </svg>
              
              <motion.div 
                className="absolute right-3.5 bottom-3 sm:right-5 sm:bottom-3.5 text-white drop-shadow-sm z-10"
                variants={{
                  initial: { y: 0, scale: 1, rotate: 0 },
                  hover: { 
                    y: -2, 
                    scale: 1.15, 
                    rotate: [0, -15, 15, 0],
                    transition: { duration: 0.4, ease: 'easeOut' } 
                  }
                }}
              >
                <CornerIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.5]" />
              </motion.div>
            </div>

            {/* Liquid Snake Progress Bar/Line at the bottom border of the card */}
            <div className="absolute bottom-0 left-0 right-0 h-[8px] pointer-events-none overflow-hidden rounded-b-[20px] select-none">
              <svg 
                viewBox="0 0 400 12" 
                className="w-full h-full absolute bottom-0 left-0" 
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id={`bottomSnakeGrad-${card.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={card.snakeGradStart} />
                    <stop offset="50%" stopColor={card.snakeGradEnd} />
                    <stop offset="100%" stopColor={card.snakeGradStart} />
                  </linearGradient>
                </defs>
                
                {/* Background track */}
                <rect x="0" y="4" width="400" height="8" fill={`${card.themeColor}12`} />
                
                {/* Secondary flowing liquid snake (100px wavelength) */}
                <motion.g
                  animate={{ x: [-400, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: card.snakeDuration2,
                    ease: "linear"
                  }}
                >
                  <path 
                    d="M 0 6 C 25 2, 75 10, 100 6 C 125 2, 175 10, 200 6 C 225 2, 275 10, 300 6 C 325 2, 375 10, 400 6 C 425 2, 475 10, 500 6 C 525 2, 575 10, 600 6 C 625 2, 675 10, 700 6 C 725 2, 775 10, 800 6 L 800 12 L 0 12 Z" 
                    fill={`url(#bottomSnakeGrad-${card.id})`}
                    opacity={0.35}
                  />
                </motion.g>

                {/* Primary flowing liquid snake (200px wavelength) */}
                <motion.g
                  animate={{ x: [0, -400] }}
                  transition={{
                    repeat: Infinity,
                    duration: card.snakeDuration1,
                    ease: "linear"
                  }}
                >
                  <path 
                    d="M 0 6 C 50 1, 150 11, 200 6 C 250 1, 350 11, 400 6 C 450 1, 550 11, 600 6 C 650 1, 750 11, 800 6 L 800 12 L 0 12 Z" 
                    fill={`url(#bottomSnakeGrad-${card.id})`}
                    opacity={0.8}
                  />
                </motion.g>

                {/* Glossy 3D Highlight Stroke moving alongside primary wave */}
                <motion.g
                  animate={{ x: [0, -400] }}
                  transition={{
                    repeat: Infinity,
                    duration: card.snakeDuration1,
                    ease: "linear"
                  }}
                >
                  <path 
                    d="M 0 6 C 50 1, 150 11, 200 6 C 250 1, 350 11, 400 6 C 450 1, 550 11, 600 6 C 650 1, 750 11, 800 6" 
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity={0.65}
                  />
                </motion.g>
              </svg>
            </div>
          </motion.div>
        );
      })}

      {/* Dynamic AI Adaptive Prediction Track Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="-mx-4 bg-transparent p-0 relative overflow-hidden transition-all duration-300 select-none pointer-events-auto"
      >
        {/* Recharts Container */}
        <div className="w-full h-[85px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartPoints} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chartAccGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.00}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="period" hide padding={{ left: 0, right: 0 }} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const isWin = data.status === 'Win' || data.status === 'Jackpot';
                    
                    return (
                      <div className="bg-slate-950/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-800 shadow-xl max-w-[200px] text-xs font-sans">
                        <div className="font-mono text-[10px] text-slate-400 mb-1 border-b border-slate-800 pb-1 flex justify-between">
                          <span>PERIOD</span>
                          <span className="font-bold text-slate-300">{data.fullPeriod || data.period}</span>
                        </div>
                        <div className="space-y-1.5 mt-2">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Choice:</span>
                            <span className="font-semibold text-teal-400">{data.prediction}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Result:</span>
                            <span className="font-semibold text-slate-200">
                              {data.actual} {data.actualNumber !== undefined ? `(${data.actualNumber})` : ''}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4 border-t border-slate-800 pt-1.5 mt-1.5">
                            <span className="text-slate-400">Acc. Trend:</span>
                            <span className="font-semibold text-teal-300 font-mono">{data.accuracy}%</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Status:</span>
                            <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                              isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {data.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }} 
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} 
              />
              <Area 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#0d9488" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#chartAccGrad)" 
                dot={(props: any) => {
                  const { cx, cy, payload, index } = props;
                  const isWin = payload.isWin;
                  const color = isWin ? '#2dd4bf' : '#ef4444';
                  const shadowColor = isWin ? 'rgba(45, 212, 191, 0.4)' : 'rgba(239, 68, 68, 0.4)';
                  
                  // Gently pull dots slightly inward if they are at the absolute edges to prevent horizontal truncation
                  let adjustedCx = cx;
                  if (index === 0) adjustedCx = cx + 5;
                  if (index === chartPoints.length - 1) adjustedCx = cx - 5;

                  return (
                    <svg x={adjustedCx - 6} y={cy - 6} width={12} height={12} className="overflow-visible" key={`dot-${payload.fullPeriod || payload.period}`}>
                      <circle 
                        cx={6} 
                        cy={6} 
                        r={4} 
                        fill={color} 
                        stroke="#ffffff" 
                        strokeWidth={2}
                        style={{ filter: `drop-shadow(0 0 4px ${shadowColor})` }}
                      />
                    </svg>
                  );
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
