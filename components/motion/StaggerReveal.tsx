'use client';
import { useEffect, useRef, ReactNode, Children, cloneElement, isValidElement } from 'react';

interface StaggerRevealProps {
  children: ReactNode;
  stagger?: number;
  baseDelay?: number;
  className?: string;
  threshold?: number;
}

export default function StaggerReveal({
  children,
  stagger = 80,
  baseDelay = 0,
  className = '',
  threshold = 0.08,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = Array.from(container.children) as HTMLElement[];

    items.forEach((el, i) => {
      const delay = baseDelay + i * stagger;
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
      el.style.willChange = 'opacity, transform';
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
          observer.unobserve(container);
        }
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [stagger, baseDelay, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
