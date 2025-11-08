// Interface de definição das cores do tema
export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  card: string;
  muted: string;
  border: string;
}

// Tipo para os nomes dos temas disponíveis
export type ThemeName = 'light' | 'dark';

// Definição das cores para cada tema
export const colors = {
  light: {
    background: '#FFFFFF',
    text: '#121212',
    primary: '#03BB85',
    card: '#F5F5F5', 
    muted: '#555',
    border: '#e5e5e5'
  },
  dark: {
    background: '#121212',
    text: '#FFFFFF',
    primary: '#03BB85',
    card: '#1E1E1E',
    muted: '#A9A9A9',
    border: '#333'
  },
};