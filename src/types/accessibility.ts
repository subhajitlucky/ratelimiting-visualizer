// Accessibility utilities and constants

export const ACCESSIBILITY_CONFIG = {
  focusVisibleClass: 'ring-2 ring-primary-500 ring-offset-2',
  skipLinkTargetId: 'main-content',
}

export const ARIA_LABELS = {
  navigation: 'Main navigation',
  themeToggle: 'Toggle dark/light mode',
  algorithmSelector: 'Select rate limiting algorithm',
  parameterSlider: 'Adjust parameter value',
  playPauseButton: 'Start or stop simulation',
  resetButton: 'Reset simulation to initial state',
  requestLog: 'List of recent request events',
  visualization: 'Rate limiting algorithm visualization',
  statistics: 'Simulation statistics',
}

export const getAriaLive = (priority: 'polite' | 'assertive' = 'polite') => ({
  'aria-live': priority,
  'aria-atomic': 'true',
  'aria-busy': 'false',
})