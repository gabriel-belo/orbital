const ENCRYPTION_PREFIX = 'og:v1'
const PASSWORD_PREFIX = 'ogpwd:v1'
const PASSWORD_ITERATIONS = 120000
const DEMO_SECRET =
  import.meta.env?.VITE_SECURITY_DEMO_KEY ||
  'orbital-guardian-demo-key-use-env-in-production'

function getCryptoApi() {
  const cryptoApi = globalThis.crypto
  if (!cryptoApi?.subtle) {
    throw new Error('Web Crypto API indisponivel neste ambiente.')
  }
  return cryptoApi
}

function encodeBase64(bytes) {
  const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('')
  return btoa(binary)
}

function decodeBase64(value) {
  const binary = atob(value)
  return Uint8Array.from(binary, char => char.charCodeAt(0))
}

async function getEncryptionKey() {
  const cryptoApi = getCryptoApi()
  const secretBytes = new TextEncoder().encode(DEMO_SECRET)
  const digest = await cryptoApi.subtle.digest('SHA-256', secretBytes)

  return cryptoApi.subtle.importKey(
    'raw',
    digest,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  )
}

async function getPasswordKeyMaterial(password) {
  const cryptoApi = getCryptoApi()
  return cryptoApi.subtle.importKey(
    'raw',
    new TextEncoder().encode(`${String(password)}:${DEMO_SECRET}`),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
}

export async function encryptData(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    throw new Error('Valor sensivel obrigatorio para criptografia.')
  }

  const cryptoApi = getCryptoApi()
  const iv = cryptoApi.getRandomValues(new Uint8Array(12))
  const key = await getEncryptionKey()
  const encodedValue = new TextEncoder().encode(String(value))
  const encryptedBuffer = await cryptoApi.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedValue,
  )

  return `${ENCRYPTION_PREFIX}:${encodeBase64(iv)}:${encodeBase64(new Uint8Array(encryptedBuffer))}`
}

export async function decryptData(encryptedValue) {
  if (!encryptedValue || typeof encryptedValue !== 'string') {
    throw new Error('Valor criptografado invalido.')
  }

  const [prefix, version, ivBase64, cipherBase64] = encryptedValue.split(':')
  if (`${prefix}:${version}` !== ENCRYPTION_PREFIX || !ivBase64 || !cipherBase64) {
    throw new Error('Formato de criptografia nao reconhecido.')
  }

  const cryptoApi = getCryptoApi()
  const key = await getEncryptionKey()
  const decryptedBuffer = await cryptoApi.subtle.decrypt(
    { name: 'AES-GCM', iv: decodeBase64(ivBase64) },
    key,
    decodeBase64(cipherBase64),
  )

  return new TextDecoder().decode(decryptedBuffer)
}

export async function createPasswordHash(password) {
  if (!password || String(password).length < 6) {
    throw new Error('Senha invalida para hash.')
  }

  const cryptoApi = getCryptoApi()
  const salt = cryptoApi.getRandomValues(new Uint8Array(16))
  const keyMaterial = await getPasswordKeyMaterial(password)
  const hashBuffer = await cryptoApi.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PASSWORD_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  )

  return `${PASSWORD_PREFIX}:${PASSWORD_ITERATIONS}:${encodeBase64(salt)}:${encodeBase64(new Uint8Array(hashBuffer))}`
}

export async function verifyPasswordHash(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false

  const [prefix, version, iterationsValue, saltBase64, hashBase64] = storedHash.split(':')
  if (`${prefix}:${version}` !== PASSWORD_PREFIX || !iterationsValue || !saltBase64 || !hashBase64) {
    return false
  }

  const cryptoApi = getCryptoApi()
  const keyMaterial = await getPasswordKeyMaterial(password)
  const hashBuffer = await cryptoApi.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: decodeBase64(saltBase64),
      iterations: Number(iterationsValue),
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  )

  return encodeBase64(new Uint8Array(hashBuffer)) === hashBase64
}

export async function createLookupHash(value) {
  const cryptoApi = getCryptoApi()
  const normalized = String(value ?? '').trim().toLowerCase()
  const digest = await cryptoApi.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${normalized}:${DEMO_SECRET}`),
  )

  return encodeBase64(new Uint8Array(digest))
}

export async function exampleCryptoUsage() {
  const originalEmail = 'demo@orbitalguardian.com'
  const encryptedEmail = await encryptData(originalEmail)
  const decryptedEmail = await decryptData(encryptedEmail)
  const passwordHash = await createPasswordHash('senha123')
  const passwordMatches = await verifyPasswordHash('senha123', passwordHash)

  return {
    originalEmail,
    encryptedEmail,
    decryptedEmail,
    passwordHash,
    passwordMatches,
  }
}
