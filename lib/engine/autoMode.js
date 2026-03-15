export function autoModeEngine({
  input,
  mode,
}) {

  if (mode && mode !== "AUTO") {
    return mode
  }

  const length = input.length

  let score = 0


  // length

  if (length > 300) score += 2
  else if (length > 150) score += 1


  // multi word

  if (input.split(" ").length > 20) {
    score += 1
  }


  // keywords

  const heavyWords = [
    "system",
    "agent",
    "framework",
    "analyze",
    "build",
    "strategy",
    "multi",
    "chain",
    "tool",
    "reasoning",
  ]

  for (let w of heavyWords) {
    if (input.toLowerCase().includes(w)) {
      score += 1
    }
  }


  // decision

  if (score >= 4) {
    return "PRO"
  }

  if (score >= 2) {
    return "BALANCED"
  }

  return "FAST"

}
