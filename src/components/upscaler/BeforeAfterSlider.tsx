"use client";

import { useCallback, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isRtl =
        getComputedStyle(container).direction === "rtl";
      const x = clientX - rect.left;
      let percent = (x / rect.width) * 100;

      if (isRtl) {
        percent = 100 - percent;
      }

      setPosition(Math.max(0, Math.min(100, percent)));
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = 2;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPosition((prev) => Math.max(0, prev - step));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPosition((prev) => Math.min(100, prev + step));
      }
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none border border-border"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* After (full background) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterSrc}
        alt="Upscaled image"
        className="block w-full h-auto"
        draggable={false}
      />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt="Original image"
          className="block w-full h-auto"
          style={{
            width: containerRef.current
              ? `${containerRef.current.offsetWidth}px`
              : "100%",
            maxWidth: "none",
          }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-ink"
        style={{ insetInlineStart: `${position}%`, transform: "translateX(-50%)" }}
      />

      {/* Drag handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison slider"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 w-10 h-10 bg-paper border-2 border-ink flex items-center justify-center cursor-ew-resize focus-visible:outline-2 focus-visible:outline-accent"
        style={{
          insetInlineStart: `${position}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg
          className="w-4 h-4 text-ink"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 3L2 8L5 13M11 3L14 8L11 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      </div>
    </div>
  );
}
