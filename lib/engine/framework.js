export function detectFramework(input) {

  const text = input.toLowerCase()


  const frameworks = {

    agent: [
      "agent",
      "autonomous",
      "tool",
      "multi step",
      "workflow",
    ],

    chain: [
      "step by step",
      "chain",
      "process",
      "pipeline",
    ],

    expert: [
      "expert",
      "professional",
      "advanced",
      "deep",
    ],

    reasoning: [
      "analyze",
      "why",
      "explain",
      "compare",
      "think",
    ],

    system: [
      "system",
      "engine",
      "builder",
      "architecture",
    ],

    json: [
      "json",
      "schema",
      "structured",
      "format",
    ],

    instruction: [
      "write",
      "create",
      "make",
      "generate",
    ],

  }


  for (let f in frameworks) {

    for (let w of frameworks[f]) {

      if (text.includes(w)) {
        return f
      }

    }

  }

  return "instruction"

}
