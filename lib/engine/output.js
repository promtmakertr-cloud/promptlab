export function detectOutputType(input) {

  if (!input) return "prompt"

  const text = input.toLowerCase()


  const types = {

    json: [
      "json",
      "schema",
      "structured",
      "object",
      "array",
      "format json",
    ],

    code: [
      "code",
      "function",
      "script",
      "api",
      "javascript",
      "python",
      "typescript",
      "program",
    ],

    system: [
      "system prompt",
      "system",
      "engine",
      "builder",
      "architecture",
    ],

    agent: [
      "agent",
      "tool",
      "workflow",
      "autonomous",
      "planner",
    ],

    text: [
      "write",
      "story",
      "blog",
      "article",
      "script",
      "text",
      "novel",
    ],

    prompt: [
      "prompt",
      "ai prompt",
      "gpt prompt",
    ],

    plan: [
      "plan",
      "roadmap",
      "strategy",
      "steps",
    ],

    analysis: [
      "analysis",
      "analyze",
      "compare",
      "review",
      "explain",
    ],

    tool: [
      "tool",
      "function",
      "call",
      "plugin",
    ],

  }


  for (const key in types) {

    for (const w of types[key]) {

      if (text.includes(w)) {
        return key
      }

    }

  }


  return "prompt"

}
