import { useQuery } from '@tanstack/react-query';
import { fetchEstacionamentos, EstacionamentoAPI } from '../estacionamentos';

export const useEstacionamentos = () => {
    return useQuery<EstacionamentoAPI[], Error>({

        queryKey: ['estacionamentos_lista'], 
        
        // A função que ele deve executar para buscar os dados
        queryFn: fetchEstacionamentos,
        
        // Tempo antes de tentar buscar de novo
        staleTime: 1000 * 60, 
    });
};