import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = "",
  onClick,
  ariaLabel,
  style,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [outerPos, setOuterPos] = useState({ x: 0, y: 0 });
  const [innerPos, setInnerPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = clientX - (left + width / 2);
    const centerY = clientY - (top + height / 2);

    // Outer circle follows cursor with 0.35 strength
    setOuterPos({ x: centerX * 0.38, y: centerY * 0.38 });
    // Inner icon focuses deeper toward cursor with 0.65 strength
    setInnerPos({ x: centerX * 0.65, y: centerY * 0.65 });
  };

  const handleMouseLeave = () => {
    setOuterPos({ x: 0, y: 0 });
    setInnerPos({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      aria-label={ariaLabel}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: outerPos.x, y: outerPos.y }}
      transition={{ type: "spring", stiffness: 160, damping: 14, mass: 0.1 }}
      className={className}
    >
      <motion.div
        animate={{ x: innerPos.x, y: innerPos.y }}
        transition={{ type: "spring", stiffness: 220, damping: 16, mass: 0.1 }}
        className="w-full h-full flex items-center justify-center relative"
      >
        {children}
      </motion.div>
    </motion.button>
  );
};

export default MagneticButton;
