export const reverseSpoonDataMapping: { [category: string]: { [key: string]: string[] } } = {
  dishTypes: {
    'Vorspeise': ['starter', 'antipasti', 'antipasto', 'appetizer', 'side dish', 'hor d\'oezvre'],
    'Hauptgang': ['main course', 'lunch', 'dinner', 'main dish', 'soup', 'Haupt' ],
    'Nachtisch': ['dessert', 'morning'],
    'Snack': ['Frühstück', 'brunch', 'breakfast', 'morning', 'morning meal', 'snack', 'dip', 'sauce', 'spread', 'condiment'],
  },
  cuisines: {
    'chinesisch': ['Chinese'],
    'deutsch': ['German'],
    'indisch': ['Indian'],
    'italienisch': ['Italian'],
    'japanisch': ['Japanese'],
    'koreanisch': ['Korean'],
    'mexikanisch': ['Mexican']
  },
  diets:{
    'fleischhaltig':['carnivorous'],
    'fischhaltig':['pescatarian'],
    'vegan':['vegan'],
    'vegetarisch':['vegetarian']
  }
};



