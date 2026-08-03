'use client';
import { useEffect } from 'react';

export default function ScrollAnimator() {
  useEffect(() => {
    // ── Scroll reveal via IntersectionObserver ──
    const revealClasses = ['sr', 'sr-left', 'sr-right', 'sr-scale', 'dash-row'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const observe = () => {
      revealClasses.forEach(cls => {
        document.querySelectorAll(`.${cls}`).forEach(el => observer.observe(el));
      });
    };

    observe();

    // Re-observe after a tick (for dynamically rendered content)
    const timer = setTimeout(observe, 300);

    // ── Scroll progress bar ──
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    };

    // ── Navbar scroll behavior ──
    const navWrapper = document.querySelector('[data-navbar]') as HTMLElement | null;
    const updateNavbar = () => {
      if (!navWrapper) return;
      if (window.scrollY > 60) {
        navWrapper.classList.add('navbar-scrolled');
      } else {
        navWrapper.classList.remove('navbar-scrolled');
      }
    };

    // ── Magnetic buttons ──
    const setupMagnetic = () => {
      document.querySelectorAll('.btn-magnetic').forEach(btn => {
        const el = btn as HTMLElement;
        el.addEventListener('mousemove', (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = '';
        });
      });
    };

    setupMagnetic();

    // ── Chart bar grow on scroll ──
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.bar-grow');
            bars.forEach((bar, i) => {
              (bar as HTMLElement).style.animationDelay = `${i * 0.08}s`;
              (bar as HTMLElement).style.animationPlayState = 'running';
            });
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('[data-chart]').forEach(el => barObserver.observe(el));

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('scroll', updateNavbar, { passive: true });

    return () => {
      observer.disconnect();
      barObserver.disconnect();
      clearTimeout(timer);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('scroll', updateNavbar);
      if (progressBar.parentNode) progressBar.parentNode.removeChild(progressBar);
    };
  }, []);

  return null;
}
