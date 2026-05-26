import React, { useState, useEffect } from 'react';
import { Clock, Zap, ShieldCheck, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const SESSIONS = [
  { title: 'Early Morning Safe', start: '06:30', end: '08:00', risk: 'Very Low', bets: '15–25', mode: 'Stable', icon: ShieldCheck },
  { title: 'Morning Stable', start: '10:30', end: '12:00', risk: 'Low', bets: '20–30', mode: 'Balanced', icon: TrendingUp },
  { title: 'Afternoon Control', start: '14:00', end: '15:30', risk: 'Med Low', bets: '18–28', mode: 'Recovery', icon: Zap },
  { title: 'Evening Prime', start: '18:30', end: '20:00', risk: 'Safest', bets: '25–40', mode: 'Stable', icon: Clock },
  { title: 'Night Smooth', start: '21:30', end: '23:00', risk: 'Low', bets: '20–30', mode: 'Control', icon: Clock },
];

export default function TimeManagedSessions() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getSessionStatus = (start: string, end: string) => {
    const now = new Date();
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    const startTime = new Date(now); startTime.setHours(startH, startM, 0, 0);
    const endTime = new Date(now); endTime.setHours(endH, endM, 0, 0);

    if (now >= startTime && now <= endTime) return 'active';
    if (now < startTime) return 'upcoming';
    return 'closed';
  };

  const getCountdown = (start: string) => {
    const now = new Date();
    const [startH, startM] = start.split(':').map(Number);
    const startTime = new Date(now); startTime.setHours(startH, startM, 0, 0);
    
    if (now < startTime) {
      const diff = startTime.getTime() - now.getTime();
      const m = Math.floor(diff / 60000 % 60);
      const h = Math.floor(diff / 3600000);
      return `${h}h ${m}m`;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {SESSIONS.map((session, i) => {
        const status = getSessionStatus(session.start, session.end);
        const countdown = getCountdown(session.start);
        const Icon = session.icon;
        
        return (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-2xl border ${
              status === 'active' 
                ? 'bg-gradient-to-br from-indigo-950 to-slate-950 border-indigo-500/50 shadow-lg shadow-indigo-900/20' 
                : 'bg-white border-gray-100 shadow-sm hover:border-gray-200'
            } relative overflow-hidden transition-all duration-300`}
          >
            {status === 'active' && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-indigo-500/20 text-indigo-200 text-[9px] font-black px-2 py-0.5 rounded-full ring-1 ring-indigo-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"/> LIVE
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-xl ${status === 'active' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-gray-100 text-gray-500'}`}>
                <Icon size={16}/>
              </div>
              <h3 className={`text-[11px] font-extrabold uppercase tracking-wider truncate ${status === 'active' ? 'text-white' : 'text-gray-900'}`}>{session.title}</h3>
            </div>
            
            <div className="space-y-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              <p>Time: <span className={status === 'active' ? 'text-gray-200' : 'text-gray-800'}>{session.start} - {session.end}</span></p>
              <p>Risk: <span className={status === 'active' ? 'text-indigo-200' : 'text-indigo-700 font-black'}>{session.risk}</span></p>
              {status === 'upcoming' && countdown && (
                <p className="text-indigo-600 font-mono tracking-tight font-bold">Starts in: {countdown}</p>
              )}
            </div>
            
            <div className={`mt-4 flex items-center justify-between text-[9px] font-black px-3 py-1.5 rounded-lg ${status === 'active' ? 'bg-indigo-900/50 text-indigo-100' : 'bg-gray-100 text-gray-700'}`}>
               <span className="flex items-center gap-1.5 tracking-wider uppercase">{session.mode}</span>
               <span className="tracking-wider">{session.bets}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
