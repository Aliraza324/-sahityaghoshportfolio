import { useEffect, useRef, useCallback, useState } from "react";
import { useLenis } from "lenis/react";
import SkillsPhilosophy from "./SkillsPhilosophy";

function ease(t: number): number {
    const p1x = 0.76, p1y = 0, p2x = 0.24, p2y = 1;
    const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
    const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    let s = t;
    for (let i = 0; i < 8; i++) {
        const ex = ((ax * s + bx) * s + cx) * s - t;
        const dx = (3 * ax * s + 2 * bx) * s + cx;
        if (Math.abs(dx) < 1e-7) break;
        s -= ex / dx;
    }
    return ((ay * s + by) * s + cy) * s;
}

const VectorBridge = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const bridgeLineRef = useRef<SVGPathElement>(null);
    const portalRectRef = useRef<HTMLDivElement>(null);
    const portalInnerRef = useRef<HTMLDivElement>(null);

    const sectionTopRef = useRef(0);
    const totalLineLenRef = useRef(0);
    const [ready, setReady] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const vw = typeof window !== 'undefined' ? window.innerWidth : 340;
    const RECT_W = vw < 380 ? Math.max(240, vw - 32) : 340;
    const RECT_H = 220;

    const measure = useCallback(() => {
        const mobile = window.innerWidth < 1024;
        setIsMobile(mobile);

        if (sectionRef.current) {
            sectionTopRef.current = sectionRef.current.getBoundingClientRect().top + window.scrollY;
        }

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let newPath = '';
        if (!mobile) {
            const scX = vw / 3000;
            const AX = 1500 + 1100 * Math.cos(196 * Math.PI / 180);
            const startX = AX * scX;
            const endX = vw / 2 - RECT_W / 2;
            const endY = vh / 2;
            const R_px = 1100 * scX;
            newPath = `M ${startX},0 A ${R_px},${R_px} 0 0,0 ${endX},${endY}`;
        } else {
            const startX = vw / 2;
            const startY = -10;
            const endX = vw / 2;
            const endY = vh / 2 - RECT_H / 2;
            newPath = `M ${startX},${startY} L ${endX},${endY}`;
        }

        if (bridgeLineRef.current) {
            bridgeLineRef.current.setAttribute('d', newPath);
            try {
                const len = bridgeLineRef.current.getTotalLength();
                if (len > 0) totalLineLenRef.current = len;
            } catch (_) { }
        }

        setReady(true);
    }, []);

    useEffect(() => {
        requestAnimationFrame(() => { measure(); setTimeout(measure, 150); });
        window.addEventListener('resize', measure, { passive: true });
        return () => window.removeEventListener('resize', measure);
    }, [measure]);

    useLenis(({ scroll }) => {
        if (!ready) return;
        const line = bridgeLineRef.current;
        const box = portalRectRef.current;
        const inner = portalInnerRef.current;
        const totalLen = totalLineLenRef.current;

        if (!box || !inner) return;

        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const localScroll = scroll - sectionTopRef.current;

        // Handle Bridge Line drawing
        if (line && totalLen > 0) {
            const drawProgress = Math.min(Math.max((localScroll + vh) / vh, 0), 1);
            line.style.strokeDasharray = `${totalLen}`;
            line.style.strokeDashoffset = `${(totalLen - (drawProgress * totalLen)).toFixed(1)}`;
        }

        // Portal Rect Visibility & Expansion
        const expansionRunway = vh * 1.0;
        const expansionProgress = Math.min(Math.max(localScroll / expansionRunway, 0), 1);

        const e = ease(expansionProgress);
        const targetScaleX = 1 + e * (vw / RECT_W - 1);
        const targetScaleY = 1 + e * (vh / RECT_H - 1);

        box.style.transform = `scale(${targetScaleX.toFixed(4)}, ${targetScaleY.toFixed(4)})`;
        inner.style.transform = `scale(${(1 / targetScaleX).toFixed(4)}, ${(1 / targetScaleY).toFixed(4)})`;

        const bOpacity = Math.max(0, 1 - e / 0.5);
        box.style.borderColor = `rgba(0,0,0,${bOpacity.toFixed(2)})`;
        box.style.opacity = localScroll < -vh * 0.35 ? '0' : '1';
        box.style.overflow = expansionProgress >= 0.95 ? 'visible' : 'hidden';
    });

    return (
        <section ref={sectionRef} className="relative bg-white text-black" style={{ height: '260vh' }}>
            <div id="philosophy" style={{ position: 'absolute', top: '100vh', left: 0, height: '1px', width: '1px', pointerEvents: 'none' }} />

            {/* Sticky container that stays fixed smoothly without DOM position toggling */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center z-20">
                
                {/* SVG Bridge Arc */}
                <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                        <path
                            ref={bridgeLineRef}
                            fill="none"
                            stroke="#000"
                            strokeLinecap="round"
                            style={{
                                strokeWidth: isMobile ? '0.8vw' : '10px',
                                strokeDasharray: '99999',
                                strokeDashoffset: '99999'
                            }}
                        />
                    </svg>
                </div>

                {/* Scalable Portal Rect */}
                <div
                    ref={portalRectRef}
                    style={{
                        position: 'relative',
                        width: `${RECT_W}px`,
                        height: `${RECT_H}px`,
                        background: 'white',
                        border: '2px solid rgba(0,0,0,1)',
                        overflow: 'hidden',
                        transformOrigin: 'center center',
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        zIndex: 50,
                    }}
                >
                    <div
                        ref={portalInnerRef}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '100vw',
                            height: '100vh',
                            marginLeft: '-50vw',
                            marginTop: '-50vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transformOrigin: 'center center',
                            willChange: 'transform',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                        }}
                    >
                        <div style={{ width: '100%', height: '100%' }}>
                            <SkillsPhilosophy />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default VectorBridge;