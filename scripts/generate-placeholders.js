import fs from 'fs'
import path from 'path'

const screenshotDir = './public/screenshots'

const placeholders = [
  'energy-dashboard.png',
  'climate-controls.png',
  'guest-app.png',
  'operations-dashboard.png',
  'maintenance-alerts.png',
  'device-management.png',
  'integrations.png'
]

// Ensure directory exists
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true })
}

// Create placeholder SVGs as PNG stand-ins
placeholders.forEach(filename => {
  const filepath = path.join(screenshotDir, filename)
  if (!fs.existsSync(filepath)) {
    // Create a simple placeholder text file (user will replace with real screenshots)
    fs.writeFileSync(
      filepath.replace('.png', '.txt'),
      `Placeholder for ${filename}\n\nReplace this with your actual screenshot.`
    )
    console.log(`Created placeholder note for: ${filename}`)
  }
})

console.log('\nTo complete the tour, replace placeholder files with actual screenshots.')
console.log('Screenshot files needed:', placeholders)
