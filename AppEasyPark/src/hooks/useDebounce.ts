import { useState, useEffect } from 'react';

/**
 * Hook para atrasar a atualização de um valor (ideal para buscas em APIs).
 * @param value O valor original (ex: texto do input)
 * @param delay O tempo de atraso em milissegundos
 * @returns O valor atrasado
 */

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Configura um timer para atualizar o valor após o delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Limpa o timer se o valor mudar antes do delay terminar
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}