export const spoonDataMapping: { [category: string]: { [key: string]: string } } = {
  dishTypes: {
    starter: 'Vorspeise',
    antipasti: 'Vorspeise',
    antipasto: 'Vorspeise',
    appetizer: 'Vorspeise',
    'side dish': 'Vorspeise',
    'hor d\'oezvre': 'Vorspeise',

    soup: 'Hauptgang',
    lunch: 'Hauptgang',
    Haupt: 'Hauptgang',
    'main course': 'Hauptgang',
    'main dish': 'Hauptgang',
    dinner: 'Hauptgang',

    dessert: 'Nachtisch',

    'Frühstück': 'Snack',
    brunch: 'Snack',
    breakfast: 'Snack',
    morning: 'Snack',
    'morning meal': 'Snack',
    snack: 'Snack',
    dip: 'Snack',
    sauce: 'Snack',
    spread: 'Snack',
    condiment: 'Snack'
  },
  cuisines: {
    Chinese: 'chinesisch',
    German: 'deutsch',
    Indian: 'indisch',
    Italian: 'italienisch',
    Japanese: 'japanisch',
    Korean: 'koreanisch',
    Mexican: 'mexikanisch',
  },
  'food lifestyles': {
    carnivorous: 'fleischhaltig',
    pescatarian: 'fischhaltig',
    vegan: 'vegan',
    vegetarian: 'vegetarisch',
  },
};
