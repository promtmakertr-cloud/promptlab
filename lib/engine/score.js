export function calculatePromptScoreV2(
  input,
  domain,
  framework,
  output
) {

  let score = 0

  if (!input) return 0


  const length = input.length

  if (length > 400) score += 3
  else if (length > 250) score += 2
  else if (length > 120) score += 1


  const words = input.split(" ")

  if (words.length > 20) score += 1


  const heavyDomains = [
    "writing",
    "ai",
    "analysis",
    "business",
    "code",
    "system",
  ]

  if (heavyDomains.includes(domain)) {
    score += 2
  }


  const heavyFrameworks = [
    "agent",
    "chain",
    "system",
    "reasoning",
    "expert",
  ]

  if (heavyFrameworks.includes(framework)) {
    score += 2
  }


  const heavyOutput = [
    "json",
    "code",
    "system",
    "agent",
    "prompt",
  ]

  if (heavyOutput.includes(output)) {
    score += 2
  }


  return score

}
