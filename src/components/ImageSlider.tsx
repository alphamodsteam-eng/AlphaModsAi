import React, { useState, useEffect, useRef } from 'react';

const IMAGES = [
  "https://iili.io/Kn7y6ut.png",
  "https://iili.io/KnY9lRI.png",
  "https://iili.io/KnY9s5B.png",
  "https://iili.io/KnYHlrx.png",
  "https://iili.io/KnYJjuS.png",
  "https://iili.io/Kn7b0Cv.png",
  "https://iili.io/Kn7mcH7.png",
  "https://iili.io/Kn7plgp.png",
  "https://iili.io/Kn7pPBj.png",
  "https://iili.io/Kn7yaje.png"
];

const PRELOAD_IMAGE = "https://iili.io/qCa05zu.png";

export default function ImageSlider() {
  const [current, setCurrent] = useState(Math.floor(IMAGES.length / 2));
  const [showOriginal, setShowOriginal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOriginal(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const total = IMAGES.length;

  const moveNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % total);
    setTimeout(() => setIsAnimating(false), 450);
  };

  const movePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsAnimating(false), 450);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) moveNext();
      else movePrev();
    }
  };

  const getClassName = (index: number) => {
    if (index === current) return 'active visible';
    if (index === (current - 1 + total) % total) return 'far-left-1 visible';
    if (index === (current - 2 + total) % total) return 'far-left-2 visible';
    if (index === (current + 1) % total) return 'far-right-1 visible';
    if (index === (current + 2) % total) return 'far-right-2 visible';
    return '';
  };

  const handleCardClick = (index: number) => {
    const cls = getClassName(index);
    if (cls.includes('far-right-1') || cls.includes('far-right-2')) {
      moveNext();
    } else if (cls.includes('far-left-1') || cls.includes('far-left-2')) {
      movePrev();
    }
  };

  return (
    <div 
      className="card-carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {IMAGES.map((original, index) => {
        const bgImage = showOriginal ? `url('${original}')` : `url('${PRELOAD_IMAGE}')`;
        return (
          <div
            key={index}
            className={`my-card ${getClassName(index)}`}
            style={{ backgroundImage: bgImage }}
            onClick={() => handleCardClick(index)}
          />
        );
      })}
    </div>
  );
}
