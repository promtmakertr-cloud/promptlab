export function selectMode(score) {
  if (score >= 8) return "ULTRA";
  if (score >= 5) return "PRO";
  if (score >= 3) return "BALANCED";
  return "FAST";
}
