import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Certificate {
  id: string;
  num: string;
  category: string;
  title: string;
  issuer: string;
  year: string;
  tags: string[];
  image: string;
}

const certificatesList: Certificate[] = [
  {
    id: "cert1",
    num: "01",
    category: "Artificial Intelligence",
    title: "Career Essentials in Generative AI",
    issuer: "Microsoft × LinkedIn Learning",
    year: "2024",
    tags: ["AI", "GenAI", "Ethics", "Microsoft"],
    image: "/1.jpg",
  },
  {
    id: "cert2",
    num: "02",
    category: "Artificial Intelligenc",
    title: "Introduction to Artificial Intelligence",
    issuer: "LinkedIn Learning",
    year: "2024",
    tags: ["Artificial Intelligence", "AI for Business", "AI Fundamentals", "LinkedIn Learning" ],
    image: "/2.jpg",
  },
  {
    id: "cert3",
    num: "03",
    category: "Business & Productivity",
    title: "Career Essentials in Administrative Assistance",
    issuer: "Microsoft × LinkedIn Learning",
    year: "2024",
    tags: ["Administrative Assistance",
    "Microsoft 365",
    "Business Communication",
    "Productivity"],
    image: "/3.jpg",
  },
  {
    id: "cert4",
    num: "04",
    category: "Artificial Intelligence",
    title: "Artificial Intelligence",
    issuer: "1Stop × Alcheringa IIT Guwahati",
    year: "2025",
    tags: ["Artificial Intelligence",
    "Machine Learning",
    "AI Fundamentals",
    "Program Completion"],
    image: "/4.jpg",
  },
  {
    id: "cert5",
    num: "05",
    category: "Full Stack Development",
    title: "Full Stack Web Development Internship",
    issuer: "Jyesta Corporate Entity",
    year: "2025",
    tags: ["React",
    "Node.js",
    "MongoDB",
    "Internship",
    "MERN"
  ],
    image: "/5.png",
  },
  {
    id: "cert6",
    num: "06",
    category: "Artificial Intelligence",
    title: "Artificial Intelligence Industrial Program",
    issuer: "Personifwy × 1Stop",
    year: "2025",
    tags: [ "ML",
    "TensorFlow",
    "Text Classification",
    "Project Completion",
    "NLP"
  ],
    image: "/6.jpg",
  },
  {
    id: "cert7",
    num: "07",
    category: "GenAI",
    title: "Introduction to GenAI",
    issuer: "Google-Cloud × Coursera",
    year: "2024",
    tags: ["GenAI", "Agent", "LLM", "Prompts"],
    image: "/7.png",
  },
  {
    id: "cert8",
    num: "08",
    category: "Cloud Computing",
    title: "Cloud Computing Applications: Part 2",
    issuer: "University of Illinois × Coursera",
    year: "2025",
    tags: ["Cloud",
    "Big-data",
    "Coursera",
    "Illinois"],
    image: "/8.png",
  },
  {
    id: "cert9",
    num: "09",
    category: "",
    title: "Cloud Computing Applications: Part 1",
      issuer: "University of Illinois × Coursera",
    year: "2025",
    tags: ["Cloud",
    "Infrastructure",
    "Coursera",
    "Illinois"],
    image: "/88.png",
  },
  {
    id: "cert10",
    num: "10",
    category: "Introduction to Cloud Computing",
    title: "Cloud Computing",
    issuer: "IBM × Coursera",
    year: "2026",
    tags: ["Cloud", "IBM", "Coursera"],
    image: "/10.jpg",
  },
  {
    id: "cert11",
    num: "11",
    category: "Full-Stack Engineering",
    title: "Python Full-Stack Internship",
    issuer: "MindBrain Innovations Pvt. Ltd. Bhubaneswar, Odisa",
    year: "2026",
    tags: ["Python", "Full-Stack", "Backend", "Django"],
    image: "/11.jpeg",
  },
  {
    id: "cert12",
    num: "12",
    category: "TRIDENT 2026",
    title: "TRIDANT 2026 HACKATHON - 5th RUNNERSUP",
    issuer: "TRIDANT GROUP of INSTITUTIONS, Bhubaneswar, Odisa ",
    year: "2026",
    tags: ["Hackathon", "Project", "AI", "ML", "LLM", "ExamCraftAI"],
    image: "/12.jpeg",
  },
  {
    id: "cert13",
    num: "13",
    category: "Team Journey & Projects",
    title: "Journey with Friends & Team Collaborations",
    issuer: "Team MOMENT",
    year: "2026",
    tags: ["Collaboration", "Team", "Hackathon"],
    image: "/13.jpeg",
  },
  {
    id: "cert14",
    num: "14",
    category: "Group Internship",
    title: "Python Full-Stack Internship",
    issuer: "MindBrain Innovations Pvt. Ltd. Bhubaneswar, Odisa",
    year: "2026",
    tags: ["Django", "Full-Stack", "Pythton"],
    image: "/WhatsApp Image 2026-07-28 at 16.52.40.jpeg",
  },
  {
    id: "cert15",
    num: "15",
    category: "Team Journey",
    title: "Experience",
    issuer: "Python Full-Stack Group",
    year: "2026",
    tags: ["Teamwork", "Friends"],
    image: "/WhatsApp Image 2026-07-28 at 16.52.46.jpeg",
  },
  {
    id: "cert16",
    num: "16",
    category: "MindBrain Innovations Pvt. Ltd. Bhubaneswar, Odisa",
    title: "ONSITE",
    issuer: "Bhubaneswar",
    year: "2026",
    tags: ["DLF", "2026"],
    image: "/WhatsApp Image 2026-07-28 at 21.23.05.jpeg",
  },
  {
    id: "cert17",
    num: "17",
    category: "Academic Milestones",
    title: "Nalanda Institute of Technology, Bhubaneswar",
    issuer: "Academic Career & Projects",
    year: "2026",
    tags: ["NIT", "Academic", "Milestone"],
    image: "/nit1.png",
  },
  {
    id: "cert18",
    num: "18",
    category: "Campus",
    title: "NIT Academic Graduation & Achievements",
    issuer: "University Career Verification",
    year: "2026",
    tags: ["NIT", "Degree", "Verification", "College-campus"],
    image: "/nit2.jpg",
  },
];

// Single Certificate Card Component with custom cursor tracking
const CertificateCard: React.FC<{
  cert: Certificate;
  index: number;
  onOpen: (img: string) => void;
}> = ({ cert, index, onOpen }) => {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="certificate-scroll-card w-full flex flex-col gap-4">
      {/* Index Tag above card on Mobile/Tablet */}
      <div className="lg:hidden flex items-center gap-3 border-b border-white/10 pb-2">
        <span className="text-xs font-bold text-white/40 font-mono">
          {String(index + 1).padStart(2, "0")}.
        </span>
        <span className="text-xs font-bold text-white/70 uppercase tracking-widest font-mono">
          {cert.category}
        </span>
      </div>

      {/* Brutalist Glassmorphic Container */}
      <div className="w-full bg-[#0e0e0e]/40 backdrop-blur-md border-2 border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-[8px_8px_0px_rgba(255,255,255,0.05)] hover:shadow-[12px_12px_0px_rgba(255,255,255,0.08)] hover:-translate-y-1 transition-all duration-500 ease-out group">
        
        {/* Card Image viewport with custom cursor follower */}
        <div 
          ref={imageContainerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => onOpen(cert.image)}
          className="w-full aspect-[16/10] overflow-hidden bg-neutral-900/60 flex items-center justify-center relative cursor-none select-none"
        >
          {/* Black & White Image transitioning to Color on hover */}
          <img 
            src={cert.image}
            className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-[1.02] pointer-events-none" 
            alt={cert.title}
          />
          
          {/* Springy Custom Cursor Follower */}
          <motion.div
            animate={{
              x: mousePos.x - 42, // half width of pill
              y: mousePos.y - 18, // half height of pill
              scale: isHovered ? 1 : 0,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 280, mass: 0.4 }}
            className="absolute top-0 left-0 px-4 py-2 bg-[#000000] text-white font-mono text-xs rounded-lg shadow-xl flex items-center gap-1.5 z-20 pointer-events-none"
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <span className="text-white/70">↳</span>
            <span className="font-bold">view</span>
          </motion.div>
        </div>

        {/* Card bottom info footer */}
        <div className="p-5 sm:p-7 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs sm:text-sm font-medium text-neutral-500 uppercase tracking-wider hidden lg:block font-mono">
              {cert.category}
            </span>
            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
              {cert.title}
            </h4>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <span className="text-xs sm:text-sm font-semibold text-white/60 font-mono">
              {cert.issuer}
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {cert.tags.map((tag, tIdx) => (
                <span 
                  key={tIdx}
                  className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.02] text-neutral-400 font-mono"
                >
                  {tag}
                </span>
              ))}
              <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border border-[#e2e2da]/20 bg-[#e2e2da]/5 text-[#e2e2da] font-mono">
                {cert.year}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const Certificates: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll(".certificate-scroll-card");
      if (cards.length === 0) return;

      const triggerPoint = window.innerHeight * 0.6; // 60% focal line
      let closestIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.height === 0) return; // Skip hidden/unrendered cards
        
        const cardMiddle = rect.top + rect.height / 2;
        const distance = Math.abs(cardMiddle - triggerPoint);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Initial sync
    handleScroll();
    const timeoutId = setTimeout(handleScroll, 200);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Split active index string digits to separate counter animations
  const activeStr = String(activeIndex + 1).padStart(2, "0");
  const tens = activeStr[0];
  const units = activeStr[1];

  return (
    <section 
      id="credentials"
      ref={containerRef} 
      className="w-full bg-black text-white font-sans py-20 px-6 md:px-12 lg:px-16 relative z-20"
    >
      <div className="w-full max-w-[1400px] mx-auto">
        
        {/* Section Header Grid - Styled exactly like What I Do / */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3 sm:gap-y-4 md:gap-x-8 items-start mb-12 sm:mb-16 md:mb-20">
          <div className="col-span-1 md:col-span-6">
            <h2 
              className="font-black uppercase tracking-tight leading-[0.75] text-white"
              style={{ fontSize: "clamp(1.5rem, 9vw, 5rem)" }}
            >
              Credentials / 
            </h2>
          </div>
          <div className="hidden md:block col-span-2 pt-2 md:pt-4 text-left">
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-white/40 font-mono">
              ( Verification )
            </span>
          </div>
          <div className="col-span-1 md:col-span-4 pt-0 sm:pt-1 md:pt-4">
            <p 
              className="font-medium text-white/50 leading-snug sm:leading-relaxed max-w-sm"
              style={{ fontSize: "clamp(0.6rem, 2.5vw, 1rem)" }}
            >
              A visual timeline of academic milestones, hackathon victories, distributed systems research, and the collaborative journey of engineering SaaS platforms with friends.
            </p>
          </div>
        </div>

        {/* Two-Column Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16 relative">
          
          {/* LEFT COLUMN: Sticky Counter (Hidden on Mobile/Tablet, Pinned on Desktop) */}
          <div className="hidden lg:flex lg:col-span-4 h-fit lg:h-screen lg:sticky lg:top-0 flex-col justify-center items-start py-8 lg:py-0 select-none">
            <span className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-white/40 font-mono mb-2">
              ( Credentials )
            </span>
            
            {/* Custom Split-Digit Counter Frame (Wider digit width to prevent clipping) */}
            <div className="flex font-sans select-none" style={{ fontSize: "clamp(5rem, 16vw, 12rem)" }}>
              {/* Tens Digit Wrapper */}
              <div className="h-[9rem] sm:h-[13rem] overflow-hidden relative flex items-center justify-center w-[0.68em]">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={tens}
                    initial={{ y: "70%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-70%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="font-black text-[#e2e2da] leading-none tracking-tighter absolute inset-0 flex items-center justify-center"
                  >
                    {tens}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Units Digit Wrapper */}
              <div className="h-[9rem] sm:h-[13rem] overflow-hidden relative flex items-center justify-center w-[0.68em]">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={units}
                    initial={{ y: "70%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-70%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="font-black text-[#e2e2da] leading-none tracking-tighter absolute inset-0 flex items-center justify-center"
                  >
                    {units}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Dot */}
              <span className="font-black text-[#e2e2da] leading-none tracking-tighter">.</span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-neutral-400 max-w-[280px] leading-relaxed mt-4">
              A showcase of certifications, internships, and algorithmic milestones achieved along the path.
            </p>
          </div>

          {/* RIGHT COLUMN: Vertical Scroll of Certificates Cards */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-12 sm:gap-20 md:gap-28 pb-[60vh]">
            {/* Small Header for mobile and tablet views */}
            <div className="lg:hidden flex flex-col gap-2">
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">
                Certifications 
              </h2>
              <span className="text-xs font-bold font-mono tracking-widest text-white/40">
                ( {certificatesList.length} ITEMS )
              </span>
            </div>

            {certificatesList.map((cert, index) => (
              <CertificateCard 
                key={cert.id}
                cert={cert}
                index={index}
                onOpen={setSelectedImage}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Lightbox Modal Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            {/* Modal image card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative max-w-[92vw] max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent close on clicking image content
            >
              <img 
                src={selectedImage} 
                alt="Certificate Detail" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg border border-white/10 shadow-2xl"
              />
              
              {/* Close Button */}
              <button
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors duration-200 focus:outline-none shadow-lg cursor-pointer"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Certificates;
