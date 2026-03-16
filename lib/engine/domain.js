export function detectDomain(input) {

  if (!input) return "general"

  const text = input.toLowerCase()


  const domains = {

    code: [
      "code",
      "api",
      "function",
      "bug",
      "react",
      "next",
      "javascript",
      "python",
      "typescript",
      "node",
    ],

    ai: [
      "ai",
      "prompt",
      "gpt",
      "model",
      "agent",
      "llm",
      "openai",
      "automation",
      "engine",
    ],

    business: [
      "startup",
      "business",
      "plan",
      "strategy",
      "market",
      "growth",
      "product",
      "company",
    ],

    marketing: [
      "marketing",
      "brand",
      "slogan",
      "campaign",
      "seo",
      "ads",
      "instagram",
      "tiktok",
      "content",
    ],

    writing: [
      "story",
      "write",
      "blog",
      "script",
      "novel",
      "character",
      "dialogue",
      "fiction",
    ],

    analysis: [
      "analyze",
      "compare",
      "review",
      "explain",
      "why",
      "how",
      "research",
      "study",
    ],

    system: [
      "system",
      "architecture",
      "framework",
      "pipeline",
      "workflow",
      "tool",
      "chain",
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
