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
import StatsDashboard from './components/StatsDashboard';
import PredictionNotification from './components/PredictionNotification';
import TimeManagedSessions from './components/TimeManagedSessions';
import { Settings, Shield, Clock, Crown, User, Copy, Trash2, X } from 'lucide-react';
import { LottieTrashConfetti } from './components/LottieAnimation';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItem>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeletingHistory, setIsDeletingHistory] = useState(false);
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
      return;
    }
    let url = portalUrl.trim();
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    setLoadedUrl(url);
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
          <div className="flex flex-col pt-8 pb-6 gap-6">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter text-center">Safe Session Timings Plan 🛡️</h2>
            <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.2em] text-center mb-2">Balanced and safer for stable flow.</p>
            
            <TimeManagedSessions />

            <div className="bg-gray-900 text-white p-8 rounded-3xl mt-4">
              <h3 className="text-sm font-black uppercase tracking-tight mb-4 text-gray-300">Recommended Rules</h3>
              <ul className="space-y-3 text-xs font-bold text-gray-100 uppercase">
                <li className="flex gap-2"><span>❌</span> Avoid continuous over-betting</li>
                <li className="flex gap-2"><span>✅</span> Take small gaps after 3–5 wins</li>
                <li className="flex gap-2"><span>✅</span> Use balanced big/small entries</li>
                <li className="flex gap-2"><span>✅</span> Avoid unstable midnight timings</li>
                <li className="flex gap-2"><span>✅</span> Stop after target profit achieved</li>
              </ul>
            </div>
          </div>
        </div>
        <div className={activeTab === 'stats' ? 'block' : 'hidden'}>
          <StatsDashboard history={wingo.predictionsHistory} allResults={wingo.allResults} />
        </div>
        <div className={activeTab === 'profile' ? 'block' : 'hidden'}>
          <div className="flex flex-col pt-6 gap-6">
            <div 
              className="p-6 rounded-[32px] shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden"
              style={{ 
                backgroundImage: 'url("https://iili.io/C94Lvl2.jpg")', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }}
            >
              {/* Semi-transparent dark overlay to ensure text is fully readable */}
              <div className="absolute inset-0 bg-black/45 z-0" />
              
              <div className="relative z-10 flex flex-col items-center w-full">
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
                  className="text-2xl font-black text-white tracking-tight text-center border-0 bg-transparent focus:ring-0 uppercase w-full"
                />
                <span className="mt-2 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-red-600/30">
                  Pro User
                </span>
              </div>
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
                  onClick={() => {
                    if (item.label === 'Settings') {
                      setIsSettingsOpen(true);
                    } else if (item.label === 'History') {
                      setActiveTab('history');
                    } else {
                      showToast(`${item.label} features are active & verified.`);
                    }
                  }}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-2 hover:border-red-200 transition-all active:scale-95"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-xs font-black text-gray-700 uppercase">{item.label}</span>
                </button>
              ))}
            </div>

            <div 
              className="p-6 rounded-[32px] shadow-lg border border-gray-100 relative overflow-hidden"
              style={{
                backgroundImage: 'url("https://iili.io/C94b66G.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Semi-transparent dark overlay */}
              <div className="absolute inset-0 bg-black/50 z-0" />
              
              <div className="relative z-10">
                <h3 className="text-lg font-black text-white mb-4 tracking-tight">Send Feedback</h3>
                <textarea 
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-red-500 min-h-[120px] font-black uppercase focus:outline-none"
                  placeholder="LET US KNOW WHAT YOU THINK..."
                />
                <button 
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl p-4 text-sm font-black transition-all uppercase active:scale-95 shadow-lg shadow-red-600/30"
                >
                  Submit Feedback
                </button>
              </div>
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

      {/* Settings Floating View with Lottie-style Deletion Animation */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isDeletingHistory) setIsSettingsOpen(false);
              }}
              className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Floating Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white rounded-t-[32px] p-6 z-50 border-t border-gray-100 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] pb-10"
            >
              {/* Header drag line indicator */}
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-gray-950 font-black text-lg tracking-tight uppercase">System Settings</h3>
                  <p className="text-gray-400 font-bold text-[9px] tracking-wider uppercase">Alpha Server Configuration</p>
                </div>
                <button
                  onClick={() => {
                    if (!isDeletingHistory) setIsSettingsOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 active:scale-95 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lottie Animation Illustration inside the floating view */}
              <LottieTrashConfetti 
                isDeleting={isDeletingHistory} 
                onComplete={() => {
                  wingo.clearHistory();
                  showToast("Real prediction history cleared successfully!");
                  setIsDeletingHistory(false);
                  setIsSettingsOpen(false);
                }}
              />

              <div className="text-center space-y-2.5 px-3 mt-4">
                <h4 className="text-gray-900 font-extrabold text-sm uppercase">Clear Prediction History?</h4>
                <p className="text-gray-500 font-bold text-[10.5px] leading-relaxed uppercase">
                  This action is permanent. All real prediction items, outcome history logs, and wins/losses stats will be completely wiped from this local browser storage.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-6">
                <button
                  disabled={isDeletingHistory}
                  onClick={() => {
                    setIsDeletingHistory(true);
                  }}
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/15 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All History & Stats
                </button>
                <button
                  disabled={isDeletingHistory}
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full h-12 bg-gray-50 hover:bg-gray-100 text-gray-500 font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center active:scale-[0.98] transition-all disabled:pointer-events-none"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

