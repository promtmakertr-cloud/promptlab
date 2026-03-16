export function autoModeEngine({
  input,
  domain,
  framework,
  output,
  score,
}) {

  let finalScore = score || 0


  if (!finalScore) {

    const length = input.length

    if (length > 300) finalScore += 2
    else if (length > 150) finalScore += 1


    const heavyFrameworks = [
      "agent",
      "system",
      "chain",
      "reasoning",
      "expert",
    ]

    if (heavyFrameworks.includes(framework)) {
      finalScore += 2
    }


    const heavyOutput = [
      "json",
      "code",
      "system",
      "agent",
    ]

    if (heavyOutput.includes(output)) {
      finalScore += 2
    }


    const heavyDomain = [
      "ai",
      "analysis",
      "business",
      "code",
    ]

    if (heavyDomain.includes(domain)) {
      finalScore += 1
    }

  }



  if (finalScore >= 8) {
    return "ULTRA"
  }

  if (finalScore >= 5) {
    return "PRO"
  }

  if (finalScore >= 3) {
    return "BALANCED"
  }

  return "FAST"

}
