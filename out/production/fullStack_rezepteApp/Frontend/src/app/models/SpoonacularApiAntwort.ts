export interface SpoonacularApiAntwort {
  id: number;
  title: string;
  image: string;
  sourceUrl: string;
  dishTypes: string[];
  cuisines: string[];
  foodLifestyles: string;
  diets: string[];

}

export interface SpoonacularApiAntwortGesamt {
  results: SpoonacularApiAntwort[];
  offset: number;
  number: number;
  totalResults: number;
}
