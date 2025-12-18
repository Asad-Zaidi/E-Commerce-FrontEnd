import React, { useEffect, useState } from "react";

const AIGeneratingAnimation = () => {
    const [sparkles, setSparkles] = useState([]);

    useEffect(() => {
        // Generate random sparkles
        const generateSparkles = () => {
            const newSparkles = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                delay: Math.random() * 1.5,
                duration: 2 + Math.random() * 1,
                size: 4 + Math.random() * 8
            }));
            setSparkles(newSparkles);
        };

        generateSparkles();

        // Regenerate sparkles every 2 seconds for continuous effect
        const interval = setInterval(generateSparkles, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-fade-in">
            {/* Background Blur Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-lg" />

            {/* Modal Container */}
            <div className="relative z-10 bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-gray-900/95 dark:to-gray-950/95 rounded-3xl px-10 py-16 shadow-2xl border border-white/80 dark:border-gray-700/30 min-w-[350px] overflow-hidden animate-slide-up">
                {/* Sparkles Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {sparkles.map(sparkle => (
                        <div
                            key={sparkle.id}
                            className="absolute bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-0"
                            style={{
                                left: `${sparkle.left}%`,
                                top: `${sparkle.top}%`,
                                width: `${sparkle.size}px`,
                                height: `${sparkle.size}px`,
                                animationDelay: `${sparkle.delay}s`,
                                animationDuration: `${sparkle.duration}s`,
                                animation: 'sparkle 1.5s ease-in-out forwards'
                            }}
                        />
                    ))}
                </div>

                {/* Center Content */}
                <div className="relative z-20 text-center">
                    <div className="text-6xl mb-5 animate-float">✨</div>
                    
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Generating Blog Content
                    </h2>
                    
                    <p className="text-base font-medium text-gray-600 dark:text-gray-300 mb-8">
                        Powered by AI - Please wait...
                    </p>
                    
                    {/* Loading dots */}
                    <div className="flex justify-center gap-2 mb-8">
                        <div className="w-3 h-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full animate-bounce-dots" style={{ animationDelay: '-0.32s' }} />
                        <div className="w-3 h-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full animate-bounce-dots" style={{ animationDelay: '-0.16s' }} />
                        <div className="w-3 h-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full animate-bounce-dots" />
                    </div>

                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        This may take 10-15 seconds
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIGeneratingAnimation;
