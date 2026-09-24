import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';

const CodeShipRepeat: React.FC = () => {
  const { scrollY } = useScroll();
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY;
    if (Math.abs(diff) > 3) {
      if (diff > 0) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }
      setLastScrollY(latest);
    }
  });

  return (
    <section className="w-full bg-black text-white font-sans px-6 md:px-12 lg:px-20 py-20 md:py-32 relative z-20 overflow-hidden border-t border-white/10">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">

        {/* Left Column: Animated Arrow & me1 Image Card */}
        <div className="md:col-span-5 flex flex-col justify-between h-full min-h-[480px] md:min-h-[580px]">
          
          {/* Animated Scroll Arrow Container */}
          <div className="h-20 md:h-28 flex items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: -10 }}
              animate={{
                opacity: isScrollingDown ? 1 : 0,
                scale: isScrollingDown ? 1 : 0.7,
                y: isScrollingDown ? 0 : -10,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-16 md:w-20 md:h-20 border-2 border-white/80 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur-md shadow-2xl"
            >
              <ArrowDownRight className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </motion.div>
          </div>

          {/* me1.jpeg Image Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[400px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900 group"
          >
            <img
              src="/me1.jpeg"
              alt="Codesinc"
              className="w-full h-[360px] md:h-[460px] object-cover object-center grayscale contrast-110 transition-all duration-700 ease-out transform group-hover:grayscale-0 group-hover:scale-105"
            />
          </motion.div>
        </div>

        {/* Right Column: Large Typography & Philosophy Text */}
        <div className="md:col-span-7 flex flex-col justify-between h-full">

          {/* Huge Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-12 md:mb-16"
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9] uppercase text-white">
              CODE.
              <br />
              SHIP.
              <br />
              REPEAT/
            </h2>
          </motion.div>

          {/* Paragraph and Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-8 max-w-[720px]"
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-medium leading-snug text-white/90 tracking-tight">
              We take software from idea to production, building systems that stay fast under load and code that's still easy to work in a year later.
            </p>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <span className="text-xs font-bold uppercase tracking-widest text-white/55 shrink-0 pt-1">
                ( ABOUT US )
              </span>
              <p className="text-base sm:text-lg text-white/75 leading-relaxed font-normal">
                Codesinc's engineers focus on building AI-driven platforms, scalable web & mobile applications, and event-driven microservices — holding every delivery to a high technical and architectural standard.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default CodeShipRepeat;
