import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

interface FooterExplosionProps {
  footerRef?: React.RefObject<HTMLElement>;
}

const config = {
  gravity: 0.75,
  initialOpacity: 0.9,
};

const imageParticleCount = 10;
const imagePaths = Array.from(
  { length: imageParticleCount },
  (_, i) => `/images/work-items/work-item-${i + 1}.png`
);

export const FooterExplosion: React.FC<FooterExplosionProps> = ({ footerRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const hasExplodedRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  // Preload images
  useEffect(() => {
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  }, []);

  const explode = () => {
    if (hasExplodedRef.current) return;
    hasExplodedRef.current = true;

    // Clean up any previous runs
    cleanupPhysics();

    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width <= 0 || height <= 0) return;

    // Responsive sizing - full landscape browser screenshot proportions
    const isMobile = width < 768;
    const imgW = isMobile ? 160 : 300;
    const imgH = isMobile ? 100 : 185;
    const verticalForce = isMobile ? 14 : 24;
    const horizontalForce = isMobile ? 8 : 15;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    const engine = Engine.create();
    engine.world.gravity.y = config.gravity;
    engineRef.current = engine;

    // Hidden render to handle mouse coordinate mapping
    const render = Render.create({
      element: canvasContainerRef.current || container,
      engine,
      options: {
        width,
        height,
        background: "transparent",
        wireframes: false,
      },
    });
    renderRef.current = render;

    // Hide the debug canvas visually
    if (render.canvas) {
      render.canvas.style.position = "absolute";
      render.canvas.style.top = "0";
      render.canvas.style.left = "0";
      render.canvas.style.opacity = "0";
      render.canvas.style.pointerEvents = "none";
      render.canvas.style.zIndex = "-1";
    }

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };

    // Bounds configuration
    const floor = Bodies.rectangle(width / 2, height + 50, width * 2, 100, boundaryOptions);
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 2, boundaryOptions);
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, boundaryOptions);
    const ceiling = Bodies.rectangle(width / 2, -1000, width * 2, 100, boundaryOptions);

    const startTime = performance.now();

    const particles = imagePaths.map((path) => {
      // Create HTML div element wrapper
      const elem = document.createElement("div");
      elem.style.position = "absolute";
      elem.style.width = `${imgW}px`;
      elem.style.height = `${imgH}px`;
      elem.style.opacity = `${config.initialOpacity}`;
      elem.style.zIndex = "10";
      elem.style.willChange = "transform, opacity";
      elem.style.pointerEvents = "auto";

      const img = document.createElement("img");
      img.src = path;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.borderRadius = "12px";
      img.style.border = "1px solid rgba(255, 255, 255, 0.15)";
      img.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.5)";
      elem.appendChild(img);

      container.appendChild(elem);

      const body = Bodies.rectangle(
        width / 2 + (Math.random() - 0.5) * 100,
        height + 50,
        imgW,
        imgH,
        {
          restitution: 0.65,
          frictionAir: 0.015,
          friction: 0.15,
        }
      );

      // Trigger standard upward explosion burst
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * horizontalForce,
        y: -verticalForce - Math.random() * 8,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);

      return { elem, body, path, isRemoved: false };
    });

    // Mouse control constraint
    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    World.add(engine.world, [
      floor,
      leftWall,
      rightWall,
      ceiling,
      mouseConstraint,
      ...particles.map((p) => p.body),
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);
    runnerRef.current = runner;

    const updateLoop = () => {
      const elapsed = (performance.now() - startTime) / 1000; // time in seconds
      const mousePos = mouse.position;

      particles.forEach((p) => {
        if (p.isRemoved) return;

        // 1. Repel force: Run away from the cursor when hovered/approached
        if (mousePos.x !== null && mousePos.y !== null && mousePos.x > 0 && mousePos.y > 0) {
          const dx = p.body.position.x - mousePos.x;
          const dy = p.body.position.y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const repelRadius = isMobile ? 130 : 230;
          if (dist < repelRadius && dist > 0) {
            const forceDirectionX = dx / dist;
            const forceDirectionY = dy / dist;
            // Stronger push the closer the mouse is (repelled quickly)
            const forceStrength = (1 - dist / repelRadius) * (isMobile ? 0.18 : 0.35);

            Matter.Body.applyForce(p.body, p.body.position, {
              x: forceDirectionX * forceStrength,
              y: forceDirectionY * forceStrength,
            });
          }
        }

        const { x, y } = p.body.position;
        p.elem.style.left = `${x}px`;
        p.elem.style.top = `${y}px`;
        p.elem.style.transform = `translate(-50%, -50%) rotate(${p.body.angle}rad)`;

        // 2. 20-Second Disappear Lifespan
        let opacity = config.initialOpacity;
        if (elapsed > 12) {
          // Linear decay from 12s to 20s (takes 8s to hit 0)
          opacity = Math.max(0, config.initialOpacity * (1 - (elapsed - 12) / 8));
        }

        p.elem.style.opacity = `${opacity}`;

        if (opacity <= 0.01) {
          p.elem.style.visibility = "hidden";
          p.isRemoved = true;
          // Clear body from engine world to save CPU
          Matter.Composite.remove(engine.world, p.body);
        }
      });

      engineRef.current && Matter.Engine.update(engine);
      animationFrameRef.current = requestAnimationFrame(updateLoop);
    };

    updateLoop();
  };

  const cleanupPhysics = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (runnerRef.current) {
      Matter.Runner.stop(runnerRef.current);
      runnerRef.current = null;
    }
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      renderRef.current = null;
    }
    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const targetElement = footerRef?.current || containerRef.current?.parentElement;
      if (!targetElement) return;

      const footerRect = targetElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Reset explosion if footer is scrolled out of viewport
      if (footerRect.top > viewportHeight + 100) {
        hasExplodedRef.current = false;
        cleanupPhysics();
      }

      // Trigger explosion when footer enters trigger viewport zone
      if (!hasExplodedRef.current && footerRect.top <= viewportHeight + 250) {
        explode();
      }
    };

    const handleResize = () => {
      hasExplodedRef.current = false;
      cleanupPhysics();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // Initial check
    const timer = setTimeout(handleScroll, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
      cleanupPhysics();
    };
  }, [footerRef]);

  return (
    <>
      <div ref={containerRef} className="explosion-container" />
      <div ref={canvasContainerRef} style={{ display: "none" }} />
    </>
  );
};

export default FooterExplosion;
