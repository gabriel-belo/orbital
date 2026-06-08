import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'

export default function OperatorProfile() {
  const { operator, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppLayout title="PERFIL">
      <div className="p-4 md:p-6 max-w-3xl">
        <div className="glass-card p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#151B2E] border border-[#4F8CFF]/30 flex items-center justify-center">
              <Icon name="person" size={30} className="text-[#4F8CFF]" />
            </div>
            <div>
              <p className="label-caps text-[#AAB2C8] mb-1">Operador logado</p>
              <h1 className="font-heading font-bold text-2xl text-white">{operator?.name}</h1>
              <p className="text-[#AAB2C8] text-sm mt-1">{operator?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Perfil', value: operator?.profile },
              { label: 'ID', value: operator?.id },
              { label: 'Ambiente', value: 'Prototipo v1.0' },
            ].map(item => (
              <div key={item.label} className="bg-[#0B1020]/60 border border-[#3a494b]/40 rounded-lg p-3">
                <p className="label-caps text-[9px] text-[#AAB2C8] mb-1">{item.label}</p>
                <p className="text-white text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 mb-4">
          <p className="label-caps text-[#AAB2C8] mb-3">Evidencia de criptografia</p>
          <div className="space-y-3 text-sm text-[#AAB2C8]">
            <p><span className="text-white">E-mail descriptografado em memoria:</span> {operator?.email}</p>
            <div>
              <p className="text-white mb-1">E-mail criptografado na sessao:</p>
              <p className="break-all rounded-lg border border-[#3a494b]/40 bg-[#0B1020]/60 p-3 text-[11px] leading-relaxed">
                {operator?.encryptedEmail ?? 'Sessao sem campo criptografado.'}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 mb-4">
          <p className="label-caps text-[#AAB2C8] mb-3">Informacoes do app</p>
          <div className="space-y-2 text-sm text-[#AAB2C8]">
            <p><span className="text-white">Aplicativo:</span> Orbital Guardian</p>
            <p><span className="text-white">Versao:</span> Prototipo funcional 1.0</p>
            <p><span className="text-white">Uso:</span> Demonstracao academica FIAP Global Solution</p>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-[#E74C3C]/20 hover:bg-[#E74C3C]/30 border border-[#E74C3C]/40 text-[#ffcbc3] font-heading font-semibold tracking-widest text-xs py-3.5 rounded-xl transition-all">
          <Icon name="logout" size={16} />
          SAIR DO APP
        </button>
      </div>
    </AppLayout>
  )
}
