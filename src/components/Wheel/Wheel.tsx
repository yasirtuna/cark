import { useCallback, useEffect, useRef, useState } from 'react';
import type { Team } from '../../types';
import { computeTargetRotation, easeOutQuart, randomIntInRange } from '../../lib/wheelMath';
import { buildWheelCanvas } from './drawWheel';

interface WheelProps {
  teams: Team[];
  spinning: boolean;
  highlightTeamId?: string | null;
  onSpinComplete: (team: Team, index: number) => void;
}

const SPIN_DURATION_MS = 5200;
const MIN_TURNS = 4;
const MAX_TURNS = 8;

export default function Wheel({ teams, spinning, highlightTeamId, onSpinComplete }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const discRef = useRef<HTMLCanvasElement | null>(null);
  const teamsRef = useRef<Team[]>(teams);
  const rotationRef = useRef(0);
  const runningRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const startRotationRef = useRef(0);
  const startTimeRef = useRef(0);
  const pendingIndexRef = useRef(-1);

  const [cssSize, setCssSize] = useState(0);

  useEffect(() => {
    teamsRef.current = teams;
  }, [teams]);

  const draw = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    const disc = discRef.current;
    if (!canvas || !disc) return;
    const dpr = window.devicePixelRatio || 1;
    const size = canvas.width / dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(rotation);
    ctx.drawImage(disc, -size / 2, -size / 2, size, size);
    ctx.restore();
  }, []);

  const finishSpin = useCallback(() => {
    runningRef.current = false;
    const index = pendingIndexRef.current;
    pendingIndexRef.current = -1;
    if (index >= 0 && index < teamsRef.current.length) {
      onSpinComplete(teamsRef.current[index], index);
    }
  }, [onSpinComplete]);

  const startSpin = useCallback(() => {
    const pool = teamsRef.current;
    if (pool.length < 2 || runningRef.current) return;

    const index = randomIntInRange(0, pool.length - 1);
    pendingIndexRef.current = index;
    runningRef.current = true;

    const extraTurns = randomIntInRange(MIN_TURNS, MAX_TURNS);
    targetRef.current = computeTargetRotation(rotationRef.current, index, pool.length, extraTurns);
    startRotationRef.current = rotationRef.current;
    startTimeRef.current = performance.now();

    function loop(now: number) {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / SPIN_DURATION_MS);
      rotationRef.current = startRotationRef.current + (targetRef.current - startRotationRef.current) * easeOutQuart(t);
      draw(rotationRef.current);
      if (t < 1) {
        rafIdRef.current = requestAnimationFrame(loop);
      } else {
        rotationRef.current = targetRef.current;
        draw(rotationRef.current);
        finishSpin();
      }
    }

    rafIdRef.current = requestAnimationFrame(loop);
  }, [draw, finishSpin]);

  useEffect(() => {
    if (spinning) startSpin();
  }, [spinning, startSpin]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setCssSize(width);
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (cssSize <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = Math.round(cssSize * dpr);
    canvas.height = canvas.width;
    discRef.current = buildWheelCanvas(teams, cssSize, dpr, highlightTeamId ?? null);
    if (!runningRef.current) draw(rotationRef.current);
  }, [cssSize, draw, highlightTeamId, teams]);

  return (
    <div className={`wheel-wrap${spinning ? ' spinning' : ''}`} ref={wrapRef}>
      <canvas ref={canvasRef} className="wheel-canvas" style={{ width: '100%', aspectRatio: '1' }} />
      <div className="wheel-pointer" aria-hidden>
        <svg viewBox="0 0 24 24" width="40" height="40">
          <path d="M3 2 L21 2 L12 20 Z" fill="#22c55e" stroke="#0b0e14" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="wheel-hub" aria-hidden>
        <span>⚽</span>
      </div>
    </div>
  );
}