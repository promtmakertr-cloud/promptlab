import { calculateScore } from "./score"

export function autoModeEngine({
  input,
  mode,
  domain,
  framework,
  output,
}) {

  if (mode && mode !== "AUTO") {
    return mode
  }

  const score = calculateScore({
    input,
    domain,
    framework,
    output,
  })


  if (score >= 8) {
    return "ULTRA"
  }

  if (score >= 5) {
    return "PRO"
  }

  if (score >= 3) {
    return "BALANCED"
  }

  return "FAST"

}
