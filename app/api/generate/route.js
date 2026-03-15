function frameworkPrompt() {
  return `
Intent'e göre framework seç

Birden fazla framework seçebilirsin.

marketing →
AIDA
PAS
SWOT
STP
StoryBrand

business →
SWOT
ROI
Financial analysis
Cashflow
Budgeting
Cost optimization
Table output

sales →
Objection handling
Closing
Persuasion
AIDA
PAS

software →
Architecture
Design patterns
Clean code
API structure

image →
Camera
Lighting
Lens
Render engine

writing →
Story structure
Tone control

academic →
Analysis
Citation

video →
Story structure
Shot list
Tone control

general →
Depends on context

JSON ver

{
frameworks:[]
}
`;
}
