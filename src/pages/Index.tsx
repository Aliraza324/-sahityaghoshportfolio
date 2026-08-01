import { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Instagram, Mail, Code } from "lucide-react";
import { useLenis } from "lenis/react";

// Components
import About from "./About";
import SplashCursor from "@/components/SplashCursor";
import SelectedWorks from "./SelectedWorks";
import VectorBridge from "./VectorBridge";
import ScrollVelocity from "./ScrollVelocity";
import CodeShipRepeat from "./CodeShipRepeat";
import HeroImgHolder from "./HeroImgHolder";
import PagePreloader from "@/components/PagePreloader";
import WhatIDo from "./WhatIDo";
import Certificates from "./Certificates";
import Footer from "./Footer";
import Contact from "./Contact";
import Testimonial from "./Testimonial";
import Navigation from "@/components/Navigation";
import { AIChatWidget } from "@/components/AIChatWidget";
import Magnetic from "@/components/Magnetic";

// --- Cursor Follower ---
const CursorFollower = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 100, mass: 0.8 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 rounded-full bg-white/20 border border-white/40 pointer-events-none z-50 mix-blend-difference hidden lg:block"
      style={{ x, y }}
    />
  );
};

// --- Sub-Components ---
const BrandLogo = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="fixed top-6 left-6 md:top-8 md:left-10 z-[200]"
  >
    <a href="#" className="font-sans font-bold text-xl md:text-2xl tracking-tight text-white uppercase flex items-center gap-1">
      SAHITYA<span className="text-xs align-top font-normal">®</span>
    </a>
  </motion.div>
);

const AvailabilityBadge = () => (
  <motion.div
    initial={{ opacity: 0, y: -15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative sm:absolute z-20 w-fit sm:w-auto sm:top-6 sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-xl px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 mb-2 sm:mb-0"
  >
    <span
      className="font-sans font-black uppercase text-white whitespace-nowrap"
      style={{
        fontSize: "clamp(0.55rem, 1.2vw, 0.85rem)",
        letterSpacing: "0.22em",
      }}
    >
      AVAILABLE FOR WORK
    </span>
  </motion.div>
);

const SocialStrip = () => {
  const socials = [
    { label: "GitHub", href: "https://github.com/SAHITYA350" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sahitya-ghosh-9ba098292/" },
    { label: "LeetCode", href: "https://leetcode.com/u/sahityaghosh/" },
    { label: "Email", href: "mailto:sahityaghosh350@gmail.com" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute z-[40] hidden md:flex flex-col items-center pointer-events-auto"
      style={{ right: "3.5rem", top: "112px", bottom: "180px", justifyContent: "center", gap: "1.2rem" }}
    >
      <span className="w-[1px] h-8 bg-white/30 flex-shrink-0" />
      {socials.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          title={label}
          className="group flex-shrink-0 py-1"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          <span className="font-sans font-black text-[10px] tracking-[0.22em] uppercase text-white/70 group-hover:text-white transition-colors duration-300">
            {label}
          </span>
        </a>
      ))}
      <span className="w-[1px] h-8 bg-white/30 flex-shrink-0" />
    </motion.div>
  );
};

const SpinningCTA = () => {
  const lenis = useLenis();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute z-[45] hidden md:flex items-center justify-center pointer-events-auto"
      style={{ top: "65%", left: "49%", transform: "translate(-50%, -50%)" }}
    >
      <style>{`
        @keyframes ctaSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .cta-ring { animation: ctaSpin var(--cta-spin-duration, 10s) linear infinite; transform-origin: center; }
        .cta-wrap:hover .cta-ring { --cta-spin-duration: 2.5s; }
        .cta-wrap { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .cta-wrap:hover { transform: scale(1.12); }
      `}</style>
      <Magnetic strength={0.45}>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            lenis?.scrollTo("#contact");
          }}
          className="cta-wrap group relative flex items-center justify-center w-[125px] h-[125px] cursor-pointer"
          aria-label="Get in touch"
        >
          <svg viewBox="0 0 130 130" className="absolute inset-0 w-full h-full pointer-events-none">
            <circle cx="65" cy="65" r="62" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          </svg>
          <svg viewBox="0 0 130 130" className="cta-ring absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <path id="cta-circle-path" d="M65,65 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
            </defs>
            <text fill="rgba(255,255,255,1)" fontSize="8.5" fontFamily="'Inter', sans-serif" fontWeight="900" letterSpacing="4">
              <textPath href="#cta-circle-path">GET IN TOUCH · GET IN TOUCH · GET IN TOUCH ·&nbsp;</textPath>
            </text>
          </svg>
          <span className="absolute inset-4 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" style={{ transformOrigin: "center" }} />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative z-10 w-6 h-6 text-white group-hover:text-black" style={{ transition: "color 0.3s ease" }}>
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </Magnetic>
    </motion.div>
  );
};

const MobileSocialStrip = () => {
  const socials = [
    { label: "Github", icon: Github, href: "https://github.com/SAHITYA350" },
    { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/sahitya-ghosh-9ba098292/" },
    { label: "LeetCode", icon: Code, href: "https://leetcode.com/u/sahityaghosh/" },
    { label: "Email", icon: Mail, href: "mailto:sahityaghosh350@gmail.com" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
      className="flex items-center gap-2 sm:gap-4 bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full w-fit shadow-lg"
    >
      {socials.map(({ label, icon: Icon, href }) => (
        <a key={label} href={href} target={href.startsWith("mailto") ? "_self" : "_blank"} rel="noopener noreferrer"
          title={label} className="text-white hover:opacity-70 transition-opacity duration-300 block">
          <Icon size={14} className="sm:w-4 sm:h-4" strokeWidth={2.2} />
        </a>
      ))}
    </motion.div>
  );
};

const Index = () => {
  const lenis = useLenis();
  const footerContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerContainerRef,
    offset: ["start end", "end end"]
  });

  const footerY = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  return (
    <div id="top" className="min-h-screen relative bg-black selection:bg-white selection:text-black">
      <PagePreloader />
      <BrandLogo />
      <CursorFollower />
      <Navigation />

      <div className="fixed inset-0 z-0 bg-white text-black">
        <About />
      </div>

      <section id="home" data-ai="hero" className="relative min-h-screen bg-black flex flex-col justify-between px-6 pt-20 pb-12 sm:pt-24 md:px-16 md:pt-24 md:pb-16 z-20 overflow-x-hidden">
        <AvailabilityBadge />
        <SocialStrip />
        <SpinningCTA />
        <div className="hidden lg:block"><SplashCursor /></div>

        <div className="flex items-center gap-2 md:hidden z-10 my-2 w-full justify-between sm:justify-start">
          <a 
            href="#contact" 
            onClick={(e) => {
              e.preventDefault();
              lenis?.scrollTo("#contact");
            }}
            className="group relative overflow-hidden border border-white/30 px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1.5 sm:gap-2 hover:border-white transition-colors duration-500 rounded-full bg-white/5 backdrop-blur-md"
          >
            <span className="relative font-sans font-black text-[9px] tracking-[0.2em] uppercase text-white group-hover:text-black transition-colors duration-300 z-10">Get in touch</span>
            <svg className="relative w-3 h-3 text-white group-hover:text-black transition-colors duration-300 z-10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 6h10M6 1l5 5-5 5" />
            </svg>
          </a>
          <MobileSocialStrip />
        </div>

        <div className="z-10 grid grid-cols-1 md:grid-cols-12 w-full gap-6 lg:gap-8 items-center flex-1 my-auto max-w-[1700px] mx-auto pt-4 md:pt-8 pr-0 md:pr-20 lg:pr-28">
          
          <div className="col-span-1 md:col-span-7 lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-sans font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7.8rem] leading-[0.88] tracking-tighter text-white uppercase text-left">
                AI & <br /> Full-Stack<br />Engineer
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="mt-5 md:mt-7 max-w-xl flex flex-col items-start gap-6 sm:gap-8"
            >
              <div>
                <div className="w-12 h-[2px] bg-white mb-4 md:hidden" />
                <p className="font-sans text-xs sm:text-sm md:text-base font-medium text-white/90 leading-relaxed tracking-wide uppercase text-left">
                  Building production-ready RAG pipelines, Agentic AI workflows, distributed microservices, and modern scalable SaaS applications.
                </p>
              </div>

              {/* Magnetic RESUME Button */}
              <Magnetic strength={0.22}>
                <a
                  href="/resume.jpeg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden border-2 border-white/20 px-6 py-3.5 flex items-center gap-2 hover:border-white transition-all duration-500 rounded-full bg-white/5 backdrop-blur-md font-sans font-bold text-xs tracking-[0.22em] uppercase text-white shadow-lg"
                >
                  <span className="relative z-10">Resume</span>
                  <svg className="relative z-10 w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-1 md:col-span-5 lg:col-span-5 flex justify-center md:justify-center items-center mt-4 md:mt-0"
          >
            <div className="relative group w-48 h-64 sm:w-56 sm:h-76 md:w-60 md:h-[22rem] lg:w-[20rem] lg:h-[26rem] xl:w-[22rem] xl:h-[28rem] rounded-3xl overflow-hidden border-2 border-white/40 bg-[#0e0e0e]/70 shadow-[14px_14px_0px_0px_rgba(255,255,255,0.85)] hover:shadow-[20px_20px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-500 cursor-pointer shrink-0">
              <img
                src="/me.jpg"
                alt="Sahitya Ghosh"
                className="w-full h-full object-cover object-top grayscale contrast-115 transition-all duration-700 ease-out transform group-hover:grayscale-0 group-hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <HeroImgHolder />

      <div className="relative z-20 w-full bg-transparent">
        <div id="about" className="h-screen w-full pointer-events-none" />

        <div id="work" data-ai="projects" className="bg-black text-white relative z-20">
          <SelectedWorks />
        </div>

        <div data-ai="skills-philosophy" className="bg-white text-black relative z-20">
          <VectorBridge />
        </div>

        <WhatIDo />

        <Certificates />

        <div className="scroll-velocity-wrapper relative z-20">
          <ScrollVelocity
            texts={[
              "Faster Delivery ➔ Faster Delivery ➔ Faster Delivery ➔",
              "Scalable Products ❇ Scalable Products ❇ Scalable Products ❇",
              "Reliable Systems ✦ Reliable Systems ✦ Reliable Systems ✦"
            ]}
            velocity={75}
          />
        </div>

        <CodeShipRepeat />

        <div className="bg-black text-white relative z-20">
          <Testimonial />
        </div>

        {/* Change contact layer to z-20 and relative so it scrolls normally OVER the footer */}
        <div id="contact" data-ai="contact" className="relative z-20 bg-white text-black">
          <Contact />
        </div>
      </div>

      {/* Parallax Footer Reveal Stack */}
      <div ref={footerContainerRef} className="relative z-0 h-screen w-full overflow-hidden bg-black text-white">
        <motion.div style={{ y: footerY }} className="h-full w-full">
          <Footer />
        </motion.div>
      </div>

      {/* Floating Ephemeral RAG AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
};

export default Index;