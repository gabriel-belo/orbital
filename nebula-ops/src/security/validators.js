const SCRIPT_BLOCK_PATTERN = /<script[\s\S]*?>[\s\S]*?<\/script>/gi
const HTML_TAG_PATTERN = /<\/?[^>]+(>|$)/g
const SCRIPT_PATTERN = /script/gi
const DANGEROUS_CHARS = /[<>{}"'`;]/g

export function validateRequired(value) {
  const valid = value !== null && value !== undefined && String(value).trim().length > 0
  return {
    valid,
    message: valid ? '' : 'Campo obrigatorio.',
  }
}

export function validateEmail(email) {
  const required = validateRequired(email)
  if (!required.valid) return required

  const normalized = String(email).trim()
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalized)

  return {
    valid,
    message: valid ? '' : 'Informe um e-mail valido.',
  }
}

export function validatePassword(password, minLength = 6) {
  const required = validateRequired(password)
  if (!required.valid) return required

  const valid = String(password).length >= minLength
  return {
    valid,
    message: valid ? '' : `A senha deve ter pelo menos ${minLength} caracteres.`,
  }
}

export function validateMaxLength(value, max) {
  const normalized = String(value ?? '')
  const valid = normalized.length <= max

  return {
    valid,
    message: valid ? '' : `O campo deve ter no maximo ${max} caracteres.`,
  }
}

export function sanitizeText(value) {
  return String(value ?? '')
    .replace(SCRIPT_BLOCK_PATTERN, '')
    .replace(HTML_TAG_PATTERN, '')
    .replace(SCRIPT_PATTERN, '')
    .replace(DANGEROUS_CHARS, '')
    .trim()
}

export function validateSafeText(value, max = 240) {
  const sanitized = sanitizeText(value)
  const required = validateRequired(sanitized)
  if (!required.valid) return { ...required, sanitized }

  const maxLength = validateMaxLength(sanitized, max)
  return {
    ...maxLength,
    sanitized,
  }
}
