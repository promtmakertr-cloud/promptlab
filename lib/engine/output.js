export function detectOutputType(input) {
  const text = input.toLowerCase();

  const map = {
    json: ["json", "schema"],
    code: ["code", "function", "script"],
    prompt: ["prompt"],
    text: ["write", "story", "article"],
    system: ["system prompt"],
  };

  for (const key in map) {
    for (const w of map[key]) {
      if (text.includes(w)) return key;
    }
  }

  return "prompt";
}
