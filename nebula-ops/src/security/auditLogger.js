const SECURITY_LOG_KEY = 'orbital_guardian_security_audit'
const MAX_EVENTS = 80

export function getSecurityEvents() {
  try {
    const stored = sessionStorage.getItem(SECURITY_LOG_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function logSecurityEvent(eventType, description) {
  const event = {
    id: `SEC-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    eventType,
    description,
    timestamp: new Date().toISOString(),
  }

  const events = [event, ...getSecurityEvents()].slice(0, MAX_EVENTS)

  try {
    sessionStorage.setItem(SECURITY_LOG_KEY, JSON.stringify(events))
  } catch {
    // O console ainda serve como evidencia caso o armazenamento local falhe.
  }

  console.info('[SecurityAudit]', event)
  return event
}

