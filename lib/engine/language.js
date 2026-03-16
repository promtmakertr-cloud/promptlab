export function detectLanguage(input) {

  if (!input) return "English"

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
    "nedir",
    "nasıl yapılır",
    "hikayesi",
  ]


  const enWords = [
    "the",
    "and",
    "for",
    "create",
    "write",
    "story",
    "character",
    "build",
    "make",
    "explain",
    "generate",
    "prompt",
  ]


  let trScore = 0
  let enScore = 0


  for (const w of trWords) {
    if (text.includes(w)) trScore++
  }


  for (const w of enWords) {
    if (text.includes(w)) enScore++
  }


  if (trScore > enScore) {
    return "Turkish"
  }


  if (enScore > trScore) {
    return "English"
  }


  // fallback

  if (/[çğıöşü]/.test(text)) {
    return "Turkish"
  }


  return "English"

}
