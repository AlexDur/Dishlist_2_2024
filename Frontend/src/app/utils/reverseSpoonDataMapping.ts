export const reverseSpoonDataMapping: { [category: string]: { [key: string]: string[] } } = {
  dishTypes: {
    'Hauptgang': ['main course', 'lunch', 'dinner', 'main dish', 'soup'],
    'Vorspeise': ['starter', 'antipasti', 'antipasto', 'snack', 'hor d\'oezvre'],
    'Nachtisch': ['dessert', 'breakfast', 'morning', 'Frühstück']
  },
  cuisines: {
    'Chinesisch': ['Chinese'],
    'Deutsch': ['German'],
    'Indisch': ['Indian'],
    'Italienisch': ['Italian'],
    'Japanisch': ['Japanese'],
    'Koreanisch': ['Korean'],
    'Mexikanisch': ['Mexican']
  }
};
