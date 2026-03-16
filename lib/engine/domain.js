export function detectDomain(input) {

  if (!input) return "general"

  const text = input.toLowerCase()


  const domains = {

    writing: [
      "story",
      "hikaye",
      "karakter",
      "roman",
      "senaryo",
      "script",
      "rpg",
      "oyun",
      "fiction",
    ],

    ai: [
      "ai",
      "prompt",
      "gpt",
      "model",
      "agent",
      "llm",
    ],

    business: [
      "startup",
      "business",
      "plan",
      "strategy",
      "marka",
      "ürün",
    ],

    code: [
      "code",
      "api",
      "function",
      "bug",
      "react",
      "next",
      "javascript",
    ],

    system: [
      "system",
      "engine",
      "framework",
      "pipeline",
      "workflow",
    ],

    analysis: [
      "analyze",
      "analiz",
      "compare",
      "explain",
      "neden",
      "nasıl",
    ],

  }


  for (const key in domains) {

    for (const w of domains[key]) {

      if (text.includes(w)) {
        return key
      }

    }

  }


  return "general"

}
