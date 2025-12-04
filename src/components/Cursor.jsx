import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
      });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      gsap.to(cursor, {
        scale: 1.8,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // 監聽所有可點擊元素
    const clickableElements = document.querySelectorAll('button, a, [role="button"], .cursor-pointer, .clickable');
    
    window.addEventListener('mousemove', moveCursor);
    
    clickableElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      clickableElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[2000] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
    />
  );
}
