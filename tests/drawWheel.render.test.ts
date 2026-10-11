import { describe, it, expect } from 'vitest';
import { createCanvas } from 'canvas';
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { superLig } from '../src/data/leagues/superLig';
import { nationalTeams } from '../src/data/leagues/nationalTeams';
import { drawWheelToContext } from '../src/components/Wheel/drawWheel';

function snapshot(name: string, teams: { id: string; name: string }[]) {
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  drawWheelToContext(ctx, teams as never, size, teams[0]?.id ?? null);
  const dir = join(tmpdir(), 'opencode', 'wheel-smoke');
  mkdirSync(dir, { recursive: true });
  const file = join(dir, name);
  writeFileSync(file, canvas.toBuffer('image/png'));
  return file;
}

describe('wheel render smoke', () => {
  it('18 takımlı lig çarkı çizilebilmeli', () => {
    const file = snapshot('superlig.png', superLig.teams);
    expect(file.length).toBeGreaterThan(0);
  });

  it('50 takımlı milli takımlar çarkı çizilebilmeli', () => {
    const file = snapshot('national.png', nationalTeams.teams);
    expect(file.length).toBeGreaterThan(0);
  });
});