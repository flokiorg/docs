import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

const STORAGE_PREFIX = 'scratch-inline::';
const supportsWindow = typeof window !== 'undefined';

const extractText = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }
  if (React.isValidElement(node)) {
    return extractText(node.props.children);
  }
  return '';
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

export type ScratchRevealProps = {
  id?: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
  strokeRadius?: number;
  completionRatio?: number;
};

// const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
const isDevelopment = true
const REVEAL_EXPIRY_MS = isDevelopment ? 1*60*1000 : 24 * 60 * 60 * 1000;

const ScratchReveal: React.FC<ScratchRevealProps> = ({
  id,
  children,
  hint,
  className,
  strokeRadius = 5,
  completionRatio = 0.6,
}) => {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const randomIdRef = useRef<string>();

  const storageKey = useMemo(() => {
    if (id) {
      return `${STORAGE_PREFIX}${id}`;
    }
    const text = slugify(extractText(children));
    if (text) {
      return `${STORAGE_PREFIX}${text}`;
    }
    if (!randomIdRef.current) {
      randomIdRef.current = `auto-${Math.random().toString(36).slice(2, 10)}`;
    }
    return `${STORAGE_PREFIX}${randomIdRef.current}`;
  }, [children, id]);

  const finalHint = hint ?? 'SCRATCH\nHERE';

  const reveal = useCallback(() => {
    setRevealed(true);
    if (supportsWindow) {
      try {
        const payload = JSON.stringify({ revealed: true, timestamp: Date.now() });
        window.localStorage.setItem(storageKey, payload);
      } catch {
        // ignore storage issues
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (!supportsWindow) {
      return;
    }
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as {revealed?: boolean; timestamp?: number} | null;
      if (parsed?.revealed && typeof parsed.timestamp === 'number') {
        if (Date.now() - parsed.timestamp < REVEAL_EXPIRY_MS) {
          setRevealed(true);
          return;
        }
      }
    } catch {
      // ignore parse errors
    }

    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore removal issues
    }
  }, [storageKey]);

  const setupCanvas = useCallback(() => {
    if (revealed) {
      return;
    }
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) {
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
    const isDark = supportsWindow && document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? 'rgba(124, 124, 130, 0.92)' : 'rgba(190, 190, 196, 0.92)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';
  }, [revealed]);

  const scratchAt = useCallback((event: PointerEvent) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const scaledRadius = strokeRadius * Math.max(scaleX, scaleY);
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius, 0, Math.PI * 2);
    ctx.fill();
  }, [strokeRadius]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!drawingRef.current) {
      return;
    }
    scratchAt(event);
  }, [scratchAt]);

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
    const {data} = ctx.getImageData(0, 0, width, height);
    let transparent = 0;
    const total = data.length / 4;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 80) {
        transparent += 1;
      }
    }
    if (transparent / total >= completionRatio) {
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
    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    scratchAt(event);
  }, [revealed, scratchAt]);

  const handlePointerUp = useCallback((event: PointerEvent) => {
    if (!drawingRef.current) {
      return;
    }
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    }
    evaluateScratch();
  }, [evaluateScratch]);

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
    canvas.addEventListener('pointercancel', handlePointerUp);

    if (supportsWindow) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      if (supportsWindow) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, revealed, setupCanvas]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (revealed) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      reveal();
    }
  }, [reveal, revealed]);

  return (
    <span
      ref={containerRef}
      className={clsx(styles.reveal, revealed && styles.revealed, className)}
      tabIndex={0}
      role="button"
      aria-pressed={revealed}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.text}>{children}</span>
      {!revealed && (
        <>
          <canvas ref={canvasRef} className={styles.canvas} />
          <span className={styles.hint}>{finalHint}</span>
        </>
      )}
    </span>
  );
};

export default ScratchReveal;
