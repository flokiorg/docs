import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

type ScratchCardProps = {
  id: string;
  children: React.ReactNode;
  prompt?: string;
  className?: string;
  strokeRadius?: number;
  completionRatio?: number;
};

const STORAGE_PREFIX = 'scratch-card::';

const supportsWindow = typeof window !== 'undefined';

const ScratchCard: React.FC<ScratchCardProps> = ({
  id,
  children,
  prompt = 'Scratch to reveal',
  className,
  strokeRadius = 28,
  completionRatio = 0.55,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  const storageKey = `${STORAGE_PREFIX}${id}`;

  const reveal = useCallback(() => {
    setRevealed(true);
    if (supportsWindow) {
      try {
        window.localStorage.setItem(storageKey, 'revealed');
      } catch {
        // ignore storage failures
      }
    }
  }, [storageKey]);

  const setupCanvas = useCallback(() => {
    if (revealed) {
      return;
    }
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }
    const rect = container.getBoundingClientRect();
    const dpr = supportsWindow ? window.devicePixelRatio || 1 : 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctxRef.current = ctx;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = 'rgba(49, 46, 84, 0.92)';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.restore();
    ctx.globalCompositeOperation = 'destination-out';
  }, [revealed]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!isDrawingRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, strokeRadius, 0, Math.PI * 2, false);
    ctx.fill();
  }, [strokeRadius]);

  const evaluateScratch = useCallback(() => {
    if (revealed) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }
    const {width, height} = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const {data} = imageData;
    let transparentPixels = 0;
    const totalPixels = data.length / 4;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 80) {
        transparentPixels += 1;
      }
    }

    if (transparentPixels / totalPixels >= completionRatio) {
      reveal();
    }
  }, [completionRatio, reveal, revealed]);

  const handlePointerDown = useCallback((event: PointerEvent) => {
    if (revealed) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    isDrawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    handlePointerMove(event);
  }, [handlePointerMove, revealed]);

  const handlePointerUp = useCallback((event: PointerEvent) => {
    if (!isDrawingRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // ignore release failures
      }
    }
    isDrawingRef.current = false;
    evaluateScratch();
  }, [evaluateScratch]);

  useEffect(() => {
    if (!supportsWindow) {
      return;
    }
    const stored = window.localStorage.getItem(storageKey);
    if (stored === 'revealed') {
      setRevealed(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (revealed) {
      return;
    }
    setupCanvas();

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const handleResize = () => {
      setupCanvas();
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    if (supportsWindow) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
      if (supportsWindow) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, revealed, setupCanvas]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (revealed) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      reveal();
    }
  }, [reveal, revealed]);

  return (
    <div
      ref={containerRef}
      className={clsx(styles.card, revealed && styles.revealed, className)}
      tabIndex={0}
      role="button"
      aria-pressed={revealed}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.content}>{children}</div>
      {!revealed && (
        <>
          <div className={styles.prompt}>{prompt}</div>
          <canvas ref={canvasRef} className={styles.canvas} />
        </>
      )}
    </div>
  );
};

export default ScratchCard;
