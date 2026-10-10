"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface FlowerRainProps {
  /** Duration in seconds for how long the flower rain should last */
  duration?: number;
  /** Number of flowers to generate */
  count?: number;
  /** Color of the flowers (accent color) */
  color?: string;
}

export function FlowerRain({ duration = 30, count = 60, color = "#8B6914" }: FlowerRainProps) {
  // Generate random properties for each flower
  const flowers = useMemo(() => {
    const flowerEmojis = ["🌸", "🌺", "🌼", "🌻", "🏵️", "💐", "🌷", "🪷", "💮", "🥀"];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
      // Spread across full width
      startX: Math.random() * 100,
      // Random end position for drift effect
      endX: (Math.random() - 0.5) * 200,
      // Random fall distance
      fallDistance: 100 + Math.random() * 20,
      // Stagger start times across the full duration
      delay: (Math.random() * duration * 0.7),
      // Vary animation duration (longer falls)
      animDuration: 3.5 + Math.random() * 2,
      // Random rotation
      rotation: (Math.random() - 0.5) * 720,
      // Random size
      scale: 0.6 + Math.random() * 0.7,
    }));
  }, [count, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          className="absolute text-2xl select-none"
          style={{
            left: `${flower.startX}%`,
            top: "-10%",
            filter: `drop-shadow(0 0 4px ${color}40)`,
          }}
          initial={{
            y: 0,
            x: 0,
            opacity: 0,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            y: [`0vh`, `${flower.fallDistance}vh`],
            x: [0, flower.endX],
            opacity: [0, 1, 1, 0.7, 0],
            scale: [0, flower.scale, flower.scale, flower.scale * 0.8, 0],
            rotate: [0, flower.rotation],
          }}
          transition={{
            duration: flower.animDuration,
            delay: flower.delay,
            ease: "easeOut",
            times: [0, 0.1, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
        >
          {flower.emoji}
        </motion.div>
      ))}
    </div>
  );
}
