export function detectDomain(input) {
  const text = input.toLowerCase();

  const map = {
    code: ["code", "api", "function", "bug", "react", "next"],
    marketing: ["marketing", "brand", "slogan", "campaign"],
    business: ["startup", "business", "plan", "strategy"],
    ai: ["ai", "prompt", "gpt", "model", "agent"],
    writing: ["story", "write", "blog", "script"],
    analysis: ["analyze", "compare", "review"],
  };

  for (const key in map) {
    for (const w of map[key]) {
      if (text.includes(w)) return key;
    }
  }

  return "general";
}
