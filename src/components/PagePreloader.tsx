import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * PagePreloader
 * ------------------------------------------------------------------
 * A cinematic, curtain-style page loader.
 *
 * Design language: Swiss minimal, premium monochrome black & white.
 * Logic: Exactly matching original GSAP timeline and structure.
 * ------------------------------------------------------------------
 */

const STRIPE_COUNT = 7;

interface PagePreloaderProps {
  /** Large centered name / wordmark */
  name?: string;
  /** Small tracked subtitle beneath the name */
  subtitle?: string;
  /** The real site, rendered underneath the loader at all times */
  children?: React.ReactNode;
  /** Fired once the loader has fully exited */
  onComplete?: () => void;
}

/**
 * Per-stripe exit configuration (Preserved from original logic).
 */
const getWaveExitConfig = (p: number) => {
  const eases = ["power4.in", "power3.inOut", "expo.inOut", "power2.in"];
  return {
    delay: p * 0.07 + (Math.random() * 0.015 - 0.0075),
    duration: 0.8 + p * 0.045,
    distance: 100 + p * 6, // Positive distance: drops down (top to bottom)
    ease: eases[p % eases.length],
  };
};

const PagePreloader: React.FC<PagePreloaderProps> = ({
  name = "CODESINC",
  subtitle = "World's Finest Technology Hub",
  children,
  onComplete,
}) => {
  const [active, setActive] = useState(true);
  const [progress, setProgress] = useState(0);

  const bars = useRef<HTMLDivElement[]>([]);
  const textGroup = useRef<HTMLDivElement>(null); // breathing wrapper
  const title = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const progressWrap = useRef<HTMLDivElement>(null);
  const progressLine = useRef<HTMLDivElement>(null);
  const liveRegion = useRef<HTMLSpanElement>(null);

  const breatheTween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const COUNTER_DURATION = 2.6;

      /* ---------------------------------------------------------- */
      /* Reduced-motion path                                        */
      /* ---------------------------------------------------------- */
      if (prefersReduced) {
        const counter = { value: 0 };
        gsap.set(bars.current, { yPercent: 0 });
        gsap.set([title.current, subtitleRef.current, progressWrap.current], {
          opacity: 0,
        });

        const tl = gsap.timeline({
          onComplete: () => {
            onComplete?.();
            setTimeout(() => setActive(false), 100);
          },
        });

        tl.to([title.current, subtitleRef.current, progressWrap.current], {
          opacity: 1,
          duration: 0.4,
        })
          .to(counter, {
            value: 100,
            duration: 1.2,
            ease: "none",
            onUpdate: () => setProgress(Math.round(counter.value)),
          })
          .to(progressLine.current, { scaleX: 1, duration: 1.2, ease: "none" }, "<")
          .to(
            [title.current, subtitleRef.current, progressWrap.current, ...bars.current],
            { opacity: 0, duration: 0.5 },
            "+=0.2"
          );
        return;
      }

      /* ---------------------------------------------------------- */
      /* SECTION 1 — Initial state                                  */
      /* ---------------------------------------------------------- */
      gsap.set(bars.current, { yPercent: 100 });
      gsap.set(title.current, {
        opacity: 0,
        y: 46,
        scale: 0.96,
        clipPath: "inset(100% 0% 0% 0%)",
      });
      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 24,
        clipPath: "inset(100% 0% 0% 0%)",
      });
      gsap.set(progressWrap.current, { opacity: 0, y: 16 });
      gsap.set(progressLine.current, { scaleX: 0 });

      const counter = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
          setTimeout(() => setActive(false), 100);
        },
      });

      /* ---------------------------------------------------------- */
      /* SECTION 2 — Stripe entrance (bottom-up wave)               */
      /* ---------------------------------------------------------- */
      tl.addLabel("barsIn").to(
        bars.current,
        {
          yPercent: 0,
          duration: 1,
          ease: "back.out(1.5)",
          stagger: { each: 0.06, from: "end" },
        },
        "barsIn"
      );

      /* ---------------------------------------------------------- */
      /* SECTION 3 — Typography reveal                              */
      /* ---------------------------------------------------------- */
      tl.addLabel("textIn", "-=0.55")
        .to(
          title.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power4.out",
          },
          "textIn"
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "power4.out",
          },
          "textIn+=0.12"
        )
        .to(
          progressWrap.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "textIn+=0.3"
        );

      /* ---------------------------------------------------------- */
      /* SECTION 4 — Breathing idle loop                            */
      /* ---------------------------------------------------------- */
      tl.call(() => {
        breatheTween.current = gsap.to(textGroup.current, {
          y: -5,
          scale: 1.012,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      /* ---------------------------------------------------------- */
      /* SECTION 5 — Counter + progress line                        */
      /* ---------------------------------------------------------- */
      tl.addLabel("count", "+=0.1")
        .to(
          counter,
          {
            value: 100,
            duration: COUNTER_DURATION,
            ease: "none",
            onUpdate: () => {
              const v = Math.min(100, Math.round(counter.value));
              setProgress(v);
              if (liveRegion.current) liveRegion.current.textContent = `${v}%`;
            },
          },
          "count"
        )
        .to(
          progressLine.current,
          { scaleX: 1, duration: COUNTER_DURATION, ease: "none" },
          "count"
        );

      /* ---------------------------------------------------------- */
      /* SECTION 6 — Completion pause                               */
      /* ---------------------------------------------------------- */
      tl.addLabel("exit", "+=0.3");

      tl.call(() => breatheTween.current?.kill(), [], "exit");

      /* ---------------------------------------------------------- */
      /* SECTION 7 — Text exit                                      */
      /* ---------------------------------------------------------- */
      tl.to(
        [title.current, subtitleRef.current, progressWrap.current],
        {
          opacity: 0,
          scale: 0.92,
          y: -26,
          duration: 0.55,
          ease: "power3.in",
          stagger: 0.04,
        },
        "exit"
      );

      /* ---------------------------------------------------------- */
      /* SECTION 8 — Bar exit: one by one                           */
      /* ---------------------------------------------------------- */
      const total = bars.current.length;
      bars.current.forEach((el, domIndex) => {
        const p = total - 1 - domIndex;
        const { delay, duration, distance, ease } = getWaveExitConfig(p);
        tl.to(el, { yPercent: distance, duration, ease }, `exit+=${delay.toFixed(3)}`);
      });
    }, [bars]);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div className="relative">
      {/* The real site */}
      {children}

      {active && (
        <div
          className="fixed inset-0 z-[9999] overflow-hidden bg-black"
          role="status"
          aria-busy={progress < 100}
          aria-label="Page loading"
        >
          {/* Screen-reader-only progress announcement */}
          <span ref={liveRegion} className="sr-only" aria-live="polite" />

          {/* Vertical bars — Solid obsidian panels with hairline vertical borders */}
          <div className="absolute inset-0 flex flex-row" aria-hidden="true">
            {Array.from({ length: STRIPE_COUNT }).map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) bars.current[i] = el;
                }}
                className="flex-1 h-full bg-[#0a0a0a] border-r border-white last:border-r-0 will-change-transform"
                style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
              />
            ))}
          </div>

          {/* Typography — Crisp white editorial headers */}
          <div
            ref={textGroup}
            className="absolute inset-0 flex flex-col justify-center items-center text-white px-6 text-center"
          >
            <h1
              ref={title}
              className="font-black uppercase leading-none tracking-tight text-white will-change-transform"
              style={{ fontSize: "clamp(2rem, 8vw, 7rem)", letterSpacing: "-0.02em" }}
            >
              {name}
            </h1>
            <p
              ref={subtitleRef}
              className="uppercase tracking-[0.4em] sm:tracking-[0.5em] mt-3 sm:mt-4 text-[10px] sm:text-xs text-neutral-400 font-mono will-change-transform"
            >
              {subtitle}
            </p>
          </div>

          {/* Counter + progress line */}

          <div
  ref={progressWrap}
  className="absolute bottom-5 sm:bottom-8 md:bottom-10 left-0 w-full px-5 sm:px-8 md:px-10 lg:px-12"
>
  <div className="flex items-end justify-between gap-4">
    {/* Counter */}
    <span
      className="text-white font-black leading-none tabular-nums select-none"
      style={{
        fontSize: "clamp(3rem, 10vw, 9rem)",
        letterSpacing: "-0.05em",
        lineHeight: 0.9,
      }}
    >
      {progress}%
    </span>

    {/* Loading */}
    <span
      className="uppercase text-neutral-400 font-mono"
      style={{
        fontSize: "clamp(0.75rem, 1vw, 1rem)",
        letterSpacing: "0.35em",
      }}
    >
      Loading
    </span>
  </div>

  {/* Progress Bar */}
  <div
    className="mt-3 md:mt-4 bg-white/10 overflow-hidden rounded-full"
    style={{
      height: "clamp(2px, 0.3vw, 4px)",
    }}
  >
    <div
      ref={progressLine}
      className="h-full bg-white origin-left"
      style={{ transform: "scaleX(0)" }}
    />
  </div>
</div>

        </div>
      )}

      {/* Screen reader CSS */}
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
};

export default PagePreloader;