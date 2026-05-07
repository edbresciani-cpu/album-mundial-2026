import { albumCards, teams } from './albumData';

const teamCardIds = teams.map((team) => ({
  ...team,
  cardIds: albumCards.filter((card) => card.code === team.code).map((card) => card.id),
  starterIds: albumCards.filter((card) => card.code === team.code && card.role === 'player' && card.isStarter).map((card) => card.id),
}));

export const achievementDefinitions = [
  {
    id: 'first_sticker',
    title: 'Primera figurita',
    description: 'Conseguiste tu primera figurita del album.',
    icon: 'spark',
    getProgress: ({ unique }) => ({ current: Math.min(unique, 1), target: 1 }),
  },
  {
    id: 'five_packs',
    title: 'Cinco sobres',
    description: 'Abriste 5 sobres en total.',
    icon: 'packs',
    getProgress: ({ totalPacksOpened }) => ({ current: Math.min(totalPacksOpened, 5), target: 5 }),
  },
  {
    id: 'ten_repeats',
    title: 'Mercado activo',
    description: 'Acumulaste 10 figuritas repetidas.',
    icon: 'repeat',
    getProgress: ({ repeated }) => ({ current: Math.min(repeated, 10), target: 10 }),
  },
  {
    id: 'three_coaches',
    title: 'Banca tecnica',
    description: 'Coleccionaste 3 directores tecnicos.',
    icon: 'crown',
    getProgress: ({ ownedMap }) => {
      const coaches = albumCards.filter((card) => card.role === 'coach' && (ownedMap[card.id] || 0) > 0).length;
      return { current: Math.min(coaches, 3), target: 3 };
    },
  },
  {
    id: 'argentina_full_team',
    title: 'Argentina completa',
    description: 'Completaste las 27 figuritas de Argentina.',
    icon: 'team',
    getProgress: ({ ownedMap }) => getCollectionProgress(ownedMap, 'ARG'),
  },
  {
    id: 'starter_xi',
    title: 'Once ideal',
    description: 'Completaste los 11 titulares de una seleccion.',
    icon: 'shield',
    getProgress: ({ ownedMap }) => {
      const counts = teamCardIds.map((team) =>
        team.starterIds.reduce((sum, id) => sum + ((ownedMap[id] || 0) > 0 ? 1 : 0), 0)
      );
      const best = Math.max(...counts, 0);
      return { current: Math.min(best, 11), target: 11 };
    },
  },
];

function getCollectionProgress(ownedMap, teamCode) {
  const team = teamCardIds.find((entry) => entry.code === teamCode);
  const current = team.cardIds.reduce((sum, id) => sum + ((ownedMap[id] || 0) > 0 ? 1 : 0), 0);
  return { current: Math.min(current, team.cardIds.length), target: team.cardIds.length };
}

export function computeAchievementProgress(progress) {
  const unique = Object.values(progress.owned || {}).filter((count) => count > 0).length;
  const repeated = Object.values(progress.owned || {}).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  const base = {
    unique,
    repeated,
    totalPacksOpened: progress.totalPacksOpened || 0,
    ownedMap: progress.owned || {},
  };

  return achievementDefinitions.map((achievement) => {
    const { current, target } = achievement.getProgress(base);
    return {
      ...achievement,
      current,
      target,
      completed: current >= target,
      completion: Math.round((current / target) * 100),
    };
  });
}
