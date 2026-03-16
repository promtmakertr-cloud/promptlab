export function detectFramework(input) {
  const text = input.toLowerCase();

  const map = {
    agent: ["agent", "tool", "workflow"],
    chain: ["step", "process", "pipeline"],
    system: ["system", "engine", "architecture"],
    json: ["json", "schema", "format"],
    reasoning: ["why", "analyze", "explain"],
  };

  for (const key in map) {
    for (const w of map[key]) {
      if (text.includes(w)) return key;
    }
  }

  return "instruction";
}
