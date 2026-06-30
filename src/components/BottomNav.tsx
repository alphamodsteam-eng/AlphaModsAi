import { Home, History, Sparkles, BarChart3, User } from 'lucide-react';
import { motion } from 'motion/react';
import { NavItem } from '../types';

interface BottomNavProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'HOME' },
    { id: 'history', icon: History, label: 'HISTORY' },
    { id: 'sparkles', icon: Sparkles, label: 'PREDICT' },
    { id: 'stats', icon: BarChart3, label: 'STATS' },
    { id: 'profile', icon: User, label: 'PROFILE' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex items-center px-1 z-50">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        if (item.id === 'sparkles') {
          return (
            <div key={item.id} className="flex-1 flex justify-center relative -top-6">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange(item.id)}
                className="w-16 h-16 bg-red-500 rounded-[22px] flex items-center justify-center border-4 border-white shadow-xl transition-all duration-300"
                id={`nav-${item.id}`}
              >
                <Sparkles className="w-8 h-8 text-white stroke-[2.5px]" />
              </motion.button>
            </div>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex-1 flex flex-col items-center justify-center h-full relative group"
            id={`nav-${item.id}`}
          >
            <div className={`p-2 rounded-xl transition-colors duration-200 ${isActive ? 'bg-red-50' : 'group-active:bg-gray-50'}`}>
              <Icon
                className={`w-6 h-6 transition-colors duration-300 ${
                  isActive ? 'text-red-500' : 'text-gray-400'
                }`}
              />
            </div>
            <span className={`text-[8px] font-black mt-1 transition-colors ${isActive ? 'text-red-500' : 'text-gray-400'}`}>
              {item.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute top-0 w-8 h-1 bg-red-500 rounded-b-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
