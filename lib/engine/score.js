export function calculatePromptScore(input, options = {}) {

  const text = input || ""

  let clarity = 0
  let structure = 0
  let specificity = 0
  let aiReadiness = 0
  let optimization = 0

  const words =
    text.split(/\s+/).filter(Boolean).length


  // clarity

  if (words > 5) clarity += 20
  if (words > 10) clarity += 20
  if (words > 20) clarity += 20
  if (words > 40) clarity += 20
  if (words > 60) clarity += 20


  // structure

  if (text.includes("\n")) structure += 20
  if (text.includes(":")) structure += 20
  if (text.includes("-")) structure += 20
  if (text.includes(".")) structure += 20
  if (text.includes(",")) structure += 20


  // specificity

  if (/detay|detail/i.test(text)) specificity += 20
  if (/format/i.test(text)) specificity += 20
  if (/step|adım/i.test(text)) specificity += 20
  if (/structure|yapı/i.test(text)) specificity += 20
  if (/example|örnek/i.test(text)) specificity += 20


  // ai readiness

  if (/ai|prompt/i.test(text)) aiReadiness += 20
  if (/system/i.test(text)) aiReadiness += 20
  if (/instruction/i.test(text)) aiReadiness += 20
  if (/rules/i.test(text)) aiReadiness += 20
  if (/output/i.test(text)) aiReadiness += 20


  // optimization

  if (words > 15) optimization += 20
  if (words > 25) optimization += 20
  if (words > 35) optimization += 20
  if (words > 50) optimization += 20
  if (words > 70) optimization += 20


  clarity = Math.min(100, clarity)
  structure = Math.min(100, structure)
  specificity = Math.min(100, specificity)
  aiReadiness = Math.min(100, aiReadiness)
  optimization = Math.min(100, optimization)


  const total = Math.round(
    (clarity +
      structure +
      specificity +
      aiReadiness +
      optimization) / 5
  )


  let level = "FAST"

  if (total > 40) level = "BALANCED"
  if (total > 60) level = "PRO"
  if (total > 80) level = "ULTRA"


  return {
    total,
    clarity,
    structure,
    specificity,
    ai_readiness: aiReadiness,
    optimization,
    level,
  }

}
