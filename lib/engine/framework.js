export function detectFramework(input) {

  if (!input) return "instruction"

  const text = input.toLowerCase()


  const frameworks = {

    agent: [
      "agent",
      "autonomous",
      "tool",
      "workflow",
      "multi step",
      "planner",
      "executor",
    ],

    chain: [
      "step",
      "steps",
      "process",
      "pipeline",
      "chain",
      "sequence",
    ],

    system: [
      "system",
      "engine",
      "architecture",
      "framework",
      "builder",
      "platform",
    ],

    reasoning: [
      "why",
      "analyze",
      "explain",
      "compare",
      "think",
      "reason",
      "logic",
    ],

    expert: [
      "expert",
      "advanced",
      "professional",
      "deep",
      "detailed",
    ],

    json: [
      "json",
      "schema",
      "structured",
      "format",
      "object",
      "array",
    ],

    tool: [
      "tool",
      "function",
      "call",
      "api",
      "plugin",
    ],

    instruction: [
      "write",
      "create",
      "make",
      "generate",
      "build",
    ],

  }


  for (const key in frameworks) {

    for (const w of frameworks[key]) {

      if (text.includes(w)) {
        return key
      }

    }

  }


  return "instruction"

}
