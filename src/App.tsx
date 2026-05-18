/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from './components/BottomNav';
import RightDrawer from './components/RightDrawer';
import Header from './components/Header';
import { NavItem } from './types';
import { useWingoData } from './hooks/useWingoData';
import WingoHome from './components/WingoHome';
import WingoHistory from './components/WingoHistory';
import PredictionNotification from './components/PredictionNotification';
import { Settings, Shield, Clock, Crown, User, Copy } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItem>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const wingo = useWingoData();
  const [profileName, setProfileName] = useState(() => localStorage.getItem('profileName') || 'Alpha Advance Server');
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem('profileImage') || null);
  const [portalUrl, setPortalUrl] = useState('');
  const [loadedUrl, setLoadedUrl] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCopy = () => {
    const p = wingo.predictionsHistory[0];
    if (!p) return;
    const text = `ALPHA ADVANCE SERVER V9 ULTIMATE\nPeriod Number - ${p.period}\nprediction - ${p.prediction}\nStable Numbers - ${p.num}\nVerified By Alpha Server`;
    
    try {
      navigator.clipboard.writeText(text);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (err) {
      // Fallback for some browsers in iframes
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  };

  const handleLoadPortal = () => {
    if (!portalUrl) {
      showToast("PLEASE ENTER A URL FIRST");
      return;
    }
    let url = portalUrl.trim();
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    setLoadedUrl(url);
    showToast("WEBSITE LOADED SUCCESSFULLY");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('profileImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setProfileName(newName);
    localStorage.setItem('profileName', newName);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} history={wingo.predictionsHistory} />
      
      <main className="pt-6 pb-24 px-4 max-w-lg mx-auto">
        <div className={activeTab === 'home' ? 'block' : 'hidden'}>
          <WingoHome 
            currentPeriod={wingo.currentPeriod}
            nextPrediction={wingo.nextPrediction}
            nextConfidence={wingo.nextConfidence}
            allResults={wingo.allResults}
            predictionsHistory={wingo.predictionsHistory}
            isLoading={wingo.isLoading}
            error={wingo.error}
            onShowToast={showToast}
          />
        </div>
        <div className={activeTab === 'history' ? 'block' : 'hidden'}>
          <WingoHistory 
            history={wingo.predictionsHistory} 
            clearHistory={wingo.clearHistory} 
            deleteHistoryEntry={wingo.deleteHistoryEntry}
            allResults={wingo.allResults}
            profileName={profileName}
            profileImage={profileImage}
          />
        </div>
        <div className={activeTab === 'sparkles' ? 'block' : 'hidden'}>
          <div className="flex flex-col items-center justify-center pt-8">
            <motion.div 
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-20 h-20 bg-red-500 rounded-[28px] flex items-center justify-center mb-6 shadow-xl shadow-red-200"
            >
              <Crown className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">ALPHA ADVANCE SERVER</h2>
            <p className="text-gray-400 mt-1 font-black uppercase text-[10px] tracking-[0.2em] mb-10">Alpha Neural AI Server V9 Ultimate</p>
            
            {wingo.predictionsHistory[0] && (
              <div className="w-full space-y-5">
                <div className="bg-white p-8 rounded-[40px] border border-red-100 shadow-2xl relative overflow-hidden">
                   {/* Decorative glow */}
                   <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 blur-[60px] rounded-full" />
                   
                   <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                        <div>
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Engine</p>
                          <p className="text-xs font-bold text-gray-400 font-mono tracking-tighter uppercase">{wingo.predictionsHistory[0].mode || 'STABLE_TREND'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Next Period</p>
                          <p className="text-lg font-bold text-gray-900 font-mono leading-none tracking-tighter">{wingo.predictionsHistory[0].period}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Alpha Signal</p>
                          <span className={`text-4xl font-black uppercase tracking-tighter ${wingo.predictionsHistory[0].prediction.toLowerCase() === 'big' ? 'text-amber-500' : 'text-blue-600'}`}>
                            {wingo.predictionsHistory[0].prediction}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Stable Pick</p>
                          <span className="text-2xl font-black text-red-600 font-mono tracking-[0.2em]">
                            {wingo.predictionsHistory[0].num}
                          </span>
                        </div>
                      </div>
                   </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCopy}
                  className="w-full bg-red-600 text-white font-black py-6 rounded-[32px] shadow-2xl shadow-red-500/20 transition-all uppercase tracking-[0.15em] flex items-center justify-center gap-3"
                >
                  <Copy className="w-5 h-5" />
                  <span className={copyState === 'copied' ? 'text-green-400' : ''}>
                    {copyState === 'copied' ? 'COPIED SUCCESSFULLY!' : 'Copy Prediction'}
                  </span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
        <div className={activeTab === 'web' ? 'block' : 'hidden'}>
          {loadedUrl ? (
            <div className="fixed inset-0 top-0 bottom-20 z-10 bg-white">
              <iframe 
                src={loadedUrl} 
                className="w-full h-full border-0"
                title="Portal Content"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-20">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
                <Settings className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">Web Browser</h2>
              <p className="text-gray-500 mb-8 font-black text-center uppercase">Enter a URL to load your favorite website</p>
              
              <div className="w-full bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
                <input 
                  type="text" 
                  placeholder="example.com"
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-red-500"
                />
                <button 
                  onClick={handleLoadPortal}
                  className="w-full bg-gray-900 text-white rounded-2xl p-4 text-sm font-black hover:bg-gray-800 transition-all uppercase"
                >
                  Load Website
                </button>
              </div>
            </div>
          )}
        </div>
        <div className={activeTab === 'profile' ? 'block' : 'hidden'}>
          <div className="flex flex-col pt-6 gap-6">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0px rgba(239, 68, 68, 0.2)",
                    "0 0 20px rgba(239, 68, 68, 0.4)",
                    "0 0 0px rgba(239, 68, 68, 0.2)"
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-24 h-24 bg-red-500 rounded-full mb-4 flex items-center justify-center text-white overflow-hidden cursor-pointer shadow-lg relative border-4 border-white"
                onClick={() => fileInputRef.current?.click()}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                    <User className="w-12 h-12 text-white fill-white/20" />
                  </div>
                )}
              </motion.div>
              <input 
                type="text" 
                value={profileName} 
                onChange={handleNameChange}
                className="text-2xl font-black text-gray-900 tracking-tight text-center border-0 focus:ring-0 uppercase"
              />
              <p className="text-gray-500 font-black text-sm uppercase">Pro User</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Settings', icon: Settings },
                { label: 'Security', icon: Shield },
                { label: 'History', icon: Clock },
                { label: 'Premium', icon: Crown },
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => showToast(`${item.label} SETTINGS COMING SOON`)}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-2 hover:border-red-200 transition-all active:scale-95"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                     <item.icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-xs font-black text-gray-700 uppercase">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4 tracking-tight">Send Feedback</h3>
              <textarea 
                className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-500 min-h-[120px] font-black uppercase"
                placeholder="LET US KNOW WHAT YOU THINK..."
              />
              <button 
                onClick={() => showToast("FEEDBACK SENT SUCCESSFULLY")}
                className="w-full mt-4 bg-gray-900 text-white rounded-2xl p-4 text-sm font-black hover:bg-gray-800 transition-all uppercase active:scale-95"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <PredictionNotification 
        result={wingo.lastResolved} 
        history={wingo.predictionsHistory}
        onClose={() => wingo.setLastResolved(null)} 
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest z-[60] shadow-2xl flex items-center gap-2 border border-white/10"
          >
            <Shield className="w-3.5 h-3.5 text-red-500" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

