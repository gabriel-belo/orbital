import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message ?? 'Erro inesperado na aplicacao.',
    }
  }

  componentDidCatch(error, info) {
    console.error('[AppErrorBoundary]', error, info)
  }

  handleReset = () => {
    sessionStorage.clear()
    localStorage.removeItem('orbital_guardian_accounts')
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl border border-[#E74C3C]/40 bg-[#151B2E] p-6 shadow-2xl">
          <p className="font-heading font-semibold text-lg">Erro ao carregar o app</p>
          <p className="text-[#AAB2C8] text-sm mt-2">
            O estado local do navegador pode estar antigo ou corrompido depois da atualizacao.
          </p>
          <p className="text-[#ffcbc3] text-xs mt-4 break-all">{this.state.message}</p>
          <button
            type="button"
            onClick={this.handleReset}
            className="w-full mt-5 bg-[#E74C3C]/20 hover:bg-[#E74C3C]/30 border border-[#E74C3C]/40 text-[#ffcbc3] font-heading font-semibold tracking-widest text-xs py-3 rounded-lg transition-all"
          >
            LIMPAR SESSAO LOCAL E REABRIR
          </button>
        </div>
      </div>
    )
  }
}

