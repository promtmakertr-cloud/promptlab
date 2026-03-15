export function detectDomain(input) {

  const text = input.toLowerCase()


  const domains = {

    code: [
      "code",
      "javascript",
      "python",
      "react",
      "next",
      "api",
      "bug",
      "fix",
      "function",
      "error",
    ],

    marketing: [
      "marketing",
      "ads",
      "instagram",
      "tiktok",
      "seo",
      "campaign",
      "brand",
      "slogan",
      "content",
    ],

    business: [
      "startup",
      "business",
      "plan",
      "strategy",
      "idea",
      "market",
      "growth",
    ],

    ai: [
      "ai",
      "agent",
      "prompt",
      "gpt",
      "llm",
      "model",
      "openai",
      "automation",
    ],

    writing: [
      "write",
      "story",
      "blog",
      "article",
      "text",
      "script",
      "caption",
    ],

    analysis: [
      "analyze",
      "compare",
      "review",
      "explain",
      "why",
      "how",
    ],

  }


  for (let domain in domains) {

    for (let word of domains[domain]) {

      if (text.includes(word)) {
        return domain
      }

    }

  }


  return "general"

}
