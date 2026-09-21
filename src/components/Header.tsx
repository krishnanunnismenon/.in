'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { portfolio } from '@/data/portfolio';
import styles from './site/Site.module.css';

export default function Header({ className = '' }: { className?: string }) {
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const measure = () => document.documentElement.style.setProperty('--site-header-height', `${element.offsetHeight}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    const revealFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || element.contains(target) || target.classList.contains('skipLink')) return;
      // WebKit can refocus main during a pointer click. Never move that click's target.
      if (!target.matches('a, button, input, select, textarea, summary') || !target.matches(':focus-visible')) return;
      const top = target.getBoundingClientRect().top;
      const bottom = element.getBoundingClientRect().bottom;
      if (top < bottom + 8) window.scrollBy({ top: top - bottom - 16, behavior: 'instant' });
    };
    document.addEventListener('focusin', revealFocus);
    return () => { observer.disconnect(); document.removeEventListener('focusin', revealFocus); document.documentElement.style.removeProperty('--site-header-height'); };
  }, []);
  return (
    <header ref={header} data-site-header className={`${styles.header} ${className}`}>
      <Link className={styles.name} href="/">{portfolio.name}</Link>
      <nav className={styles.navigation} aria-label="Main navigation">
        <Link href="/blog">Writing</Link>
        <Link href="/#about">About</Link>
      </nav>
    </header>
  );
}
