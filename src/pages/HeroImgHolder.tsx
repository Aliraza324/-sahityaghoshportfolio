import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const WORK_IMAGES = Array.from({ length: 10 }, (_, i) => `/images/work-items/work-item-${i + 1}.png`);

const HeroImgHolder: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Cycle through images every 250ms
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % WORK_IMAGES.length);
    }, 250);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  // Scroll animations matching hero.js GSAP behavior:
  // y: -110% to 0%
  // scale: 0.35 to 1.0
  // rotate: -15deg to 0deg
  const y = useTransform(scrollYProgress, [0, 1], ["-110%", "0%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.35, 1.0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-15, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.5, 1, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["2.5rem", "1.2rem"]);

  return (
    <section ref={containerRef} className="relative w-full h-[130vh] bg-black overflow-hidden flex items-center justify-center border-t border-white/10 z-20">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden z-20">

        {/* Animated Hero Image Holder Card */}
        <motion.div
          style={{
            y,
            scale,
            rotate,
            opacity,
            borderRadius,
          }}
          className="relative w-full max-w-[1400px] h-[75vh] md:h-[85vh] border-4 border-white/30 overflow-hidden shadow-2xl bg-zinc-950 flex flex-col justify-between p-6 md:p-10 group"
        >
          {/* Active Work Item Image */}
          <img
            src={WORK_IMAGES[currentImgIndex]}
            alt={`Work Item ${currentImgIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-300 ease-out grayscale group-hover:grayscale-0"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

          {/* Bottom Caption */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
            </div>
            {/* <div className="flex items-center gap-2">
              {WORK_IMAGES.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImgIndex ? "w-8 bg-white" : "w-2 bg-white/40"
                    }`}
                />
              ))}
            </div> */}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroImgHolder;
