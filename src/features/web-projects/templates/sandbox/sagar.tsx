import React from 'react';
import { motion } from 'framer-motion';
import { Star, Moon, Send, Sparkles, Heart } from 'lucide-react';

export default function CosmicLoveTemplate({ config }) {
  // Config Props for customization
  const galaxyColor = config.galaxyColor || '#4f46e5';
  const recipientName = config.name || 'My Universe';
  const specialDate = config.date || 'January 4, 2026';

  return (
    <div className="min-h-screen bg-[#020205] text-white overflow-hidden relative font-sans">
      
      {/* 1. Animated Nebula Background (Tests Config Props) */}
      <div 
        className="absolute inset-0 opacity-30 blur-[100px]"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${galaxyColor}, transparent)` 
        }}
      />

      <div className="max-w-4xl mx-auto px-8 py-20 relative z-10">
        
        {/* 2. Floating Header Section */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="text-center mb-20"
        >
          <div className="flex justify-center gap-4 mb-6">
             <Star className="text-yellow-300 animate-pulse" />
             <Moon className="text-slate-300" />
             <Star className="text-yellow-300 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <h1 className="text-6xl md:text-7xl font-thin tracking-[0.2em] uppercase mb-4">
            Written in <span className="font-black" style={{ color: galaxyColor }}>The Stars</span>
          </h1>
          <p className="text-lg tracking-widest text-slate-400">MEMORIES FROM {specialDate}</p>
        </motion.div>

        {/* 3. Image Infection Test (High-Res Space/Romantic) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1464802686167-b939a67a06a1?auto=format&fit=crop&w=800&q=80" 
              alt="Galaxy"
              className="w-full h-80 object-cover rounded-2xl mb-6 shadow-2xl"
            />
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-amber-300" /> To: {recipientName}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              In a universe of billions of stars, my heart found its way to exactly where you are. 
              No distance is too far when we're under the same sky.
            </p>
          </motion.div>

          <div className="flex flex-col justify-between py-4">
            <div className="space-y-6">
               <div className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/5">
                  <p className="text-2xl font-light italic">"You are my favorite discovery."</p>
                  <Heart className="mt-4 text-pink-500 fill-pink-500 w-6 h-6" />
               </div>
               {/* Secondary Image Test */}
               <img 
                src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=800&q=80" 
                className="w-full h-40 object-cover rounded-3xl opacity-60 hover:opacity-100 transition-opacity"
               />
            </div>
          </div>
        </div>

        {/* 4. Action Button with Logic */}
        <div className="text-center mt-12">
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${galaxyColor}66` }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 rounded-full font-black text-xl flex items-center gap-3 mx-auto transition-all"
            style={{ backgroundColor: galaxyColor }}
          >
            SEND TO THE MOON <Send className="w-6 h-6" />
          </motion.button>
        </div>

      </div>

      {/* Background Decorations */}
      <div className="fixed bottom-10 left-10 text-white/10 text-[15vw] font-black pointer-events-none select-none">
        SPACE
      </div>
    </div>
  );
}