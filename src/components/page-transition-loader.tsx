
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function PageTransitionLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement;
      if (
        target.target === '_blank' ||
        target.href === window.location.href ||
        target.href.startsWith('mailto:') ||
        target.href.startsWith('tel:') ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }
      setLoading(true);
    };

    const handleMutation: MutationCallback = () => {
      const anchors = document.querySelectorAll('a');
      anchors.forEach((a) => a.addEventListener('click', handleAnchorClick));
    };

    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      document.querySelectorAll('a').forEach((a) => a.removeEventListener('click', handleAnchorClick));
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed left-0 top-0 z-[9999] h-1 w-full bg-primary transition-all duration-500 ease-in-out ${
        loading ? 'opacity-100 w-full' : 'opacity-0 w-0'
      }`}
      style={{
        transitionProperty: 'width, opacity',
        width: loading ? '70%' : '0%',
        transitionTimingFunction: loading ? 'cubic-bezier(0.1, 0.7, 1.0, 1.0)' : 'ease-out',
        transitionDuration: loading ? '5s' : '0.4s',
      }}
    />
  );
}
