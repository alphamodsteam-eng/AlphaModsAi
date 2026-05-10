import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'LAXI BY DEVID') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gray-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-white rounded-[48px] p-10 shadow-[0_32px_64px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 -mr-16 -mt-16 rounded-full blur-2xl" />
          
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center shadow-xl shadow-sky-200 mb-6 rotate-3"
            >
              <ShieldCheck className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">
              Access Terminal
            </h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest text-center">
              Powered by Lax-Engine v10
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-500 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER ACCESS KEY"
                className={`w-full bg-gray-50 border-2 ${error ? 'border-rose-200 bg-rose-50' : 'border-transparent focus:border-sky-500'} rounded-3xl py-5 pl-14 pr-6 text-sm font-black tracking-widest outline-none transition-all placeholder:text-gray-300 uppercase`}
                required
              />
              {error && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-rose-500 text-[10px] font-black uppercase mt-2 ml-4"
                >
                  Invalid Access Key
                </motion.p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-gray-900 text-white rounded-3xl py-5 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-gray-200 active:scale-95 group"
            >
              Unlock Engine
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center opacity-40">
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">Security Encrypted</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest px-8 leading-relaxed">
          Unauthorised access is strictly recorded and tracked via Lax-Engine protocols
        </p>
      </motion.div>
    </div>
  );
}
