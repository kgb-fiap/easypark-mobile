export interface Endereco {
    id: number;
    cep: string;
    logradouro: string;
    numero: string;
    latitude: number;
    longitude: number;
}

// 2. Tipagem nova da Operadora
export interface Operadora {
    id: number;
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    telefone: string;
}

// 3. Tipagem exata do Estacionamento
export interface EstacionamentoAPI {
    id: number;
    nome: string;
    operadoraId: number;
    operadora: Operadora;
    enderecoId: number;
    endereco: Endereco;
    totalVagas: number;
    esperaMinutos: number;
    toleranciaMinutos: number;
}

// 4. A MÁGICA AQUI: Criamos a tipagem do "Envelope" da Azure
export interface EstacionamentoResponse {
    content: EstacionamentoAPI[]; // A nossa lista real está aqui dentro!
}

const API_URL = 'https://api-easypark-agh6f3dugbemcfbh.brazilsouth-01.azurewebsites.net';

export const fetchEstacionamentos = async (): Promise<EstacionamentoAPI[]> => {
    const response = await fetch(`${API_URL}/estacionamentos`);
    
    if (!response.ok) {
        throw new Error('Falha ao buscar estacionamentos da API');
    }
    
    // Pegamos a resposta completa (o envelope)
    const data: EstacionamentoResponse = await response.json();
    
    // Retornamos APENAS a gaveta "content". 
    // Se vier vazio por algum motivo, garantimos um array vazio [] para o map() não quebrar
    return data.content || []; 
};