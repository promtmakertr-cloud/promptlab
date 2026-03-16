export function detectLanguage(input) {
  if (!input) return "English";

  const text = input.toLowerCase();

  const trWords = [
    "bir",
    "ve",
    "için",
    "nasıl",
    "neden",
    "hikaye",
    "marka",
    "öner",
    "oluştur",
    "yaz",
    "anlat",
  ];

  let score = 0;

  for (const w of trWords) {
    if (text.includes(w)) score++;
  }

  if (score >= 2) return "Turkish";

  return "English";
}
