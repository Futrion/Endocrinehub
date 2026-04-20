export function computeSimilitud(target, value) {
    if (!isFinite(target) || target <= 0) return null;
    if (!isFinite(value)) return null;
    const diff = value - target;
    const deviationPct = (Math.abs(diff) / target) * 100;
    const direction =
        Math.abs(diff) < 1e-6 ? null : diff > 0 ? 'exceso' : 'defecto';
    const inRange = deviationPct < 10;
    return { deviationPct, direction, inRange };
}
