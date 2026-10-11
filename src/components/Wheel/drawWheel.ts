import type { Team } from '../../types';
import { START_OFFSET, TWO_PI } from '../../lib/wheelMath';

const GOLDEN_ANGLE = 137.508;

export interface WheelStyle {
  saturation: number;
  lightnessEven: number;
  lightnessOdd: number;
}

const DEFAULT_STYLE: WheelStyle = {
  saturation: 52,
  lightnessEven: 40,
  lightnessOdd: 30,
};

export function colorForIndex(i: number, style: WheelStyle = DEFAULT_STYLE): string {
  const hue = (i * GOLDEN_ANGLE) % 360;
  const lightness = i % 2 === 0 ? style.lightnessEven : style.lightnessOdd;
  return `hsl(${hue}, ${style.saturation}%, ${lightness}%)`;
}

function ellipseText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 1 && ctx.measureText(trimmed + '…').width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed + '…';
}

function drawSlices(
  ctx: CanvasRenderingContext2D,
  teams: Team[],
  size: number,
  highlightId: string | null,
): void {
  const n = teams.length;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 2;
  const slice = n > 0 ? TWO_PI / n : 0;
  const highlightIndex = highlightId ? teams.findIndex((t) => t.id === highlightId) : -1;

  for (let i = 0; i < n; i++) {
    const start = START_OFFSET + i * slice;
    const end = start + slice;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end, false);
    ctx.closePath();
    ctx.fillStyle =
      i === highlightIndex
        ? `hsl(${(i * GOLDEN_ANGLE) % 360}, 60%, 52%)`
        : colorForIndex(i);
    ctx.fill();
    ctx.strokeStyle = 'rgba(11, 14, 20, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  if (highlightIndex >= 0) {
    const start = START_OFFSET + highlightIndex * slice;
    const end = start + slice;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end, false);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  const outerRing = radius + 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, outerRing, 0, TWO_PI);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawLabels(ctx: CanvasRenderingContext2D, teams: Team[], size: number): void {
  const n = teams.length;
  if (n === 0) return;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2;
  const slice = TWO_PI / n;

  const baseFont = Math.min(20, radius * 0.16);
  ctx.font = `600 ${baseFont}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 4;

  const labelRadius = radius * 0.62;
  const maxWidth = radius * 0.46;

  for (let i = 0; i < n; i++) {
    const mid = START_OFFSET + (i + 0.5) * slice;
    const x = cx + Math.cos(mid) * labelRadius;
    const y = cy + Math.sin(mid) * labelRadius;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(mid);
    if (Math.cos(mid) < 0) ctx.rotate(Math.PI);
    ctx.fillText(ellipseText(ctx, teams[i].name, maxWidth), 0, 0);
    ctx.restore();
  }
  ctx.shadowBlur = 0;
}

export function drawWheelToContext(
  ctx: CanvasRenderingContext2D,
  teams: Team[],
  size: number,
  highlightId: string | null = null,
): void {
  drawSlices(ctx, teams, size, highlightId);
  drawLabels(ctx, teams, size);
}

export function buildWheelCanvas(
  teams: Team[],
  size: number,
  dpr: number,
  highlightId: string | null = null,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(size * dpr));
  canvas.height = canvas.width;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.scale(dpr, dpr);
  drawWheelToContext(ctx, teams, size, highlightId);
  return canvas;
}