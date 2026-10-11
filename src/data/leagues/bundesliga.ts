import { createLeague } from '../createLeague';

export const bundesliga = createLeague({
  id: 'de-bundesliga',
  name: 'Bundesliga',
  country: 'Almanya',
  type: 'CLUB',
  teams: [
    '1. FC Köln',
    'FC Augsburg',
    'Union Berlin',
    'Bayer Leverkusen',
    'Bayern Munich',
    'Borussia Dortmund',
    'Borussia Mönchengladbach',
    'Eintracht Frankfurt',
    'SV Elversberg',
    'SC Freiburg',
    'Hamburger SV',
    'TSG Hoffenheim',
    'RB Leipzig',
    'Mainz 05',
    'SC Paderborn',
    'Schalke 04',
    'VfB Stuttgart',
    'Werder Bremen',
  ],
});