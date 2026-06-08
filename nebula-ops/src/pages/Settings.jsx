import { useState } from 'react'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'

export default function Settings() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <AppLayout title="CONFIGURACOES">
      <div className="p-4 md:p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-heading font-semibold text-xl text-white">Configuracoes</h1>
            <p className="text-[#AAB2C8] text-sm">Preferencias locais do prototipo e parametros de exibicao.</p>
          </div>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Icon name={saved ? 'check' : 'save'} size={14} />
            {saved ? 'Salvo' : 'Salvar'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <p className="label-caps text-[#AAB2C8] mb-3">Monitoramento</p>
            <div className="space-y-3 text-sm text-[#AAB2C8]">
              <label className="flex items-center justify-between gap-3">
                Atualizacao visual automatica
                <input type="checkbox" defaultChecked />
              </label>
              <label className="flex items-center justify-between gap-3">
                Destaque para sensores criticos
                <input type="checkbox" defaultChecked />
              </label>
              <label className="flex items-center justify-between gap-3">
                Exibir apenas tema escuro
                <input type="checkbox" defaultChecked />
              </label>
            </div>
          </div>

          <div className="glass-card p-4">
            <p className="label-caps text-[#AAB2C8] mb-3">Perfil da demonstracao</p>
            <div className="space-y-3 text-sm text-[#AAB2C8]">
              <p>Idioma principal: PT-BR</p>
              <p>Modo de operacao: Dados simulados</p>
              <p>Integrações reais: desativadas</p>
              <p>Versao exibida: 1.0 academica</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
