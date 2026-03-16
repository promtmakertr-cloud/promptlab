export function autoModeEngine({
  input,
  domain,
  framework,
  output,
  score,
  requestedMode,
}) {

  let finalScore = score || 0


  // SAFETY SCORE BUILD

  if (!finalScore) {

    const length = input.length

    if (length > 400) finalScore += 3
    else if (length > 250) finalScore += 2
    else if (length > 120) finalScore += 1


    const heavyFrameworks = [
      "agent",
      "chain",
      "system",
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
      "writing",
    ]

    if (heavyDomain.includes(domain)) {
      finalScore += 1
    }

  }



  // SCORE → MODE

  let autoMode = "FAST"

  if (finalScore >= 8) autoMode = "ULTRA"
  else if (finalScore >= 5) autoMode = "PRO"
  else if (finalScore >= 3) autoMode = "BALANCED"
  else autoMode = "FAST"



  // 🔴 MODE GUARD SYSTEM

  if (!requestedMode || requestedMode === "AUTO") {
    return autoMode
  }


  // FAST is always allowed

  if (requestedMode === "FAST") {
    return "FAST"
  }


  // BALANCED allowed if score >=3

  if (requestedMode === "BALANCED") {
    if (finalScore >= 3) return "BALANCED"
    return "FAST"
  }


  // PRO allowed if score >=5

  if (requestedMode === "PRO") {
    if (finalScore >= 5) return "PRO"
    if (finalScore >= 3) return "BALANCED"
    return "FAST"
  }


  // ULTRA allowed if score >=8

  if (requestedMode === "ULTRA") {
    if (finalScore >= 8) return "ULTRA"
    if (finalScore >= 5) return "PRO"
    if (finalScore >= 3) return "BALANCED"
    return "FAST"
  }


  return autoMode

}
