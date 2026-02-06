
import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCardProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    yRange?: [number, number];
    isDark?: boolean;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
    children,
    delay = 0,
    className = "",
    yRange = [-10, 10],
    isDark = false
}) => {
    return (
        <motion.div
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            dragElastic={0.1}
            whileDrag={{ scale: 1.05, zIndex: 50 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: yRange[0],
            }}
            transition={{
                delay,
                duration: 0.8,
                ease: "easeOut"
            }}
            className="cursor-grab active:cursor-grabbing pointer-events-auto"
        >
            <motion.div
                animate={{
                    y: yRange,
                    rotate: [0, 0.5, -0.5, 0]
                }}
                transition={{
                    y: {
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: delay * 1.5
                    },
                    rotate: {
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
                className={`${isDark ? 'glass' : 'glass-light'} rounded-[24px] p-5 shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 ${className}`}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default FloatingCard;
