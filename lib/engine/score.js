export function calculateScore({
  input,
  domain,
  framework,
  output,
}) {

  let score = 0


  const length = input.length

  if (length > 300) score += 2
  else if (length > 150) score += 1


  const heavyDomains = [
    "code",
    "ai",
    "analysis",
    "business",
  ]

  if (heavyDomains.includes(domain)) {
    score += 2
  }


  const heavyFrameworks = [
    "agent",
    "system",
    "reasoning",
    "chain",
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


  const words = input.split(" ")

  if (words.length > 20) {
    score += 1
  }


  return score

}
