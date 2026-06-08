import { createContext, useContext, useEffect, useState } from 'react'
import { demoUser } from '../data/orbitalData'
import {
  createLookupHash,
  createPasswordHash,
  decryptData,
  encryptData,
  verifyPasswordHash,
} from '../security/cryptoService'
import { logSecurityEvent } from '../security/auditLogger'

const AuthContext = createContext(null)

const SESSION_KEY = 'nebula_ops_session'
const ACCOUNTS_KEY = 'orbital_guardian_accounts'

function getStoredAccounts() {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveStoredAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function loadStoredOperator() {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (!saved) return null

    const parsed = JSON.parse(saved)
    if (!parsed?.encryptedEmail) return null

    return {
      ...demoUser,
      ...parsed,
      email: 'E-mail protegido',
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [operator, setOperator] = useState(() => loadStoredOperator())

  const logout = () => {
    logSecurityEvent('logout', `Operador ${operator?.id ?? 'desconhecido'} encerrou a sessao.`)
    sessionStorage.removeItem(SESSION_KEY)
    setOperator(null)
  }

  useEffect(() => {
    if (!operator?.encryptedEmail || operator.email !== 'E-mail protegido') return

    decryptData(operator.encryptedEmail)
      .then(email => {
        setOperator(current => current ? { ...current, email } : current)
        logSecurityEvent('dado_sensivel_descriptografado', 'E-mail do operador descriptografado em memoria para exibicao.')
      })
      .catch(() => {
        logSecurityEvent('erro_descriptografia', 'Nao foi possivel descriptografar o e-mail salvo na sessao.')
        sessionStorage.removeItem(SESSION_KEY)
        setOperator(null)
      })
  }, [operator?.encryptedEmail, operator?.email])

  const persistSession = (op, encryptedEmail) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      id: op.id,
      name: op.name,
      profile: op.profile,
      encryptedEmail,
    }))

    setOperator({
      ...op,
      encryptedEmail,
    })
  }

  const login = async (data = {}) => {
    const sensitiveEmail = data.email || demoUser.email
    const emailLookupHash = await createLookupHash(sensitiveEmail)
    const account = getStoredAccounts().find(item => item.emailLookupHash === emailLookupHash)

    if (data.password && account) {
      const passwordMatches = await verifyPasswordHash(data.password, account.passwordHash)
      if (!passwordMatches) {
        logSecurityEvent('login_negado', 'Tentativa de login com senha invalida.')
        throw new Error('AUTH_INVALID_CREDENTIALS')
      }

      const decryptedEmail = await decryptData(account.encryptedEmail)
      const op = {
        id: account.id,
        name: account.name,
        profile: account.profile,
        email: decryptedEmail,
      }

      persistSession(op, account.encryptedEmail)
      logSecurityEvent('dado_sensivel_descriptografado', 'E-mail de conta local descriptografado em memoria para login.')
      logSecurityEvent('login_realizado', `Login local realizado para operador ${op.id}.`)
      return op
    }

    if (data.password && sensitiveEmail.toLowerCase() !== demoUser.email.toLowerCase()) {
      logSecurityEvent('login_negado', 'Tentativa de login com conta local inexistente.')
      throw new Error('AUTH_ACCOUNT_NOT_FOUND')
    }

    const encryptedEmail = await encryptData(sensitiveEmail)
    const op = {
      ...demoUser,
      id: data.id || demoUser.id,
      email: sensitiveEmail,
    }

    persistSession(op, encryptedEmail)
    logSecurityEvent('dado_sensivel_criptografado', 'E-mail do operador criptografado antes de salvar na sessao local.')
    logSecurityEvent('login_realizado', `Login local realizado para operador ${op.id}.`)
    return op
  }

  const register = async (data = {}) => {
    const sensitiveEmail = data.email
    const emailLookupHash = await createLookupHash(sensitiveEmail)
    const accounts = getStoredAccounts()

    if (accounts.some(item => item.emailLookupHash === emailLookupHash)) {
      logSecurityEvent('cadastro_negado', 'Tentativa de criar conta com e-mail ja cadastrado.')
      throw new Error('AUTH_ACCOUNT_EXISTS')
    }

    const encryptedEmail = await encryptData(sensitiveEmail)
    const passwordHash = await createPasswordHash(data.password)
    const op = {
      id: `OP-${Date.now().toString().slice(-6)}`,
      name: data.name,
      profile: 'Operador',
      email: sensitiveEmail,
    }

    saveStoredAccounts([
      ...accounts,
      {
        id: op.id,
        name: op.name,
        profile: op.profile,
        emailLookupHash,
        encryptedEmail,
        passwordHash,
        createdAt: new Date().toISOString(),
      },
    ])

    persistSession(op, encryptedEmail)
    logSecurityEvent('conta_criada', `Conta local criada para operador ${op.id}.`)
    logSecurityEvent('dado_sensivel_criptografado', 'E-mail da nova conta criptografado no cadastro local.')
    logSecurityEvent('login_realizado', `Login automatico realizado apos cadastro do operador ${op.id}.`)
    return op
  }

  return (
    <AuthContext.Provider value={{ operator, login, logout, register, isAuthenticated: !!operator }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
