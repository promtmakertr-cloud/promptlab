import { calculatePromptScore } from "./score"

export function autoModeEngine({
  input,
  mode,
  domain,
  framework,
  output,
  score,
}) {

  // score yoksa hesapla

  if (!score) {
    score = calculatePromptScore(input)
  }

  const total = score.total


  // USER seçtiyse dokunma

  if (
    mode === "FAST" ||
    mode === "BALANCED" ||
    mode === "PRO" ||
    mode === "ULTRA"
  ) {
    return mode
  }


  // AUTO MODE

  if (total < 40) {
    return "FAST"
  }

  if (total < 60) {
    return "BALANCED"
  }

  if (total < 80) {
    return "PRO"
  }

  return "ULTRA"
}
