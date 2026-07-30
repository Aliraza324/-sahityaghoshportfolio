import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { useLenis } from "lenis/react";

interface NavItem {
  label: string;
  href: string;
  number: string;
}

interface SocialItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "#top", number: "01" },
  { label: "About", href: "#about", number: "02" },
  { label: "Work", href: "#work", number: "03" },
  { label: "What I Do", href: "#what-i-do", number: "04" },
  { label: "Philosophy", href: "#philosophy", number: "05" },
  { label: "Credentials", href: "#credentials", number: "06" },
  { label: "Contact", href: "#contact", number: "07" },
];

const socialItems: SocialItem[] = [
  { label: "GitHub", href: "https://github.com/SAHITYA350" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sahitya-ghosh-9ba098292/" },
  { label: "LeetCode", href: "https://leetcode.com/balasur" },
  { label: "Email", href: "mailto:sahityaghosh350@gmail.com" },
];

const ease = [0.76, 0, 0.24, 1] as [number, number, number, number];
const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const overlayVariants: Variants = {
  closed: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 1.0, ease },
  },
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.0, ease },
  },
};

const itemVariants: Variants = {
  closed: {
    y: 40,
    opacity: 0,
    transition: { duration: 0.8, ease },
  },
  open: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.0,
      delay: 0.4 + i * 0.1,
      ease: easeOut,
    },
  }),
};

const socialVariants: Variants = {
  closed: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.6, ease },
  },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.6 + i * 0.08,
      ease: "easeOut",
    },
  }),
};

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, lenis]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    document.body.style.overflow = "";
    lenis?.start();

    setTimeout(() => {
      if (href === "#top" || href === "#home" || href === "#") {
        lenis?.scrollTo(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const target = document.querySelector(href);
        if (target) {
          lenis?.scrollTo(target as HTMLElement);
        } else {
          lenis?.scrollTo(href);
        }
      }
    }, 50);
  };

  return (
    <>
      {/* Hamburger Button with Magnetic Inner Icon Attraction */}
      <div
        className="fixed top-6 right-6 md:top-8 md:right-10 z-[200]"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      >
        <MagneticButton
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-black transition-colors duration-300 relative cursor-pointer"
          style={{
            boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.6)",
            WebkitFontSmoothing: "antialiased",
          }}
          ariaLabel={open ? "Close menu" : "Open menu"}
        >
          {/* Top Line */}
          <motion.span
            animate={open ? { rotate: 45, y: 6.5, scaleX: 0.8 } : { rotate: 0, y: 0, scaleX: 1 }}
            transition={{ duration: 0.6, ease }}
            className="absolute block h-[1.5px] w-[22px] bg-white origin-center"
            style={{ top: "35%" }}
          />
          {/* Middle Line */}
          <motion.span
            animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4, ease }}
            className="absolute block h-[1.5px] w-[22px] bg-white origin-center"
            style={{ top: "50%", marginTop: "-0.75px" }}
          />
          {/* Bottom Line */}
          <motion.span
            animate={open ? { rotate: -45, y: -6.5, scaleX: 0.8 } : { rotate: 0, y: 0, scaleX: 1 }}
            transition={{ duration: 0.6, ease }}
            className="absolute block h-[1.5px] w-[22px] bg-white origin-center"
            style={{ bottom: "35%" }}
          />
        </MagneticButton>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            data-lenis-prevent
            className="fixed inset-0 z-[100] bg-black flex flex-col justify-between px-6 sm:px-8 md:px-16 pt-16 pb-8 md:pt-20 md:pb-14 overflow-y-auto menu-overlay-scroller"
          >
            {/* Socials row */}
            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 mb-4 pt-10 md:pt-0">
              <p className="text-xs sm:text-sm text-white/70 uppercase tracking-widest font-mono mr-1 sm:mr-2">
                Socials
              </p>
              {socialItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={i}
                  variants={socialVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="text-sm sm:text-base md:text-lg font-medium text-white hover:opacity-40"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-0 py-8 md:py-12">
              {navItems.map((item, i) => (
                <div
                  key={item.label}
                  className="overflow-hidden border-b border-white/25 py-3 md:py-4"
                >
                  <motion.a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    custom={i}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="flex items-baseline justify-between group cursor-pointer gap-2"
                  >
                    <span className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold text-white uppercase tracking-tight leading-none group-hover:translate-x-3 transition-transform duration-300 ease-out truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] sm:text-xs text-white/55 font-mono tracking-widest self-start mt-1 shrink-0">
                      {item.number}
                    </span>
                  </motion.a>
                </div>
              ))}
            </nav>

            {/* Bottom copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.8 } }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              className="text-xs text-white/20 font-mono tracking-widest mt-8 md:mt-0 md:self-end"
            >
              © 2026 SAHITYA GHOSH
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;