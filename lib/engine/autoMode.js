// lib/engine/autoMode.js

export function autoModeEngine({
  input,
  intent,
  framework,
  variables,
}) {
  const length = input.length

  const variableCount = variables?.length || 0

  let complexityScore = 0

  if (length > 300) complexityScore += 2
  else if (length > 150) complexityScore += 1

  const complexIntents = [
    "build",
    "analyze",
    "strategy",
    "system",
    "agent",
    "code",
    "multi",
  ]

  if (complexIntents.includes(intent)) {
    complexityScore += 2
  }

  const heavyFrameworks = [
    "chain",
    "agent",
    "expert",
    "system",
    "reasoning",
  ]

  if (heavyFrameworks.includes(framework)) {
    complexityScore += 2
  }

  if (variableCount > 3) {
    complexityScore += 2
  } else if (variableCount > 1) {
    complexityScore += 1
  }

  if (complexityScore >= 4) {
    return "PRO"
  }

  if (complexityScore >= 2) {
    return "BALANCED"
  }

  return "FAST"
}
