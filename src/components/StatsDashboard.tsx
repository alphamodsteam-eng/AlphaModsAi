import { PredictionRecord, LotteryResult } from '../hooks/useWingoData';
import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { BadgeCheck, BadgeAlert, Gauge, TrendingUp, BarChart3, LineChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart as RechartsLineChart, Line } from 'recharts';

interface StatsDashboardProps {
  history: PredictionRecord[];
  allResults: LotteryResult[];
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { duration: 1 });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const display = useTransform(spring, (current) => Math.round(current));

  return <motion.span>{display}</motion.span>;
}

export default function StatsDashboard({ history, allResults }: StatsDashboardProps) {
  const completedHistory = history.filter(h => h.status !== 'Pending');
  const wins = completedHistory.filter(h => h.status === 'Win').length;
  const losses = completedHistory.filter(h => h.status === 'Loss').length;
  const totalBets = wins + losses;
  const accuracy = totalBets > 0 ? Math.round((wins / totalBets) * 100) : 0;
  
  // Dynamic bar data
  const winPercent = totalBets > 0 ? (wins / totalBets) : 0;
  const lossPercent = totalBets > 0 ? (losses / totalBets) : 0;
  
  // Calculate frequency
  const frequencyData = Array.from({ length: 10 }, (_, i) => ({
    number: i.toString(),
    frequency: allResults.filter(r => r.number === i.toString()).length,
  }));

  // Calculate trend
  const trendData = completedHistory
    .slice(-10)
    .reverse()
    .map((h, i) => ({
      index: i,
      value: h.status === 'Win' ? 1 : -1,
    }));
  
  const cumulativeTrend = trendData.reduce((acc, curr, i) => {
    const lastValue = i === 0 ? 0 : acc[i - 1].value;
    acc.push({ index: i, value: lastValue + curr.value });
    return acc;
  }, [] as { index: number, value: number }[]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 mt-6 bg-white rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-gray-100"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[12px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Your Total Bets</h3>
          <div className="text-4xl font-black text-rose-500">
            <AnimatedNumber value={totalBets} />
          </div>
        </div>
        {/* Dynamic Visualization */}
        <div className="flex items-end gap-1.5 h-12">
            <motion.div 
              initial={{ height: 0 }} 
              animate={{ height: Math.max(12, winPercent * 48) }} 
              className="w-3 bg-green-500 rounded-t-lg shadow-sm"
              transition={{ delay: 0.2 }}
            />
            <motion.div 
              initial={{ height: 0 }} 
              animate={{ height: Math.max(12, lossPercent * 48) }} 
              className="w-3 bg-rose-500 rounded-t-lg shadow-sm"
              transition={{ delay: 0.2 }}
            />
            <motion.div 
              initial={{ height: 0 }} 
              animate={{ height: Math.max(12, (accuracy / 100) * 48) }} 
              className="w-3 bg-sky-400 rounded-t-lg shadow-sm"
              transition={{ delay: 0.2 }}
            />
        </div>
      </div>
      
      {/* Cards container */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-2 mb-2 text-green-600">
             <BadgeCheck className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-wider">Pass</span>
           </div>
           <div className="text-2xl font-black text-gray-900">
            <AnimatedNumber value={wins} />
           </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-2 mb-2 text-red-600">
             <BadgeAlert className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-wider">Loss</span>
           </div>
           <div className="text-2xl font-black text-gray-900">
            <AnimatedNumber value={losses} />
           </div>
        </div>
      </div>
      
      {/* Accuracy box */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 mt-4 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner">
            <Gauge className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Accuracy</span>
        </div>
        <div className="text-2xl font-black text-rose-500 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <AnimatedNumber value={accuracy} />%
        </div>
      </div>

       {/* New Charts */}
       <div className="mt-8 flex flex-col gap-8">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-2 mb-4 text-red-600">
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">Number Frequency</span>
           </div>
           <div className="h-40">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={frequencyData}>
                 <XAxis dataKey="number" hide />
                 <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px'}} />
                 <Bar dataKey="frequency" fill="#ef4444" radius={[8, 8, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
        
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-2 mb-4 text-rose-600">
              <LineChart className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">Trend Line</span>
           </div>
           <div className="h-40">
             <ResponsiveContainer width="100%" height="100%">
               <RechartsLineChart data={cumulativeTrend}>
                 <Line type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={4} dot={false} isAnimationActive={true} />
               </RechartsLineChart>
             </ResponsiveContainer>
           </div>
        </div>
       </div>
    </motion.div>
  );
}
