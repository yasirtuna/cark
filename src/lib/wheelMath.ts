export const TWO_PI = Math.PI * 2;

export const START_OFFSET = -Math.PI / 2;

export function normalizeAngle(angle: number): number {
  return angle - TWO_PI * Math.floor(angle / TWO_PI);
}

export function sliceAngleFor(count: number): number {
  if (count <= 0) return 0;
  return TWO_PI / count;
}

/**
 * Çark durduğunda pointer'ın altında kalacak seçili dilimin merkez açısı (mod 2π).
 * Dilim i'nin merkezi başlangıçta START_OFFSET + (i + 0.5) * sliceAngle'dadır.
 * Pointer sabittir ve çark döner; dilim merkezinin pointer'a gelmesi için dönüş açısı:
 * R(e) = -(i + 0.5) * sliceAngle (mod 2π).
 */
export function targetRotationMod(selectedIndex: number, count: number): number {
  return normalizeAngle(-(selectedIndex + 0.5) * sliceAngleFor(count));
}

/**
 * Dilimi pointer'a getiren, hep ileri yönde dönen mutlak hedef açı.
 * currentRotation, tekrar tekrar çevrildikçe büyüyebilir, bu yüzden mod üzerinden çalışır.
 */
export function computeTargetRotation(
  currentRotation: number,
  selectedIndex: number,
  count: number,
  extraFullTurns: number,
): number {
  if (count <= 0) return currentRotation;
  const targetMod = targetRotationMod(selectedIndex, count);
  const currentMod = normalizeAngle(currentRotation);
  let delta = targetMod - currentMod;
  if (delta < 0) delta += TWO_PI;
  return currentRotation + extraFullTurns * TWO_PI + delta;
}

/**
 * Animasyon sonundaki rotation açısından pointer'ın altında hangi dilimin kaldığını
 * bulur (gerçek seçilen index ile kıyaslamak için). computeTargetRotation'un tersi.
 */
export function indexForRotation(rotation: number, count: number): number {
  if (count <= 0) return 0;
  const slice = sliceAngleFor(count);
  const normalized = normalizeAngle(-rotation);
  const i = Math.round(normalized / slice - 0.5);
  return ((i % count) + count) % count;
}

/** Dönüş hissi veren güçlü yavaşlama eğrisi. t: [0,1] */
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function randomIntInRange(minInclusive: number, maxInclusive: number): number {
  return minInclusive + Math.floor(Math.random() * (maxInclusive - minInclusive + 1));
}