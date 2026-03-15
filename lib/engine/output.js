export function detectOutputType(input) {

  const text = input.toLowerCase()


  const types = {

    json: [
      "json",
      "schema",
      "structured",
      "object",
      "array",
    ],

    code: [
      "code",
      "function",
      "script",
      "api",
      "javascript",
      "python",
    ],

    system: [
      "system prompt",
      "system",
      "engine",
      "builder",
    ],

    agent: [
      "agent",
      "tool",
      "workflow",
      "autonomous",
    ],

    text: [
      "write",
      "story",
      "blog",
      "caption",
      "post",
      "article",
    ],

    prompt: [
      "prompt",
      "ai prompt",
      "gpt prompt",
    ],

  }


  for (let t in types) {

    for (let w of types[t]) {

      if (text.includes(w)) {
        return t
      }

    }

  }

  return "prompt"

}
