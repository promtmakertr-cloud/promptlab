export function calculatePromptScore(
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

  if (words.length > 25) score += 1



  const heavyDomains = [
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
  ]

  if (heavyOutput.includes(output)) {
    score += 2
  }



  const heavyWords = [
    "architecture",
    "engine",
    "framework",
    "advanced",
    "multi",
    "tool",
    "workflow",
    "optimize",
    "analysis",
  ]

  for (const w of heavyWords) {
    if (input.toLowerCase().includes(w)) {
      score += 1
    }
  }



  return score

}
