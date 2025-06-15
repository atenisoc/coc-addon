'use client';
import Image from 'next/image';

interface BackgroundProps {
  background: string;
}

export default function Background({ background }: BackgroundProps) {
  const path = `/images/backgrounds/${background || 'default'}`;

  return (
    <Image
      src={path}
      alt="背景"
      fill
      className="object-cover z-[-1]"
      onError={(e) => {
        e.currentTarget.src = '/images/backgrounds/default.jpg';
      }}
    />
  );
}
