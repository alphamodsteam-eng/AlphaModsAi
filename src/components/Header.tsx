import { motion } from 'motion/react';
import { User, Menu } from 'lucide-react';

export default function Header({ onToggleDrawer }: { onToggleDrawer: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 0px rgba(14, 165, 233, 0.1)",
              "0 0 15px rgba(14, 165, 233, 0.3)",
              "0 0 0px rgba(14, 165, 233, 0.1)"
            ]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center border border-sky-200"
        >
          <User className="w-6 h-6 text-sky-500" />
        </motion.div>
      </div>
      
      <h1 className="text-gray-900 font-black tracking-tight text-lg uppercase">
        LAXI <span className="text-sky-500">PREDICTOR</span>
      </h1>
      
      <button onClick={onToggleDrawer} className="p-2 hover:bg-gray-50 rounded-lg transition-colors" id="header-menu-btn">
        <Menu className="w-6 h-6 text-gray-600" />
      </button>
    </header>
  );
}
