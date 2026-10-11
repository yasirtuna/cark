import { createLeague } from '../createLeague';

export const superLig = createLeague({
  id: 'tr-superlig',
  name: 'Süper Lig',
  country: 'Türkiye',
  type: 'CLUB',
  teams: [
    'Alanyaspor',
    'Amedspor',
    'Beşiktaş',
    'Çorum FK',
    'Eyüpspor',
    'Fenerbahçe',
    'Galatasaray',
    'Gaziantep FK',
    'Gençlerbirliği',
    'Göztepe',
    'İstanbul Başakşehir',
    'Kasımpaşa',
    'Kocaelispor',
    'Konyaspor',
    'Çaykur Rizespor',
    'Samsunspor',
    'Trabzonspor',
    'Erzurumspor FK',
  ],
});