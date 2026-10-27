import { useCallback, useEffect, useRef, useState } from 'react';

import { classNames } from '../../lib/format.js';
import PropertyCard from './PropertyCard.jsx';
import { CircleButton } from '../ui/Button.jsx';

/**
 * Horizontally scrolling property rail: native scroll-snap on touch, pointer
 * drag with the mouse, previous/next controls and arrow-key support.
 */
export default function PropertyCarousel({ properties = [], ariaLabel = 'Property carousel' }) {
  const scroller = useRef(null);
  const dragState = useRef({ active: false, startX: 0, startScroll: 0, moved: 0, suppressClick: false });
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });
  const [dragging, setDragging] = useState(false);

  const updateEdges = useCallback(() => {
    const node = scroller.current;
    if (!node) return;
    const atStart = node.scrollLeft <= 8;
    const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 8;
    setEdges((previous) => (previous.atStart === atStart && previous.atEnd === atEnd ? previous : { atStart, atEnd }));
  }, []);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return undefined;

    updateEdges();
    node.addEventListener('scroll', updateEdges, { passive: true });

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateEdges())
        : null;
    observer?.observe(node);

    return () => {
      node.removeEventListener('scroll', updateEdges);
      observer?.disconnect();
    };
  }, [updateEdges, properties.length]);

  const step = useCallback(() => {
    const node = scroller.current;
    if (!node) return 320;
    const first = node.querySelector('[data-slide]');
    const gap = Number.parseFloat(window.getComputedStyle(node).columnGap || '24') || 24;
    return first ? first.getBoundingClientRect().width + gap : node.clientWidth * 0.8;
  }, []);

  const scrollByStep = useCallback(
    (direction) => {
      const node = scroller.current;
      if (!node) return;
      node.scrollBy({ left: direction * step(), behavior: 'smooth' });
    },
    [step],
  );

  const onPointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const node = scroller.current;
    if (!node) return;
    dragState.current = {
      active: true,
      startX: event.clientX,
      startScroll: node.scrollLeft,
      moved: 0,
      suppressClick: false,
    };
    setDragging(true);
  };

  const onPointerMove = (event) => {
    const state = dragState.current;
    const node = scroller.current;
    if (!state.active || !node) return;

    const delta = event.clientX - state.startX;
    state.moved = Math.max(state.moved, Math.abs(delta));
    if (state.moved > 5) state.suppressClick = true;
    node.scrollLeft = state.startScroll - delta;
  };

  const endDrag = () => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    setDragging(false);
    updateEdges();
  };

  const onClickCapture = (event) => {
    if (dragState.current.suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      dragState.current.suppressClick = false;
    }
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByStep(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByStep(-1);
    }
  };

  return (
    <div className="relative">
      <div
        ref={scroller}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        style={{ scrollSnapType: dragging ? 'none' : undefined }}
        className={classNames(
          'no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-5 pb-2 sm:px-8 lg:gap-6 lg:px-10',
          dragging && 'cursor-grabbing select-none',
        )}
      >
        {properties.map((property, index) => (
          <div
            key={property.slug}
            data-slide
            className={classNames(
              'h-[420px] shrink-0 snap-start sm:h-[470px] lg:h-[540px]',
              index === 0
                ? 'w-[86vw] max-w-[560px] sm:w-[420px] lg:w-[520px]'
                : 'w-[80vw] max-w-[440px] sm:w-[300px] lg:w-[330px]',
            )}
          >
            <PropertyCard property={property} variant="overlay" priority={index < 2} />
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className={classNames(
          'pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-white to-transparent transition-opacity duration-300 xl:block',
          edges.atStart && 'opacity-0',
        )}
      />
      <div
        aria-hidden="true"
        className={classNames(
          'pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-white to-transparent transition-opacity duration-300 xl:block',
          edges.atEnd && 'opacity-0',
        )}
      />

      <CircleButton
        icon="chevronLeft"
        label="Previous properties"
        onClick={() => scrollByStep(-1)}
        disabled={edges.atStart}
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 lg:inline-flex xl:left-6"
      />
      <CircleButton
        icon="chevronRight"
        label="Next properties"
        onClick={() => scrollByStep(1)}
        disabled={edges.atEnd}
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 lg:inline-flex xl:right-6"
      />
    </div>
  );
}
