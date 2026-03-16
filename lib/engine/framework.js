export function detectFramework(input) {

  if (!input) return "instruction"

  const text = input.toLowerCase()


  const frameworks = {

    agent: [
      "agent",
      "tool",
      "workflow",
    ],

    chain: [
      "step",
      "adım",
      "process",
      "pipeline",
    ],

    system: [
      "system",
      "engine",
      "architecture",
    ],

    reasoning: [
      "why",
      "neden",
      "explain",
      "analyze",
    ],

    json: [
      "json",
      "schema",
      "format",
    ],

    instruction: [
      "write",
      "yaz",
      "oluştur",
      "create",
      "make",
      "generate",
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
