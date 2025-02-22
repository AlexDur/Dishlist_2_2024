export const reverseSpoonDataMapping: { [category: string]: { [key: string]: string[] } } = {
  dishTypes: {
    'Vorspeise': ['starter', 'antipasti', 'antipasto', 'appetizer', 'side dish', 'hor d\'oezvre'],
    'Hauptgang': ['main course', 'lunch', 'dinner', 'main dish', 'soup', 'Haupt' ],
    'Nachtisch': ['dessert', 'morning'],
    'Snack': ['Frühstück', 'brunch', 'breakfast', 'morning', 'morning meal', 'snack', 'dip', 'sauce', 'spread', 'condiment'],
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
