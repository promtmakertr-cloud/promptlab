export function calculateScore(input) {
  let score = 0;

  if (!input) return 0;

  const length = input.length;

  if (length > 300) score += 2;
  else if (length > 150) score += 1;

  const words = input.split(" ");

  if (words.length > 20) score += 1;

  const heavyWords = [
    "system",
    "agent",
    "framework",
    "analyze",
    "strategy",
    "json",
    "schema",
    "architecture",
    "engine",
    "tool",
    "workflow",
    "multi",
  ];

  for (const w of heavyWords) {
    if (input.toLowerCase().includes(w)) {
      score += 1;
    }
  }

  return score;
}
