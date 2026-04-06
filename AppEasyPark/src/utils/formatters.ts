import { NominatimAddress } from '../types/models';

export const formatNominatimAddress = (addr: NominatimAddress): { line1: string, line2: string } => {
    const road = addr.road || '';
    const number = addr.house_number || '';
    const suburb = addr.suburb || '';
    const city = addr.county || addr.city || '';
    const postcode = addr.postcode || '';

    let line1 = road;
    if (number) line1 += `, ${number}`;
    if (suburb) line1 += ` - ${suburb}`;

    let line2 = city;
    if (addr.state === 'São Paulo' && city !== 'São Paulo') line2 += ', SP';
    if (postcode) line2 += ` - ${postcode}`;

    const line1Clean = line1.trim().replace(/, $/, '');
    const line2Clean = line2.trim().replace(/, $/, '').replace(/^- /, '');

    if (!line1Clean && line2Clean) {
        return { line1: line2Clean, line2: '' };
    }
    return { line1: line1Clean, line2: line2Clean };
};

/**
 * Formata um número de segundos para o padrão MM:SS (ex: 300 -> "5:00")
 */
export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Adiciona um '0' à esquerda se os segundos forem menores que 10
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    
    return `${minutes}:${formattedSeconds}`;
};