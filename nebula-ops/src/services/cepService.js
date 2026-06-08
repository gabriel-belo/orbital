const CEP_URL = 'https://viacep.com.br/ws'

export async function getAddressByCep(rawCep) {
  const cep = String(rawCep).replace(/\D/g, '')

  if (!/^\d{8}$/.test(cep)) {
    throw new Error('CEP_INVALID')
  }

  const response = await fetch(`${CEP_URL}/${cep}/json/`)
  if (!response.ok) {
    throw new Error('CEP_REQUEST_FAILED')
  }

  const data = await response.json()
  if (data.erro) {
    throw new Error('CEP_NOT_FOUND')
  }

  return {
    cep: data.cep,
    logradouro: data.logradouro || '',
    bairro: data.bairro || '',
    city: data.localidade || '',
    state: data.uf || '',
    stateName: data.estado || '',
    ibge: data.ibge || '',
  }
}
