import { createLeague } from '../createLeague';

export const primeiraLiga = createLeague({
  id: 'pt-primeira',
  name: 'Primeira Liga',
  country: 'Portekiz',
  type: 'CLUB',
  teams: [
    'Académico de Viseu',
    'FC Alverca',
    'Arouca',
    'Benfica',
    'Braga',
    'Casa Pia',
    'Estoril Praia',
    'Estrela da Amadora',
    'Famalicão',
    'Gil Vicente',
    'Marítimo',
    'Moreirense',
    'Nacional',
    'Porto',
    'Rio Ave',
    'Santa Clara',
    'Sporting CP',
    'Vitória de Guimarães',
  ],
});