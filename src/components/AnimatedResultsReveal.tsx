import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedResultsRevealProps {
  calculatorData: any;
  onComplete: () => void;
  onSkip: () => void;
}

const AnimatedResultsReveal: React.FC<AnimatedResultsRevealProps> = ({
  calculatorData,
  onComplete,
  onSkip
}) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { inputs, results } = calculatorData;
  const childrenNames = inputs.childrenNames.filter((name: string) => name.trim() !== '');

  const scenes = [
    {
      id: 'current-status',
      duration: 5000,
      title: `The ${childrenNames[0] || 'Johnson'} Family Today`,
      component: (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <span className="text-white text-4xl">👨‍👩‍👧‍👦</span>
          </motion.div>
          <motion.h3 
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Net Worth: ${inputs.netWorth.toLocaleString()}
          </motion.h3>
          <motion.p 
            className="text-gray-600 italic"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            "We're doing pretty well..."
          </motion.p>
        </motion.div>
      )
    },
    {
      id: 'countdown-begins',
      duration: 8000,
      title: "But your wealth has a countdown...",
      component: (
        <motion.div className="text-center">
          <motion.div 
            className="flex justify-center items-end space-x-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {[
              { year: '2025', amount: inputs.netWorth, color: 'from-green-400 to-green-500', height: 'h-32' },
              { year: '2035', amount: inputs.netWorth * 0.85, color: 'from-yellow-400 to-yellow-500', height: 'h-24' },
              { year: '2045', amount: inputs.netWorth * 0.64, color: 'from-orange-400 to-orange-500', height: 'h-16' },
              { year: '2055', amount: inputs.netWorth * 0.33, color: 'from-red-400 to-red-500', height: 'h-8' }
            ].map((bar, index) => (
              <motion.div 
                key={bar.year}
                className="text-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.5, duration: 0.8 }}
              >
                <motion.div 
                  className={`w-16 ${bar.height} bg-gradient-to-t ${bar.color} rounded-t-lg mb-2`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.5 + 0.3, duration: 0.6, ease: "easeOut" }}
                  style={{ transformOrigin: 'bottom' }}
                />
                <motion.p 
                  className="text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.5 + 0.8, duration: 0.4 }}
                >
                  {bar.year}<br/>${Math.round(bar.amount/1000)}K
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
          <motion.p 
            className="text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3, duration: 0.6 }}
          >
            The silent extinction begins
          </motion.p>
        </motion.div>
      )
    },
    {
      id: 'inheritance-reality',
      duration: 7000,
      title: "When you pass away...",
      component: (
        <motion.div className="text-center space-y-6">
          {childrenNames.map((name, index) => (
            <motion.div 
              key={name}
              className="bg-red-50 rounded-2xl p-6"
              initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.8, duration: 0.8, type: "spring" }}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                {index === 0 ? '👧' : '👦'} {name} (age {47 - index * 2}) inherits:
              </h4>
              <motion.div 
                className="text-3xl font-bold text-red-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.8 + 0.5, duration: 0.6, type: "spring", bounce: 0.3 }}
              >
                ${results.childrenInheritance.toLocaleString()}
              </motion.div>
            </motion.div>
          ))}
          <motion.p 
            className="text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.6 }}
          >
            Down from the ${inputs.netWorth.toLocaleString()} you have today
          </motion.p>
        </motion.div>
      )
    },
    {
      id: 'extinction-moment',
      duration: 10000,
      title: "💀 WEALTH EXTINCTION DATE:",
      component: (
        <motion.div className="text-center">
          <motion.div 
            className="text-6xl font-bold text-red-600 mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
          >
            <motion.span
              animate={{ 
                scale: [1, 1.1, 1],
                textShadow: [
                  "0 0 0px #ef4444",
                  "0 0 20px #ef4444",
                  "0 0 0px #ef4444"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {results.extinctionYear}
            </motion.span>
          </motion.div>
          <motion.div 
            className="bg-red-100 rounded-2xl p-6 mb-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="text-2xl font-bold text-red-800 mb-2">
              {results.yearsRemaining} years remaining
            </div>
            <div className="text-red-600">Your grandchildren will inherit: $0</div>
          </motion.div>
          <motion.p 
            className="text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            Your family's 3-generation wealth journey ends with {childrenNames.join(' and ') || 'your children'}
          </motion.p>
        </motion.div>
      )
    },
    {
      id: 'hope-moment',
      duration: 15000,
      title: "But this doesn't have to happen...",
      component: (
        <motion.div className="space-y-6">
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              className="bg-red-50 rounded-2xl p-4 text-center"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h4 className="font-bold text-red-800 mb-2">WITHOUT PROTECTION</h4>
              <p className="text-sm text-red-600">Extinction: {results.extinctionYear}</p>
              <p className="text-sm text-red-600">Grandchildren get: $0</p>
            </motion.div>
            <motion.div 
              className="bg-green-50 rounded-2xl p-4 text-center"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <h4 className="font-bold text-green-800 mb-2">WITH PROTECTION</h4>
              <p className="text-sm text-green-600">Wealth Extends: {results.protectedScenario.extinctionYear}+</p>
              <p className="text-sm text-green-600">Grandchildren get: ${results.protectedScenario.grandchildrenInheritance.toLocaleString()}</p>
            </motion.div>
          </motion.div>
          <motion.p 
            className="text-center text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            Small changes today = Massive family impact
          </motion.p>
          <motion.button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-2xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Show Me How to Stop This
          </motion.button>
        </motion.div>
      )
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(currentScene + 1);
      } else {
        setIsPlaying(false);
      }
    }, scenes[currentScene].duration);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  const handleSkip = () => {
    setIsPlaying(false);
    onSkip();
  };

  const handlePause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center relative">
        {/* Controls */}
        <div className="absolute top-0 right-0 flex gap-2">
          <button
            onClick={handlePause}
            className="px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={handleSkip}
            className="px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
          >
            Skip ⏭️
          </button>
        </div>

        <div className="mb-8">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            key={currentScene}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {scenes[currentScene].title}
          </motion.h2>
          <div className="min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {scenes[currentScene].component}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {scenes.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentScene ? 'bg-white' : 'bg-white/30'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>

        {/* Scene progress bar */}
        <div className="w-full bg-white/20 rounded-full h-1 mb-4">
          <motion.div
            className="bg-white h-1 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: scenes[currentScene].duration / 1000, ease: "linear" }}
            key={currentScene}
          />
        </div>

        {currentScene === scenes.length - 1 && !isPlaying && (
          <motion.p 
            className="text-gray-300 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Click "Show Me How to Stop This" to see your detailed analysis
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default AnimatedResultsReveal;