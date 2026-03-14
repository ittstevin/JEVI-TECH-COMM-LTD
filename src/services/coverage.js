const supportedAreas = ['downtown', 'midtown', 'uptown', 'riverside', 'seaside']

export function checkCoverage(location) {
  const normalized = (location || '').trim().toLowerCase()
  const available = supportedAreas.some((area) => normalized.includes(area))
  const message = available
    ? "Great news! We have service in your area."
    : "Sorry, it looks like we don't currently serve your area."

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({ available, message })
    }, 700)
  })
}
