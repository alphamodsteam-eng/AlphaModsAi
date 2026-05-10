/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import RightDrawer from './components/RightDrawer';
import { NavItem } from './types';
import { useWingoData } from './hooks/useWingoData';
import WingoHome from './components/WingoHome';
import WingoHistory from './components/WingoHistory';
import PredictionNotification from './components/PredictionNotification';
import { Settings, Shield, Clock, Crown, User } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItem>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const wingo = useWingoData();
  const [profileName, setProfileName] = useState(() => localStorage.getItem('profileName') || 'Laxi User');
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem('profileImage') || null);
  const [portalUrl, setPortalUrl] = useState('');
  const [loadedUrl, setLoadedUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadPortal = () => {
    if (!portalUrl) return;
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
      <Header onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} history={wingo.predictionsHistory} />
      
      <main className="pt-20 pb-24 px-4 max-w-lg mx-auto">
        <div className={activeTab === 'home' ? 'block' : 'hidden'}>
          <WingoHome 
            currentPeriod={wingo.currentPeriod}
            nextPrediction={wingo.nextPrediction}
            allResults={wingo.allResults}
            predictionsHistory={wingo.predictionsHistory}
            isLoading={wingo.isLoading}
            error={wingo.error}
          />
        </div>
        <div className={activeTab === 'history' ? 'block' : 'hidden'}>
          <WingoHistory 
            history={wingo.predictionsHistory} 
            clearHistory={wingo.clearHistory} 
            profileName={profileName}
            profileImage={profileImage}
          />
        </div>
        <div className={activeTab === 'sparkles' ? 'block' : 'hidden'}>
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center mb-6 border-b-4 border-sky-100 rotate-3">
              <div className="w-10 h-10 bg-sky-500 rounded-xl" />
            </div>
            <h2 className="text-3xl font-black text-sky-500 uppercase tracking-tighter">Predictor Pro</h2>
            <p className="text-gray-400 mt-2 font-medium">Advanced AI features coming soon.</p>
          </div>
        </div>
        <div className={activeTab === 'web' ? 'block' : 'hidden'}>
          {loadedUrl ? (
            <div className="fixed inset-0 top-16 bottom-20 z-10 bg-white">
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
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-sky-500"
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
                    "0 0 0px rgba(14, 165, 233, 0.2)",
                    "0 0 20px rgba(14, 165, 233, 0.4)",
                    "0 0 0px rgba(14, 165, 233, 0.2)"
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-24 h-24 bg-sky-500 rounded-full mb-4 flex items-center justify-center text-white overflow-hidden cursor-pointer shadow-lg relative border-4 border-white"
                onClick={() => fileInputRef.current?.click()}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
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
                <button key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-2 hover:border-sky-200 transition-colors">
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
                className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-sky-500 min-h-[120px] font-black uppercase"
                placeholder="LET US KNOW WHAT YOU THINK..."
              />
              <button className="w-full mt-4 bg-gray-900 text-white rounded-2xl p-4 text-sm font-black hover:bg-gray-800 transition-all uppercase">
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
    </div>
  );
}

