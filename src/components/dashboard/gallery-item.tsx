
"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Ripple = {
  key: number;
  x: number;
  y: number;
};

export function GalleryItem({
  imageUrl,
  title,
  description,
  ...props
}: {
  imageUrl: string;
  title: string;
  description: string;
  [key: string]: any;
}) {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newRipple: Ripple = { key: Date.now(), x, y };

      setRipples((prevRipples) => [...prevRipples, newRipple]);
    }
  };

  const handleAnimationEnd = (key: number) => {
    setRipples((prevRipples) => prevRipples.filter((r) => r.key !== key));
  };

  return (
    <div
      ref={containerRef}
      className="group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
      onClick={createRipple}
      {...props}
    >
      <Image
        src={imageUrl}
        alt={title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </div>
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="pointer-events-none absolute block animate-[ripple_600ms_linear] rounded-full bg-white/70"
          style={{ left: ripple.x, top: ripple.y, transform: 'scale(0)' }}
          onAnimationEnd={() => handleAnimationEnd(ripple.key)}
        />
      ))}
    </div>
  );
}
