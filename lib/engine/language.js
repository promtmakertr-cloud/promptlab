export function detectLanguage(input) {

  const text = input.toLowerCase()

  const trWords = [
    "bir",
    "ve",
    "için",
    "olan",
    "nasıl",
    "neden",
    "hikaye",
    "karakter",
    "marka",
    "öner",
    "oluştur",
    "yaz",
    "anlat",
  ]

  let score = 0

  for (let w of trWords) {
    if (text.includes(w)) {
      score++
    }
  }

  if (score >= 2) {
    return "tr"
  }

  return "en"

}
