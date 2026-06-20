'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProfileCardProps {
  flipTrigger?: 'click' | 'hover';
  flipAxis?: 'horizontal' | 'vertical';
  showFlipHint?: boolean;
}

export default function ProfileCard({
  flipTrigger = 'click',
  flipAxis = 'horizontal',
  showFlipHint = true,
}: ProfileCardProps) {
  const [flipped, setFlipped] = useState(false);

  const isVertical = flipAxis === 'vertical';
  const axisFn = isVertical ? 'rotateX' : 'rotateY';
  
  const flipTransform = `${axisFn}(${flipped ? 180 : 0}deg)`;
  const backTransform = `${axisFn}(180deg)`;
  
  const handleCardClick = () => {
    if (flipTrigger === 'click') {
      setFlipped((prev) => !prev);
    }
  };

  const handleMouseEnter = () => {
    if (flipTrigger === 'hover') {
      setFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (flipTrigger === 'hover') {
      setFlipped(false);
    }
  };

  return (
    <div style={{ margin: '0 0 16px' }}>
      <div
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: 'min(330px, 100%)',
          aspectRatio: '1/1',
          perspective: '1400px',
          cursor: flipTrigger === 'click' ? 'pointer' : 'default',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform .85s cubic-bezier(.7,0,.2,1)',
            transform: flipTransform,
          }}
        >
          {/* Front (Work) Card */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: '3px',
              overflow: 'hidden',
              background: '#f1f0ec',
            }}
          >
            <Image
              src="/images/headshot.png"
              alt="Krishnanunni - Professional Headshot"
              fill
              sizes="330px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          {/* Back (Life) Card */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: '3px',
              overflow: 'hidden',
              transform: backTransform,
              background: '#f1f0ec',
            }}
          >
            <Image
              src="/images/personal.png"
              alt="Krishnanunni - Candid Personal"
              fill
              sizes="330px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
      {showFlipHint && (
        <p
          style={{
            fontSize: '12px',
            letterSpacing: '.04em',
            color: '#a3a09b',
            margin: '12px 0 92px',
          }}
        >
          Work ⇄ Life — {flipTrigger === 'click' ? 'tap the photo to flip' : 'hover over the photo to flip'}
        </p>
      )}
    </div>
  );
}
