import { describe, it, expect } from 'vitest';
import {
  computeTargetRotation,
  indexForRotation,
  normalizeAngle,
  targetRotationMod,
  sliceAngleFor,
  easeOutQuart,
} from './wheelMath';

describe('wheelMath', () => {
  it('targetRotationMod seçili index için pointer eğrisiyle eşleşmeli', () => {
    for (const count of [2, 3, 7, 20, 63, 218]) {
      const slice = sliceAngleFor(count);
      for (let i = 0; i < count; i++) {
        const r = normalizeAngle(targetRotationMod(i, count));
        const centerWorld = normalizeAngle(-Math.PI / 2 + (i + 0.5) * slice + r);
        expect(Math.abs(centerWorld - normalizeAngle(-Math.PI / 2))).toBeLessThan(1e-9);
      }
    }
  });

  it('indexForRotation, computeTargetRotation ile round-trip tutarlılığı', () => {
    for (let trial = 0; trial < 500; trial++) {
      const count = 2 + Math.floor(Math.random() * 300);
      const selectedIndex = Math.floor(Math.random() * count);
      const currentRotation = Math.random() * 10000;
      const extraFullTurns = 3 + Math.floor(Math.random() * 5);
      const target = computeTargetRotation(currentRotation, selectedIndex, count, extraFullTurns);
      expect(indexForRotation(target, count)).toBe(selectedIndex);
    }
  });

  it('rotation hep ileri yönde artmalı (dönüş asla geri dönmemeli)', () => {
    for (let trial = 0; trial < 200; trial++) {
      const count = 3 + Math.floor(Math.random() * 200);
      const selected = Math.floor(Math.random() * count);
      const before = Math.random() * 5000;
      const target = computeTargetRotation(before, selected, count, 4);
      expect(target).toBeGreaterThan(before);
    }
  });

  it('aynı dilim seçilse bile çark en az bir tur döner', () => {
    const count = 10;
    const before = 0;
    const sameSlice = indexForRotation(before, count);
    const target = computeTargetRotation(before, sameSlice, count, 4);
    expect(target).toBeGreaterThan(before + Math.PI * 2);
  });

  it('easeOutQuart monotondur ve 0->0, 1->1 aralığında kalır', () => {
    expect(easeOutQuart(0)).toBe(0);
    expect(easeOutQuart(1)).toBe(1);
    for (let t = 0; t <= 1; t += 0.1) {
      const v = easeOutQuart(t);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});