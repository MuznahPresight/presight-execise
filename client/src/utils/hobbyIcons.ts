export const hobbyIcons: Record<string, string> = {
  reading: '📚',
  gaming: '🎮',
  sports: '⚽',
  cooking: '👨‍🍳',
  music: '🎵',
  art: '🎨',
  dancing: '💃',
  painting: '🖼️',
  drawing: '✏️',
  swimming: '🏊',
  hiking: '🥾',
  cycling: '🚴',
  photography: '📷',
  writing: '✍️',
  yoga: '🧘',
  meditation: '🧘‍♀️',
  gardening: '🌱',
  knitting: '🧶',
  modeling: '👗',
  skiing: '⛷️',
  surfing: '🏄',
  running: '🏃',
  walking: '🚶',
  travel: '✈️',
  movies: '🎬',
  theater: '🎭',
  comedy: '🤣',
};

export function getHobbyIcon(hobby: string): string {
  return hobbyIcons[hobby.toLowerCase()] || '⭐';
}
