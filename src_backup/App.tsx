
import React, { useState, useEffect, useCallback } from 'react';
import type { Quote } from './types.ts';
import { quotes } from './data/quotes.ts';

/**
 * A breathing circle component that serves as the main interactive element.
 * @param {boolean} isClickAnimating - Controls the click animation.
 * @param {React.MouseEventHandler<HTMLDivElement>} onClick - Click handler.
 */
const BreathingCircle = ({ isClickAnimating, onClick }: { isClickAnimating: boolean; onClick: React.MouseEventHandler<HTMLDivElement> }) => (
  <div
    onClick={onClick}
    className="relative w-56 h-56 md:w-64 md:h-64 cursor-pointer group focus:outline-none"
    role="button"
    tabIndex={0}
    aria-label="Get a new meditation"
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(e as any)}
  >
    <div
      className={`absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 to-blue-200 animate-breath transition-transform duration-300 group-hover:scale-105 ${isClickAnimating ? 'animate-click-effect' : ''}`}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-lg font-medium text-blue-800/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Breathe
      </span>
    </div>
  </div>
);

/**
 * Main application component.
 */
export default function App() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number | null>(null);
  const [isClickAnimating, setIsClickAnimating] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleNewMeditation = useCallback(() => {
    if (isClickAnimating) return;

    setIsFading(true);
    setIsClickAnimating(true);

    // Mid-animation: change the quote
    setTimeout(() => {
      if (!hasStarted) {
        setHasStarted(true);
      }
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * quotes.length);
      } while (newIndex === currentQuoteIndex && quotes.length > 1);
      
      setCurrentQuoteIndex(newIndex);
      setCurrentQuote(quotes[newIndex]);
      setIsFading(false);
    }, 250); // Half of the click animation duration

    // End of animation: reset the animating state
    setTimeout(() => {
      setIsClickAnimating(false);
    }, 500); // Matches the click animation duration
  }, [isClickAnimating, currentQuoteIndex, hasStarted]);

  return (
    <main className="flex flex-col items-center justify-center min-h-full w-full bg-gray-50 text-gray-800 p-4 overflow-hidden">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-5xl md:text-6xl font-light text-gray-700 tracking-tight">
          Meditations
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          from Simon Allmer and his characters
        </p>
      </div>

      <BreathingCircle isClickAnimating={isClickAnimating} onClick={handleNewMeditation} />

      <div className="mt-12 md:mt-16 w-full max-w-2xl h-48 flex flex-col justify-center items-center">
        {!hasStarted ? (
          <p className="text-gray-400 animate-pulse text-lg">Tap the circle to begin</p>
        ) : (
          currentQuote && (
            <blockquote
              className={`transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
              aria-live="polite"
            >
              <p className="font-lora text-2xl md:text-3xl italic text-gray-700 text-center">
                “{currentQuote.text}”
              </p>
              <footer className="mt-4 text-right font-sans text-gray-500 text-lg">
                — {currentQuote.author}
              </footer>
            </blockquote>
          )
        )}
      </div>
    </main>
  );
}
