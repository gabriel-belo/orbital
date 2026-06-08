import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon'
import { logSecurityEvent } from '../security/auditLogger'
import { sanitizeText, validateEmail, validateMaxLength, validatePassword, validateRequired } from '../security/validators'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const finishAuth = async (action, payload) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 700))
      await action(payload)
      navigate('/dashboard')
    } catch (err) {
      if (err.message === 'AUTH_INVALID_CREDENTIALS') {
        setError('E-mail ou senha invalidos.')
      } else if (err.message === 'AUTH_ACCOUNT_NOT_FOUND') {
        setError('Conta nao encontrada. Crie uma conta ou use o acesso demonstracao.')
      } else if (err.message === 'AUTH_ACCOUNT_EXISTS') {
        setError('Ja existe uma conta local com este e-mail.')
      } else {
        setError('Nao foi possivel iniciar a sessao segura.')
      }
      logSecurityEvent('erro_login', 'Falha no fluxo seguro de autenticacao local.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const safeEmail = sanitizeText(email)
    const requiredEmail = validateRequired(safeEmail)
    const requiredPassword = validateRequired(password)
    const emailValidation = validateEmail(safeEmail)
    const passwordValidation = validatePassword(password)
    const emailLength = validateMaxLength(safeEmail, 120)
    const safeName = sanitizeText(name)
    const requiredName = mode === 'register' ? validateRequired(safeName) : { valid: true, message: '' }
    const nameLength = mode === 'register' ? validateMaxLength(safeName, 80) : { valid: true, message: '' }

    const firstError = [
      requiredName,
      nameLength,
      requiredEmail,
      requiredPassword,
      emailValidation,
      passwordValidation,
      emailLength,
    ].find(result => !result.valid)

    if (firstError) {
      setError(firstError.message)
      logSecurityEvent('erro_validacao', `Tentativa de login bloqueada: ${firstError.message}`)
      return
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('As senhas informadas nao conferem.')
      logSecurityEvent('erro_validacao', 'Tentativa de cadastro bloqueada por confirmacao de senha divergente.')
      return
    }

    setError('')
    if (mode === 'register') {
      finishAuth(register, { name: safeName, email: safeEmail, password })
      return
    }

    finishAuth(login, { email: safeEmail, password })
  }

  const handleDemo = () => {
    setError('')
    finishAuth(login, {})
  }

  const toggleMode = () => {
    setMode(current => (current === 'login' ? 'register' : 'login'))
    setError('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#4F8CFF 1px, transparent 1px), linear-gradient(90deg, #4F8CFF 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-[#4F8CFF]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-[380px]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full bg-[#151B2E] border border-[#4F8CFF]/30 flex items-center justify-center shadow-[0_0_30px_#4F8CFF22]">
              <Icon name="satellite_alt" size={38} className="text-[#4F8CFF]" />
            </div>
          </div>
          <h1 className="font-heading font-semibold text-2xl text-white tracking-tight mb-1">
            Orbital Guardian
          </h1>
          <p className="text-[#AAB2C8] text-xs font-heading tracking-wider">
            {mode === 'register' ? 'Criacao de conta local segura' : 'Central operacional de monitoramento ambiental'}
          </p>
        </div>

        <div className="glass-card p-6 shadow-2xl">
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-[#E74C3C]/10 border border-[#E74C3C]/30 rounded-lg flex items-center gap-2">
              <Icon name="error" size={16} className="text-[#E74C3C] shrink-0" />
              <p className="text-[#ffcbc3] text-xs">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' ? (
              <div>
                <label className="block label-caps text-[#AAB2C8] mb-2 text-[10px]">Nome do operador</label>
                <div className="relative">
                  <Icon name="person" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAB2C8]" />
                  <input
                    type="text"
                    value={name}
                    onChange={event => setName(event.target.value)}
                    placeholder="Seu nome"
                    autoComplete="name"
                    className="w-full bg-[#0B1020]/70 border border-[#3a494b] focus:border-[#4F8CFF]/70 rounded-lg py-3 pl-9 pr-4 text-white text-sm placeholder-[#3a494b] outline-none transition-colors"
                  />
                </div>
              </div>
            ) : null}

            <div>
              <label className="block label-caps text-[#AAB2C8] mb-2 text-[10px]">E-mail</label>
              <div className="relative">
                <Icon name="mail" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAB2C8]" />
                <input
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="demo@orbitalguardian.com"
                  autoComplete="username"
                  className="w-full bg-[#0B1020]/70 border border-[#3a494b] focus:border-[#4F8CFF]/70 rounded-lg py-3 pl-9 pr-4 text-white text-sm placeholder-[#3a494b] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block label-caps text-[#AAB2C8] mb-2 text-[10px]">Senha</label>
              <div className="relative">
                <Icon name="lock" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAB2C8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#0B1020]/70 border border-[#3a494b] focus:border-[#4F8CFF]/70 rounded-lg py-3 pl-9 pr-11 text-white text-sm placeholder-[#3a494b] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(value => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAB2C8] hover:text-white transition-colors"
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={17} />
                </button>
              </div>
            </div>

            {mode === 'register' ? (
              <div>
                <label className="block label-caps text-[#AAB2C8] mb-2 text-[10px]">Confirmar senha</label>
                <div className="relative">
                  <Icon name="lock_reset" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAB2C8]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={event => setConfirmPassword(event.target.value)}
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    className="w-full bg-[#0B1020]/70 border border-[#3a494b] focus:border-[#4F8CFF]/70 rounded-lg py-3 pl-9 pr-4 text-white text-sm placeholder-[#3a494b] outline-none transition-colors"
                  />
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4F8CFF]/20 hover:bg-[#4F8CFF]/30 border border-[#4F8CFF]/40 text-[#4F8CFF] font-heading font-semibold tracking-[0.12em] text-xs py-3.5 rounded-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border border-[#4F8CFF]/60 border-t-[#4F8CFF] rounded-full animate-spin" />
                  {mode === 'register' ? 'CRIANDO...' : 'ENTRANDO...'}
                </>
              ) : (
                mode === 'register' ? 'CRIAR CONTA' : 'ENTRAR'
              )}
            </button>
          </form>

          <button
            type="button"
            disabled={loading}
            onClick={toggleMode}
            className="w-full mt-3 btn-ghost py-3 text-[10px]"
          >
            {mode === 'register' ? 'JA TENHO CONTA' : 'CRIAR CONTA'}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleDemo}
            className="w-full mt-3 btn-ghost py-3 text-[10px]"
          >
            ACESSAR DEMONSTRACAO
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2.5">
          <div className="relative flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-ping opacity-60" />
          </div>
          <span className="label-caps text-[#AAB2C8] text-[10px]">AMBIENTE LOCAL SIMULADO</span>
        </div>
      </div>
    </div>
  )
}
