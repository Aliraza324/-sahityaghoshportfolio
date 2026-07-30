import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Trophy, Award, Zap } from "lucide-react";

const About = () => {
  // Safe window height check for SSR
  const [vh, setVh] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  useEffect(() => {
    const updateVh = () => setVh(window.innerHeight);
    updateVh(); // Set on mount
    window.addEventListener("resize", updateVh);
    return () => window.removeEventListener("resize", updateVh);
  }, []);

  const { scrollY } = useScroll();

  // Scroll mapping: 
  // As the user scrolls from 0 to 100vh (the Hero height), 
  // the text precisely fades in and slides up. We stagger the start/end points.

  // Section 1: Context Label
  const y1 = useTransform(scrollY, [0, vh * 0.4], [80, 0]);
  const opacity1 = useTransform(scrollY, [0, vh * 0.3], [0, 1]);

  // Section 2: Education
  const y2 = useTransform(scrollY, [vh * 0.1, vh * 0.5], [80, 0]);
  const opacity2 = useTransform(scrollY, [vh * 0.1, vh * 0.4], [0, 1]);

  // Section 3: Experience
  const y3 = useTransform(scrollY, [vh * 0.2, vh * 0.6], [80, 0]);
  const opacity3 = useTransform(scrollY, [vh * 0.2, vh * 0.5], [0, 1]);

  // Section 4: Focus
  const y4 = useTransform(scrollY, [vh * 0.3, vh * 0.7], [80, 0]);
  const opacity4 = useTransform(scrollY, [vh * 0.3, vh * 0.6], [0, 1]);

  return (
    <section className="min-h-screen md:h-screen w-full bg-white text-black font-sans px-6 md:px-12 lg:px-16 pt-14 md:pt-24 pb-8 overflow-y-auto md:overflow-hidden flex items-center justify-center relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-x-12 w-full max-w-[1600px] mx-auto py-2">

        {/* Left Column: Context Label */}
        <motion.div
          className="md:col-span-3 lg:col-span-3 pt-2 md:pt-4"
          style={{ y: y1, opacity: opacity1 }}
        >
          <h2 className="font-sans text-xs md:text-sm font-bold uppercase tracking-widest text-black/90">
            Background & Data
          </h2>
        </motion.div>

        {/* Right Column: The Data List */}
        <div className="md:col-span-9 lg:col-span-9 flex flex-col gap-4 md:gap-7">

          {/* 01. EDUCATION */}
          <motion.div style={{ y: y2, opacity: opacity2 }} className="flex flex-col gap-1">
            <h3 className="font-sans text-xs md:text-sm font-bold uppercase tracking-wide opacity-100 mb-0.5">
              01. Education
            </h3>
            <div className="flex flex-col">
              <p className="font-sans text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-snug tracking-tight">
                Nalanda Institute of Technology, Bhubaneswar
              </p>
              <p className="font-sans text-[13px] sm:text-base md:text-lg lg:text-xl font-normal text-black/70 leading-snug tracking-tight">
                B.Tech, Computer Science & Engineering (2023–2027) — CGPA: 8.50 / 10
              </p>
            </div>
          </motion.div>

          {/* 02. EXPERIENCE */}
          <motion.div style={{ y: y3, opacity: opacity3 }} className="flex flex-col gap-1">
            <h3 className="font-sans text-xs md:text-sm font-bold uppercase tracking-wide opacity-100 mb-0.5">
              02. Experience
            </h3>

            <div className="flex flex-col gap-2 md:gap-3">
              {/* Job 1 */}
              <div>
                <p className="font-sans text-base sm:text-lg md:text-xl font-bold leading-snug tracking-tight">
                  MindBrain Innovations Pvt. Ltd.
                </p>
                <p className="font-sans text-[13px] sm:text-base md:text-lg font-normal text-black/70 leading-snug tracking-tight">
                  Python Full-Stack Intern (June 2026 – July 2026 · Onsite - Bhubaneswar)
                </p>
              </div>

              {/* Job 2 */}
              <div>
                <p className="font-sans text-base sm:text-lg md:text-xl font-bold leading-snug tracking-tight">
                  Jayesta Corporate Entity
                </p>
                <p className="font-sans text-[13px] sm:text-base md:text-lg font-normal text-black/70 leading-snug tracking-tight">
                  Full-Stack Web Development Intern (June 2025 – July 2025 · Remote)
                </p>
              </div>

              {/* Job 3 */}
              <div>
                <p className="font-sans text-base sm:text-lg md:text-xl font-bold leading-snug tracking-tight">
                  1Stop.ai
                </p>
                <p className="font-sans text-[13px] sm:text-base md:text-lg font-normal text-black/70 leading-snug tracking-tight">
                  Artificial Intelligence Intern (March 2025 – April 2025 · Remote)
                </p>
              </div>
            </div>
          </motion.div>

          {/* 03. FOCUS */}
          <motion.div style={{ y: y4, opacity: opacity4 }} className="flex flex-col gap-1">
            <h3 className="font-sans text-xs md:text-sm font-bold uppercase tracking-wide opacity-100 mb-0.5">
              03. Focus & Achievements
            </h3>
            <ul className="flex flex-col gap-1 md:gap-1.5">
              <li className="font-sans text-sm sm:text-base md:text-lg font-bold leading-snug tracking-tight">
                Agentic AI, RAG Systems & Multi-Agent Architecture (LangChain / LangGraph)
              </li>
              <li className="font-sans text-sm sm:text-base md:text-lg font-bold leading-snug tracking-tight">
                Full-Stack SaaS & Event-Driven Microservices (MERN / Python / Docker)
              </li>
              <li className="font-sans text-[11px] sm:text-xs md:text-sm lg:text-base font-medium text-black/75 leading-snug tracking-tight flex items-center gap-2 mt-0.5">
                <Trophy className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>5th Runner-Up — TRIDENT Hackathon 2026 (Team MOMENT)</span>
              </li>
              <li className="font-sans text-[11px] sm:text-xs md:text-sm lg:text-base font-medium text-black/75 leading-snug tracking-tight flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>Python Full-Stack Development Certification — MindBrain Innovations</span>
              </li>
              <li className="font-sans text-[11px] sm:text-xs md:text-sm lg:text-base font-medium text-black/75 leading-snug tracking-tight flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>200+ Algorithmic Problems Solved on LeetCode</span>
              </li>
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;